import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const failures = [];
const constraintsDocPath = "docs/dev/DB_CONSTRAINTS.md";
const persistenceDocPath = "docs/dev/GATE1_PERSISTENCE.md";
const reviewChecklistPath = "docs/dev/REVIEW_CHECKLIST.md";
const prismaSchemaPath = "apps/api/prisma/schema.prisma";
const prismaMigrationsPath = "apps/api/prisma/migrations";
const requiredEnvKeys = ["DATABASE_URL"];
const requiredModels = [
  "UserIdentity",
  "PublicIdentity",
  "ExternalContact",
  "ChatRoomParticipant",
  "ChatMessage",
  "ContactExchange",
  "Block",
  "Report",
  "RewardLedger",
  "AuditEvent"
];
const requiredModes = ["PERSISTENCE_MODE=fixture", "PERSISTENCE_MODE=database"];
const notScaffoldedGuard = {
  command: "npm run not-scaffolded:test",
  migrationCommand: "npm run db:migrate",
  helperCommand: "node scripts/not-scaffolded.mjs --help",
  errorCode: "TM_COMMAND_NOT_SCAFFOLDED"
};
const prismaSchemaPresent = await pathExists(prismaSchemaPath);
const prismaMigrationsPresent = await pathExists(prismaMigrationsPath);
const databaseUrlPresent = Boolean(process.env.DATABASE_URL);
const databaseUrlMetadata = getDatabaseUrlMetadata(process.env.DATABASE_URL);
const prismaScaffoldStatus = {
  schemaPresent: prismaSchemaPresent,
  migrationsPresent: prismaMigrationsPresent,
  migrationStatus: "not_scaffolded",
  summary: `schema=${prismaSchemaPresent}, migrations=${prismaMigrationsPresent}, migrationStatus=not_scaffolded`
};
const summary = {
  status: "passed",
  migrationStatus: "not_scaffolded",
  persistenceGate: "Gate 1",
  constraintsDoc: constraintsDocPath,
  persistenceDoc: persistenceDocPath,
  reviewChecklist: reviewChecklistPath,
  requiredModels,
  requiredModes,
  notScaffoldedGuard,
  prismaSchemaPath,
  prismaMigrationsPath,
  prismaSchemaPresent,
  prismaMigrationsPresent,
  prismaScaffoldStatus,
  requiredEnvKeys,
  databaseUrlPresent,
  databaseUrlStatus: databaseUrlMetadata.status,
  databaseUrlProtocol: databaseUrlMetadata.protocol
};
const shouldPrintHelp = args.includes("--help");
const shouldPrintJson = args.includes("--json");
const requestedField = parseFieldArg(args);

validateArgs(args);

if (shouldPrintHelp) {
  printHelp();
  process.exit(0);
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["db:check"] !== "node scripts/check-db-matrix.mjs") {
  failures.push("package.json must expose db:check");
}
if (packageJson.scripts?.["db:check:test"] !== "node scripts/check-db-matrix.mjs && node scripts/check-db-matrix-command.mjs") {
  failures.push("package.json must expose db:check:test");
}

await requireFile(constraintsDocPath);
await requireFile(persistenceDocPath);
await requireFile("scripts/check-db-matrix-command.mjs");

const doc = await readIfExists(constraintsDocPath);
const persistenceDoc = await readIfExists(persistenceDocPath);
const reviewChecklist = await readIfExists(reviewChecklistPath);
const requiredTerms = [
  ...requiredModels,
  "unique(provider, providerUserId)",
  "unique(publicId)",
  "unique(userId, provider) where isActive=true",
  "unique(roomId, userId, publicIdentityIdAtCreation)",
  "index(roomId, createdAt)",
  "index(senderPublicIdentityId)",
  "unique(blockerUserId, blockedUserId)",
  "unique(idempotencyKey) where idempotencyKey is not null",
  "Contact sharing must atomically create ContactExchange and ChatMessage"
];

for (const term of requiredTerms) {
  if (!doc.includes(term)) failures.push(`docs/dev/DB_CONSTRAINTS.md must include ${term}`);
}

const requiredPersistenceTerms = [
  "Gate 1 production backend persistence",
  "fixture store replacement boundary",
  "Prisma migration status",
  "ContactExchange",
  "PublicIdentity",
  "Report",
  "Block",
  "RewardLedger",
  "PERSISTENCE_MODE=fixture",
  "without a database",
  "TM_COMMAND_NOT_SCAFFOLDED",
  "rollback",
  "raw provider values"
];

for (const term of requiredPersistenceTerms) {
  if (!persistenceDoc.includes(term)) failures.push(`docs/dev/GATE1_PERSISTENCE.md must include ${term}`);
}

for (const term of ["GATE1_PERSISTENCE.md", "fixture store replacement boundary", "Prisma migration status", "rollback"]) {
  if (!reviewChecklist.includes(term)) failures.push(`docs/dev/REVIEW_CHECKLIST.md must include ${term}`);
}

if (failures.length > 0) {
  console.error("TM_DB_MATRIX_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

if (shouldPrintJson) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

if (requestedField) {
  const value = getField(summary, requestedField);
  if (value === undefined) {
    console.error(`TM_DB_MATRIX_UNKNOWN_FIELD: ${requestedField}`);
    process.exit(1);
  }

  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

console.log("Gate 0 DB constraints matrix OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}

async function readIfExists(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

async function pathExists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function printHelp() {
  console.log("Usage: npm run db:check -- [--json] [--field <name>]");
  console.log("");
  console.log("Options:");
  console.log("  --json          Print machine-readable DB matrix summary.");
  console.log("  --field <name>  Print one DB matrix summary field.");
  console.log("  --help          Print this help.");
  console.log("");
  console.log("Stable fields:");
  for (const field of Object.keys(summary)) console.log(`  ${field}`);
  console.log("  notScaffoldedGuard.command");
  console.log("  notScaffoldedGuard.migrationCommand");
  console.log("  notScaffoldedGuard.helperCommand");
  console.log("  notScaffoldedGuard.errorCode");
  console.log("  prismaScaffoldStatus.summary");
  console.log("");
  console.log("Stable error codes:");
  console.log("  TM_DB_MATRIX_UNKNOWN_OPTION");
  console.log("  TM_DB_MATRIX_OPTION_CONFLICT");
  console.log("  TM_DB_MATRIX_FIELD_REQUIRED");
  console.log("  TM_DB_MATRIX_UNKNOWN_FIELD");
}

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) {
    const field = equalsArg.slice("--field=".length);
    if (!field) {
      console.error("TM_DB_MATRIX_FIELD_REQUIRED");
      process.exit(1);
    }
    return field;
  }

  const fieldIndex = argv.indexOf("--field");
  if (fieldIndex === -1) return null;
  const field = argv[fieldIndex + 1];
  if (!field || field.startsWith("--")) {
    console.error("TM_DB_MATRIX_FIELD_REQUIRED");
    process.exit(1);
  }
  return field;
}

function validateArgs(argv) {
  const knownOptions = new Set(["--field", "--help", "--json"]);
  let fieldValueShouldFollow = false;
  let fieldCount = 0;

  for (const arg of argv) {
    if (fieldValueShouldFollow) {
      fieldValueShouldFollow = false;
      continue;
    }

    if (arg === "--field") {
      fieldCount += 1;
      fieldValueShouldFollow = true;
      continue;
    }

    if (arg.startsWith("--field=")) {
      fieldCount += 1;
      continue;
    }

    if (arg.startsWith("--") && !knownOptions.has(arg)) {
      console.error(`TM_DB_MATRIX_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }

  if (shouldPrintJson && requestedField) {
    console.error("TM_DB_MATRIX_OPTION_CONFLICT");
    process.exit(1);
  }

  if (fieldCount > 1) {
    console.error("TM_DB_MATRIX_OPTION_CONFLICT");
    process.exit(1);
  }
}

function getField(source, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => {
    if (value === null || value === undefined || typeof value !== "object") return undefined;
    return value[key];
  }, source);
}

function getDatabaseUrlMetadata(value) {
  if (!value) {
    return { status: "missing", protocol: "none" };
  }

  try {
    const protocol = new URL(value).protocol.replace(/:$/, "");
    if (protocol === "postgresql" || protocol === "postgres") {
      return { status: "valid", protocol };
    }
    return { status: "invalid", protocol: protocol || "unknown" };
  } catch {
    return { status: "invalid", protocol: "unknown" };
  }
}
