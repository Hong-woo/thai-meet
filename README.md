# Thai Meet

Thai Meet is a Thailand-focused Android/iOS dating app concept and MVP plan.

The current repository contains the product requirements, benchmark material, planning artifacts, and a minimal executable Gate 0 scaffold for the initial Flutter mobile app and NestJS backend build.

## Gate 0 Developer Quickstart

Current status: Gate 0 local vertical slice is executable, production-incomplete. The repo contains a mock-first API scaffold, Flutter Trust Loop shell, Docker Compose file, OpenAPI/client placeholders, local smoke scripts, and Android device smoke artifacts.

Target developer experience for the first scaffold:

```powershell
corepack pnpm install
corepack pnpm smoke
```

TTHW target: 10-15 minutes from clone to all smoke stages passing on a prepared developer machine. Node/pnpm and Flutter stable are prerequisites for the current scaffold smoke. First-ever installation of those tools is tracked separately from Thai Meet smoke time.

Expected `pnpm smoke` result on a prepared machine:

```text
doctor      OK  Node, pnpm/Corepack, Flutter, Docker CLI, ports, env
infra       SKIP Docker Compose boot deferred in scaffold smoke
api         OK  local scaffold health, OpenAPI, and fixture runtime
contract    OK  OpenAPI JSON and generated Dart client are fresh
wireframes  OK  route IDs, primitives, motion, accessibility, localization, and QA contracts
seed        OK  mock users, Public ID, Discover profile, LINE contact fixture
mobile      OK  Flutter app shell and Gate 0 routes
trust-loop  OK  mock login -> Public ID -> Discover -> Chat -> LINE ContactExchange -> Contact Card -> report/block
```

Local development must be mock-first. LINE, Facebook, AdMob, FCM, and object storage credentials should not be required for the first local run.

Smoke should stay thin: no Android emulator, iOS simulator, release build, real provider, real ad/push credential, or full admin workflow is required for the first local smoke.

Fast scaffold checks can be run before pnpm is available:

```powershell
npm run gate0:status
npm test
npm run privacy:test
```

`npm test` checks the mobile route contract, Flutter analyzer, Flutter widget tests, wireframe QA contract, OpenAPI/Dart client contract, local API runtime, executable Trust Loop fixture, and privacy leak guard.

`npm run gate0:status` prints the current local Gate 0 status, latest saved Android device smoke result, and next production gate.

`npm run gate0:status -- --json` prints the same summary for automation.

`npm run gate0:status -- --field currentStatus` prints one summary field for scripts.

`npm run gate0:status -- --help` prints status command options.

Flutter app commands:

```powershell
npm run mobile:preview:web
npm run mobile:run
npm run mobile:device:smoke
npm run mobile:device:result -- --strict
npm run mobile:flutter:build:android
npm run mobile:flutter:build:web
```

`npm run mobile:preview:web` starts a local development preview at `http://127.0.0.1:5370` so the Flutter UI can be inspected in a browser. This is a developer preview target, not a consumer web app.

`npm run mobile:flutter:build:android` writes a debug APK under `apps/mobile/build/app/outputs/flutter-apk/`.

`npm run mobile:device:result -- --strict` checks the latest saved Android device smoke result without rebuilding or reinstalling the app.

Developer docs:

- [Getting Started](docs/dev/GETTING_STARTED.md)
- [Gate 0 Status](docs/dev/GATE0_STATUS.md)
- [Gate 0 Status Command](docs/dev/GATE0_STATUS_COMMAND.md)
- [CI](docs/dev/CI.md)
- [Design Status](docs/dev/DESIGN_STATUS.md)
- [Production Gaps](docs/dev/PRODUCTION_GAPS.md)
- [Roadmap](docs/dev/ROADMAP.md)
- [Environment](docs/dev/ENVIRONMENT.md)
- [Feature Flags](docs/dev/FEATURE_FLAGS.md)
- [Reward Ledger](docs/dev/REWARD_LEDGER.md)
- [Smoke](docs/dev/SMOKE.md)
- [Android Device Smoke](docs/dev/ANDROID_DEVICE_SMOKE.md)
- [API Contracts](docs/dev/API_CONTRACTS.md)
- [DB Constraints](docs/dev/DB_CONSTRAINTS.md)
- [Gate 1 Persistence](docs/dev/GATE1_PERSISTENCE.md)
- [Trust Loop Slice](docs/dev/TRUST_LOOP_SLICE.md)
- [Errors](docs/dev/ERRORS.md)
- [DX Metrics](docs/dev/DX_METRICS.md)
- [Review Checklist](docs/dev/REVIEW_CHECKLIST.md)
- [Contributing](CONTRIBUTING.md)

First implementation slice after scaffold:

```text
mock login
  -> Public ID generated
  -> seeded Discover profile visible
  -> Start Chat
  -> LINE ContactExchange created
  -> Contact Card rendered without copying raw LINE data into ChatMessage
  -> report/block event recorded
```

## Repository Layout

```text
docs/
  prd/        Product requirements documents
  designs/    Office-hours and planning review artifacts
  dev/        Developer setup, smoke, contracts, errors, and migration notes
benchmark/    Competitor/reference material
apps/
  api/        Minimal API scaffold
  mobile/     Flutter route shell scaffold with Android debug build and local web preview support
packages/
  api-contracts/
infra/
  docker/
scripts/
  smoke and scaffold checks
```

Planned implementation layout:

```text
apps/
  mobile/     Flutter Android/iOS app
  api/        NestJS modular monolith
  admin/      Admin web app
packages/
  api-contracts/
infra/
```
