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
  if (summary.migrationStatus !== "not_scaffolded") failures.push("db:check --json must report migrationStatus=not_scaffolded");
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
  if (summary.prismaSchemaPresent !== false) {
    failures.push("db:check --json must report prismaSchemaPresent=false for Gate 0");
  }
  if (summary.prismaMigrationsPresent !== false) {
    failures.push("db:check --json must report prismaMigrationsPresent=false for Gate 0");
  }
  if (summary.prismaScaffoldStatus?.schemaPresent !== false) {
    failures.push("db:check --json must include prismaScaffoldStatus.schemaPresent=false for Gate 0");
  }
  if (summary.prismaScaffoldStatus?.migrationsPresent !== false) {
    failures.push("db:check --json must include prismaScaffoldStatus.migrationsPresent=false for Gate 0");
  }
  if (summary.prismaScaffoldStatus?.migrationStatus !== "not_scaffolded") {
    failures.push("db:check --json must include prismaScaffoldStatus.migrationStatus=not_scaffolded");
  }
  if (summary.prismaScaffoldStatus?.summary !== "schema=false, migrations=false, migrationStatus=not_scaffolded") {
    failures.push("db:check --json must include prismaScaffoldStatus summary");
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
if (fieldResult.stdout.trim() !== "not_scaffolded") {
  failures.push("db:check --field migrationStatus must print not_scaffolded");
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
if (prismaSchemaPresentField.stdout.trim() !== "false") {
  failures.push("db:check --field prismaSchemaPresent must print false for Gate 0");
}

const prismaScaffoldStatusField = await runNode(["scripts/check-db-matrix.mjs", "--field", "prismaScaffoldStatus"]);
try {
  const scaffoldStatus = JSON.parse(prismaScaffoldStatusField.stdout);
  if (scaffoldStatus.summary !== "schema=false, migrations=false, migrationStatus=not_scaffolded") {
    failures.push("db:check --field prismaScaffoldStatus must print scaffold summary JSON");
  }
} catch {
  failures.push("db:check --field prismaScaffoldStatus must print parseable JSON");
}

const prismaScaffoldStatusSummaryField = await runNode(["scripts/check-db-matrix.mjs", "--field", "prismaScaffoldStatus.summary"]);
if (prismaScaffoldStatusSummaryField.stdout.trim() !== "schema=false, migrations=false, migrationStatus=not_scaffolded") {
  failures.push("db:check --field prismaScaffoldStatus.summary must print scaffold summary");
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
for (const term of ["--json", "--field <name>", "migrationStatus", "requiredModels", "notScaffoldedGuard", "notScaffoldedGuard.errorCode", "prismaSchemaPresent", "prismaMigrationsPresent", "prismaScaffoldStatus", "prismaScaffoldStatus.summary", "requiredEnvKeys", "databaseUrlPresent", "databaseUrlStatus", "databaseUrlProtocol", "TM_DB_MATRIX_UNKNOWN_OPTION", "TM_DB_MATRIX_OPTION_CONFLICT", "TM_DB_MATRIX_FIELD_REQUIRED", "TM_DB_MATRIX_UNKNOWN_FIELD"]) {
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
