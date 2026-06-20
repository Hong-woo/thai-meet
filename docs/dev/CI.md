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
- Uses `aws-actions/configure-aws-credentials` with OIDC.
- Uses `aws-actions/amazon-ecr-login`.
- Requires `AWS_REGION`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`, and `AWS_DEPLOY_ROLE_ARN` in the protected production environment as secrets or variables.
- Runs `npm run production:check` and `npm test` before image push/deploy.
- Pushes the API image to ECR and forces an ECS service deployment.
- Waits for ECS service stability before completing.
- Rehearse manual dispatch first with `npm run gate1:deploy-rehearsal -- --json` or `npm run gate1:deploy-rehearsal -- --plan`.

Manual checks:

- Android physical-device smoke remains manual because CI has no attached phone.
- The latest saved phone result can be checked locally with `npm run mobile:device:result -- --strict`.

Production deploy notes:

- RDS migration execution remains guarded by `db:check`/`db:migrate` status and must not print `DATABASE_URL`.
- Android physical-device smoke remains manual until a remote device strategy exists.
