import { createGate0Service } from "../apps/api/src/gate0-service.mjs";
import { createGate1DatabaseStore } from "../apps/api/src/gate1-database-store.mjs";

const args = process.argv.slice(2);
const shouldDryRun = args.includes("--dry-run");
const shouldJson = args.includes("--json") || shouldDryRun;
const requestedField = parseFieldArg(args);

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-live-smoke.mjs [--dry-run] [--json] [--field <name>]");
  console.log("Fields: status, requiredEnvKeys, commandOrder, rawSecretsPrinted, databaseUrlStatus, databaseUrlProtocol");
  process.exit(0);
}

const databaseUrlMetadata = getDatabaseUrlMetadata(process.env.DATABASE_URL);
const summary = {
  status: shouldDryRun ? "dry_run" : "ready",
  requiredEnvKeys: ["DATABASE_URL"],
  commandOrder: ["npm run db:migrate", "npm run gate1:seed:database", "npm run gate1:live-smoke"],
  databaseUrlStatus: databaseUrlMetadata.status,
  databaseUrlProtocol: databaseUrlMetadata.protocol,
  rawSecretsPrinted: false,
  secretOutputPolicy: "report protocol/status only; never echo DATABASE_URL or provider secrets",
  checks: [
    "public identity persisted read",
    "discover profile persisted read",
    "chat room persisted read",
    "contact exchange persisted read",
    "report and block persisted read"
  ]
};

if (requestedField) {
  const value = getField(summary, requestedField);
  if (value === undefined) {
    console.error(`TM_GATE1_LIVE_SMOKE_UNKNOWN_FIELD: ${requestedField}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (shouldDryRun) {
  printSummary(summary);
  process.exit(0);
}

if (databaseUrlMetadata.status === "missing") {
  fail("TM_GATE1_LIVE_DATABASE_URL_REQUIRED", "DATABASE_URL is required before running Gate 1 live DB smoke.");
}
if (databaseUrlMetadata.status === "invalid") {
  fail("TM_GATE1_LIVE_DATABASE_URL_INVALID", `DATABASE_URL must use postgresql or postgres protocol. protocol=${databaseUrlMetadata.protocol}`);
}

const client = await loadPrismaClient();
try {
  const service = createGate0Service(createGate1DatabaseStore(process.cwd(), { client }));
  const publicIdentity = await service.getMyPublicIdentity();
  const discover = await service.listDiscoverProfiles();
  const room = await service.getChatRoom("room_gate0_local");
  const exchange = await service.createLineContactExchange("room_gate0_local", null, "available");
  const report = await service.createSafetyReport();
  const block = await service.createSafetyBlock();
  const payload = { publicIdentity, discover, room, exchange, report, block };

  if (!publicIdentity?.publicId || !discover?.profiles?.[0]?.publicIdentityId || !room?.messages?.length || exchange?.status !== 201 || !report?.event || !block?.event) {
    fail("TM_GATE1_LIVE_READ_PARITY_FAILED", "Persisted Gate 1 reads did not return the expected seeded Trust Loop payload.");
  }
  for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
    if (JSON.stringify(payload).includes(forbidden)) {
      fail("TM_GATE1_LIVE_PRIVACY_LEAK", "Persisted Gate 1 reads exposed a raw provider value.");
    }
  }
} finally {
  await client.$disconnect?.();
}

summary.status = "passed";
printSummary(summary);

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

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) return equalsArg.slice("--field=".length);
  const index = argv.indexOf("--field");
  return index === -1 ? null : argv[index + 1];
}

function validateArgs(argv) {
  const known = new Set(["--dry-run", "--json", "--field", "--help"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && argv[index - 1] === "--field") continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_LIVE_SMOKE_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function getField(object, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => value?.[key], object);
}

function getDatabaseUrlMetadata(value) {
  if (!value) return { status: "missing", protocol: "none" };
  try {
    const protocol = new URL(value).protocol.replace(/:$/, "");
    if (protocol === "postgresql" || protocol === "postgres") return { status: "valid", protocol };
    return { status: "invalid", protocol: protocol || "unknown" };
  } catch {
    return { status: "invalid", protocol: "unknown" };
  }
}

function printSummary(value) {
  if (shouldJson) {
    console.log(JSON.stringify(value, null, 2));
  } else {
    console.log(`Gate 1 live smoke ${value.status}: databaseUrlStatus=${value.databaseUrlStatus}, protocol=${value.databaseUrlProtocol}`);
  }
}

function fail(code, message) {
  console.error(code);
  console.error(`message=${message}`);
  console.error("doc=docs/dev/GATE1_PERSISTENCE.md");
  process.exit(1);
}
