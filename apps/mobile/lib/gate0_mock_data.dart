// GENERATED from packages/api-contracts/fixtures/gate0-smoke.json.
// Run npm run mobile:mock-data:generate after editing Gate 0 fixtures.

enum Gate0ContactCardState {
  locked,
  available,
  revoked,
  reported,
  blocked,
  providerUnavailable,
}

class Gate0PublicIdentity {
  const Gate0PublicIdentity({
    required this.userId,
    required this.publicIdentityId,
    required this.publicId,
    required this.displayName,
    required this.city,
  });

  final String userId;
  final String publicIdentityId;
  final String publicId;
  final String displayName;
  final String city;
}

class Gate0DiscoverProfile {
  const Gate0DiscoverProfile({
    required this.publicIdentityId,
    required this.publicId,
    required this.displayName,
    required this.age,
    required this.city,
    required this.distanceLabel,
  });

  final String publicIdentityId;
  final String publicId;
  final String displayName;
  final int age;
  final String city;
  final String distanceLabel;
}

class Gate0ChatRoom {
  const Gate0ChatRoom({
    required this.id,
    required this.participants,
  });

  final String id;
  final List<Gate0PublicIdentity> participants;
}

class Gate0ChatMessage {
  const Gate0ChatMessage({
    required this.id,
    required this.roomId,
    required this.senderPublicIdentityId,
    required this.body,
    this.contactExchangeId,
  });

  final String id;
  final String roomId;
  final String senderPublicIdentityId;
  final String body;
  final String? contactExchangeId;
}

class Gate0ContactCardModel {
  const Gate0ContactCardModel({
    required this.id,
    required this.contactExchangeId,
    required this.provider,
    required this.state,
    required this.displayLabel,
    required this.valueRedacted,
    required this.copyRawValue,
  });

  final String id;
  final String contactExchangeId;
  final String provider;
  final Gate0ContactCardState state;
  final String displayLabel;
  final bool valueRedacted;
  final bool copyRawValue;
}

class Gate0MockData {
  const Gate0MockData();

  Gate0PublicIdentity get mockUser => const Gate0PublicIdentity(
        userId: "usr_gate0_local",
        publicIdentityId: "pub_bkk_local_001",
        publicId: "TM-BKK-001",
        displayName: "Mai",
        city: "Bangkok",
      );

  Gate0DiscoverProfile get discoverProfile => const Gate0DiscoverProfile(
        publicIdentityId: "pub_pattaya_tourist_001",
        publicId: "TM-PTY-031",
        displayName: "Alex",
        age: 31,
        city: "Pattaya",
        distanceLabel: '2 km away',
      );

  Gate0ChatRoom get chatRoom => Gate0ChatRoom(
        id: "room_gate0_local",
        participants: [
          const Gate0PublicIdentity(
            userId: "usr_gate0_local",
            publicIdentityId: "pub_bkk_local_001",
            publicId: "TM-BKK-001",
            displayName: "Mai",
            city: "Bangkok",
          ),
          const Gate0PublicIdentity(
            userId: "usr_tourist_local",
            publicIdentityId: "pub_pattaya_tourist_001",
            publicId: "TM-PTY-031",
            displayName: "Alex",
            city: "Pattaya",
          ),
        ],
      );

  List<Gate0ChatMessage> get chatMessages => const [
        Gate0ChatMessage(
          id: "msg_gate0_001",
          roomId: "room_gate0_local",
          senderPublicIdentityId: "pub_pattaya_tourist_001",
          body: "Hi Mai, nice to meet you.",
        ),
        Gate0ChatMessage(
          id: "msg_gate0_002",
          roomId: "room_gate0_local",
          senderPublicIdentityId: "pub_bkk_local_001",
          body: "Let's unlock a LINE contact card here.",
          contactExchangeId: "cex_gate0_line_001",
        ),
      ];

  Map<Gate0ContactCardState, Gate0ContactCardModel> get contactCardsByState => const {
        Gate0ContactCardState.locked: Gate0ContactCardModel(
          id: "card_gate0_line_locked",
          contactExchangeId: "cex_gate0_line_locked",
          provider: "LINE",
          state: Gate0ContactCardState.locked,
          displayLabel: "LINE contact locked",
          valueRedacted: true,
          copyRawValue: false,
        ),
        Gate0ContactCardState.available: Gate0ContactCardModel(
          id: "card_gate0_line_001",
          contactExchangeId: "cex_gate0_line_001",
          provider: "LINE",
          state: Gate0ContactCardState.available,
          displayLabel: "LINE contact available",
          valueRedacted: true,
          copyRawValue: false,
        ),
        Gate0ContactCardState.revoked: Gate0ContactCardModel(
          id: "card_gate0_line_revoked",
          contactExchangeId: "cex_gate0_line_revoked",
          provider: "LINE",
          state: Gate0ContactCardState.revoked,
          displayLabel: "LINE contact revoked",
          valueRedacted: true,
          copyRawValue: false,
        ),
        Gate0ContactCardState.reported: Gate0ContactCardModel(
          id: "card_gate0_line_reported",
          contactExchangeId: "cex_gate0_line_reported",
          provider: "LINE",
          state: Gate0ContactCardState.reported,
          displayLabel: "LINE contact reported",
          valueRedacted: true,
          copyRawValue: false,
        ),
        Gate0ContactCardState.blocked: Gate0ContactCardModel(
          id: "card_gate0_line_blocked",
          contactExchangeId: "cex_gate0_line_blocked",
          provider: "LINE",
          state: Gate0ContactCardState.blocked,
          displayLabel: "LINE contact blocked",
          valueRedacted: true,
          copyRawValue: false,
        ),
        Gate0ContactCardState.providerUnavailable: Gate0ContactCardModel(
          id: "card_gate0_line_provider_unavailable",
          contactExchangeId: "cex_gate0_line_provider_unavailable",
          provider: "LINE",
          state: Gate0ContactCardState.providerUnavailable,
          displayLabel: "LINE provider unavailable",
          valueRedacted: true,
          copyRawValue: false,
        ),
      };
}
