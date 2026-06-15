import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
if (packageJson.scripts?.["gate1:seed:plan"] !== "node scripts/gate1-seed-parity.mjs --write") {
  failures.push("package.json must expose gate1:seed:plan");
}
if (packageJson.scripts?.["gate1:seed:test"] !== "node scripts/check-gate1-seed-parity.mjs") {
  failures.push("package.json must expose gate1:seed:test");
}

const jsonResult = await runNode(["scripts/gate1-seed-parity.mjs", "--json"]);
let plan = null;
try {
  plan = JSON.parse(jsonResult.stdout);
} catch {
  failures.push("gate1 seed parity --json must print JSON");
}

if (plan) {
  if (plan.status !== "planned") failures.push("seed parity plan must report status=planned");
  if (plan.fixturePath !== "packages/api-contracts/fixtures/gate0-smoke.json") failures.push("seed parity plan must include fixture path");
  if (plan.planPath !== ".thai-meet/gate1/seed-parity.json") failures.push("seed parity plan must include output path");
  if (plan.counts.users !== 2) failures.push("seed parity must map two users");
  if (plan.counts.publicIdentities !== 2) failures.push("seed parity must map two public identities");
  if (plan.counts.chatRooms !== 1) failures.push("seed parity must map one chat room");
  if (plan.counts.chatMessages < 2) failures.push("seed parity must map chat messages");
  if (plan.counts.contactExchanges < 5) failures.push("seed parity must map contact exchange lifecycle states");
  if (plan.rawProviderValuesStored !== false) failures.push("seed parity must not store raw provider values");
  if (!/^[a-f0-9]{64}$/.test(plan.safeHash || "")) failures.push("seed parity must expose a stable SHA-256 safe hash");
}

const rawFixture = await readFile("packages/api-contracts/fixtures/gate0-smoke.json", "utf8");
for (const forbidden of ["mock-line-contact", "facebook.example.invalid/mock-contact"]) {
  if (JSON.stringify(plan).includes(forbidden)) failures.push(`seed parity plan must not include raw fixture value ${forbidden}`);
  if (rawFixture.includes(forbidden)) failures.push(`fixture must not include raw provider value ${forbidden}`);
}

const fieldResult = await runNode(["scripts/gate1-seed-parity.mjs", "--field", "counts.users"]);
if (fieldResult.stdout.trim() !== "2") failures.push("seed parity field counts.users must print 2");

const policyResult = await runNode(["scripts/gate1-seed-parity.mjs", "--field", "rawProviderValuePolicy"]);
if (!policyResult.stdout.includes("never seed raw LINE/Facebook values")) {
  failures.push("seed parity policy field must describe raw provider value boundary");
}

if (failures.length > 0) {
  console.error("TM_GATE1_SEED_PARITY_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 seed parity OK");

async function runNode(args) {
  try {
    return await execFileAsync(process.execPath, args, {
      cwd: process.cwd(),
      env: process.env,
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
