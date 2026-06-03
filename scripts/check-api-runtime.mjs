import { spawn } from "node:child_process";
import { once } from "node:events";

const root = process.cwd();
const failures = [];

const child = spawn(process.execPath, ["apps/api/src/server.mjs"], {
  cwd: root,
  env: { ...process.env, API_PORT: "0" },
  stdio: ["ignore", "pipe", "pipe"]
});

try {
  const port = await waitForServerPort(child);

  const health = await fetchJson(port, "/health");
  if (health.status !== "ok" || health.service !== "thai-meet-api") {
    failures.push("health endpoint must expose the Thai Meet API scaffold");
  }

  const openApi = await fetchJson(port, "/openapi.json");
  if (openApi.openapi !== "3.0.3" || !openApi.paths?.["/api/v1/discover/profiles"]) {
    failures.push("OpenAPI endpoint must return the Gate 0 contract");
  }

  const fixture = await fetchJson(port, "/fixtures/gate0");
  if (!fixture.mockUser?.publicId || !fixture.contactExchange?.permission?.canViewContactCard) {
    failures.push("fixture endpoint must return the Gate 0 mock user and ContactExchange permission");
  }
} catch (error) {
  failures.push(`API runtime check failed: ${error.message}`);
} finally {
  await stopChild(child);
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

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1000))
  ]);
}
