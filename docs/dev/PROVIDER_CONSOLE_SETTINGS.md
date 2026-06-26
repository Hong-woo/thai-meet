# Provider Console Settings

Current temporary production base URL:

```text
https://15-164-219-139.sslip.io
```

Public health check:

```text
https://15-164-219-139.sslip.io/health
```

This URL uses temporary `sslip.io` DNS for the EC2 public IP. It is valid for smoke and provider-console setup rehearsal, but it should be replaced by a real Thai Meet domain before provider review, app store review, or public launch.

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
https://15-164-219-139.sslip.io/auth/callback/cognito
```

## LINE

Current configured values:

- Channel ID: `2010515307`
- Channel secret: stored only in local/protected environments

The API now verifies the LINE webhook signature with `LINE_CHANNEL_SECRET` and counts duplicate `webhookEventId` values. Default runtime mode is in-memory no-op counting. Persisted handling stores only hashed event keys and safe metadata when `LINE_WEBHOOK_EVENT_STORE_MODE=database` is enabled after the `LineWebhookEvent` migration exists in the target database.

LINE webhook shape:

```text
https://15-164-219-139.sslip.io/webhooks/line
```

If LINE Login is added later, use a separate LINE Login channel and implement the callback route before filling console values.

Future expected LINE Login callback shape:

```text
https://<real-domain>/auth/callback/line
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

After a real domain exists, replace every `sslip.io` URL in provider settings with the final HTTPS domain.
