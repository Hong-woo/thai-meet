import { spawn } from "node:child_process";
import { once } from "node:events";

const command = "db:migrate";
const doc = "docs/dev/GATE1_PERSISTENCE.md";
const databaseUrl = process.env.DATABASE_URL;
const args = process.argv.slice(2);
const shouldDryRun = args.includes("--dry-run");
const shouldJson = args.includes("--json") || shouldDryRun;

const previousQuiet = process.env.GATE1_PRISMA_SCAFFOLD_QUIET;
process.env.GATE1_PRISMA_SCAFFOLD_QUIET = "1";
await import("./check-gate1-prisma-scaffold.mjs");
if (previousQuiet === undefined) {
  delete process.env.GATE1_PRISMA_SCAFFOLD_QUIET;
} else {
  process.env.GATE1_PRISMA_SCAFFOLD_QUIET = previousQuiet;
}

if (!databaseUrl) {
  fail("TM_GATE1_DATABASE_URL_REQUIRED", "DATABASE_URL is required before running Gate 1 Prisma migrations.");
}

const metadata = getDatabaseUrlMetadata(databaseUrl);
if (metadata.status !== "valid") {
  fail("TM_GATE1_DATABASE_URL_INVALID", `DATABASE_URL must use postgresql or postgres protocol. protocol=${metadata.protocol}`);
}

const spawnOptions = getPrismaSpawnOptions();
const summary = {
  status: shouldDryRun ? "dry_run" : "ready",
  command,
  prismaCommand: `${spawnOptions.command} ${spawnOptions.args.join(" ")}`,
  spawnCommand: spawnOptions.command,
  spawnShell: spawnOptions.shell,
  databaseUrlStatus: metadata.status,
  databaseUrlProtocol: metadata.protocol,
  rawSecretsPrinted: false
};

if (shouldDryRun) {
  if (shouldJson) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Gate 1 migrate dry run OK: protocol=${summary.databaseUrlProtocol}, shell=${summary.spawnShell}`);
  }
  process.exit(0);
}

const child = spawn(spawnOptions.command, spawnOptions.args, {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: spawnOptions.shell
});

const [code, signal] = await once(child, "exit");
if (code !== 0) {
  process.exit(typeof code === "number" ? code : 1);
}
if (signal) {
  process.kill(process.pid, signal);
}

function fail(code, message) {
  console.error(code);
  console.error(`command=${command}`);
  console.error(`message=${message}`);
  console.error(`doc=${doc}`);
  process.exit(1);
}

function getDatabaseUrlMetadata(value) {
  try {
    const protocol = new URL(value).protocol.replace(/:$/, "");
    if (protocol === "postgresql" || protocol === "postgres") {
      return { status: "valid", protocol };
    }
    return { status: "invalid", protocol: protocol || "unknown" };
  } catch {
    return { status: "invalid", protocol: "unknown" };
  }
}

function getNpxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function getPrismaSpawnOptions() {
  if (process.platform === "win32") {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", "npx prisma migrate deploy --config prisma.config.ts"],
      shell: false
    };
  }

  return {
    command: getNpxCommand(),
    args: ["prisma", "migrate", "deploy", "--config", "prisma.config.ts"],
    shell: false
  };
}
