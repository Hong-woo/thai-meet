import { readFile } from "node:fs/promises";
import path from "node:path";
import { createGate0FixtureStore } from "../apps/api/src/gate0-fixture-store.mjs";
import { createGate1DatabaseStore } from "../apps/api/src/gate1-database-store.mjs";
import { createGate0Service } from "../apps/api/src/gate0-service.mjs";

const root = process.cwd();
const failures = [];
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));
const fixtureService = createGate0Service(createGate0FixtureStore(root));
const databaseService = createGate0Service(createGate1DatabaseStore(root, { client: createFixtureBackedPrismaClient(fixture) }));

await assertDeepEqual(
  await databaseService.getMyPublicIdentity(),
  await fixtureService.getMyPublicIdentity(),
  "database mode public identity read must match fixture mode"
);

await assertDeepEqual(
  await databaseService.listDiscoverProfiles(),
  await fixtureService.listDiscoverProfiles(),
  "database mode discover profile read must match fixture mode"
);

await assertDeepEqual(
  await databaseService.getChatRoom(fixture.chatRoom.id),
  await fixtureService.getChatRoom(fixture.chatRoom.id),
  "database mode chat room read must match fixture mode"
);

for (const state of fixture.contactCardStates.map((entry) => entry.state)) {
  await assertDeepEqual(
    await databaseService.createLineContactExchange(fixture.chatRoom.id, null, state),
    await fixtureService.createLineContactExchange(fixture.chatRoom.id, null, state),
    `database mode contact exchange state ${state} must match fixture mode`
  );
}

await assertDeepEqual(
  await databaseService.createSafetyReport(),
  await fixtureService.createSafetyReport(),
  "database mode report read must match fixture mode"
);

await assertDeepEqual(
  await databaseService.createSafetyBlock(),
  await fixtureService.createSafetyBlock(),
  "database mode block read must match fixture mode"
);

const parityPayload = JSON.stringify([
  await databaseService.getMyPublicIdentity(),
  await databaseService.listDiscoverProfiles(),
  await databaseService.getChatRoom(fixture.chatRoom.id),
  await databaseService.createLineContactExchange(fixture.chatRoom.id, null, "available"),
  await databaseService.createSafetyReport(),
  await databaseService.createSafetyBlock()
]);
for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
  if (parityPayload.includes(forbidden)) {
    failures.push(`database read parity must not expose raw provider value ${forbidden}`);
  }
}

if (failures.length > 0) {
  console.error("TM_GATE1_READ_PARITY_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 read parity OK");

function createFixtureBackedPrismaClient(source) {
  const local = source.mockUser;
  const discover = source.discoverProfile;
  const participants = source.chatRoom.participantSnapshot;
  const publicIdentities = participants.map((entry) => ({
    id: entry.publicIdentityId,
    userId: entry.userId,
    publicId: entry.publicId,
    displayName: entry.displayName,
    age: entry.publicIdentityId === discover.publicIdentityId ? discover.age : undefined,
    city: entry.city,
    status: "ACTIVE"
  }));
  const users = publicIdentities.map((identity) => ({
    id: identity.userId,
    activePublicIdentityId: identity.id,
    publicIdentities: [identity]
  }));
  const exchanges = source.contactCardStates.map((entry) => toContactExchangeRow(entry.contactExchange));
  const room = {
    id: source.chatRoom.id,
    participants: participants.map((entry) => ({
      roomId: source.chatRoom.id,
      userId: entry.userId,
      publicIdentityIdAtCreation: entry.publicIdentityId,
      publicIdentity: publicIdentities.find((identity) => identity.id === entry.publicIdentityId)
    })),
    messages: source.chatMessages.map((message) => ({
      ...message,
      kind: message.contactExchangeId ? "CONTACT_CARD" : "TEXT"
    })),
    exchanges
  };
  const reports = source.safetyEvents
    .filter((event) => event.type === "report")
    .map((event) => ({
      id: event.id,
      targetType: event.targetType,
      targetId: event.targetId,
      reporterUserId: local.userId,
      reportedUserId: discover.userId,
      reportedPublicIdentityId: discover.publicIdentityId
    }));
  const blocks = source.safetyEvents
    .filter((event) => event.type === "block")
    .map((event) => ({
      id: event.id,
      blockerUserId: local.userId,
      blockedUserId: discover.userId,
      visiblePublicIdentityId: event.targetId
    }));

  return {
    user: {
      async findFirst() {
        return users[0];
      }
    },
    publicIdentity: {
      async findMany() {
        return publicIdentities;
      }
    },
    externalContact: {
      async findFirst() {
        return {
          id: "contact_gate1_line_safe_001",
          userId: users[1].id,
          publicIdentityId: publicIdentities[1].id,
          provider: "LINE"
        };
      }
    },
    chatRoom: {
      async findFirst() {
        return room;
      }
    },
    contactExchange: {
      async upsert({ create }) {
        return create;
      }
    },
    chatMessage: {
      async upsert({ create }) {
        return create;
      }
    },
    report: {
      async findMany() {
        return reports;
      },
      async upsert({ create }) {
        return create;
      }
    },
    block: {
      async findMany() {
        return blocks;
      },
      async upsert({ create }) {
        return create;
      }
    },
    rewardLedger: {
      async findMany() {
        return source.rewardLedger ?? [];
      }
    }
  };
}

function toContactExchangeRow(exchange) {
  return {
    id: exchange.id,
    provider: exchange.provider,
    status: exchange.status.toUpperCase(),
    roomId: exchange.roomId,
    requestedByPublicIdentityId: exchange.requestedByPublicIdentityId,
    targetPublicIdentityId: exchange.targetPublicIdentityId,
    permissionScope: exchange.permission.scope,
    canViewContactCard: exchange.permission.canViewContactCard,
    canCopyRawValue: exchange.permission.canCopyRawValue,
    canReport: exchange.permission.canReport,
    canBlock: exchange.permission.canBlock
  };
}

async function assertDeepEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    failures.push(`${message}\nExpected: ${expectedJson}\nActual: ${actualJson}`);
  }
}
