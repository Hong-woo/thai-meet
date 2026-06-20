import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.scripts?.["gate1:live-smoke"] !== "node scripts/gate1-live-smoke.mjs") {
  failures.push("package.json must expose gate1:live-smoke");
}
if (packageJson.scripts?.["gate1:live-smoke:test"] !== "node scripts/check-gate1-live-smoke.mjs") {
  failures.push("package.json must expose gate1:live-smoke:test");
}

const dryRun = await runNode(["scripts/gate1-live-smoke.mjs", "--dry-run", "--json"], {
  DATABASE_URL: "postgresql://secret-user:secret-pass@localhost:5432/thai_meet"
});
let summary = null;
try {
  summary = JSON.parse(dryRun.stdout);
} catch {
  failures.push("gate1 live smoke --dry-run --json must print JSON");
}

if (summary) {
  if (summary.status !== "dry_run") failures.push("live smoke dry run must report status=dry_run");
  if (summary.databaseUrlStatus !== "valid") failures.push("live smoke dry run must report valid DATABASE_URL status");
  if (summary.databaseUrlProtocol !== "postgresql") failures.push("live smoke dry run must report only the DATABASE_URL protocol");
  if (summary.rawSecretsPrinted !== false) failures.push("live smoke dry run must report rawSecretsPrinted=false");
  if (!summary.commandOrder?.includes("npm run db:migrate")) failures.push("live smoke dry run must include migration command order");
  if (!summary.commandOrder?.includes("npm run gate1:seed:database")) failures.push("live smoke dry run must include seed command order");
}

for (const forbidden of ["secret-user", "secret-pass", "postgresql://secret-user", "localhost:5432/thai_meet"]) {
  if (dryRun.stdout.includes(forbidden) || dryRun.stderr.includes(forbidden)) {
    failures.push(`live smoke dry run must not include DATABASE_URL secret fragment ${forbidden}`);
  }
}

const noDatabaseUrl = await runNode(["scripts/gate1-live-smoke.mjs"], { DATABASE_URL: "" });
if (noDatabaseUrl.code !== 1 || !noDatabaseUrl.stderr.includes("TM_GATE1_LIVE_DATABASE_URL_REQUIRED")) {
  failures.push("live smoke must require DATABASE_URL outside dry-run mode");
}

const invalidDatabaseUrl = await runNode(["scripts/gate1-live-smoke.mjs"], {
  DATABASE_URL: "mysql://secret-user:secret-pass@localhost:3306/thai_meet"
});
if (invalidDatabaseUrl.code !== 1 || !invalidDatabaseUrl.stderr.includes("TM_GATE1_LIVE_DATABASE_URL_INVALID")) {
  failures.push("live smoke must reject non-PostgreSQL DATABASE_URL protocols");
}
if (invalidDatabaseUrl.stderr.includes("secret-user") || invalidDatabaseUrl.stderr.includes("secret-pass") || invalidDatabaseUrl.stderr.includes("localhost:3306")) {
  failures.push("live smoke invalid URL error must not print DATABASE_URL secrets");
}

const fieldResult = await runNode(["scripts/gate1-live-smoke.mjs", "--dry-run", "--field", "commandOrder.1"]);
if (fieldResult.stdout.trim() !== "npm run gate1:seed:database") {
  failures.push("live smoke --field commandOrder.1 must print seed command");
}

const missingFieldValue = await runNode(["scripts/gate1-live-smoke.mjs", "--dry-run", "--field"]);
if (missingFieldValue.code !== 1 || !missingFieldValue.stderr.includes("TM_GATE1_LIVE_SMOKE_FIELD_REQUIRED")) {
  failures.push("live smoke --field without a field name must fail with TM_GATE1_LIVE_SMOKE_FIELD_REQUIRED");
}

const emptyEqualsField = await runNode(["scripts/gate1-live-smoke.mjs", "--dry-run", "--field="]);
if (emptyEqualsField.code !== 1 || !emptyEqualsField.stderr.includes("TM_GATE1_LIVE_SMOKE_FIELD_REQUIRED")) {
  failures.push("live smoke --field= must fail with TM_GATE1_LIVE_SMOKE_FIELD_REQUIRED");
}
if (emptyEqualsField.stdout.trim().length > 0) {
  failures.push("live smoke --field= must not print dry-run output");
}

const unknownOption = await runNode(["scripts/gate1-live-smoke.mjs", "--wat"]);
if (unknownOption.code !== 1 || !unknownOption.stderr.includes("TM_GATE1_LIVE_SMOKE_UNKNOWN_OPTION")) {
  failures.push("live smoke must reject unknown options");
}

if (failures.length > 0) {
  console.error("TM_GATE1_LIVE_SMOKE_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 live smoke preflight OK");

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
