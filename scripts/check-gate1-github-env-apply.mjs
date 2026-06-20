import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["gate1:github-env:apply"] !== "node scripts/gate1-github-env-apply.mjs") {
  failures.push("package.json must expose gate1:github-env:apply");
}
if (packageJson.scripts?.["gate1:github-env:apply:test"] !== "node scripts/check-gate1-github-env-apply.mjs") {
  failures.push("package.json must expose gate1:github-env:apply:test");
}

const tempDir = await mkdtemp(path.join(tmpdir(), "thai-meet-gate1-github-env-apply-"));
try {
  const envFile = path.join(tempDir, "gate1.env");
  await writeFile(envFile, [
    "AUTH_MODE=production",
    "AUTH_PROVIDER_JWKS_URL=https://auth.example.invalid/.well-known/jwks.json",
    "AUTH_PROVIDER_ISSUER=https://auth.example.invalid/",
    "AUTH_PROVIDER_AUDIENCE=thai-meet-api",
    "LINE_PROVIDER_MODE=production",
    "LINE_CHANNEL_ID=1234567890",
    "LINE_CHANNEL_SECRET=gate1_line_secret_value",
    "OBJECT_STORAGE_MODE=s3",
    "AWS_REGION=ap-southeast-1",
    "S3_BUCKET_PUBLIC_ASSETS=thai-meet-public-assets",
    "PERSISTENCE_MODE=database",
    "DATABASE_URL=postgresql://user:gate1_db_secret@example.invalid:5432/thai_meet",
    "AWS_DEPLOY_ROLE_ARN=arn:aws:iam::123456789012:role/thai-meet-deploy",
    "ECR_REPOSITORY=thai-meet-api",
    "ECS_CLUSTER=thai-meet-cluster",
    "ECS_SERVICE=thai-meet-service",
    "THAI_MEET_UPLOAD_KEYSTORE=C:/secrets/thai-meet-upload.jks",
    "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD=gate1_keystore_password",
    "THAI_MEET_UPLOAD_KEY_ALIAS=thai-meet-upload",
    "THAI_MEET_UPLOAD_KEY_PASSWORD=gate1_key_password",
    ""
  ].join("\n"));

  const dryRun = runApply(["--env-file", envFile, "--json"]);
  if (dryRun.status !== 0) failures.push(`github env apply dry-run must pass, got ${dryRun.status}`);
  const dryRunJson = parseJson(dryRun.stdout, "github env apply dry-run stdout");
  if (dryRunJson?.mode !== "dry-run") failures.push("github env apply dry-run must report mode=dry-run");
  if (dryRunJson?.environment !== "production") failures.push("github env apply must default to production");
  if (dryRunJson?.variableCount !== 16) failures.push("github env apply must classify 16 variables");
  if (dryRunJson?.secretCount !== 4) failures.push("github env apply must classify 4 secrets");
  if (dryRunJson?.commandCount !== 20) failures.push("github env apply must report 20 commands");
  assertNoSecretValues(dryRun.stdout, "github env apply dry-run stdout");
  assertNoSecretValues(dryRun.stderr, "github env apply dry-run stderr");

  const plan = runApply(["--env-file", envFile, "--plan"]);
  if (plan.status !== 0) failures.push(`github env apply plan must pass, got ${plan.status}`);
  if (!plan.stdout.includes("gh variable set AUTH_MODE --env production <stdin>")) {
    failures.push("github env apply plan must show variable stdin command");
  }
  if (!plan.stdout.includes("gh secret set DATABASE_URL --env production <stdin>")) {
    failures.push("github env apply plan must show secret stdin command");
  }
  assertNoSecretValues(plan.stdout, "github env apply plan stdout");

  const missingEnvFile = path.join(tempDir, "missing.env");
  await writeFile(missingEnvFile, "AUTH_MODE=production\n");
  const missing = runApply(["--env-file", missingEnvFile, "--json"]);
  if (missing.status === 0) failures.push("github env apply must fail closed when env file is incomplete");
  if (!missing.stderr.includes("TM_GATE1_GITHUB_ENV_APPLY_MISSING_KEYS")) {
    failures.push("github env apply incomplete env file must fail with TM_GATE1_GITHUB_ENV_APPLY_MISSING_KEYS");
  }

  const placeholderEnvFile = path.join(tempDir, "placeholder.env");
  await writeFile(placeholderEnvFile, [
    "AUTH_MODE=production",
    "AUTH_PROVIDER_JWKS_URL=https://replace-with-auth-domain.example/.well-known/jwks.json",
    "AUTH_PROVIDER_ISSUER=https://replace-with-auth-domain.example/",
    "AUTH_PROVIDER_AUDIENCE=replace-with-api-audience",
    "LINE_PROVIDER_MODE=production",
    "LINE_CHANNEL_ID=replace-with-line-channel-id",
    "LINE_CHANNEL_SECRET=replace-with-line-channel-secret",
    "OBJECT_STORAGE_MODE=s3",
    "AWS_REGION=replace-with-aws-region",
    "S3_BUCKET_PUBLIC_ASSETS=replace-with-s3-bucket",
    "PERSISTENCE_MODE=database",
    "DATABASE_URL=replace-with-postgresql-database-url",
    "AWS_DEPLOY_ROLE_ARN=replace-with-aws-deploy-role-arn",
    "ECR_REPOSITORY=replace-with-ecr-repository",
    "ECS_CLUSTER=replace-with-ecs-cluster",
    "ECS_SERVICE=replace-with-ecs-service",
    "THAI_MEET_UPLOAD_KEYSTORE=replace-with-local-upload-keystore-path",
    "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD=replace-with-upload-keystore-password",
    "THAI_MEET_UPLOAD_KEY_ALIAS=replace-with-upload-key-alias",
    "THAI_MEET_UPLOAD_KEY_PASSWORD=replace-with-upload-key-password",
    ""
  ].join("\n"));
  const placeholder = runApply(["--env-file", placeholderEnvFile, "--json"]);
  if (placeholder.status === 0) failures.push("github env apply must fail closed when placeholder values remain");
  if (!placeholder.stderr.includes("TM_GATE1_GITHUB_ENV_APPLY_PLACEHOLDER_VALUES")) {
    failures.push("github env apply placeholder env file must fail with TM_GATE1_GITHUB_ENV_APPLY_PLACEHOLDER_VALUES");
  }

  const fakeGh = path.join(tempDir, "fake-gh.mjs");
  const fakeGhLog = path.join(tempDir, "fake-gh-log.jsonl");
  await writeFile(fakeGh, [
    "import { appendFileSync } from 'node:fs';",
    "let input = '';",
    "process.stdin.setEncoding('utf8');",
    "process.stdin.on('data', (chunk) => { input += chunk; });",
    "process.stdin.on('end', () => {",
    "  appendFileSync(process.env.FAKE_GH_LOG, JSON.stringify({ argv: process.argv.slice(2), inputLength: input.length }) + '\\n');",
    "});"
  ].join("\n"));

  const apply = runApply([
    "--env-file", envFile,
    "--apply",
    "--json",
    "--gh-bin", process.execPath,
    "--gh-bin-arg", fakeGh
  ], { FAKE_GH_LOG: fakeGhLog });
  if (apply.status !== 0) failures.push(`github env apply --apply must pass with fake gh, got ${apply.status}`);
  const applyJson = parseJson(apply.stdout, "github env apply stdout");
  if (applyJson?.mode !== "apply") failures.push("github env apply --apply must report mode=apply");
  if (applyJson?.appliedCount !== 20) failures.push("github env apply --apply must report appliedCount=20");
  assertNoSecretValues(apply.stdout, "github env apply stdout");
  assertNoSecretValues(apply.stderr, "github env apply stderr");

  const fakeLog = await readIfExists(fakeGhLog);
  const fakeCalls = fakeLog.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  if (fakeCalls.length !== 20) failures.push(`fake gh must receive 20 calls, got ${fakeCalls.length}`);
  if (!fakeCalls.some((call) => call.argv.join(" ") === "variable set AUTH_MODE --env production")) {
    failures.push("fake gh must receive AUTH_MODE variable set call");
  }
  if (!fakeCalls.some((call) => call.argv.join(" ") === "secret set DATABASE_URL --env production")) {
    failures.push("fake gh must receive DATABASE_URL secret set call");
  }
  assertNoSecretValues(fakeLog, "fake gh argv log");
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error("TM_GATE1_GITHUB_ENV_APPLY_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 GitHub environment apply OK");

function runApply(args, env = {}) {
  return spawnSync(process.execPath, ["scripts/gate1-github-env-apply.mjs", ...args], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8"
  });
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    failures.push(`${label} must be JSON`);
    return null;
  }
}

function assertNoSecretValues(text, label) {
  for (const value of [
    "gate1_line_secret_value",
    "gate1_db_secret",
    "gate1_keystore_password",
    "gate1_key_password",
    "postgresql://user:",
    "C:/secrets/thai-meet-upload.jks",
    "ap-southeast-1",
    "1234567890"
  ]) {
    if (text.includes(value)) failures.push(`${label} must not print value ${value}`);
  }
}

async function readIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}
