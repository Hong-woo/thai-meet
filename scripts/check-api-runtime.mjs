import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createGate0StoreFromEnv } from "../apps/api/src/gate0-store-factory.mjs";

const root = process.cwd();
const failures = [];
const lineWebhookSecret = "gate0_line_webhook_test_secret";

const serverSource = await readFile(path.join(root, "apps/api/src/server.mjs"), "utf8");
const gate0ServiceSource = await readFile(path.join(root, "apps/api/src/gate0-service.mjs"), "utf8");
const gate0StoreSource = await readFile(path.join(root, "apps/api/src/gate0-fixture-store.mjs"), "utf8").catch(() => "");
const gate1DatabaseStoreSource = await readFile(path.join(root, "apps/api/src/gate1-database-store.mjs"), "utf8").catch(() => "");
const gate0StoreFactorySource = await readFile(path.join(root, "apps/api/src/gate0-store-factory.mjs"), "utf8").catch(() => "");
if (!serverSource.includes("createGate0Service")) {
  failures.push("API server must route through the Gate 0 service boundary");
}
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const gate0ServiceTestSource = await readFile(path.join(root, "scripts/check-gate0-service.mjs"), "utf8").catch(() => "");
const gate0FixtureStoreTestSource = await readFile(path.join(root, "scripts/check-gate0-fixture-store.mjs"), "utf8").catch(() => "");
if (packageJson.scripts?.["api:service:test"] !== "node scripts/check-gate0-service.mjs") {
  failures.push("package.json must expose api:service:test");
}
if (packageJson.scripts?.["api:fixture-store:test"] !== "node scripts/check-gate0-fixture-store.mjs") {
  failures.push("package.json must expose api:fixture-store:test");
}
if (packageJson.scripts?.["gate1:database-store:test"] !== "node scripts/check-gate1-database-store.mjs") {
  failures.push("package.json must expose gate1:database-store:test");
}
for (const marker of ["Gate 0 service boundary OK", "TM_GATE0_SERVICE_CHECK_FAILED", "createGate0Service(store)", "readFixture"]) {
  if (!gate0ServiceTestSource.includes(marker)) {
    failures.push(`Gate 0 service test must include ${marker}`);
  }
}
for (const marker of ["Gate 0 fixture store OK", "TM_GATE0_FIXTURE_STORE_CHECK_FAILED", "TM_GATE0_FIXTURE_STORE_ROOT_INVALID", "TM_GATE0_FIXTURE_STORE_READ_FAILED", "TM_GATE0_FIXTURE_STORE_INVALID_JSON"]) {
  if (!gate0FixtureStoreTestSource.includes(marker)) {
    failures.push(`Gate 0 fixture store test must include ${marker}`);
  }
}
if (!serverSource.includes("createGate0StoreFromEnv")) {
  failures.push("API server must create the Gate 0 store through the persistence mode factory");
}
if (!gate0ServiceSource.includes("store.readFixture")) {
  failures.push("Gate 0 service must read fixtures through an injected store");
}
for (const member of ["createGate0FixtureStore", "readOpenApi", "readFixture"]) {
  if (!gate0StoreSource.includes(member)) {
    failures.push(`Gate 0 fixture store must expose ${member}`);
  }
}
for (const marker of ["createGate0StoreFromEnv", "PERSISTENCE_MODE", "fixture", "database", "TM_GATE0_PERSISTENCE_MODE_UNSUPPORTED"]) {
  if (!gate0StoreFactorySource.includes(marker)) {
    failures.push(`Gate 0 store factory must include ${marker}`);
  }
}
for (const marker of ["createGate1DatabaseStore", "TM_GATE1_DATABASE_CLIENT_UNAVAILABLE", "readOpenApi", "readFixture"]) {
  if (!gate1DatabaseStoreSource.includes(marker)) {
    failures.push(`Gate 1 database store must include ${marker}`);
  }
}
for (const member of ["getMyPublicIdentity", "listDiscoverProfiles", "createLineContactExchange", "createSafetyReport", "createSafetyBlock", "acceptLineWebhookEvents"]) {
  if (!gate0ServiceSource.includes(member)) {
    failures.push(`Gate 0 service must expose ${member}`);
  }
}

const defaultStore = createGate0StoreFromEnv(root, {});
if (defaultStore.mode !== "fixture" || typeof defaultStore.store?.readFixture !== "function") {
  failures.push("Gate 0 store factory must default to fixture mode");
}

const fixtureStore = createGate0StoreFromEnv(root, { PERSISTENCE_MODE: "fixture" });
if (fixtureStore.mode !== "fixture" || typeof fixtureStore.store?.readOpenApi !== "function") {
  failures.push("Gate 0 store factory must return the fixture store for PERSISTENCE_MODE=fixture");
}

const spacedFixtureStore = createGate0StoreFromEnv(root, { PERSISTENCE_MODE: " fixture " });
if (spacedFixtureStore.mode !== "fixture" || typeof spacedFixtureStore.store?.readFixture !== "function") {
  failures.push("Gate 0 store factory must trim PERSISTENCE_MODE before selecting the store");
}

const databaseStore = createGate0StoreFromEnv(root, { PERSISTENCE_MODE: "database" });
if (databaseStore.mode !== "database" || typeof databaseStore.store?.readFixture !== "function") {
  failures.push("Gate 0 store factory must return a database store for PERSISTENCE_MODE=database");
}
await assertRejects(
  () => databaseStore.store.readFixture(),
  "TM_GATE1_DATABASE_CLIENT_UNAVAILABLE",
  "Gate 1 database store must fail closed until DATABASE_URL and Prisma client are available"
);

assertThrows(
  () => createGate0StoreFromEnv(root, { PERSISTENCE_MODE: "wat" }),
  "TM_GATE0_PERSISTENCE_MODE_UNSUPPORTED",
  "Gate 0 store factory must fail closed for unknown persistence modes"
);

const child = spawn(process.execPath, ["apps/api/src/server.mjs"], {
  cwd: root,
  env: { ...process.env, API_PORT: "0", LINE_CHANNEL_SECRET: lineWebhookSecret },
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  const port = await waitForServerPort(child);

  const health = await fetchJson(port, "/health");
  if (health.status !== "ok" || health.service !== "thai-meet-api") {
    failures.push("health endpoint must expose the Thai Meet API scaffold");
  }
  if (health.persistenceMode !== "fixture") {
    failures.push(`health endpoint must expose persistenceMode=fixture, got ${health.persistenceMode}`);
  }

  const openApi = await fetchJson(port, "/openapi.json");
  if (openApi.openapi !== "3.0.3" || !openApi.paths?.["/api/v1/discover/profiles"]) {
    failures.push("OpenAPI endpoint must return the Gate 0 contract");
  }

  const fixture = await fetchJson(port, "/fixtures/gate0");
  if (!fixture.mockUser?.publicId || !fixture.contactExchange?.permission?.canViewContactCard) {
    failures.push("fixture endpoint must return the Gate 0 mock user and ContactExchange permission");
  }

  const missingCognitoCode = await fetchAnyJson(port, "/auth/callback/cognito");
  if (missingCognitoCode.status !== 400 || missingCognitoCode.payload?.error?.code !== "TM_API_AUTH_CALLBACK_CODE_REQUIRED") {
    failures.push("Cognito callback route must fail closed when code is missing");
  }

  const cognitoReserved = await fetchAnyJson(port, "/auth/callback/cognito?code=test-code");
  if (cognitoReserved.status !== 501 || cognitoReserved.payload?.error?.code !== "TM_API_AUTH_CALLBACK_NOT_IMPLEMENTED") {
    failures.push("Cognito callback route must reserve token exchange with 501 until implemented");
  }

  const unsignedLineWebhook = await fetchAnyJson(port, "/webhooks/line", { method: "POST", body: "{}" });
  if (unsignedLineWebhook.status !== 401 || unsignedLineWebhook.payload?.error?.code !== "TM_API_LINE_WEBHOOK_SIGNATURE_REQUIRED") {
    failures.push("LINE webhook route must require x-line-signature");
  }

  const invalidLineWebhook = await fetchAnyJson(port, "/webhooks/line", { method: "POST", headers: { "x-line-signature": "test-signature" }, body: "{}" });
  if (invalidLineWebhook.status !== 401 || invalidLineWebhook.payload?.error?.code !== "TM_API_LINE_WEBHOOK_SIGNATURE_INVALID") {
    failures.push("LINE webhook route must reject invalid x-line-signature");
  }

  const invalidLineWebhookJson = "{";
  const invalidLineWebhookJsonSignature = crypto.createHmac("sha256", lineWebhookSecret).update(invalidLineWebhookJson).digest("base64");
  const invalidLineWebhookPayload = await fetchAnyJson(port, "/webhooks/line", { method: "POST", headers: { "x-line-signature": invalidLineWebhookJsonSignature }, body: invalidLineWebhookJson });
  if (invalidLineWebhookPayload.status !== 400 || invalidLineWebhookPayload.payload?.error?.code !== "TM_API_LINE_WEBHOOK_PAYLOAD_INVALID") {
    failures.push("LINE webhook route must reject invalid JSON after signature verification");
  }

  const lineWebhookBody = JSON.stringify({
    events: [
      { webhookEventId: "line-webhook-event-runtime-001", type: "message" }
    ]
  });
  const lineWebhookSignature = crypto.createHmac("sha256", lineWebhookSecret).update(lineWebhookBody).digest("base64");
  const verifiedLineWebhook = await fetchAnyJson(port, "/webhooks/line", { method: "POST", headers: { "x-line-signature": lineWebhookSignature }, body: lineWebhookBody });
  if (verifiedLineWebhook.status !== 202 || verifiedLineWebhook.payload?.eventHandlingMode !== "verified_idempotent_noop" || verifiedLineWebhook.payload?.acceptedEventCount !== 1 || verifiedLineWebhook.payload?.duplicateEventCount !== 0) {
    failures.push("LINE webhook route must verify the signature and accept new events idempotently in no-op mode");
  }

  const duplicateLineWebhook = await fetchAnyJson(port, "/webhooks/line", { method: "POST", headers: { "x-line-signature": lineWebhookSignature }, body: lineWebhookBody });
  if (duplicateLineWebhook.status !== 202 || duplicateLineWebhook.payload?.acceptedEventCount !== 0 || duplicateLineWebhook.payload?.duplicateEventCount !== 1) {
    failures.push("LINE webhook route must count duplicate webhookEventId values idempotently");
  }
} catch (error) {
  failures.push(`API runtime check failed: ${error.message}`);
} finally {
  await stopChild(child);
}

const databaseChild = spawn(process.execPath, ["apps/api/src/server.mjs"], {
  cwd: root,
  env: { ...process.env, API_PORT: "0", PERSISTENCE_MODE: "database" },
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  const port = await waitForServerPort(databaseChild);

  const health = await fetchJson(port, "/health");
  if (health.persistenceMode !== "database") {
    failures.push(`database mode health endpoint must expose persistenceMode=database, got ${health.persistenceMode}`);
  }

  const scaffoldedRoute = await fetchAnyJson(port, "/fixtures/gate0");
  if (scaffoldedRoute.status !== 500) {
    failures.push(`database mode fixture route must fail closed with 500, got ${scaffoldedRoute.status}`);
  }
  if (scaffoldedRoute.payload?.error?.code !== "TM_GATE1_DATABASE_CLIENT_UNAVAILABLE") {
    failures.push("database mode fixture route must expose TM_GATE1_DATABASE_CLIENT_UNAVAILABLE error envelope");
  }
} catch (error) {
  failures.push(`API database-mode runtime check failed: ${error.message}`);
} finally {
  await stopChild(databaseChild);
}

if (failures.length > 0) {
  console.error("TM_API_RUNTIME_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 API runtime OK");

async function waitForServerPort(child) {
  let buffer = "";

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");

  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("API server did not report its bound port"));
    }, 3000);

    const onData = (chunk) => {
      buffer += chunk;
      const match = buffer.match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) {
        cleanup();
        resolve(Number(match[1]));
      }
    };

    const onExit = () => {
      cleanup();
      reject(new Error("API server exited before reporting its port"));
    };

    function cleanup() {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
      child.off("exit", onExit);
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", onExit);
  });
}

async function fetchJson(port, route) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`GET ${route} returned ${response.status}`);
  }
  return payload;
}

async function fetchAnyJson(port, route, options = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, options);
  return {
    status: response.status,
    payload: await response.json()
  };
}

function assertThrows(fn, expectedCode, message) {
  try {
    fn();
    failures.push(message);
  } catch (error) {
    if (!String(error.message).includes(expectedCode)) {
      failures.push(`${message}: expected ${expectedCode}, got ${error.message}`);
    }
  }
}

async function assertRejects(fn, expectedCode, message) {
  try {
    await fn();
    failures.push(message);
  } catch (error) {
    if (!String(error.message).includes(expectedCode)) {
      failures.push(`${message}: expected ${expectedCode}, got ${error.message}`);
    }
  }
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000))
  ]);
}
