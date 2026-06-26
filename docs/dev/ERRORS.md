# Errors

Local API errors use this envelope:

```json
{
  "error": {
    "type": "not_found",
    "code": "TM_API_ROUTE_NOT_FOUND",
    "message": "No route exists for this local scaffold endpoint.",
    "param": "url",
    "requestId": "req_local_scaffold",
    "docRef": "docs/dev/ERRORS.md#route-not-found"
  }
}
```

API error codes:

- `TM_API_ROUTE_NOT_FOUND` - route or fixture id is not present in the local scaffold.
- `TM_API_SCAFFOLD_FAILURE` - local scaffold could not read a required fixture or contract file.
- `TM_API_CONTACT_EXCHANGE_MISSING_LINE_CONTACT` - user must register a LINE contact before sending a LINE Contact Card.
- `TM_API_CONTACT_EXCHANGE_ROOM_MEMBERSHIP_REQUIRED` - actor is not allowed to create a contact exchange in the room.
- `TM_API_CONTACT_EXCHANGE_DUPLICATE_IDEMPOTENCY_KEY` - request was already processed.
- `TM_API_CONTACT_EXCHANGE_REVOKED` - contact exchange is no longer available.
- `TM_API_CONTACT_EXCHANGE_REPORTED` - contact exchange has already been reported.
- `TM_API_CONTACT_EXCHANGE_BLOCKED` - contact exchange is blocked.
- `TM_API_CONTACT_PROVIDER_UNAVAILABLE` - provider is temporarily unavailable.
- `TM_API_AUTH_CALLBACK_CODE_REQUIRED` - Cognito callback did not include an authorization code.
- `TM_API_AUTH_CALLBACK_CONFIG_REQUIRED` - Cognito callback is missing issuer or audience configuration.
- `TM_API_AUTH_CALLBACK_TOKEN_EXCHANGE_FAILED` - Cognito authorization code exchange failed.

Smoke doctor codes:

- `TM_SMOKE_DOCTOR_NODE_UNSUPPORTED`
- `TM_SMOKE_DOCTOR_PNPM_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_FLUTTER_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_DOCKER_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_PORT_CONFLICT`

Contract and safety check codes:

- `TM_CONTRACT_OPENAPI_STALE`
- `TM_CONTRACT_DART_CLIENT_STALE`
- `TM_MOBILE_ROUTE_CONTRACT_DRIFT`
- `TM_TRUST_LOOP_CONTRACT_DRIFT`
- `TM_PRIVACY_LEAK_TEST_FAILED`
- `TM_ERROR_ENVELOPE_CONTRACT_DRIFT`

Local service/runtime codes:

- `TM_GATE0_FIXTURE_STORE_INVALID_JSON` - Gate 0 fixture store found invalid JSON in a required local fixture or contract file.
- `TM_GATE0_FIXTURE_STORE_READ_FAILED` - Gate 0 fixture store could not read a required local fixture or contract file.
- `TM_GATE0_FIXTURE_STORE_ROOT_INVALID` - Gate 0 fixture store was created without a valid project root.
- `TM_GATE0_PERSISTENCE_MODE_UNSUPPORTED` - Gate 0 API was started with a persistence mode that is not available yet.
- `TM_GATE0_SERVICE_STORE_INVALID` - Gate 0 service was created without the required fixture store methods.
- `TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED` - Gate 1 database persistence mode was selected before persisted reads were scaffolded.
- `TM_GATE1_DATABASE_CLIENT_UNAVAILABLE` - Gate 1 database persistence mode was selected without `DATABASE_URL` or a generated Prisma client.
- `TM_GATE1_DATABASE_URL_REQUIRED` - `npm run db:migrate` was run without `DATABASE_URL`.
- `TM_GATE1_DATABASE_URL_INVALID` - `npm run db:migrate` was run with a non-PostgreSQL `DATABASE_URL` protocol.

Route Not Found

Check the route, method, and mock id. The scaffold only exposes the Gate 0 endpoints listed in `API_CONTRACTS.md`.

Scaffold Failure

Run:

```powershell
npm test
npm run api:openapi
npm run api-client:generate
```

If the error remains, inspect `packages/api-contracts/fixtures/gate0-smoke.json` and `packages/api-contracts/openapi/gate0.openapi.json` for invalid JSON.

Contact Exchange Missing LINE Contact

Flutter should route to LINE setup and retry after setup succeeds. Do not show provider internals.

Contact Exchange Room Membership Required

Flutter should fail closed and return to chat list or profile detail. Do not expose private membership state.

Contact Exchange Duplicate Idempotency Key

Flutter should avoid creating duplicate card messages and may refetch the room/contact card state.

Contact Exchange Revoked

Flutter should render an unavailable card and keep report/block visible.

Contact Exchange Reported

Flutter should keep the card unavailable and preserve block controls without exposing contact values.

Contact Exchange Blocked

Flutter should hide contact access and return the user to a safe chat/list state.

Contact Provider Unavailable

Flutter should show a retry path without asking the user for real provider credentials.

Gate 0 Service Store Invalid

Local API boot or service tests should fail fast. Provide a store with `readOpenApi()` and `readFixture()` methods before creating the Gate 0 service.

Gate 0 Fixture Store Root Invalid

Local API boot or fixture-store tests should fail fast. Pass the project root into `createGate0FixtureStore(root)` before reading OpenAPI or smoke fixture JSON.

Gate 0 Fixture Store Read Failed

Local API boot or fixture-store tests should fail fast. Check that `packages/api-contracts/openapi/gate0.openapi.json` and `packages/api-contracts/fixtures/gate0-smoke.json` exist.

Gate 0 Fixture Store Invalid JSON

Local API boot or fixture-store tests should fail fast. Check that `packages/api-contracts/openapi/gate0.openapi.json` and `packages/api-contracts/fixtures/gate0-smoke.json` contain valid JSON.

Gate 1 Database Client Unavailable

Database mode should fail closed until local/dev PostgreSQL is configured. Set `DATABASE_URL`, run `npm run db:migrate`, generate the Prisma client, then retry persisted reads. Do not print the full database URL in logs or API errors.

Gate 0 Persistence Mode Unsupported

Local API boot should fail fast. `PERSISTENCE_MODE` is trimmed before selection, and unsupported errors include the supported mode list. Use `PERSISTENCE_MODE=fixture` unless Gate 1 database-backed read parity has a configured PostgreSQL URL and Prisma client. `db:migrate` checks the Prisma scaffold and validates `DATABASE_URL` before running Prisma.

Privacy rule: do not include raw LINE, Facebook, QR, provider token, push token, or contact values in API errors, smoke output, logs, or generated fixtures.
