import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];

const jsonResult = await runNode(["scripts/check-db-matrix.mjs", "--json"]);
let summary = null;
try {
  summary = JSON.parse(jsonResult.stdout);
} catch {
  failures.push("db:check --json must print JSON");
}

if (summary) {
  if (summary.status !== "passed") failures.push("db:check --json must report status=passed");
  if (summary.migrationStatus !== "database_read_parity") failures.push("db:check --json must report migrationStatus=database_read_parity");
  if (summary.persistenceGate !== "Gate 1") failures.push("db:check --json must report persistenceGate=Gate 1");
  if (summary.constraintsDoc !== "docs/dev/DB_CONSTRAINTS.md") failures.push("db:check --json must report constraintsDoc");
  if (summary.persistenceDoc !== "docs/dev/GATE1_PERSISTENCE.md") failures.push("db:check --json must report persistenceDoc");
  if (!Array.isArray(summary.requiredModels) || !summary.requiredModels.includes("ContactExchange")) {
    failures.push("db:check --json must include requiredModels with ContactExchange");
  }
  if (!Array.isArray(summary.requiredModes) || !summary.requiredModes.includes("PERSISTENCE_MODE=fixture")) {
    failures.push("db:check --json must include requiredModes with PERSISTENCE_MODE=fixture");
  }
  if (summary.notScaffoldedGuard?.command !== "npm run not-scaffolded:test") {
    failures.push("db:check --json must include notScaffoldedGuard command");
  }
  if (summary.notScaffoldedGuard?.errorCode !== "TM_COMMAND_NOT_SCAFFOLDED") {
    failures.push("db:check --json must include notScaffoldedGuard errorCode");
  }
  if (summary.notScaffoldedGuard?.migrationCommand !== "npm run db:migrate") {
    failures.push("db:check --json must include notScaffoldedGuard migrationCommand");
  }
  if (summary.prismaSchemaPath !== "apps/api/prisma/schema.prisma") {
    failures.push("db:check --json must include prismaSchemaPath");
  }
  if (summary.prismaMigrationsPath !== "apps/api/prisma/migrations") {
    failures.push("db:check --json must include prismaMigrationsPath");
  }
  if (summary.prismaSchemaPresent !== true) {
    failures.push("db:check --json must report prismaSchemaPresent=true for Gate 1");
  }
  if (summary.prismaMigrationsPresent !== true) {
    failures.push("db:check --json must report prismaMigrationsPresent=true for Gate 1");
  }
  if (summary.prismaScaffoldStatus?.schemaPresent !== true) {
    failures.push("db:check --json must include prismaScaffoldStatus.schemaPresent=true for Gate 1");
  }
  if (summary.prismaScaffoldStatus?.migrationsPresent !== true) {
    failures.push("db:check --json must include prismaScaffoldStatus.migrationsPresent=true for Gate 1");
  }
  if (summary.prismaScaffoldStatus?.migrationStatus !== "scaffolded") {
    failures.push("db:check --json must include prismaScaffoldStatus.migrationStatus=scaffolded");
  }
  if (summary.prismaScaffoldStatus?.summary !== "schema=true, migrations=true, migrationStatus=scaffolded") {
    failures.push("db:check --json must include prismaScaffoldStatus summary");
  }
  if (summary.seedParityStatus?.summary !== "status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false") {
    failures.push("db:check --json must include seedParityStatus summary");
  }
  if (summary.readParityStatus?.summary !== "status=store_implemented, boundary=gate1-database-store, fixtureShape=gate0-compatible, endpointParity=checked") {
    failures.push("db:check --json must include readParityStatus summary");
  }
  if (summary.seedDatabaseStatus?.summary !== "status=writer_implemented, command=gate1:seed:database, rawProviderValuesStored=false") {
    failures.push("db:check --json must include seedDatabaseStatus summary");
  }
  if (summary.migrationPreflightStatus?.summary !== "status=ready, command=gate1:migrate:test, rawSecretsPrinted=false") {
    failures.push("db:check --json must include migrationPreflightStatus summary");
  }
  if (summary.rollbackStatus?.summary !== "status=ready, mode=fixture, rawSecretsPrinted=false") {
    failures.push("db:check --json must include rollbackStatus summary");
  }
  if (summary.writePathStatus?.summary !== "status=implemented, command=gate1:write-path:test, rawProviderValuesStored=false") {
    failures.push("db:check --json must include writePathStatus summary");
  }
  if (summary.liveSmokeStatus?.summary !== "status=preflight_ready, command=gate1:live-smoke, requiresDatabaseUrl=true, rawSecretsPrinted=false") {
    failures.push("db:check --json must include liveSmokeStatus summary");
  }
  if (summary.ciPostgresStatus?.summary !== "status=enabled, workflow=contract-drift.yml, command=gate1:ci-postgres:test, smoke=gate1:live-smoke") {
    failures.push("db:check --json must include ciPostgresStatus summary");
  }
  if (summary.seedParityPlanCommand !== "npm run gate1:seed:plan") {
    failures.push("db:check --json must include seed parity plan command");
  }
  if (summary.seedParityCheckCommand !== "npm run gate1:seed:test") {
    failures.push("db:check --json must include seed parity check command");
  }
  if (summary.readParityCheckCommand !== "npm run gate1:database-store:test") {
    failures.push("db:check --json must include read parity check command");
  }
  if (summary.endpointReadParityCheckCommand !== "npm run gate1:read-parity:test") {
    failures.push("db:check --json must include endpoint read parity check command");
  }
  if (summary.rollbackCheckCommand !== "npm run gate1:rollback:test") {
    failures.push("db:check --json must include rollback check command");
  }
  if (summary.writePathCheckCommand !== "npm run gate1:write-path:test") {
    failures.push("db:check --json must include write path check command");
  }
  if (summary.liveSmokeCheckCommand !== "npm run gate1:live-smoke:test") {
    failures.push("db:check --json must include live smoke check command");
  }
  if (summary.ciPostgresCheckCommand !== "npm run gate1:ci-postgres:test") {
    failures.push("db:check --json must include CI Postgres check command");
  }
  if (summary.seedDatabaseCheckCommand !== "npm run gate1:seed:database:test") {
    failures.push("db:check --json must include database seed check command");
  }
  if (summary.migrationPreflightCheckCommand !== "npm run gate1:migrate:test") {
    failures.push("db:check --json must include migration preflight check command");
  }
  if (!Array.isArray(summary.requiredEnvKeys) || !summary.requiredEnvKeys.includes("DATABASE_URL")) {
    failures.push("db:check --json must include requiredEnvKeys with DATABASE_URL");
  }
  if (summary.databaseUrlPresent !== false) {
    failures.push("db:check --json must report databaseUrlPresent=false by default");
  }
  if (summary.databaseUrlStatus !== "missing") {
    failures.push("db:check --json must report databaseUrlStatus=missing by default");
  }
  if (summary.databaseUrlProtocol !== "none") {
    failures.push("db:check --json must report databaseUrlProtocol=none by default");
  }
}

const jsonWithDatabaseUrl = await runNode(["scripts/check-db-matrix.mjs", "--json"], {
  DATABASE_URL: "postgresql://gate1.local/thai_meet"
});
try {
  const envSummary = JSON.parse(jsonWithDatabaseUrl.stdout);
  if (envSummary.databaseUrlPresent !== true) {
    failures.push("db:check --json must report databaseUrlPresent=true when DATABASE_URL is set");
  }
  if (envSummary.databaseUrlStatus !== "valid") {
    failures.push("db:check --json must report databaseUrlStatus=valid for a PostgreSQL DATABASE_URL");
  }
  if (envSummary.databaseUrlProtocol !== "postgresql") {
    failures.push("db:check --json must report databaseUrlProtocol=postgresql for a PostgreSQL DATABASE_URL");
  }
} catch {
  failures.push("db:check --json must print JSON when DATABASE_URL is set");
}

const jsonWithInvalidDatabaseUrl = await runNode(["scripts/check-db-matrix.mjs", "--json"], {
  DATABASE_URL: "mysql://gate1.local/thai_meet"
});
try {
  const invalidEnvSummary = JSON.parse(jsonWithInvalidDatabaseUrl.stdout);
  if (invalidEnvSummary.databaseUrlStatus !== "invalid") {
    failures.push("db:check --json must report databaseUrlStatus=invalid for unsupported DATABASE_URL protocols");
  }
  if (invalidEnvSummary.databaseUrlProtocol !== "mysql") {
    failures.push("db:check --json must report the unsupported DATABASE_URL protocol without printing the URL");
  }
} catch {
  failures.push("db:check --json must print JSON when DATABASE_URL has an unsupported protocol");
}

const fieldResult = await runNode(["scripts/check-db-matrix.mjs", "--field", "migrationStatus"]);
if (fieldResult.stdout.trim() !== "database_read_parity") {
  failures.push("db:check --field migrationStatus must print database_read_parity");
}

const guardFieldResult = await runNode(["scripts/check-db-matrix.mjs", "--field", "notScaffoldedGuard"]);
try {
  const guard = JSON.parse(guardFieldResult.stdout);
  if (guard.errorCode !== "TM_COMMAND_NOT_SCAFFOLDED") failures.push("db:check --field notScaffoldedGuard must print guard JSON");
} catch {
  failures.push("db:check --field notScaffoldedGuard must print parseable JSON");
}

const nestedGuardFieldResult = await runNode(["scripts/check-db-matrix.mjs", "--field", "notScaffoldedGuard.errorCode"]);
if (nestedGuardFieldResult.stdout.trim() !== "TM_COMMAND_NOT_SCAFFOLDED") {
  failures.push("db:check --field notScaffoldedGuard.errorCode must print TM_COMMAND_NOT_SCAFFOLDED");
}

const prismaSchemaPresentField = await runNode(["scripts/check-db-matrix.mjs", "--field", "prismaSchemaPresent"]);
if (prismaSchemaPresentField.stdout.trim() !== "true") {
  failures.push("db:check --field prismaSchemaPresent must print true for Gate 1");
}

const prismaScaffoldStatusField = await runNode(["scripts/check-db-matrix.mjs", "--field", "prismaScaffoldStatus"]);
try {
  const scaffoldStatus = JSON.parse(prismaScaffoldStatusField.stdout);
  if (scaffoldStatus.summary !== "schema=true, migrations=true, migrationStatus=scaffolded") {
    failures.push("db:check --field prismaScaffoldStatus must print scaffold summary JSON");
  }
} catch {
  failures.push("db:check --field prismaScaffoldStatus must print parseable JSON");
}

const prismaScaffoldStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "prismaScaffoldStatus.summary"]);
if (prismaScaffoldStatusSummaryField.stdout.trim() !== "schema=true, migrations=true, migrationStatus=scaffolded") {
  failures.push("db:check --field prismaScaffoldStatus.summary must print scaffold summary");
}

const seedParityStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "seedParityStatus.summary"]);
if (seedParityStatusSummaryField.stdout.trim() !== "status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false") {
  failures.push("db:check --field seedParityStatus.summary must print seed parity summary");
}

const readParityStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "readParityStatus.summary"]);
if (readParityStatusSummaryField.stdout.trim() !== "status=store_implemented, boundary=gate1-database-store, fixtureShape=gate0-compatible, endpointParity=checked") {
  failures.push("db:check --field readParityStatus.summary must print read parity summary");
}

const seedDatabaseStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "seedDatabaseStatus.summary"]);
if (seedDatabaseStatusSummaryField.stdout.trim() !== "status=writer_implemented, command=gate1:seed:database, rawProviderValuesStored=false") {
  failures.push("db:check --field seedDatabaseStatus.summary must print database seed summary");
}

const migrationPreflightStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "migrationPreflightStatus.summary"]);
if (migrationPreflightStatusSummaryField.stdout.trim() !== "status=ready, command=gate1:migrate:test, rawSecretsPrinted=false") {
  failures.push("db:check --field migrationPreflightStatus.summary must print migration preflight summary");
}

const rollbackStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "rollbackStatus.summary"]);
if (rollbackStatusSummaryField.stdout.trim() !== "status=ready, mode=fixture, rawSecretsPrinted=false") {
  failures.push("db:check --field rollbackStatus.summary must print rollback summary");
}

const writePathStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "writePathStatus.summary"]);
if (writePathStatusSummaryField.stdout.trim() !== "status=implemented, command=gate1:write-path:test, rawProviderValuesStored=false") {
  failures.push("db:check --field writePathStatus.summary must print write path summary");
}

const liveSmokeStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "liveSmokeStatus.summary"]);
if (liveSmokeStatusSummaryField.stdout.trim() !== "status=preflight_ready, command=gate1:live-smoke, requiresDatabaseUrl=true, rawSecretsPrinted=false") {
  failures.push("db:check --field liveSmokeStatus.summary must print live smoke summary");
}

const ciPostgresStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "ciPostgresStatus.summary"]);
if (ciPostgresStatusSummaryField.stdout.trim() !== "status=enabled, workflow=contract-drift.yml, command=gate1:ci-postgres:test, smoke=gate1:live-smoke") {
  failures.push("db:check --field ciPostgresStatus.summary must print CI Postgres summary");
}

const seedParityCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "seedParityCheckCommand"]);
if (seedParityCheckCommandField.stdout.trim() !== "npm run gate1:seed:test") {
  failures.push("db:check --field seedParityCheckCommand must print gate1 seed check command");
}

const readParityCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "readParityCheckCommand"]);
if (readParityCheckCommandField.stdout.trim() !== "npm run gate1:database-store:test") {
  failures.push("db:check --field readParityCheckCommand must print gate1 database store check command");
}

const endpointReadParityCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "endpointReadParityCheckCommand"]);
if (endpointReadParityCheckCommandField.stdout.trim() !== "npm run gate1:read-parity:test") {
  failures.push("db:check --field endpointReadParityCheckCommand must print gate1 read parity check command");
}

const rollbackCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "rollbackCheckCommand"]);
if (rollbackCheckCommandField.stdout.trim() !== "npm run gate1:rollback:test") {
  failures.push("db:check --field rollbackCheckCommand must print gate1 rollback check command");
}

const writePathCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "writePathCheckCommand"]);
if (writePathCheckCommandField.stdout.trim() !== "npm run gate1:write-path:test") {
  failures.push("db:check --field writePathCheckCommand must print gate1 write path check command");
}

const liveSmokeCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "liveSmokeCheckCommand"]);
if (liveSmokeCheckCommandField.stdout.trim() !== "npm run gate1:live-smoke:test") {
  failures.push("db:check --field liveSmokeCheckCommand must print gate1 live smoke check command");
}

const ciPostgresCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "ciPostgresCheckCommand"]);
if (ciPostgresCheckCommandField.stdout.trim() !== "npm run gate1:ci-postgres:test") {
  failures.push("db:check --field ciPostgresCheckCommand must print gate1 CI Postgres check command");
}

const seedDatabaseCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "seedDatabaseCheckCommand"]);
if (seedDatabaseCheckCommandField.stdout.trim() !== "npm run gate1:seed:database:test") {
  failures.push("db:check --field seedDatabaseCheckCommand must print gate1 database seed check command");
}

const migrationPreflightCheckCommandField = await runNode(["scripts/check-db-matrix.mjs", "--field", "migrationPreflightCheckCommand"]);
if (migrationPreflightCheckCommandField.stdout.trim() !== "npm run gate1:migrate:test") {
  failures.push("db:check --field migrationPreflightCheckCommand must print gate1 migration preflight check command");
}

const databaseUrlPresentField = await runNode(["scripts/check-db-matrix.mjs", "--field", "databaseUrlPresent"]);
if (databaseUrlPresentField.stdout.trim() !== "false") {
  failures.push("db:check --field databaseUrlPresent must print false by default");
}

const databaseUrlPresentEnvField = await runNode(["scripts/check-db-matrix.mjs", "--field", "databaseUrlPresent"], {
  DATABASE_URL: "postgresql://gate1.local/thai_meet"
});
if (databaseUrlPresentEnvField.stdout.trim() !== "true") {
  failures.push("db:check --field databaseUrlPresent must print true when DATABASE_URL is set");
}

const databaseUrlStatusField = await runNode(["scripts/check-db-matrix.mjs", "--field", "databaseUrlStatus"]);
if (databaseUrlStatusField.stdout.trim() !== "missing") {
  failures.push("db:check --field databaseUrlStatus must print missing by default");
}

const databaseUrlValidStatusField = await runNode(["scripts/check-db-matrix.mjs", "--field", "databaseUrlStatus"], {
  DATABASE_URL: "postgresql://gate1.local/thai_meet"
});
if (databaseUrlValidStatusField.stdout.trim() !== "valid") {
  failures.push("db:check --field databaseUrlStatus must print valid for a PostgreSQL DATABASE_URL");
}

const databaseUrlProtocolField = await runNode(["scripts/check-db-matrix.mjs", "--field", "databaseUrlProtocol"], {
  DATABASE_URL: "postgres://gate1.local/thai_meet"
});
if (databaseUrlProtocolField.stdout.trim() !== "postgres") {
  failures.push("db:check --field databaseUrlProtocol must print postgres for postgres:// URLs");
}

const helpResult = await runNode(["scripts/check-db-matrix.mjs", "--help"]);
for (const term of ["--json", "--field <name>", "migrationStatus", "requiredModels", "notScaffoldedGuard", "notScaffoldedGuard.errorCode", "prismaSchemaPresent", "prismaMigrationsPresent", "prismaScaffoldStatus", "prismaScaffoldStatus.summary", "seedParityStatus", "seedParityStatus.summary", "seedParityCheckCommand", "migrationPreflightStatus", "migrationPreflightStatus.summary", "migrationPreflightCheckCommand", "seedDatabaseStatus", "seedDatabaseStatus.summary", "seedDatabaseCheckCommand", "readParityStatus", "readParityStatus.summary", "readParityCheckCommand", "endpointReadParityCheckCommand", "writePathStatus", "writePathStatus.summary", "writePathCheckCommand", "rollbackStatus", "rollbackStatus.summary", "rollbackCheckCommand", "liveSmokeStatus", "liveSmokeStatus.summary", "liveSmokeCheckCommand", "ciPostgresStatus", "ciPostgresStatus.summary", "ciPostgresCheckCommand", "requiredEnvKeys", "databaseUrlPresent", "databaseUrlStatus", "databaseUrlProtocol", "TM_DB_MATRIX_UNKNOWN_OPTION", "TM_DB_MATRIX_OPTION_CONFLICT", "TM_DB_MATRIX_FIELD_REQUIRED", "TM_DB_MATRIX_UNKNOWN_FIELD"]) {
  if (!helpResult.stdout.includes(term)) failures.push(`db:check --help must include ${term}`);
}

const unknownOption = await runNode(["scripts/check-db-matrix.mjs", "--wat"]);
if (unknownOption.code !== 1 || !unknownOption.stderr.includes("TM_DB_MATRIX_UNKNOWN_OPTION")) {
  failures.push("db:check must fail unknown options with TM_DB_MATRIX_UNKNOWN_OPTION");
}

const conflictingOutput = await runNode(["scripts/check-db-matrix.mjs", "--json", "--field", "migrationStatus"]);
if (conflictingOutput.code !== 1 || !conflictingOutput.stderr.includes("TM_DB_MATRIX_OPTION_CONFLICT")) {
  failures.push("db:check must fail --json and --field together with TM_DB_MATRIX_OPTION_CONFLICT");
}

const missingField = await runNode(["scripts/check-db-matrix.mjs", "--field"]);
if (missingField.code !== 1 || !missingField.stderr.includes("TM_DB_MATRIX_FIELD_REQUIRED")) {
  failures.push("db:check must fail missing --field values with TM_DB_MATRIX_FIELD_REQUIRED");
}

const optionAsField = await runNode(["scripts/check-db-matrix.mjs", "--field", "--json"]);
if (optionAsField.code !== 1 || !optionAsField.stderr.includes("TM_DB_MATRIX_FIELD_REQUIRED")) {
  failures.push("db:check must reject option-looking --field values with TM_DB_MATRIX_FIELD_REQUIRED");
}

const unknownField = await runNode(["scripts/check-db-matrix.mjs", "--field", "nope"]);
if (unknownField.code !== 1 || !unknownField.stderr.includes("TM_DB_MATRIX_UNKNOWN_FIELD")) {
  failures.push("db:check must fail unknown fields with TM_DB_MATRIX_UNKNOWN_FIELD");
}

const unknownNestedField = await runNode(["scripts/check-db-matrix.mjs", "--field", "notScaffoldedGuard.nope"]);
if (unknownNestedField.code !== 1 || !unknownNestedField.stderr.includes("TM_DB_MATRIX_UNKNOWN_FIELD")) {
  failures.push("db:check must fail unknown nested fields with TM_DB_MATRIX_UNKNOWN_FIELD");
}

if (failures.length > 0) {
  console.error("TM_DB_MATRIX_COMMAND_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 DB matrix command OK");

async function runNode(args, env = {}) {
  try {
    return await execFileAsync(process.execPath, args, {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
      maxBuffer: 1024 * 1024
    });
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || "",
      code: error.code
    };
  }
}
