# Gate 0 Status Command

Use this quick status command when you need a fast local summary without running the full test suite.

Human summary:

```powershell
npm run gate0:status
```

Machine-readable summary:

```powershell
npm run gate0:status -- --json
```

Single field:

```powershell
npm run gate0:status -- --field currentStatus
npm run gate0:status -- --field latestAndroidDeviceSmoke.status
npm run gate0:status -- --field persistenceModeDefault
npm run gate0:status -- --field supportedPersistenceModes
npm run gate0:status -- --field nextGateDocPath
npm run gate0:status -- --field nextGateCommand
npm run gate0:status -- --field nextGateCheckCommand
npm run gate0:status -- --field nextGateCheckJsonCommand
npm run gate0:status -- --field nextGateMigrationStatusCommand
npm run gate0:status -- --field nextGateRequiredChecksSource
npm run gate0:status -- --field nextGateRequiredChecksParsed
npm run gate0:status -- --field nextGateRequiredChecks
```

Help:

```powershell
npm run gate0:status -- --help
```

Help output includes the stable field list below.

Stable fields:

- `currentStatus`
- `progressPercent`
- `progressBasis`
- `completedLocally`
- `fullTestBaseline`
- `localApiBoundaryChecks`
- `stillNotDone`
- `relatedDocs`
- `persistenceModeDefault`
- `supportedPersistenceModes`
- `latestAndroidDeviceSmoke.status`
- `latestAndroidDeviceSmoke.runId`
- `latestAndroidDeviceSmoke.deviceManufacturer`
- `latestAndroidDeviceSmoke.deviceModel`
- `latestAndroidDeviceSmoke.androidRelease`
- `latestAndroidDeviceSmoke.androidSdk`
- `nextGate`
- `nextGateDoc`
- `nextGateDocPath`
- `nextGateCommand`
- `nextGateCheckCommand`
- `nextGateCheckJsonCommand`
- `nextGateMigrationStatusCommand`
- `nextGateRequiredChecksSource`
- `nextGateRequiredChecksParsed`
- `nextGateRequiredChecks`

Field notes:

- `nextGateCommand` returns the command that prints `nextGateDocPath`.
- `nextGateCheckCommand` returns the first Gate 1 handoff check.
- `nextGateCheckJsonCommand` returns the machine-readable Gate 1 DB matrix check.
- `nextGateMigrationStatusCommand` returns the Gate 1 migration status field.
- `nextGateRequiredChecksSource` points to the parsed `Required Checks` block.
- `nextGateRequiredChecksParsed` is true when the checks came from the Gate 1 doc.
- `nextGateRequiredChecks` is parsed from `GATE1_PERSISTENCE.md` and includes `npm` and `node` command lines from the `Required Checks` block.

Stable error codes:

- `TM_GATE0_STATUS_UNKNOWN_OPTION`
- `TM_GATE0_STATUS_OPTION_CONFLICT`
- `TM_GATE0_STATUS_FIELD_MISSING`
- `TM_GATE0_STATUS_FIELD_REQUIRED`
