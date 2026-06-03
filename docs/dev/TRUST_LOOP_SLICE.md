# Trust Loop Slice

Gate 0 Trust Loop:

```text
mock login
  -> Public ID generated
  -> seeded Discover profile visible
  -> Start Chat
  -> LINE ContactExchange created
  -> Contact Card rendered
  -> report/block event recorded
```

Executable check:

```powershell
node scripts/check-trust-loop.mjs
```

Included in:

```powershell
npm test
```

Fixture:

```text
packages/api-contracts/fixtures/gate0-smoke.json
```

API endpoints:

- `GET /api/v1/public-identities/me`
- `GET /api/v1/discover/profiles`
- `GET /api/v1/chats/rooms/{roomId}`
- `POST /api/v1/chats/rooms/{roomId}/contact-exchanges/line`
- `POST /api/v1/safety/reports`
- `POST /api/v1/safety/blocks`

Safety invariants:

- Chat messages must not contain raw LINE IDs or raw external contact values.
- ContactExchange exposes `permission.canViewContactCard`.
- Gate 0 contact cards are redacted and set `copyRawValue` to `false`.
- Report and block events are part of the first smoke path.
- Participant snapshots must include public identity context without leaking raw contact values.
