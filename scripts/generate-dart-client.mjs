import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openApiPath = path.join(root, "packages/api-contracts/openapi/gate0.openapi.json");
const outDir = path.join(root, "packages/api-contracts/dart");
const outPath = path.join(outDir, "thai_meet_api_client.dart");
const openApi = JSON.parse(await readFile(openApiPath, "utf8"));

const paths = Object.keys(openApi.paths || {});
const hasLineExchange = paths.includes("/api/v1/chats/rooms/{roomId}/contact-exchanges/line");
const lineExchangeParameters = openApi.paths?.["/api/v1/chats/rooms/{roomId}/contact-exchanges/line"]?.post?.parameters || [];
const lineExchangeStateEnum = lineExchangeParameters.find((parameter) => parameter.name === "state")?.schema?.enum || [];

const client = `// Placeholder generated client for the Gate 0 scaffold.
// Generated from packages/api-contracts/openapi/gate0.openapi.json.

class ThaiMeetApiClient {
  const ThaiMeetApiClient();

  String get healthPath => '/health';
  String get cognitoCallbackPath => '/auth/callback/cognito';
  String get lineWebhookPath => '/webhooks/line';
  String get myPublicIdentitiesPath => '/api/v1/public-identities/me';
  String get discoverProfilesPath => '/api/v1/discover/profiles';

  String chatRoomPath(String roomId) {
    final encodedRoomId = Uri.encodeComponent(roomId);
    return '/api/v1/chats/rooms/$encodedRoomId';
  }

  String lineContactExchangePath(String roomId, {String? state}) {
    final encodedRoomId = Uri.encodeComponent(roomId);
    final path = '/api/v1/chats/rooms/$encodedRoomId/contact-exchanges/line';
    if (state == null) return path;
    final encodedState = Uri.encodeQueryComponent(state);
    return '$path?state=$encodedState';
  }

  String get createSafetyReportPath => '/api/v1/safety/reports';
  String get createSafetyBlockPath => '/api/v1/safety/blocks';
}

const bool gate0LineContactExchangeInContract = ${hasLineExchange ? "true" : "false"};
const List<String> gate0LineContactExchangeStates = ${dartStringList(lineExchangeStateEnum)};
`;

await mkdir(outDir, { recursive: true });
await writeFile(outPath, client);
console.log(`Dart client scaffold generated: ${path.relative(root, outPath)}`);

function dartStringList(values) {
  return `[${values.map((value) => `'${String(value).replaceAll("'", "\\'")}'`).join(", ")}]`;
}
