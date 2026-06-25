import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { createProductionIntegrationManifest } from "../apps/api/src/production-integrations.mjs";

const root = process.cwd();
const failures = [];

await requireFile("apps/api/src/production-integrations.mjs");
await requireFile(".github/workflows/contract-drift.yml");
await requireFile(".github/workflows/aws-ci-deploy.yml");
await requireFile("DESIGN.md");
await requireFile("docs/dev/DESIGN_STATUS.md");
await requireFile("docs/dev/CI.md");
await requireFile("docs/dev/PRODUCTION_GAPS.md");
await requireFile("docs/dev/RELEASE_SIGNING.md");
await requireFile("apps/mobile/android/app/build.gradle.kts");

const envExample = await readText(".env.example");
const ci = await readText("docs/dev/CI.md");
const productionGaps = await readText("docs/dev/PRODUCTION_GAPS.md");
const designStatus = await readText("docs/dev/DESIGN_STATUS.md");
const releaseSigning = await readText("docs/dev/RELEASE_SIGNING.md");
const gradle = await readText("apps/mobile/android/app/build.gradle.kts");
const awsWorkflow = await readText(".github/workflows/aws-ci-deploy.yml");
const manifest = createProductionIntegrationManifest({
  AUTH_MODE: "production",
  AUTH_PROVIDER_JWKS_URL: "https://auth.example.invalid/.well-known/jwks.json",
  AUTH_PROVIDER_ISSUER: "https://auth.example.invalid/",
  AUTH_PROVIDER_AUDIENCE: "thai-meet-api",
  LINE_PROVIDER_MODE: "production",
  LINE_CHANNEL_ID: "1234567890",
  LINE_CHANNEL_SECRET: "secret",
  OBJECT_STORAGE_MODE: "s3",
  AWS_REGION: "ap-southeast-1",
  S3_BUCKET_PUBLIC_ASSETS: "thai-meet-public-assets",
  PERSISTENCE_MODE: "database",
  DATABASE_URL: "postgresql://user:pass@example.invalid:5432/thai_meet"
});

for (const marker of [
  "AUTH_MODE=production",
  "AUTH_PROVIDER_JWKS_URL=",
  "LINE_PROVIDER_MODE=production",
  "OBJECT_STORAGE_MODE=s3",
  "S3_BUCKET_PUBLIC_ASSETS=",
  "PERSISTENCE_MODE=database"
]) {
  assertIncludes(envExample, marker, `.env.example must document ${marker}`);
}

for (const marker of [
  "AWS CI/deploy pipeline is configured",
  "AWS CI Deploy",
  "EC2_SSH_PRIVATE_KEY_B64",
  "docker save",
  "systemctl restart",
  "npm run production:check"
]) {
  assertIncludes(ci, marker, `CI doc must include ${marker}`);
  assertIncludes(awsWorkflow, marker, `AWS workflow must include ${marker}`);
}

for (const marker of [
  "id: aws-deploy-preflight",
  "AWS EC2 deploy skipped: missing EC2 deployment settings",
  "steps.aws-deploy-preflight.outputs.deploy_ready == 'true'",
  "secrets.AWS_REGION || vars.AWS_REGION",
  "secrets.EC2_HOST || vars.EC2_HOST",
  "secrets.EC2_USER || vars.EC2_USER",
  "secrets.EC2_SSH_PRIVATE_KEY_B64",
  "secrets.EC2_SERVICE_NAME || vars.EC2_SERVICE_NAME"
]) {
  assertIncludes(awsWorkflow, marker, `AWS workflow must guard deploy with ${marker}`);
}

for (const marker of [
  "Gate 0 production readiness blockers are closed",
  "Real auth/provider/storage integrations: closed by `apps/api/src/production-integrations.mjs`",
  "Production backend persistence: closed by database mode contract",
  "AWS CI/deploy pipeline: closed by `.github/workflows/aws-ci-deploy.yml`",
  "Formal Figma/DESIGN.md source of truth: closed by `DESIGN.md`",
  "App store/release build signing: closed by `docs/dev/RELEASE_SIGNING.md`"
]) {
  assertIncludes(productionGaps, marker, `production gaps doc must include ${marker}`);
}

for (const marker of [
  "DESIGN.md is the Gate 0 source of truth",
  "Figma source: https://www.figma.com/design/Jls4ueBkuNa53XXPKv6Yxw",
  "Figma Gate 0 screens now replace the placeholder source"
]) {
  assertIncludes(designStatus, marker, `design status doc must include ${marker}`);
}

for (const marker of [
  "THAI_MEET_UPLOAD_KEYSTORE",
  "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
  "THAI_MEET_UPLOAD_KEY_ALIAS",
  "flutter build appbundle --release",
  "releaseSigning"
]) {
  assertIncludes(releaseSigning, marker, `release signing doc must include ${marker}`);
}

for (const marker of [
  "THAI_MEET_UPLOAD_KEYSTORE",
  "THAI_MEET_UPLOAD_KEYSTORE_PASSWORD",
  "THAI_MEET_UPLOAD_KEY_ALIAS",
  "THAI_MEET_UPLOAD_KEY_PASSWORD",
  "releaseSigning"
]) {
  assertIncludes(gradle, marker, `Android Gradle config must include ${marker}`);
}

if (manifest.status !== "ready") {
  failures.push("production integration manifest fixture must be ready");
}

if (failures.length > 0) {
  console.error("TM_PRODUCTION_READINESS_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 production readiness OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}

async function readText(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

function assertIncludes(text, marker, message) {
  if (!text.includes(marker)) failures.push(message);
}
