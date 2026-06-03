# DX Metrics

Gate 0 tracks local smoke results so recurring setup failures and slow paths are visible.

Result files:

```text
.thai-meet/smoke-runs/*.json
```

Summarize local runs:

```powershell
npm run smoke:metrics
```

Create a new result without requiring full Flutter/Docker success:

```powershell
npm run smoke:doctor
```

Result schema fields:

- `schemaVersion`
- `startedAt`
- `durationMs`
- `status`
- `failedStage`
- `runTemperature`
- `retryCount`
- `command`
- `os`
- `runtime`
- `nodeMajor`
- `pnpmMajor`
- `flutterChannel`
- `stages`

Measurement boundary:

- Count Thai Meet TTHW from clone to `pnpm install` to `pnpm smoke` passing.
- Track first-time Node, Flutter, Docker, browser, and Docker Desktop installation outside Thai Meet TTHW.
- Keep cold and warm run types explicit.

CI uploads smoke doctor JSON as an artifact from `.thai-meet/smoke-runs/*.json`. Full smoke remains manual until Flutter, browser, and Docker prerequisites are intentionally provisioned in CI.

Scaffold smoke treats `infra` as skipped until Docker Compose service boot is implemented. The `api` stage must start the local scaffold API on an ephemeral port and verify health, OpenAPI, and fixture endpoints before it can pass.
