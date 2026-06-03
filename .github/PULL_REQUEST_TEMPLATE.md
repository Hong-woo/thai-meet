## Summary

-

## Gate 0 Checks

- [ ] `npm test`
- [ ] `git diff --check`
- [ ] `npm run env:check`
- [ ] `npm run errors:check`
- [ ] `npm run db:check`
- [ ] `npm run flags:check`
- [ ] `npm run rewards:check`
- [ ] `npm run privacy:test`
- [ ] Generated contract artifacts are fresh
- [ ] Smoke metrics reviewed, or not relevant
- [ ] `pnpm smoke` or noted why full smoke was not run

## Contract And Safety

- [ ] OpenAPI and generated Dart client are fresh, or unchanged
- [ ] Mobile route contract is fresh, or unchanged
- [ ] ContactExchange remains a permission object
- [ ] ContactExchange errors use stable envelope codes
- [ ] Chat messages do not contain raw LINE/Facebook/contact values
- [ ] PublicIdentity and ChatRoom participant snapshot assumptions still hold
- [ ] DB constraints/index assumptions still hold, or docs updated
- [ ] Gate 0 feature flag defaults still hide Facebook/rewards/ads/admin
- [ ] Reward ledger/idempotency assumptions still hold, or docs updated
- [ ] Report/block path remains reachable for contact-sharing flows

## Docs

- [ ] `README.md` or `docs/dev/` updated, or not needed
- [ ] `docs/dev/CHANGELOG.md` updated for contract, route, smoke, DB, generated client, or safety-sensitive changes
- [ ] Migration note added under `docs/dev/migrations/`, or not needed
- [ ] Contract Drift Gate CI passes on Ubuntu and Windows

## Notes

-
