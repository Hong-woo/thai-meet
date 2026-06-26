import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const failures = [];
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

if (packageJson.scripts?.["gate1:domain"] !== "node scripts/gate1-domain-preflight.mjs") {
  failures.push("package.json must expose gate1:domain");
}
if (packageJson.scripts?.["gate1:domain:test"] !== "node scripts/check-gate1-domain-preflight.mjs") {
  failures.push("package.json must expose gate1:domain:test");
}

const dryRun = await runNode(["scripts/gate1-domain-preflight.mjs", "--domain", "app.example.com", "--dry-run", "--json"]);
const dryRunJson = parseJson(dryRun.stdout, "domain dry-run stdout");
if (dryRun.status !== 0 || dryRunJson?.status !== "dry_run") failures.push("domain dry-run must pass and report status=dry_run");
if (dryRunJson?.baseUrl !== "https://app.example.com") failures.push("domain dry-run must normalize base URL");
if (dryRunJson?.providerUrls?.cognitoCallback !== "https://app.example.com/auth/callback/cognito") {
  failures.push("domain dry-run must report Cognito callback URL");
}
assertNoSecrets(dryRun.stdout, "domain dry-run stdout");
assertNoSecrets(dryRun.stderr, "domain dry-run stderr");

const sslip = await runNode(["scripts/gate1-domain-preflight.mjs", "--domain", "15-164-219-139.sslip.io", "--dry-run"]);
if (sslip.status === 0 || !sslip.stderr.includes("TM_GATE1_DOMAIN_SSLIP_REJECTED")) {
  failures.push("domain preflight must reject temporary sslip.io domains");
}

const rawIp = await runNode(["scripts/gate1-domain-preflight.mjs", "--domain", "15.164.219.139", "--dry-run"]);
if (rawIp.status === 0 || !rawIp.stderr.includes("TM_GATE1_DOMAIN_RAW_IP_REJECTED")) {
  failures.push("domain preflight must reject raw IP domains");
}

const field = await runNode(["scripts/gate1-domain-preflight.mjs", "--domain", "https://app.example.com/path", "--dry-run", "--field", "providerUrls.lineWebhook"]);
if (field.stdout.trim() !== "https://app.example.com/webhooks/line") {
  failures.push("domain --field providerUrls.lineWebhook must print normalized webhook URL");
}

const unknownOption = await runNode(["scripts/gate1-domain-preflight.mjs", "--wat"]);
if (unknownOption.status === 0 || !unknownOption.stderr.includes("TM_GATE1_DOMAIN_UNKNOWN_OPTION")) {
  failures.push("domain preflight must reject unknown options");
}

const server = await startHealthServer();
try {
  const localLive = await runNode([
    "scripts/gate1-domain-preflight.mjs",
    "--domain", `http://127.0.0.1:${server.port}`,
    "--allow-localhost",
    "--skip-dns",
    "--json"
  ]);
  const localJson = parseJson(localLive.stdout, "domain local live stdout");
  if (localLive.status !== 0 || localJson?.status !== "passed") {
    failures.push("domain preflight must pass against localhost test server when explicitly allowed");
  }
} finally {
  await server.close();
}

if (failures.length > 0) {
  console.error("TM_GATE1_DOMAIN_PREFLIGHT_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 domain preflight OK");

async function startHealthServer() {
  const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "thai-meet-api" }));
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not_found" }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  return {
    port: address.port,
    close: () => new Promise((resolve) => server.close(resolve))
  };
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
  for (const secret of ["LINE_CHANNEL_SECRET", "Channel secret", "x-line-signature"]) {
    if (text.includes(secret)) failures.push(`${label} must not include secret fragment ${secret}`);
  }
}
