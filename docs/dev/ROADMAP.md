# Roadmap

Gate 0 completion state:

Gate 0 now includes local vertical slice, production readiness contract, AWS CI/deploy workflow, DESIGN.md source, and Android release signing scaffold.

Next execution order:

1. Secret injection and environment provisioning.
   - Configure protected GitHub environment secrets.
   - Provide production `DATABASE_URL`, provider credentials, S3 bucket, and Android upload keystore.
   - Run `npm run gate1:env -- --env-file .env.production.local --json` before uploading values.
   - Run `npm run gate1:env -- --json` to verify required key presence without printing secret values.
   - Run `npm run gate1:github-env -- --json` to verify remote GitHub `production` secret and variable names.
   - Run `npm run gate1:github-env -- --plan` to generate placeholder `gh variable set`/`gh secret set` commands for missing names.

2. Live deploy rehearsal.
   - Run `npm run gate1:deploy-rehearsal -- --plan`.
   - Run `AWS CI Deploy` manually.
   - Verify ECR push, ECS service stability, and rollback path.

3. Store-track packaging.
   - Run `flutter build appbundle --release`.
   - Upload through internal testing first.
   - Add iOS signing only on a macOS-capable path.
