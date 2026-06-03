import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openApiPath = path.join(root, "packages/api-contracts/openapi/gate0.openapi.json");
const outDir = path.join(root, "packages/api-contracts/dart");
const outPath = path.join(outDir, "thai_meet_api_client.dart");
const openApi = JSON.parse(await readFile(openApiPath, "utf8"));

const paths = Object.keys(openApi.paths || {});
const hasLineExchange = paths.includes("/api/v1/chats/rooms/{roomId}/contact-exchanges/line");

const client = `// Placeholder generated client for the Gate 0 scaffold.
// Generated from packages/api-contracts/openapi/gate0.openapi.json.

class ThaiMeetApiClient {
  const ThaiMeetApiClient();

  String get healthPath => '/health';
  String get myPublicIdentitiesPath => '/api/v1/public-identities/me';
  String get discoverProfilesPath => '/api/v1/discover/profiles';

  String chatRoomPath(String roomId) {
    return '/api/v1/chats/rooms/$roomId';
  }

  String lineContactExchangePath(String roomId) {
    return '/api/v1/chats/rooms/$roomId/contact-exchanges/line';
  }

  String get createSafetyReportPath => '/api/v1/safety/reports';
  String get createSafetyBlockPath => '/api/v1/safety/blocks';
}

const bool gate0LineContactExchangeInContract = ${hasLineExchange ? "true" : "false"};
`;

await mkdir(outDir, { recursive: true });
await writeFile(outPath, client);
console.log(`Dart client scaffold generated: ${path.relative(root, outPath)}`);
