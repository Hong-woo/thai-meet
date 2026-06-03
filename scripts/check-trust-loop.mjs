import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";

const root = process.cwd();
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));
const openApi = JSON.parse(await readFile(path.join(root, "packages/api-contracts/openapi/gate0.openapi.json"), "utf8"));

const requiredSteps = [
  "mockLogin",
  "publicIdGenerated",
  "discoverProfileVisible",
  "chatStarted",
  "lineContactExchangeCreated",
  "contactCardRendered",
  "reportBlockRecorded"
];

const requiredPaths = [
  "/api/v1/discover/profiles",
  "/api/v1/chats/rooms/{roomId}",
  "/api/v1/safety/reports",
  "/api/v1/safety/blocks"
];

const failures = [];

for (const step of requiredSteps) {
  if (!fixture.trustLoop?.steps?.includes(step)) {
    failures.push(`missing trustLoop step: ${step}`);
  }
}

for (const route of requiredPaths) {
  if (!openApi.paths?.[route]) {
    failures.push(`missing OpenAPI path: ${route}`);
  }
}

if (!fixture.chatRoom?.participantSnapshot?.every((participant) => participant.publicIdentityId && participant.displayName && !participant.rawLineId)) {
  failures.push("chatRoom participant snapshot must include public IDs and hide raw LINE IDs");
}

if (!fixture.chatMessages?.every((message) => !message.rawLineId && !message.rawContactValue && !message.lineId)) {
  failures.push("chat messages must not contain raw external contact values");
}

if (fixture.contactExchange?.provider !== "LINE" || !fixture.contactExchange?.permission?.canViewContactCard) {
  failures.push("LINE ContactExchange must expose a permission object");
}

if (fixture.contactCard?.provider !== "LINE" || fixture.contactCard?.copyRawValue !== false || fixture.contactCard?.valueRedacted !== true) {
  failures.push("LINE contact card must be redacted and prevent raw-value copy in Gate 0");
}

const eventTypes = new Set((fixture.safetyEvents || []).map((event) => event.type));
if (!eventTypes.has("report") || !eventTypes.has("block")) {
  failures.push("Trust Loop fixture must include report and block safety events");
}

await checkApiEndpoints(failures);

if (failures.length > 0) {
  console.error("TM_TRUST_LOOP_CONTRACT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 Trust Loop contract OK");

async function checkApiEndpoints(failures) {
  const port = 3765;
  const child = spawn(process.execPath, ["apps/api/src/server.mjs"], {
    cwd: root,
    env: { ...process.env, API_PORT: String(port) },
    stdio: "ignore"
  });

  try {
    await waitForHealth(port);

    const publicIdentity = await fetchJson(port, "/api/v1/public-identities/me");
    if (publicIdentity.publicId !== fixture.mockUser.publicId) {
      failures.push("public identity endpoint must return the mock user's Public Meet ID");
    }

    const discover = await fetchJson(port, "/api/v1/discover/profiles");
    if (!Array.isArray(discover.profiles) || discover.profiles[0]?.publicIdentityId !== fixture.discoverProfile.publicIdentityId) {
      failures.push("discover endpoint must return the seeded profile");
    }

    const chatRoom = await fetchJson(port, `/api/v1/chats/rooms/${fixture.chatRoom?.id || "room_gate0_local"}`);
    if (chatRoom.id !== fixture.chatRoom?.id || !Array.isArray(chatRoom.messages)) {
      failures.push("chat room endpoint must return the seeded room and messages");
    }

    const contactExchange = await fetchJson(port, `/api/v1/chats/rooms/${fixture.chatRoom?.id || "room_gate0_local"}/contact-exchanges/line`, "POST");
    if (contactExchange.contactExchange?.id !== fixture.contactExchange?.id || contactExchange.contactCard?.copyRawValue !== false) {
      failures.push("LINE contact exchange endpoint must return the permission object and redacted card");
    }

    const report = await fetchJson(port, "/api/v1/safety/reports", "POST");
    if (report.event?.type !== "report") {
      failures.push("report endpoint must return the seeded report event");
    }

    const block = await fetchJson(port, "/api/v1/safety/blocks", "POST");
    if (block.event?.type !== "block") {
      failures.push("block endpoint must return the seeded block event");
    }
  } catch (error) {
    failures.push(`API Trust Loop smoke failed: ${error.message}`);
  } finally {
    await stopChild(child);
  }
}

async function waitForHealth(port) {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    try {
      const health = await fetchJson(port, "/health");
      if (health.status === "ok") return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("API health endpoint did not become ready");
}

async function fetchJson(port, route, method = "GET") {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, { method });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`${method} ${route} returned ${response.status}`);
  }
  return payload;
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000))
  ]);
}
