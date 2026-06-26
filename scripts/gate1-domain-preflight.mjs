import { resolve4 } from "node:dns/promises";

const args = process.argv.slice(2);
const shouldDryRun = args.includes("--dry-run");
const shouldJson = args.includes("--json") || shouldDryRun;
const shouldSkipDns = args.includes("--skip-dns");
const allowLocalhost = args.includes("--allow-localhost");
const fieldName = readOption("--field", false);
const domainInput = readOption("--domain", false) || process.env.GATE1_PUBLIC_DOMAIN || "";
const domain = normalizeDomain(domainInput);
const expectedIp = readOption("--expected-ip", false) || process.env.GATE1_PUBLIC_IP || "15.164.219.139";

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-domain-preflight.mjs --domain <domain> [--expected-ip <ipv4>] [--skip-dns] [--allow-localhost] [--dry-run] [--json] [--field <name>]");
  console.log("Fields: status, domain, baseUrl, expectedIp, checks, providerUrls, nextCommand, secretOutputPolicy");
  process.exit(0);
}

const baseUrl = domain ? normalizeBaseUrl(domainInput, allowLocalhost) : "";
const providerUrls = domain
  ? {
      health: `${baseUrl}/health`,
      cognitoCallback: `${baseUrl}/auth/callback/cognito`,
      lineWebhook: `${baseUrl}/webhooks/line`,
      futureLineLoginCallback: `${baseUrl}/auth/callback/line`
    }
  : {};

const summary = {
  status: shouldDryRun ? "dry_run" : "ready",
  domain,
  baseUrl,
  expectedIp,
  checks: [
    "domain is real hostname, not sslip.io or raw IP",
    "DNS A record resolves to expected EC2 public IPv4",
    "HTTPS /health returns Thai Meet API ok"
  ],
  providerUrls,
  nextCommand: domain
    ? `npm run gate1:public-smoke -- --base-url ${baseUrl} --env-file .env.production.local --json`
    : "npm run gate1:domain -- --domain <real-domain> --json",
  secretOutputPolicy: "domain/status only; never echo provider secrets"
};

if (fieldName) {
  const value = getField(summary, fieldName);
  if (value === undefined) {
    console.error(`TM_GATE1_DOMAIN_UNKNOWN_FIELD: ${fieldName}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (!domain) {
  fail("TM_GATE1_DOMAIN_REQUIRED", "real domain is required. Pass --domain <domain> or set GATE1_PUBLIC_DOMAIN.");
}
if (!allowLocalhost) assertRealPublicDomain(domain);

if (shouldDryRun) {
  printSummary(summary);
  process.exit(0);
}

if (!shouldSkipDns) {
  const ips = await resolveDomain(domain);
  summary.resolvedIps = ips;
  if (!ips.includes(expectedIp)) {
    fail("TM_GATE1_DOMAIN_DNS_MISMATCH", `DNS A record did not include expected IPv4 ${expectedIp}.`);
  }
}

const health = await fetchHealth(baseUrl);
if (health.response.status !== 200 || health.payload?.status !== "ok" || health.payload?.service !== "thai-meet-api") {
  fail("TM_GATE1_DOMAIN_HEALTH_FAILED", `health endpoint returned ${health.response.status}.`);
}

summary.status = "passed";
printSummary(summary);

async function resolveDomain(value) {
  try {
    return await resolve4(value);
  } catch (error) {
    fail("TM_GATE1_DOMAIN_DNS_FAILED", error.message);
  }
}

async function fetchHealth(url) {
  let response;
  try {
    response = await fetch(`${url}/health`);
  } catch (error) {
    fail("TM_GATE1_DOMAIN_HEALTH_FETCH_FAILED", error.message);
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    fail("TM_GATE1_DOMAIN_HEALTH_JSON_FAILED", "health endpoint did not return JSON.");
  }
  return { response, payload };
}

function normalizeDomain(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed).hostname.toLowerCase();
  } catch {
    fail("TM_GATE1_DOMAIN_INVALID", "domain must be a hostname or absolute URL.");
  }
  return trimmed.replace(/\/+$/, "").toLowerCase();
}

function normalizeBaseUrl(value, allowLocalhostUrl) {
  const trimmed = String(value || "").trim();
  if (/^https?:\/\//i.test(trimmed)) {
    let url;
    try {
      url = new URL(trimmed);
    } catch {
      fail("TM_GATE1_DOMAIN_INVALID", "domain must be a hostname or absolute URL.");
    }
    if (url.protocol !== "https:" && !allowLocalhostUrl) {
      fail("TM_GATE1_DOMAIN_HTTPS_REQUIRED", "real public domain must use HTTPS.");
    }
    return url.origin.replace(/\/$/, "");
  }
  return `https://${normalizeDomain(trimmed)}`;
}

function assertRealPublicDomain(value) {
  if (value === "localhost" || value.endsWith(".localhost") || value === "127.0.0.1" || value === "::1") {
    fail("TM_GATE1_DOMAIN_LOCALHOST_REJECTED", "real public domain is required.");
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) {
    fail("TM_GATE1_DOMAIN_RAW_IP_REJECTED", "real public domain is required, not a raw IP address.");
  }
  if (value.endsWith(".sslip.io")) {
    fail("TM_GATE1_DOMAIN_SSLIP_REJECTED", "replace temporary sslip.io with a real domain.");
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(value)) {
    fail("TM_GATE1_DOMAIN_INVALID", "domain must be a valid hostname.");
  }
}

function validateArgs(argv) {
  const known = new Set([
    "--allow-localhost",
    "--domain",
    "--dry-run",
    "--expected-ip",
    "--field",
    "--help",
    "--json",
    "--skip-dns"
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && ["--domain", "--expected-ip", "--field"].includes(argv[index - 1])) continue;
    if (arg.startsWith("--domain=")) continue;
    if (arg.startsWith("--expected-ip=")) continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_DOMAIN_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function readOption(name, required = true) {
  const equalsArg = args.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) {
    const value = equalsArg.slice(name.length + 1);
    if (!value && required) {
      console.error(`TM_GATE1_DOMAIN_OPTION_VALUE_REQUIRED: ${name}`);
      process.exit(1);
    }
    return value || null;
  }

  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`TM_GATE1_DOMAIN_OPTION_VALUE_REQUIRED: ${name}`);
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
  console.log(`Gate 1 domain preflight ${value.status}: domain=${value.domain}, expectedIp=${value.expectedIp}`);
}

function fail(code, message) {
  console.error(code);
  console.error(`message=${message}`);
  console.error("doc=docs/dev/PROVIDER_CONSOLE_SETTINGS.md");
  process.exit(1);
}
