import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";

const root = process.cwd();
const failures = [];
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

if (packageJson.scripts?.["gate1:domain:plan"] !== "node scripts/gate1-domain-cutover-plan.mjs") {
  failures.push("package.json must expose gate1:domain:plan");
}
if (packageJson.scripts?.["gate1:domain:plan:test"] !== "node scripts/check-gate1-domain-cutover-plan.mjs") {
  failures.push("package.json must expose gate1:domain:plan:test");
}

const plan = await runNode([
  "scripts/gate1-domain-cutover-plan.mjs",
  "--domain", "app.example.com",
  "--certbot-email", "ops@example.com",
  "--json"
]);
const planJson = parseJson(plan.stdout, "domain cutover plan stdout");
if (plan.status !== 0 || planJson?.status !== "ready") failures.push("domain cutover plan must pass and report status=ready");
if (planJson?.dnsRecord?.value !== "15.164.219.139") failures.push("domain cutover plan must include current EC2 public IP by default");
if (planJson?.providerUrls?.cognitoCallback !== "https://app.example.com/auth/callback/cognito") {
  failures.push("domain cutover plan must include Cognito callback URL");
}
if (!planJson?.ec2Commands?.some((command) => command.includes("certbot --nginx -d app.example.com"))) {
  failures.push("domain cutover plan must include certbot nginx command");
}
if (!planJson?.verificationCommands?.some((command) => command.includes("gate1:public-smoke"))) {
  failures.push("domain cutover plan must include public smoke verification command");
}
assertNoSecrets(plan.stdout, "domain cutover plan stdout");
assertNoSecrets(plan.stderr, "domain cutover plan stderr");

const field = await runNode([
  "scripts/gate1-domain-cutover-plan.mjs",
  "--domain", "https://app.example.com/path",
  "--field", "providerUrls.lineWebhook"
]);
if (field.stdout.trim() !== "https://app.example.com/webhooks/line") {
  failures.push("domain cutover --field providerUrls.lineWebhook must print normalized webhook URL");
}

const sslip = await runNode(["scripts/gate1-domain-cutover-plan.mjs", "--domain", "15-164-219-139.sslip.io"]);
if (sslip.status === 0 || !sslip.stderr.includes("TM_GATE1_DOMAIN_CUTOVER_SSLIP_REJECTED")) {
  failures.push("domain cutover plan must reject temporary sslip.io domains");
}

const rawIp = await runNode(["scripts/gate1-domain-cutover-plan.mjs", "--domain", "15.164.219.139"]);
if (rawIp.status === 0 || !rawIp.stderr.includes("TM_GATE1_DOMAIN_CUTOVER_RAW_IP_REJECTED")) {
  failures.push("domain cutover plan must reject raw IP domains");
}

const unknownOption = await runNode(["scripts/gate1-domain-cutover-plan.mjs", "--wat"]);
if (unknownOption.status === 0 || !unknownOption.stderr.includes("TM_GATE1_DOMAIN_CUTOVER_UNKNOWN_OPTION")) {
  failures.push("domain cutover plan must reject unknown options");
}

if (failures.length > 0) {
  console.error("TM_GATE1_DOMAIN_CUTOVER_PLAN_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 domain cutover plan OK");

async function runNode(args, env = {}) {
  const child = spawn(process.execPath, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const [status] = await once(child, "exit");
  return { status, stdout, stderr };
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    failures.push(`${label} must be JSON`);
    return null;
  }
}

function assertNoSecrets(text, label) {
  for (const secret of ["LINE_CHANNEL_SECRET", "DATABASE_URL", "Channel secret", "x-line-signature"]) {
    if (text.includes(secret)) failures.push(`${label} must not include secret fragment ${secret}`);
  }
}
