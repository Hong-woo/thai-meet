import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, ".thai-meet/smoke-runs");
const runs = await readRuns();

if (runs.length === 0) {
  console.log("No smoke runs found. Run npm run smoke:doctor or pnpm smoke first.");
  process.exit(0);
}

const latest = runs.at(-1);
const passCount = runs.filter((run) => run.status === "passed").length;
const failCount = runs.length - passCount;
const durations = runs.map((run) => Number(run.durationMs)).filter(Number.isFinite);
const avgDurationMs = durations.length > 0
  ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
  : 0;

console.log("Gate 0 DX Metrics");
console.log(`runs: ${runs.length}`);
console.log(`passed: ${passCount}`);
console.log(`failed: ${failCount}`);
console.log(`avgDurationMs: ${avgDurationMs}`);
console.log(`latestStatus: ${latest.status}`);
console.log(`latestFailedStage: ${latest.failedStage || "none"}`);
console.log(`latestRunTemperature: ${latest.runTemperature || "unknown"}`);
console.log(`latestStartedAt: ${latest.startedAt}`);

async function readRuns() {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }

  const jsonFiles = entries
    .filter((entry) => entry.endsWith(".json"))
    .sort();

  const parsed = [];
  for (const file of jsonFiles) {
    try {
      const data = JSON.parse(await readFile(path.join(dir, file), "utf8"));
      parsed.push(data);
    } catch {
      continue;
    }
  }

  return parsed;
}
