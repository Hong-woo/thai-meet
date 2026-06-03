# Smoke

Smoke entrypoints:

```powershell
npm run smoke:doctor
pnpm smoke
```

`npm test` is the fast scaffold gate and does not require Flutter, Chrome, Docker, or pnpm:

```powershell
npm test
```

Smoke stages:

- `doctor` - checks Node, pnpm/Corepack, Flutter, Chrome/Edge, Docker, daemon, and ports.
- `infra` - skipped in scaffold smoke; Docker Compose service boot is deferred.
- `api` - starts the local scaffold API on an ephemeral port and checks health, OpenAPI, and fixtures.
- `contract` - checks OpenAPI and Dart client drift.
- `seed` - writes local Gate 0 fixture copies under `.thai-meet/fixtures/`.
- `mobile` - checks Gate 0 reduced route contract.
- `trustLoop` - runs mock login to LINE ContactExchange executable fixture path.
- `privacy` - scans for fake sensitive values outside allowlisted test files.

Structured results are written to:

```text
.thai-meet/smoke-runs/*.json
```

Current expected local failure on an unprepared Windows machine:

```text
TM_SMOKE_DOCTOR_FLUTTER_UNAVAILABLE
TM_SMOKE_DOCTOR_CHROME_UNAVAILABLE
TM_SMOKE_DOCTOR_DOCKER_NOT_RUNNING
```

This is a prerequisite failure, not a scaffold test failure. After prerequisites are installed and Docker is running, rerun `pnpm smoke`.
