// Placeholder generated client for the Gate 0 scaffold.
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

const bool gate0LineContactExchangeInContract = true;
const List<String> gate0LineContactExchangeStates = ['locked', 'available', 'revoked', 'reported', 'blocked', 'provider_unavailable'];
