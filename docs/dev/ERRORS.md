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
- `TM_API_CONTACT_PROVIDER_UNAVAILABLE` - provider is temporarily unavailable.

Smoke doctor codes:

- `TM_SMOKE_DOCTOR_NODE_UNSUPPORTED`
- `TM_SMOKE_DOCTOR_PNPM_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_FLUTTER_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_CHROME_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_DOCKER_UNAVAILABLE`
- `TM_SMOKE_DOCTOR_DOCKER_NOT_RUNNING`
- `TM_SMOKE_DOCTOR_PORT_CONFLICT`

Contract and safety check codes:

- `TM_CONTRACT_OPENAPI_STALE`
- `TM_CONTRACT_DART_CLIENT_STALE`
- `TM_MOBILE_ROUTE_CONTRACT_DRIFT`
- `TM_TRUST_LOOP_CONTRACT_DRIFT`
- `TM_PRIVACY_LEAK_TEST_FAILED`
- `TM_ERROR_ENVELOPE_CONTRACT_DRIFT`

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

Contact Provider Unavailable

Flutter should show a retry path without asking the user for real provider credentials.

Privacy rule: do not include raw LINE, Facebook, QR, provider token, push token, or contact values in API errors, smoke output, logs, or generated fixtures.
