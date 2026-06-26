const args = process.argv.slice(2);
const shouldJson = args.includes("--json");
const fieldName = readOption("--field", false);
const domain = normalizeDomain(readOption("--domain", false) || process.env.GATE1_PUBLIC_DOMAIN || "");
const expectedIp = readOption("--expected-ip", false) || process.env.GATE1_PUBLIC_IP || "15.164.219.139";
const certbotEmail = readOption("--certbot-email", false) || process.env.GATE1_CERTBOT_EMAIL || "<email>";

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-domain-cutover-plan.mjs --domain <domain> [--expected-ip <ipv4>] [--certbot-email <email>] [--json] [--field <name>]");
  console.log("Fields: status, domain, expectedIp, dnsRecord, providerUrls, ec2Commands, verificationCommands, secretOutputPolicy");
  process.exit(0);
}

if (!domain) {
  fail("TM_GATE1_DOMAIN_CUTOVER_DOMAIN_REQUIRED", "real domain is required. Pass --domain <domain> or set GATE1_PUBLIC_DOMAIN.");
}
assertRealPublicDomain(domain);

const baseUrl = `https://${domain}`;
const summary = {
  status: "ready",
  domain,
  expectedIp,
  dnsRecord: {
    type: "A",
    name: domain,
    value: expectedIp,
    ttl: "300"
  },
  providerUrls: {
    baseUrl,
    health: `${baseUrl}/health`,
    cognitoCallback: `${baseUrl}/auth/callback/cognito`,
    lineWebhook: `${baseUrl}/webhooks/line`,
    futureLineLoginCallback: `${baseUrl}/auth/callback/line`
  },
  ec2Commands: [
    "sudo nginx -t",
    `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos --email ${certbotEmail} --redirect`,
    "sudo systemctl enable --now certbot-renew.timer",
    "sudo certbot renew --dry-run",
    "sudo systemctl reload nginx"
  ],
  verificationCommands: [
    `npm run gate1:domain -- --domain ${domain} --expected-ip ${expectedIp} --json`,
    `npm run gate1:public-smoke -- --base-url ${baseUrl} --env-file .env.production.local --json`
  ],
  providerConsoleChecklist: [
    "Set Cognito hosted UI callback URL to providerUrls.cognitoCallback",
    "Set LINE Messaging API webhook URL to providerUrls.lineWebhook",
    "Replace temporary sslip.io URLs in external docs and provider consoles after smoke passes"
  ],
  secretOutputPolicy: "domain/status/commands only; never echo provider secrets"
};

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_DOMAIN_CUTOVER_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

printSummary(summary);

function normalizeDomain(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed).hostname.toLowerCase();
  } catch {
    fail("TM_GATE1_DOMAIN_CUTOVER_DOMAIN_INVALID", "domain must be a hostname or absolute URL.");
  }
  return trimmed.replace(/\/+$/, "").toLowerCase();
}

function assertRealPublicDomain(value) {
  if (value === "localhost" || value.endsWith(".localhost") || value === "127.0.0.1" || value === "::1") {
    fail("TM_GATE1_DOMAIN_CUTOVER_LOCALHOST_REJECTED", "real public domain is required.");
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) {
    fail("TM_GATE1_DOMAIN_CUTOVER_RAW_IP_REJECTED", "real public domain is required, not a raw IP address.");
  }
  if (value.endsWith(".sslip.io")) {
    fail("TM_GATE1_DOMAIN_CUTOVER_SSLIP_REJECTED", "replace temporary sslip.io with a real domain.");
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(value)) {
    fail("TM_GATE1_DOMAIN_CUTOVER_DOMAIN_INVALID", "domain must be a valid hostname.");
  }
}

function validateArgs(argv) {
  const known = new Set(["--certbot-email", "--domain", "--expected-ip", "--field", "--help", "--json"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && ["--certbot-email", "--domain", "--expected-ip", "--field"].includes(argv[index - 1])) continue;
    if (arg.startsWith("--certbot-email=")) continue;
    if (arg.startsWith("--domain=")) continue;
    if (arg.startsWith("--expected-ip=")) continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_DOMAIN_CUTOVER_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function readOption(name, required = true) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) {
    const value = equalsArg.slice(name.length + 1);
    if (!value && required) {
      console.error(`TM_GATE1_DOMAIN_CUTOVER_OPTION_VALUE_REQUIRED: ${name}`);
      process.exit(1);
    }
    return value || null;
  }

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_DOMAIN_CUTOVER_OPTION_VALUE_REQUIRED: ${name}`);
    process.exit(1);
  }
  return value;
}

function getField(value, dottedPath) {
  return dottedPath.split(".").reduce((current, part) => {
    if (current === undefined || current === null) return undefined;
    return current[part];
  }, value);
}

function printSummary(value) {
  if (shouldJson) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  console.log(`Gate 1 domain cutover plan ${value.status}: domain=${value.domain}, expectedIp=${value.expectedIp}`);
  console.log(`DNS: ${value.dnsRecord.type} ${value.dnsRecord.name} -> ${value.dnsRecord.value}`);
  console.log(`Cognito callback: ${value.providerUrls.cognitoCallback}`);
  console.log(`LINE webhook: ${value.providerUrls.lineWebhook}`);
}

function fail(code, message) {
  console.error(code);
  console.error(`message=${message}`);
  console.error("doc=docs/dev/EC2_OPERATIONS.md#next-hardening");
  process.exit(1);
}
