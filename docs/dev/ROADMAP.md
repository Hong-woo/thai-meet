# Roadmap

Gate 0 completion state:

Gate 0 now includes local vertical slice, production readiness contract, AWS CI/deploy workflow, DESIGN.md source, and Android release signing scaffold.

Current Gate 1 infrastructure state:

1. Secret injection and environment provisioning: complete for the protected GitHub `production` environment.
   - Local values pass `npm run gate1:env -- --env-file .env.production.local --json`.
   - Remote names pass `npm run gate1:github-env -- --json`.
   - Apply flow uses `npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json` without printing secrets.

2. Live deploy rehearsal: complete on EC2.
   - `AWS CI Deploy` builds the API image, copies it to EC2, loads Docker, and restarts `thai-meet-api`.
   - Production HTTPS health is available at `https://www.thai-meet.com/health`.
   - `npm run gate1:public-smoke` verifies public health, Cognito callback fail-closed behavior, and signed LINE webhook idempotency.
   - EC2 operational steps live in `docs/dev/EC2_OPERATIONS.md`.

Next execution order:

1. Provider console hardening.
   - Keep Cognito callback on `https://www.thai-meet.com/auth/callback/cognito`.
   - Keep LINE webhook on `https://www.thai-meet.com/webhooks/line`.
   - Verify DNS and HTTPS health with `npm run gate1:domain -- --domain www.thai-meet.com --expected-ip 15.164.219.139 --json`.
   - Keep public-IP and legacy `sslip.io` URLs out of provider-review settings.

2. Provider callback routes.
   - Cognito token exchange and HTTP-only session cookie binding exists for `GET /auth/callback/cognito`.
   - Verified idempotent route exists for `POST /webhooks/line`.
   - LINE event-key persistence is schema-backed and guarded by `LINE_WEBHOOK_EVENT_STORE_MODE=database`.
   - Production RDS has the `LineWebhookEvent` migration applied and database-backed LINE event handling enabled.
   - Keep LINE Login callback separate from Messaging API webhook setup.
   - Use `docs/dev/PROVIDER_CONSOLE_SETTINGS.md` as the console setup checklist.

3. Store-track packaging.
   - Run `flutter build appbundle --release`.
   - Upload through internal testing first.
   - Add iOS signing only on a macOS-capable path.
