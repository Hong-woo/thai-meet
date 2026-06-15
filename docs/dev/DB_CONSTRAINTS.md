# DB Constraints And Indexes

This is the Gate 0 schema contract before Prisma is scaffolded. When `apps/api` moves from fixture-backed responses to Prisma models, these constraints and indexes should be implemented in migrations and kept aligned with this document.

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
$env:DATABASE_URL="postgresql://gate1.local/thai_meet"; npm run db:check -- --field databaseUrlStatus; Remove-Item Env:DATABASE_URL
```

`npm run db:check -- --json` exposes `status`, `migrationStatus`, `persistenceGate`, `constraintsDoc`, `persistenceDoc`, `reviewChecklist`, `requiredModels`, `requiredModes`, `notScaffoldedGuard`, `prismaSchemaPath`, `prismaMigrationsPath`, `prismaSchemaPresent`, `prismaMigrationsPresent`, `prismaScaffoldStatus`, `requiredEnvKeys`, `databaseUrlPresent`, `databaseUrlStatus`, and `databaseUrlProtocol` for CI handoff checks. Gate 0 reports `migrationStatus=not_scaffolded` until Prisma migrations exist.

The `notScaffoldedGuard` field reports the command guard that keeps `npm run db:migrate` fail-closed with `TM_COMMAND_NOT_SCAFFOLDED` until Gate 1 migration work starts. Nested fields such as `notScaffoldedGuard.errorCode` can be printed directly with `--field`.

Prisma scaffold fields are path checks only. Gate 0 should report `prismaSchemaPresent=false`, `prismaMigrationsPresent=false`, and `prismaScaffoldStatus.summary=schema=false, migrations=false, migrationStatus=not_scaffolded`; Gate 1 should turn those true only with schema and migration contract checks.

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
