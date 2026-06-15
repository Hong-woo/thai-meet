# Architecture

Thai Meet uses a monorepo layout for the Gate 0 scaffold.

```text
apps/
  api/        Node HTTP scaffold for local Gate 0 endpoints
  mobile/     Flutter route shell scaffold
packages/
  api-contracts/
    openapi/      source OpenAPI contract
    generated/    generated OpenAPI artifact
    dart/         generated Dart client placeholder
    fixtures/     mock Gate 0 smoke fixtures
infra/
  docker/     local Postgres and Redis compose file
scripts/      smoke, contract, privacy, and generation checks
docs/dev/     execution docs for contributors
```

Current API scaffold is fixture-backed behind `apps/api/src/gate0-service.mjs`, with fixture reads isolated in `apps/api/src/gate0-fixture-store.mjs`. Future NestJS/Prisma modules should preserve the same externally visible contracts before replacing fixture responses with database-backed behavior.

Future Prisma schema work must follow `docs/dev/DB_CONSTRAINTS.md` before replacing fixture-backed Gate 0 responses.

Ownership boundaries:

- API owns backend routes, unified error envelopes, database access, and provider adapters.
- `apps/api/src/gate0-service.mjs` owns the current Gate 0 use cases until Prisma/NestJS replaces the framework layer.
- `apps/api/src/gate0-fixture-store.mjs` owns the current fixture-backed storage adapter until production persistence replaces it.
- Mobile owns Flutter routes, navigation shape, and rendered contact cards.
- `packages/api-contracts` owns OpenAPI source, generated client placeholders, and mock fixtures.
- `scripts` owns local drift checks, smoke diagnostics, and privacy leak checks.

Gate 0 design defaults:

- Reduced nav: Discover, Swipe, Chat, List, My.
- Safety remains reachable from profile, Chat, Contact Card, List, and My surfaces rather than as a top-level tab.
- ContactExchange is a permission object, not a raw chat message.
- ChatRoom responses carry participant snapshots so future identity rotations do not rewrite old room context.
- Feature flags keep LINE visible while Facebook, rewarded ads, chat-detail ads, and admin surfaces remain hidden by default.
- RewardLedger is append-only and idempotent; reward UI remains hidden until later gates.
