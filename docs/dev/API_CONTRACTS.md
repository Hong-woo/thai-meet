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
- `GET /api/v1/public-identities/me`
- `GET /api/v1/discover/profiles`
- `GET /api/v1/chats/rooms/{roomId}`
- `POST /api/v1/chats/rooms/{roomId}/contact-exchanges/line`
- `POST /api/v1/safety/reports`
- `POST /api/v1/safety/blocks`

`GET /health` returns the local scaffold status, service name, Node environment mode, and required `persistenceMode` enum (`fixture` or `database`) so Gate 1 work can verify whether the API is running against fixture or database storage.

Provider callback and webhook routes are not implemented yet. Do not put callback URLs into Cognito or LINE until the corresponding API routes exist. Current provider console values and future callback shapes are tracked in `docs/dev/PROVIDER_CONSOLE_SETTINGS.md`.

Drift checks:

- `scripts/check-contracts.mjs` validates required OpenAPI paths, the `GET /health` persistence mode response contract, and Dart client members.
- `scripts/check-mobile-routes.mjs` validates Gate 0 mobile route names, paths, and reduced tabs.
- `scripts/check-trust-loop.mjs` validates the executable Trust Loop fixture and API endpoints.
- `.github/workflows/contract-drift.yml` runs the fast Gate 0 checks on Ubuntu and Windows, regenerates contract artifacts, and fails if generated files are stale.

Breaking or safety-sensitive changes must be recorded in `docs/dev/CHANGELOG.md`. Add a dated note under `docs/dev/migrations/` when a future DB or contract migration changes persisted behavior.
