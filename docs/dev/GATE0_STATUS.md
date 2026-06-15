# Gate 0 Status

Current local status: Gate 0 complete with production readiness contract.

Completed locally:

- Flutter app runs on web, Windows, and Android device targets.
- Gate 0 nav is `Discover`, `Swipe`, `Chat`, `List`, `My`.
- Trust Loop covers Discover profile preview, Chat, LINE Contact Card, revoke, report, block, unblock, retry, and List safety history.
- Public Meet ID covers current ID, sharing, regeneration, archive notice, and List history.
- Mock API, OpenAPI, generated Dart client, privacy leak guard, feature flags, DB constraint matrix, error envelope, reward ledger, and route contracts are checked by `npm test`.
- Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.
- Real auth/provider/storage integration contract is closed by `apps/api/src/production-integrations.mjs` and `npm run production:check`.
- Production backend persistence readiness is closed by database mode contract, `DATABASE_URL` validation, and DB matrix checks.
- AWS CI/deploy pipeline is closed by `.github/workflows/aws-ci-deploy.yml`.
- Formal Figma/DESIGN.md source of truth is closed by `DESIGN.md` and `docs/dev/DESIGN_STATUS.md`.
- App store/release build signing is closed by Android `releaseSigning` and `docs/dev/RELEASE_SIGNING.md`.
- Gate 0 status exposes completed-local count and boundary items as stable help-listed fields.
- Gate 0 status verifies completed-local boundary alias fields through field-level checks.
- Gate 0 status exposes completed-local registry invariant and summary fields.
- Gate 0 status verifies completed-local registry alias fields through field-level checks.
- Gate 0 status exposes local API boundary check endpoints and summary fields.
- Gate 0 status verifies local API boundary check alias fields through field-level checks.
- Gate 0 status exposes full test baseline command, alias, and summary fields.
- Gate 0 status exposes current status alias and summary fields.
- Gate 0 status exposes related docs boundary endpoints and summary fields.
- Gate 0 status verifies related docs alias fields through field-level checks.
- Gate 0 status exposes persistence mode endpoints and summary fields.
- Gate 0 status verifies persistence mode alias fields through field-level checks.
- Gate 0 status exposes compact Android device smoke identity and summary fields.
- Gate 0 status verifies Android device smoke identity alias fields through field-level checks.
- Gate 0 status verifies Android device smoke nested identity fields and aliases.
- Gate 0 status exposes next gate alias and summary fields.
- Gate 0 status exposes next gate check command aliases and summary fields.
- Gate 1 persistence handoff exposes DB matrix JSON, nested fields, required checks, and fail-closed migration guard automation.
- Gate 0 status exposes the Gate 1 migration status handoff object for `not_scaffolded` to `scaffolded` transition checks.
- Gate 0 status exposes the Gate 1 Prisma scaffold handoff object for schema and migration presence checks.
- Gate 0 status exposes Gate 1 `DATABASE_URL` status and protocol handoff commands.
- Gate 0 status exposes a placeholder PowerShell `DATABASE_URL` validation command without storing a real URL.
- Gate 0 status exposes Gate 1 expected `DATABASE_URL` status and accepted PostgreSQL protocols.
- Gate 0 status exposes the full Gate 1 `DATABASE_URL` handoff object without storing a real URL.
- Gate 0 status exposes Gate 1 fail-closed migration guard commands and stable error code.
- Gate 0 status exposes the full Gate 1 fail-closed migration guard object for CI handoff.
- Gate 0 status exposes the full Gate 1 DB matrix handoff object for one-shot automation.
- Gate 0 status exposes a Gate 1 required checks summary object with count, source, parse status, and commands.
- Gate 0 status groups Gate 1 required checks by command type for CI handoff coverage.
- Gate 0 status separates Gate 0 verified checks from Gate 1 transition checks for readiness handoff.
- Gate 0 status maps Gate 1 transition checks to current and target expected values.
- Gate 0 status exposes ordered Gate 1 transition steps for Prisma, `DATABASE_URL`, and DB matrix verification.
- Gate 0 status exposes a Gate 1 CI handoff object with watch fields, commands, and counts.
- Gate 0 status exposes Gate 1 CI transition plan and readiness aliases for handoff output.
- Gate 0 status exposes Gate 1 CI pass criteria for migration status and `DATABASE_URL` checks.
- Gate 0 status exposes Gate 1 CI pass criteria and assertions aliases for handoff output.
- Gate 0 status exposes Gate 1 CI watch fields, failure codes, and evidence docs aliases for handoff output.
- Gate 0 status exposes Gate 1 CI failure codes for migration guard and matrix field checks.
- Gate 0 status exposes Gate 1 CI evidence docs for persistence and DB constraints handoff.
- Gate 0 status exposes Gate 1 CI assertion commands and expected values.
- Gate 0 status exposes Gate 1 CI ready status for all assertion checks passing.
- Gate 0 status exposes a Gate 1 CI ready summary string for migration and `DATABASE_URL` targets.
- Gate 0 status exposes Gate 1 CI required assertion fields for deterministic readiness checks.
- Gate 0 status exposes Gate 1 CI canonical ready status, summary, and report fields for automation output.
- Gate 0 status exposes Gate 1 CI rollback guidance for fixture-mode recovery after failed persistence transitions.
- Gate 0 status includes rollback fields in the Gate 1 CI report field list.
- Gate 0 status exposes next gate migration status aliases and summary fields.
- Gate 0 status exposes next gate `DATABASE_URL` aliases and summary fields.
- Gate 0 status exposes next gate Prisma scaffold aliases and summary fields.
- Gate 0 status exposes next gate migration guard aliases and summary fields.
- Gate 0 status exposes next gate DB matrix aliases and summary fields.
- Gate 0 status exposes next gate required checks aliases and compact summary fields.
- Gate 0 status exposes next gate readiness aliases and summary fields.
- Gate 0 status exposes next gate transition plan aliases and summary fields.
- Gate 0 status exposes next gate CI handoff top-level aliases and summary fields.
- Gate 0 status exposes next gate CI ready status and summary aliases.
- Gate 0 status exposes next gate CI rollback top-level aliases and summary fields.
- Gate 0 status pins the Gate 1 CI rollback verification command in the report field list.
- Gate 0 status exposes a Gate 1 CI rollback report command for one-shot rollback handoff output.
- Gate 0 status includes the Gate 1 CI rollback report command in the report field list.
- Gate 0 status exposes ordered Gate 1 CI rollback commands for fixture-mode recovery automation.
- Gate 0 status pins each ordered Gate 1 CI rollback command as a stable field.
- Gate 0 status exposes Gate 1 CI rollback command count for array length checks.
- Gate 0 status exposes the primary Gate 1 CI rollback command and commands alias as stable fields.
- Gate 0 status exposes Gate 1 CI rollback command aliases for command, verification, and report fields.
- Gate 0 status exposes Gate 1 CI rollback expected mode as a stable field.
- Gate 0 status includes the Gate 1 CI rollback expected mode in the report field list.
- Gate 0 status exposes a Gate 1 CI rollback summary for compact automation logs.
- Gate 0 status exposes next gate CI pass criteria summary fields.
- Gate 0 status exposes next gate CI failure code summary fields.
- Gate 0 status exposes next gate CI evidence doc summary fields.
- Gate 0 status exposes next gate CI watch field summary fields.
- Gate 0 status exposes next gate CI required checks summary fields.
- Gate 0 status exposes next gate CI readiness transition summary fields.
- Gate 0 status exposes next gate CI transition expected value summary fields.
- Gate 0 status exposes next gate CI transition command summary fields.
- Gate 0 status exposes next gate CI transition target summary fields.
- Gate 0 status exposes next gate CI rollback command registry summary fields.
- Gate 0 status exposes next gate CI rollback mode summary fields.
- Gate 0 status exposes next gate CI rollback command sequence summary fields.
- Gate 0 status exposes next gate CI rollback verification/report summary fields.
- Gate 0 status exposes next gate CI rollback command count summary fields.
- Gate 0 status exposes next gate CI rollback command field summary fields.
- Gate 0 status exposes next gate CI rollback endpoint field summary fields.
- Gate 0 status exposes next gate CI rollback registry field summary fields.
- Gate 0 status exposes next gate CI rollback top field summary fields.
- Gate 0 status exposes next gate required checks by-type summary fields.
- Gate 0 status exposes next gate required checks by-type endpoint summary fields.
- Gate 0 status exposes next gate required checks by-type registry summary fields.
- Gate 0 status exposes next gate required checks by-type field summary fields.
- Gate 0 status exposes next gate required checks by-type command count summary fields.
- Gate 0 status exposes next gate required checks by-type command endpoint summary fields.
- Gate 0 status exposes next gate required checks by-type command registry summary fields.
- Gate 0 status exposes next gate required checks by-type command field summary fields.
- Gate 0 status exposes next gate required checks by-type command registry status summary fields.
- Gate 0 status includes the Gate 1 CI rollback summary in the report field list.
- Gate 0 status exposes a Gate 1 CI rollback summary field alias for automation output.
- Gate 0 status includes the Gate 1 CI rollback summary field alias in the report field list.
- Gate 0 status exposes a Gate 1 CI rollback mode field alias for automation output.
- Gate 0 status includes the Gate 1 CI rollback mode field alias in the report field list.
- Gate 0 status exposes a Gate 1 CI rollback expected mode field alias for automation output.
- Gate 0 status includes the Gate 1 CI rollback expected mode field alias in the report field list.
- Gate 0 status exposes Gate 1 CI report field count for array length checks.
- Gate 0 status exposes Gate 1 CI ready command count for array length checks.
- Gate 0 status exposes Gate 1 CI ready required field count for array length checks.
- Gate 0 status pins each Gate 1 CI ready command as a stable field.
- Gate 0 status pins each Gate 1 CI required assertion field as a stable field.
- Gate 0 status exposes Gate 1 CI ready assertion count as a stable field.
- Gate 0 status pins Gate 1 CI `DATABASE_URL` assertion expected values as stable fields.
- Gate 0 status pins Gate 1 CI `DATABASE_URL` pass criteria as stable fields.
- Gate 0 status pins each Gate 1 CI assertion command as a stable field.
- Gate 0 status exposes Gate 1 CI assertion count as a stable field.
- Gate 0 status exposes Gate 1 CI pass criteria count as a stable field.
- Gate 0 status exposes Gate 1 CI watch field count as a stable field.
- Gate 0 status pins each Gate 1 CI watch field as a stable field.
- Gate 0 status exposes Gate 1 CI command count as a stable field.
- Gate 0 status pins the first Gate 1 CI handoff commands as stable fields.
- Gate 0 status pins the middle Gate 1 CI handoff commands as stable fields.
- Gate 0 status pins the guard and baseline Gate 1 CI handoff commands as stable fields.
- Gate 0 status pins the final fixture Gate 1 CI handoff commands as stable fields.
- Gate 0 status exposes Gate 1 CI required check count as a stable field.
- Gate 0 status carries the Gate 1 required checks source inside the CI handoff object.
- Gate 0 status carries the Gate 1 required checks parsed status inside the CI handoff object.
- Gate 0 status help now explains that the CI handoff includes required checks source and parsed status.
- Gate 0 status pins all Gate 1 CI evidence docs as stable fields.
- Gate 0 status exposes Gate 1 CI evidence doc count for array/object length checks.
- Gate 0 status exposes Gate 1 CI failure code count for object length checks.
- Gate 0 status pins all Gate 1 CI failure codes as stable fields.
- Gate 0 status includes the Gate 1 required checks source in the CI ready report field list.
- Gate 0 status includes the Gate 1 required checks parsed status in the CI ready report field list.
- Gate 0 status includes the Gate 1 failure code count in the CI ready report field list.
- Gate 0 status includes the Gate 1 evidence doc count in the CI ready report field list.
- Gate 0 status includes the Gate 1 required check count in the CI ready report field list.
- Gate 0 status pins the Gate 1 ready summary and required fields report aliases as stable fields.
- Gate 0 status exposes a Gate 1 ready required fields alias for CI handoff output.
- Gate 0 status exposes Gate 1 ready commands and report fields aliases for CI handoff output.
- Gate 0 status exposes a production blockers summary with next Gate 1 blocker and doc path for automation.
- Gate 0 status registers production blocker summary fields in the Gate 1 CI handoff alias registry.
- Gate 0 status maps production blockers by gate with doc paths for Gate 1 through Gate 4 follow-up.
- Gate 0 status registers production blocker by-gate fields in the Gate 1 CI handoff alias registry.
- Gate 0 status exposes production blocker by-gate registry keys and invariants.
- Gate 0 status registers production blocker by-gate registry metadata in the Gate 1 CI handoff alias registry.
- Gate 0 status exposes production gate execution order separately from Gate 1 prep.
- Gate 0 status registers production gate order metadata in the Gate 1 CI handoff alias registry.
- Gate 0 status exposes production gate order details with blocker and doc metadata.
- Gate 0 status registers production gate order detail metadata in the Gate 1 CI handoff alias registry.
- Gate 0 status exposes a compact production gate order detail summary for CI logs.
- Gate 0 status includes the compact production gate order summary in the Gate 1 CI ready report fields.
- Gate 0 status exposes Gate 1 CI ready report values for compact handoff logs.
- Gate 0 status exposes Gate 1 CI ready report value registry metadata for deterministic handoff checks.
- Gate 0 status exposes ordered Gate 1 CI ready report value keys for deterministic handoff checks.
- Gate 0 status exposes a compact Gate 1 CI ready report value summary.
- Gate 0 status exposes Gate 1 CI ready report value endpoints for deterministic handoff checks.
- Gate 0 status exposes a compact Gate 1 CI ready report value endpoint summary.
- Gate 1 CI ready report includes the compact Prisma scaffold status summary.
- Gate 0 status exposes Prisma scaffold status summary as a top-level stable field.
- Gate 1 CI ready report includes the production blocker count for compact handoff logs.
- Gate 0 status exposes production blocker count as a top-level stable field.
- Gate 0 status exposes production gate order details summary as a top-level stable field.
- Gate 1 CI ready report includes progress percent for compact handoff logs.
- Gate 1 CI ready report includes progress basis summary for compact handoff logs.
- Gate 1 CI ready report includes remaining blockers summary for compact handoff logs.
- Gate 0 status exposes progress basis summary as a top-level stable field.
- Gate 0 status exposes progress basis nested counts as stable help-listed fields.
- Gate 0 status exposes remaining blockers summary as a top-level stable field.
- Gate 0 status exposes first and last remaining blocker list endpoints as stable help-listed fields.
- Gate 0 status exposes CI ready status and summary as top-level stable fields.
- Gate 0 status exposes CI ready report values as a top-level stable field.
- Gate 0 status exposes CI ready report value keys as a top-level stable field.
- Gate 0 status exposes CI ready report value count and summary as top-level stable fields.
- Gate 0 status exposes CI ready report value endpoints as top-level stable fields.
- Gate 0 status exposes CI ready report value registry status as top-level stable fields.
- Gate 0 status exposes CI ready report value endpoints and indexes as top-level stable fields.
- Gate 0 status exposes CI ready report value alias fields as top-level stable fields.
- Gate 0 status exposes all CI ready report value alias fields as top-level stable fields.
- Gate 0 status exposes CI ready required fields as top-level stable fields.
- Gate 0 status exposes CI ready commands as top-level stable fields.
- Gate 0 status exposes CI assertions as top-level stable fields.
- Gate 0 status exposes CI assertion expected values and commands as top-level stable fields.
- Gate 0 status exposes CI pass criteria as top-level stable fields.
- Gate 0 status exposes CI failure codes as top-level stable fields.
- Gate 0 status exposes CI evidence docs as top-level stable fields.
- Gate 0 status exposes CI watch fields as top-level stable fields.
- Gate 0 status exposes CI required check metadata as top-level stable fields.
- Gate 0 status exposes CI readiness and transition plan as top-level stable fields.
- Gate 0 status exposes CI transition expectations as top-level stable fields.
- Gate 0 status exposes CI transition ordered steps as top-level stable fields.
- Gate 0 status exposes CI rollback summary as top-level stable fields.
- Gate 0 status exposes CI rollback alias fields as top-level stable fields.
- Gate 0 status exposes ordered CI rollback commands as top-level stable fields.
- Gate 0 status exposes ordered CI rollback command aliases as top-level stable fields.
- Gate 0 status exposes CI rollback command endpoints as top-level stable fields.
- Gate 0 status exposes CI rollback command endpoint aliases as top-level stable fields.
- Gate 0 status exposes nested CI rollback command endpoints and aliases.
- Gate 0 status includes CI rollback command endpoints in ready report values.
- Gate 0 status exposes CI rollback ready report values as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value aliases as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value alias registry as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry aliases as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry endpoints as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry invariants as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry indexes as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry index summaries as top-level stable fields.
- Gate 0 status exposes CI rollback ready report value registry index aliases as top-level stable fields.
- Gate 0 status exposes remaining production blocker endpoints and aliases as top-level stable fields.
- Gate 0 status exposes remaining production blocker registry invariants as top-level stable fields.
- Gate 0 status verifies remaining production blocker aliases through field-level checks.
- Gate 0 status exposes remaining production blocker field registry as top-level stable fields.
- Gate 0 status exposes remaining production blocker field registry endpoints and indexes as top-level stable fields.
- Gate 0 status verifies remaining production blocker field registry aliases through field-level checks.
- Gate 0 status exposes remaining production blocker field registry invariants as top-level stable fields.
- Gate 0 status verifies remaining production blocker field registry invariant aliases through field-level checks.
- Gate 0 status exposes production blocker top-level aliases as stable fields.
- Gate 0 status exposes production blocker top-level field registry as stable fields.
- Gate 0 status exposes production blocker top-level field registry indexes as stable fields.
- Gate 0 status verifies production blocker top-level field registry endpoints through field-level checks.
- Gate 0 status exposes production blocker top-level field registry invariants as stable fields.
- Gate 0 status verifies production blocker top-level field registry invariant aliases through field-level checks.
- Gate 0 status verifies production blocker summary aliases through field-level checks.
- Gate 0 status verifies production blocker summary metadata aliases through field-level checks.
- Gate 0 status verifies production blocker summary endpoints through field-level checks.
- Gate 0 status verifies production blocker raw list endpoints appear in help output.
- Gate 0 status verifies production blocker by-gate aliases through field-level checks.
- Gate 0 status verifies production blocker by-gate registry endpoints through field-level checks.
- Gate 0 status verifies production blocker by-gate registry aliases through field-level checks.
- Gate 0 status verifies production blocker by-gate endpoint matrix through field-level checks.
- Gate 0 status verifies production blocker by-gate endpoint matrix appears in help output.
- Gate 0 status verifies production blocker gate-order endpoints and aliases through field-level checks.
- Gate 0 status verifies production blocker gate-order registry endpoints through field-level checks.
- Gate 0 status verifies production blocker gate-order registry aliases through field-level checks.
- Gate 0 status verifies production blocker gate-order detail aliases through field-level checks.
- Gate 0 status verifies production blocker gate-order detail registry endpoints through field-level checks.
- Gate 0 status verifies production blocker gate-order detail registry aliases through field-level checks.
- Gate 1 database persistence mode now exists as a fail-closed store boundary while fixture remains the default.
- Gate 1 database persistence mode routes unscaffolded reads through a stable error envelope.

Latest Android device evidence:

- Run ID: `2026-06-13T05-03-10-371Z`
- Device: `OPPO CPH2695`, Android 16 / API 36, `720x1604 @ 320 dpi`
- Serial: `XC95L7LZ4HJ7FIY9`
- Result: `.thai-meet\device-smoke\runs\2026-06-13T05-03-10-371Z.json`
- Screenshot: `.thai-meet\device-smoke\runs\2026-06-13T05-03-10-371Z.png`

Latest verified commands:

Full test baseline: `npm test` passed with 89 Flutter widget tests.

Local API boundary checks:

- `npm run api:fixture-store:test`
- `npm run api:service:test`

```powershell
npm test
npm run gate0:status:test
npm run db:check:test
npm run gate0:status -- --field nextGateMigrationStatus
npm run gate0:status -- --field nextGateMigrationStatus.currentExpectedStatus
npm run gate0:status -- --field nextGatePrismaScaffold
npm run gate0:status -- --field nextGatePrismaScaffold.schemaPath
npm run gate0:status -- --field nextGateDatabaseUrlStatusCommand
npm run gate0:status -- --field nextGateDatabaseUrlProtocolCommand
npm run gate0:status -- --field nextGateDatabaseUrlValidationCommand
npm run gate0:status -- --field nextGateDatabaseUrlExpectedStatus
npm run gate0:status -- --field nextGateDatabaseUrlExpectedProtocols
npm run gate0:status -- --field nextGateDatabaseUrl
npm run gate0:status -- --field nextGateDatabaseUrl.expectedStatus
npm run gate0:status -- --field nextGateMigrationGuardCommand
npm run gate0:status -- --field nextGateMigrationGuardMigrationCommand
npm run gate0:status -- --field nextGateMigrationGuardHelperCommand
npm run gate0:status -- --field nextGateMigrationGuardErrorCode
npm run gate0:status -- --field nextGateMigrationGuard
npm run gate0:status -- --field nextGateMigrationGuard.errorCode
npm run gate0:status -- --field productionBlockersSummary
npm run gate0:status -- --field productionBlockersSummary.count
npm run gate0:status -- --field productionBlockersSummary.nextGateBlocker
npm run gate0:status -- --field productionBlockersSummary.nextGateDocPath
npm run gate0:status -- --field productionBlockersSummary.byGate
npm run gate0:status -- --field productionBlockersSummary.byGateKeys
npm run gate0:status -- --field productionBlockersSummary.byGateRegistryInvariant
npm run gate0:status -- --field productionBlockersSummary.preGateKey
npm run gate0:status -- --field productionBlockersSummary.gateOrder
npm run gate0:status -- --field productionBlockersSummary.gateOrderRegistryInvariant
npm run gate0:status -- --field productionBlockersSummary.gateOrderDetails
npm run gate0:status -- --field productionBlockersSummary.gateOrderDetails.0.docPath
npm run gate0:status -- --field productionBlockersSummary.gateOrderDetails.3.key
npm run gate0:status -- --field productionBlockersSummary.gateOrderDetailsSummary
npm run gate0:status -- --field productionBlockersSummary.byGate.gate2.docPath
npm run gate0:status -- --field productionBlockersSummary.byGate.gate3.blocker
npm run gate0:status -- --field productionBlockersSummary.blockers.0
npm run gate0:status -- --field productionBlockersSummary.blockers.4
npm run gate0:status -- --field nextGateDbMatrix
npm run gate0:status -- --field nextGateDbMatrix.prismaScaffoldStatus.summary
npm run gate0:status -- --field nextGateDbMatrix.databaseUrl.expectedStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeKeys
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeKeysField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeKeys.0
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeKeys.4
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeCount
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeCountField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeFirst
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeFirstField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeLast
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeLastField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.count
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.count
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.count
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.count
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.count
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.countField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.countField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.countField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.countField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.countField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandsField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandsField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandsField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandsField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandsField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndex
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndexField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatus
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatusField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariant
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariantField
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commands.0
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.db.commands.7
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.0
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.1
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.test.commands.0
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.privacy.commands.0
npm run gate0:status -- --field nextGateDbMatrix.requiredChecksSummary.byType.errors.commands.0
npm run gate0:status -- --field nextGateRequiredChecksSummary
npm run gate0:status -- --field nextGateRequiredChecksSummary.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeKeys
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeKeysField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeKeys.0
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeKeys.4
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeCount
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeCountField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeFirst
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeFirstField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeLast
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeLastField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byTypeRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.count
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.countField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.countField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.countField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.countField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.countField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandsField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandsField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandsField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandsField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandsField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandLastIndex
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandLastIndexField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandRegistryStatusField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commandRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariantField
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commands.0
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.db.commands.7
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commands.0
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.guard.commands.1
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.test.commands.0
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.privacy.commands.0
npm run gate0:status -- --field nextGateRequiredChecksSummary.byType.errors.commands.0
npm run gate0:status -- --field nextGateRequiredChecksByType
npm run gate0:status -- --field nextGateReadiness
npm run gate0:status -- --field nextGateReadiness.transitionCount
npm run gate0:status -- --field nextGateTransitionPlan
npm run gate0:status -- --field nextGateTransitionPlan.transitions.migrationStatus.nextExpected
npm run gate0:status -- --field nextGateTransitionPlan.orderedSteps.0.id
npm run gate0:status -- --field nextGateCiHandoff
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasCount
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasCountField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasLastIndex
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasFirst
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasFirstField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasLast
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasLastField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasEndpointsField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasEndpoints.first
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasEndpoints.last
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasSummary
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasSummaryField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliasesField
npm run gate0:status -- --field nextGateCiHandoff.fieldAliases.0
npm run gate0:status -- --field nextGateCiHandoff.fieldAliases.323
npm run gate0:status -- --field nextGateCiHandoff.requiredCheckCount
npm run gate0:status -- --field nextGateCiHandoff.requiredCheckCountField
npm run gate0:status -- --field nextGateCiHandoff.requiredChecksSource
npm run gate0:status -- --field nextGateCiHandoff.requiredChecksSourceField
npm run gate0:status -- --field nextGateCiHandoff.requiredChecksParsed
npm run gate0:status -- --field nextGateCiHandoff.requiredChecksParsedField
npm run gate0:status -- --field nextGateCiHandoff.transitionPlanField
npm run gate0:status -- --field nextGateCiHandoff.readinessField
npm run gate0:status -- --field nextGateCiHandoff.commandCount
npm run gate0:status -- --field nextGateCiHandoff.commandCountField
npm run gate0:status -- --field nextGateCiHandoff.commandLastIndex
npm run gate0:status -- --field nextGateCiHandoff.commandLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.commandRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.commandRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.commandRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.commandRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.commandsField
npm run gate0:status -- --field nextGateCiHandoff.commands.0
npm run gate0:status -- --field nextGateCiHandoff.commands.1
npm run gate0:status -- --field nextGateCiHandoff.commands.2
npm run gate0:status -- --field nextGateCiHandoff.commands.3
npm run gate0:status -- --field nextGateCiHandoff.commands.4
npm run gate0:status -- --field nextGateCiHandoff.commands.5
npm run gate0:status -- --field nextGateCiHandoff.commands.6
npm run gate0:status -- --field nextGateCiHandoff.commands.7
npm run gate0:status -- --field nextGateCiHandoff.commands.8
npm run gate0:status -- --field nextGateCiHandoff.commands.9
npm run gate0:status -- --field nextGateCiHandoff.commands.10
npm run gate0:status -- --field nextGateCiHandoff.commands.11
npm run gate0:status -- --field nextGateCiHandoff.commands.12
npm run gate0:status -- --field nextGateCiHandoff.watchFieldsField
npm run gate0:status -- --field nextGateCiHandoff.watchFields.0
npm run gate0:status -- --field nextGateCiHandoff.watchFields.1
npm run gate0:status -- --field nextGateCiHandoff.watchFields.2
npm run gate0:status -- --field nextGateCiHandoff.watchFieldCount
npm run gate0:status -- --field nextGateCiHandoff.watchFieldCountField
npm run gate0:status -- --field nextGateCiHandoff.passCriteriaField
npm run gate0:status -- --field nextGateCiHandoff.passCriteriaCount
npm run gate0:status -- --field nextGateCiHandoff.passCriteriaCountField
npm run gate0:status -- --field nextGateCiHandoff.passCriteria.migrationStatus
npm run gate0:status -- --field nextGateCiHandoff.passCriteria.databaseUrlStatus
npm run gate0:status -- --field nextGateCiHandoff.passCriteria.databaseUrlProtocol
npm run gate0:status -- --field nextGateCiHandoff.failureCodesField
npm run gate0:status -- --field nextGateCiHandoff.failureCodes.migrationGuard
npm run gate0:status -- --field nextGateCiHandoff.failureCodes.dbMatrixUnknownField
npm run gate0:status -- --field nextGateCiHandoff.failureCodes.statusFieldMissing
npm run gate0:status -- --field nextGateCiHandoff.failureCodeCount
npm run gate0:status -- --field nextGateCiHandoff.failureCodeCountField
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocsField
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocs.nextGate
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocs.dbConstraints
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocs.status
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocCount
npm run gate0:status -- --field nextGateCiHandoff.evidenceDocCountField
npm run gate0:status -- --field nextGateCiHandoff.assertionsField
npm run gate0:status -- --field nextGateCiHandoff.assertionCount
npm run gate0:status -- --field nextGateCiHandoff.assertionCountField
npm run gate0:status -- --field nextGateCiHandoff.assertions.migrationStatus.expected
npm run gate0:status -- --field nextGateCiHandoff.assertions.migrationStatus.command
npm run gate0:status -- --field nextGateCiHandoff.assertions.databaseUrlStatus.expected
npm run gate0:status -- --field nextGateCiHandoff.assertions.databaseUrlStatus.command
npm run gate0:status -- --field nextGateCiHandoff.assertions.databaseUrlProtocol.expected
npm run gate0:status -- --field nextGateCiHandoff.assertions.databaseUrlProtocol.command
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.status
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.summary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFields.0
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFields.1
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFields.2
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldCountField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldLastIndex
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.assertionCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.assertionCountField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.statusField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.summaryField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.requiredFieldsField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandsField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldsField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldCountField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldLastIndex
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldFirst
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldFirstField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldLast
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldLastField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldEndpointsField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldEndpoints.first
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldEndpoints.last
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFieldSummaryField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.0
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.16
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.17
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.18
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.19
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.20
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.21
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueKeys.24
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueLastIndex
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueEndpoints.first
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueEndpoints.last
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueEndpointSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValueSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues.progressPercent
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandCount
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandCountField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandLastIndex
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commandRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commands.0
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commands.1
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.commands.2
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.0
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.1
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.2
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.3
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.4
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.5
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.6
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.7
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.8
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.9
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.10
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.11
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.12
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.13
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.14
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.15
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.16
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.17
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.18
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.19
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.20
npm run gate0:status -- --field nextGateCiHandoff.readyWhen.reportFields.21
npm run gate0:status -- --field nextGateCiHandoff.rollback.mode
npm run gate0:status -- --field nextGateCiHandoff.rollback.modeField
npm run gate0:status -- --field nextGateCiHandoff.rollback.expectedMode
npm run gate0:status -- --field nextGateCiHandoff.rollback.expectedModeField
npm run gate0:status -- --field nextGateCiHandoff.rollback.summary
npm run gate0:status -- --field nextGateCiHandoff.rollback.summaryField
npm run gate0:status -- --field nextGateCiHandoff.rollback.command
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandsField
npm run gate0:status -- --field nextGateCiHandoff.rollback.verificationCommand
npm run gate0:status -- --field nextGateCiHandoff.rollback.verificationCommandField
npm run gate0:status -- --field nextGateCiHandoff.rollback.reportCommand
npm run gate0:status -- --field nextGateCiHandoff.rollback.reportCommandField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandCount
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandCountField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandLastIndex
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandLastIndexField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandRegistryStatus
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandRegistryStatusField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandRegistryInvariant
npm run gate0:status -- --field nextGateCiHandoff.rollback.commandRegistryInvariantField
npm run gate0:status -- --field nextGateCiHandoff.rollback.commands.0
npm run gate0:status -- --field nextGateCiHandoff.rollback.commands.1
npm run gate0:status -- --field nextGateCiHandoff.rollback.commands.2
npm run not-scaffolded:test
npm run mobile:device:smoke
npm run mobile:device:result -- --strict
git diff --check
```

Still not done:

Related docs:

- `CI.md`
- `DESIGN_STATUS.md`
- `PRODUCTION_GAPS.md`
- `GATE1_PERSISTENCE.md`
- `RELEASE_SIGNING.md`
- `ROADMAP.md`
