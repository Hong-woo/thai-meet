# CI

Current CI gate:

- GitHub Actions workflow: `Contract Drift Gate`.
- Runs on `ubuntu-latest` and `windows-latest` with Node 24.
- Installs stable Flutter.
- Runs `npm test`.
- Runs `npm run smoke:doctor` and uploads `.thai-meet/smoke-runs/*.json`.
- Regenerates OpenAPI and Dart client artifacts, then checks generated diffs.
- Runs `git diff --check`.
- Runs `npm run production:check` through the repository test chain.

AWS CI/deploy pipeline is configured:

- GitHub Actions workflow: `AWS CI Deploy`.
- Requires `AWS_REGION`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_PRIVATE_KEY_B64`, `EC2_APP_DIR`, and `EC2_SERVICE_NAME` in the protected production environment as secrets or variables.
- Runs `npm run production:check` and `npm test` before image package/deploy.
- Builds the API Docker image, packages it with `docker save`, copies it to EC2 over SSH, loads it on the instance, and restarts the configured systemd service with `systemctl restart`.
- Runs `npm run gate1:public-smoke` against `GATE1_PUBLIC_BASE_URL` after deploy when `LINE_CHANNEL_SECRET` is available, including `/` landing HTML and branded image asset checks.
- Rehearse manual dispatch first with `npm run gate1:deploy-rehearsal -- --json` or `npm run gate1:deploy-rehearsal -- --plan`; keep deploy rehearsal output modes uncombined.
- EC2 bootstrap, runtime env, Nginx, and systemd operations are documented in `docs/dev/EC2_OPERATIONS.md`.

Manual checks:

- Android physical-device smoke remains manual because CI has no attached phone.
- The latest saved phone result can be checked locally with `npm run mobile:device:result -- --strict`.

Production deploy notes:

- RDS migration execution remains guarded by `db:check`/`db:migrate` status and must not print `DATABASE_URL`.
- Android physical-device smoke remains manual until a remote device strategy exists.
