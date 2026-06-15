# DB Constraints And Indexes

This is the Gate 1 schema contract for moving `apps/api` from fixture-backed responses to Prisma models. These constraints and indexes are implemented in `apps/api/prisma/schema.prisma` and the first Gate 1 migration, and must stay aligned with this document.

Run the scaffold check:

```powershell
npm run db:check
npm run db:check -- --json
npm run db:check -- --field migrationStatus
npm run db:check -- --field notScaffoldedGuard.errorCode
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
$env:DATABASE_URL="postgresql://gate1.local/thai_meet"; npm run db:check -- --field databaseUrlStatus; Remove-Item Env:DATABASE_URL
```

`npm run db:check -- --json` exposes `status`, `migrationStatus`, `persistenceGate`, `constraintsDoc`, `persistenceDoc`, `reviewChecklist`, `requiredModels`, `requiredModes`, `notScaffoldedGuard`, `prismaSchemaPath`, `prismaMigrationsPath`, `prismaSchemaPresent`, `prismaMigrationsPresent`, `prismaScaffoldStatus`, `seedParityStatus`, `ciPostgresStatus`, `seedParityPlanCommand`, `seedParityCheckCommand`, `ciPostgresCheckCommand`, `seedParityPlanPath`, `requiredEnvKeys`, `databaseUrlPresent`, `databaseUrlStatus`, and `databaseUrlProtocol` for CI handoff checks. Gate 1 reports `migrationStatus=database_read_parity` when Prisma schema, migrations, database store mapping, and read parity checks exist.

The `notScaffoldedGuard` field remains for compatibility with older handoff checks. `npm run db:migrate` now runs through `scripts/gate1-migrate.mjs`, which checks the Prisma scaffold and requires a valid PostgreSQL `DATABASE_URL` before invoking Prisma.

Prisma scaffold fields are path checks plus `npm run gate1:prisma:test`. Gate 1 should report `prismaSchemaPresent=true`, `prismaMigrationsPresent=true`, and `prismaScaffoldStatus.summary=schema=true, migrations=true, migrationStatus=scaffolded`.

Seed parity fields are fixture-to-model checks plus `npm run gate1:seed:test`. Gate 1 should report `seedParityStatus.summary=status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false`.

Migration preflight fields are secret-safe deploy wrapper checks plus `npm run gate1:migrate:test`. Gate 1 should report `migrationPreflightStatus.summary=status=ready, command=gate1:migrate:test, rawSecretsPrinted=false`.

Database seed writer fields are dry-run checks plus `npm run gate1:seed:database:test`. Gate 1 should report `seedDatabaseStatus.summary=status=writer_implemented, command=gate1:seed:database, rawProviderValuesStored=false`.

Read parity fields are database-store mapping checks plus `npm run gate1:database-store:test` and fixture-vs-database service checks plus `npm run gate1:read-parity:test`. Gate 1 should report `readParityStatus.summary=status=store_implemented, boundary=gate1-database-store, fixtureShape=gate0-compatible, endpointParity=checked`.

Write path fields are persisted ContactExchange, ChatMessage, Report, and Block upsert checks plus `npm run gate1:write-path:test`. Gate 1 should report `writePathStatus.summary=status=implemented, command=gate1:write-path:test, rawProviderValuesStored=false`.

Rollback fields are fixture-mode recovery checks plus `npm run gate1:rollback:test`. Gate 1 should report `rollbackStatus.summary=status=ready, mode=fixture, rawSecretsPrinted=false`.

Live smoke fields are `DATABASE_URL` and secret-safe preflight checks plus `npm run gate1:live-smoke:test`. Gate 1 should report `liveSmokeStatus.summary=status=preflight_ready, command=gate1:live-smoke, requiresDatabaseUrl=true, rawSecretsPrinted=false`.

CI Postgres smoke fields are GitHub Actions workflow checks plus `npm run gate1:ci-postgres:test`. Gate 1 should report `ciPostgresStatus.summary=status=enabled, workflow=contract-drift.yml, command=gate1:ci-postgres:test, smoke=gate1:live-smoke`.

Gate 0 does not require `DATABASE_URL`. Gate 1 should provide it only when database-backed mode and migration checks are ready. `databaseUrlPresent` reports `false` by default and `true` when `DATABASE_URL` is set in the current shell. `databaseUrlStatus` reports `missing`, `valid`, or `invalid`; `databaseUrlProtocol` reports only the URL protocol, never the full secret-bearing URL.

Stable command error codes:

- `TM_DB_MATRIX_UNKNOWN_OPTION`
- `TM_DB_MATRIX_OPTION_CONFLICT`
- `TM_DB_MATRIX_FIELD_REQUIRED`
- `TM_DB_MATRIX_UNKNOWN_FIELD`

## Matrix

UserIdentity:

- unique(provider, providerUserId)
- index(userId)

PublicIdentity:

- unique(publicId)
- unique(handle) where handle is not null
- index(userId, status)
- index(status, createdAt)

ExternalContact:

- unique(userId, provider) where isActive=true
- index(userId, provider)
- index(publicIdentityId)

ChatRoomParticipant:

- unique(roomId, userId, publicIdentityIdAtCreation)
- index(userId, publicIdentityIdAtCreation)
- index(roomId)

ChatMessage:

- index(roomId, createdAt)
- index(senderUserId, createdAt)
- index(senderPublicIdentityId)
- Contact Card messages reference ContactExchange by id only.

ContactExchange:

- index(roomId, createdAt)
- index(senderUserId, receiverUserId)
- index(contactId)
- index(status, createdAt)
- Must be the permission, audit, revoke, report, and admin-inspection boundary.

Block:

- unique(blockerUserId, blockedUserId)
- index(blockedUserId)

Report:

- index(reportedUserId, createdAt)
- index(reportedPublicIdentityId, createdAt)
- index(reporterUserId, createdAt)

RewardLedger:

- unique(idempotencyKey) where idempotencyKey is not null
- index(userId, type, expiresAt)
- index(publicIdentityId)

RewardConsumption:

- index(rewardLedgerId)
- index(actionType, actionId)

AuditEvent:

- index(actorUserId, createdAt)
- index(targetUserId, createdAt)
- index(eventType, createdAt)

## Atomicity Rules

- Social login must create or resolve User, UserIdentity, initial PublicIdentity, and activePublicIdentityId atomically.
- Public ID activation must atomically update User.activePublicIdentityId and identity status rules.
- Contact sharing must atomically create ContactExchange and ChatMessage.
- Reward grant and reward consumption must be transactional and idempotent.
- ChatRoomParticipant must store publicIdentityIdAtCreation for every participant.
- ChatMessage must store senderPublicIdentityId at send time.
- Report must store both reportedUserId and reportedPublicIdentityId.
- Block defaults to blockerUserId -> blockedUserId, while UI may also record the visible PublicIdentity that triggered the action.

## Safety Rules

- Raw LINE IDs, Facebook URLs, QR payloads, decrypted external contact fields, provider tokens, ad keys, and push keys must not be copied into ChatMessage.
- PublicIdentity exists so users can reset public-facing identity without losing safety, audit, report, or block history.
- ContactExchange is not a chat text payload; it is an authority object with permission, audit, revoke, report, and admin-inspection behavior.
