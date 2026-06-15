import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.scripts?.["gate1:seed:database"] !== "node scripts/gate1-seed-database.mjs") {
  failures.push("package.json must expose gate1:seed:database");
}
if (packageJson.scripts?.["gate1:seed:database:test"] !== "node scripts/check-gate1-database-seed.mjs") {
  failures.push("package.json must expose gate1:seed:database:test");
}

const dryRun = await runNode(["scripts/gate1-seed-database.mjs", "--dry-run", "--json"]);
let plan = null;
try {
  plan = JSON.parse(dryRun.stdout);
} catch {
  failures.push("gate1 database seed --dry-run --json must print JSON");
}

if (plan) {
  if (plan.status !== "dry_run") failures.push("database seed dry run must report status=dry_run");
  if (plan.fixturePath !== "packages/api-contracts/fixtures/gate0-smoke.json") failures.push("database seed dry run must include fixture path");
  if (plan.counts.users !== 2) failures.push("database seed dry run must map two users");
  if (plan.counts.publicIdentities !== 2) failures.push("database seed dry run must map two public identities");
  if (plan.counts.externalContacts !== 1) failures.push("database seed dry run must map one safe external contact");
  if (plan.counts.chatRooms !== 1) failures.push("database seed dry run must map one chat room");
  if (plan.counts.contactExchanges < 5) failures.push("database seed dry run must map lifecycle contact exchanges");
  if (plan.rawProviderValuesStored !== false) failures.push("database seed dry run must not store raw provider values");
  if (!Array.isArray(plan.operationOrder) || !plan.operationOrder.includes("contactExchange.upsert")) {
    failures.push("database seed dry run must expose Prisma operation order");
  }
  for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
    if (JSON.stringify(plan).includes(forbidden)) failures.push(`database seed plan must not include raw provider value ${forbidden}`);
  }
}

const noDatabaseUrl = await runNode(["scripts/gate1-seed-database.mjs"]);
if (noDatabaseUrl.code !== 1 || !noDatabaseUrl.stderr.includes("TM_GATE1_DATABASE_URL_REQUIRED")) {
  failures.push("gate1 database seed must require DATABASE_URL outside dry-run mode");
}

const field = await runNode(["scripts/gate1-seed-database.mjs", "--dry-run", "--field", "counts.contactExchanges"]);
if (field.stdout.trim() !== "6") {
  failures.push("gate1 database seed --field counts.contactExchanges must print 6");
}

const unknown = await runNode(["scripts/gate1-seed-database.mjs", "--wat"]);
if (unknown.code !== 1 || !unknown.stderr.includes("TM_GATE1_DATABASE_SEED_UNKNOWN_OPTION")) {
  failures.push("gate1 database seed must reject unknown options");
}

if (failures.length > 0) {
  console.error("TM_GATE1_DATABASE_SEED_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 database seed writer OK");

async function runNode(args, env = {}) {
  try {
    return await execFileAsync(process.execPath, args, {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: "", ...env },
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
