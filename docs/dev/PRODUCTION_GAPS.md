# Production Readiness

Gate 0 production readiness blockers are closed.

Closed Gate 0 blockers:

- Real auth/provider/storage integrations: closed by `apps/api/src/production-integrations.mjs`.
- Production backend persistence: closed by database mode contract, `DATABASE_URL` validation, and `GATE1_PERSISTENCE.md`.
- AWS CI/deploy pipeline: closed by `.github/workflows/aws-ci-deploy.yml` and the EC2 operations runbook in `docs/dev/EC2_OPERATIONS.md`.
- Formal Figma/DESIGN.md source of truth: closed by `DESIGN.md`.
- App store/release build signing: closed by `docs/dev/RELEASE_SIGNING.md` and Android `releaseSigning`.

Current allowed scope:

- Keep Gate 0 mock-first and locally executable.
- Keep raw external contact values out of chat messages, logs, screenshots, and generated artifacts.
- Keep Android physical-device smoke manual until CI has a device strategy.

Operational follow-up:

1. Inject real provider, AWS, signing, and database secrets only in protected environments.
2. Keep provider-review and public production usage on `https://www.thai-meet.com`; do not use the legacy `sslip.io` endpoint.
3. Run `npm run production:check` before release builds or deploys.
4. Keep raw external contact values out of chat messages, logs, screenshots, and generated artifacts.
5. Keep Android physical-device smoke manual until CI has a remote device strategy.
