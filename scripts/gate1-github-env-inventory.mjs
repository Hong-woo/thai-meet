import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-github-env-inventory.mjs [--env <name>] [--json] [--field <name>] [--plan]");
  console.log("Fields: status, environment, secretOutputPolicy, groups.productionRuntime.status, groups.awsDeploy.status, groups.androidRelease.status");
  process.exit(0);
}

const environment = readOption("--env") ?? "production";
const secretJsonFile = readOption("--secret-json-file");
const variableJsonFile = readOption("--variable-json-file");
const fieldName = readOption("--field");
const jsonMode = args.includes("--json");
const planMode = args.includes("--plan");

const secretEntries = secretJsonFile
  ? await readJsonFile(secretJsonFile)
  : readGhNames(["secret", "list", "--env", environment, "--json", "name"], "TM_GATE1_GITHUB_ENV_SECRET_LIST_FAILED");
const variableEntries = variableJsonFile
  ? await readJsonFile(variableJsonFile)
  : readGhNames(["variable", "list", "--env", environment, "--json", "name"], "TM_GATE1_GITHUB_ENV_VARIABLE_LIST_FAILED");

const presentNames = new Set([
  ...secretEntries.map((entry) => entry.name).filter(Boolean),
  ...variableEntries.map((entry) => entry.name).filter(Boolean)
]);

const groups = {
  productionRuntime: checkNames([
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
    "DATABASE_URL"
  ]),
  awsDeploy: checkNames([
    "AWS_DEPLOY_ROLE_ARN",
    "ECR_REPOSITORY",
    "ECS_CLUSTER",
    "ECS_SERVICE"
  ]),
  androidRelease: checkNames([
    "THAI_MEET_UPLOAD_KEYSTORE",
    "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
    "THAI_MEET_UPLOAD_KEY_ALIAS",
    "THAI_MEET_UPLOAD_KEY_PASSWORD"
  ])
};

const summary = {
  status: Object.values(groups).every((group) => group.status === "ready") ? "ready" : "not_ready",
  environment,
  secretOutputPolicy: "names-only",
  inventory: {
    secretCount: secretEntries.length,
    variableCount: variableEntries.length,
    presentNameCount: presentNames.size
  },
  groups
};

if (planMode) {
  printProvisioningPlan(summary);
  process.exit(summary.status === "ready" ? 0 : 1);
}

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_GITHUB_ENV_INVENTORY_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  printField(value);
  process.exit(summary.status === "ready" ? 0 : 1);
}

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`Gate 1 GitHub environment inventory ${summary.status}: env=${environment}, secretOutputPolicy=${summary.secretOutputPolicy}`);
  for (const [name, group] of Object.entries(groups)) {
    console.log(`${name}: ${group.status}, missing=${group.missingNames.length}`);
  }
}

process.exit(summary.status === "ready" ? 0 : 1);

function checkNames(requiredNames) {
  const missingNames = requiredNames.filter((name) => !presentNames.has(name));
  return {
    status: missingNames.length === 0 ? "ready" : "not_ready",
    requiredNames,
    missingNames
  };
}

function printProvisioningPlan(value) {
  if (value.status === "ready") {
    console.log(`No missing GitHub ${environment} environment names.`);
    return;
  }

  console.log(`Gate 1 GitHub ${environment} environment provisioning plan:`);
  console.log("Replace placeholder values before running. Do not paste real secret values into logs.");

  const printed = new Set();
  for (const group of Object.values(value.groups)) {
    for (const name of group.missingNames) {
      if (printed.has(name)) continue;
      printed.add(name);
      console.log(`gh secret set ${name} --env ${environment} --body '<${name}>'`);
    }
  }
}

async function readJsonFile(filePath) {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`TM_GATE1_GITHUB_ENV_INVENTORY_JSON_READ_FAILED: ${error.message}`);
    process.exit(1);
  }
}

function readGhNames(ghArgs, errorCode) {
  const result = spawnSync("gh", ghArgs, { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(`${errorCode}: ${result.stderr.trim()}`);
    process.exit(1);
  }

  try {
    const parsed = JSON.parse(result.stdout);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("TM_GATE1_GITHUB_ENV_INVENTORY_GH_JSON_PARSE_FAILED");
    process.exit(1);
  }
}

function readOption(name) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) return equalsArg.slice(name.length + 1);

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_GITHUB_ENV_INVENTORY_OPTION_VALUE_REQUIRED: ${name}`);
    process.exit(1);
  }
  return value;
}

function getField(value, dottedPath) {
  return dottedPath.split(".").reduce((current, part) => {
    if (current === undefined || current === null) return undefined;
    return current[part];
  }, value);
}

function printField(value) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    console.log(String(value));
    return;
  }
  console.log(JSON.stringify(value, null, 2));
}
