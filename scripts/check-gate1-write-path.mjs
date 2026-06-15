import { readFile } from "node:fs/promises";
import path from "node:path";
import { createGate0Service } from "../apps/api/src/gate0-service.mjs";
import { createGate1DatabaseStore } from "../apps/api/src/gate1-database-store.mjs";

const root = process.cwd();
const failures = [];
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));

const delegated = [];
const service = createGate0Service({
  async readOpenApi() {
    return {};
  },
  async readFixture() {
    return fixture;
  },
  async createLineContactExchange(roomId, state) {
    delegated.push(["createLineContactExchange", roomId, state]);
    return {
      status: 201,
      payload: {
        contactExchange: fixture.contactExchange,
        contactCard: fixture.contactCard
      }
    };
  },
  async createSafetyReport() {
    delegated.push(["createSafetyReport"]);
    return { event: fixture.safetyEvents.find((event) => event.type === "report") };
  },
  async createSafetyBlock() {
    delegated.push(["createSafetyBlock"]);
    return { event: fixture.safetyEvents.find((event) => event.type === "block") };
  }
});

await service.createLineContactExchange(fixture.chatRoom.id, null, "available");
await service.createSafetyReport();
await service.createSafetyBlock();

assertEqual(delegated.length, 3, "Gate 0 service should delegate write endpoints when store write methods exist");
assertEqual(delegated[0]?.[0], "createLineContactExchange", "service should delegate contact exchange writes");
assertEqual(delegated[0]?.[2], "available", "service should pass contact exchange state to store delegate");
assertEqual(delegated[1]?.[0], "createSafetyReport", "service should delegate report writes");
assertEqual(delegated[2]?.[0], "createSafetyBlock", "service should delegate block writes");

const writeClient = createWriteTrackingPrismaClient(fixture);
const writeStore = createGate1DatabaseStore(root, { client: writeClient.client });
if (typeof writeStore.createLineContactExchange !== "function") failures.push("database store must expose createLineContactExchange");
if (typeof writeStore.createSafetyReport !== "function") failures.push("database store must expose createSafetyReport");
if (typeof writeStore.createSafetyBlock !== "function") failures.push("database store must expose createSafetyBlock");
const lineWrite =
  typeof writeStore.createLineContactExchange === "function"
    ? await writeStore.createLineContactExchange(fixture.chatRoom.id, "available")
    : { status: null, payload: { contactExchange: {} } };
const reportWrite =
  typeof writeStore.createSafetyReport === "function"
    ? await writeStore.createSafetyReport()
    : { event: {} };
const blockWrite =
  typeof writeStore.createSafetyBlock === "function"
    ? await writeStore.createSafetyBlock()
    : { event: {} };

assertEqual(lineWrite.status, 201, "database store contact exchange write should return HTTP 201 payload");
assertEqual(lineWrite.payload.contactExchange.id, fixture.contactExchange.id, "database store contact exchange write should return fixture-compatible exchange");
assertEqual(reportWrite.event.type, "report", "database store report write should return report event");
assertEqual(blockWrite.event.type, "block", "database store block write should return block event");
assertIncludes(writeClient.operations, "contactExchange.upsert", "database store should upsert ContactExchange");
assertIncludes(writeClient.operations, "chatMessage.upsert", "database store should upsert ContactExchange chat message");
assertIncludes(writeClient.operations, "report.upsert", "database store should upsert Report");
assertIncludes(writeClient.operations, "block.upsert", "database store should upsert Block");

const writePayload = JSON.stringify([lineWrite, reportWrite, blockWrite, writeClient.operations]);
for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
  if (writePayload.includes(forbidden)) {
    failures.push(`database write path must not expose raw provider value ${forbidden}`);
  }
}

if (failures.length > 0) {
  console.error("TM_GATE1_WRITE_PATH_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 write path OK");

function createWriteTrackingPrismaClient(source) {
  const operations = [];
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
    status: "active",
    publicIdentities: [identity]
  }));
  const exchanges = source.contactCardStates.map((entry) => toContactExchangeRow(entry.contactExchange));
  const messages = source.chatMessages.map((message) => ({
    ...message,
    kind: message.contactExchangeId ? "CONTACT_CARD" : "TEXT"
  }));
  const reports = source.safetyEvents
    .filter((event) => event.type === "report")
    .map((event) => ({
      id: event.id,
      targetType: event.targetType,
      targetId: event.targetId,
      reporterUserId: local.userId,
      reportedUserId: participants.find((entry) => entry.publicIdentityId === discover.publicIdentityId)?.userId,
      reportedPublicIdentityId: discover.publicIdentityId
    }));
  const blocks = source.safetyEvents
    .filter((event) => event.type === "block")
    .map((event) => ({
      id: event.id,
      blockerUserId: local.userId,
      blockedUserId: participants.find((entry) => entry.publicIdentityId === discover.publicIdentityId)?.userId,
      visiblePublicIdentityId: event.targetId
    }));
  const room = {
    id: source.chatRoom.id,
    participants: participants.map((entry) => ({
      roomId: source.chatRoom.id,
      userId: entry.userId,
      publicIdentityIdAtCreation: entry.publicIdentityId,
      publicIdentity: publicIdentities.find((identity) => identity.id === entry.publicIdentityId)
    })),
    messages,
    exchanges
  };

  const client = {
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
          userId: participants.find((entry) => entry.publicIdentityId === discover.publicIdentityId)?.userId,
          publicIdentityId: discover.publicIdentityId,
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
        operations.push("contactExchange.upsert");
        const row = toContactExchangeRow({
          id: create.id,
          provider: create.provider,
          status: create.status.toLowerCase(),
          roomId: create.roomId,
          requestedByPublicIdentityId: create.requestedByPublicIdentityId,
          targetPublicIdentityId: create.targetPublicIdentityId,
          permission: {
            canViewContactCard: create.canViewContactCard,
            canCopyRawValue: create.canCopyRawValue,
            canReport: create.canReport,
            canBlock: create.canBlock,
            scope: create.permissionScope
          }
        });
        exchanges.push(row);
        return row;
      }
    },
    chatMessage: {
      async upsert({ create }) {
        operations.push("chatMessage.upsert");
        messages.push(create);
        return create;
      }
    },
    report: {
      async findMany() {
        return reports;
      },
      async upsert({ create }) {
        operations.push("report.upsert");
        reports.push(create);
        return create;
      }
    },
    block: {
      async findMany() {
        return blocks;
      },
      async upsert({ create }) {
        operations.push("block.upsert");
        blocks.push(create);
        return create;
      }
    },
    rewardLedger: {
      async findMany() {
        return source.rewardLedger ?? [];
      }
    },
    async $transaction(fn) {
      return await fn(client);
    }
  };

  return { client, operations };
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

function assertIncludes(values, expected, message) {
  if (!values.includes(expected)) {
    failures.push(`${message}\nExpected ${JSON.stringify(values)} to include ${expected}`);
  }
}
