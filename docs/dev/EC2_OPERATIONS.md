# EC2 Operations

Gate 1 production runtime currently runs on one AWS Free Tier EC2 instance, backed by RDS PostgreSQL, S3, Cognito, and LINE production credentials.

## Current Production Endpoint

- Public health URL: `http://15.164.219.139/health`
- Runtime mode: `AUTH_MODE=production`, `PERSISTENCE_MODE=database`
- EC2 app directory: `/opt/thai-meet`
- systemd service: `thai-meet-api`
- Container image tag used by service: `thai-meet-api:latest`
- Nginx proxy: port `80` to `127.0.0.1:3000`

## GitHub Production Environment

Gate 1 deploy requires these protected GitHub `production` environment names:

- Variables: `AUTH_MODE`, `AUTH_PROVIDER_JWKS_URL`, `AUTH_PROVIDER_ISSUER`, `AUTH_PROVIDER_AUDIENCE`
- Variables: `LINE_PROVIDER_MODE`, `LINE_CHANNEL_ID`, `OBJECT_STORAGE_MODE`, `AWS_REGION`, `S3_BUCKET_PUBLIC_ASSETS`, `PERSISTENCE_MODE`
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

Nginx should proxy HTTP traffic to the API:

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

## Verify

EC2 local checks:

```bash
systemctl is-active docker
systemctl is-active nginx
systemctl is-active thai-meet-api
docker ps --filter name=thai-meet-api
curl -fsS http://127.0.0.1/health
```

Public check:

```powershell
Invoke-RestMethod -Uri "http://15.164.219.139/health"
```

## Next Hardening

HTTP on a public IP is not enough for production sign-in callbacks, mobile release, or provider review. Next infrastructure step is:

1. Point a real domain or subdomain at the EC2 public IP.
2. Open inbound ports `80` and `443` only where needed.
3. Install Certbot or use an AWS-managed TLS path.
4. Replace public IP URLs in provider callback/config values with HTTPS domain URLs.
