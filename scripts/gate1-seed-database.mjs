import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const fixturePath = "packages/api-contracts/fixtures/gate0-smoke.json";
const args = process.argv.slice(2);
const shouldDryRun = args.includes("--dry-run");
const shouldJson = args.includes("--json") || shouldDryRun;
const requestedField = parseFieldArg(args);

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-seed-database.mjs [--dry-run] [--json] [--field <name>]");
  console.log("Fields: status, fixturePath, counts, operationOrder, rawProviderValuesStored");
  process.exit(0);
}

const fixture = JSON.parse(await readFile(path.join(root, fixturePath), "utf8"));
const seed = buildSeedPlan(fixture);
const summary = {
  status: shouldDryRun ? "dry_run" : "ready",
  fixturePath,
  counts: seed.counts,
  operationOrder: seed.operationOrder,
  rawProviderValuesStored: false,
  rawProviderValuePolicy: "seed encryptedValue/valueFingerprint placeholders only; never seed raw LINE/Facebook values"
};

if (requestedField) {
  const value = getField(summary, requestedField);
  if (value === undefined) {
    console.error(`TM_GATE1_DATABASE_SEED_UNKNOWN_FIELD: ${requestedField}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (shouldDryRun) {
  printSummary(summary);
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  fail("TM_GATE1_DATABASE_URL_REQUIRED", "DATABASE_URL is required before seeding Gate 1 persisted fixtures.");
}

const client = await loadPrismaClient();
try {
  await seedDatabase(client, seed);
} finally {
  await client.$disconnect?.();
}

summary.status = "seeded";
printSummary(summary);

function buildSeedPlan(source) {
  const participants = source.chatRoom?.participantSnapshot ?? [];
  const publicIdentities = participants.map((entry) => ({
    id: entry.publicIdentityId,
    userId: entry.userId,
    publicId: entry.publicId,
    displayName: entry.displayName,
    age: entry.publicIdentityId === source.discoverProfile?.publicIdentityId ? source.discoverProfile.age : null,
    city: entry.city,
    status: "ACTIVE"
  }));
  const users = participants.map((entry) => ({
    id: entry.userId,
    activePublicIdentityId: entry.publicIdentityId,
    status: "active"
  }));
  const localUserId = source.mockUser?.userId;
  const targetPublicIdentityId = source.discoverProfile?.publicIdentityId;
  const targetUserId = participants.find((entry) => entry.publicIdentityId === targetPublicIdentityId)?.userId;
  const contactId = "contact_gate1_line_safe_001";
  const contactExchanges = (source.contactCardStates ?? []).map((entry) => {
    const exchange = entry.contactExchange;
    return {
      id: exchange.id,
      roomId: exchange.roomId,
      senderUserId: participantUserId(participants, exchange.requestedByPublicIdentityId),
      receiverUserId: participantUserId(participants, exchange.targetPublicIdentityId),
      requestedByPublicIdentityId: exchange.requestedByPublicIdentityId,
      targetPublicIdentityId: exchange.targetPublicIdentityId,
      contactId,
      provider: exchange.provider,
      status: exchange.status.toUpperCase(),
      permissionScope: exchange.permission.scope,
      canViewContactCard: exchange.permission.canViewContactCard,
      canCopyRawValue: false,
      canReport: exchange.permission.canReport,
      canBlock: exchange.permission.canBlock
    };
  });
  const reports = (source.safetyEvents ?? [])
    .filter((event) => event.type === "report")
    .map((event) => ({
      id: event.id,
      reporterUserId: localUserId,
      reportedUserId: targetUserId,
      reportedPublicIdentityId: targetPublicIdentityId,
      targetType: event.targetType,
      targetId: event.targetId,
      reason: "gate1_seed_report"
    }));
  const blocks = (source.safetyEvents ?? [])
    .filter((event) => event.type === "block")
    .map((event) => ({
      id: event.id,
      blockerUserId: localUserId,
      blockedUserId: targetUserId,
      visiblePublicIdentityId: event.targetId
    }));
  const rewardLedger = (source.rewardLedger ?? []).map((entry) => ({
    ...entry,
    type: String(entry.type).toUpperCase()
  }));

  return {
    users,
    publicIdentities,
    externalContacts: [
      {
        id: contactId,
        userId: targetUserId,
        publicIdentityId: targetPublicIdentityId,
        provider: "LINE",
        label: "LINE contact",
        encryptedValue: "gate1_seed_encrypted_line_contact_placeholder",
        valueFingerprint: "gate1_seed_line_contact_fingerprint",
        isActive: true
      }
    ],
    chatRooms: [{ id: source.chatRoom.id }],
    chatRoomParticipants: participants.map((entry) => ({
      id: `crp_${source.chatRoom.id}_${entry.userId}`,
      roomId: source.chatRoom.id,
      userId: entry.userId,
      publicIdentityIdAtCreation: entry.publicIdentityId
    })),
    chatMessages: (source.chatMessages ?? []).map((message) => ({
      id: message.id,
      roomId: message.roomId,
      senderUserId: participantUserId(participants, message.senderPublicIdentityId),
      senderPublicIdentityId: message.senderPublicIdentityId,
      kind: message.contactExchangeId ? "CONTACT_CARD" : "TEXT",
      body: message.body,
      contactExchangeId: message.contactExchangeId ?? null,
      createdAt: message.createdAt ? new Date(message.createdAt) : undefined
    })),
    contactExchanges,
    reports,
    blocks,
    rewardLedger,
    counts: {
      users: users.length,
      publicIdentities: publicIdentities.length,
      externalContacts: 1,
      chatRooms: 1,
      chatRoomParticipants: participants.length,
      chatMessages: source.chatMessages?.length ?? 0,
      contactExchanges: contactExchanges.length,
      reports: reports.length,
      blocks: blocks.length,
      rewardLedgerEntries: rewardLedger.length
    },
    operationOrder: [
      "user.upsert",
      "publicIdentity.upsert",
      "externalContact.upsert",
      "chatRoom.upsert",
      "chatRoomParticipant.upsert",
      "contactExchange.upsert",
      "chatMessage.upsert",
      "report.upsert",
      "block.upsert",
      "rewardLedger.upsert"
    ]
  };
}

async function seedDatabase(client, seed) {
  await client.$transaction(async (tx) => {
    for (const user of seed.users) {
      await tx.user.upsert({ where: { id: user.id }, update: user, create: user });
    }
    for (const identity of seed.publicIdentities) {
      await tx.publicIdentity.upsert({ where: { id: identity.id }, update: identity, create: identity });
    }
    for (const contact of seed.externalContacts) {
      await tx.externalContact.upsert({ where: { id: contact.id }, update: contact, create: contact });
    }
    for (const room of seed.chatRooms) {
      await tx.chatRoom.upsert({ where: { id: room.id }, update: room, create: room });
    }
    for (const participant of seed.chatRoomParticipants) {
      await tx.chatRoomParticipant.upsert({ where: { id: participant.id }, update: participant, create: participant });
    }
    for (const exchange of seed.contactExchanges) {
      await tx.contactExchange.upsert({ where: { id: exchange.id }, update: exchange, create: exchange });
    }
    for (const message of seed.chatMessages) {
      await tx.chatMessage.upsert({ where: { id: message.id }, update: message, create: message });
    }
    for (const report of seed.reports) {
      await tx.report.upsert({ where: { id: report.id }, update: report, create: report });
    }
    for (const block of seed.blocks) {
      await tx.block.upsert({ where: { id: block.id }, update: block, create: block });
    }
    for (const entry of seed.rewardLedger) {
      await tx.rewardLedger.upsert({ where: { id: entry.id }, update: entry, create: entry });
    }
  });
}

async function loadPrismaClient() {
  try {
    const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
      import("@prisma/client"),
      import("@prisma/adapter-pg")
    ]);
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    return new PrismaClient({ adapter });
  } catch (error) {
    fail("TM_GATE1_PRISMA_CLIENT_UNAVAILABLE", `could not load Prisma PostgreSQL adapter client: ${error.message}`);
  }
}

function participantUserId(participants, publicIdentityId) {
  return participants.find((entry) => entry.publicIdentityId === publicIdentityId)?.userId;
}

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) return equalsArg.slice("--field=".length);
  const index = argv.indexOf("--field");
  if (index === -1) return null;

  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    console.error("TM_GATE1_DATABASE_SEED_FIELD_REQUIRED");
    process.exit(1);
  }
  return value;
}

function validateArgs(argv) {
  const known = new Set(["--dry-run", "--json", "--field", "--help"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && argv[index - 1] === "--field") continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_DATABASE_SEED_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function getField(object, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => value?.[key], object);
}

function printSummary(summary) {
  if (shouldJson) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Gate 1 database seed ${summary.status}: users=${summary.counts.users}, contactExchanges=${summary.counts.contactExchanges}`);
  }
}

function fail(code, message) {
  console.error(code);
  console.error(`message=${message}`);
  console.error("doc=docs/dev/GATE1_PERSISTENCE.md");
  process.exit(1);
}
