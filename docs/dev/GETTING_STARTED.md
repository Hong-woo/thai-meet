# Getting Started

Current state: minimal executable Gate 0 scaffold. Product features are intentionally thin.

Prerequisites for full smoke:

- Node.js 22 or newer
- pnpm or Corepack
- Flutter stable
- Docker CLI installed; Docker daemon is not required until infra boot is enabled

First local checks:

```powershell
npm run gate0:status
npm test
npm run env:check
npm run flags:check
npm run rewards:check
npm run privacy:test
```

Prepared-machine smoke target:

```powershell
corepack pnpm install
corepack pnpm smoke
```

Useful commands:

```powershell
npm run dev
npm run smoke:doctor
npm run api:openapi
npm run api-client:generate
npm run mobile:preview:web
npm run mobile:run
npm run mobile:device:smoke
npm run mobile:device:result -- --strict
npm run mobile:flutter:build:android
npm run mobile:flutter:build:web
npm run db:seed
```

`npm run mobile:preview:web` starts a browser-inspectable Flutter preview at `http://127.0.0.1:5370`. It is for local UI review only and does not add a consumer web surface to Gate 0.

`npm run gate0:status` prints the current local Gate 0 status, latest saved Android device smoke result, and next production gate.

`npm run gate0:status -- --json` prints the same summary for automation.

`npm run gate0:status -- --field currentStatus` prints one summary field for scripts.

`npm run gate0:status -- --help` prints status command options.

`npm run mobile:run` starts the Flutter app on the selected connected device, emulator, or browser target. `npm run mobile:flutter:build:android` builds the debug APK for Android smoke validation. `npm run mobile:device:smoke` builds, installs, and launches the debug APK on an authorized USB debugging device. `npm run mobile:device:result -- --strict` checks the latest saved Android device smoke result without reinstalling.

If `pnpm smoke` fails in the `doctor` stage, fix the reported prerequisite first. The smoke script writes structured results under `.thai-meet/smoke-runs/`.

On machines where Corepack is available but the `pnpm` shim is not on PATH, use `corepack pnpm ...` for the same pinned pnpm 10.0.0 commands.

Time to hello world target: 10-15 minutes from clone to all smoke stages passing on a prepared developer machine. First-time installation of Node, Flutter, and Docker CLI is tracked outside Thai Meet smoke time.
