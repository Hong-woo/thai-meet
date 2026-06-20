import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-env-preflight.mjs [--json] [--field <name>] [--env-file <path>]");
  console.log("Fields: status, secretOutputPolicy, groups.productionRuntime.status, groups.awsDeploy.status, groups.androidRelease.status");
  process.exit(0);
}

const fieldIndex = args.indexOf("--field");
const fieldName = fieldIndex >= 0 ? args[fieldIndex + 1] : null;
const envFile = readOption("--env-file");
const jsonMode = args.includes("--json");
const envFileValues = envFile ? await readEnvFile(envFile) : {};
const env = envFile ? { ...process.env, ...envFileValues } : process.env;

const groups = {
  productionRuntime: checkGroup({
    requiredKeys: [
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
    ],
    expectedValues: {
      AUTH_MODE: "production",
      LINE_PROVIDER_MODE: "production",
      OBJECT_STORAGE_MODE: "s3",
      PERSISTENCE_MODE: "database"
    }
  }),
  awsDeploy: checkGroup({
    requiredKeys: [
      "AWS_DEPLOY_ROLE_ARN",
      "ECR_REPOSITORY",
      "ECS_CLUSTER",
      "ECS_SERVICE"
    ]
  }),
  androidRelease: checkGroup({
    requiredKeys: [
      "THAI_MEET_UPLOAD_KEYSTORE",
      "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
      "THAI_MEET_UPLOAD_KEY_ALIAS",
      "THAI_MEET_UPLOAD_KEY_PASSWORD"
    ]
  })
};

const summary = {
  status: Object.values(groups).every((group) => group.status === "ready") ? "ready" : "not_ready",
  secretOutputPolicy: "keys-only",
  groups
};

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_ENV_PREFLIGHT_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  printField(value);
  process.exit(summary.status === "ready" ? 0 : 1);
}

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`Gate 1 environment preflight ${summary.status}: secretOutputPolicy=${summary.secretOutputPolicy}`);
  for (const [name, group] of Object.entries(groups)) {
    console.log(`${name}: ${group.status}, missing=${group.missingKeys.length}, invalid=${group.invalidKeys.length}`);
  }
}

process.exit(summary.status === "ready" ? 0 : 1);

function checkGroup({ requiredKeys, expectedValues = {} }) {
  const missingKeys = [];
  const invalidKeys = [];
  const placeholderKeys = [];

  for (const key of requiredKeys) {
    if (!env[key]) {
      missingKeys.push(key);
    }
  }

  for (const [key, expected] of Object.entries(expectedValues)) {
    if (env[key] && env[key] !== expected) {
      invalidKeys.push(key);
    }
  }

  for (const key of requiredKeys) {
    if (envFileValues[key]?.includes("replace-with-")) {
      placeholderKeys.push(key);
    }
  }

  return {
    status: missingKeys.length === 0 && invalidKeys.length === 0 && placeholderKeys.length === 0 ? "ready" : "not_ready",
    requiredKeys,
    expectedValueKeys: Object.keys(expectedValues),
    missingKeys,
    invalidKeys,
    placeholderKeys
  };
}

async function readEnvFile(filePath) {
  try {
    const text = await readFile(filePath, "utf8");
    return parseEnvFile(text);
  } catch (error) {
    console.error(`TM_GATE1_ENV_FILE_READ_FAILED: ${error.message}`);
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

function readOption(name) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) return equalsArg.slice(name.length + 1);

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_ENV_PREFLIGHT_OPTION_VALUE_REQUIRED: ${name}`);
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
