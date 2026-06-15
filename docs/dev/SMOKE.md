# Smoke

Smoke entrypoints:

```powershell
npm run smoke:doctor
corepack pnpm smoke
```

`npm test` is the fast scaffold gate. It requires Flutter because it runs `flutter analyze` and Flutter widget tests, but it does not require Chrome, Docker, pnpm, an Android emulator, or a real device:

```powershell
npm test
```

Physical Android validation stays separate from the thin scaffold gate:

```powershell
npm run mobile:device:smoke
npm run mobile:device:result -- --strict
```

`npm run mobile:device:smoke` builds, installs, launches, captures a screenshot, and archives JSON/PNG evidence. `npm run mobile:device:result -- --strict` checks the latest saved result without rerunning the device smoke.

Smoke stages:

- `doctor` - checks Node, pnpm/Corepack, Flutter, Docker CLI, and ports.
- `infra` - skipped in scaffold smoke; Docker Compose service boot is deferred.
- `api` - starts the local scaffold API on an ephemeral port and checks health, OpenAPI, and fixtures.
- `contract` - checks OpenAPI and Dart client drift.
- `wireframes` - validates route IDs, component primitives, motion, accessibility, localization, and QA contracts.
- `seed` - writes local Gate 0 fixture copies under `.thai-meet/fixtures/`.
- `mobile` - checks Gate 0 route contract, Flutter analyzer, and Flutter widget tests.
- `trustLoop` - runs mock login to LINE ContactExchange executable fixture path.
- `privacy` - scans for fake sensitive values outside allowlisted test files.

Structured results are written to:

```text
.thai-meet/smoke-runs/*.json
```

Current expected local failure on an unprepared Windows machine:

```text
TM_SMOKE_DOCTOR_FLUTTER_UNAVAILABLE
TM_SMOKE_DOCTOR_DOCKER_UNAVAILABLE
```

This is a prerequisite failure, not a scaffold test failure. After prerequisites are installed, rerun `pnpm smoke`.
