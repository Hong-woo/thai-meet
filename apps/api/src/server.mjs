import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const port = Number(process.env.API_PORT || 3000);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

async function readJson(relativePath) {
  const data = await readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.url === "/health") {
      sendJson(res, 200, {
        status: "ok",
        service: "thai-meet-api",
        mode: process.env.NODE_ENV || "development"
      });
      return;
    }

    if (url.pathname === "/openapi.json") {
      sendJson(res, 200, await readJson("packages/api-contracts/openapi/gate0.openapi.json"));
      return;
    }

    if (url.pathname === "/fixtures/gate0") {
      sendJson(res, 200, await readJson("packages/api-contracts/fixtures/gate0-smoke.json"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/v1/public-identities/me") {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      sendJson(res, 200, {
        userId: fixture.mockUser.userId,
        publicIdentityId: fixture.mockUser.publicIdentityId,
        publicId: fixture.mockUser.publicId,
        displayName: fixture.mockUser.displayName,
        city: fixture.mockUser.city
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/v1/discover/profiles") {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      sendJson(res, 200, { profiles: [fixture.discoverProfile] });
      return;
    }

    const chatRoomMatch = url.pathname.match(/^\/api\/v1\/chats\/rooms\/([^/]+)$/);
    if (req.method === "GET" && chatRoomMatch) {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      if (chatRoomMatch[1] !== fixture.chatRoom.id) {
        sendJson(res, 404, notFound("roomId"));
        return;
      }

      sendJson(res, 200, {
        ...fixture.chatRoom,
        messages: fixture.chatMessages
      });
      return;
    }

    const lineExchangeMatch = url.pathname.match(/^\/api\/v1\/chats\/rooms\/([^/]+)\/contact-exchanges\/line$/);
    if (req.method === "POST" && lineExchangeMatch) {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      const errorCase = url.searchParams.get("case");
      if (errorCase && contactExchangeErrors[errorCase]) {
        const { status, error } = contactExchangeErrors[errorCase];
        sendJson(res, status, apiError(error));
        return;
      }

      if (lineExchangeMatch[1] !== fixture.chatRoom.id) {
        sendJson(res, 404, notFound("roomId"));
        return;
      }

      sendJson(res, 201, {
        contactExchange: fixture.contactExchange,
        contactCard: fixture.contactCard
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/v1/safety/reports") {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      sendJson(res, 201, { event: fixture.safetyEvents.find((event) => event.type === "report") });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/v1/safety/blocks") {
      const fixture = await readJson("packages/api-contracts/fixtures/gate0-smoke.json");
      sendJson(res, 201, { event: fixture.safetyEvents.find((event) => event.type === "block") });
      return;
    }

    sendJson(res, 404, notFound("url"));
  } catch {
    sendJson(res, 500, apiError({
      type: "system_error",
      code: "TM_API_SCAFFOLD_FAILURE",
      message: "The local scaffold could not read its fixture or contract file.",
      param: "fixture",
      docRef: "docs/dev/ERRORS.md#scaffold-failure"
    }));
  }
});

function notFound(param) {
  return apiError({
    type: "not_found",
    code: "TM_API_ROUTE_NOT_FOUND",
    message: "No route exists for this local scaffold endpoint.",
    param,
    docRef: "docs/dev/ERRORS.md#route-not-found"
  });
}

function apiError({ type, code, message, param, docRef }) {
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

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

server.listen(port, () => {
  console.log(`thai-meet api scaffold listening on http://localhost:${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

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
