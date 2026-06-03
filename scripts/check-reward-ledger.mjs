import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["rewards:check"] !== "node scripts/check-reward-ledger.mjs") {
  failures.push("package.json must expose rewards:check");
}

await requireFile("docs/dev/REWARD_LEDGER.md");
await requireFile("packages/api-contracts/fixtures/reward-ledger.json");

const doc = await readIfExists("docs/dev/REWARD_LEDGER.md");
for (const term of [
  "append-only",
  "idempotencyKey",
  "RewardLedger",
  "RewardConsumption",
  "EXTRA_MESSAGE",
  "EXTRA_LINE_SHARE",
  "EXTRA_FACEBOOK_SHARE",
  "BOOST",
  "AdMob",
  "Gate 2",
  "transactional and idempotent"
]) {
  if (!doc.includes(term)) failures.push(`docs/dev/REWARD_LEDGER.md must include ${term}`);
}

const dbDoc = await readFile(path.join(root, "docs/dev/DB_CONSTRAINTS.md"), "utf8");
for (const term of [
  "RewardConsumption",
  "index(rewardLedgerId)",
  "index(actionType, actionId)",
  "Reward grant and reward consumption must be transactional and idempotent"
]) {
  if (!dbDoc.includes(term)) failures.push(`docs/dev/DB_CONSTRAINTS.md must include ${term}`);
}

const flagsDoc = await readFile(path.join(root, "docs/dev/FEATURE_FLAGS.md"), "utf8");
if (!flagsDoc.includes("REWARDED_ADS_ENABLED") || !flagsDoc.includes("false")) {
  failures.push("feature flags must keep REWARDED_ADS_ENABLED default false");
}

const fixture = await readJsonIfExists("packages/api-contracts/fixtures/reward-ledger.json");
if (!fixture) {
  failures.push("reward ledger fixture must be valid JSON");
} else {
  if (fixture.rewardsEnabled !== false) failures.push("reward ledger fixture must keep rewardsEnabled false for Gate 0");
  if (fixture.policy?.appendOnly !== true) failures.push("reward ledger policy must be append-only");
  if (!fixture.grant?.idempotencyKey) failures.push("reward grant must include idempotencyKey");
  if (fixture.duplicateCallback?.sameLedgerEntryId !== fixture.grant?.id) failures.push("duplicate callback must resolve to the original ledger entry");
  for (const type of ["EXTRA_MESSAGE", "EXTRA_LINE_SHARE", "EXTRA_FACEBOOK_SHARE", "BOOST"]) {
    if (!fixture.supportedRewardTypes?.includes(type)) failures.push(`reward fixture must include ${type}`);
  }
}

if (failures.length > 0) {
  console.error("TM_REWARD_LEDGER_CONTRACT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 reward ledger contract OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}

async function readIfExists(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

async function readJsonIfExists(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch {
    return null;
  }
}
