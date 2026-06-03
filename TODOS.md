# TODOS

## Sprint 0 DX Implementation Status

Done in scaffold:

- Minimal executable monorepo scaffold.
- Gate 0 Developer Quickstart and smoke contract.
- Smoke doctor and thin smoke scope guard.
- Trust Loop vertical slice.
- Privacy leak tests.
- Contract drift gate.
- Developer docs and migration notes.
- Internal contributor kit.
- Local DX metrics log.
- Unified error envelope.
- DB constraints/index matrix.
- Feature flag matrix and rollout sequence.
- Reward ledger scaffold contract.
- DESIGN.md, PRODUCT.md, and static Gate 0 wireframes.
- Executable wireframe QA contract wired into `npm test`.
- Gate 0 5-tab route/nav contract aligned across wireframes, Flutter route shell, developer docs, and tests.

Partial:

- Cross-platform smoke parity: Windows/Ubuntu CI and Windows local checks exist; full Flutter/Docker prepared-machine smoke still depends on installed prerequisites.
- Design system: source-of-truth docs and wireframes exist; Figma screen set and Public ID image templates remain.
- Trust Loop implementation: API routes now call a fixture-backed Gate 0 service boundary; real Prisma/NestJS storage and Flutter screens remain.

Remaining:

- Figma Gate 0 screen set and Public ID image templates.
- Real Prisma/NestJS/Flutter feature implementation beyond the fixture-backed Gate 0 scaffold.
- Full mobile build/device smoke after Flutter toolchain is installed.

## Sprint 0 Design System And Gate 0 Screens

What: Complete the Figma Gate 0 screen set and six Public ID image templates now that `DESIGN.md`, `PRODUCT.md`, and static wireframes exist.

Why: Gate 0 now has source-of-truth docs and HTML wireframes, but Figma handoff assets and reusable Public ID visual templates are still needed for production mobile implementation.

Pros: Prevents Flutter implementation from drifting screen by screen; gives designers, developers, and QA one reference for Trust Loop UI decisions.

Cons: Adds final design handoff work before implementation can be considered design-complete.

Context: `/plan-design-review`, UI UX Pro Max, Impeccable, interface-design, and Emil design review work fixed the 5-tab Gate 0 UX structure, Bangkok Rose Trust visual system, wireframe QA contract, localization/accessibility contracts, and Contact Card lifecycle states.

Depends on / blocked by: Figma access and confirmation of initial launch language priority.

## Sprint 0 Minimal Executable Monorepo Scaffold

What: Create the smallest runnable monorepo: root `package.json`, `pnpm-workspace.yaml`, `apps/api`, `apps/mobile`, `packages/api-contracts`, `infra/docker`, `.env.example`, and initial `pnpm smoke`.

Why: The README now promises a Gate 0 developer quickstart, but TTHW remains blocked until the planned commands exist.

Pros: Gives developers a real entry point before broad feature work; makes API health, Flutter shell, OpenAPI placeholders, local DB/Redis, and mock provider defaults visible from day one.

Cons: Adds scaffold work before product features feel complete.

Context: `/plan-devex-review` selected Minimal executable monorepo scaffold as the Getting Started fix for reaching a 10-15 minute Gate 0 Local Smoke target. Outside Voice recommended sequencing scaffold before polished docs and contributor process.

Depends on / blocked by: Toolchain choice, Flutter/NestJS scaffold commands, Docker availability, mock provider defaults, and script naming.

## Sprint 0 Cross-Platform Smoke Parity

What: Ensure `pnpm install`, `pnpm smoke`, API, DB, contract generation, and Flutter shell smoke commands work from Windows PowerShell and macOS/Linux shells, while documenting iOS build/signing as Mac-only.

Why: Gate 0 local smoke should validate API contracts and Trust Loop wiring even on Windows; iOS distribution should not block first-run developer confidence.

Pros: Keeps the local developer loop accessible across common founder/contractor environments; avoids accidentally making Xcode a smoke prerequisite.

Cons: Requires scripts to avoid shell-specific assumptions or document OS-specific command variants.

Context: `/plan-devex-review` selected Windows/macOS smoke parity + iOS build exception for Developer Environment & Tooling.

Depends on / blocked by: Root script implementation, Flutter web/app shell target, Docker Compose, and future docs/dev getting-started examples.

## Sprint 0 Internal Contributor Kit

What: Add `CONTRIBUTING.md`, GitHub issue templates, a PR checklist, and `docs/dev/REVIEW_CHECKLIST.md` covering smoke, OpenAPI/client freshness, Prisma migrations, route contracts, contact leakage, PublicIdentity/ChatRoomParticipant assumptions, feature flags, mobile UI/a11y, and docs updates.

Why: Thai Meet is not a public developer platform, but early contractors or collaborators need a shared review standard for safety-sensitive mobile/API changes.

Pros: Reduces review ambiguity and catches trust/contact-sharing regressions before they reach alpha.

Cons: Adds lightweight process before the team is large.

Context: `/plan-devex-review` selected Internal contributor kit for Community & Ecosystem.

Depends on / blocked by: GitHub repo conventions, smoke command, contract drift gate, route tests, and security/logging policies.

## Sprint 0 Local DX Metrics Log

What: Make `pnpm smoke` write a gitignored `.thai-meet/smoke-runs/*.json` result with cold/warm run type, duration, status, failed stage, retry count, command/runtime versions, OS, and stage outcomes; upload the same result as a CI artifact.

Why: The 10-15 minute Gate 0 Local Smoke target should be measurable without collecting secrets, raw contact data, chat/profile content, or unnecessary local paths.

Pros: Shows whether developer friction comes from infra, API, contracts, seed data, mobile route wiring, or Trust Loop behavior; gives future `/devex-review` real data.

Cons: Adds a small telemetry-like local artifact that must be documented and kept privacy-safe.

Context: `/plan-devex-review` selected Local DX metrics log for DX Measurement & Feedback Loops.

Depends on / blocked by: `pnpm smoke`, `.gitignore` update for `.thai-meet/`, CI artifact setup, privacy-safe smoke result schema, and explicit TTHW prerequisite boundaries.

## Sprint 0 Trust Loop Vertical Slice

What: Implement the first real Gate 0 vertical slice beyond fixtures: mock login -> Public ID generation -> seeded Discover profile -> Start Chat -> LINE ContactExchange -> Contact Card render -> revoke/report/block event.

Why: The first real usage path should prove the Thai local woman trust loop end to end before the team expands into broad sprint modules.

Pros: Keeps Flutter, NestJS, OpenAPI, seeded data, and ContactExchange behavior aligned from day one; gives `pnpm smoke` a meaningful product-level success condition.

Cons: Requires touching mobile, API, contracts, seed data, and tests in one slice instead of completing backend or mobile in isolation.

Context: `/plan-devex-review` selected YC-style MVP full-stack/mobile developer, Gate 0 Local Smoke TTHW target of 10-15 minutes, one-command local smoke, mock-first env matrix, and Contract + Trust Loop smoke. `/plan-eng-review` later fixed the implementation-start rule: Gate 0 route/nav must stay `Discover`, `Swipe`, `Chat`, `List`, `My`.

Depends on / blocked by: Existing monorepo scaffold, toolchain/env matrix, mock provider defaults, OpenAPI generation, local DB/Redis, and Gate 0 5-tab Flutter shell. Full Figma polish should improve alpha quality but must not block the first runnable local DX smoke.

## Sprint 0 Developer Quickstart And Smoke Contract

What: Add a Gate 0 Developer Quickstart to `README.md`, define the TTHW measurement contract, toolchain/mock-first environment matrix, standardize root scripts, and implement the `pnpm smoke` contract with structured diagnostics and stable smoke error codes.

Why: A YC-style MVP developer should know within 10-15 minutes whether local infra, API contracts, seeded data, Flutter route wiring, and the Trust Loop vertical slice are working.

Pros: Turns the repo from planning-readable into implementation-runnable; prevents LINE/Facebook/AdMob/FCM credentials from blocking the first local run; keeps API, mobile, contract, DB, and smoke commands discoverable from the root.

Cons: Adds upfront scaffold and script discipline before feature work can feel fast.

Context: `/plan-devex-review` fixed the target TTHW at Gate 0 Local Smoke 10-15 minutes and selected one-command Contract + Trust Loop smoke with structured diagnostics. Outside Voice added that cold/warm timing, prerequisite boundaries, and `pnpm install` inclusion must be explicit.

Depends on / blocked by: `apps/api`, `apps/mobile`, `packages/api-contracts`, Docker Compose, `.env.example`, mock provider fixtures, smoke script wiring, and error code naming.

## Sprint 0 Smoke Doctor And Thin Scope

What: Add a `doctor` or `preflight` stage to `pnpm smoke` that checks Node, pnpm/Corepack, Flutter stable, Chrome for Flutter web, Docker running, required ports, `.env` creation, Prisma engine readiness, and OpenAPI/Dart generator prerequisites before starting services.

Why: The first local run should fail before state changes when the developer machine is missing basic prerequisites, and the error should name the next action.

Pros: Prevents avoidable first-run confusion; keeps smoke failures grouped by `doctor`, `infra`, `api`, `contract`, `seed`, `mobile`, and `trust-loop`.

Cons: Adds preflight implementation work and error code taxonomy before feature work.

Context: Outside Voice for `/plan-devex-review` flagged hidden first-run blockers and recommended a smoke doctor/preflight stage.

Depends on / blocked by: Root scripts, toolchain version choices, Docker Compose ports, Flutter web target, generator choices, and `.env.example`.

## Sprint 0 Thin Smoke Scope Guard

What: Keep `pnpm smoke` limited to disposable local DB/Redis, mock fixtures, API integration checks, generated-client freshness, Flutter route/widget checks, and one scripted Trust Loop.

Why: `pnpm smoke` should prove the Gate 0 Contract + Trust Loop in 10-15 minutes, not become a full mobile E2E, release build, Android/iOS device, admin, or real-provider test suite.

Pros: Protects TTHW from scope creep while preserving meaningful product confidence.

Cons: Requires separate test commands for broader regression, mobile device, and release/distribution checks.

Context: Outside Voice warned that `pnpm smoke` is valuable but close to too ambitious for first scaffold.

Depends on / blocked by: Test taxonomy, route/widget smoke tests, mock provider fixtures, and future QA command separation.

## Sprint 0 Developer Docs

What: Create `docs/dev/GETTING_STARTED.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md`, `ERRORS.md`, `SMOKE.md`, `TRUST_LOOP_SLICE.md`, `CHANGELOG.md`, and `docs/dev/migrations/`, then link key docs from `README.md`.

Why: PRD and planning docs explain the product and decisions, but developers need short execution docs with copy-paste commands, expected output, and ownership boundaries.

Pros: Lets a new developer learn by doing without reading the full PRD first; gives future `/devex-review` concrete docs to test.

Cons: Adds docs maintenance overhead as scaffold commands evolve.

Context: `/plan-devex-review` selected `docs/dev/` short practical docs for Documentation & Learning.

Depends on / blocked by: Minimal executable scaffold, root scripts matrix, smoke contract, unified error envelope, and Trust Loop vertical slice.

## Sprint 0 Change Log And Migration Notes

What: Track API, DB, mobile route, smoke contract, generated client, and safety-sensitive breaking changes in `docs/dev/CHANGELOG.md`, with dated notes under `docs/dev/migrations/` when needed.

Why: Gate 0 can move quickly, but PublicIdentity, ContactExchange, ChatRoomParticipant snapshot, ChatMessage identity, Report, Block, RewardLedger, and AuditEvent changes should not depend on memory.

Pros: Makes contract and safety changes auditable; helps future developers understand why a migration or generated client changed.

Cons: Requires small documentation updates on breaking changes.

Context: `/plan-devex-review` selected `docs/dev/CHANGELOG.md` + migration notes for Upgrade & Migration.

Depends on / blocked by: Developer docs folder, contract drift gate, Prisma migrations, route contract tests, and PR/commit hygiene.

## Sprint 0 Unified Error Envelope

What: Define API error envelopes and local command error codes for validation, auth, permission, conflict, not found, provider, system, smoke, contract, DB, mobile route, and trust-loop failures.

Why: ContactExchange and PublicIdentity errors must be clear to developers and Flutter without leaking raw LINE IDs, Facebook URLs, QR payloads, provider tokens, or secrets.

Pros: Gives Flutter, API, QA, and smoke scripts one shared failure language; improves debugging and makes localized UI error mapping safer.

Cons: Adds a little upfront API/error design before endpoints exist.

Context: `/plan-devex-review` selected Unified error envelope + smoke error code for Error Messages & Debugging.

Depends on / blocked by: API scaffold, error code taxonomy, ContactExchange service boundaries, logging policy, and future `docs/errors/` references.

## Sprint 0 Privacy Leak Tests

What: Add fake sensitive LINE/Facebook/QR/provider/ad/push/contact fixtures and tests that assert those values never appear in `ChatMessage`, API error JSON, smoke output, `.thai-meet/smoke-runs/*.json`, application logs, audit events, notification payloads, generated screenshots, or test artifacts.

Why: The plan forbids raw contact leakage, but ContactExchange/PublicIdentity safety requires executable enforcement, not only policy text.

Pros: Turns privacy rules into regression tests; catches accidental diagnostic/logging leaks early.

Cons: Requires carefully designed fake sensitive fixtures and artifact scanning.

Context: Outside Voice for `/plan-devex-review` flagged privacy enforcement as the main remaining security/DX blind spot.

Depends on / blocked by: ContactExchange implementation, logging/audit boundaries, smoke output schema, notification mock, and artifact/log scanning utilities.

## Sprint 0 Contract Drift Gate

What: Add CI gates for OpenAPI generation, generated Dart client freshness, Flutter compile against generated client, PublicIdentity/ContactExchange contract tests, Prisma migration status, Flutter route contract tests, and Gate 0 smoke.

Why: Mobile contract drift is expensive to discover late, and PublicIdentity/ContactExchange changes can silently damage trust and safety behavior.

Pros: Keeps backend, generated client, Flutter routes, DB migrations, and smoke behavior aligned as the MVP changes quickly.

Cons: CI will reject partially updated API/mobile changes, so developers must update contracts and tests in the same branch.

Context: `/plan-devex-review` selected Contract drift gate + migration policy for the Upgrade/Migration journey stage. Outside Voice added that gates must be compile-backed and must specifically cover PublicIdentity and ContactExchange endpoints.

Depends on / blocked by: OpenAPI generation command, Dart client generation command, Prisma migrations, route contract tests, and GitHub Actions setup.

## Recommended Sprint 0 DX Sequence

What: Sequence Sprint 0 DX work as: scaffold + pinned toolchain + `.env.example` -> smoke skeleton + doctor/preflight -> Trust Loop vertical slice -> CI drift gates + leak tests -> `docs/dev/` + contributor checklist.

Why: Outside Voice found the plan strong but warned that docs, contributor process, and design polish should not run ahead of executable commands and smoke evidence.

Pros: Keeps implementation order aligned with the 10-15 minute TTHW target; reduces the chance of polished docs describing commands that do not exist.

Cons: Some docs and contributor-kit work waits until the scaffold proves the command surface.

Context: Outside Voice recommendation accepted during `/plan-devex-review`.

Depends on / blocked by: Sprint 0 planning owner and implementation kickoff.
