// Placeholder generated client for the Gate 0 scaffold.
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

const bool gate0LineContactExchangeInContract = true;
