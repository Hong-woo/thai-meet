import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-deploy-rehearsal.mjs [--json] [--field <name>] [--plan]");
  console.log("Fields: status, blocker, workflow, workflowFile, branch, environment, dispatchCommand, watchCommand");
  process.exit(0);
}

const inventoryJsonFile = readOption("--inventory-json-file");
const fieldName = readOption("--field");
const jsonMode = args.includes("--json");
const planMode = args.includes("--plan");

const inventory = inventoryJsonFile
  ? await readJsonFile(inventoryJsonFile)
  : readInventory();

const missingNameCount = Object.values(inventory.groups ?? {})
  .reduce((count, group) => count + (Array.isArray(group.missingNames) ? group.missingNames.length : 0), 0);
const ready = inventory.status === "ready";

const summary = {
  status: ready ? "ready" : "blocked",
  blocker: ready ? "none" : "github_environment_not_ready",
  workflow: "AWS CI Deploy",
  workflowFile: ".github/workflows/aws-ci-deploy.yml",
  branch: "main",
  environment: inventory.environment ?? "production",
  requiredPreflightCommand: "npm run gate1:github-env -- --json",
  dispatchCommand: "gh workflow run \"AWS CI Deploy\" --ref main",
  watchCommand: "gh run list --workflow \"AWS CI Deploy\" --branch main --limit 1",
  missingNameCount,
  secretOutputPolicy: "names-only"
};

if (planMode) {
  printPlan(summary);
  process.exit(ready ? 0 : 1);
}

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_DEPLOY_REHEARSAL_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  printField(value);
  process.exit(ready ? 0 : 1);
}

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`Gate 1 deploy rehearsal ${summary.status}: workflow=${summary.workflow}, branch=${summary.branch}, environment=${summary.environment}`);
  console.log(`Run first: ${summary.requiredPreflightCommand}`);
  console.log(`When ready: ${summary.dispatchCommand}`);
  console.log(`Watch: ${summary.watchCommand}`);
}

process.exit(ready ? 0 : 1);

async function readJsonFile(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    console.error(`TM_GATE1_DEPLOY_REHEARSAL_JSON_READ_FAILED: ${error.message}`);
    process.exit(1);
  }
}

function readInventory() {
  const result = spawnSync(process.execPath, ["scripts/gate1-github-env-inventory.mjs", "--json"], {
    encoding: "utf8"
  });
  try {
    return JSON.parse(result.stdout);
  } catch {
    console.error("TM_GATE1_DEPLOY_REHEARSAL_INVENTORY_JSON_PARSE_FAILED");
    process.exit(1);
  }
}

function printPlan(value) {
  console.log(`Gate 1 deploy rehearsal ${value.status}:`);
  console.log(`Run first: ${value.requiredPreflightCommand}`);
  console.log(`When ready: ${value.dispatchCommand}`);
  console.log(`Watch: ${value.watchCommand}`);
}

function readOption(name) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) return equalsArg.slice(name.length + 1);

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_DEPLOY_REHEARSAL_OPTION_VALUE_REQUIRED: ${name}`);
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
