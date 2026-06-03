# Thai Meet Developer Docs

These docs describe the executable Gate 0 scaffold. Keep them short, practical, and updated when scripts, routes, contracts, smoke stages, or safety-sensitive behavior changes.

Start here:

- `GETTING_STARTED.md` - local setup and first commands
- `ENVIRONMENT.md` - toolchain and mock-first provider defaults
- `FEATURE_FLAGS.md` - Gate 0 flags, rollout sequence, and rollback posture
- `REWARD_LEDGER.md` - append-only rewards, idempotency, and Gate 2 boundary
- `SMOKE.md` - smoke stages, diagnostics, and result files
- `API_CONTRACTS.md` - OpenAPI, generated Dart client, and drift checks
- `DB_CONSTRAINTS.md` - future Prisma constraints, indexes, and atomicity rules
- `TRUST_LOOP_SLICE.md` - mock login to LINE ContactExchange smoke path
- `ERRORS.md` - scaffold error envelope and local error codes
- `DX_METRICS.md` - local smoke result schema and TTHW measurement notes
- `ARCHITECTURE.md` - current monorepo shape and ownership
- `REVIEW_CHECKLIST.md` - self-review checks before asking for review
- `CHANGELOG.md` - developer-facing contract and migration notes

Gate 0 rule of thumb: raw external contact values must not be copied into chat messages, logs, smoke output, screenshots, or generated artifacts.
