import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const fixturePath = "packages/api-contracts/fixtures/gate0-smoke.json";
const outPath = ".thai-meet/gate1/seed-parity.json";
const args = process.argv.slice(2);
const shouldWrite = args.includes("--write");
const shouldJson = args.includes("--json") || shouldWrite;
const requestedField = parseFieldArg(args);

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-seed-parity.mjs [--json] [--write] [--field <name>]");
  console.log("Fields: status, fixturePath, planPath, counts, safeHash, rawProviderValuesStored");
  process.exit(0);
}

const fixture = JSON.parse(await readFile(path.join(root, fixturePath), "utf8"));
const participantSnapshot = fixture.chatRoom?.participantSnapshot ?? [];
const contactStates = fixture.contactCardStates ?? [];
const safetyEvents = fixture.safetyEvents ?? [];
const plan = {
  status: "planned",
  fixturePath,
  planPath: outPath,
  counts: {
    users: uniqueCount(participantSnapshot.map((entry) => entry.userId)),
    publicIdentities: uniqueCount(participantSnapshot.map((entry) => entry.publicIdentityId)),
    externalContacts: 1,
    chatRooms: fixture.chatRoom?.id ? 1 : 0,
    chatRoomParticipants: participantSnapshot.length,
    chatMessages: fixture.chatMessages?.length ?? 0,
    contactExchanges: uniqueCount([
      fixture.contactExchange?.id,
      ...contactStates.map((entry) => entry.contactExchange?.id)
    ]),
    reports: safetyEvents.filter((event) => event.type === "report").length,
    blocks: safetyEvents.filter((event) => event.type === "block").length,
    rewardLedgerEntries: fixture.rewardLedger?.length ?? 0
  },
  safeIds: {
    localUserId: fixture.mockUser?.userId,
    localPublicIdentityId: fixture.mockUser?.publicIdentityId,
    discoverPublicIdentityId: fixture.discoverProfile?.publicIdentityId,
    chatRoomId: fixture.chatRoom?.id,
    contactExchangeId: fixture.contactExchange?.id
  },
  safeHash: hashSafeFixture(fixture),
  rawProviderValuesStored: false,
  rawProviderValuePolicy: "store encryptedValue/valueFingerprint only; never seed raw LINE/Facebook values"
};

if (requestedField) {
  const value = getField(plan, requestedField);
  if (value === undefined) {
    console.error(`TM_GATE1_SEED_PARITY_UNKNOWN_FIELD: ${requestedField}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (shouldWrite) {
  await mkdir(path.join(root, ".thai-meet/gate1"), { recursive: true });
  await writeFile(path.join(root, outPath), `${JSON.stringify(plan, null, 2)}\n`);
}

if (shouldJson) {
  console.log(JSON.stringify(plan, null, 2));
} else {
  console.log(`Gate 1 seed parity plan OK: users=${plan.counts.users}, publicIdentities=${plan.counts.publicIdentities}, contactExchanges=${plan.counts.contactExchanges}`);
}

function uniqueCount(values) {
  return new Set(values.filter(Boolean)).size;
}

function hashSafeFixture(fixtureValue) {
  const safe = {
    trustLoop: fixtureValue.trustLoop,
    mockUser: fixtureValue.mockUser,
    discoverProfile: fixtureValue.discoverProfile,
    chatRoom: fixtureValue.chatRoom,
    chatMessages: fixtureValue.chatMessages?.map(({ id, roomId, senderPublicIdentityId, contactExchangeId }) => ({ id, roomId, senderPublicIdentityId, contactExchangeId })),
    contactExchange: fixtureValue.contactExchange,
    safetyEvents: fixtureValue.safetyEvents,
    rewardLedger: fixtureValue.rewardLedger
  };
  return createHash("sha256").update(JSON.stringify(safe)).digest("hex");
}

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) {
    const value = equalsArg.slice("--field=".length);
    if (!value) {
      console.error("TM_GATE1_SEED_PARITY_FIELD_REQUIRED");
      process.exit(1);
    }
    return value;
  }
  const index = argv.indexOf("--field");
  if (index === -1) return null;

  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    console.error("TM_GATE1_SEED_PARITY_FIELD_REQUIRED");
    process.exit(1);
  }
  return value;
}

function validateArgs(argv) {
  const known = new Set(["--json", "--write", "--field", "--help"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && argv[index - 1] === "--field") continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_SEED_PARITY_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function getField(object, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => value?.[key], object);
}
