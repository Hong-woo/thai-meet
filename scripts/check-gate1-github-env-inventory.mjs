import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["gate1:github-env"] !== "node scripts/gate1-github-env-inventory.mjs") {
  failures.push("package.json must expose gate1:github-env");
}
if (packageJson.scripts?.["gate1:github-env:test"] !== "node scripts/check-gate1-github-env-inventory.mjs") {
  failures.push("package.json must expose gate1:github-env:test");
}

const tempDir = await mkdtemp(path.join(tmpdir(), "thai-meet-gate1-github-env-"));
try {
  const emptySecretsPath = path.join(tempDir, "empty-secrets.json");
  const emptyVariablesPath = path.join(tempDir, "empty-variables.json");
  await writeFile(emptySecretsPath, "[]");
  await writeFile(emptyVariablesPath, "[]");

  const missingResult = runInventory(["--json", "--secret-json-file", emptySecretsPath, "--variable-json-file", emptyVariablesPath]);
  if (missingResult.status === 0) {
    failures.push("github env inventory must fail closed when required names are missing");
  }
  const missingJson = parseJson(missingResult.stdout, "missing github env inventory stdout");
  if (missingJson?.status !== "not_ready") {
    failures.push("missing github env inventory must report status=not_ready");
  }
  if (missingJson?.environment !== "production") {
    failures.push("github env inventory must default to production environment");
  }
  if (missingJson?.secretOutputPolicy !== "names-only") {
    failures.push("github env inventory must report secretOutputPolicy=names-only");
  }
  if (!missingJson?.groups?.productionRuntime?.missingNames?.includes("DATABASE_URL")) {
    failures.push("missing github env inventory must include DATABASE_URL under productionRuntime missingNames");
  }
  if (!missingJson?.groups?.productionRuntime?.missingNames?.includes("LINE_WEBHOOK_EVENT_STORE_MODE")) {
    failures.push("missing github env inventory must include LINE_WEBHOOK_EVENT_STORE_MODE under productionRuntime missingNames");
  }
  if (!missingJson?.groups?.awsDeploy?.missingNames?.includes("EC2_HOST")) {
    failures.push("missing github env inventory must include EC2_HOST under awsDeploy missingNames");
  }
  if (!missingJson?.groups?.androidRelease?.missingNames?.includes("THAI_MEET_UPLOAD_KEYSTORE_PASSWORD")) {
    failures.push("missing github env inventory must include Android release secret names");
  }

  const jsonPlanConflict = runInventory(["--json", "--plan", "--secret-json-file", emptySecretsPath, "--variable-json-file", emptyVariablesPath]);
  if (jsonPlanConflict.status === 0) failures.push("github env inventory must fail when --json and --plan are combined");
  if (!jsonPlanConflict.stderr.includes("TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT")) {
    failures.push("github env inventory --json --plan must fail with TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT");
  }

  const jsonFieldConflict = runInventory(["--json", "--field", "status", "--secret-json-file", emptySecretsPath, "--variable-json-file", emptyVariablesPath]);
  if (jsonFieldConflict.status === 0) failures.push("github env inventory must fail when --json and --field are combined");
  if (!jsonFieldConflict.stderr.includes("TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT")) {
    failures.push("github env inventory --json --field must fail with TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT");
  }

  const fieldPlanConflict = runInventory(["--field", "status", "--plan", "--secret-json-file", emptySecretsPath, "--variable-json-file", emptyVariablesPath]);
  if (fieldPlanConflict.status === 0) failures.push("github env inventory must fail when --field and --plan are combined");
  if (!fieldPlanConflict.stderr.includes("TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT")) {
    failures.push("github env inventory --field --plan must fail with TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_CONFLICT");
  }

  const planResult = runInventory(["--plan", "--secret-json-file", emptySecretsPath, "--variable-json-file", emptyVariablesPath]);
  if (planResult.status === 0) {
    failures.push("github env provisioning plan must fail closed while missing names remain");
  }
  if (!planResult.stdout.includes("gh variable set AWS_REGION --env production --body '<AWS_REGION>'")) {
    failures.push("github env provisioning plan must include AWS_REGION variable set command with placeholder");
  }
  if (planResult.stdout.includes("gh secret set AWS_REGION --env production")) {
    failures.push("github env provisioning plan must not put AWS_REGION in secrets");
  }
  if (!planResult.stdout.includes("gh variable set EC2_HOST --env production --body '<EC2_HOST>'")) {
    failures.push("github env provisioning plan must include EC2_HOST variable set command with placeholder");
  }
  if (!planResult.stdout.includes("gh variable set EC2_USER --env production --body '<EC2_USER>'")) {
    failures.push("github env provisioning plan must include EC2_USER variable set command with placeholder");
  }
  if (!planResult.stdout.includes("gh secret set EC2_SSH_PRIVATE_KEY_B64 --env production --body '<EC2_SSH_PRIVATE_KEY_B64>'")) {
    failures.push("github env provisioning plan must include EC2 SSH key secret set command with placeholder");
  }
  if (!planResult.stdout.includes("gh secret set DATABASE_URL --env production --body '<DATABASE_URL>'")) {
    failures.push("github env provisioning plan must include DATABASE_URL secret set command with placeholder");
  }
  if (!planResult.stdout.includes("gh variable set LINE_WEBHOOK_EVENT_STORE_MODE --env production --body '<LINE_WEBHOOK_EVENT_STORE_MODE>'")) {
    failures.push("github env provisioning plan must include LINE webhook event store mode variable set command with placeholder");
  }
  if (!planResult.stdout.includes("gh variable set EC2_SERVICE_NAME --env production --body '<EC2_SERVICE_NAME>'")) {
    failures.push("github env provisioning plan must include EC2 service variable set command with placeholder");
  }
  if (!planResult.stdout.includes("gh secret set THAI_MEET_UPLOAD_KEYSTORE_PASSWORD --env production --body '<THAI_MEET_UPLOAD_KEYSTORE_PASSWORD>'")) {
    failures.push("github env provisioning plan must include Android release password secret set command with placeholder");
  }
  if (!planResult.stdout.includes("Preferred stdin-only apply flow:")) {
    failures.push("github env provisioning plan must include preferred stdin-only apply flow");
  }
  if (!planResult.stdout.includes("npm run gate1:env -- --env-file .env.production.local --json")) {
    failures.push("github env provisioning plan must include local env-file preflight command");
  }
  if (!planResult.stdout.includes("npm run gate1:github-env:apply -- --env-file .env.production.local --plan")) {
    failures.push("github env provisioning plan must include apply preview command");
  }
  if (!planResult.stdout.includes("npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json")) {
    failures.push("github env provisioning plan must include stdin-only apply command");
  }
  assertNoValues(planResult.stdout, "github env provisioning plan stdout");
  assertNoValues(planResult.stderr, "github env provisioning plan stderr");

  const allNames = [
    "AUTH_MODE",
    "AUTH_PROVIDER_JWKS_URL",
    "AUTH_PROVIDER_ISSUER",
    "AUTH_PROVIDER_AUDIENCE",
    "LINE_PROVIDER_MODE",
    "LINE_CHANNEL_ID",
    "LINE_CHANNEL_SECRET",
    "OBJECT_STORAGE_MODE",
    "AWS_REGION",
    "S3_BUCKET_PUBLIC_ASSETS",
    "PERSISTENCE_MODE",
    "DATABASE_URL",
    "LINE_WEBHOOK_EVENT_STORE_MODE",
    "EC2_HOST",
    "EC2_USER",
    "EC2_SSH_PRIVATE_KEY_B64",
    "EC2_APP_DIR",
    "EC2_SERVICE_NAME",
    "THAI_MEET_UPLOAD_KEYSTORE",
    "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
    "THAI_MEET_UPLOAD_KEY_ALIAS",
    "THAI_MEET_UPLOAD_KEY_PASSWORD"
  ];
  const readySecretsPath = path.join(tempDir, "ready-secrets.json");
  const readyVariablesPath = path.join(tempDir, "ready-variables.json");
  await writeFile(readySecretsPath, JSON.stringify(allNames.map((name) => ({ name, updatedAt: "2026-06-20T00:00:00Z" }))));
  await writeFile(readyVariablesPath, JSON.stringify([
    { name: "AWS_REGION", value: "ap-southeast-1" },
    { name: "EC2_HOST", value: "gate1_ec2_host_should_not_print" }
  ]));

  const readyResult = runInventory(["--json", "--secret-json-file", readySecretsPath, "--variable-json-file", readyVariablesPath]);
  if (readyResult.status !== 0) {
    failures.push(`ready github env inventory must pass, got exit ${readyResult.status}`);
  }
  const readyJson = parseJson(readyResult.stdout, "ready github env inventory stdout");
  if (readyJson?.status !== "ready") {
    failures.push("ready github env inventory must report status=ready");
  }
  if (readyJson?.groups?.productionRuntime?.status !== "ready") {
    failures.push("ready github env inventory must report productionRuntime ready");
  }
  if (readyJson?.groups?.awsDeploy?.status !== "ready") {
    failures.push("ready github env inventory must report awsDeploy ready");
  }
  if (readyJson?.groups?.androidRelease?.status !== "ready") {
    failures.push("ready github env inventory must report androidRelease ready");
  }
  assertNoValues(readyResult.stdout, "ready github env inventory stdout");
  assertNoValues(readyResult.stderr, "ready github env inventory stderr");

  const fieldResult = runInventory(["--field", "groups.awsDeploy.status", "--secret-json-file", readySecretsPath, "--variable-json-file", readyVariablesPath]);
  if (fieldResult.status !== 0 || fieldResult.stdout.trim() !== "ready") {
    failures.push("github env inventory --field groups.awsDeploy.status must print ready");
  }

  const emptyEqualsField = runInventory(["--field=", "--secret-json-file", readySecretsPath, "--variable-json-file", readyVariablesPath]);
  if (emptyEqualsField.status === 0 || !emptyEqualsField.stderr.includes("TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_VALUE_REQUIRED: --field")) {
    failures.push("github env inventory --field= must fail with TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_VALUE_REQUIRED");
  }
  if (emptyEqualsField.stdout.trim().length > 0) {
    failures.push("github env inventory --field= must not print inventory output");
  }

  const readyPlanResult = runInventory(["--plan", "--secret-json-file", readySecretsPath, "--variable-json-file", readyVariablesPath]);
  if (readyPlanResult.status !== 0) {
    failures.push("ready github env provisioning plan must pass");
  }
  if (!readyPlanResult.stdout.includes("No missing GitHub production environment names.")) {
    failures.push("ready github env provisioning plan must report no missing names");
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error("TM_GATE1_GITHUB_ENV_INVENTORY_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 GitHub environment inventory OK");

function runInventory(args) {
  return spawnSync(process.execPath, ["scripts/gate1-github-env-inventory.mjs", ...args], {
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

function assertNoValues(text, label) {
  for (const value of ["ap-southeast-1", "gate1_ec2_host_should_not_print", "2026-06-20T00:00:00Z"]) {
    if (text.includes(value)) {
      failures.push(`${label} must not print inventory value ${value}`);
    }
  }
}
