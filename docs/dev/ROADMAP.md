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
   - Temporary HTTPS health is available at `https://15-164-219-139.sslip.io/health`.
   - EC2 operational steps live in `docs/dev/EC2_OPERATIONS.md`.

Next execution order:

1. Real domain hardening.
   - Point a real domain or subdomain at the EC2 public IP.
   - Reissue TLS with Certbot or an AWS-managed TLS path.
   - Replace public-IP and `sslip.io` callback/config URLs with HTTPS domain URLs.

2. Provider callback routes.
   - Implement and contract-test `GET /auth/callback/cognito`.
   - Implement and contract-test `POST /webhooks/line`.
   - Keep LINE Login callback separate from Messaging API webhook setup.
   - Use `docs/dev/PROVIDER_CONSOLE_SETTINGS.md` as the console setup checklist.

3. Store-track packaging.
   - Run `flutter build appbundle --release`.
   - Upload through internal testing first.
   - Add iOS signing only on a macOS-capable path.
