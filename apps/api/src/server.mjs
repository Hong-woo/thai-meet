import http from "node:http";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
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
const landingAssetPaths = new Map([
  ["/favicon.ico", path.join(root, "ThaiMeet_BrandPackage", "ThaiMeet monogram clean.png")],
  ["/assets/thai-meet-logo-clean.png", path.join(root, "ThaiMeet_BrandPackage", "ThaiMeet logo clean.png")],
  ["/assets/thai-meet-monogram-clean.png", path.join(root, "ThaiMeet_BrandPackage", "ThaiMeet monogram clean.png")],
  ["/assets/thai-meet-brand-board.png", path.join(root, "ThaiMeet_BrandPackage", "ThaiMeet_BrandPackage.png")],
  ["/assets/thai-meet-mobile-phone-frame.png", path.join(root, "thai-meet-mobile-phone-frame.png")]
]);
const gate0Store = createGate0StoreFromEnv(root);
const gate0 = createGate0Service(gate0Store.store);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/") {
      sendHtml(res, 200, renderLandingPage());
      return;
    }

    if (req.method === "GET" && landingAssetPaths.has(url.pathname)) {
      sendPng(res, 200, await readFile(landingAssetPaths.get(url.pathname)));
      return;
    }

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

function sendHtml(res, status, html) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=300"
  });
  res.end(html);
}

function sendPng(res, status, image) {
  res.writeHead(status, {
    "content-type": "image/png",
    "cache-control": "public, max-age=86400"
  });
  res.end(image);
}

function renderLandingPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#fff5f7">
  <meta name="description" content="Thai Meet is a safety-first social app for meeting nearby people while keeping LINE private by default.">
  <link rel="icon" type="image/png" href="/assets/thai-meet-monogram-clean.png?v=2">
  <title>Thai Meet</title>
  <style>
    :root {
      --bg: #fff5f7;
      --surface: #ffffff;
      --ink: #2d2d35;
      --muted: #635d66;
      --primary: #ff3d6e;
      --coral: #ff6b6b;
      --primary-ink: #ffffff;
      --mint: #27d4c7;
      --light-mint: #e6fff7;
      --line: #f5d7df;
      --shadow: 0 24px 80px rgba(255, 61, 110, 0.18);
    }

    * { box-sizing: border-box; }
    html { color-scheme: light; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, "Noto Sans Thai", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    img {
      display: block;
      max-width: 100%;
    }
    a { color: inherit; }
    a:focus-visible {
      outline: 3px solid rgba(39, 212, 199, 0.75);
      outline-offset: 4px;
    }
    .shell {
      min-height: 100dvh;
      overflow: hidden;
      position: relative;
      isolation: isolate;
    }
    .shell::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background: url("/assets/thai-meet-mobile-phone-frame.png") right -110px top 170px / min(50vw, 760px) auto no-repeat;
    }
    .nav {
      width: min(1120px, calc(100% - 40px));
      min-height: 76px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      font-size: 18px;
    }
    .brand img {
      width: 148px;
      height: auto;
    }
    .navlinks {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .navlinks a,
    .button {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 0 18px;
      text-decoration: none;
      font-weight: 700;
      transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease;
    }
    .navlinks a {
      color: var(--muted);
    }
    .navlinks a:hover {
      background: rgba(255, 255, 255, 0.7);
      color: var(--ink);
    }
    .hero {
      width: min(1120px, calc(100% - 40px));
      min-height: calc(100dvh - 76px);
      margin: 0 auto;
      display: grid;
      align-items: center;
      padding: 48px 0 90px;
    }
    .copy {
      width: min(520px, 100%);
      padding: 28px 0;
    }
    .hero-logo {
      width: min(360px, 82vw);
      margin: 0 0 26px;
      filter: drop-shadow(0 18px 34px rgba(255, 61, 110, 0.15));
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 18px;
      color: #168f86;
      font-weight: 800;
      font-size: 14px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--mint);
      box-shadow: 0 0 0 6px rgba(39, 212, 199, 0.16);
    }
    h1 {
      margin: 0;
      max-width: 11ch;
      font-size: clamp(48px, 9vw, 96px);
      line-height: 0.94;
      letter-spacing: 0;
    }
    .accent {
      color: var(--primary);
    }
    .lead {
      max-width: 500px;
      margin: 26px 0 0;
      color: var(--muted);
      font-size: clamp(18px, 2.2vw, 24px);
      line-height: 1.45;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 34px 0 0;
    }
    .button.primary {
      background: var(--primary);
      color: var(--primary-ink);
      box-shadow: 0 16px 34px rgba(255, 61, 110, 0.28);
    }
    .button.secondary {
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.78);
      color: var(--ink);
    }
    .button:hover {
      transform: translateY(-1px);
    }
    .proof {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin: 38px 0 0;
      max-width: 700px;
    }
    .proof-item {
      min-height: 116px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.82);
      padding: 18px;
      box-shadow: var(--shadow);
    }
    .proof-icon {
      width: 30px;
      height: 30px;
      margin-bottom: 12px;
      object-fit: contain;
    }
    .proof-item strong {
      display: block;
      font-size: 15px;
      margin-bottom: 8px;
    }
    .proof-item span {
      color: var(--muted);
      font-size: 14px;
    }
    .screen-note {
      position: absolute;
      right: max(28px, calc((100vw - 1120px) / 2));
      bottom: 32px;
      max-width: 320px;
      color: #4b3e44;
      font-size: 13px;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px 14px;
    }
    .brand-board-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      color: #168f86;
      font-size: 13px;
      font-weight: 800;
      text-decoration: none;
    }
    @media (max-width: 860px) {
      .shell::before {
        background: url("/assets/thai-meet-mobile-phone-frame.png") center bottom -54px / min(112vw, 720px) auto no-repeat;
      }
      .nav {
        width: min(100% - 32px, 720px);
      }
      .brand img {
        width: 124px;
      }
      .navlinks a:not(.button) {
        display: none;
      }
      .hero {
        width: min(100% - 32px, 720px);
        align-items: start;
        padding-top: 44px;
        padding-bottom: 420px;
      }
      h1 {
        max-width: 9ch;
        font-size: clamp(42px, 15vw, 72px);
      }
      .lead {
        font-size: 18px;
      }
      .proof {
        grid-template-columns: 1fr;
      }
      .screen-note {
        left: 16px;
        right: 16px;
        bottom: 16px;
        max-width: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="nav" aria-label="Thai Meet">
      <div class="brand">
        <img src="/assets/thai-meet-logo-clean.png?v=2" alt="Thai Meet">
      </div>
      <nav class="navlinks" aria-label="Primary">
        <a href="/health">Status</a>
        <a href="/openapi.json">API</a>
        <a class="button secondary" href="/api/v1/discover/profiles">Preview</a>
      </nav>
    </header>
    <main class="hero">
      <section class="copy" aria-labelledby="page-title">
        <img class="hero-logo" src="/assets/thai-meet-logo-clean.png?v=2" alt="Thai Meet - A Better Way to Meet">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Safety-first social discovery</p>
        <h1 id="page-title">A better way to <span class="accent">meet</span></h1>
        <p class="lead">Meet nearby people with Public Meet IDs, protected LINE sharing, and clear safety controls before contact opens.</p>
        <div class="actions">
          <a class="button primary" href="/api/v1/discover/profiles">View live preview</a>
          <a class="button secondary" href="/health">Check service</a>
        </div>
        <div class="proof" aria-label="Product pillars">
          <div class="proof-item">
            <img class="proof-icon" src="/assets/thai-meet-monogram-clean.png?v=2" alt="" aria-hidden="true">
            <strong>LINE stays private</strong>
            <span>Contact opens only after both the context and permission are clear.</span>
          </div>
          <div class="proof-item">
            <img class="proof-icon" src="/assets/thai-meet-monogram-clean.png?v=2" alt="" aria-hidden="true">
            <strong>Public Meet ID first</strong>
            <span>Discovery starts with a shareable ID, not raw contact details.</span>
          </div>
          <div class="proof-item">
            <img class="proof-icon" src="/assets/thai-meet-monogram-clean.png?v=2" alt="" aria-hidden="true">
            <strong>Report and block ready</strong>
            <span>Safety actions stay visible across profile, chat, and history.</span>
          </div>
        </div>
        <a class="brand-board-link" href="/assets/thai-meet-brand-board.png">Brand system preview</a>
      </section>
    </main>
    <p class="screen-note">Live API is running in production database mode at www.thai-meet.com.</p>
  </div>
</body>
</html>`;
}

async function exchangeCognitoAuthorizationCode({ code, redirectUri }) {
  const issuer = (process.env.AUTH_PROVIDER_ISSUER || "").replace(/\/$/, "");
  const audience = process.env.AUTH_PROVIDER_AUDIENCE || "";
  if (!issuer || !audience) return { status: "config_required" };

  const tokenUrl = await resolveCognitoTokenUrl(issuer);
  if (!tokenUrl) return { status: "exchange_failed" };
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

async function resolveCognitoTokenUrl(issuer) {
  if (process.env.AUTH_PROVIDER_TOKEN_URL) return process.env.AUTH_PROVIDER_TOKEN_URL;

  try {
    const discoveryUrl = `${issuer}/.well-known/openid-configuration`;
    const response = await fetch(discoveryUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const discovery = await response.json();
    return typeof discovery?.token_endpoint === "string" ? discovery.token_endpoint : null;
  } catch {
    return null;
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
