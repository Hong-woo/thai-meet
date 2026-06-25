# Roadmap

Gate 0 completion state:

Gate 0 now includes local vertical slice, production readiness contract, AWS CI/deploy workflow, DESIGN.md source, and Android release signing scaffold.

Current Gate 1 infrastructure state:

1. Secret injection and environment provisioning: complete for the protected GitHub `production` environment.
   - Local values pass `npm run gate1:env -- --env-file .env.production.local --json`.
   - Remote names pass `npm run gate1:github-env -- --json`.
   - Apply flow uses `npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json` without printing secrets.

2. Live EC2 deploy rehearsal: complete.
   - `AWS CI Deploy` builds the API image, copies it to EC2, loads Docker, and restarts `thai-meet-api`.
   - Public health is available at `http://15.164.219.139/health`.
   - EC2 operational steps live in `docs/dev/EC2_OPERATIONS.md`.

Next execution order:

1. Domain and HTTPS hardening.
   - Point a real domain or subdomain at the EC2 public IP.
   - Add TLS with Certbot or an AWS-managed TLS path.
   - Replace public-IP callback/config URLs with HTTPS domain URLs.

2. Store-track packaging.
   - Run `flutter build appbundle --release`.
   - Upload through internal testing first.
   - Add iOS signing only on a macOS-capable path.
