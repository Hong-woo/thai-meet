import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["gate1:deploy-rehearsal"] !== "node scripts/gate1-deploy-rehearsal.mjs") {
  failures.push("package.json must expose gate1:deploy-rehearsal");
}
if (packageJson.scripts?.["gate1:deploy-rehearsal:test"] !== "node scripts/check-gate1-deploy-rehearsal.mjs") {
  failures.push("package.json must expose gate1:deploy-rehearsal:test");
}

const tempDir = await mkdtemp(path.join(tmpdir(), "thai-meet-gate1-deploy-rehearsal-"));
try {
  const blockedInventoryPath = path.join(tempDir, "blocked-inventory.json");
  await writeFile(blockedInventoryPath, JSON.stringify({
    status: "not_ready",
    environment: "production",
    secretOutputPolicy: "names-only",
    groups: {
      productionRuntime: { status: "not_ready", missingNames: ["DATABASE_URL"] },
      awsDeploy: { status: "not_ready", missingNames: ["ECS_SERVICE"] },
      androidRelease: { status: "ready", missingNames: [] }
    }
  }));

  const blockedResult = runRehearsal(["--json", "--inventory-json-file", blockedInventoryPath]);
  if (blockedResult.status === 0) {
    failures.push("deploy rehearsal must fail closed while GitHub production environment is not ready");
  }
  const blockedJson = parseJson(blockedResult.stdout, "blocked deploy rehearsal stdout");
  if (blockedJson?.status !== "blocked") failures.push("blocked deploy rehearsal must report status=blocked");
  if (blockedJson?.blocker !== "github_environment_not_ready") failures.push("blocked deploy rehearsal must report github environment blocker");
  if (blockedJson?.workflow !== "AWS CI Deploy") failures.push("deploy rehearsal must target AWS CI Deploy workflow");
  if (blockedJson?.workflowFile !== ".github/workflows/aws-ci-deploy.yml") failures.push("deploy rehearsal must report workflow file");
  if (blockedJson?.branch !== "main") failures.push("deploy rehearsal must target main branch");
  if (blockedJson?.environment !== "production") failures.push("deploy rehearsal must target production environment");
  if (blockedJson?.requiredPreflightCommand !== "npm run gate1:github-env -- --json") failures.push("deploy rehearsal must include GitHub env preflight command");
  if (blockedJson?.dispatchCommand !== "gh workflow run \"AWS CI Deploy\" --ref main") failures.push("deploy rehearsal must include manual dispatch command");
  if (blockedJson?.watchCommand !== "gh run list --workflow \"AWS CI Deploy\" --branch main --limit 1") failures.push("deploy rehearsal must include watch command");
  if (blockedJson?.missingNameCount !== 2) failures.push("blocked deploy rehearsal must count missing names");
  if (!Array.isArray(blockedJson?.remediationCommands)) failures.push("blocked deploy rehearsal must include remediationCommands");
  if (blockedJson?.remediationCommands?.[0] !== "npm run gate1:env -- --env-file .env.production.local --json") {
    failures.push("blocked deploy rehearsal must first preflight local production env file");
  }
  if (!blockedJson?.remediationCommands?.includes("npm run gate1:github-env:apply -- --env-file .env.production.local --plan")) {
    failures.push("blocked deploy rehearsal must include GitHub env apply plan command");
  }
  if (!blockedJson?.remediationCommands?.includes("npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json")) {
    failures.push("blocked deploy rehearsal must include GitHub env apply command");
  }
  if (blockedJson?.remediationCommandCount !== 4) failures.push("blocked deploy rehearsal must report remediation command count");
  assertNoSecretValues(blockedResult.stdout, "blocked deploy rehearsal stdout");

  const readyInventoryPath = path.join(tempDir, "ready-inventory.json");
  await writeFile(readyInventoryPath, JSON.stringify({
    status: "ready",
    environment: "production",
    secretOutputPolicy: "names-only",
    groups: {
      productionRuntime: { status: "ready", missingNames: [] },
      awsDeploy: { status: "ready", missingNames: [] },
      androidRelease: { status: "ready", missingNames: [] }
    }
  }));

  const readyResult = runRehearsal(["--json", "--inventory-json-file", readyInventoryPath]);
  if (readyResult.status !== 0) {
    failures.push(`ready deploy rehearsal must pass, got exit ${readyResult.status}`);
  }
  const readyJson = parseJson(readyResult.stdout, "ready deploy rehearsal stdout");
  if (readyJson?.status !== "ready") failures.push("ready deploy rehearsal must report status=ready");
  if (readyJson?.blocker !== "none") failures.push("ready deploy rehearsal must report blocker=none");
  if (readyJson?.missingNameCount !== 0) failures.push("ready deploy rehearsal must report no missing names");
  assertNoSecretValues(readyResult.stdout, "ready deploy rehearsal stdout");

  const fieldResult = runRehearsal(["--field", "dispatchCommand", "--inventory-json-file", readyInventoryPath]);
  if (fieldResult.status !== 0 || fieldResult.stdout.trim() !== "gh workflow run \"AWS CI Deploy\" --ref main") {
    failures.push("deploy rehearsal --field dispatchCommand must print dispatch command");
  }

  const emptyEqualsField = runRehearsal(["--field=", "--inventory-json-file", readyInventoryPath]);
  if (emptyEqualsField.status === 0 || !emptyEqualsField.stderr.includes("TM_GATE1_DEPLOY_REHEARSAL_OPTION_VALUE_REQUIRED: --field")) {
    failures.push("deploy rehearsal --field= must fail with TM_GATE1_DEPLOY_REHEARSAL_OPTION_VALUE_REQUIRED");
  }
  if (emptyEqualsField.stdout.trim().length > 0) {
    failures.push("deploy rehearsal --field= must not print rehearsal output");
  }

  const jsonPlanConflict = runRehearsal(["--json", "--plan", "--inventory-json-file", blockedInventoryPath]);
  if (jsonPlanConflict.status === 0) failures.push("deploy rehearsal must fail when --json and --plan are combined");
  if (!jsonPlanConflict.stderr.includes("TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT")) {
    failures.push("deploy rehearsal --json --plan must fail with TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT");
  }

  const jsonFieldConflict = runRehearsal(["--json", "--field", "status", "--inventory-json-file", readyInventoryPath]);
  if (jsonFieldConflict.status === 0) failures.push("deploy rehearsal must fail when --json and --field are combined");
  if (!jsonFieldConflict.stderr.includes("TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT")) {
    failures.push("deploy rehearsal --json --field must fail with TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT");
  }

  const fieldPlanConflict = runRehearsal(["--field", "status", "--plan", "--inventory-json-file", readyInventoryPath]);
  if (fieldPlanConflict.status === 0) failures.push("deploy rehearsal must fail when --field and --plan are combined");
  if (!fieldPlanConflict.stderr.includes("TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT")) {
    failures.push("deploy rehearsal --field --plan must fail with TM_GATE1_DEPLOY_REHEARSAL_OPTION_CONFLICT");
  }

  const planResult = runRehearsal(["--plan", "--inventory-json-file", blockedInventoryPath]);
  if (planResult.status === 0) failures.push("blocked deploy rehearsal plan must fail closed");
  if (!planResult.stdout.includes("Run first: npm run gate1:github-env -- --json")) {
    failures.push("blocked deploy rehearsal plan must include required preflight command");
  }
  if (!planResult.stdout.includes("Fix missing env: npm run gate1:env -- --env-file .env.production.local --json")) {
    failures.push("blocked deploy rehearsal plan must include local env-file remediation command");
  }
  if (!planResult.stdout.includes("Apply env: npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json")) {
    failures.push("blocked deploy rehearsal plan must include apply remediation command");
  }
  if (!planResult.stdout.includes("When ready: gh workflow run \"AWS CI Deploy\" --ref main")) {
    failures.push("deploy rehearsal plan must include dispatch command");
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error("TM_GATE1_DEPLOY_REHEARSAL_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 deploy rehearsal preflight OK");

function runRehearsal(args) {
  return spawnSync(process.execPath, ["scripts/gate1-deploy-rehearsal.mjs", ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    failures.push(`${label} must be JSON`);
    return null;
  }
}

function assertNoSecretValues(text, label) {
  for (const value of ["postgresql://", "gate1_secret", "line_secret", "keystore_password"]) {
    if (text.includes(value)) failures.push(`${label} must not print secret value ${value}`);
  }
}
