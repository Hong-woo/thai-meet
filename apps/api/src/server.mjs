import http from "node:http";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  authCallbackCodeRequired,
  authCallbackNotImplemented,
  createGate0Service,
  databaseClientUnavailable,
  databaseStoreNotScaffolded,
  lineWebhookAccepted,
  lineWebhookSignatureInvalid,
  lineWebhookSignatureRequired,
  notFound,
  scaffoldFailure
} from "./gate0-service.mjs";
import { createGate0StoreFromEnv } from "./gate0-store-factory.mjs";

const port = Number(process.env.API_PORT || 3000);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const gate0Store = createGate0StoreFromEnv(root);
const gate0 = createGate0Service(gate0Store.store);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.url === "/health") {
      sendJson(res, 200, {
        status: "ok",
        service: "thai-meet-api",
        mode: process.env.NODE_ENV || "development",
        persistenceMode: gate0Store.mode
      });
      return;
    }

    if (url.pathname === "/openapi.json") {
      sendJson(res, 200, await gate0.getOpenApi());
      return;
    }

    if (url.pathname === "/fixtures/gate0") {
      sendJson(res, 200, await gate0.getFixture());
      return;
    }

    if (req.method === "GET" && url.pathname === "/auth/callback/cognito") {
      if (!url.searchParams.get("code")) {
        sendJson(res, 400, authCallbackCodeRequired());
        return;
      }

      sendJson(res, 501, authCallbackNotImplemented());
      return;
    }

    if (req.method === "POST" && url.pathname === "/webhooks/line") {
      const body = await readBody(req);
      if (!req.headers["x-line-signature"]) {
        sendJson(res, 401, lineWebhookSignatureRequired());
        return;
      }

      if (!verifyLineWebhookSignature(body, req.headers["x-line-signature"])) {
        sendJson(res, 401, lineWebhookSignatureInvalid());
        return;
      }

      sendJson(res, 202, lineWebhookAccepted());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/v1/public-identities/me") {
      sendJson(res, 200, await gate0.getMyPublicIdentity());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/v1/discover/profiles") {
      sendJson(res, 200, await gate0.listDiscoverProfiles());
      return;
    }

    const chatRoomMatch = url.pathname.match(/^\/api\/v1\/chats\/rooms\/([^/]+)$/);
    if (req.method === "GET" && chatRoomMatch) {
      const chatRoom = await gate0.getChatRoom(chatRoomMatch[1]);
      if (!chatRoom) {
        sendJson(res, 404, notFound("roomId"));
        return;
      }

      sendJson(res, 200, chatRoom);
      return;
    }

    const lineExchangeMatch = url.pathname.match(/^\/api\/v1\/chats\/rooms\/([^/]+)\/contact-exchanges\/line$/);
    if (req.method === "POST" && lineExchangeMatch) {
      const result = await gate0.createLineContactExchange(lineExchangeMatch[1], url.searchParams.get("case"), url.searchParams.get("state"));
      if (!result) {
        sendJson(res, 404, notFound("roomId"));
        return;
      }

      sendJson(res, result.status, result.payload);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/v1/safety/reports") {
      sendJson(res, 201, await gate0.createSafetyReport());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/v1/safety/blocks") {
      sendJson(res, 201, await gate0.createSafetyBlock());
      return;
    }

    sendJson(res, 404, notFound("url"));
  } catch (error) {
    if (String(error?.message ?? error).includes("TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED")) {
      sendJson(res, 500, databaseStoreNotScaffolded());
      return;
    }
    if (String(error?.message ?? error).includes("TM_GATE1_DATABASE_CLIENT_UNAVAILABLE")) {
      sendJson(res, 500, databaseClientUnavailable());
      return;
    }

    sendJson(res, 500, scaffoldFailure());
  }
});

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new Error("TM_API_REQUEST_BODY_TOO_LARGE");
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function verifyLineWebhookSignature(body, signature) {
  const secret = process.env.LINE_CHANNEL_SECRET || "";
  if (!secret) return false;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64");
  const actual = String(signature || "");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`thai-meet api scaffold listening on http://127.0.0.1:${actualPort}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
