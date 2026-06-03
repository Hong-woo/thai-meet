import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["env:check"] !== "node scripts/check-env-matrix.mjs") {
  failures.push("package.json must expose env:check");
}

if (packageJson.packageManager !== "pnpm@10.0.0") {
  failures.push("packageManager must pin pnpm@10.0.0");
}

if (!packageJson.engines?.node?.includes(">=22")) {
  failures.push("package.json engines.node must allow Node >=22");
}

await requireFile("docs/dev/ENVIRONMENT.md");

const envExample = await readFile(path.join(root, ".env.example"), "utf8");
const expectedDefaults = new Map([
  ["AUTH_MODE", "mock"],
  ["LINE_PROVIDER_MODE", "mock"],
  ["FACEBOOK_PROVIDER_MODE", "mock"],
  ["ADMOB_MODE", "mock"],
  ["FCM_MODE", "mock"],
  ["OBJECT_STORAGE_MODE", "local"],
  ["CONTACT_PROVIDER_LINE_ENABLED", "true"],
  ["CONTACT_PROVIDER_FACEBOOK_ENABLED", "false"]
]);

for (const [key, value] of expectedDefaults) {
  if (!envExample.includes(`${key}=${value}`)) {
    failures.push(`.env.example must set ${key}=${value}`);
  }
}

const suspiciousPatterns = [
  /sk_live/i,
  /sk_test/i,
  /ya29\./i,
  /AIza[0-9A-Za-z_-]+/,
  /Bearer\s+[0-9A-Za-z._-]+/i,
  /line_access_token/i,
  /facebook_app_secret/i
];

for (const pattern of suspiciousPatterns) {
  if (pattern.test(envExample)) {
    failures.push(`.env.example contains suspicious real credential pattern: ${pattern}`);
  }
}

if (failures.length > 0) {
  console.error("TM_ENV_MATRIX_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 environment matrix OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}
