import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.scripts?.["gate1:rollback"] !== "node scripts/gate1-rollback-preflight.mjs") {
  failures.push("package.json must expose gate1:rollback");
}
if (packageJson.scripts?.["gate1:rollback:test"] !== "node scripts/check-gate1-rollback.mjs") {
  failures.push("package.json must expose gate1:rollback:test");
}

const jsonResult = await runNode(["scripts/gate1-rollback-preflight.mjs", "--json"], {
  DATABASE_URL: "postgresql://secret-user:secret-pass@localhost:5432/thai_meet"
});
let rollback = null;
try {
  rollback = JSON.parse(jsonResult.stdout);
} catch {
  failures.push("gate1 rollback --json must print JSON");
}

if (rollback) {
  if (rollback.status !== "ready") failures.push("rollback status must be ready");
  if (rollback.mode !== "fixture") failures.push("rollback mode must be fixture");
  if (rollback.expectedMode !== "fixture") failures.push("rollback expectedMode must be fixture");
  if (rollback.rawSecretsPrinted !== false) failures.push("rollback must not print raw secrets");
  if (rollback.secretOutputPolicy !== "do not echo database or provider secret values") {
    failures.push("rollback must document secret output policy");
  }
  if (!rollback.commands?.includes("npm run api:check")) failures.push("rollback commands must include api:check");
  if (!rollback.commands?.includes("npm run db:check:test")) failures.push("rollback commands must include db:check:test");
  if (rollback.verificationCommand !== "npm run gate0:status -- --field persistenceModeDefault") {
    failures.push("rollback verification command must check fixture default");
  }
}

for (const forbidden of ["secret-user", "secret-pass", "postgresql://secret-user", "postgresql://", "postgres://", "DATABASE_URL"]) {
  if (jsonResult.stdout.includes(forbidden) || jsonResult.stderr.includes(forbidden)) {
    failures.push(`rollback output must not include DATABASE_URL secret fragment ${forbidden}`);
  }
}

const modeField = await runNode(["scripts/gate1-rollback-preflight.mjs", "--field", "mode"]);
if (modeField.stdout.trim() !== "fixture") failures.push("rollback --field mode must print fixture");

const missingFieldValue = await runNode(["scripts/gate1-rollback-preflight.mjs", "--field"]);
if (missingFieldValue.code !== 1 || !missingFieldValue.stderr.includes("TM_GATE1_ROLLBACK_FIELD_REQUIRED")) {
  failures.push("rollback --field without a field name must fail with TM_GATE1_ROLLBACK_FIELD_REQUIRED");
}

const unknownOption = await runNode(["scripts/gate1-rollback-preflight.mjs", "--wat"]);
if (unknownOption.code !== 1 || !unknownOption.stderr.includes("TM_GATE1_ROLLBACK_UNKNOWN_OPTION")) {
  failures.push("rollback must reject unknown options");
}

if (failures.length > 0) {
  console.error("TM_GATE1_ROLLBACK_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 rollback preflight OK");

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
