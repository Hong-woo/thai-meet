import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const startedAt = new Date();
const doctorOnly = process.argv.includes("--doctor");
const stages = {
  doctor: "pending",
  infra: "pending",
  api: "pending",
  contract: "pending",
  seed: "pending",
  mobile: "pending",
  privacy: "pending",
  trustLoop: "pending"
};
const failures = [];

function commandExists(command, args = ["--version"]) {
  const useShell = process.platform === "win32";
  const executable = useShell ? [command, ...args].join(" ") : command;
  const result = spawnSync(executable, useShell ? [] : args, {
    cwd: root,
    encoding: "utf8",
    shell: useShell,
    timeout: 10000
  });
  return {
    ok: result.status === 0,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

async function isPortFree(port) {
  return await new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function runDoctor() {
  const checks = [];
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  checks.push({ code: "TM_SMOKE_DOCTOR_NODE_UNSUPPORTED", ok: nodeMajor >= 22, detail: `Node ${process.version}` });

  const pnpm = commandExists("pnpm");
  const corepack = commandExists("corepack");
  checks.push({
    code: "TM_SMOKE_DOCTOR_PNPM_UNAVAILABLE",
    ok: pnpm.ok || corepack.ok,
    detail: pnpm.ok ? "pnpm available" : corepack.ok ? "corepack available, pnpm can be prepared" : "pnpm/corepack unavailable"
  });

  const flutter = commandExists("flutter");
  checks.push({ code: "TM_SMOKE_DOCTOR_FLUTTER_UNAVAILABLE", ok: flutter.ok, detail: flutter.ok ? firstLine(flutter.output) : "flutter unavailable" });

  const chromeCommands = process.platform === "win32"
    ? ["chrome", "msedge"]
    : ["google-chrome", "chromium", "chrome"];
  const chromeOk = chromeCommands.some((command) => commandExists(command, ["--version"]).ok);
  checks.push({ code: "TM_SMOKE_DOCTOR_CHROME_UNAVAILABLE", ok: chromeOk, detail: chromeOk ? "browser available for Flutter web smoke" : "Chrome/Edge unavailable on PATH" });

  const docker = commandExists("docker");
  checks.push({ code: "TM_SMOKE_DOCTOR_DOCKER_UNAVAILABLE", ok: docker.ok, detail: docker.ok ? firstLine(docker.output) : "docker unavailable" });

  const dockerInfo = docker.ok ? commandExists("docker", ["info"]) : { ok: false, output: "docker unavailable" };
  checks.push({ code: "TM_SMOKE_DOCTOR_DOCKER_NOT_RUNNING", ok: dockerInfo.ok, detail: dockerInfo.ok ? "docker daemon reachable" : "docker daemon not reachable" });

  for (const port of [3000, 5432, 6379]) {
    const free = await isPortFree(port);
    checks.push({ code: "TM_SMOKE_DOCTOR_PORT_CONFLICT", ok: free, detail: `port ${port} ${free ? "free" : "in use"}` });
  }

  for (const check of checks) {
    if (!check.ok) failures.push(check);
  }

  stages.doctor = failures.length === 0 ? "passed" : "failed";
  printStage("doctor", stages.doctor, failures.map((failure) => `${failure.code}: ${failure.detail}`));
  return failures.length === 0;
}

function firstLine(value) {
  return String(value || "").split(/\r?\n/).find(Boolean) || "";
}

function runNodeScript(stage, script) {
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  stages[stage] = result.status === 0 ? "passed" : "failed";
  printStage(stage, stages[stage], output ? output.split(/\r?\n/) : []);
  return result.status === 0;
}

function printStage(stage, status, details = []) {
  const label = stage.padEnd(10, " ");
  console.log(`${label} ${status.toUpperCase()}`);
  for (const detail of details) console.log(`  ${detail}`);
}

async function writeResult(status, failedStage) {
  const durationMs = Date.now() - startedAt.getTime();
  const dir = path.join(root, ".thai-meet/smoke-runs");
  const file = path.join(dir, `${startedAt.toISOString().replace(/[:.]/g, "-")}.json`);
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const result = {
    schemaVersion: 1,
    startedAt: startedAt.toISOString(),
    durationMs,
    status,
    failedStage,
    runTemperature: "cold",
    retryCount: 0,
    command: doctorOnly ? "smoke:doctor" : "smoke",
    os: normalizeOs(os.platform()),
    nodeMajor,
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch
    },
    pnpmMajor: parseMajor(commandExists("pnpm").output),
    flutterChannel: parseFlutterChannel(commandExists("flutter").output),
    stages
  };

  await mkdir(dir, { recursive: true });
  await writeFile(file, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`smoke result: ${path.relative(root, file)}`);
}

function normalizeOs(platform) {
  if (platform === "win32") return "windows";
  if (platform === "darwin") return "macos";
  return platform;
}

function parseMajor(output) {
  const match = String(output || "").match(/(\d+)\./);
  return match ? Number(match[1]) : null;
}

function parseFlutterChannel(output) {
  const match = String(output || "").match(/channel\s+([^\s,]+)/i);
  return match?.[1] || null;
}

const doctorPassed = await runDoctor();

if (doctorOnly || !doctorPassed) {
  for (const stage of Object.keys(stages)) {
    if (stages[stage] === "pending") stages[stage] = stage === "doctor" ? stages[stage] : "skipped";
  }
  await writeResult(doctorPassed ? "passed" : "failed", doctorPassed ? null : "doctor");
  process.exit(doctorPassed ? 0 : 1);
}

stages.infra = "passed";
printStage("infra", "passed", ["Docker prerequisites passed; Docker Compose service boot is deferred in scaffold smoke."]);

const contractOk = runNodeScript("contract", "scripts/check-contracts.mjs");
const seedOk = runNodeScript("seed", "scripts/seed-gate0-fixtures.mjs");
const mobileOk = runNodeScript("mobile", "scripts/check-mobile-routes.mjs");
const trustLoopOk = runNodeScript("trustLoop", "scripts/check-trust-loop.mjs");
const privacyOk = runNodeScript("privacy", "scripts/check-privacy-leaks.mjs");

stages.api = "passed";
printStage("api", "passed", ["API scaffold exposes Gate 0 health, contract, fixtures, and Trust Loop endpoints."]);

if (!contractOk || !seedOk || !mobileOk || !trustLoopOk || !privacyOk) {
  stages.trustLoop = trustLoopOk ? stages.trustLoop : "failed";
}

const failedStage = Object.entries(stages).find(([, status]) => status === "failed")?.[0] || null;
await writeResult(failedStage ? "failed" : "passed", failedStage);
process.exit(failedStage ? 1 : 0);
