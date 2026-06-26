import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openApi = JSON.parse(await readFile(path.join(root, "packages/api-contracts/openapi/gate0.openapi.json"), "utf8"));
const dartClient = await readFile(path.join(root, "packages/api-contracts/dart/thai_meet_api_client.dart"), "utf8");

const requiredPaths = [
  "/health",
  "/auth/callback/cognito",
  "/webhooks/line",
  "/api/v1/public-identities/me",
  "/api/v1/discover/profiles",
  "/api/v1/chats/rooms/{roomId}",
  "/api/v1/chats/rooms/{roomId}/contact-exchanges/line",
  "/api/v1/safety/reports",
  "/api/v1/safety/blocks"
];

const missing = requiredPaths.filter((route) => !openApi.paths?.[route]);

if (missing.length > 0) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  for (const route of missing) console.error(`- missing ${route}`);
  process.exit(1);
}

const healthSchema = openApi.paths?.["/health"]?.get?.responses?.["200"]?.content?.["application/json"]?.schema;
const healthPersistenceMode = healthSchema?.properties?.persistenceMode;
if (!healthSchema?.required?.includes("persistenceMode") || !healthPersistenceMode?.enum?.includes("fixture") || !healthPersistenceMode?.enum?.includes("database")) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- health OpenAPI response must require persistenceMode enum fixture/database");
  process.exit(1);
}

if (!dartClient.includes("lineContactExchangePath")) {
  console.error("TM_CONTRACT_DART_CLIENT_STALE");
  console.error("- generated Dart client placeholder does not expose lineContactExchangePath");
  process.exit(1);
}

for (const route of ["cognitoCallbackPath", "lineWebhookPath"]) {
  if (!dartClient.includes(route)) {
    console.error("TM_CONTRACT_DART_CLIENT_STALE");
    console.error(`- generated Dart client placeholder does not expose ${route}`);
    process.exit(1);
  }
}

const cognitoResponses = openApi.paths?.["/auth/callback/cognito"]?.get?.responses || {};
if (!cognitoResponses["200"] || !cognitoResponses["400"] || !cognitoResponses["502"] || !cognitoResponses["503"]) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- Cognito callback OpenAPI must expose 200 success plus 400, 502, and 503 fail-closed responses");
  process.exit(1);
}

const lineWebhookSignature = openApi.paths?.["/webhooks/line"]?.post?.parameters?.find((parameter) => parameter.name === "x-line-signature" && parameter.in === "header");
if (!lineWebhookSignature?.required) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- LINE webhook OpenAPI must require x-line-signature header");
  process.exit(1);
}

const lineWebhookResponses = openApi.paths?.["/webhooks/line"]?.post?.responses || {};
if (!lineWebhookResponses["202"] || !lineWebhookResponses["400"] || !lineWebhookResponses["401"]) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- LINE webhook OpenAPI must accept verified events with 202, reject invalid JSON with 400, and fail bad signatures with 401");
  process.exit(1);
}

const lineWebhookAcceptedSchema = lineWebhookResponses["202"]?.content?.["application/json"]?.schema;
if (
  !lineWebhookAcceptedSchema?.required?.includes("acceptedEventCount") ||
  !lineWebhookAcceptedSchema?.required?.includes("duplicateEventCount") ||
  !lineWebhookAcceptedSchema?.properties?.eventHandlingMode?.enum?.includes("verified_idempotent_noop")
) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- LINE webhook OpenAPI must expose idempotent no-op event counts");
  process.exit(1);
}

const lineExchangeParameters = openApi.paths?.["/api/v1/chats/rooms/{roomId}/contact-exchanges/line"]?.post?.parameters || [];
const stateParameter = lineExchangeParameters.find((parameter) => parameter.name === "state" && parameter.in === "query");
if (!stateParameter?.schema?.enum?.includes("provider_unavailable")) {
  console.error("TM_CONTRACT_OPENAPI_STALE");
  console.error("- line ContactExchange OpenAPI must expose state query enum including provider_unavailable");
  process.exit(1);
}

for (const clientMember of ["discoverProfilesPath", "chatRoomPath", "createSafetyReportPath", "createSafetyBlockPath"]) {
  if (!dartClient.includes(clientMember)) {
    console.error("TM_CONTRACT_DART_CLIENT_STALE");
    console.error(`- generated Dart client placeholder does not expose ${clientMember}`);
    process.exit(1);
  }
}

if (!dartClient.includes("Uri.encodeComponent(roomId)")) {
  console.error("TM_CONTRACT_DART_CLIENT_STALE");
  console.error("- generated Dart client must encode roomId path segments");
  process.exit(1);
}

for (const fragment of ["String? state", "Uri.encodeQueryComponent(state)", "?state=$encodedState", "provider_unavailable"]) {
  if (!dartClient.includes(fragment)) {
    console.error("TM_CONTRACT_DART_CLIENT_STALE");
    console.error(`- generated Dart client must expose lifecycle state query support: ${fragment}`);
    process.exit(1);
  }
}

console.log("Gate 0 API contract scaffold OK");
