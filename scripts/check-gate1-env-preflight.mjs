import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["gate1:env"] !== "node scripts/gate1-env-preflight.mjs") {
  failures.push("package.json must expose gate1:env");
}
if (packageJson.scripts?.["gate1:env:test"] !== "node scripts/check-gate1-env-preflight.mjs") {
  failures.push("package.json must expose gate1:env:test");
}

const helpResult = runPreflight({ env: scrubGate1Env(process.env), args: ["--help"] });
if (!helpResult.stdout.includes("--env-file <path>")) {
  failures.push("gate1 env preflight help must include --env-file <path>");
}

const missingResult = runPreflight({ env: scrubGate1Env(process.env), args: ["--json"] });
if (missingResult.status === 0) {
  failures.push("gate1 env preflight must fail closed when required secrets are missing");
}

const missingJson = parseJson(missingResult.stdout, "missing preflight stdout");
if (missingJson?.status !== "not_ready") {
  failures.push("missing gate1 env preflight must report status=not_ready");
}
if (!missingJson?.groups?.productionRuntime?.missingKeys?.includes("DATABASE_URL")) {
  failures.push("missing gate1 env preflight must include DATABASE_URL under productionRuntime missingKeys");
}
if (!missingJson?.groups?.awsDeploy?.missingKeys?.includes("AWS_DEPLOY_ROLE_ARN")) {
  failures.push("missing gate1 env preflight must include AWS_DEPLOY_ROLE_ARN under awsDeploy missingKeys");
}
if (!missingJson?.groups?.androidRelease?.missingKeys?.includes("THAI_MEET_UPLOAD_KEYSTORE")) {
  failures.push("missing gate1 env preflight must include THAI_MEET_UPLOAD_KEYSTORE under androidRelease missingKeys");
}
assertNoSecretValues(missingResult.stdout, "missing preflight stdout");
assertNoSecretValues(missingResult.stderr, "missing preflight stderr");

const readyEnv = {
  ...scrubGate1Env(process.env),
  AUTH_MODE: "production",
  AUTH_PROVIDER_JWKS_URL: "https://auth.example.invalid/.well-known/jwks.json",
  AUTH_PROVIDER_ISSUER: "https://auth.example.invalid/",
  AUTH_PROVIDER_AUDIENCE: "thai-meet-api",
  LINE_PROVIDER_MODE: "production",
  LINE_CHANNEL_ID: "1234567890",
  LINE_CHANNEL_SECRET: "gate1_line_secret_value",
  OBJECT_STORAGE_MODE: "s3",
  AWS_REGION: "ap-southeast-1",
  S3_BUCKET_PUBLIC_ASSETS: "thai-meet-public-assets",
  PERSISTENCE_MODE: "database",
  DATABASE_URL: "postgresql://user:gate1_db_secret@example.invalid:5432/thai_meet",
  AWS_DEPLOY_ROLE_ARN: "arn:aws:iam::123456789012:role/thai-meet-deploy",
  ECR_REPOSITORY: "thai-meet-api",
  ECS_CLUSTER: "thai-meet-cluster",
  ECS_SERVICE: "thai-meet-service",
  THAI_MEET_UPLOAD_KEYSTORE: "C:/secrets/thai-meet-upload.jks",
  THAI_MEET_UPLOAD_KEYSTORE_PASSWORD: "gate1_keystore_password",
  THAI_MEET_UPLOAD_KEY_ALIAS: "thai-meet-upload",
  THAI_MEET_UPLOAD_KEY_PASSWORD: "gate1_key_password"
};

const readyResult = runPreflight({ env: readyEnv, args: ["--json"] });
if (readyResult.status !== 0) {
  failures.push(`ready gate1 env preflight must pass, got exit ${readyResult.status}`);
}

const readyJson = parseJson(readyResult.stdout, "ready preflight stdout");
if (readyJson?.status !== "ready") {
  failures.push("ready gate1 env preflight must report status=ready");
}
if (readyJson?.secretOutputPolicy !== "keys-only") {
  failures.push("gate1 env preflight must report secretOutputPolicy=keys-only");
}
if (readyJson?.groups?.productionRuntime?.status !== "ready") {
  failures.push("ready gate1 env preflight must report productionRuntime ready");
}
if (readyJson?.groups?.awsDeploy?.status !== "ready") {
  failures.push("ready gate1 env preflight must report awsDeploy ready");
}
if (readyJson?.groups?.androidRelease?.status !== "ready") {
  failures.push("ready gate1 env preflight must report androidRelease ready");
}
assertNoSecretValues(readyResult.stdout, "ready preflight stdout");
assertNoSecretValues(readyResult.stderr, "ready preflight stderr");

const fieldResult = runPreflight({ env: readyEnv, args: ["--field", "groups.awsDeploy.status"] });
if (fieldResult.status !== 0 || fieldResult.stdout.trim() !== "ready") {
  failures.push("gate1 env preflight --field groups.awsDeploy.status must print ready");
}

const tempDir = await mkdtemp(path.join(tmpdir(), "thai-meet-gate1-env-file-"));
try {
  const readyEnvFile = path.join(tempDir, "gate1.env");
  await writeFile(readyEnvFile, [
    "# Gate 1 local preflight values",
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

  const envFileResult = runPreflight({
    env: scrubGate1Env(process.env),
    args: ["--json", "--env-file", readyEnvFile]
  });
  if (envFileResult.status !== 0) {
    failures.push(`ready gate1 env file preflight must pass, got exit ${envFileResult.status}`);
  }
  const envFileJson = parseJson(envFileResult.stdout, "ready env file preflight stdout");
  if (envFileJson?.status !== "ready") {
    failures.push("ready gate1 env file preflight must report status=ready");
  }
  assertNoSecretValues(envFileResult.stdout, "ready env file preflight stdout");
  assertNoSecretValues(envFileResult.stderr, "ready env file preflight stderr");

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

  const placeholderResult = runPreflight({
    env: scrubGate1Env(process.env),
    args: ["--json", "--env-file", placeholderEnvFile]
  });
  if (placeholderResult.status === 0) {
    failures.push("placeholder gate1 env file preflight must fail closed");
  }
  const placeholderJson = parseJson(placeholderResult.stdout, "placeholder env file preflight stdout");
  if (placeholderJson?.status !== "not_ready") {
    failures.push("placeholder gate1 env file preflight must report status=not_ready");
  }
  if (!placeholderJson?.groups?.productionRuntime?.placeholderKeys?.includes("DATABASE_URL")) {
    failures.push("placeholder gate1 env file preflight must include DATABASE_URL under productionRuntime placeholderKeys");
  }
  if (!placeholderJson?.groups?.awsDeploy?.placeholderKeys?.includes("AWS_DEPLOY_ROLE_ARN")) {
    failures.push("placeholder gate1 env file preflight must include AWS_DEPLOY_ROLE_ARN under awsDeploy placeholderKeys");
  }
  if (!placeholderJson?.groups?.androidRelease?.placeholderKeys?.includes("THAI_MEET_UPLOAD_KEYSTORE_PASSWORD")) {
    failures.push("placeholder gate1 env file preflight must include THAI_MEET_UPLOAD_KEYSTORE_PASSWORD under androidRelease placeholderKeys");
  }
  assertNoSecretValues(placeholderResult.stdout, "placeholder env file preflight stdout");
  assertNoSecretValues(placeholderResult.stderr, "placeholder env file preflight stderr");
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error("TM_GATE1_ENV_PREFLIGHT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 environment preflight OK");

function runPreflight({ env, args }) {
  return spawnSync(process.execPath, ["scripts/gate1-env-preflight.mjs", ...args], {
    cwd: root,
    env,
    encoding: "utf8"
  });
}

function scrubGate1Env(env) {
  const blocked = new Set([
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
    "AWS_DEPLOY_ROLE_ARN",
    "ECR_REPOSITORY",
    "ECS_CLUSTER",
    "ECS_SERVICE",
    "THAI_MEET_UPLOAD_KEYSTORE",
    "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
    "THAI_MEET_UPLOAD_KEY_ALIAS",
    "THAI_MEET_UPLOAD_KEY_PASSWORD"
  ]);
  return Object.fromEntries(Object.entries(env).filter(([key]) => !blocked.has(key)));
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
  for (const secret of [
    "gate1_line_secret_value",
    "gate1_db_secret",
    "gate1_keystore_password",
    "gate1_key_password",
    "postgresql://user:",
    "C:/secrets/thai-meet-upload.jks"
  ]) {
    if (text.includes(secret)) {
      failures.push(`${label} must not print secret value ${secret}`);
    }
  }
}
