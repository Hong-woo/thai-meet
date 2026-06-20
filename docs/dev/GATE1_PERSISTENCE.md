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

Current local `PERSISTENCE_MODE=database` has a Gate 0-compatible persisted read store in `apps/api/src/gate1-database-store.mjs`. Without `DATABASE_URL` and a generated Prisma client, database mode still fails closed with `TM_GATE1_DATABASE_CLIENT_UNAVAILABLE` without printing the URL. Prisma schema and the first migration scaffold now exist, and `db:migrate` runs through a Gate 1 preflight wrapper. Without `DATABASE_URL`, migration preflight fails fast with `TM_GATE1_DATABASE_URL_REQUIRED` without printing the URL. Seed parity is planned by `npm run gate1:seed:plan` and checked by `npm run gate1:seed:test`; migration preflight is checked by `npm run gate1:migrate:test`; the database seed writer is `npm run gate1:seed:database` and checked by `npm run gate1:seed:database:test`; store mapping is checked by `npm run gate1:database-store:test`; fixture-vs-database read parity is checked by `npm run gate1:read-parity:test`; persisted write delegation is checked by `npm run gate1:write-path:test`; rollback preflight is checked by `npm run gate1:rollback:test`; live DB smoke is run by `npm run gate1:live-smoke` and preflight-checked by `npm run gate1:live-smoke:test`; CI Postgres smoke is checked by `npm run gate1:ci-postgres:test` and runs migrate, seed, and live smoke in `.github/workflows/contract-drift.yml`. Secret injection and environment provisioning is checked by `npm run gate1:env` and `npm run gate1:env:test`; the preflight reports key presence, placeholder key names, and group status only, with a `keys-only` secret output policy. Remote GitHub production environment inventory is checked by `npm run gate1:github-env` and `npm run gate1:github-env:test`; it reports configured secret and variable names only, with a `names-only` output policy. Live deploy rehearsal is planned by `npm run gate1:deploy-rehearsal` and checked by `npm run gate1:deploy-rehearsal:test`; it targets `AWS CI Deploy` without dispatching the workflow automatically. Production rollout checks still gate switching production API reads to the database store.

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
npm run gate1:prisma:test
npm run gate1:migrate:test
npm run gate1:seed:plan
npm run gate1:seed:test
npm run gate1:seed:database:test
npm run gate1:database-store:test
npm run gate1:read-parity:test
npm run gate1:write-path:test
npm run gate1:rollback:test
npm run gate1:live-smoke:test
npm run gate1:ci-postgres:test
npm run gate1:env:test
npm run gate1:env -- --json
npm run gate1:env -- --env-file .env.production.local --json
npm run gate1:github-env:test
npm run gate1:github-env -- --json
npm run gate1:github-env -- --plan
npm run gate1:github-env:apply:test
npm run gate1:github-env:apply -- --env-file .env.production.local --plan
npm run gate1:deploy-rehearsal:test
npm run gate1:deploy-rehearsal -- --json
npm run gate1:deploy-rehearsal -- --plan
npm run gate1:live-smoke
npm run not-scaffolded:test
node scripts/not-scaffolded.mjs --help
npm test
npm run privacy:test
npm run errors:check
```

Gate 1 cannot close until `db:check` verifies Prisma migration status and the migration set implements the DB constraints matrix. With the database read parity path present, `db:check` reports `migrationStatus=database_read_parity`, `prismaSchemaPresent=true`, `prismaMigrationsPresent=true`, `seedParityStatus.summary=status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false`, `migrationPreflightStatus.summary=status=ready, command=gate1:migrate:test, rawSecretsPrinted=false`, `seedDatabaseStatus.summary=status=writer_implemented, command=gate1:seed:database, rawProviderValuesStored=false`, `readParityStatus.summary=status=store_implemented, boundary=gate1-database-store, fixtureShape=gate0-compatible, endpointParity=checked`, `writePathStatus.summary=status=implemented, command=gate1:write-path:test, rawProviderValuesStored=false`, `rollbackStatus.summary=status=ready, mode=fixture, rawSecretsPrinted=false`, `liveSmokeStatus.summary=status=preflight_ready, command=gate1:live-smoke, requiresDatabaseUrl=true, rawSecretsPrinted=false`, `ciPostgresStatus.summary=status=enabled, workflow=contract-drift.yml, command=gate1:ci-postgres:test, smoke=gate1:live-smoke`, `envProvisioningStatus.summary=status=preflight_ready, command=gate1:env, groups=productionRuntime|awsDeploy|androidRelease, secretOutputPolicy=keys-only`, `githubEnvInventoryStatus.summary=status=preflight_ready, command=gate1:github-env, environment=production, secretOutputPolicy=names-only`, and `deployRehearsalStatus.summary=status=preflight_ready, command=gate1:deploy-rehearsal, workflow=AWS CI Deploy, branch=main`. Database-backed mode should also report `databaseUrlStatus=valid` with a `postgresql` or `postgres` protocol without printing the full `DATABASE_URL`.

## Secret Injection And Environment Provisioning

Run `npm run gate1:env -- --json` before live deploy rehearsal. To preflight a local production-value file without exporting secrets into the shell, copy `.env.production.local.example` to `.env.production.local`, fill placeholders locally, then run `npm run gate1:env -- --env-file .env.production.local --json`. The command fails closed while any `replace-with-` placeholder remains and checks three groups:

- `productionRuntime`: production auth, LINE provider, S3 object storage, and database persistence keys.
- `awsDeploy`: OIDC deploy role, ECR repository, ECS cluster, and ECS service keys.
- `androidRelease`: upload keystore path, passwords, and key alias keys.

The command exits non-zero until required keys are present, expected mode keys are set to production values, and local template placeholders are replaced. Output must stay `keys-only`: missing, invalid, or placeholder key names may print, but `DATABASE_URL`, provider secrets, keystore passwords, raw LINE IDs, and provider tokens must never print.

Run `npm run gate1:github-env -- --json` after configuring the protected GitHub `production` environment. It checks the remote secret and variable inventory by name and exits non-zero until all required names are present. Output must stay `names-only`: configured values, variable values, timestamps, provider tokens, database URLs, and keystore passwords must never print.

Run `npm run gate1:github-env -- --plan` to print placeholder `gh variable set` commands for non-sensitive deployment settings and `gh secret set` commands for sensitive values. Replace placeholders locally before running the commands; never paste real secret values into issue, PR, CI, or chat logs.

Run `npm run gate1:github-env:apply -- --env-file .env.production.local --plan` to preview the concrete upload sequence without printing values. After local preflight passes, run `npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json` to write GitHub `production` environment variables and secrets. The apply command sends values to `gh` via stdin, keeps output `names-only`, and fails closed if any `replace-with-` placeholder remains.

## Live Deploy Rehearsal

Run `npm run gate1:deploy-rehearsal -- --json` or `npm run gate1:deploy-rehearsal -- --plan` before manually dispatching `AWS CI Deploy`. This safe preflight does not run `gh workflow run`; it first requires `npm run gate1:github-env -- --json` to report the protected GitHub `production` environment ready.

When ready, dispatch with `gh workflow run "AWS CI Deploy" --ref main` and watch the result with `gh run list --workflow "AWS CI Deploy" --branch main --limit 1`.

## Seed Parity

`npm run gate1:seed:plan` writes `.thai-meet/gate1/seed-parity.json` from `packages/api-contracts/fixtures/gate0-smoke.json`.

Seed parity maps the Gate 0 Trust Loop fixture into the Gate 1 model set:

- `User`
- `PublicIdentity`
- `ExternalContact`
- `ChatRoom`
- `ChatRoomParticipant`
- `ChatMessage`
- `ContactExchange`
- `Report`
- `Block`
- `RewardLedger`

The plan stores safe ids, counts, and a SHA-256 hash of safe fixture data. It must not store raw LINE contact values, Facebook URLs, QR payloads, provider tokens, push tokens, or ad keys.

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
- `npm run gate1:rollback -- --json` prints the fixture-mode rollback command set without echoing `DATABASE_URL` or provider secrets.
