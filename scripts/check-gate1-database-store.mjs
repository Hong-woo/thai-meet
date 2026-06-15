import { readFile } from "node:fs/promises";
import path from "node:path";
import { createGate1DatabaseStore } from "../apps/api/src/gate1-database-store.mjs";
import { createGate0Service } from "../apps/api/src/gate0-service.mjs";

const root = process.cwd();
const failures = [];
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));
const client = createFixtureBackedPrismaClient(fixture);
const store = createGate1DatabaseStore(root, { client });
const service = createGate0Service(store);

const openApi = await store.readOpenApi();
assertEqual(openApi.openapi, "3.0.3", "database store should keep OpenAPI file-backed");

const databaseFixture = await store.readFixture();
assertEqual(databaseFixture.mockUser.publicId, fixture.mockUser.publicId, "database store should map active public identity");
assertEqual(databaseFixture.discoverProfile.publicIdentityId, fixture.discoverProfile.publicIdentityId, "database store should map discover profile");
assertEqual(databaseFixture.chatRoom.id, fixture.chatRoom.id, "database store should map chat room");
assertEqual(databaseFixture.chatMessages.length, fixture.chatMessages.length, "database store should map chat messages");
assertEqual(databaseFixture.contactExchange.status, fixture.contactExchange.status, "database store should map default contact exchange status");
assertEqual(databaseFixture.contactCard.copyRawValue, false, "database store should keep raw contact copy disabled");
assertEqual(databaseFixture.contactCardStates.length, fixture.contactCardStates.length, "database store should map contact exchange lifecycle states");
assertEqual(databaseFixture.safetyEvents.length, fixture.safetyEvents.length, "database store should map report and block events");

const publicIdentity = await service.getMyPublicIdentity();
assertEqual(publicIdentity.publicId, fixture.mockUser.publicId, "service should read public identity from database store fixture shape");

const discover = await service.listDiscoverProfiles();
assertEqual(discover.profiles[0].displayName, fixture.discoverProfile.displayName, "service should read discover profiles from database store fixture shape");

const room = await service.getChatRoom(fixture.chatRoom.id);
assertEqual(room.messages[0].id, fixture.chatMessages[0].id, "service should read chat room messages from database store fixture shape");

const lineExchange = await service.createLineContactExchange(fixture.chatRoom.id, null, "available");
assertEqual(lineExchange.status, 201, "service should create LINE contact exchange from database store fixture shape");
assertEqual(lineExchange.payload.contactExchange.id, fixture.contactExchange.id, "service should return available contact exchange from database store");

for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
  if (JSON.stringify(databaseFixture).includes(forbidden)) {
    failures.push(`database store fixture shape must not expose raw provider value ${forbidden}`);
  }
}

await assertRejects(
  () => createGate1DatabaseStore(root, { client: {} }).readFixture(),
  "TM_GATE1_DATABASE_CLIENT_INVALID",
  "database store should fail closed when required Prisma delegates are missing"
);

if (failures.length > 0) {
  console.error("TM_GATE1_DATABASE_STORE_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 database store parity OK");

function createFixtureBackedPrismaClient(source) {
  const local = source.mockUser;
  const discover = source.discoverProfile;
  const participants = source.chatRoom.participantSnapshot;
  const publicIdentities = [
    {
      id: local.publicIdentityId,
      userId: local.userId,
      publicId: local.publicId,
      displayName: local.displayName,
      city: local.city,
      status: "ACTIVE"
    },
    {
      id: discover.publicIdentityId,
      userId: participants.find((entry) => entry.publicIdentityId === discover.publicIdentityId)?.userId,
      publicId: participants.find((entry) => entry.publicIdentityId === discover.publicIdentityId)?.publicId,
      displayName: discover.displayName,
      age: discover.age,
      city: discover.city,
      status: "ACTIVE"
    }
  ];
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
      reportedPublicIdentityId: event.targetId,
      reporter: users[0],
      reported: users[1],
      reportedPublicIdentity: publicIdentities[1]
    }));
  const blocks = source.safetyEvents
    .filter((event) => event.type === "block")
    .map((event) => ({
      id: event.id,
      blockerUserId: local.userId,
      blockedUserId: users[1].id,
      visiblePublicIdentityId: event.targetId,
      blocker: users[0],
      blocked: users[1]
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

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    failures.push(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

async function assertRejects(fn, expectedCode, message) {
  try {
    await fn();
    failures.push(message);
  } catch (error) {
    if (!String(error.message).includes(expectedCode)) {
      failures.push(`${message}: expected ${expectedCode}, got ${error.message}`);
    }
  }
}
