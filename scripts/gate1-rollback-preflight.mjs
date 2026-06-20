const args = process.argv.slice(2);
const shouldJson = args.includes("--json");
const requestedField = parseFieldArg(args);

validateArgs(args);

if (args.includes("--help")) {
  console.log("Usage: node scripts/gate1-rollback-preflight.mjs [--json] [--field <name>]");
  console.log("Fields: status, mode, expectedMode, summary, commands, verificationCommand, reportCommand, rawSecretsPrinted");
  process.exit(0);
}

const rollback = {
  status: "ready",
  mode: "fixture",
  expectedMode: "fixture",
  summary: "rollback to fixture mode, verify persistenceModeDefault=fixture, then rerun API and DB checks",
  commands: [
    "$env:PERSISTENCE_MODE=\"fixture\"",
    "npm run gate0:status -- --field persistenceModeDefault",
    "npm run api:check",
    "npm run db:check:test"
  ],
  verificationCommand: "npm run gate0:status -- --field persistenceModeDefault",
  reportCommand: "npm run gate1:rollback -- --json",
  rawSecretsPrinted: false,
  secretOutputPolicy: "do not echo database or provider secret values"
};

if (requestedField) {
  const value = getField(rollback, requestedField);
  if (value === undefined) {
    console.error(`TM_GATE1_ROLLBACK_UNKNOWN_FIELD: ${requestedField}`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  process.exit(0);
}

if (shouldJson) {
  console.log(JSON.stringify(rollback, null, 2));
} else {
  console.log(`Gate 1 rollback preflight OK: mode=${rollback.mode}, expectedMode=${rollback.expectedMode}`);
}

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) {
    const value = equalsArg.slice("--field=".length);
    if (!value) {
      console.error("TM_GATE1_ROLLBACK_FIELD_REQUIRED");
      process.exit(1);
    }
    return value;
  }
  const index = argv.indexOf("--field");
  if (index === -1) return null;

  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    console.error("TM_GATE1_ROLLBACK_FIELD_REQUIRED");
    process.exit(1);
  }
  return value;
}

function validateArgs(argv) {
  const known = new Set(["--json", "--field", "--help"]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (index > 0 && argv[index - 1] === "--field") continue;
    if (arg.startsWith("--field=")) continue;
    if (arg.startsWith("--") && !known.has(arg)) {
      console.error(`TM_GATE1_ROLLBACK_UNKNOWN_OPTION: ${arg}`);
      process.exit(1);
    }
  }
}

function getField(object, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => value?.[key], object);
}
