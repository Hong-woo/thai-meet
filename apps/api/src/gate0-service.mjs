import { readFile } from "node:fs/promises";
import path from "node:path";

export function createGate0Service(root) {
  async function readJson(relativePath) {
    const data = await readFile(path.join(root, relativePath), "utf8");
    return JSON.parse(data);
  }

  async function readFixture() {
    return await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
  }

  return {
    async getOpenApi() {
      return await readJson("packages/api-contracts/openapi/gate0.openapi.json");
    },

    async getFixture() {
      return await readFixture();
    },

    async getMyPublicIdentity() {
      const fixture = await readFixture();
      return {
        userId: fixture.mockUser.userId,
        publicIdentityId: fixture.mockUser.publicIdentityId,
        publicId: fixture.mockUser.publicId,
        displayName: fixture.mockUser.displayName,
        city: fixture.mockUser.city
      };
    },

    async listDiscoverProfiles() {
      const fixture = await readFixture();
      return { profiles: [fixture.discoverProfile] };
    },

    async getChatRoom(roomId) {
      const fixture = await readFixture();
      if (roomId !== fixture.chatRoom.id) return null;
      return {
        ...fixture.chatRoom,
        messages: fixture.chatMessages
      };
    },

    async createLineContactExchange(roomId, errorCase) {
      if (errorCase && contactExchangeErrors[errorCase]) {
        const { status, error } = contactExchangeErrors[errorCase];
        return { status, payload: apiError(error) };
      }

      const fixture = await readFixture();
      if (roomId !== fixture.chatRoom.id) return null;

      return {
        status: 201,
        payload: {
          contactExchange: fixture.contactExchange,
          contactCard: fixture.contactCard
        }
      };
    },

    async createSafetyReport() {
      const fixture = await readFixture();
      return { event: fixture.safetyEvents.find((event) => event.type === "report") };
    },

    async createSafetyBlock() {
      const fixture = await readFixture();
      return { event: fixture.safetyEvents.find((event) => event.type === "block") };
    }
  };
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
