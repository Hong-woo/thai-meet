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

The API now reserves the Cognito callback route, but token exchange is not implemented yet. Keep this out of public production traffic until `TM_API_AUTH_CALLBACK_NOT_IMPLEMENTED` is replaced by a real token exchange flow.

Cognito callback shape:

```text
https://15-164-219-139.sslip.io/auth/callback/cognito
```

## LINE

Current configured values:

- Channel ID: `2010515307`
- Channel secret: stored only in local/protected environments

The API now reserves the LINE webhook route, but signature verification and event handling are not implemented yet. Keep this out of public production traffic until `TM_API_LINE_WEBHOOK_NOT_IMPLEMENTED` is replaced by real verification and idempotent event handling.

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

The provider routes are reserved fail-closed routes. They expose stable paths, but provider token exchange, LINE signature verification, and event handling are still pending.

## Next Implementation Step

Before provider console callback URLs can be used in public production, implement and contract-test:

1. Cognito token exchange and session binding behind `GET /auth/callback/cognito`.
2. LINE signature verification and idempotent event handling behind `POST /webhooks/line`.
3. Optional later: `GET /auth/callback/line`

After a real domain exists, replace every `sslip.io` URL in provider settings with the final HTTPS domain.
