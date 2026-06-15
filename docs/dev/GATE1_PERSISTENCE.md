# Gate 1 Persistence

Gate 1 production backend persistence replaces the Gate 0 fixture-backed storage path without changing public API contracts.

## Scope

- Replace `apps/api/src/gate0-fixture-store.mjs` through a fixture store replacement boundary, not by changing mobile routes or response shapes first.
- Keep `ContactExchange`, `PublicIdentity`, `Report`, `Block`, and `RewardLedger` contract-tested while moving reads and writes to persisted models.
- Add Prisma migration status checks before a database-backed API can be treated as Gate 1 ready.
- Keep rollback paths explicit for every migration that touches safety, identity, contact exchange, report, block, or reward data.
- Keep raw provider values out of `ChatMessage`, logs, smoke JSON, screenshots, generated clients, and API error envelopes.
- Keep `PERSISTENCE_MODE=fixture` as the mock-first local default so `npm test` and first-run smoke can pass without a database.

## Replacement Order

1. Add Prisma schema and migrations that satisfy `docs/dev/DB_CONSTRAINTS.md`.
2. Add a persisted store behind the same read boundary used by the current fixture store.
3. Move read-only endpoints first: OpenAPI stays file-backed, while public identity, discover profiles, and chat rooms can read persisted seed data.
4. Move write paths after read parity: ContactExchange creation, report, block, Public ID rotation, and reward ledger grants.
5. Keep fixture mode available until local smoke, contract drift, and rollback checks pass against the persisted path.

## Local Modes

| Mode | Purpose | Gate |
| --- | --- | --- |
| `PERSISTENCE_MODE=fixture` | Use fixture-backed storage without a database for local Gate 0 and fast smoke. | Gate 0 default |
| `PERSISTENCE_MODE=database` | Use persisted storage after Prisma migration status, seed parity, privacy, and rollback checks are green. | Gate 1 |

Do not remove fixture mode when adding the database path. Gate 1 should add the persisted store behind the same service boundary, then switch environments by mode only after contract parity is proven.

Current local `PERSISTENCE_MODE=database` is a fail-closed store boundary. It returns the database mode from the store factory, but reads throw `TM_GATE1_DATABASE_STORE_NOT_SCAFFOLDED` until Prisma schema, migrations, seed parity, privacy checks, and rollback checks are implemented.

## Required Checks

```powershell
npm run db:check
npm run db:check -- --json
npm run db:check -- --field migrationStatus
npm run db:check -- --field prismaSchemaPresent
npm run db:check -- --field prismaScaffoldStatus.summary
npm run db:check -- --field databaseUrlPresent
npm run db:check -- --field databaseUrlStatus
npm run db:check -- --field databaseUrlProtocol
npm run not-scaffolded:test
node scripts/not-scaffolded.mjs --help
npm test
npm run privacy:test
npm run errors:check
```

Gate 1 cannot close until `db:check` verifies Prisma migration status and the migration set implements the DB constraints matrix. Gate 0 must report `migrationStatus=not_scaffolded`, and `db:migrate` must fail with `TM_COMMAND_NOT_SCAFFOLDED` until Prisma schema and migrations are contract-checked. Database-backed mode should also report `databaseUrlStatus=valid` with a `postgresql` or `postgres` protocol without printing the full `DATABASE_URL`.

## Safety Notes

- `ContactExchange` remains the authority object for permission, audit, revoke, report, block, and admin inspection.
- `ChatMessage` may reference a ContactExchange id, but must not store raw provider values.
- `PublicIdentity` rotation must preserve report, block, audit, and historical room participant context.
- `Report` and `Block` writes must preserve the visible PublicIdentity context that triggered the safety action.
- `RewardLedger` must stay append-only and idempotent before any reward UI or ad callback is enabled.

## Rollback Notes

- Prefer additive migrations before destructive changes.
- Backfills must be repeatable and safe to rerun.
- Rollback steps must state what happens to ContactExchange, PublicIdentity, Report, Block, and RewardLedger data.
- Provider secrets, raw LINE IDs, Facebook URLs, QR payloads, push tokens, and ad keys must not appear in rollback logs.
