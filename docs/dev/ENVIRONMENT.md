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
Docker: Docker Desktop running for full smoke
Browser: Chrome or Edge on PATH for Flutter web smoke
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

Rules:

- Do not commit real provider secrets or raw contact values.
- Do not require real provider credentials for `npm test`, `npm run smoke:doctor`, or the first prepared-machine `pnpm smoke`.
- Keep `.env.example` safe to paste into local `.env`.
- Add new provider, ad, push, or storage defaults here before adding real integration code.
