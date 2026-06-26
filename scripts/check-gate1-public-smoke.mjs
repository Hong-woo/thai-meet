import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { once } from "node:events";

const root = process.cwd();
const failures = [];
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

if (packageJson.scripts?.["gate1:public-smoke"] !== "node scripts/gate1-public-smoke.mjs") {
  failures.push("package.json must expose gate1:public-smoke");
}
if (packageJson.scripts?.["gate1:public-smoke:test"] !== "node scripts/check-gate1-public-smoke.mjs") {
  failures.push("package.json must expose gate1:public-smoke:test");
}

const tempDir = await mkdtemp(path.join(tmpdir(), "thai-meet-public-smoke-"));
const api = await startApiServer(tempDir);
try {
  const dryRun = await runNode(["scripts/gate1-public-smoke.mjs", "--dry-run", "--json", "--base-url", api.baseUrl]);
  const dryRunJson = parseJson(dryRun.stdout, "public smoke dry-run stdout");
  if (dryRun.status !== 0 || dryRunJson?.status !== "dry_run") failures.push("public smoke dry-run must pass and report status=dry_run");
  if (!dryRunJson?.requiredEnvKeys?.includes("LINE_CHANNEL_SECRET")) failures.push("public smoke dry-run must report LINE_CHANNEL_SECRET as required");
  assertNoSecrets(dryRun.stdout, "public smoke dry-run stdout");
  assertNoSecrets(dryRun.stderr, "public smoke dry-run stderr");

  const missingSecret = await runNode(["scripts/gate1-public-smoke.mjs", "--base-url", api.baseUrl], { LINE_CHANNEL_SECRET: "" });
  if (missingSecret.status === 0 || !missingSecret.stderr.includes("TM_GATE1_PUBLIC_SMOKE_LINE_SECRET_REQUIRED")) {
    failures.push("public smoke must require LINE_CHANNEL_SECRET outside dry-run mode");
  }

  const envFile = path.join(tempDir, "production.env");
  await writeFile(envFile, "LINE_CHANNEL_SECRET=public_smoke_line_secret\n");
  const live = await runNode([
    "scripts/gate1-public-smoke.mjs",
    "--base-url", api.baseUrl,
    "--env-file", envFile,
    "--expected-persistence-mode", "fixture",
    "--expected-line-mode", "verified_idempotent_noop",
    "--json"
  ]);
  const liveJson = parseJson(live.stdout, "public smoke live stdout");
  if (live.status !== 0 || liveJson?.status !== "passed") failures.push("public smoke must pass against local signed provider endpoints");
  assertNoSecrets(live.stdout, "public smoke live stdout");
  assertNoSecrets(live.stderr, "public smoke live stderr");

  const field = await runNode(["scripts/gate1-public-smoke.mjs", "--dry-run", "--base-url", api.baseUrl, "--field", "checks.0"]);
  if (field.stdout.trim() !== "health endpoint") failures.push("public smoke --field checks.0 must print health endpoint");

  const unknownOption = await runNode(["scripts/gate1-public-smoke.mjs", "--wat"]);
  if (unknownOption.status === 0 || !unknownOption.stderr.includes("TM_GATE1_PUBLIC_SMOKE_UNKNOWN_OPTION")) {
    failures.push("public smoke must reject unknown options");
  }
} finally {
  await api.stop();
  await rm(tempDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error("TM_GATE1_PUBLIC_SMOKE_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 public smoke OK");

async function startApiServer(tempDir) {
  const fakeCognito = await startFakeCognito();
  const child = spawn(process.execPath, ["apps/api/src/server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      API_PORT: "0",
      LINE_CHANNEL_SECRET: "public_smoke_line_secret",
      AUTH_PROVIDER_ISSUER: fakeCognito.issuerUrl,
      AUTH_PROVIDER_AUDIENCE: "thai-meet-api"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const port = await waitForServerPort(child);
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    async stop() {
      await stopChild(child);
      await fakeCognito.close();
    }
  };
}

async function startFakeCognito() {
  const server = createServer(async (req, res) => {
    const address = server.address();
    if (req.method === "GET" && req.url === "/pool/.well-known/openid-configuration") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({
        issuer: `http://127.0.0.1:${address.port}/pool`,
        token_endpoint: `http://127.0.0.1:${address.port}/oauth2/token`
      }));
      return;
    }
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "invalid_grant" }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  return {
    issuerUrl: `http://127.0.0.1:${address.port}/pool`,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

async function waitForServerPort(child) {
  let buffer = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("API server did not report its bound port"));
    }, 5000);
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

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), new Promise((resolve) => setTimeout(resolve, 1000))]);
}

async function runNode(args, env = {}) {
  const child = spawn(process.execPath, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const [status] = await once(child, "exit");
  return { status, stdout, stderr };
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    failures.push(`${label} must be JSON`);
    return null;
  }
}

function assertNoSecrets(text, label) {
  for (const secret of ["public_smoke_line_secret", "x-line-signature", "webhookEventId"]) {
    if (text.includes(secret)) failures.push(`${label} must not include secret/raw payload fragment ${secret}`);
  }
}
