import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

const requiredNames = [
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
const variableNames = new Set([
  "AUTH_MODE",
  "AUTH_PROVIDER_JWKS_URL",
  "AUTH_PROVIDER_ISSUER",
  "AUTH_PROVIDER_AUDIENCE",
  "LINE_PROVIDER_MODE",
  "LINE_CHANNEL_ID",
  "OBJECT_STORAGE_MODE",
  "AWS_REGION",
  "S3_BUCKET_PUBLIC_ASSETS",
  "PERSISTENCE_MODE",
  "EC2_HOST",
  "EC2_USER",
  "EC2_APP_DIR",
  "EC2_SERVICE_NAME",
  "THAI_MEET_UPLOAD_KEYSTORE",
  "THAI_MEET_UPLOAD_KEY_ALIAS"
]);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-github-env-apply.mjs --env-file <path> [--env <name>] [--json] [--plan] [--apply]");
  console.log("Dry-run is default. --apply writes GitHub environment variables/secrets using gh and stdin.");
  console.log("Use only one of --plan or --apply.");
  process.exit(0);
}

const envFile = readOption("--env-file");
if (!envFile) {
  console.error("TM_GATE1_GITHUB_ENV_APPLY_ENV_FILE_REQUIRED");
  process.exit(1);
}

const environment = readOption("--env") ?? "production";
const ghBin = readOption("--gh-bin") ?? "gh";
const ghBinArgs = readRepeatedOption("--gh-bin-arg");
const jsonMode = args.includes("--json");
const planMode = args.includes("--plan");
const applyMode = args.includes("--apply");

if (planMode && applyMode) {
  console.error("TM_GATE1_GITHUB_ENV_APPLY_MODE_CONFLICT: use only one of --plan or --apply");
  process.exit(1);
}

const envValues = parseEnvFile(await readEnvFile(envFile));
const missingKeys = requiredNames.filter((name) => !envValues[name]);

if (missingKeys.length > 0) {
  console.error(`TM_GATE1_GITHUB_ENV_APPLY_MISSING_KEYS: ${missingKeys.join(",")}`);
  process.exit(1);
}

const placeholderKeys = requiredNames.filter((name) => hasPlaceholderValue(envValues[name]));
if (placeholderKeys.length > 0) {
  console.error(`TM_GATE1_GITHUB_ENV_APPLY_PLACEHOLDER_VALUES: ${placeholderKeys.join(",")}`);
  process.exit(1);
}

const entries = requiredNames.map((name) => ({
  name,
  resource: variableNames.has(name) ? "variable" : "secret",
  value: envValues[name]
}));
const variableEntries = entries.filter((entry) => entry.resource === "variable");
const secretEntries = entries.filter((entry) => entry.resource === "secret");
const commands = entries.map((entry) => ({
  resource: entry.resource,
  name: entry.name,
  environment,
  stdin: true
}));
const summary = {
  mode: applyMode ? "apply" : "dry-run",
  environment,
  secretOutputPolicy: "names-only",
  variableCount: variableEntries.length,
  secretCount: secretEntries.length,
  commandCount: commands.length,
  appliedCount: 0,
  commands
};

if (planMode) {
  printPlan(commands);
  process.exit(0);
}

if (applyMode) {
  for (const entry of entries) {
    const result = spawnSync(ghBin, [...ghBinArgs, entry.resource, "set", entry.name, "--env", environment], {
      input: `${entry.value}\n`,
      encoding: "utf8"
    });
    if (result.status !== 0) {
      console.error(`TM_GATE1_GITHUB_ENV_APPLY_GH_FAILED: ${entry.resource}:${entry.name}`);
      if (result.stderr) console.error(redactKnownValues(result.stderr, entries));
      process.exit(1);
    }
    summary.appliedCount += 1;
  }
}

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`Gate 1 GitHub environment apply ${summary.mode}: env=${environment}, variables=${summary.variableCount}, secrets=${summary.secretCount}, commands=${summary.commandCount}`);
}

function printPlan(value) {
  console.log(`Gate 1 GitHub ${environment} environment apply plan:`);
  for (const command of value) {
    console.log(`gh ${command.resource} set ${command.name} --env ${command.environment} <stdin>`);
  }
}

async function readEnvFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    console.error(`TM_GATE1_GITHUB_ENV_APPLY_ENV_FILE_READ_FAILED: ${error.message}`);
    process.exit(1);
  }
}

function parseEnvFile(text) {
  const parsed = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) continue;
    parsed[key] = unquote(value);
  }
  return parsed;
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function hasPlaceholderValue(value) {
  return value.includes("replace-with-");
}

function readOption(name) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) return equalsArg.slice(name.length + 1);

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_GITHUB_ENV_APPLY_OPTION_VALUE_REQUIRED: ${name}`);
    process.exit(1);
  }
  return value;
}

function readRepeatedOption(name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === name) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        console.error(`TM_GATE1_GITHUB_ENV_APPLY_OPTION_VALUE_REQUIRED: ${name}`);
        process.exit(1);
      }
      values.push(value);
      index += 1;
    } else if (arg.startsWith(`${name}=`)) {
      values.push(arg.slice(name.length + 1));
    }
  }
  return values;
}

function redactKnownValues(text, values) {
  return values.reduce((current, entry) => current.split(entry.value).join("<redacted>"), text);
}
