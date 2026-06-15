import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const failures = [];

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
if (packageJson.scripts?.["not-scaffolded:test"] !== "node scripts/check-not-scaffolded.mjs") {
  failures.push("package.json must expose not-scaffolded:test");
}

const helpResult = await runNode(["scripts/not-scaffolded.mjs", "--help"]);
if (helpResult.code !== 0) failures.push("not-scaffolded --help must pass");
for (const term of ["Usage: node scripts/not-scaffolded.mjs <command> <message> <docPath>", "TM_COMMAND_NOT_SCAFFOLDED", "command=", "message=", "doc="]) {
  if (!helpResult.stdout.includes(term)) failures.push(`not-scaffolded --help must include ${term}`);
}

const migrateResult = await runNpm(["run", "db:migrate"]);
const migrateOutput = `${migrateResult.stdout}\n${migrateResult.stderr}`;
if (migrateResult.code === 0) failures.push("db:migrate must fail until Prisma migrations are scaffolded");
if (!migrateOutput.includes("TM_COMMAND_NOT_SCAFFOLDED")) failures.push("db:migrate must print TM_COMMAND_NOT_SCAFFOLDED");
if (!migrateOutput.includes("command=db:migrate")) failures.push("db:migrate must print command=db:migrate");
if (!migrateOutput.includes("docs/dev/GATE1_PERSISTENCE.md")) failures.push("db:migrate must point to Gate 1 persistence docs");

const directResult = await runNode(["scripts/not-scaffolded.mjs", "demo:task", "Demo task not ready.", "docs/dev/ROADMAP.md"]);
if (directResult.code !== 1) failures.push("not-scaffolded helper must fail");
if (!directResult.stderr.includes("command=demo:task")) failures.push("not-scaffolded helper must print command name");
if (!directResult.stderr.includes("Demo task not ready.")) failures.push("not-scaffolded helper must print message");
if (!directResult.stderr.includes("docs/dev/ROADMAP.md")) failures.push("not-scaffolded helper must print doc path");

if (failures.length > 0) {
  console.error("TM_NOT_SCAFFOLDED_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Not-scaffolded command guard OK");

async function runNpm(args) {
  if (process.platform === "win32") {
    return runCommand("cmd.exe", ["/d", "/s", "/c", ["npm", ...args].join(" ")]);
  }
  return runCommand("npm", args);
}

async function runNode(args) {
  return runCommand(process.execPath, args);
}

async function runCommand(command, args) {
  try {
    const result = await execFileAsync(command, args, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024
    });
    return { ...result, code: 0 };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || "",
      code: error.code
    };
  }
}
