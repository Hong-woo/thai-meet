import { createGate0FixtureStore } from "../apps/api/src/gate0-fixture-store.mjs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const failures = [];
const root = process.cwd();

assertThrows(
  () => createGate0FixtureStore(""),
  "TM_GATE0_FIXTURE_STORE_ROOT_INVALID",
  "fixture store should reject an empty root"
);

assertThrows(
  () => createGate0FixtureStore("   "),
  "TM_GATE0_FIXTURE_STORE_ROOT_INVALID",
  "fixture store should reject a blank root"
);

assertThrows(
  () => createGate0FixtureStore("relative-root"),
  "TM_GATE0_FIXTURE_STORE_ROOT_INVALID",
  "fixture store should reject a relative root"
);

const emptyRoot = await mkdtemp(path.join(os.tmpdir(), "thai-meet-fixture-store-"));
try {
  await assertRejects(
    () => createGate0FixtureStore(emptyRoot).readFixture(),
    "TM_GATE0_FIXTURE_STORE_READ_FAILED",
    "fixture store should wrap missing fixture reads with a stable code"
  );
} finally {
  await rm(emptyRoot, { recursive: true, force: true });
}

const invalidJsonRoot = await mkdtemp(path.join(os.tmpdir(), "thai-meet-fixture-store-invalid-json-"));
try {
  const fixtureDir = path.join(invalidJsonRoot, "packages", "api-contracts", "fixtures");
  await mkdir(fixtureDir, { recursive: true });
  await writeFile(path.join(fixtureDir, "gate0-smoke.json"), "{ nope", "utf8");
  await assertRejects(
    () => createGate0FixtureStore(invalidJsonRoot).readFixture(),
    "TM_GATE0_FIXTURE_STORE_INVALID_JSON",
    "fixture store should wrap invalid fixture JSON with a stable code"
  );
} finally {
  await rm(invalidJsonRoot, { recursive: true, force: true });
}

try {
  const store = createGate0FixtureStore(root);
  const openApi = await store.readOpenApi();
  const fixture = await store.readFixture();

  if (openApi.openapi !== "3.0.3") {
    failures.push("fixture store must read the Gate 0 OpenAPI contract");
  }
  if (!fixture.mockUser?.publicId || !fixture.contactExchange?.id) {
    failures.push("fixture store must read the Gate 0 smoke fixture");
  }
} catch (error) {
  failures.push(`fixture store read failed: ${error.message}`);
}

if (failures.length > 0) {
  console.error("TM_GATE0_FIXTURE_STORE_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 fixture store OK");

function assertThrows(fn, expectedCode, message) {
  try {
    fn();
    failures.push(message);
  } catch (error) {
    if (!String(error.message).includes(expectedCode)) {
      failures.push(`${message}: expected ${expectedCode}, got ${error.message}`);
    }
  }
}

async function assertRejects(fn, expectedCode, message) {
  try {
    await fn();
    failures.push(message);
  } catch (error) {
    if (!String(error.message).includes(expectedCode)) {
      failures.push(`${message}: expected ${expectedCode}, got ${error.message}`);
    }
  }
}
