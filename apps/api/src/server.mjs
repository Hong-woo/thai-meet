import http from "node:http";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  authCallbackAccepted,
  authCallbackCodeRequired,
  authCallbackConfigRequired,
  authCallbackTokenExchangeFailed,
  createGate0Service,
  databaseClientUnavailable,
  databaseStoreNotScaffolded,
  lineWebhookAccepted,
  lineWebhookPayloadInvalid,
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

      const callbackResult = await exchangeCognitoAuthorizationCode({
        code: url.searchParams.get("code"),
        redirectUri: buildCallbackRedirectUri(req, url)
      });
      if (callbackResult.status === "config_required") {
        sendJson(res, 503, authCallbackConfigRequired());
        return;
      }
      if (callbackResult.status === "exchange_failed") {
        sendJson(res, 502, authCallbackTokenExchangeFailed());
        return;
      }

      sendJson(res, 200, authCallbackAccepted(callbackResult.session), {
        "set-cookie": buildSessionCookie(callbackResult.session)
      });
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

      const lineEvents = parseLineWebhookEvents(body);
      if (!lineEvents) {
        sendJson(res, 400, lineWebhookPayloadInvalid());
        return;
      }

      const eventResult = await gate0.acceptLineWebhookEvents(lineEvents);
      sendJson(res, 202, lineWebhookAccepted(eventResult));
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

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...extraHeaders });
  res.end(JSON.stringify(payload, null, 2));
}

async function exchangeCognitoAuthorizationCode({ code, redirectUri }) {
  const issuer = (process.env.AUTH_PROVIDER_ISSUER || "").replace(/\/$/, "");
  const audience = process.env.AUTH_PROVIDER_AUDIENCE || "";
  if (!issuer || !audience) return { status: "config_required" };

  const tokenUrl = process.env.AUTH_PROVIDER_TOKEN_URL || `${issuer}/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: audience,
    redirect_uri: redirectUri
  });

  const headers = { "content-type": "application/x-www-form-urlencoded" };
  const clientSecret = process.env.AUTH_PROVIDER_CLIENT_SECRET || "";
  if (clientSecret) {
    headers.authorization = `Basic ${Buffer.from(`${audience}:${clientSecret}`).toString("base64")}`;
  }

  try {
    const response = await fetch(tokenUrl, { method: "POST", headers, body });
    if (!response.ok) return { status: "exchange_failed" };
    const token = await response.json();
    if (!token?.id_token && !token?.access_token) return { status: "exchange_failed" };

    const expiresInSeconds = Number.isFinite(Number(token.expires_in)) ? Number(token.expires_in) : 3600;
    const material = [token.id_token, token.access_token, token.refresh_token].filter(Boolean).join(".");
    const sessionId = crypto.createHash("sha256").update(material).digest("hex");
    return {
      status: "ok",
      session: {
        sessionId,
        expiresInSeconds,
        tokenType: typeof token.token_type === "string" ? token.token_type : "Bearer",
        hasRefreshToken: Boolean(token.refresh_token)
      }
    };
  } catch {
    return { status: "exchange_failed" };
  }
}

function buildCallbackRedirectUri(req, url) {
  if (process.env.AUTH_CALLBACK_COGNITO_REDIRECT_URI) return process.env.AUTH_CALLBACK_COGNITO_REDIRECT_URI;
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim() || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  return `${proto}://${host}${url.pathname}`;
}

function buildSessionCookie(session) {
  const maxAge = Math.max(60, Math.min(Number(session.expiresInSeconds) || 3600, 86400));
  return [
    `tm_session=${session.sessionId}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${maxAge}`
  ].join("; ");
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

function parseLineWebhookEvents(body) {
  let payload;
  try {
    payload = JSON.parse(body.toString("utf8") || "{}");
  } catch {
    return null;
  }

  const events = Array.isArray(payload?.events) ? payload.events : [];
  return events.map((event) => {
    const eventId = typeof event?.webhookEventId === "string" ? event.webhookEventId.trim() : "";
    return {
      eventKey: eventId ? crypto.createHash("sha256").update(eventId).digest("hex") : null,
      eventType: typeof event?.type === "string" ? event.type.slice(0, 64) : null
    };
  });
}

server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`thai-meet api scaffold listening on http://127.0.0.1:${actualPort}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
