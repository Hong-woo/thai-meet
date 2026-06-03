# Review Checklist

Use this before asking for review or merging a Gate 0 change.

Core commands:

```powershell
npm test
git diff --check
npm run env:check
npm run errors:check
npm run db:check
npm run flags:check
npm run rewards:check
npm run api:openapi
npm run api-client:generate
git diff --exit-code -- packages/api-contracts/generated/gate0.openapi.json packages/api-contracts/dart/thai_meet_api_client.dart
```

Run when relevant:

```powershell
npm run privacy:test
npm run smoke:metrics
npm run smoke:doctor
pnpm smoke
```

API and contracts:

- OpenAPI source is updated when API behavior changes.
- Generated OpenAPI and Dart client artifacts are fresh.
- New or changed endpoints use the unified error envelope.
- ContactExchange errors use stable codes for setup, membership, idempotency, revoked, and provider-unavailable states.
- PublicIdentity responses expose public identity context, not private account or raw provider data.
- ContactExchange remains a permission object.

Mobile and routes:

- Gate 0 nav remains Discover, Chats, My ID, Safety.
- Gate 0 feature flags keep LINE visible and Facebook/rewards/ads/admin hidden by default.
- Reward ledger remains append-only and idempotent even while reward UI is hidden.
- Flutter route names and paths stay aligned with `scripts/check-mobile-routes.mjs`.
- Contact cards do not expose raw LINE/Facebook values in chat messages.
- Mobile UI changes consider small mobile viewports and accessibility labels.

Trust Loop:

- `mock login -> Public ID -> Discover -> Chat -> LINE ContactExchange -> Contact Card -> report/block` still works.
- ChatRoom participant snapshots include public identity context.
- Report and block remain reachable from the contact-sharing flow.

Privacy and safety:

- `npm run privacy:test` passes.
- Raw contact/provider/push values are not present in logs, errors, fixtures, screenshots, or smoke JSON.
- New fake sensitive values are added only to `packages/api-contracts/fixtures/privacy-leak-values.json`.
- Safety-sensitive behavior is documented in `docs/dev/CHANGELOG.md`.

DB and migrations:

- Prisma migration status is checked when database schema exists.
- DB constraints and indexes remain aligned with `docs/dev/DB_CONSTRAINTS.md`.
- Future DB changes are backward-compatible during Gate 0 alpha unless there are no live testers.
- Safety-sensitive persisted changes have a note under `docs/dev/migrations/`.

Docs:

- `README.md` and `docs/dev/` are updated when commands, errors, routes, contracts, smoke stages, or setup expectations change.
- PR description states which checks were run and which prerequisites are still missing locally.

CI:

- `.github/workflows/contract-drift.yml` passes on Ubuntu and Windows.
- Smoke metrics artifact is uploaded when CI runs.
- Full smoke may remain manual until Flutter/Docker prerequisites are provisioned in CI.
