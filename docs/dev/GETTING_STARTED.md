# Getting Started

Current state: minimal executable Gate 0 scaffold. Product features are intentionally thin.

Prerequisites for full smoke:

- Node.js 22 or newer
- pnpm or Corepack
- Flutter stable
- Chrome or Edge available on PATH for Flutter web smoke
- Docker Desktop with the daemon running

First local checks:

```powershell
npm test
npm run env:check
npm run flags:check
npm run rewards:check
npm run privacy:test
```

Prepared-machine smoke target:

```powershell
pnpm install
pnpm smoke
```

Useful commands:

```powershell
npm run dev
npm run smoke:doctor
npm run api:openapi
npm run api-client:generate
npm run db:seed
```

If `pnpm smoke` fails in the `doctor` stage, fix the reported prerequisite first. The smoke script writes structured results under `.thai-meet/smoke-runs/`.

Time to hello world target: 10-15 minutes from clone to all smoke stages passing on a prepared developer machine. First-time installation of Node, Flutter, Docker, and browsers is tracked outside Thai Meet smoke time.
