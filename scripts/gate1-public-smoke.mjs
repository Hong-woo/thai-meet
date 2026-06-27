import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const shouldDryRun = args.includes("--dry-run");
const shouldJson = args.includes("--json") || shouldDryRun;
const fieldName = readOption("--field", false);
const envFile = readOption("--env-file", false);
const baseUrl = normalizeBaseUrl(readOption("--base-url", false) || process.env.GATE1_PUBLIC_BASE_URL || "https://www.thai-meet.com");
const expectedPersistenceMode = readOption("--expected-persistence-mode", false) || "database";
const expectedLineMode = readOption("--expected-line-mode", false) || "verified_idempotent_database";

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-public-smoke.mjs [--base-url <url>] [--env-file <path>] [--expected-persistence-mode <mode>] [--expected-line-mode <mode>] [--dry-run] [--json] [--field <name>]");
  console.log("Fields: status, baseUrl, requiredEnvKeys, checks, secretOutputPolicy");
  process.exit(0);
}

const envFileValues = envFile ? await readEnvFile(envFile) : {};
const env = { ...process.env, ...envFileValues };

const summary = {
  status: shouldDryRun ? "dry_run" : "ready",
  baseUrl,
  requiredEnvKeys: ["LINE_CHANNEL_SECRET"],
  expectedPersistenceMode,
  expectedLineMode,
  checks: [
    "health endpoint",
    "Cognito callback missing-code fail-closed",
    "Cognito callback invalid-code fail-closed",
    "LINE webhook signed idempotency"
  ],
  secretOutputPolicy: "keys/status only; never echo provider secrets or raw webhook payloads"
};

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_PUBLIC_SMOKE_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (shouldDryRun) {
  printSummary(summary);
  process.exit(0);
}

if (!env.LINE_CHANNEL_SECRET) {
  fail("TM_GATE1_PUBLIC_SMOKE_LINE_SECRET_REQUIRED", "LINE_CHANNEL_SECRET is required to sign webhook smoke payloads.");
}

const health = await fetchJson("/health");
if (health.response.status !== 200 || health.payload?.status !== "ok" || health.payload?.service !== "thai-meet-api") {
  fail("TM_GATE1_PUBLIC_SMOKE_HEALTH_FAILED", `health endpoint returned ${health.response.status}`);
}
if (health.payload?.persistenceMode !== expectedPersistenceMode) {
  fail("TM_GATE1_PUBLIC_SMOKE_PERSISTENCE_MODE_MISMATCH", `health persistenceMode did not match expected ${expectedPersistenceMode}`);
}

const missingCode = await fetchJson("/auth/callback/cognito");
if (missingCode.response.status !== 400 || missingCode.payload?.error?.code !== "TM_API_AUTH_CALLBACK_CODE_REQUIRED") {
  fail("TM_GATE1_PUBLIC_SMOKE_COGNITO_MISSING_CODE_FAILED", `Cognito missing-code check returned ${missingCode.response.status}`);
}

const invalidCode = await fetchJson(`/auth/callback/cognito?code=public-smoke-invalid-${Date.now()}`);
if (invalidCode.response.status !== 502 || invalidCode.payload?.error?.code !== "TM_API_AUTH_CALLBACK_TOKEN_EXCHANGE_FAILED") {
  fail("TM_GATE1_PUBLIC_SMOKE_COGNITO_INVALID_CODE_FAILED", `Cognito invalid-code check returned ${invalidCode.response.status}`);
}

const eventId = `public_smoke_${Date.now()}`;
const firstLine = await sendLineWebhook(eventId, env.LINE_CHANNEL_SECRET);
const secondLine = await sendLineWebhook(eventId, env.LINE_CHANNEL_SECRET);
if (
  firstLine.response.status !== 202 ||
  firstLine.payload?.eventHandlingMode !== expectedLineMode ||
  firstLine.payload?.acceptedEventCount !== 1 ||
  firstLine.payload?.duplicateEventCount !== 0
) {
  fail("TM_GATE1_PUBLIC_SMOKE_LINE_FIRST_FAILED", `LINE first webhook check returned ${firstLine.response.status}`);
}
if (
  secondLine.response.status !== 202 ||
  secondLine.payload?.eventHandlingMode !== expectedLineMode ||
  secondLine.payload?.acceptedEventCount !== 0 ||
  secondLine.payload?.duplicateEventCount !== 1
) {
  fail("TM_GATE1_PUBLIC_SMOKE_LINE_DUPLICATE_FAILED", `LINE duplicate webhook check returned ${secondLine.response.status}`);
}

summary.status = "passed";
printSummary(summary);

async function sendLineWebhook(eventId, secret) {
  const body = JSON.stringify({
    destination: "gate1-public-smoke",
    events: [{ webhookEventId: eventId, type: "message" }]
  });
  const signature = createHmac("sha256", secret).update(body).digest("base64");
  return await fetchJson("/webhooks/line", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-line-signature": signature
    },
    body
  });
}

async function fetchJson(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    fail("TM_GATE1_PUBLIC_SMOKE_JSON_FAILED", `public endpoint did not return JSON: ${pathname}`);
  }
  return { response, payload };
}

async function readEnvFile(filePath) {
  try {
    return parseEnvFile(await readFile(filePath, "utf8"));
  } catch (error) {
    fail("TM_GATE1_PUBLIC_SMOKE_ENV_FILE_READ_FAILED", error.message);
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
    if (/^[A-Z_][A-Z0-9_]*$/.test(key)) parsed[key] = unquote(value);
  }
  return parsed;
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function normalizeBaseUrl(value) {
  try {
    const url = new URL(value);
    return url.href.replace(/\/$/, "");
  } catch {
    fail("TM_GATE1_PUBLIC_SMOKE_BASE_URL_INVALID", "base URL must be an absolute URL.");
  }
}

function validateArgs(argv) {
  const known = new Set([
    "--base-url",
    "--dry-run",
    "--env-file",
    "--expected-line-mode",
    "--expected-persistence-mode",
    "--field",
    "--help",
    "--json"
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && ["--base-url", "--env-file", "--expected-line-mode", "--expected-persistence-mode", "--field"].includes(argv[index - 1])) continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--base-url=")) continue;
    if (arg.startsWith("--env-file=")) continue;
    if (arg.startsWith("--expected-line-mode=")) continue;
    if (arg.startsWith("--expected-persistence-mode=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_PUBLIC_SMOKE_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function readOption(name, required = true) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) {
    const value = equalsArg.slice(name.length + 1);
    if (!value && required) {
      console.error(`TM_GATE1_PUBLIC_SMOKE_OPTION_VALUE_REQUIRED: ${name}`);
      process.exit(1);
    }
    return value || null;
  }

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_PUBLIC_SMOKE_OPTION_VALUE_REQUIRED: ${name}`);
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

function printSummary(value) {
  if (shouldJson) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  console.log(`Gate 1 public smoke ${value.status}: baseUrl=${value.baseUrl}, expectedPersistenceMode=${value.expectedPersistenceMode}, expectedLineMode=${value.expectedLineMode}`);
}

function fail(code, message) {
  console.error(code);
  console.error(`message=${message}`);
  console.error("doc=docs/dev/EC2_OPERATIONS.md#verify");
  process.exit(1);
}
