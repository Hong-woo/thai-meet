# Developer Changelog

Record developer-facing changes that affect local setup, API contracts, generated clients, mobile routes, smoke stages, privacy checks, DB migrations, or safety-sensitive behavior.

## 2026-06-04

- Added executable wireframe QA contract and wired it into `npm test` and scaffold smoke.
- Split the fixture-backed API scaffold behind a Gate 0 service boundary so Public ID, Discover, Chat, LINE ContactExchange, and safety actions can move toward real implementations without changing route contracts.

## 2026-06-03

- Added minimal executable monorepo scaffold for Gate 0.
- Added root scripts for local smoke, doctor, contracts, route checks, fixtures, and privacy checks.
- Added OpenAPI source contract and generated Dart client placeholder.
- Added executable Trust Loop fixture: mock login, Public ID, Discover, Chat, LINE ContactExchange, Contact Card, report/block.
- Added privacy leak check to prevent fake sensitive contact values from appearing outside allowlisted test fixtures.
- Added structured smoke result files under `.thai-meet/smoke-runs/`.
- Added Contract Drift Gate GitHub Actions workflow for fast Gate 0 checks on Ubuntu and Windows.
- Added local DX metrics summary command and CI smoke metrics artifact upload.
- Added mock-first environment matrix check and `docs/dev/ENVIRONMENT.md`.
- Added ContactExchange unified error envelope checks and scaffold error responses.
- Added DB constraints/index matrix and scaffold drift check.
- Added Gate 0 feature flag matrix, rollout sequence, rollback posture, and scaffold drift check.
- Added reward ledger scaffold contract for append-only grants, idempotency, and future Gate 2 rewarded ads.
- Tightened review gates: Dart room paths now require URL encoding, spawned API checks bind to ephemeral ports, scaffold smoke marks deferred infra as skipped, and privacy scanning covers docs, README, GitHub workflow files, and contributor docs.

Migration notes:

- No database migration yet. Prisma schema and persisted data models are not scaffolded.
- No live provider migration yet. LINE, Facebook, AdMob, FCM, and storage are mock-first for local Gate 0.
