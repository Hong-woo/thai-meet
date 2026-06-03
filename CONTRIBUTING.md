# Contributing

Thai Meet is currently in Gate 0 scaffold mode. Keep changes small, executable, and tied to the Trust Loop.

Before opening a PR:

```powershell
npm test
git diff --check
```

Run the full smoke when your machine has Node, pnpm/Corepack, Flutter, Chrome or Edge on PATH, and Docker Desktop running:

```powershell
pnpm smoke
```

Required habits:

- Preserve the Gate 0 reduced nav: Discover, Chats, My ID, Safety.
- Treat ContactExchange as a permission object, not a raw chat message.
- Do not copy raw LINE, Facebook, QR, provider token, push token, or contact values into logs, errors, screenshots, smoke output, generated artifacts, or chat messages.
- Regenerate OpenAPI and Dart client artifacts after contract changes.
- Update `docs/dev/CHANGELOG.md` for API, DB, mobile route, smoke, generated client, or safety-sensitive changes.
- Add a dated note under `docs/dev/migrations/` when a future persisted migration changes behavior.
- Keep local development mock-first. Real provider credentials must not be required for the first local run.

Review yourself with `docs/dev/REVIEW_CHECKLIST.md` before asking for review.
