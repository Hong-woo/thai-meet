# EC2 Operations

Gate 1 production runtime currently runs on one AWS Free Tier EC2 instance, backed by RDS PostgreSQL, S3, Cognito, and LINE production credentials.

## Current Production Endpoint

- Production HTTPS health URL: `https://www.thai-meet.com/health`
- HTTP redirects to HTTPS: `http://www.thai-meet.com/health`
- Raw public IP health URL: `http://15.164.219.139/health`
- Runtime mode: `AUTH_MODE=production`, `PERSISTENCE_MODE=database`, `LINE_WEBHOOK_EVENT_STORE_MODE=database`
- EC2 app directory: `/opt/thai-meet`
- systemd service: `thai-meet-api`
- Container image tag used by service: `thai-meet-api:latest`
- Nginx proxy: port `80` to `127.0.0.1:3000`
- TLS certificate: Let's Encrypt for `www.thai-meet.com`
- TLS renewal: `certbot-renew.timer`

## GitHub Production Environment

Gate 1 deploy requires these protected GitHub `production` environment names:

- Variables: `AUTH_MODE`, `AUTH_PROVIDER_JWKS_URL`, `AUTH_PROVIDER_ISSUER`, `AUTH_PROVIDER_AUDIENCE`
- Variables: `LINE_PROVIDER_MODE`, `LINE_CHANNEL_ID`, `OBJECT_STORAGE_MODE`, `AWS_REGION`, `S3_BUCKET_PUBLIC_ASSETS`, `PERSISTENCE_MODE`, `LINE_WEBHOOK_EVENT_STORE_MODE`
- Variables: `EC2_HOST`, `EC2_USER`, `EC2_APP_DIR`, `EC2_SERVICE_NAME`
- Variables: `THAI_MEET_UPLOAD_KEYSTORE`, `THAI_MEET_UPLOAD_KEY_ALIAS`
- Secrets: `LINE_CHANNEL_SECRET`, `DATABASE_URL`, `EC2_SSH_PRIVATE_KEY_B64`
- Secrets: `THAI_MEET_UPLOAD_KEYSTORE_PASSWORD`, `THAI_MEET_UPLOAD_KEY_PASSWORD`

Check local production-value readiness:

```powershell
npm run gate1:env -- --env-file .env.production.local --json
```

Apply local values to the protected GitHub environment without printing secrets:

```powershell
npm run gate1:github-env:apply -- --env-file .env.production.local --apply --json
npm run gate1:github-env -- --json
```

## EC2 Bootstrap

The EC2 host must have Docker, Nginx, the runtime env file, and a systemd unit before `AWS CI Deploy` can restart the API.

```bash
sudo dnf install -y docker nginx
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
sudo mkdir -p /opt/thai-meet
```

`/opt/thai-meet/runtime.env` must exist and be readable by root only:

```bash
sudo chown root:root /opt/thai-meet/runtime.env
sudo chmod 600 /opt/thai-meet/runtime.env
```

For RDS PostgreSQL runtime access, `DATABASE_URL` in `runtime.env` must include `sslmode=require&uselibpqcompat=true`. Keep `LINE_WEBHOOK_EVENT_STORE_MODE=database` only after the `LineWebhookEvent` migration is applied and Prisma runtime is present in the API image.

`/etc/systemd/system/thai-meet-api.service`:

```ini
[Unit]
Description=Thai Meet API
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=5
EnvironmentFile=/opt/thai-meet/runtime.env
ExecStartPre=-/usr/bin/docker rm -f thai-meet-api
ExecStart=/usr/bin/docker run --rm --name thai-meet-api --env-file /opt/thai-meet/runtime.env -p 3000:3000 thai-meet-api:latest
ExecStop=/usr/bin/docker stop thai-meet-api

[Install]
WantedBy=multi-user.target
```

Nginx should proxy HTTP traffic to the API. Certbot then adds the HTTPS server and HTTP-to-HTTPS redirect.

```nginx
server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Reload services:

```bash
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl daemon-reload
sudo systemctl enable thai-meet-api
```

The legacy EC2 public-IP `sslip.io` hostname can be used only for emergency rehearsal. Production should use `www.thai-meet.com`.

```bash
sudo certbot --nginx -d www.thai-meet.com --non-interactive --agree-tos --email <email> --redirect
sudo systemctl enable --now certbot-renew.timer
sudo certbot renew --dry-run
```

## Deploy

Manual rehearsal:

```powershell
npm run gate1:deploy-rehearsal -- --json
```

Manual dispatch:

```powershell
gh workflow run "AWS CI Deploy" --ref main
gh run watch <run-id> --interval 15
```

The workflow builds `apps/api/Dockerfile`, packages the image with `docker save`, copies the archive to EC2, loads it, tags `thai-meet-api:latest`, and restarts `thai-meet-api`.

The API image must include production Prisma runtime dependencies and a generated Prisma client before enabling runtime database-only features such as `LINE_WEBHOOK_EVENT_STORE_MODE=database`.

## Verify

EC2 local checks:

```bash
systemctl is-active docker
systemctl is-active nginx
systemctl is-active thai-meet-api
docker ps --filter name=thai-meet-api
curl -fsS http://127.0.0.1/health
```

Public checks:

```powershell
Invoke-RestMethod -Uri "http://15.164.219.139/health"
Invoke-RestMethod -Uri "https://www.thai-meet.com/health"
npm run gate1:domain -- --domain www.thai-meet.com --expected-ip 15.164.219.139 --json
npm run gate1:public-smoke -- --base-url https://www.thai-meet.com --env-file .env.production.local --json
```

`gate1:public-smoke` verifies public health, Cognito callback fail-closed behavior, and signed LINE webhook idempotency without printing provider secrets or raw webhook payloads.

## Next Hardening

The `www.thai-meet.com` hostname is now the production HTTPS endpoint. Keep the EC2 public IP and legacy `sslip.io` hostname out of provider-review settings and app-facing docs. Next infrastructure hardening is:

1. Keep inbound ports `80` and `443` open only where needed.
2. Keep TLS renewal healthy with `certbot-renew.timer`.
3. Keep provider callback/config URLs on HTTPS `www.thai-meet.com`.
4. Remove legacy `sslip.io` references after all provider consoles are updated.

Regenerate the exact cutover checklist if the production domain changes:

```powershell
npm run gate1:domain:plan -- --domain www.thai-meet.com --certbot-email <email> --json
```

Run DNS/HTTPS preflight:

```powershell
npm run gate1:domain -- --domain www.thai-meet.com --expected-ip 15.164.219.139 --json
```

Then run the signed public smoke against the final URL:

```powershell
npm run gate1:public-smoke -- --base-url https://www.thai-meet.com --env-file .env.production.local --json
```
