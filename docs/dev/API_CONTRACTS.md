# API Contracts

Source of truth:

```text
packages/api-contracts/openapi/gate0.openapi.json
```

Generated artifacts:

```text
packages/api-contracts/generated/gate0.openapi.json
packages/api-contracts/dart/thai_meet_api_client.dart
```

Regenerate after changing the OpenAPI source:

```powershell
npm run api:openapi
npm run api-client:generate
npm test
```

Current Gate 0 paths:

- `GET /health`
- `GET /auth/callback/cognito`
- `POST /webhooks/line`
- `GET /api/v1/public-identities/me`
- `GET /api/v1/discover/profiles`
- `GET /api/v1/chats/rooms/{roomId}`
- `POST /api/v1/chats/rooms/{roomId}/contact-exchanges/line`
- `POST /api/v1/safety/reports`
- `POST /api/v1/safety/blocks`

`GET /health` returns the local scaffold status, service name, Node environment mode, and required `persistenceMode` enum (`fixture` or `database`) so Gate 1 work can verify whether the API is running against fixture or database storage.

Provider callback and webhook routes are live behind fail-closed provider checks. `GET /auth/callback/cognito` requires `code`, exchanges it at the Cognito token endpoint, returns a safe authenticated summary without raw tokens, and binds the result to an HTTP-only `tm_session` cookie. `POST /webhooks/line` requires `x-line-signature`, verifies the LINE HMAC-SHA256 signature with `LINE_CHANNEL_SECRET`, and returns `202` with idempotent event counts. LINE webhook events default to in-memory no-op counting; set `LINE_WEBHOOK_EVENT_STORE_MODE=database` only after the `LineWebhookEvent` migration is applied to persist hashed event keys. Current provider console values and callback shapes are tracked in `docs/dev/PROVIDER_CONSOLE_SETTINGS.md`.

Drift checks:

- `scripts/check-contracts.mjs` validates required OpenAPI paths, the `GET /health` persistence mode response contract, and Dart client members.
- `scripts/check-mobile-routes.mjs` validates Gate 0 mobile route names, paths, and reduced tabs.
- `scripts/check-trust-loop.mjs` validates the executable Trust Loop fixture and API endpoints.
- `.github/workflows/contract-drift.yml` runs the fast Gate 0 checks on Ubuntu and Windows, regenerates contract artifacts, and fails if generated files are stale.

Breaking or safety-sensitive changes must be recorded in `docs/dev/CHANGELOG.md`. Add a dated note under `docs/dev/migrations/` when a future DB or contract migration changes persisted behavior.
