# Provider Console Settings

Current production base URL:

```text
https://www.thai-meet.com
```

Public health check:

```text
https://www.thai-meet.com/health
```

This URL uses the Thai Meet production domain. Do not use the legacy `sslip.io` hostname in provider-review settings, app store metadata, or public launch materials.

## Cognito

Current configured values:

- Region: `ap-northeast-2`
- User pool ID: `ap-northeast-2_2q4x5HDnO`
- App client ID: `582lqcvt9hs02433o2sppjr84m`
- Issuer: `https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_2q4x5HDnO`
- JWKS URL: `https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_2q4x5HDnO/.well-known/jwks.json`
- Token endpoint: discovered from OpenID configuration as `https://ap-northeast-22q4x5hdno.auth.ap-northeast-2.amazoncognito.com/oauth2/token`

The API discovers the Cognito token endpoint from the provider OpenID configuration, exchanges authorization codes there, returns only a safe authenticated summary, and binds the result to an HTTP-only `tm_session` cookie. It does not print raw provider tokens.

Cognito callback shape:

```text
https://www.thai-meet.com/auth/callback/cognito
```

## LINE

Current configured values:

- Channel ID: `2010515307`
- Channel secret: stored only in local/protected environments

The API now verifies the LINE webhook signature with `LINE_CHANNEL_SECRET` and counts duplicate `webhookEventId` values. Default runtime mode is in-memory no-op counting. Persisted handling stores only hashed event keys and safe metadata when `LINE_WEBHOOK_EVENT_STORE_MODE=database` is enabled after the `LineWebhookEvent` migration exists in the target database.

LINE webhook shape:

```text
https://www.thai-meet.com/webhooks/line
```

If LINE Login is added later, use a separate LINE Login channel and implement the callback route before filling console values.

Future expected LINE Login callback shape:

```text
https://www.thai-meet.com/auth/callback/line
```

## Current Implemented Public Routes

These routes are live today:

- `GET /health`
- `GET /auth/callback/cognito`
- `POST /webhooks/line`
- `GET /openapi.json`
- `GET /fixtures/gate0`
- `GET /api/v1/public-identities/me`
- `GET /api/v1/discover/profiles`
- `GET /api/v1/chats/rooms/{roomId}`
- `POST /api/v1/chats/rooms/{roomId}/contact-exchanges/line`
- `POST /api/v1/safety/reports`
- `POST /api/v1/safety/blocks`

The provider routes expose stable paths. Cognito exchanges authorization codes and fails closed when provider configuration or token exchange fails. LINE verifies signatures and accepts verified payloads with idempotent counting; database-backed event-key persistence is gated by `LINE_WEBHOOK_EVENT_STORE_MODE=database`.

## Next Implementation Step

Before provider console callback URLs can be used in public production, verify:

1. Cognito hosted UI callback URL is set to the final HTTPS domain route.
2. Apply the `LineWebhookEvent` migration to the production database, then enable `LINE_WEBHOOK_EVENT_STORE_MODE=database`.
3. Optional later: `GET /auth/callback/line`

Provider settings should use only the final HTTPS domain.

Run the domain preflight before editing provider consoles:

```bash
npm run gate1:domain -- --domain www.thai-meet.com --expected-ip 15.164.219.139 --json
```

Then run the full public smoke against that domain:

```bash
npm run gate1:public-smoke -- --base-url https://www.thai-meet.com --env-file .env.production.local --json
```
