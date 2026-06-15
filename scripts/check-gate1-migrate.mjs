import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.scripts?.["gate1:migrate:test"] !== "node scripts/check-gate1-migrate.mjs") {
  failures.push("package.json must expose gate1:migrate:test");
}

const dryRun = await runNode(["scripts/gate1-migrate.mjs", "--dry-run", "--json"], {
  DATABASE_URL: "postgresql://secret-user:secret-pass@localhost:5432/thai_meet"
});
let summary = null;
try {
  summary = JSON.parse(dryRun.stdout);
} catch {
  failures.push("gate1 migrate --dry-run --json must print JSON");
}

if (summary) {
  if (summary.status !== "dry_run") failures.push("migrate dry run must report status=dry_run");
  if (summary.command !== "db:migrate") failures.push("migrate dry run must report command=db:migrate");
  if (summary.databaseUrlStatus !== "valid") failures.push("migrate dry run must report valid DATABASE_URL status");
  if (summary.databaseUrlProtocol !== "postgresql") failures.push("migrate dry run must report protocol only");
  if (process.platform === "win32" && summary.spawnCommand !== "cmd.exe") {
    failures.push("migrate dry run must use cmd.exe on Windows for npm command shims");
  }
  if (summary.spawnShell !== false) {
    failures.push("migrate dry run must not use shell=true");
  }
  if (summary.rawSecretsPrinted !== false) failures.push("migrate dry run must report rawSecretsPrinted=false");
}

for (const forbidden of ["secret-user", "secret-pass", "postgresql://secret-user", "localhost:5432/thai_meet"]) {
  if (dryRun.stdout.includes(forbidden) || dryRun.stderr.includes(forbidden)) {
    failures.push(`migrate dry run must not include DATABASE_URL secret fragment ${forbidden}`);
  }
}

const noDatabaseUrl = await runNode(["scripts/gate1-migrate.mjs", "--dry-run"], { DATABASE_URL: "" });
if (noDatabaseUrl.code !== 1 || !noDatabaseUrl.stderr.includes("TM_GATE1_DATABASE_URL_REQUIRED")) {
  failures.push("migrate dry run must still require DATABASE_URL");
}

if (failures.length > 0) {
  console.error("TM_GATE1_MIGRATE_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 migrate preflight OK");

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
