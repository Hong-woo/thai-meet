import { readFile } from "node:fs/promises";
import path from "node:path";

const REQUIRED_DELEGATES = ["user", "publicIdentity", "chatRoom", "report", "block", "rewardLedger"];

export function createGate1DatabaseStore(root, options = {}) {
  if (typeof root !== "string" || root.trim().length === 0 || !path.isAbsolute(root)) {
    throw new Error("TM_GATE1_DATABASE_STORE_ROOT_INVALID: root must be a non-empty absolute string");
  }

  let resolvedClient = options.client ?? null;

  async function readFixture() {
    const client = await getClient();
    validateClient(client);
    const [activeUser, publicIdentities, chatRoom, reports, blocks, rewardLedger] = await Promise.all([
        client.user.findFirst({
          where: { activePublicIdentityId: { not: null }, status: "active" },
          include: { publicIdentities: true },
          orderBy: { createdAt: "asc" }
        }),
        client.publicIdentity.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "asc" }
        }),
        client.chatRoom.findFirst({
          include: {
            participants: { include: { publicIdentity: true }, orderBy: { joinedAt: "asc" } },
            messages: { orderBy: { createdAt: "asc" } },
            exchanges: { orderBy: { createdAt: "asc" } }
          },
          orderBy: { createdAt: "asc" }
        }),
        client.report.findMany({
          include: { reporter: true, reported: true, reportedPublicIdentity: true },
          orderBy: { createdAt: "asc" }
        }),
        client.block.findMany({
          include: { blocker: true, blocked: true },
          orderBy: { createdAt: "asc" }
        }),
        client.rewardLedger.findMany({
          orderBy: { createdAt: "asc" }
        })
    ]);

    if (!activeUser || !chatRoom) {
      throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: persisted Gate 1 reads require seeded User and ChatRoom rows");
    }

    return toGate0FixtureShape({
      activeUser,
      publicIdentities,
      chatRoom,
      reports,
      blocks,
      rewardLedger
    });
  }

  return {
    async readOpenApi() {
      return await readJson(root, "packages/api-contracts/openapi/gate0.openapi.json");
    },

    readFixture,

    async createLineContactExchange(roomId, state) {
      const client = await getClient();
      validateWriteClient(client);
      const fixture = await readFixture();
      if (roomId !== fixture.chatRoom.id) return null;
      const lifecycle = state ? fixture.contactCardStates?.find((entry) => entry.state === state) : null;
      if (state && !lifecycle) return null;

      const contactExchange = lifecycle?.contactExchange || fixture.contactExchange;
      const contactCard = lifecycle?.contactCard || fixture.contactCard;
      await persistContactExchangeWrite(client, fixture, contactExchange);

      return {
        status: 201,
        payload: {
          contactExchange,
          contactCard
        }
      };
    },

    async createSafetyReport() {
      const client = await getClient();
      validateWriteClient(client);
      const fixture = await readFixture();
      const event = fixture.safetyEvents.find((entry) => entry.type === "report");
      if (!event) return { event: null };
      await persistReportWrite(client, fixture, event);
      return { event };
    },

    async createSafetyBlock() {
      const client = await getClient();
      validateWriteClient(client);
      const fixture = await readFixture();
      const event = fixture.safetyEvents.find((entry) => entry.type === "block");
      if (!event) return { event: null };
      await persistBlockWrite(client, fixture, event);
      return { event };
    },

    async acceptLineWebhookEvents(events) {
      const client = await getClient();
      validateLineWebhookClient(client);
      return await persistLineWebhookEvents(client, events);
    }
  };

  async function getClient() {
    if (resolvedClient) return resolvedClient;
    if (!process.env.DATABASE_URL) {
      throw databaseClientUnavailable("DATABASE_URL is required for PERSISTENCE_MODE=database reads");
    }

    try {
      const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
        import("@prisma/client"),
        import("@prisma/adapter-pg")
      ]);
      const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
      resolvedClient = new PrismaClient({ adapter });
      return resolvedClient;
    } catch (error) {
      throw databaseClientUnavailable(`could not load Prisma PostgreSQL adapter client: ${error.message}`);
    }
  }
}

function notScaffolded(method) {
  return new Error(`TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED: ${method} requires Gate 1 persisted store implementation. See docs/dev/GATE1_PERSISTENCE.md.`);
}

async function readJson(root, relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    throw new Error(`TM_GATE1_DATABASE_STORE_READ_FAILED: could not read ${relativePath}: ${error.message}`);
  }
}

function validateClient(client) {
  const missing = REQUIRED_DELEGATES.filter((delegate) => typeof client?.[delegate]?.findMany !== "function" && typeof client?.[delegate]?.findFirst !== "function");
  if (missing.length > 0) {
    throw new Error(`TM_GATE1_DATABASE_CLIENT_INVALID: missing Prisma delegates ${missing.join(",")}`);
  }

  for (const delegate of ["publicIdentity", "report", "block", "rewardLedger"]) {
    if (typeof client[delegate].findMany !== "function") {
      throw new Error(`TM_GATE1_DATABASE_CLIENT_INVALID: client.${delegate}.findMany must be a function`);
    }
  }
  for (const delegate of ["user", "chatRoom"]) {
    if (typeof client[delegate].findFirst !== "function") {
      throw new Error(`TM_GATE1_DATABASE_CLIENT_INVALID: client.${delegate}.findFirst must be a function`);
    }
  }
}

function validateWriteClient(client) {
  validateClient(client);
  for (const delegate of ["externalContact", "contactExchange", "chatMessage"]) {
    if (typeof client?.[delegate]?.upsert !== "function" && delegate !== "externalContact") {
      throw new Error(`TM_GATE1_DATABASE_CLIENT_INVALID: client.${delegate}.upsert must be a function`);
    }
  }
  if (typeof client?.externalContact?.findFirst !== "function") {
    throw new Error("TM_GATE1_DATABASE_CLIENT_INVALID: client.externalContact.findFirst must be a function");
  }
  if (typeof client?.report?.upsert !== "function") {
    throw new Error("TM_GATE1_DATABASE_CLIENT_INVALID: client.report.upsert must be a function");
  }
  if (typeof client?.block?.upsert !== "function") {
    throw new Error("TM_GATE1_DATABASE_CLIENT_INVALID: client.block.upsert must be a function");
  }
}

function validateLineWebhookClient(client) {
  for (const method of ["findUnique", "create", "update"]) {
    if (typeof client?.lineWebhookEvent?.[method] !== "function") {
      throw new Error(`TM_GATE1_DATABASE_CLIENT_INVALID: client.lineWebhookEvent.${method} must be a function`);
    }
  }
}

async function persistLineWebhookEvents(client, events) {
  const eventList = Array.isArray(events) ? events : [];
  let acceptedEventCount = 0;
  let duplicateEventCount = 0;
  let invalidEventCount = 0;

  for (const event of eventList) {
    const eventKey = typeof event?.eventKey === "string" ? event.eventKey : "";
    if (!eventKey) {
      invalidEventCount += 1;
      continue;
    }

    const existing = await client.lineWebhookEvent.findUnique({ where: { eventKey } });
    if (existing) {
      duplicateEventCount += 1;
      await client.lineWebhookEvent.update({
        where: { eventKey },
        data: {
          duplicateCount: { increment: 1 },
          eventType: event.eventType || existing.eventType || null
        }
      });
      continue;
    }

    acceptedEventCount += 1;
    await client.lineWebhookEvent.create({
      data: {
        eventKey,
        provider: "LINE",
        eventType: event.eventType || null
      }
    });
  }

  return {
    eventHandlingMode: "verified_idempotent_database",
    eventCount: eventList.length,
    acceptedEventCount,
    duplicateEventCount,
    invalidEventCount
  };
}

async function persistContactExchangeWrite(client, fixture, contactExchange) {
  const requestedBy = participantForPublicIdentity(fixture, contactExchange.requestedByPublicIdentityId);
  const target = participantForPublicIdentity(fixture, contactExchange.targetPublicIdentityId);
  const contact = await client.externalContact.findFirst({
    where: {
      publicIdentityId: contactExchange.targetPublicIdentityId,
      provider: contactExchange.provider,
      isActive: true
    }
  });
  if (!requestedBy || !target || !contact) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: contact exchange write requires room participants and active ExternalContact seed");
  }

  const existingMessage = fixture.chatMessages.find((message) => message.contactExchangeId === contactExchange.id);
  const messageId = existingMessage?.id || `msg_${contactExchange.id}`;
  await runTransaction(client, async (tx) => {
    await tx.contactExchange.upsert({
      where: { id: contactExchange.id },
      update: toContactExchangeWrite(contactExchange, requestedBy.userId, target.userId, contact.id),
      create: toContactExchangeWrite(contactExchange, requestedBy.userId, target.userId, contact.id)
    });
    await tx.chatMessage.upsert({
      where: { id: messageId },
      update: {
        roomId: contactExchange.roomId,
        senderUserId: requestedBy.userId,
        senderPublicIdentityId: contactExchange.requestedByPublicIdentityId,
        kind: "CONTACT_CARD",
        body: existingMessage?.body || `${contactExchange.provider} contact card`,
        contactExchangeId: contactExchange.id
      },
      create: {
        id: messageId,
        roomId: contactExchange.roomId,
        senderUserId: requestedBy.userId,
        senderPublicIdentityId: contactExchange.requestedByPublicIdentityId,
        kind: "CONTACT_CARD",
        body: existingMessage?.body || `${contactExchange.provider} contact card`,
        contactExchangeId: contactExchange.id
      }
    });
  });
}

async function persistReportWrite(client, fixture, event) {
  const actor = participantForPublicIdentity(fixture, event.actorPublicIdentityId);
  const target = targetParticipant(fixture);
  if (!actor || !target) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: report write requires actor and target participants");
  }

  await client.report.upsert({
    where: { id: event.id },
    update: {
      reporterUserId: actor.userId,
      reportedUserId: target.userId,
      reportedPublicIdentityId: target.publicIdentityId,
      targetType: event.targetType,
      targetId: event.targetId,
      reason: "gate1_write_path"
    },
    create: {
      id: event.id,
      reporterUserId: actor.userId,
      reportedUserId: target.userId,
      reportedPublicIdentityId: target.publicIdentityId,
      targetType: event.targetType,
      targetId: event.targetId,
      reason: "gate1_write_path"
    }
  });
}

async function persistBlockWrite(client, fixture, event) {
  const actor = participantForPublicIdentity(fixture, event.actorPublicIdentityId);
  const target = targetParticipant(fixture);
  if (!actor || !target) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: block write requires actor and target participants");
  }

  await client.block.upsert({
    where: { id: event.id },
    update: {
      blockerUserId: actor.userId,
      blockedUserId: target.userId,
      visiblePublicIdentityId: event.targetId
    },
    create: {
      id: event.id,
      blockerUserId: actor.userId,
      blockedUserId: target.userId,
      visiblePublicIdentityId: event.targetId
    }
  });
}

function toContactExchangeWrite(contactExchange, senderUserId, receiverUserId, contactId) {
  return {
    id: contactExchange.id,
    roomId: contactExchange.roomId,
    senderUserId,
    receiverUserId,
    requestedByPublicIdentityId: contactExchange.requestedByPublicIdentityId,
    targetPublicIdentityId: contactExchange.targetPublicIdentityId,
    contactId,
    provider: contactExchange.provider,
    status: contactExchange.status.toUpperCase(),
    permissionScope: contactExchange.permission.scope,
    canViewContactCard: contactExchange.permission.canViewContactCard,
    canCopyRawValue: false,
    canReport: contactExchange.permission.canReport,
    canBlock: contactExchange.permission.canBlock
  };
}

async function runTransaction(client, fn) {
  if (typeof client.$transaction === "function") return await client.$transaction(fn);
  return await fn(client);
}

function participantForPublicIdentity(fixture, publicIdentityId) {
  return fixture.chatRoom.participantSnapshot.find((entry) => entry.publicIdentityId === publicIdentityId);
}

function targetParticipant(fixture) {
  return fixture.chatRoom.participantSnapshot.find((entry) => entry.publicIdentityId === fixture.discoverProfile.publicIdentityId);
}

function toGate0FixtureShape({ activeUser, publicIdentities, chatRoom, reports, blocks, rewardLedger }) {
  const identitiesById = new Map(publicIdentities.map((identity) => [identity.id, identity]));
  for (const participant of chatRoom.participants ?? []) {
    if (participant.publicIdentity) identitiesById.set(participant.publicIdentity.id, participant.publicIdentity);
  }

  const activeIdentity =
    identitiesById.get(activeUser.activePublicIdentityId) ||
    activeUser.publicIdentities?.find((identity) => identity.id === activeUser.activePublicIdentityId);
  if (!activeIdentity) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: active user must have an active PublicIdentity");
  }

  const participantSnapshot = (chatRoom.participants ?? []).map((participant) => {
    const identity = participant.publicIdentity || identitiesById.get(participant.publicIdentityIdAtCreation);
    return {
      userId: participant.userId,
      publicIdentityId: participant.publicIdentityIdAtCreation,
      publicId: identity?.publicId,
      displayName: identity?.displayName,
      city: identity?.city
    };
  });
  const discoverIdentity =
    publicIdentities.find((identity) => identity.id !== activeIdentity.id) ||
    participantSnapshot.find((entry) => entry.publicIdentityId !== activeIdentity.id);
  if (!discoverIdentity) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: discover PublicIdentity seed is required");
  }

  const exchanges = (chatRoom.exchanges ?? []).map(toContactExchange);
  const defaultExchange = exchanges.find((exchange) => exchange.status === "available") || exchanges[0];
  if (!defaultExchange) {
    throw new Error("TM_GATE1_DATABASE_SEED_REQUIRED: ContactExchange seed is required");
  }

  return {
    trustLoop: {
      steps: [
        "mockLogin",
        "publicIdGenerated",
        "discoverProfileVisible",
        "chatStarted",
        "lineContactExchangeCreated",
        "contactCardRendered",
        "reportBlockRecorded"
      ]
    },
    mockUser: {
      userId: activeUser.id,
      publicIdentityId: activeIdentity.id,
      publicId: activeIdentity.publicId,
      displayName: activeIdentity.displayName,
      city: activeIdentity.city
    },
    discoverProfile: {
      publicIdentityId: discoverIdentity.publicIdentityId || discoverIdentity.id,
      displayName: discoverIdentity.displayName,
      age: discoverIdentity.age,
      city: discoverIdentity.city
    },
    chatRoom: {
      id: chatRoom.id,
      participantSnapshot
    },
    chatMessages: (chatRoom.messages ?? []).map(toChatMessage),
    contactExchange: defaultExchange,
    contactCard: toContactCard(defaultExchange),
    contactCardStates: exchanges.map((exchange) => ({
      state: exchange.status,
      contactExchange: exchange,
      contactCard: toContactCard(exchange)
    })),
    safetyEvents: [
      ...(reports ?? []).map((report) => ({
        id: report.id,
        type: "report",
        targetType: report.targetType,
        targetId: report.targetId,
        actorPublicIdentityId: activeIdentity.id
      })),
      ...(blocks ?? []).map((block) => ({
        id: block.id,
        type: "block",
        targetType: "public_identity",
        targetId: block.visiblePublicIdentityId,
        actorPublicIdentityId: activeIdentity.id
      }))
    ],
    rewardLedger: (rewardLedger ?? []).map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      publicIdentityId: entry.publicIdentityId,
      type: lowerSnake(entry.type),
      amount: entry.amount,
      expiresAt: toIsoString(entry.expiresAt),
      createdAt: toIsoString(entry.createdAt)
    }))
  };
}

function toChatMessage(message) {
  return {
    id: message.id,
    roomId: message.roomId,
    senderPublicIdentityId: message.senderPublicIdentityId,
    body: message.body,
    createdAt: toIsoString(message.createdAt),
    ...(message.contactExchangeId ? { contactExchangeId: message.contactExchangeId } : {})
  };
}

function toContactExchange(exchange) {
  return {
    id: exchange.id,
    provider: exchange.provider,
    status: lowerSnake(exchange.status),
    roomId: exchange.roomId,
    requestedByPublicIdentityId: exchange.requestedByPublicIdentityId,
    targetPublicIdentityId: exchange.targetPublicIdentityId,
    permission: {
      canViewContactCard: Boolean(exchange.canViewContactCard),
      canCopyRawValue: Boolean(exchange.canCopyRawValue),
      canReport: Boolean(exchange.canReport),
      canBlock: Boolean(exchange.canBlock),
      scope: exchange.permissionScope
    }
  };
}

function toContactCard(exchange) {
  return {
    id: exchange.id.replace(/^cex_/, "card_"),
    contactExchangeId: exchange.id,
    provider: exchange.provider,
    state: exchange.status,
    displayLabel:
      exchange.status === "provider_unavailable"
        ? `${exchange.provider} provider unavailable`
        : `${exchange.provider} contact ${exchange.status.replaceAll("_", " ")}`,
    valueRedacted: true,
    copyRawValue: exchange.permission.canCopyRawValue
  };
}

function lowerSnake(value) {
  return String(value ?? "").toLowerCase();
}

function toIsoString(value) {
  if (!value) return value;
  return value instanceof Date ? value.toISOString() : value;
}

function databaseClientUnavailable(reason) {
  return new Error(`TM_GATE1_DATABASE_CLIENT_UNAVAILABLE: ${reason}. See docs/dev/GATE1_PERSISTENCE.md.`);
}

export const gate1DatabaseStoreCompatibilityMarker = notScaffolded;
