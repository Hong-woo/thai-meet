import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const expectedErrors = [
  {
    caseName: "missing-line-contact",
    status: 400,
    type: "validation_error",
    code: "TM_API_CONTACT_EXCHANGE_MISSING_LINE_CONTACT",
    param: "provider"
  },
  {
    caseName: "room-membership-required",
    status: 403,
    type: "permission_error",
    code: "TM_API_CONTACT_EXCHANGE_ROOM_MEMBERSHIP_REQUIRED",
    param: "roomId"
  },
  {
    caseName: "duplicate-idempotency-key",
    status: 409,
    type: "conflict_error",
    code: "TM_API_CONTACT_EXCHANGE_DUPLICATE_IDEMPOTENCY_KEY",
    param: "idempotencyKey"
  },
  {
    caseName: "contact-revoked",
    status: 409,
    type: "conflict_error",
    code: "TM_API_CONTACT_EXCHANGE_REVOKED",
    param: "contactExchangeId"
  },
  {
    caseName: "contact-reported",
    status: 409,
    type: "conflict_error",
    code: "TM_API_CONTACT_EXCHANGE_REPORTED",
    param: "contactExchangeId"
  },
  {
    caseName: "contact-blocked",
    status: 403,
    type: "permission_error",
    code: "TM_API_CONTACT_EXCHANGE_BLOCKED",
    param: "contactExchangeId"
  },
  {
    caseName: "provider-unavailable",
    status: 503,
    type: "provider_error",
    code: "TM_API_CONTACT_PROVIDER_UNAVAILABLE",
    param: "provider"
  }
];

const expectedRuntimeErrors = [
  "TM_GATE0_FIXTURE_STORE_INVALID_JSON",
  "TM_GATE0_FIXTURE_STORE_READ_FAILED",
  "TM_GATE0_FIXTURE_STORE_ROOT_INVALID",
  "TM_GATE0_PERSISTENCE_MODE_UNSUPPORTED",
  "TM_GATE0_SERVICE_STORE_INVALID",
  "TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED"
];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["errors:check"] !== "node scripts/check-error-envelope.mjs") {
  failures.push("package.json must expose errors:check");
}

const errorsDoc = await readFile(path.join(root, "docs/dev/ERRORS.md"), "utf8");
const openApi = JSON.parse(await readFile(path.join(root, "packages/api-contracts/openapi/gate0.openapi.json"), "utf8"));
if (!openApi.components?.schemas?.ErrorEnvelope) {
  failures.push("OpenAPI must define components.schemas.ErrorEnvelope");
}

for (const expected of expectedErrors) {
  if (!errorsDoc.includes(expected.code)) {
    failures.push(`docs/dev/ERRORS.md must document ${expected.code}`);
  }
  if (!JSON.stringify(openApi).includes(expected.code)) {
    failures.push(`OpenAPI must document ${expected.code}`);
  }
}

for (const code of expectedRuntimeErrors) {
  if (!errorsDoc.includes(code)) {
    failures.push(`docs/dev/ERRORS.md must document ${code}`);
  }
}

const child = spawn(process.execPath, ["apps/api/src/server.mjs"], {
  cwd: root,
  env: { ...process.env, API_PORT: "0" },
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  const port = await waitForServerPort(child);
  await waitForHealth(port);
  for (const expected of expectedErrors) {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/chats/rooms/room_gate0_local/contact-exchanges/line?case=${expected.caseName}`, {
      method: "POST"
    });
    const payload = await response.json();

    if (response.status !== expected.status) {
      failures.push(`${expected.caseName} must return HTTP ${expected.status}, got ${response.status}`);
    }

    const error = payload.error;
    if (!error) {
      failures.push(`${expected.caseName} must return an error envelope`);
      continue;
    }

    for (const field of ["type", "code", "message", "param", "requestId", "docRef"]) {
      if (!error[field]) failures.push(`${expected.caseName} error envelope missing ${field}`);
    }

    for (const field of ["type", "code", "param"]) {
      if (error[field] !== expected[field]) {
        failures.push(`${expected.caseName} ${field} must be ${expected[field]}, got ${error[field]}`);
      }
    }
  }
} catch (error) {
  failures.push(`error envelope API check failed: ${error.message}`);
} finally {
  await stopChild(child);
}

if (failures.length > 0) {
  console.error("TM_ERROR_ENVELOPE_CONTRACT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 error envelope contract OK");

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

async function waitForHealth(port) {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      const payload = await response.json();
      if (payload.status === "ok") return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("API health endpoint did not become ready");
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000))
  ]);
}
