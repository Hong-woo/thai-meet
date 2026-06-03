import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openApi = JSON.parse(await readFile(path.join(root, "packages/api-contracts/openapi/gate0.openapi.json"), "utf8"));
const dartClient = await readFile(path.join(root, "packages/api-contracts/dart/thai_meet_api_client.dart"), "utf8");

const requiredPaths = [
  "/health",
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

if (!dartClient.includes("lineContactExchangePath")) {
  console.error("TM_CONTRACT_DART_CLIENT_STALE");
  console.error("- generated Dart client placeholder does not expose lineContactExchangePath");
  process.exit(1);
}

for (const clientMember of ["discoverProfilesPath", "chatRoomPath", "createSafetyReportPath", "createSafetyBlockPath"]) {
  if (!dartClient.includes(clientMember)) {
    console.error("TM_CONTRACT_DART_CLIENT_STALE");
    console.error(`- generated Dart client placeholder does not expose ${clientMember}`);
    process.exit(1);
  }
}

console.log("Gate 0 API contract scaffold OK");
