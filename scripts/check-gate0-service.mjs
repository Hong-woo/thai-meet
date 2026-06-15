import { readFile } from "node:fs/promises";
import path from "node:path";
import { createGate0Service } from "../apps/api/src/gate0-service.mjs";

const root = process.cwd();
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));

let fixtureReadCount = 0;
let openApiReadCount = 0;
const store = {
  async readFixture() {
    fixtureReadCount += 1;
    return fixture;
  },
  async readOpenApi() {
    openApiReadCount += 1;
    return { openapi: "fixture-openapi" };
  }
};

const service = createGate0Service(store);

assertThrows(
  () => createGate0Service({}),
  "TM_GATE0_SERVICE_STORE_INVALID",
  "service should reject stores missing required methods"
);

const openApi = await service.getOpenApi();
assertEqual(openApi.openapi, "fixture-openapi", "service should read OpenAPI through the injected store");

const publicIdentity = await service.getMyPublicIdentity();
assertEqual(publicIdentity.publicId, fixture.mockUser.publicId, "service should map public identity from store fixture");

const discover = await service.listDiscoverProfiles();
assertEqual(discover.profiles[0].publicIdentityId, fixture.discoverProfile.publicIdentityId, "service should list discover profiles from store fixture");

const chatRoom = await service.getChatRoom(fixture.chatRoom.id);
assertEqual(chatRoom.messages.length, fixture.chatMessages.length, "service should attach chat messages from store fixture");

const missingRoom = await service.getChatRoom("missing-room");
assertEqual(missingRoom, null, "service should return null for missing room");

const lineExchange = await service.createLineContactExchange(fixture.chatRoom.id);
assertEqual(lineExchange.status, 201, "service should create default LINE ContactExchange");
assertEqual(lineExchange.payload.contactCard.copyRawValue, false, "service should keep Contact Card raw copy disabled");

const revokedExchange = await service.createLineContactExchange(fixture.chatRoom.id, null, "revoked");
assertEqual(revokedExchange.payload.contactExchange.status, "revoked", "service should load lifecycle state from store fixture");

const duplicate = await service.createLineContactExchange(fixture.chatRoom.id, "duplicate-idempotency-key");
assertEqual(duplicate.status, 409, "service should expose stable duplicate idempotency error");

const report = await service.createSafetyReport();
assertEqual(report.event.type, "report", "service should create report event from store fixture");

const block = await service.createSafetyBlock();
assertEqual(block.event.type, "block", "service should create block event from store fixture");

if (openApiReadCount !== 1 || fixtureReadCount < 7) {
  fail(`service should use injected store reads. openApiReadCount=${openApiReadCount}, fixtureReadCount=${fixtureReadCount}`);
}

console.log("Gate 0 service boundary OK");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function fail(message) {
  console.error(`TM_GATE0_SERVICE_CHECK_FAILED\n${message}`);
  process.exit(1);
}

function assertThrows(fn, expectedCode, message) {
  try {
    fn();
  } catch (error) {
    if (String(error.message).includes(expectedCode)) return;
    fail(`${message}\nExpected error code: ${expectedCode}\nActual error: ${error.message}`);
  }
  fail(`${message}\nExpected throw with ${expectedCode}`);
}
