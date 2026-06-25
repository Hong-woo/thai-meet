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
await requireFile(".env.production.local.example");

const envExample = await readFile(path.join(root, ".env.example"), "utf8");
const gitignore = await readFile(path.join(root, ".gitignore"), "utf8");
const productionEnvExample = await readIfExists(".env.production.local.example");
const smokeSource = await readFile(path.join(root, "scripts/smoke.mjs"), "utf8");
const readme = await readFile(path.join(root, "README.md"), "utf8");
const environmentDocs = await readFile(path.join(root, "docs/dev/ENVIRONMENT.md"), "utf8");
const gettingStarted = await readFile(path.join(root, "docs/dev/GETTING_STARTED.md"), "utf8");
const smokeDocs = await readFile(path.join(root, "docs/dev/SMOKE.md"), "utf8");
const errorDocs = await readFile(path.join(root, "docs/dev/ERRORS.md"), "utf8");
const reviewChecklist = await readFile(path.join(root, "docs/dev/REVIEW_CHECKLIST.md"), "utf8");
const pullRequestTemplate = await readFile(path.join(root, ".github/PULL_REQUEST_TEMPLATE.md"), "utf8");
const bugReportTemplate = await readFile(path.join(root, ".github/ISSUE_TEMPLATE/bug_report.md"), "utf8");
const expectedDefaults = new Map([
  ["AUTH_MODE", "mock"],
  ["LINE_PROVIDER_MODE", "mock"],
  ["FACEBOOK_PROVIDER_MODE", "mock"],
  ["ADMOB_MODE", "mock"],
  ["FCM_MODE", "mock"],
  ["OBJECT_STORAGE_MODE", "local"],
  ["PERSISTENCE_MODE", "fixture"],
  ["CONTACT_PROVIDER_LINE_ENABLED", "true"],
  ["CONTACT_PROVIDER_FACEBOOK_ENABLED", "false"]
]);

for (const [key, value] of expectedDefaults) {
  if (!envExample.includes(`${key}=${value}`)) {
    failures.push(`.env.example must set ${key}=${value}`);
  }
}

for (const marker of [
  ".env.*",
  "!.env.example",
  "!.env.production.local.example"
]) {
  if (!gitignore.includes(marker)) {
    failures.push(`.gitignore must include ${marker}`);
  }
}

const requiredProductionEnvKeys = [
  "AUTH_MODE",
  "AUTH_PROVIDER_JWKS_URL",
  "AUTH_PROVIDER_ISSUER",
  "AUTH_PROVIDER_AUDIENCE",
  "LINE_PROVIDER_MODE",
  "LINE_CHANNEL_ID",
  "LINE_CHANNEL_SECRET",
  "OBJECT_STORAGE_MODE",
  "AWS_REGION",
  "S3_BUCKET_PUBLIC_ASSETS",
  "PERSISTENCE_MODE",
  "DATABASE_URL",
  "EC2_HOST",
  "EC2_USER",
  "EC2_SSH_PRIVATE_KEY_B64",
  "EC2_APP_DIR",
  "EC2_SERVICE_NAME",
  "THAI_MEET_UPLOAD_KEYSTORE",
  "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
  "THAI_MEET_UPLOAD_KEY_ALIAS",
  "THAI_MEET_UPLOAD_KEY_PASSWORD"
];

for (const key of requiredProductionEnvKeys) {
  if (!productionEnvExample.includes(`${key}=`)) {
    failures.push(`.env.production.local.example must include ${key}`);
  }
}

for (const marker of [
  "AUTH_MODE=production",
  "LINE_PROVIDER_MODE=production",
  "OBJECT_STORAGE_MODE=s3",
  "PERSISTENCE_MODE=database",
  "replace-with-"
]) {
  if (!productionEnvExample.includes(marker)) {
    failures.push(`.env.production.local.example must include safe marker ${marker}`);
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
  if (pattern.test(productionEnvExample)) {
    failures.push(`.env.production.local.example contains suspicious real credential pattern: ${pattern}`);
  }
}

if (smokeSource.includes("TM_SMOKE_DOCTOR_CHROME_UNAVAILABLE") || smokeSource.includes("TM_SMOKE_DOCTOR_DOCKER_NOT_RUNNING")) {
  failures.push("scaffold smoke doctor must not hard-fail Chrome or Docker while web and infra boot are skipped");
}

for (const [label, source] of [
  ["README", readme],
  ["Environment docs", environmentDocs],
  ["Getting Started docs", gettingStarted],
  ["Smoke docs", smokeDocs]
]) {
  if (source.includes("Chrome or Edge") || source.includes("Docker Desktop running for full smoke") || source.includes("Docker Desktop, and Chrome")) {
    failures.push(`${label} must not list Chrome or Docker daemon as scaffold smoke prerequisites`);
  }
}

for (const [label, source] of [
  ["README", readme],
  ["Getting Started docs", gettingStarted],
  ["Smoke docs", smokeDocs],
  ["Review checklist", reviewChecklist],
  ["Pull request template", pullRequestTemplate],
  ["Bug report template", bugReportTemplate]
]) {
  if (!source.includes("corepack pnpm smoke")) {
    failures.push(`${label} must document corepack pnpm smoke for Windows PATH-safe pnpm execution`);
  }
}

if (errorDocs.includes("TM_SMOKE_DOCTOR_CHROME_UNAVAILABLE") || errorDocs.includes("TM_SMOKE_DOCTOR_DOCKER_NOT_RUNNING")) {
  failures.push("Errors docs must not list removed Chrome/Docker hard-fail smoke doctor codes");
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

async function readIfExists(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}
