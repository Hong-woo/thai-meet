# Reward Ledger

Gate 0 keeps rewarded ads and reward UI hidden, but the future reward boundary is defined now so AdMob callbacks, admin grants, and optional free unlocks do not become mutable counters.

Run the scaffold check:

```powershell
npm run rewards:check
```

## Gate Policy

- Gate 0: reward UI hidden and `REWARDED_ADS_ENABLED=false`.
- Gate 1: reward ledger may be exercised by admin/manual grant tooling only if needed.
- Gate 2: AdMob rewarded ads may grant rewards after trust metrics and support load are healthy.

## Ledger Rules

- RewardLedger is append-only.
- Reward grant events require an `idempotencyKey`.
- Duplicate AdMob callbacks must resolve to the original RewardLedger row.
- Reward grant and reward consumption must be transactional and idempotent.
- RewardConsumption records every use of a ledger entry instead of mutating user counters.
- Expired rewards cannot be consumed.
- Reward events must not contain provider tokens, ad keys, push keys, or raw external contact values.

## Supported Reward Types

- `EXTRA_MESSAGE`
- `EXTRA_LINE_SHARE`
- `EXTRA_FACEBOOK_SHARE`
- `BOOST`

Future visitor/list unlocks should be added as new reward types with migration notes and tests.

## Fixture

The scaffold fixture lives at:

```text
packages/api-contracts/fixtures/reward-ledger.json
```

The fixture proves that Gate 0 rewards are disabled while the ledger policy, supported reward types, idempotency boundary, duplicate callback behavior, and consumption shape are already documented.
