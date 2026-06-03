import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["smoke:metrics"] !== "node scripts/smoke-metrics.mjs") {
  failures.push("package.json must expose smoke:metrics");
}

await requireFile("scripts/smoke-metrics.mjs");
await requireFile("docs/dev/DX_METRICS.md");

const smokeSource = await readFile(path.join(root, "scripts/smoke.mjs"), "utf8");
for (const token of ["schemaVersion", "startedAt", "durationMs", "status", "failedStage", "runTemperature", "retryCount", "os", "nodeMajor", "pnpmMajor", "flutterChannel", "command", "runtime", "stages"]) {
  if (!smokeSource.includes(token)) {
    failures.push(`smoke result schema must include ${token}`);
  }
}

const workflow = await readFile(path.join(root, ".github/workflows/contract-drift.yml"), "utf8");
if (!workflow.includes("actions/upload-artifact@")) {
  failures.push("contract drift workflow must upload smoke run artifacts");
}
if (!workflow.includes(".thai-meet/smoke-runs/*.json")) {
  failures.push("contract drift workflow must upload .thai-meet/smoke-runs/*.json");
}

if (failures.length > 0) {
  console.error("TM_DX_METRICS_CONTRACT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 DX metrics contract OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}
