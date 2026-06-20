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
const seedParityPlanCommand = "npm run gate1:seed:plan";
const seedParityCheckCommand = "npm run gate1:seed:test";
const migrationPreflightCheckCommand = "npm run gate1:migrate:test";
const seedDatabaseCheckCommand = "npm run gate1:seed:database:test";
const readParityCheckCommand = "npm run gate1:database-store:test";
const endpointReadParityCheckCommand = "npm run gate1:read-parity:test";
const writePathCheckCommand = "npm run gate1:write-path:test";
const rollbackCheckCommand = "npm run gate1:rollback:test";
const liveSmokeCheckCommand = "npm run gate1:live-smoke:test";
const ciPostgresCheckCommand = "npm run gate1:ci-postgres:test";
const gate1EnvCheckCommand = "npm run gate1:env:test";
const gate1GithubEnvCheckCommand = "npm run gate1:github-env:test";
const gate1GithubEnvApplyCheckCommand = "npm run gate1:github-env:apply:test";
const gate1DeployRehearsalCheckCommand = "npm run gate1:deploy-rehearsal:test";
const seedParityPlanPath = ".thai-meet/gate1/seed-parity.json";
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
const databaseReadParityPresent = prismaSchemaPresent
  && prismaMigrationsPresent
  && await pathExists("apps/api/src/gate1-database-store.mjs")
  && await pathExists("scripts/check-gate1-database-store.mjs")
  && await pathExists("scripts/check-gate1-read-parity.mjs");
const migrationStatus = databaseReadParityPresent
  ? "database_read_parity"
  : prismaSchemaPresent && prismaMigrationsPresent
    ? "scaffolded"
    : "not_scaffolded";
const databaseUrlPresent = Boolean(process.env.DATABASE_URL);
const databaseUrlMetadata = getDatabaseUrlMetadata(process.env.DATABASE_URL);
const prismaScaffoldMigrationStatus = prismaSchemaPresent && prismaMigrationsPresent ? "scaffolded" : "not_scaffolded";
const prismaScaffoldStatus = {
  schemaPresent: prismaSchemaPresent,
  migrationsPresent: prismaMigrationsPresent,
  migrationStatus: prismaScaffoldMigrationStatus,
  summary: `schema=${prismaSchemaPresent}, migrations=${prismaMigrationsPresent}, migrationStatus=${prismaScaffoldMigrationStatus}`
};
const seedParityStatus = {
  status: "planned",
  fixturePath: "packages/api-contracts/fixtures/gate0-smoke.json",
  planPath: seedParityPlanPath,
  planCommand: seedParityPlanCommand,
  checkCommand: seedParityCheckCommand,
  rawProviderValuesStored: false,
  summary: "status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false"
};
const readParityStatus = {
  status: "store_implemented",
  checkCommand: readParityCheckCommand,
  endpointCheckCommand: endpointReadParityCheckCommand,
  boundary: "apps/api/src/gate1-database-store.mjs",
  summary: "status=store_implemented, boundary=gate1-database-store, fixtureShape=gate0-compatible, endpointParity=checked"
};
const seedDatabaseStatus = {
  status: "writer_implemented",
  command: "npm run gate1:seed:database",
  checkCommand: seedDatabaseCheckCommand,
  rawProviderValuesStored: false,
  summary: "status=writer_implemented, command=gate1:seed:database, rawProviderValuesStored=false"
};
const migrationPreflightStatus = {
  status: "ready",
  checkCommand: migrationPreflightCheckCommand,
  rawSecretsPrinted: false,
  summary: "status=ready, command=gate1:migrate:test, rawSecretsPrinted=false"
};
const rollbackStatus = {
  status: "ready",
  mode: "fixture",
  checkCommand: rollbackCheckCommand,
  summary: "status=ready, mode=fixture, rawSecretsPrinted=false"
};
const writePathStatus = {
  status: "implemented",
  checkCommand: writePathCheckCommand,
  rawProviderValuesStored: false,
  summary: "status=implemented, command=gate1:write-path:test, rawProviderValuesStored=false"
};
const liveSmokeStatus = {
  status: "preflight_ready",
  command: "npm run gate1:live-smoke",
  checkCommand: liveSmokeCheckCommand,
  requiresDatabaseUrl: true,
  rawSecretsPrinted: false,
  summary: "status=preflight_ready, command=gate1:live-smoke, requiresDatabaseUrl=true, rawSecretsPrinted=false"
};
const ciPostgresStatus = {
  status: "enabled",
  workflow: ".github/workflows/contract-drift.yml",
  checkCommand: ciPostgresCheckCommand,
  smokeCommand: "npm run gate1:live-smoke",
  summary: "status=enabled, workflow=contract-drift.yml, command=gate1:ci-postgres:test, smoke=gate1:live-smoke"
};
const envProvisioningStatus = {
  status: "preflight_ready",
  command: "npm run gate1:env",
  checkCommand: gate1EnvCheckCommand,
  groups: ["productionRuntime", "awsDeploy", "androidRelease"],
  secretOutputPolicy: "keys-only",
  summary: "status=preflight_ready, command=gate1:env, groups=productionRuntime|awsDeploy|androidRelease, secretOutputPolicy=keys-only"
};
const githubEnvInventoryStatus = {
  status: "preflight_ready",
  command: "npm run gate1:github-env",
  checkCommand: gate1GithubEnvCheckCommand,
  environment: "production",
  secretOutputPolicy: "names-only",
  summary: "status=preflight_ready, command=gate1:github-env, environment=production, secretOutputPolicy=names-only"
};
const deployRehearsalStatus = {
  status: "preflight_ready",
  command: "npm run gate1:deploy-rehearsal",
  checkCommand: gate1DeployRehearsalCheckCommand,
  workflow: "AWS CI Deploy",
  workflowFile: ".github/workflows/aws-ci-deploy.yml",
  branch: "main",
  requiredPreflightCommand: "npm run gate1:github-env -- --json",
  summary: "status=preflight_ready, command=gate1:deploy-rehearsal, workflow=AWS CI Deploy, branch=main"
};
const summary = {
  status: "passed",
  migrationStatus,
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
  seedParityStatus,
  migrationPreflightStatus,
  seedDatabaseStatus,
  readParityStatus,
  writePathStatus,
  rollbackStatus,
  liveSmokeStatus,
  ciPostgresStatus,
  envProvisioningStatus,
  githubEnvInventoryStatus,
  deployRehearsalStatus,
  seedParityPlanCommand,
  seedParityCheckCommand,
  migrationPreflightCheckCommand,
  seedDatabaseCheckCommand,
  readParityCheckCommand,
  endpointReadParityCheckCommand,
  writePathCheckCommand,
  rollbackCheckCommand,
  liveSmokeCheckCommand,
  ciPostgresCheckCommand,
  gate1EnvCheckCommand,
  gate1GithubEnvCheckCommand,
  gate1GithubEnvApplyCheckCommand,
  gate1DeployRehearsalCheckCommand,
  seedParityPlanPath,
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
if (packageJson.scripts?.["db:check:test"] !== "node scripts/check-db-matrix.mjs && node scripts/check-db-matrix-command.mjs && npm run gate1:prisma:test && npm run gate1:migrate:test && npm run gate1:seed:test && npm run gate1:seed:database:test && npm run gate1:database-store:test && npm run gate1:read-parity:test && npm run gate1:write-path:test && npm run gate1:rollback:test && npm run gate1:live-smoke:test && npm run gate1:ci-postgres:test && npm run gate1:env:test && npm run gate1:github-env:test && npm run gate1:github-env:apply:test && npm run gate1:deploy-rehearsal:test") {
  failures.push("package.json must expose db:check:test");
}
if (packageJson.scripts?.["gate1:prisma:test"] !== "node scripts/check-gate1-prisma-scaffold.mjs") {
  failures.push("package.json must expose gate1:prisma:test");
}
if (packageJson.scripts?.["gate1:migrate:test"] !== "node scripts/check-gate1-migrate.mjs") {
  failures.push("package.json must expose gate1:migrate:test");
}
if (packageJson.scripts?.["gate1:seed:plan"] !== "node scripts/gate1-seed-parity.mjs --write") {
  failures.push("package.json must expose gate1:seed:plan");
}
if (packageJson.scripts?.["gate1:seed:test"] !== "node scripts/check-gate1-seed-parity.mjs") {
  failures.push("package.json must expose gate1:seed:test");
}
if (packageJson.scripts?.["gate1:seed:database"] !== "node scripts/gate1-seed-database.mjs") {
  failures.push("package.json must expose gate1:seed:database");
}
if (packageJson.scripts?.["gate1:seed:database:test"] !== "node scripts/check-gate1-database-seed.mjs") {
  failures.push("package.json must expose gate1:seed:database:test");
}
if (packageJson.scripts?.["gate1:database-store:test"] !== "node scripts/check-gate1-database-store.mjs") {
  failures.push("package.json must expose gate1:database-store:test");
}
if (packageJson.scripts?.["gate1:read-parity:test"] !== "node scripts/check-gate1-read-parity.mjs") {
  failures.push("package.json must expose gate1:read-parity:test");
}
if (packageJson.scripts?.["gate1:write-path:test"] !== "node scripts/check-gate1-write-path.mjs") {
  failures.push("package.json must expose gate1:write-path:test");
}
if (packageJson.scripts?.["gate1:rollback"] !== "node scripts/gate1-rollback-preflight.mjs") {
  failures.push("package.json must expose gate1:rollback");
}
if (packageJson.scripts?.["gate1:rollback:test"] !== "node scripts/check-gate1-rollback.mjs") {
  failures.push("package.json must expose gate1:rollback:test");
}
if (packageJson.scripts?.["gate1:live-smoke"] !== "node scripts/gate1-live-smoke.mjs") {
  failures.push("package.json must expose gate1:live-smoke");
}
if (packageJson.scripts?.["gate1:live-smoke:test"] !== "node scripts/check-gate1-live-smoke.mjs") {
  failures.push("package.json must expose gate1:live-smoke:test");
}
if (packageJson.scripts?.["gate1:ci-postgres:test"] !== "node scripts/check-gate1-ci-postgres.mjs") {
  failures.push("package.json must expose gate1:ci-postgres:test");
}
if (packageJson.scripts?.["gate1:env"] !== "node scripts/gate1-env-preflight.mjs") {
  failures.push("package.json must expose gate1:env");
}
if (packageJson.scripts?.["gate1:env:test"] !== "node scripts/check-gate1-env-preflight.mjs") {
  failures.push("package.json must expose gate1:env:test");
}
if (packageJson.scripts?.["gate1:github-env"] !== "node scripts/gate1-github-env-inventory.mjs") {
  failures.push("package.json must expose gate1:github-env");
}
if (packageJson.scripts?.["gate1:github-env:test"] !== "node scripts/check-gate1-github-env-inventory.mjs") {
  failures.push("package.json must expose gate1:github-env:test");
}
if (packageJson.scripts?.["gate1:github-env:apply"] !== "node scripts/gate1-github-env-apply.mjs") {
  failures.push("package.json must expose gate1:github-env:apply");
}
if (packageJson.scripts?.["gate1:github-env:apply:test"] !== "node scripts/check-gate1-github-env-apply.mjs") {
  failures.push("package.json must expose gate1:github-env:apply:test");
}
if (packageJson.scripts?.["gate1:deploy-rehearsal"] !== "node scripts/gate1-deploy-rehearsal.mjs") {
  failures.push("package.json must expose gate1:deploy-rehearsal");
}
if (packageJson.scripts?.["gate1:deploy-rehearsal:test"] !== "node scripts/check-gate1-deploy-rehearsal.mjs") {
  failures.push("package.json must expose gate1:deploy-rehearsal:test");
}

await requireFile(constraintsDocPath);
await requireFile(persistenceDocPath);
await requireFile("scripts/check-db-matrix-command.mjs");
await requireFile("scripts/gate1-seed-parity.mjs");
await requireFile("scripts/check-gate1-seed-parity.mjs");
await requireFile("scripts/check-gate1-migrate.mjs");
await requireFile("scripts/gate1-seed-database.mjs");
await requireFile("scripts/check-gate1-database-seed.mjs");
await requireFile("scripts/check-gate1-database-store.mjs");
await requireFile("scripts/check-gate1-read-parity.mjs");
await requireFile("scripts/check-gate1-write-path.mjs");
await requireFile("scripts/gate1-rollback-preflight.mjs");
await requireFile("scripts/check-gate1-rollback.mjs");
await requireFile("scripts/gate1-live-smoke.mjs");
await requireFile("scripts/check-gate1-live-smoke.mjs");
await requireFile("scripts/check-gate1-ci-postgres.mjs");
await requireFile("scripts/gate1-env-preflight.mjs");
await requireFile("scripts/check-gate1-env-preflight.mjs");
await requireFile("scripts/gate1-github-env-inventory.mjs");
await requireFile("scripts/check-gate1-github-env-inventory.mjs");
await requireFile("scripts/gate1-github-env-apply.mjs");
await requireFile("scripts/check-gate1-github-env-apply.mjs");
await requireFile("scripts/gate1-deploy-rehearsal.mjs");
await requireFile("scripts/check-gate1-deploy-rehearsal.mjs");

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
  "TM_GATE1_DATABASE_URL_REQUIRED",
  "seed parity",
  "database seed writer",
  "migration preflight",
  "read parity",
  "write path",
  "rollback",
  "gate1:rollback:test",
  "gate1:live-smoke",
  "CI Postgres smoke",
  "Secret injection and environment provisioning",
  "gate1:env",
  "gate1:github-env",
  "gate1:github-env:apply",
  "gate1:github-env -- --plan",
  "gate1:deploy-rehearsal",
  "AWS CI Deploy",
  "live deploy rehearsal",
  "keys-only",
  "names-only",
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
  console.log("  seedParityStatus.summary");
  console.log("  migrationPreflightStatus.summary");
  console.log("  seedDatabaseStatus.summary");
  console.log("  readParityStatus.summary");
  console.log("  writePathStatus.summary");
  console.log("  rollbackStatus.summary");
  console.log("  liveSmokeStatus.summary");
  console.log("  ciPostgresStatus.summary");
  console.log("  envProvisioningStatus.summary");
  console.log("  githubEnvInventoryStatus.summary");
  console.log("  deployRehearsalStatus.summary");
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
