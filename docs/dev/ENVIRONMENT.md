# Environment

Gate 0 local development is mock-first. A new developer must be able to run the scaffold without real LINE, Facebook, AdMob, FCM, object storage, or production secrets.

Check the local environment matrix:

```powershell
npm run env:check
```

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
| `PERSISTENCE_MODE` | `fixture` | Trimmed before selection. Fixture-backed storage remains the only supported local mode until Gate 1 database checks pass. |
| `DATABASE_URL` | unset | Required for Gate 1 database persistence only. `npm run db:check -- --field databaseUrlPresent` reports whether it is set. |

Rules:

- Do not commit real provider secrets or raw contact values.
- Do not require real provider credentials for `npm test`, `npm run smoke:doctor`, or the first prepared-machine `pnpm smoke`.
- Keep `.env.example` safe to paste into local `.env`.
- Add new provider, ad, push, or storage defaults here before adding real integration code.
- Keep fixture persistence available so prepared-machine smoke can run without a database.
