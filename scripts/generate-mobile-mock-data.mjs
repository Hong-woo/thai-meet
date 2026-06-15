import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const fixturePath = path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json");
const outPath = path.join(root, "apps/mobile/lib/gate0_mock_data.dart");

const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
const participantSnapshot = fixture.chatRoom?.participantSnapshot || [];
const tourist = participantSnapshot.find((participant) => participant.publicIdentityId === fixture.discoverProfile.publicIdentityId) || {};

const dart = `// GENERATED from packages/api-contracts/fixtures/gate0-smoke.json.
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
        userId: ${dartString(fixture.mockUser.userId)},
        publicIdentityId: ${dartString(fixture.mockUser.publicIdentityId)},
        publicId: ${dartString(fixture.mockUser.publicId)},
        displayName: ${dartString(fixture.mockUser.displayName)},
        city: ${dartString(fixture.mockUser.city)},
      );

  Gate0DiscoverProfile get discoverProfile => const Gate0DiscoverProfile(
        publicIdentityId: ${dartString(fixture.discoverProfile.publicIdentityId)},
        publicId: ${dartString(tourist.publicId || "")},
        displayName: ${dartString(fixture.discoverProfile.displayName)},
        age: ${Number(fixture.discoverProfile.age || 0)},
        city: ${dartString(fixture.discoverProfile.city)},
        distanceLabel: '2 km away',
      );

  Gate0ChatRoom get chatRoom => Gate0ChatRoom(
        id: ${dartString(fixture.chatRoom.id)},
        participants: [
${participantSnapshot.map((participant) => `          const Gate0PublicIdentity(
            userId: ${dartString(participant.userId)},
            publicIdentityId: ${dartString(participant.publicIdentityId)},
            publicId: ${dartString(participant.publicId)},
            displayName: ${dartString(participant.displayName)},
            city: ${dartString(participant.city)},
          ),`).join("\n")}
        ],
      );

  List<Gate0ChatMessage> get chatMessages => const [
${fixture.chatMessages.map((message) => `        Gate0ChatMessage(
          id: ${dartString(message.id)},
          roomId: ${dartString(message.roomId)},
          senderPublicIdentityId: ${dartString(message.senderPublicIdentityId)},
          body: ${dartString(message.body)},
${message.contactExchangeId ? `          contactExchangeId: ${dartString(message.contactExchangeId)},\n` : ""}        ),`).join("\n")}
      ];

  Map<Gate0ContactCardState, Gate0ContactCardModel> get contactCardsByState => const {
${fixture.contactCardStates.map((entry) => {
  const card = entry.contactCard;
  const state = dartState(entry.state);
  return `        Gate0ContactCardState.${state}: Gate0ContactCardModel(
          id: ${dartString(card.id)},
          contactExchangeId: ${dartString(card.contactExchangeId)},
          provider: ${dartString(card.provider)},
          state: Gate0ContactCardState.${state},
          displayLabel: ${dartString(card.displayLabel)},
          valueRedacted: ${String(card.valueRedacted)},
          copyRawValue: ${String(card.copyRawValue)},
        ),`;
}).join("\n")}
      };
}
`;

await writeFile(outPath, dart);
console.log(`Mobile mock data generated: ${path.relative(root, outPath)}`);

function dartString(value) {
  return JSON.stringify(String(value)).replaceAll("$", "\\$");
}

function dartState(state) {
  if (state === "provider_unavailable") return "providerUnavailable";
  return state;
}
