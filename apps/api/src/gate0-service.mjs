export function createGate0Service(store, options = {}) {
  validateGate0Store(store);
  const lineWebhookEventLedger = new Set();
  const lineWebhookEventStoreMode = options.lineWebhookEventStoreMode || process.env.LINE_WEBHOOK_EVENT_STORE_MODE || "memory";

  return {
    async getOpenApi() {
      return await store.readOpenApi();
    },

    async getFixture() {
      return await store.readFixture();
    },

    async getMyPublicIdentity() {
      const fixture = await store.readFixture();
      return {
        userId: fixture.mockUser.userId,
        publicIdentityId: fixture.mockUser.publicIdentityId,
        publicId: fixture.mockUser.publicId,
        displayName: fixture.mockUser.displayName,
        city: fixture.mockUser.city
      };
    },

    async listDiscoverProfiles() {
      const fixture = await store.readFixture();
      return { profiles: [fixture.discoverProfile] };
    },

    async getChatRoom(roomId) {
      const fixture = await store.readFixture();
      if (roomId !== fixture.chatRoom.id) return null;
      return {
        ...fixture.chatRoom,
        messages: fixture.chatMessages
      };
    },

    async createLineContactExchange(roomId, errorCase, state) {
      if (errorCase && contactExchangeErrors[errorCase]) {
        const { status, error } = contactExchangeErrors[errorCase];
        return { status, payload: apiError(error) };
      }

      if (typeof store.createLineContactExchange === "function") {
        return await store.createLineContactExchange(roomId, state);
      }

      const fixture = await store.readFixture();
      if (roomId !== fixture.chatRoom.id) return null;
      const lifecycle = state ? fixture.contactCardStates?.find((entry) => entry.state === state) : null;
      if (state && !lifecycle) return null;

      return {
        status: 201,
        payload: {
          contactExchange: lifecycle?.contactExchange || fixture.contactExchange,
          contactCard: lifecycle?.contactCard || fixture.contactCard
        }
      };
    },

    async createSafetyReport() {
      if (typeof store.createSafetyReport === "function") {
        return await store.createSafetyReport();
      }

      const fixture = await store.readFixture();
      return { event: fixture.safetyEvents.find((event) => event.type === "report") };
    },

    async createSafetyBlock() {
      if (typeof store.createSafetyBlock === "function") {
        return await store.createSafetyBlock();
      }

      const fixture = await store.readFixture();
      return { event: fixture.safetyEvents.find((event) => event.type === "block") };
    },

    async acceptLineWebhookEvents(events) {
      if (lineWebhookEventStoreMode === "database" && typeof store.acceptLineWebhookEvents === "function") {
        return await store.acceptLineWebhookEvents(events);
      }

      return acceptLineWebhookEventsInMemory(lineWebhookEventLedger, events);
    }
  };
}

function validateGate0Store(store) {
  for (const method of ["readOpenApi", "readFixture"]) {
    if (typeof store?.[method] !== "function") {
      throw new Error(`TM_GATE0_SERVICE_STORE_INVALID: store.${method} must be a function`);
    }
  }
}

export function notFound(param) {
  return apiError({
    type: "not_found",
    code: "TM_API_ROUTE_NOT_FOUND",
    message: "No route exists for this local scaffold endpoint.",
    param,
    docRef: "docs/dev/ERRORS.md#route-not-found"
  });
}

export function scaffoldFailure() {
  return apiError({
    type: "system_error",
    code: "TM_API_SCAFFOLD_FAILURE",
    message: "The local scaffold could not read its fixture or contract file.",
    param: "fixture",
    docRef: "docs/dev/ERRORS.md#scaffold-failure"
  });
}

export function databaseStoreNotScaffolded() {
  return apiError({
    type: "system_error",
    code: "TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED",
    message: "Database persistence mode is present but persisted reads are not scaffolded yet.",
    param: "PERSISTENCE_MODE",
    docRef: "docs/dev/GATE1_PERSISTENCE.md#local-modes"
  });
}

export function databaseClientUnavailable() {
  return apiError({
    type: "system_error",
    code: "TM_GATE1_DATABASE_CLIENT_UNAVAILABLE",
    message: "Database persistence mode requires DATABASE_URL and a generated Prisma client before persisted reads can run.",
    param: "DATABASE_URL",
    docRef: "docs/dev/GATE1_PERSISTENCE.md#local-modes"
  });
}

export function authCallbackCodeRequired() {
  return apiError({
    type: "validation_error",
    code: "TM_API_AUTH_CALLBACK_CODE_REQUIRED",
    message: "Cognito callback requires an authorization code.",
    param: "code",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#cognito"
  });
}

export function authCallbackNotImplemented() {
  return apiError({
    type: "system_error",
    code: "TM_API_AUTH_CALLBACK_NOT_IMPLEMENTED",
    message: "Cognito callback route is reserved but token exchange is not implemented yet.",
    param: "code",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#cognito"
  });
}

export function authCallbackConfigRequired() {
  return apiError({
    type: "system_error",
    code: "TM_API_AUTH_CALLBACK_CONFIG_REQUIRED",
    message: "Cognito callback requires provider issuer and audience configuration.",
    param: "AUTH_PROVIDER_ISSUER",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#cognito"
  });
}

export function authCallbackTokenExchangeFailed() {
  return apiError({
    type: "provider_error",
    code: "TM_API_AUTH_CALLBACK_TOKEN_EXCHANGE_FAILED",
    message: "Cognito authorization code exchange failed.",
    param: "code",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#cognito"
  });
}

export function authCallbackAccepted({ sessionId, expiresInSeconds, tokenType, hasRefreshToken }) {
  return {
    status: "authenticated",
    provider: "Cognito",
    session: {
      id: sessionId,
      expiresInSeconds
    },
    tokenSummary: {
      tokenType,
      expiresInSeconds,
      hasRefreshToken
    },
    message: "Cognito authorization code exchanged and bound to an HTTP-only session cookie."
  };
}

export function lineWebhookSignatureRequired() {
  return apiError({
    type: "auth_error",
    code: "TM_API_LINE_WEBHOOK_SIGNATURE_REQUIRED",
    message: "LINE webhook requires the x-line-signature header.",
    param: "x-line-signature",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#line"
  });
}

export function lineWebhookSignatureInvalid() {
  return apiError({
    type: "auth_error",
    code: "TM_API_LINE_WEBHOOK_SIGNATURE_INVALID",
    message: "LINE webhook signature verification failed.",
    param: "x-line-signature",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#line"
  });
}

export function lineWebhookPayloadInvalid() {
  return apiError({
    type: "validation_error",
    code: "TM_API_LINE_WEBHOOK_PAYLOAD_INVALID",
    message: "LINE webhook payload must be valid JSON.",
    param: "body",
    docRef: "docs/dev/PROVIDER_CONSOLE_SETTINGS.md#line"
  });
}

export function lineWebhookAccepted({ eventHandlingMode, eventCount, acceptedEventCount, duplicateEventCount, invalidEventCount }) {
  const mode = eventHandlingMode || "verified_idempotent_noop";
  return {
    status: "accepted",
    provider: "LINE",
    eventHandlingMode: mode,
    eventCount,
    acceptedEventCount,
    duplicateEventCount,
    invalidEventCount,
    message:
      mode === "verified_idempotent_database"
        ? "LINE webhook signature verified; events were accepted idempotently in database mode."
        : "LINE webhook signature verified; events were accepted idempotently in no-op mode."
  };
}

export function acceptLineWebhookEventsInMemory(ledger, events) {
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

    if (ledger.has(eventKey)) {
      duplicateEventCount += 1;
      continue;
    }

    ledger.add(eventKey);
    acceptedEventCount += 1;
  }

  while (ledger.size > 2048) {
    const oldest = ledger.values().next().value;
    ledger.delete(oldest);
  }

  return {
    eventHandlingMode: "verified_idempotent_noop",
    eventCount: eventList.length,
    acceptedEventCount,
    duplicateEventCount,
    invalidEventCount
  };
}

export function apiError({ type, code, message, param, docRef }) {
  return {
    error: {
      type,
      code,
      message,
      param,
      requestId: "req_local_scaffold",
      docRef
    }
  };
}

const contactExchangeErrors = {
  "missing-line-contact": {
    status: 400,
    error: {
      type: "validation_error",
      code: "TM_API_CONTACT_EXCHANGE_MISSING_LINE_CONTACT",
      message: "Register a LINE contact before sending a LINE Contact Card.",
      param: "provider",
      docRef: "docs/dev/ERRORS.md#contact-exchange-missing-line-contact"
    }
  },
  "room-membership-required": {
    status: 403,
    error: {
      type: "permission_error",
      code: "TM_API_CONTACT_EXCHANGE_ROOM_MEMBERSHIP_REQUIRED",
      message: "Join the chat room before creating a contact exchange.",
      param: "roomId",
      docRef: "docs/dev/ERRORS.md#contact-exchange-room-membership-required"
    }
  },
  "duplicate-idempotency-key": {
    status: 409,
    error: {
      type: "conflict_error",
      code: "TM_API_CONTACT_EXCHANGE_DUPLICATE_IDEMPOTENCY_KEY",
      message: "This contact exchange request was already processed.",
      param: "idempotencyKey",
      docRef: "docs/dev/ERRORS.md#contact-exchange-duplicate-idempotency-key"
    }
  },
  "contact-revoked": {
    status: 409,
    error: {
      type: "conflict_error",
      code: "TM_API_CONTACT_EXCHANGE_REVOKED",
      message: "This contact exchange is no longer available.",
      param: "contactExchangeId",
      docRef: "docs/dev/ERRORS.md#contact-exchange-revoked"
    }
  },
  "contact-reported": {
    status: 409,
    error: {
      type: "conflict_error",
      code: "TM_API_CONTACT_EXCHANGE_REPORTED",
      message: "This contact exchange has already been reported.",
      param: "contactExchangeId",
      docRef: "docs/dev/ERRORS.md#contact-exchange-reported"
    }
  },
  "contact-blocked": {
    status: 403,
    error: {
      type: "permission_error",
      code: "TM_API_CONTACT_EXCHANGE_BLOCKED",
      message: "This contact exchange is blocked.",
      param: "contactExchangeId",
      docRef: "docs/dev/ERRORS.md#contact-exchange-blocked"
    }
  },
  "provider-unavailable": {
    status: 503,
    error: {
      type: "provider_error",
      code: "TM_API_CONTACT_PROVIDER_UNAVAILABLE",
      message: "The contact provider is temporarily unavailable.",
      param: "provider",
      docRef: "docs/dev/ERRORS.md#contact-provider-unavailable"
    }
  }
};
