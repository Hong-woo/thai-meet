import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["flags:check"] !== "node scripts/check-feature-flags.mjs") {
  failures.push("package.json must expose flags:check");
}

await requireFile("docs/dev/FEATURE_FLAGS.md");

const envExample = await readFile(path.join(root, ".env.example"), "utf8");
const expectedDefaults = new Map([
  ["PUBLIC_ID_REGEN_ENABLED", "true"],
  ["PUBLIC_ID_ARCHIVE_ENABLED", "true"],
  ["CONTACT_PROVIDER_LINE_ENABLED", "true"],
  ["CONTACT_PROVIDER_FACEBOOK_ENABLED", "false"],
  ["CONTACT_SHARE_WARNING_ONCE", "true"],
  ["REQUIRE_MATCH_TO_CHAT", "false"],
  ["REQUIRE_MATCH_TO_SHARE_CONTACT", "false"],
  ["DISCOVER_NATIVE_ADS_ENABLED", "false"],
  ["CHAT_DETAIL_ADS_ENABLED", "false"],
  ["REWARDED_ADS_ENABLED", "false"],
  ["STRICT_MODERATION_ENABLED", "false"],
  ["ADMIN_WEB_ENABLED", "false"],
  ["AUTO_HIDE_REPORTED_PROFILE_THRESHOLD", "5"],
  ["AUTO_SUSPEND_REPORT_THRESHOLD", "10"]
]);

for (const [key, value] of expectedDefaults) {
  if (!envExample.includes(`${key}=${value}`)) {
    failures.push(`.env.example must set ${key}=${value}`);
  }
}

const doc = await readIfExists("docs/dev/FEATURE_FLAGS.md");
for (const term of [
  "Gate 0",
  "Gate 1",
  "Gate 2",
  "Rollout Sequence",
  "Rollback Posture",
  "CONTACT_PROVIDER_LINE_ENABLED",
  "CONTACT_PROVIDER_FACEBOOK_ENABLED",
  "DISCOVER_NATIVE_ADS_ENABLED",
  "CHAT_DETAIL_ADS_ENABLED",
  "REWARDED_ADS_ENABLED",
  "ADMIN_WEB_ENABLED"
]) {
  if (!doc.includes(term)) failures.push(`docs/dev/FEATURE_FLAGS.md must include ${term}`);
}

const routeSource = await readFile(path.join(root, "apps/mobile/lib/gate0_routes.dart"), "utf8");
for (const forbidden of [
  "facebookContactCard",
  "/facebook",
  "reward",
  "ad",
  "admin"
]) {
  if (routeSource.toLowerCase().includes(forbidden.toLowerCase())) {
    failures.push(`Gate 0 mobile routes must not expose ${forbidden}`);
  }
}

if (failures.length > 0) {
  console.error("TM_FEATURE_FLAG_MATRIX_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 feature flag matrix OK");

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
