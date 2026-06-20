# Environment

Gate 0 local development is mock-first. A new developer must be able to run the scaffold without real LINE, Facebook, AdMob, FCM, object storage, or production secrets.

Check the local environment matrix:

```powershell
npm run env:check
```

Check Gate 1 production environment provisioning before live deploy rehearsal:

```powershell
copy .env.production.local.example .env.production.local
npm run gate1:env -- --env-file .env.production.local --json
npm run gate1:env -- --json
npm run gate1:github-env -- --json
npm run gate1:github-env -- --plan
npm run gate1:github-env:apply -- --env-file .env.production.local --plan
```

Fill `.env.production.local` locally only. It is ignored by Git, while `.env.production.local.example` stays safe to commit. These preflights report required key names, placeholder key names, and group status only. They fail closed while any `replace-with-` placeholder remains. They must not print `DATABASE_URL`, provider secrets, keystore passwords, raw contact values, provider tokens, or GitHub variable values.

Pinned toolchain:

```text
Node: >=22
pnpm: 10.0.0
Flutter: stable for full smoke
Docker: CLI installed for scaffold doctor; daemon required later when infra boot is enabled
Browser: optional until Flutter web smoke is enabled
```

Local defaults in `.env.example`:

| Key | Local default | Notes |
| --- | --- | --- |
| `AUTH_MODE` | `mock` | Mock login for Gate 0 Trust Loop. |
| `CONTACT_PROVIDER_LINE_ENABLED` | `true` | LINE is the Gate 0 visible provider. |
| `CONTACT_PROVIDER_FACEBOOK_ENABLED` | `false` | Facebook remains schema-supported but UI-hidden. |
| `LINE_PROVIDER_MODE` | `mock` | No real LINE credential for local smoke. |
| `FACEBOOK_PROVIDER_MODE` | `mock` | No real Facebook credential for local smoke. |
| `ADMOB_MODE` | `mock` | No ad key required for smoke. |
| `FCM_MODE` | `mock` | No push credential required for smoke. |
| `OBJECT_STORAGE_MODE` | `local` | Local/mock upload path for smoke. |
| `PERSISTENCE_MODE` | `fixture` | Trimmed before selection. Fixture-backed API reads remain the default until Gate 1 database read parity passes. |
| `DATABASE_URL` | unset | Required for Gate 1 `db:migrate` and database persistence only. `npm run db:check -- --field databaseUrlPresent` reports whether it is set without printing the URL. |

Rules:

- Do not commit real provider secrets or raw contact values.
- Do not require real provider credentials for `npm test`, `npm run smoke:doctor`, or the first prepared-machine `pnpm smoke`.
- Keep `.env.example` safe to paste into local `.env`.
- Keep `.env.production.local.example` placeholder-only and safe to commit.
- Add new provider, ad, push, or storage defaults here before adding real integration code.
- Keep fixture persistence available so prepared-machine smoke can run without a database.
- Use `npm run gate1:env:test` when changing production secret requirements so the preflight remains keys-only.
- Use `npm run gate1:github-env:test` when changing protected GitHub environment requirements so remote inventory remains names-only and points to the stdin-only apply flow.
- Use `npm run gate1:github-env:apply:test` when changing GitHub environment upload behavior so values stay stdin-only and mode flags stay unambiguous.
