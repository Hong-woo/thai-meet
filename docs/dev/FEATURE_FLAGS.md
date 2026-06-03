# Feature Flags

Feature flags protect Gate 0 scope and keep risky behavior reversible. Mobile releases are slower to roll back than server configuration, so broad features should default off until their gate is reached.

Run the scaffold check:

```powershell
npm run flags:check
```

## Matrix

| Flag | Gate | Local default | Purpose |
| --- | ---: | --- | --- |
| `PUBLIC_ID_REGEN_ENABLED` | Gate 0 | `true` | Allow users to create a new Public Meet ID. |
| `PUBLIC_ID_ARCHIVE_ENABLED` | Gate 0 | `true` | Allow users to archive previous public identities. |
| `CONTACT_PROVIDER_LINE_ENABLED` | Gate 0 | `true` | Enable LINE setup and ContactExchange. |
| `CONTACT_PROVIDER_FACEBOOK_ENABLED` | Gate 1 | `false` | Enable Facebook only after LINE stabilizes. |
| `CONTACT_SHARE_WARNING_ONCE` | Gate 0 | `true` | Show first-share warning before external contact sharing. |
| `REQUIRE_MATCH_TO_CHAT` | Gate 0 | `false` | Keep direct chat open unless abuse requires tightening. |
| `REQUIRE_MATCH_TO_SHARE_CONTACT` | Gate 0 | `false` | Keep sharing available in chat unless abuse requires tightening. |
| `DISCOVER_NATIVE_ADS_ENABLED` | Gate 0 | `false` | Only weakly allowed ad surface; Discover-only and muted if enabled. |
| `CHAT_DETAIL_ADS_ENABLED` | Gate 2 | `false` | Must not appear in chat/contact flows. |
| `REWARDED_ADS_ENABLED` | Gate 2 | `false` | Enable only after trust metrics and support load are healthy. |
| `STRICT_MODERATION_ENABLED` | Gate 1 | `false` | Keep low-friction safety posture until abuse patterns require stricter checks. |
| `ADMIN_WEB_ENABLED` | Gate 1 | `false` | Admin web is not part of Gate 0 user-facing scope. |
| `AUTO_HIDE_REPORTED_PROFILE_THRESHOLD` | Gate 1 | `5` | Hide profiles after repeated reports. |
| `AUTO_SUSPEND_REPORT_THRESHOLD` | Gate 1 | `10` | Suspend accounts after stronger repeated report signals. |

## Rollout Sequence

1. Apply backward-compatible DB migrations with risky features defaulted off.
2. Deploy backend services and admin/audit visibility.
3. Verify audit events and dashboards in staging.
4. Ship mobile internal alpha build.
5. Enable Gate 0 flags for internal testers.
6. Enable Gate 0 flags for invited alpha users in one launch city.
7. Enable Gate 1 Facebook only after LINE contact setup, share, open, report, and block flows are stable.
8. Enable Gate 2 rewarded ads only after trust metrics are healthy and support load is manageable.

## Rollback Posture

- Disable provider flags to stop new contact exchanges without deleting existing history.
- Disable Public ID regeneration if abuse spikes, while keeping existing identities readable.
- Disable rewarded ads without deleting reward ledger history.
- Keep admin/audit access independent from user-facing feature flags.

## Gate 0 UI Rules

- Gate 0 UI is LINE-first.
- Facebook Contact Card routes are hidden until Gate 1.
- Rewarded ads, chat-detail ads, and admin routes are hidden until later gates.
- Discover Native Ads are the only weakly allowed Gate 0 ad surface and default off locally.
