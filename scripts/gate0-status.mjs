import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const statusPath = path.join(root, "docs/dev/GATE0_STATUS.md");
const nextGateDoc = "GATE1_PERSISTENCE.md";
const nextGateDocPath = `docs/dev/${nextGateDoc}`;
const nextGateDocFsPath = path.join(root, nextGateDocPath);
const deviceResultPath = path.join(root, ".thai-meet/device-smoke/latest.json");

const statusDoc = await readFile(statusPath, "utf8");
const nextGateDocText = await readOptionalText(nextGateDocFsPath);
const deviceResult = await readDeviceResult();
const shouldPrintHelp = process.argv.includes("--help");
const shouldPrintJson = process.argv.includes("--json");
const requestedField = parseFieldArg(process.argv);

validateArgs(process.argv);

if (shouldPrintHelp) {
  printHelp();
  await flushStdout();
  process.exit(0);
}

const currentStatus = firstMatch(statusDoc, /^Current local status: (.+)$/m) ?? "unknown";
const currentStatusField = "currentStatus";
const currentStatusSummary = `Gate 0 status: ${currentStatus}`;
const currentStatusSummaryField = "currentStatusSummary";
const completedLocally = listSectionItems(statusDoc, "Completed locally");
const completedLocallyCount = completedLocally.length;
const completedLocallyCountField = "completedLocallyCount";
const completedLocallyFirst = completedLocally[0] ?? null;
const completedLocallyFirstField = "completedLocallyFirst";
const completedLocallyLastIndex = completedLocally.length - 1;
const completedLocallyLastIndexField = "completedLocallyLastIndex";
const completedLocallyLast = completedLocally[completedLocallyLastIndex] ?? null;
const completedLocallyLastField = "completedLocallyLast";
const completedLocallyRegistryStatus = "consistent";
const completedLocallyRegistryStatusField = "completedLocallyRegistryStatus";
const completedLocallyRegistryInvariant = `count=${completedLocally.length},lastIndex=${completedLocallyLastIndex}`;
const completedLocallyRegistryInvariantField = "completedLocallyRegistryInvariant";
const completedLocallySummary = `${completedLocally.length} completed, first=${completedLocallyFirst}, last=${completedLocallyLast}`;
const completedLocallySummaryField = "completedLocallySummary";
const fullTestBaseline = firstMatch(statusDoc, /^Full test baseline: `npm test` passed with (.+)\.$/m) ?? "unknown";
const fullTestBaselineField = "fullTestBaseline";
const fullTestBaselineCommand = "npm test";
const fullTestBaselineCommandField = "fullTestBaselineCommand";
const fullTestBaselineSummary = `${fullTestBaselineCommand} passed with ${fullTestBaseline}`;
const fullTestBaselineSummaryField = "fullTestBaselineSummary";
const localApiBoundaryChecks = listSectionItems(statusDoc, "Local API boundary checks");
const localApiBoundaryCheckCount = localApiBoundaryChecks.length;
const localApiBoundaryCheckCountField = "localApiBoundaryCheckCount";
const localApiBoundaryCheckFirst = localApiBoundaryChecks[0] ?? null;
const localApiBoundaryCheckFirstField = "localApiBoundaryCheckFirst";
const localApiBoundaryCheckLastIndex = localApiBoundaryChecks.length - 1;
const localApiBoundaryCheckLastIndexField = "localApiBoundaryCheckLastIndex";
const localApiBoundaryCheckLast = localApiBoundaryChecks[localApiBoundaryCheckLastIndex] ?? null;
const localApiBoundaryCheckLastField = "localApiBoundaryCheckLast";
const localApiBoundaryCheckSummary = `${localApiBoundaryChecks.length} checks, first=${localApiBoundaryCheckFirst}, last=${localApiBoundaryCheckLast}`;
const localApiBoundaryCheckSummaryField = "localApiBoundaryCheckSummary";
const stillNotDone = listSectionItems(statusDoc, "Still not done");
const remainingBlockersSummary = stillNotDone.join(" | ");
const remainingBlockersSummaryField = "remainingBlockersSummary";
const remainingBlockerCount = stillNotDone.length;
const remainingBlockerCountField = "remainingBlockerCount";
const remainingBlockerFirst = stillNotDone[0] ?? null;
const remainingBlockerFirstField = "remainingBlockerFirst";
const remainingBlockerLastIndex = stillNotDone.length - 1;
const remainingBlockerLastIndexField = "remainingBlockerLastIndex";
const remainingBlockerLast = stillNotDone[remainingBlockerLastIndex] ?? null;
const remainingBlockerLastField = "remainingBlockerLast";
const remainingBlockerRegistryStatus = "consistent";
const remainingBlockerRegistryStatusField = "remainingBlockerRegistryStatus";
const remainingBlockerRegistryInvariant = `count=${stillNotDone.length},lastIndex=${remainingBlockerLastIndex}`;
const remainingBlockerRegistryInvariantField = "remainingBlockerRegistryInvariant";
const remainingBlockerFields = [
  remainingBlockerFirstField,
  remainingBlockerLastField,
  remainingBlockersSummaryField
];
const remainingBlockerFieldsField = "remainingBlockerFields";
const remainingBlockerFieldIndexes = [0, 1, 2];
const remainingBlockerFieldIndexesField = "remainingBlockerFieldIndexes";
const remainingBlockerFieldCount = remainingBlockerFields.length;
const remainingBlockerFieldCountField = "remainingBlockerFieldCount";
const remainingBlockerFieldLastIndex = remainingBlockerFields.length - 1;
const remainingBlockerFieldLastIndexField = "remainingBlockerFieldLastIndex";
const remainingBlockerFieldFirst = remainingBlockerFields[0];
const remainingBlockerFieldFirstField = "remainingBlockerFieldFirst";
const remainingBlockerFieldLast = remainingBlockerFields[remainingBlockerFieldLastIndex];
const remainingBlockerFieldLastField = "remainingBlockerFieldLast";
const remainingBlockerFieldRegistryStatus = "consistent";
const remainingBlockerFieldRegistryStatusField = "remainingBlockerFieldRegistryStatus";
const remainingBlockerFieldRegistryInvariant = `count=${remainingBlockerFields.length},lastIndex=${remainingBlockerFieldLastIndex}`;
const remainingBlockerFieldRegistryInvariantField = "remainingBlockerFieldRegistryInvariant";
const remainingBlockerFieldSummary = `${remainingBlockerFields.length} fields, first=${remainingBlockerFields[0]}, last=${remainingBlockerFields[remainingBlockerFields.length - 1]}`;
const remainingBlockerFieldSummaryField = "remainingBlockerFieldSummary";
const relatedDocs = listSectionItems(statusDoc, "Related docs");
const relatedDocCount = relatedDocs.length;
const relatedDocCountField = "relatedDocCount";
const relatedDocFirst = relatedDocs[0] ?? null;
const relatedDocFirstField = "relatedDocFirst";
const relatedDocLastIndex = relatedDocs.length - 1;
const relatedDocLastIndexField = "relatedDocLastIndex";
const relatedDocLast = relatedDocs[relatedDocLastIndex] ?? null;
const relatedDocLastField = "relatedDocLast";
const relatedDocSummary = `${relatedDocs.length} docs, first=${relatedDocFirst}, last=${relatedDocLast}`;
const relatedDocSummaryField = "relatedDocSummary";
const progressBasis = buildProgressBasis(completedLocally, stillNotDone);
const progressPercent = progressBasis.percent;
const progressBasisSummary = `${progressBasis.completedCount}/${progressBasis.totalCount} completed, ${progressBasis.remainingCount} remaining, ${progressBasis.percent}%`;
const nextGate = "Gate 1 production backend persistence";
const nextGateField = "nextGate";
const nextGateDocField = "nextGateDoc";
const nextGateDocPathField = "nextGateDocPath";
const nextGateCommand = "npm run gate0:status -- --field nextGateDocPath";
const nextGateCommandField = "nextGateCommand";
const nextGateSummary = `${nextGate} -> ${nextGateDocPath}`;
const nextGateSummaryField = "nextGateSummary";
const productionBlockersSummary = buildProductionBlockersSummary(stillNotDone, nextGate, nextGateDocPath);
const productionBlockersSummaryField = "productionBlockersSummary";
const productionBlockerCount = productionBlockersSummary.count;
const productionBlockerCountField = "productionBlockerCount";
const productionGateOrderDetailsSummary = productionBlockersSummary.gateOrderDetailsSummary;
const productionGateOrderDetailsSummaryField = "productionGateOrderDetailsSummary";
const productionBlockerFields = [
  productionBlockersSummaryField,
  productionBlockerCountField,
  productionGateOrderDetailsSummaryField
];
const productionBlockerFieldsField = "productionBlockerFields";
const productionBlockerFieldIndexes = [0, 1, 2];
const productionBlockerFieldIndexesField = "productionBlockerFieldIndexes";
const productionBlockerFieldCount = productionBlockerFields.length;
const productionBlockerFieldCountField = "productionBlockerFieldCount";
const productionBlockerFieldLastIndex = productionBlockerFields.length - 1;
const productionBlockerFieldLastIndexField = "productionBlockerFieldLastIndex";
const productionBlockerFieldFirst = productionBlockerFields[0];
const productionBlockerFieldFirstField = "productionBlockerFieldFirst";
const productionBlockerFieldLast = productionBlockerFields[productionBlockerFieldLastIndex];
const productionBlockerFieldLastField = "productionBlockerFieldLast";
const productionBlockerFieldRegistryStatus = "consistent";
const productionBlockerFieldRegistryStatusField = "productionBlockerFieldRegistryStatus";
const productionBlockerFieldRegistryInvariant = `count=${productionBlockerFields.length},lastIndex=${productionBlockerFieldLastIndex}`;
const productionBlockerFieldRegistryInvariantField = "productionBlockerFieldRegistryInvariant";
const productionBlockerFieldSummary = `${productionBlockerFields.length} fields, first=${productionBlockerFieldFirst}, last=${productionBlockerFieldLast}`;
const productionBlockerFieldSummaryField = "productionBlockerFieldSummary";
const nextGateCheckCommand = "npm run db:check";
const nextGateCheckCommandField = "nextGateCheckCommand";
const nextGateCheckJsonCommand = "npm run db:check -- --json";
const nextGateCheckJsonCommandField = "nextGateCheckJsonCommand";
const nextGateCheckCommandSummary = `${nextGateCheckCommand} | ${nextGateCheckJsonCommand}`;
const nextGateCheckCommandSummaryField = "nextGateCheckCommandSummary";
const nextGateMigrationStatusCommand = "npm run db:check -- --field migrationStatus";
const nextGateMigrationStatusCommandField = "nextGateMigrationStatusCommand";
const nextGateMigrationStatus = {
  command: nextGateMigrationStatusCommand,
  currentExpectedStatus: "scaffolded",
  nextExpectedStatus: "database_read_parity",
  guardCommand: "npm run not-scaffolded:test"
};
const nextGateMigrationStatusField = "nextGateMigrationStatus";
const nextGateMigrationStatusCurrentExpectedStatusField = "nextGateMigrationStatus.currentExpectedStatus";
const nextGateMigrationStatusNextExpectedStatusField = "nextGateMigrationStatus.nextExpectedStatus";
const nextGateMigrationStatusGuardCommandField = "nextGateMigrationStatus.guardCommand";
const nextGateMigrationStatusSummary = `${nextGateMigrationStatus.currentExpectedStatus} -> ${nextGateMigrationStatus.nextExpectedStatus}`;
const nextGateMigrationStatusSummaryField = "nextGateMigrationStatusSummary";
const nextGatePrismaScaffold = {
  schemaPath: "apps/api/prisma/schema.prisma",
  migrationsPath: "apps/api/prisma/migrations",
  schemaPresentCommand: "npm run db:check -- --field prismaSchemaPresent",
  migrationsPresentCommand: "npm run db:check -- --field prismaMigrationsPresent",
  expectedPresent: true
};
const nextGatePrismaScaffoldField = "nextGatePrismaScaffold";
const nextGatePrismaScaffoldSchemaPathField = "nextGatePrismaScaffold.schemaPath";
const nextGatePrismaScaffoldMigrationsPathField = "nextGatePrismaScaffold.migrationsPath";
const nextGatePrismaScaffoldSchemaPresentCommandField = "nextGatePrismaScaffold.schemaPresentCommand";
const nextGatePrismaScaffoldMigrationsPresentCommandField = "nextGatePrismaScaffold.migrationsPresentCommand";
const nextGatePrismaScaffoldExpectedPresentField = "nextGatePrismaScaffold.expectedPresent";
const nextGatePrismaScaffoldSummary = `schema=${nextGatePrismaScaffold.schemaPath}, migrations=${nextGatePrismaScaffold.migrationsPath}, expectedPresent=${nextGatePrismaScaffold.expectedPresent}`;
const nextGatePrismaScaffoldSummaryField = "nextGatePrismaScaffoldSummary";
const nextGatePrismaSchemaPresent = await pathExists(nextGatePrismaScaffold.schemaPath);
const nextGatePrismaMigrationsPresent = await pathExists(nextGatePrismaScaffold.migrationsPath);
const nextGateCurrentMigrationStatus = nextGatePrismaSchemaPresent && nextGatePrismaMigrationsPresent ? "scaffolded" : "not_scaffolded";
const nextGatePrismaScaffoldStatus = {
  schemaPresent: nextGatePrismaSchemaPresent,
  migrationsPresent: nextGatePrismaMigrationsPresent,
  migrationStatus: nextGateCurrentMigrationStatus,
  summary: `schema=${nextGatePrismaSchemaPresent}, migrations=${nextGatePrismaMigrationsPresent}, migrationStatus=${nextGateCurrentMigrationStatus}`
};
const prismaScaffoldStatusSummary = nextGatePrismaScaffoldStatus.summary;
const nextGateSeedParityStatus = {
  status: "planned",
  fixturePath: "packages/api-contracts/fixtures/gate0-smoke.json",
  planPath: ".thai-meet/gate1/seed-parity.json",
  planCommand: "npm run gate1:seed:plan",
  checkCommand: "npm run gate1:seed:test",
  rawProviderValuesStored: false,
  summary: "status=planned, fixture=gate0-smoke.json, rawProviderValuesStored=false"
};
const nextGateSeedParityStatusField = "nextGateSeedParityStatus";
const nextGateSeedParityStatusSummaryField = "nextGateSeedParityStatus.summary";
const nextGateDatabaseUrlStatusCommand = "npm run db:check -- --field databaseUrlStatus";
const nextGateDatabaseUrlStatusCommandField = "nextGateDatabaseUrlStatusCommand";
const nextGateDatabaseUrlProtocolCommand = "npm run db:check -- --field databaseUrlProtocol";
const nextGateDatabaseUrlProtocolCommandField = "nextGateDatabaseUrlProtocolCommand";
const nextGateDatabaseUrlValidationCommand = "$env:DATABASE_URL='<postgresql-url>'; npm run db:check -- --field databaseUrlStatus; npm run db:check -- --field databaseUrlProtocol; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue";
const nextGateDatabaseUrlValidationCommandField = "nextGateDatabaseUrlValidationCommand";
const nextGateDatabaseUrlExpectedStatus = "valid";
const nextGateDatabaseUrlExpectedStatusField = "nextGateDatabaseUrlExpectedStatus";
const nextGateDatabaseUrlExpectedProtocols = ["postgresql", "postgres"];
const nextGateDatabaseUrlExpectedProtocolsField = "nextGateDatabaseUrlExpectedProtocols";
const nextGateDatabaseUrl = {
  statusCommand: nextGateDatabaseUrlStatusCommand,
  protocolCommand: nextGateDatabaseUrlProtocolCommand,
  validationCommand: nextGateDatabaseUrlValidationCommand,
  expectedStatus: nextGateDatabaseUrlExpectedStatus,
  expectedProtocols: nextGateDatabaseUrlExpectedProtocols
};
const nextGateDatabaseUrlField = "nextGateDatabaseUrl";
const nextGateDatabaseUrlExpectedStatusNestedField = "nextGateDatabaseUrl.expectedStatus";
const nextGateDatabaseUrlExpectedProtocolsNestedField = "nextGateDatabaseUrl.expectedProtocols";
const nextGateDatabaseUrlSummary = `${nextGateDatabaseUrl.expectedStatus} ${nextGateDatabaseUrl.expectedProtocols.join("|")}`;
const nextGateDatabaseUrlSummaryField = "nextGateDatabaseUrlSummary";
const nextGateMigrationGuardCommand = "npm run not-scaffolded:test";
const nextGateMigrationGuardCommandField = "nextGateMigrationGuardCommand";
const nextGateMigrationGuardMigrationCommand = "npm run db:migrate";
const nextGateMigrationGuardMigrationCommandField = "nextGateMigrationGuardMigrationCommand";
const nextGateMigrationGuardHelperCommand = "node scripts/not-scaffolded.mjs --help";
const nextGateMigrationGuardHelperCommandField = "nextGateMigrationGuardHelperCommand";
const nextGateMigrationGuardErrorCode = "TM_COMMAND_NOT_SCAFFOLDED";
const nextGateMigrationGuardErrorCodeField = "nextGateMigrationGuardErrorCode";
const nextGateMigrationGuard = {
  command: nextGateMigrationGuardCommand,
  migrationCommand: nextGateMigrationGuardMigrationCommand,
  helperCommand: nextGateMigrationGuardHelperCommand,
  errorCode: nextGateMigrationGuardErrorCode
};
const nextGateMigrationGuardField = "nextGateMigrationGuard";
const nextGateMigrationGuardErrorCodeNestedField = "nextGateMigrationGuard.errorCode";
const nextGateMigrationGuardSummary = `${nextGateMigrationGuard.command} blocks ${nextGateMigrationGuard.migrationCommand} with ${nextGateMigrationGuard.errorCode}`;
const nextGateMigrationGuardSummaryField = "nextGateMigrationGuardSummary";
const nextGateRequiredChecksSource = `${nextGateDocPath}#required-checks`;
const nextGateRequiredChecksSourceField = "nextGateRequiredChecksSource";
const fallbackNextGateRequiredChecks = [
  "npm run db:check",
  "npm test",
  "npm run privacy:test",
  "npm run errors:check"
];
const parsedNextGateRequiredChecks = parseRequiredChecks(nextGateDocText);
const nextGateRequiredChecksParsed = parsedNextGateRequiredChecks !== null;
const nextGateRequiredChecksParsedField = "nextGateRequiredChecksParsed";
const nextGateRequiredChecks = parsedNextGateRequiredChecks ?? fallbackNextGateRequiredChecks;
const nextGateRequiredChecksField = "nextGateRequiredChecks";
const nextGateRequiredChecksByType = groupRequiredChecksByType(nextGateRequiredChecks);
const nextGateRequiredCheckTypeKeys = Object.keys(nextGateRequiredChecksByType);
const nextGateRequiredCheckTypeLastIndex = nextGateRequiredCheckTypeKeys.length - 1;
const nextGateReadiness = buildNextGateReadiness(nextGateRequiredChecks);
const nextGateReadinessField = "nextGateReadiness";
const nextGateReadinessVerifiedNowCountField = "nextGateReadiness.verifiedNowCount";
const nextGateReadinessTransitionCountField = "nextGateReadiness.transitionCount";
const nextGateReadinessVerifiedNowCommandsField = "nextGateReadiness.verifiedNowCommands";
const nextGateReadinessTransitionCommandsField = "nextGateReadiness.transitionCommands";
const nextGateReadinessSummary = `${nextGateReadiness.verifiedNowCount} verified now, ${nextGateReadiness.transitionCount} transition checks`;
const nextGateReadinessSummaryField = "nextGateReadinessSummary";
const nextGateTransitionPlan = buildNextGateTransitionPlan();
const nextGateTransitionPlanField = "nextGateTransitionPlan";
const nextGateTransitionPlanCountField = "nextGateTransitionPlan.count";
const nextGateTransitionPlanMigrationStatusNextExpectedField = "nextGateTransitionPlan.transitions.migrationStatus.nextExpected";
const nextGateTransitionPlanDatabaseUrlStatusNextExpectedField = "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected";
const nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField = "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected";
const nextGateTransitionPlanOrderedStepsField = "nextGateTransitionPlan.orderedSteps";
const nextGateTransitionPlanFirstStepIdField = "nextGateTransitionPlan.orderedSteps.0.id";
const nextGateTransitionPlanStepSummary = nextGateTransitionPlan.orderedSteps.map((step) => step.id).join(" -> ");
const nextGateTransitionPlanStepSummaryField = "nextGateTransitionPlanStepSummary";
const nextGateTransitionPlanSummary = `${nextGateTransitionPlan.count} transitions -> ${formatTransitionTargets(nextGateTransitionPlan)}`;
const nextGateTransitionPlanSummaryField = "nextGateTransitionPlanSummary";
const ciReadyStatus = "all_assertions_pass";
const ciReadySummary = `migrationStatus=${nextGateTransitionPlan.transitions.migrationStatus.nextExpected}, databaseUrlStatus=${nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected}, databaseUrlProtocol=${nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected.join("|")}`;
const nextGateCiHandoff = buildNextGateCiHandoff(nextGateRequiredChecks);
const nextGateCiHandoffField = "nextGateCiHandoff";
const nextGateCiHandoffRequiredCheckCountFieldAlias = "nextGateCiHandoff.requiredCheckCount";
const nextGateCiHandoffWatchFieldCountFieldAlias = "nextGateCiHandoff.watchFieldCount";
const nextGateCiHandoffCommandCountFieldAlias = "nextGateCiHandoff.commandCount";
const nextGateCiHandoffSummary = `${nextGateCiHandoff.requiredCheckCount} required checks, ${nextGateCiHandoff.watchFieldCount} watch fields, ${nextGateCiHandoff.commandCount} commands`;
const nextGateCiHandoffSummaryField = "nextGateCiHandoffSummary";
const nextGateCiHandoffReadyStatus = nextGateCiHandoff.readyWhen.status;
const nextGateCiHandoffReadyStatusField = "nextGateCiHandoff.readyWhen.status";
const nextGateCiHandoffReadySummary = nextGateCiHandoff.readyWhen.summary;
const nextGateCiHandoffReadySummaryField = "nextGateCiHandoff.readyWhen.summary";
const nextGateCiHandoffReadyTopSummary = `${nextGateCiHandoffReadyStatus}: ${nextGateCiHandoffReadySummary}`;
const nextGateCiHandoffReadyTopSummaryField = "nextGateCiHandoffReadyTopSummary";
const ciReadyReportValues = nextGateCiHandoff.readyWhen.reportValues;
const ciReadyReportValueKeys = nextGateCiHandoff.readyWhen.reportValueKeys;
const ciReadyReportValueCount = nextGateCiHandoff.readyWhen.reportValueCount;
const ciReadyReportValueSummary = nextGateCiHandoff.readyWhen.reportValueSummary;
const ciReadyReportValueEndpoints = nextGateCiHandoff.readyWhen.reportValueEndpoints;
const ciReadyReportValueEndpointSummary = nextGateCiHandoff.readyWhen.reportValueEndpointSummary;
const ciReadyReportValueRegistryStatus = nextGateCiHandoff.readyWhen.reportValueRegistryStatus;
const ciReadyReportValueRegistryInvariant = nextGateCiHandoff.readyWhen.reportValueRegistryInvariant;
const ciReadyReportValueLastIndex = nextGateCiHandoff.readyWhen.reportValueLastIndex;
const ciReadyReportValueFirst = nextGateCiHandoff.readyWhen.reportValueFirst;
const ciReadyReportValueLast = nextGateCiHandoff.readyWhen.reportValueLast;
const ciReadyReportValueRollbackCommandFirst = nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst;
const ciReadyReportValueRollbackCommandFirstField = "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst";
const ciReadyReportValueRollbackCommandLast = nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast;
const ciReadyReportValueRollbackCommandLastField = "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast";
const ciReadyReportValueRollbackCommandEndpointSummary = nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary;
const ciReadyReportValueRollbackCommandEndpointSummaryField = "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary";
const ciReadyReportValueRollbackCommandFields = [
  ciReadyReportValueRollbackCommandFirstField,
  ciReadyReportValueRollbackCommandLastField,
  ciReadyReportValueRollbackCommandEndpointSummaryField
];
const ciReadyReportValueRollbackCommandFieldsField = "ciReadyReportValueRollbackCommandFields";
const ciReadyReportValueRollbackCommandField0 = ciReadyReportValueRollbackCommandFields[0];
const ciReadyReportValueRollbackCommandField0Field = "ciReadyReportValueRollbackCommandFields.0";
const ciReadyReportValueRollbackCommandField1 = ciReadyReportValueRollbackCommandFields[1];
const ciReadyReportValueRollbackCommandField1Field = "ciReadyReportValueRollbackCommandFields.1";
const ciReadyReportValueRollbackCommandField2 = ciReadyReportValueRollbackCommandFields[2];
const ciReadyReportValueRollbackCommandField2Field = "ciReadyReportValueRollbackCommandFields.2";
const ciReadyReportValueRollbackCommandFieldIndexes = [0, 1, 2];
const ciReadyReportValueRollbackCommandFieldIndexesField = "ciReadyReportValueRollbackCommandFieldIndexes";
const ciReadyReportValueRollbackCommandFieldIndexCount = ciReadyReportValueRollbackCommandFieldIndexes.length;
const ciReadyReportValueRollbackCommandFieldIndexCountField = "ciReadyReportValueRollbackCommandFieldIndexCount";
const ciReadyReportValueRollbackCommandFieldIndexSummary = ciReadyReportValueRollbackCommandFieldIndexes.join(",");
const ciReadyReportValueRollbackCommandFieldIndexSummaryField = "ciReadyReportValueRollbackCommandFieldIndexSummary";
const ciReadyReportValueRollbackCommandFieldCount = ciReadyReportValueRollbackCommandFields.length;
const ciReadyReportValueRollbackCommandFieldCountField = "ciReadyReportValueRollbackCommandFieldCount";
const ciReadyReportValueRollbackCommandFieldLastIndex = ciReadyReportValueRollbackCommandFields.length - 1;
const ciReadyReportValueRollbackCommandFieldLastIndexField = "ciReadyReportValueRollbackCommandFieldLastIndex";
const ciReadyReportValueRollbackCommandFieldFirst = ciReadyReportValueRollbackCommandFields[0];
const ciReadyReportValueRollbackCommandFieldFirstField = "ciReadyReportValueRollbackCommandFieldFirst";
const ciReadyReportValueRollbackCommandFieldLast = ciReadyReportValueRollbackCommandFields[ciReadyReportValueRollbackCommandFieldLastIndex];
const ciReadyReportValueRollbackCommandFieldLastField = "ciReadyReportValueRollbackCommandFieldLast";
const ciReadyReportValueRollbackCommandFieldEndpoints = {
  first: ciReadyReportValueRollbackCommandFieldFirst,
  last: ciReadyReportValueRollbackCommandFieldLast
};
const ciReadyReportValueRollbackCommandFieldEndpointsField = "ciReadyReportValueRollbackCommandFieldEndpoints";
const ciReadyReportValueRollbackCommandFieldEndpointSummary = `first=${ciReadyReportValueRollbackCommandFieldFirst}, last=${ciReadyReportValueRollbackCommandFieldLast}`;
const ciReadyReportValueRollbackCommandFieldEndpointSummaryField = "ciReadyReportValueRollbackCommandFieldEndpointSummary";
const ciReadyReportValueRollbackCommandFieldRegistryStatus = "consistent";
const ciReadyReportValueRollbackCommandFieldRegistryStatusField = "ciReadyReportValueRollbackCommandFieldRegistryStatus";
const ciReadyReportValueRollbackCommandFieldRegistryInvariant = `count=${ciReadyReportValueRollbackCommandFields.length},lastIndex=${ciReadyReportValueRollbackCommandFieldLastIndex}`;
const ciReadyReportValueRollbackCommandFieldRegistryInvariantField = "ciReadyReportValueRollbackCommandFieldRegistryInvariant";
const ciReadyReportValueRollbackCommandFieldSummary = `${ciReadyReportValueRollbackCommandFields.length} fields, first=${ciReadyReportValueRollbackCommandFields[0]}, last=${ciReadyReportValueRollbackCommandFields[ciReadyReportValueRollbackCommandFieldLastIndex]}`;
const ciReadyReportValueRollbackCommandFieldSummaryField = "ciReadyReportValueRollbackCommandFieldSummary";
const ciReadyReportValuesField = nextGateCiHandoff.readyWhen.reportValuesField;
const ciReadyReportValueKeysField = nextGateCiHandoff.readyWhen.reportValueKeysField;
const ciReadyReportValueCountField = nextGateCiHandoff.readyWhen.reportValueCountField;
const ciReadyReportValueSummaryField = nextGateCiHandoff.readyWhen.reportValueSummaryField;
const ciReadyReportValueEndpointsField = nextGateCiHandoff.readyWhen.reportValueEndpointsField;
const ciReadyReportValueEndpointSummaryField = nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField;
const ciReadyReportValueRegistryStatusField = nextGateCiHandoff.readyWhen.reportValueRegistryStatusField;
const ciReadyReportValueRegistryInvariantField = nextGateCiHandoff.readyWhen.reportValueRegistryInvariantField;
const ciReadyReportValueLastIndexField = nextGateCiHandoff.readyWhen.reportValueLastIndexField;
const ciReadyReportValueFirstField = nextGateCiHandoff.readyWhen.reportValueFirstField;
const ciReadyReportValueLastField = nextGateCiHandoff.readyWhen.reportValueLastField;
const ciReadyRequiredFields = nextGateCiHandoff.readyWhen.requiredFields;
const ciReadyRequiredFieldCount = nextGateCiHandoff.readyWhen.requiredFieldCount;
const ciReadyRequiredFieldsField = nextGateCiHandoff.readyWhen.requiredFieldsField;
const ciReadyRequiredFieldCountField = nextGateCiHandoff.readyWhen.requiredFieldCountField;
const ciReadyCommands = nextGateCiHandoff.readyWhen.commands;
const ciReadyCommandCount = nextGateCiHandoff.readyWhen.commandCount;
const ciReadyCommandsField = nextGateCiHandoff.readyWhen.commandsField;
const ciReadyCommandCountField = nextGateCiHandoff.readyWhen.commandCountField;
const ciAssertions = nextGateCiHandoff.assertions;
const ciAssertionCount = nextGateCiHandoff.assertionCount;
const ciAssertionsField = nextGateCiHandoff.assertionsField;
const ciAssertionCountField = nextGateCiHandoff.assertionCountField;
const ciReadyAssertionCount = nextGateCiHandoff.readyWhen.assertionCount;
const ciReadyAssertionCountField = nextGateCiHandoff.readyWhen.assertionCountField;
const ciAssertionMigrationStatusExpected = nextGateCiHandoff.assertions.migrationStatus.expected;
const ciAssertionMigrationStatusCommand = nextGateCiHandoff.assertions.migrationStatus.command;
const ciAssertionDatabaseUrlStatusExpected = nextGateCiHandoff.assertions.databaseUrlStatus.expected;
const ciAssertionDatabaseUrlStatusCommand = nextGateCiHandoff.assertions.databaseUrlStatus.command;
const ciAssertionDatabaseUrlProtocolExpected = nextGateCiHandoff.assertions.databaseUrlProtocol.expected;
const ciAssertionDatabaseUrlProtocolCommand = nextGateCiHandoff.assertions.databaseUrlProtocol.command;
const ciPassCriteria = nextGateCiHandoff.passCriteria;
const ciPassCriteriaCount = nextGateCiHandoff.passCriteriaCount;
const ciPassCriteriaField = nextGateCiHandoff.passCriteriaField;
const ciPassCriteriaCountField = nextGateCiHandoff.passCriteriaCountField;
const ciPassCriteriaMigrationStatus = nextGateCiHandoff.passCriteria.migrationStatus;
const ciPassCriteriaDatabaseUrlStatus = nextGateCiHandoff.passCriteria.databaseUrlStatus;
const ciPassCriteriaDatabaseUrlProtocol = nextGateCiHandoff.passCriteria.databaseUrlProtocol;
const nextGateCiHandoffPassCriteriaSummary = `migrationStatus=${ciPassCriteriaMigrationStatus}, databaseUrlStatus=${ciPassCriteriaDatabaseUrlStatus}, databaseUrlProtocol=${ciPassCriteriaDatabaseUrlProtocol.join("|")}`;
const nextGateCiHandoffPassCriteriaSummaryField = "nextGateCiHandoffPassCriteriaSummary";
const ciFailureCodes = nextGateCiHandoff.failureCodes;
const ciFailureCodeCount = nextGateCiHandoff.failureCodeCount;
const ciFailureCodesField = nextGateCiHandoff.failureCodesField;
const ciFailureCodeCountField = nextGateCiHandoff.failureCodeCountField;
const ciFailureCodeMigrationGuard = nextGateCiHandoff.failureCodes.migrationGuard;
const ciFailureCodeDbMatrixUnknownField = nextGateCiHandoff.failureCodes.dbMatrixUnknownField;
const ciFailureCodeStatusFieldMissing = nextGateCiHandoff.failureCodes.statusFieldMissing;
const nextGateCiHandoffFailureCodeSummary = `migrationGuard=${ciFailureCodeMigrationGuard}, dbMatrixUnknownField=${ciFailureCodeDbMatrixUnknownField}, statusFieldMissing=${ciFailureCodeStatusFieldMissing}`;
const nextGateCiHandoffFailureCodeSummaryField = "nextGateCiHandoffFailureCodeSummary";
const ciEvidenceDocs = nextGateCiHandoff.evidenceDocs;
const ciEvidenceDocCount = nextGateCiHandoff.evidenceDocCount;
const ciEvidenceDocsField = nextGateCiHandoff.evidenceDocsField;
const ciEvidenceDocCountField = nextGateCiHandoff.evidenceDocCountField;
const ciEvidenceDocNextGate = nextGateCiHandoff.evidenceDocs.nextGate;
const ciEvidenceDocDbConstraints = nextGateCiHandoff.evidenceDocs.dbConstraints;
const ciEvidenceDocStatus = nextGateCiHandoff.evidenceDocs.status;
const nextGateCiHandoffEvidenceDocSummary = `nextGate=${ciEvidenceDocNextGate}, dbConstraints=${ciEvidenceDocDbConstraints}, status=${ciEvidenceDocStatus}`;
const nextGateCiHandoffEvidenceDocSummaryField = "nextGateCiHandoffEvidenceDocSummary";
const ciWatchFields = nextGateCiHandoff.watchFields;
const ciWatchFieldCount = nextGateCiHandoff.watchFieldCount;
const ciWatchFieldsField = nextGateCiHandoff.watchFieldsField;
const ciWatchFieldCountField = nextGateCiHandoff.watchFieldCountField;
const ciWatchFieldMigrationStatus = nextGateCiHandoff.watchFields[0];
const ciWatchFieldDatabaseUrlStatus = nextGateCiHandoff.watchFields[1];
const ciWatchFieldDatabaseUrlProtocol = nextGateCiHandoff.watchFields[2];
const nextGateCiHandoffWatchFieldSummary = `migrationStatus=${ciWatchFieldMigrationStatus}, databaseUrlStatus=${ciWatchFieldDatabaseUrlStatus}, databaseUrlProtocol=${ciWatchFieldDatabaseUrlProtocol}`;
const nextGateCiHandoffWatchFieldSummaryField = "nextGateCiHandoffWatchFieldSummary";
const ciRequiredCheckCount = nextGateCiHandoff.requiredCheckCount;
const ciRequiredCheckCountField = nextGateCiHandoff.requiredCheckCountField;
const ciRequiredChecksSource = nextGateCiHandoff.requiredChecksSource;
const ciRequiredChecksSourceField = nextGateCiHandoff.requiredChecksSourceField;
const ciRequiredChecksParsed = nextGateCiHandoff.requiredChecksParsed;
const ciRequiredChecksParsedField = nextGateCiHandoff.requiredChecksParsedField;
const nextGateCiHandoffRequiredChecksSummary = `count=${ciRequiredCheckCount}, source=${ciRequiredChecksSource}, parsed=${ciRequiredChecksParsed}`;
const nextGateCiHandoffRequiredChecksSummaryField = "nextGateCiHandoffRequiredChecksSummary";
const ciReadiness = nextGateReadiness;
const ciReadinessField = nextGateCiHandoff.readinessField;
const ciReadinessVerifiedNowCount = nextGateReadiness.verifiedNowCount;
const ciReadinessTransitionCount = nextGateReadiness.transitionCount;
const ciTransitionPlan = nextGateTransitionPlan;
const ciTransitionPlanField = nextGateCiHandoff.transitionPlanField;
const ciTransitionPlanTransitionCount = nextGateTransitionPlan.count;
const nextGateCiHandoffReadinessTransitionSummary = `verifiedNow=${ciReadinessVerifiedNowCount}, readinessTransitions=${ciReadinessTransitionCount}, transitionPlan=${ciTransitionPlanTransitionCount}`;
const nextGateCiHandoffReadinessTransitionSummaryField = "nextGateCiHandoffReadinessTransitionSummary";
const ciTransitionMigrationStatusCommand = nextGateTransitionPlan.transitions.migrationStatus.command;
const ciTransitionMigrationStatusCurrentExpected = nextGateTransitionPlan.transitions.migrationStatus.currentExpected;
const ciTransitionMigrationStatusNextExpected = nextGateTransitionPlan.transitions.migrationStatus.nextExpected;
const ciTransitionDatabaseUrlStatusCommand = nextGateTransitionPlan.transitions.databaseUrlStatus.command;
const ciTransitionDatabaseUrlStatusCurrentExpected = nextGateTransitionPlan.transitions.databaseUrlStatus.currentExpected;
const ciTransitionDatabaseUrlStatusNextExpected = nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected;
const ciTransitionDatabaseUrlProtocolCommand = nextGateTransitionPlan.transitions.databaseUrlProtocol.command;
const ciTransitionDatabaseUrlProtocolCurrentExpected = nextGateTransitionPlan.transitions.databaseUrlProtocol.currentExpected;
const ciTransitionDatabaseUrlProtocolNextExpected = nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected;
const nextGateCiHandoffTransitionExpectedSummary = `migrationStatus=${ciTransitionMigrationStatusCurrentExpected}->${ciTransitionMigrationStatusNextExpected}, databaseUrlStatus=${ciTransitionDatabaseUrlStatusCurrentExpected}->${ciTransitionDatabaseUrlStatusNextExpected}, databaseUrlProtocol=${ciTransitionDatabaseUrlProtocolCurrentExpected}->${ciTransitionDatabaseUrlProtocolNextExpected.join("|")}`;
const nextGateCiHandoffTransitionExpectedSummaryField = "nextGateCiHandoffTransitionExpectedSummary";
const nextGateCiHandoffTransitionCommandSummary = `migrationStatus=${ciTransitionMigrationStatusCommand}, databaseUrlStatus=${ciTransitionDatabaseUrlStatusCommand}, databaseUrlProtocol=${ciTransitionDatabaseUrlProtocolCommand}`;
const nextGateCiHandoffTransitionCommandSummaryField = "nextGateCiHandoffTransitionCommandSummary";
const ciTransitionOrderedSteps = nextGateTransitionPlan.orderedSteps;
const ciTransitionOrderedStepCount = nextGateTransitionPlan.orderedSteps.length;
const ciTransitionOrderedStepSummary = nextGateTransitionPlan.orderedSteps.map((step) => step.id).join(" -> ");
const ciTransitionFirstStepId = nextGateTransitionPlan.orderedSteps[0]?.id ?? null;
const ciTransitionSecondStepId = nextGateTransitionPlan.orderedSteps[1]?.id ?? null;
const ciTransitionThirdStepId = nextGateTransitionPlan.orderedSteps[2]?.id ?? null;
const ciTransitionFirstStepCommand = nextGateTransitionPlan.orderedSteps[0]?.command ?? null;
const ciTransitionSecondStepCommand = nextGateTransitionPlan.orderedSteps[1]?.command ?? null;
const ciTransitionThirdStepCommand = nextGateTransitionPlan.orderedSteps[2]?.command ?? null;
const ciTransitionFirstStepTarget = nextGateTransitionPlan.orderedSteps[0]?.target ?? null;
const ciTransitionSecondStepTarget = nextGateTransitionPlan.orderedSteps[1]?.target ?? null;
const ciTransitionThirdStepTarget = nextGateTransitionPlan.orderedSteps[2]?.target ?? null;
const nextGateCiHandoffTransitionTargetSummary = `${ciTransitionFirstStepId}=${ciTransitionFirstStepTarget}, ${ciTransitionSecondStepId}=${ciTransitionSecondStepTarget}, ${ciTransitionThirdStepId}=${ciTransitionThirdStepTarget}`;
const nextGateCiHandoffTransitionTargetSummaryField = "nextGateCiHandoffTransitionTargetSummary";
const ciRollback = nextGateCiHandoff.rollback;
const ciRollbackMode = nextGateCiHandoff.rollback.mode;
const ciRollbackModeField = nextGateCiHandoff.rollback.modeField;
const ciRollbackExpectedMode = nextGateCiHandoff.rollback.expectedMode;
const ciRollbackExpectedModeField = nextGateCiHandoff.rollback.expectedModeField;
const nextGateCiHandoffRollbackModeSummary = `mode=${ciRollbackMode}, expected=${ciRollbackExpectedMode}`;
const nextGateCiHandoffRollbackModeSummaryField = "nextGateCiHandoffRollbackModeSummary";
const ciRollbackSummary = nextGateCiHandoff.rollback.summary;
const ciRollbackSummaryField = nextGateCiHandoff.rollback.summaryField;
const ciRollbackCommand = nextGateCiHandoff.rollback.command;
const ciRollbackCommandField = nextGateCiHandoff.rollback.commandField;
const ciRollbackCommands = nextGateCiHandoff.rollback.commands;
const ciRollbackCommandsField = nextGateCiHandoff.rollback.commandsField;
const ciRollbackFirstCommand = nextGateCiHandoff.rollback.commands[0] ?? null;
const ciRollbackFirstCommandField = "nextGateCiHandoff.rollback.commands.0";
const ciRollbackSecondCommand = nextGateCiHandoff.rollback.commands[1] ?? null;
const ciRollbackSecondCommandField = "nextGateCiHandoff.rollback.commands.1";
const ciRollbackThirdCommand = nextGateCiHandoff.rollback.commands[2] ?? null;
const ciRollbackThirdCommandField = "nextGateCiHandoff.rollback.commands.2";
const nextGateCiHandoffRollbackCommandSequenceSummary = ciRollbackCommands.join(" -> ");
const nextGateCiHandoffRollbackCommandSequenceSummaryField = "nextGateCiHandoffRollbackCommandSequenceSummary";
const ciRollbackVerificationCommand = nextGateCiHandoff.rollback.verificationCommand;
const ciRollbackVerificationCommandField = nextGateCiHandoff.rollback.verificationCommandField;
const ciRollbackReportCommand = nextGateCiHandoff.rollback.reportCommand;
const ciRollbackReportCommandField = nextGateCiHandoff.rollback.reportCommandField;
const nextGateCiHandoffRollbackVerificationReportSummary = `verify=${ciRollbackVerificationCommand}, report=${ciRollbackReportCommand}`;
const nextGateCiHandoffRollbackVerificationReportSummaryField = "nextGateCiHandoffRollbackVerificationReportSummary";
const ciRollbackCommandCount = nextGateCiHandoff.rollback.commandCount;
const ciRollbackCommandCountField = nextGateCiHandoff.rollback.commandCountField;
const ciRollbackCommandLastIndex = nextGateCiHandoff.rollback.commandLastIndex;
const ciRollbackCommandLastIndexField = nextGateCiHandoff.rollback.commandLastIndexField;
const nextGateCiHandoffRollbackCommandCountSummary = `count=${ciRollbackCommandCount}, lastIndex=${ciRollbackCommandLastIndex}`;
const nextGateCiHandoffRollbackCommandCountSummaryField = "nextGateCiHandoffRollbackCommandCountSummary";
const ciRollbackCommandFirst = nextGateCiHandoff.rollback.commandFirst;
const ciRollbackCommandFirstField = nextGateCiHandoff.rollback.commandFirstField;
const ciRollbackCommandLast = nextGateCiHandoff.rollback.commandLast;
const ciRollbackCommandLastField = nextGateCiHandoff.rollback.commandLastField;
const nextGateCiHandoffRollbackCommandFieldSummary = `firstField=${ciRollbackCommandFirstField}, lastField=${ciRollbackCommandLastField}`;
const nextGateCiHandoffRollbackCommandFieldSummaryField = "nextGateCiHandoffRollbackCommandFieldSummary";
const ciRollbackCommandEndpoints = nextGateCiHandoff.rollback.commandEndpoints;
const ciRollbackCommandEndpointsField = nextGateCiHandoff.rollback.commandEndpointsField;
const ciRollbackCommandEndpointSummary = nextGateCiHandoff.rollback.commandEndpointSummary;
const ciRollbackCommandEndpointSummaryField = nextGateCiHandoff.rollback.commandEndpointSummaryField;
const nextGateCiHandoffRollbackEndpointFieldSummary = `endpointsField=${ciRollbackCommandEndpointsField}, endpointSummaryField=${ciRollbackCommandEndpointSummaryField}`;
const nextGateCiHandoffRollbackEndpointFieldSummaryField = "nextGateCiHandoffRollbackEndpointFieldSummary";
const ciRollbackCommandRegistryStatus = nextGateCiHandoff.rollback.commandRegistryStatus;
const ciRollbackCommandRegistryStatusField = nextGateCiHandoff.rollback.commandRegistryStatusField;
const ciRollbackCommandRegistryInvariant = nextGateCiHandoff.rollback.commandRegistryInvariant;
const ciRollbackCommandRegistryInvariantField = nextGateCiHandoff.rollback.commandRegistryInvariantField;
const nextGateCiHandoffRollbackRegistryFieldSummary = `statusField=${ciRollbackCommandRegistryStatusField}, invariantField=${ciRollbackCommandRegistryInvariantField}`;
const nextGateCiHandoffRollbackRegistryFieldSummaryField = "nextGateCiHandoffRollbackRegistryFieldSummary";
const nextGateCiHandoffRollbackMode = nextGateCiHandoff.rollback.mode;
const nextGateCiHandoffRollbackModeField = "nextGateCiHandoff.rollback.mode";
const nextGateCiHandoffRollbackSummary = nextGateCiHandoff.rollback.summary;
const nextGateCiHandoffRollbackSummaryField = "nextGateCiHandoff.rollback.summary";
const nextGateCiHandoffRollbackCommandEndpointSummary = nextGateCiHandoff.rollback.commandEndpointSummary;
const nextGateCiHandoffRollbackCommandEndpointSummaryField = "nextGateCiHandoff.rollback.commandEndpointSummary";
const nextGateCiHandoffRollbackCommandRegistrySummary = `${ciRollbackCommandRegistryStatus}: ${ciRollbackCommandRegistryInvariant}, ${ciRollbackCommandEndpointSummary}`;
const nextGateCiHandoffRollbackCommandRegistrySummaryField = "nextGateCiHandoffRollbackCommandRegistrySummary";
const nextGateCiHandoffRollbackTopSummary = `${nextGateCiHandoffRollbackMode}: ${nextGateCiHandoffRollbackSummary}`;
const nextGateCiHandoffRollbackTopSummaryField = "nextGateCiHandoffRollbackTopSummary";
const nextGateCiHandoffRollbackTopFieldSummary = `modeField=${nextGateCiHandoffRollbackModeField}, summaryField=${nextGateCiHandoffRollbackSummaryField}, topSummaryField=${nextGateCiHandoffRollbackTopSummaryField}`;
const nextGateCiHandoffRollbackTopFieldSummaryField = "nextGateCiHandoffRollbackTopFieldSummary";
const nextGateRequiredChecksSummary = {
  count: nextGateRequiredChecks.length,
  source: nextGateRequiredChecksSource,
  parsed: nextGateRequiredChecksParsed,
  byType: nextGateRequiredChecksByType,
  byTypeKeys: nextGateRequiredCheckTypeKeys,
  byTypeKeysField: "nextGateRequiredChecksSummary.byTypeKeys",
  byTypeCount: nextGateRequiredCheckTypeKeys.length,
  byTypeCountField: "nextGateRequiredChecksSummary.byTypeCount",
  byTypeLastIndex: nextGateRequiredCheckTypeLastIndex,
  byTypeLastIndexField: "nextGateRequiredChecksSummary.byTypeLastIndex",
  byTypeFirst: nextGateRequiredCheckTypeKeys[0] ?? null,
  byTypeFirstField: "nextGateRequiredChecksSummary.byTypeFirst",
  byTypeLast: nextGateRequiredCheckTypeKeys[nextGateRequiredCheckTypeLastIndex] ?? null,
  byTypeLastField: "nextGateRequiredChecksSummary.byTypeLast",
  byTypeRegistryStatus: "consistent",
  byTypeRegistryStatusField: "nextGateRequiredChecksSummary.byTypeRegistryStatus",
  byTypeRegistryInvariant: `count=${nextGateRequiredCheckTypeKeys.length},lastIndex=${nextGateRequiredCheckTypeLastIndex}`,
  byTypeRegistryInvariantField: "nextGateRequiredChecksSummary.byTypeRegistryInvariant",
  commands: nextGateRequiredChecks
};
const nextGateRequiredChecksSummaryField = "nextGateRequiredChecksSummary";
const nextGateRequiredChecksSummaryCountField = "nextGateRequiredChecksSummary.count";
const nextGateRequiredChecksSummarySourceField = "nextGateRequiredChecksSummary.source";
const nextGateRequiredChecksSummaryParsedField = "nextGateRequiredChecksSummary.parsed";
const nextGateRequiredChecksCompactSummary = `${nextGateRequiredChecks.length} checks, parsed=${nextGateRequiredChecksParsed}, source=${nextGateRequiredChecksSource}`;
const nextGateRequiredChecksCompactSummaryField = "nextGateRequiredChecksCompactSummary";
const nextGateRequiredChecksByTypeSummary = nextGateRequiredCheckTypeKeys.map((type) => `${type}=${nextGateRequiredChecksByType[type]?.count ?? 0}`).join(", ");
const nextGateRequiredChecksByTypeSummaryField = "nextGateRequiredChecksByTypeSummary";
const nextGateRequiredChecksByTypeEndpointSummary = `first=${nextGateRequiredChecksSummary.byTypeFirst}, last=${nextGateRequiredChecksSummary.byTypeLast}`;
const nextGateRequiredChecksByTypeEndpointSummaryField = "nextGateRequiredChecksByTypeEndpointSummary";
const nextGateRequiredChecksByTypeRegistrySummary = `${nextGateRequiredChecksSummary.byTypeRegistryStatus}: ${nextGateRequiredChecksSummary.byTypeRegistryInvariant}`;
const nextGateRequiredChecksByTypeRegistrySummaryField = "nextGateRequiredChecksByTypeRegistrySummary";
const nextGateRequiredChecksByTypeFieldSummary = `keysField=${nextGateRequiredChecksSummary.byTypeKeysField}, countField=${nextGateRequiredChecksSummary.byTypeCountField}, firstField=${nextGateRequiredChecksSummary.byTypeFirstField}, lastField=${nextGateRequiredChecksSummary.byTypeLastField}`;
const nextGateRequiredChecksByTypeFieldSummaryField = "nextGateRequiredChecksByTypeFieldSummary";
const nextGateRequiredChecksByTypeCommandCountSummary = nextGateRequiredCheckTypeKeys.map((type) => `${type}Commands=${nextGateRequiredChecksByType[type]?.commands?.length ?? 0}`).join(", ");
const nextGateRequiredChecksByTypeCommandCountSummaryField = "nextGateRequiredChecksByTypeCommandCountSummary";
const nextGateRequiredChecksByTypeCommandEndpointSummary = nextGateRequiredCheckTypeKeys
  .map((type) => {
    const commands = nextGateRequiredChecksByType[type]?.commands ?? [];
    return `${type}: first=${commands[0] ?? "none"}, last=${commands[commands.length - 1] ?? "none"}`;
  })
  .join(" | ");
const nextGateRequiredChecksByTypeCommandEndpointSummaryField = "nextGateRequiredChecksByTypeCommandEndpointSummary";
const nextGateRequiredChecksByTypeCommandRegistrySummary = nextGateRequiredCheckTypeKeys
  .map((type) => `${type}=${nextGateRequiredChecksByType[type]?.commandRegistryInvariant ?? "missing"}`)
  .join(", ");
const nextGateRequiredChecksByTypeCommandRegistrySummaryField = "nextGateRequiredChecksByTypeCommandRegistrySummary";
const nextGateRequiredChecksByTypeCommandRegistryStatusSummary = nextGateRequiredCheckTypeKeys
  .map((type) => `${type}=${nextGateRequiredChecksByType[type]?.commandRegistryStatus ?? "missing"}`)
  .join(", ");
const nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField = "nextGateRequiredChecksByTypeCommandRegistryStatusSummary";
const nextGateRequiredChecksByTypeCommandFieldSummary = nextGateRequiredCheckTypeKeys
  .map((type) => `${type}CommandsField=${nextGateRequiredChecksByType[type]?.commandsField ?? "missing"}`)
  .join(", ");
const nextGateRequiredChecksByTypeCommandFieldSummaryField = "nextGateRequiredChecksByTypeCommandFieldSummary";
const nextGateDbMatrix = {
  checkCommand: nextGateCheckCommand,
  jsonCommand: nextGateCheckJsonCommand,
  migrationStatusCommand: nextGateMigrationStatusCommand,
  migrationStatus: nextGateMigrationStatus,
  prismaScaffold: nextGatePrismaScaffold,
  prismaScaffoldStatus: nextGatePrismaScaffoldStatus,
  seedParityStatus: nextGateSeedParityStatus,
  databaseUrl: nextGateDatabaseUrl,
  migrationGuard: nextGateMigrationGuard,
  requiredChecksSource: nextGateRequiredChecksSource,
  requiredChecksParsed: nextGateRequiredChecksParsed,
  requiredChecksSummary: nextGateRequiredChecksSummary,
  readiness: nextGateReadiness,
  transitionPlan: nextGateTransitionPlan,
  ciHandoff: nextGateCiHandoff,
  requiredChecks: nextGateRequiredChecks
};
const nextGateDbMatrixField = "nextGateDbMatrix";
const nextGateDbMatrixCheckCommandField = "nextGateDbMatrix.checkCommand";
const nextGateDbMatrixJsonCommandField = "nextGateDbMatrix.jsonCommand";
const nextGateDbMatrixMigrationStatusCommandField = "nextGateDbMatrix.migrationStatusCommand";
const nextGateDbMatrixDatabaseUrlExpectedStatusField = "nextGateDbMatrix.databaseUrl.expectedStatus";
const nextGateDbMatrixPrismaScaffoldStatusSummaryField = "nextGateDbMatrix.prismaScaffoldStatus.summary";
const nextGateDbMatrixSeedParityStatusSummaryField = "nextGateDbMatrix.seedParityStatus.summary";
const nextGateDbMatrixRequiredChecksSourceField = "nextGateDbMatrix.requiredChecksSource";
const nextGateDbMatrixRequiredChecksParsedField = "nextGateDbMatrix.requiredChecksParsed";
const nextGateDbMatrixSummary = `check=${nextGateDbMatrix.checkCommand}, json=${nextGateDbMatrix.jsonCommand}, requiredChecks=${nextGateRequiredChecks.length}`;
const nextGateDbMatrixSummaryField = "nextGateDbMatrixSummary";
const persistenceModeDefault = "fixture";
const persistenceModeDefaultField = "persistenceModeDefault";
const supportedPersistenceModes = ["fixture", "database"];
const supportedPersistenceModeCount = supportedPersistenceModes.length;
const supportedPersistenceModeCountField = "supportedPersistenceModeCount";
const supportedPersistenceModeFirst = supportedPersistenceModes[0] ?? null;
const supportedPersistenceModeFirstField = "supportedPersistenceModeFirst";
const supportedPersistenceModeLastIndex = supportedPersistenceModes.length - 1;
const supportedPersistenceModeLastIndexField = "supportedPersistenceModeLastIndex";
const supportedPersistenceModeLast = supportedPersistenceModes[supportedPersistenceModeLastIndex] ?? null;
const supportedPersistenceModeLastField = "supportedPersistenceModeLast";
const supportedPersistenceModeSummary = `${supportedPersistenceModes.length} modes, default=${persistenceModeDefault}, first=${supportedPersistenceModeFirst}, last=${supportedPersistenceModeLast}`;
const supportedPersistenceModeSummaryField = "supportedPersistenceModeSummary";
const latestAndroidDeviceSmoke = buildDeviceSmokeSummary(deviceResult);
const latestAndroidDeviceSmokeField = "latestAndroidDeviceSmoke";
const latestAndroidDeviceSmokeStatusField = "latestAndroidDeviceSmoke.status";
const latestAndroidDeviceSmokeRunIdField = "latestAndroidDeviceSmoke.runId";
const latestAndroidDeviceSmokeManufacturerField = "latestAndroidDeviceSmoke.deviceManufacturer";
const latestAndroidDeviceSmokeModelField = "latestAndroidDeviceSmoke.deviceModel";
const latestAndroidDeviceSmokeAndroidReleaseField = "latestAndroidDeviceSmoke.androidRelease";
const latestAndroidDeviceSmokeAndroidSdkField = "latestAndroidDeviceSmoke.androidSdk";
const latestAndroidDeviceSmokeDevice = latestAndroidDeviceSmoke ? [latestAndroidDeviceSmoke.deviceManufacturer, latestAndroidDeviceSmoke.deviceModel].filter(Boolean).join(" ") : null;
const latestAndroidDeviceSmokeDeviceField = "latestAndroidDeviceSmokeDevice";
const latestAndroidDeviceSmokeAndroid = latestAndroidDeviceSmoke ? [latestAndroidDeviceSmoke.androidRelease && `Android ${latestAndroidDeviceSmoke.androidRelease}`, latestAndroidDeviceSmoke.androidSdk && `API ${latestAndroidDeviceSmoke.androidSdk}`].filter(Boolean).join(" / ") : null;
const latestAndroidDeviceSmokeAndroidField = "latestAndroidDeviceSmokeAndroid";
const latestAndroidDeviceSmokeSummary = latestAndroidDeviceSmoke ? `${latestAndroidDeviceSmoke.status} (${latestAndroidDeviceSmokeDevice || "device unknown"}${latestAndroidDeviceSmokeAndroid ? `, ${latestAndroidDeviceSmokeAndroid}` : ""}, ${latestAndroidDeviceSmoke.runId ?? "run unknown"})` : "no saved result";
const latestAndroidDeviceSmokeSummaryField = "latestAndroidDeviceSmokeSummary";
const summary = {
  currentStatus,
  currentStatusField,
  currentStatusSummary,
  currentStatusSummaryField,
  progressPercent,
  progressBasis,
  progressBasisSummary,
  ciReadyStatus,
  ciReadySummary,
  ciReadyReportValues,
  ciReadyReportValueKeys,
  ciReadyReportValueCount,
  ciReadyReportValueSummary,
  ciReadyReportValueEndpoints,
  ciReadyReportValueEndpointSummary,
  ciReadyReportValueRegistryStatus,
  ciReadyReportValueRegistryInvariant,
  ciReadyReportValueLastIndex,
  ciReadyReportValueFirst,
  ciReadyReportValueLast,
  ciReadyReportValueRollbackCommandFirst,
  ciReadyReportValueRollbackCommandFirstField,
  ciReadyReportValueRollbackCommandLast,
  ciReadyReportValueRollbackCommandLastField,
  ciReadyReportValueRollbackCommandEndpointSummary,
  ciReadyReportValueRollbackCommandEndpointSummaryField,
  ciReadyReportValueRollbackCommandFields,
  ciReadyReportValueRollbackCommandFieldsField,
  ciReadyReportValueRollbackCommandField0,
  ciReadyReportValueRollbackCommandField0Field,
  ciReadyReportValueRollbackCommandField1,
  ciReadyReportValueRollbackCommandField1Field,
  ciReadyReportValueRollbackCommandField2,
  ciReadyReportValueRollbackCommandField2Field,
  ciReadyReportValueRollbackCommandFieldIndexes,
  ciReadyReportValueRollbackCommandFieldIndexesField,
  ciReadyReportValueRollbackCommandFieldIndexCount,
  ciReadyReportValueRollbackCommandFieldIndexCountField,
  ciReadyReportValueRollbackCommandFieldIndexSummary,
  ciReadyReportValueRollbackCommandFieldIndexSummaryField,
  ciReadyReportValueRollbackCommandFieldCount,
  ciReadyReportValueRollbackCommandFieldCountField,
  ciReadyReportValueRollbackCommandFieldLastIndex,
  ciReadyReportValueRollbackCommandFieldLastIndexField,
  ciReadyReportValueRollbackCommandFieldFirst,
  ciReadyReportValueRollbackCommandFieldFirstField,
  ciReadyReportValueRollbackCommandFieldLast,
  ciReadyReportValueRollbackCommandFieldLastField,
  ciReadyReportValueRollbackCommandFieldEndpoints,
  ciReadyReportValueRollbackCommandFieldEndpointsField,
  ciReadyReportValueRollbackCommandFieldEndpointSummary,
  ciReadyReportValueRollbackCommandFieldEndpointSummaryField,
  ciReadyReportValueRollbackCommandFieldRegistryStatus,
  ciReadyReportValueRollbackCommandFieldRegistryStatusField,
  ciReadyReportValueRollbackCommandFieldRegistryInvariant,
  ciReadyReportValueRollbackCommandFieldRegistryInvariantField,
  ciReadyReportValueRollbackCommandFieldSummary,
  ciReadyReportValueRollbackCommandFieldSummaryField,
  ciReadyReportValuesField,
  ciReadyReportValueKeysField,
  ciReadyReportValueCountField,
  ciReadyReportValueSummaryField,
  ciReadyReportValueEndpointsField,
  ciReadyReportValueEndpointSummaryField,
  ciReadyReportValueRegistryStatusField,
  ciReadyReportValueRegistryInvariantField,
  ciReadyReportValueLastIndexField,
  ciReadyReportValueFirstField,
  ciReadyReportValueLastField,
  ciReadyRequiredFields,
  ciReadyRequiredFieldCount,
  ciReadyRequiredFieldsField,
  ciReadyRequiredFieldCountField,
  ciReadyCommands,
  ciReadyCommandCount,
  ciReadyCommandsField,
  ciReadyCommandCountField,
  ciAssertions,
  ciAssertionCount,
  ciAssertionsField,
  ciAssertionCountField,
  ciReadyAssertionCount,
  ciReadyAssertionCountField,
  ciAssertionMigrationStatusExpected,
  ciAssertionMigrationStatusCommand,
  ciAssertionDatabaseUrlStatusExpected,
  ciAssertionDatabaseUrlStatusCommand,
  ciAssertionDatabaseUrlProtocolExpected,
  ciAssertionDatabaseUrlProtocolCommand,
  ciPassCriteria,
  ciPassCriteriaCount,
  ciPassCriteriaField,
  ciPassCriteriaCountField,
  ciPassCriteriaMigrationStatus,
  ciPassCriteriaDatabaseUrlStatus,
  ciPassCriteriaDatabaseUrlProtocol,
  nextGateCiHandoffPassCriteriaSummary,
  nextGateCiHandoffPassCriteriaSummaryField,
  ciFailureCodes,
  ciFailureCodeCount,
  ciFailureCodesField,
  ciFailureCodeCountField,
  ciFailureCodeMigrationGuard,
  ciFailureCodeDbMatrixUnknownField,
  ciFailureCodeStatusFieldMissing,
  nextGateCiHandoffFailureCodeSummary,
  nextGateCiHandoffFailureCodeSummaryField,
  ciEvidenceDocs,
  ciEvidenceDocCount,
  ciEvidenceDocsField,
  ciEvidenceDocCountField,
  ciEvidenceDocNextGate,
  ciEvidenceDocDbConstraints,
  ciEvidenceDocStatus,
  nextGateCiHandoffEvidenceDocSummary,
  nextGateCiHandoffEvidenceDocSummaryField,
  ciWatchFields,
  ciWatchFieldCount,
  ciWatchFieldsField,
  ciWatchFieldCountField,
  ciWatchFieldMigrationStatus,
  ciWatchFieldDatabaseUrlStatus,
  ciWatchFieldDatabaseUrlProtocol,
  nextGateCiHandoffWatchFieldSummary,
  nextGateCiHandoffWatchFieldSummaryField,
  ciRequiredCheckCount,
  ciRequiredCheckCountField,
  ciRequiredChecksSource,
  ciRequiredChecksSourceField,
  ciRequiredChecksParsed,
  ciRequiredChecksParsedField,
  nextGateCiHandoffRequiredChecksSummary,
  nextGateCiHandoffRequiredChecksSummaryField,
  ciReadiness,
  ciReadinessField,
  ciReadinessVerifiedNowCount,
  ciReadinessTransitionCount,
  ciTransitionPlan,
  ciTransitionPlanField,
  ciTransitionPlanTransitionCount,
  nextGateCiHandoffReadinessTransitionSummary,
  nextGateCiHandoffReadinessTransitionSummaryField,
  ciTransitionMigrationStatusCommand,
  ciTransitionMigrationStatusCurrentExpected,
  ciTransitionMigrationStatusNextExpected,
  ciTransitionDatabaseUrlStatusCommand,
  ciTransitionDatabaseUrlStatusCurrentExpected,
  ciTransitionDatabaseUrlStatusNextExpected,
  ciTransitionDatabaseUrlProtocolCommand,
  ciTransitionDatabaseUrlProtocolCurrentExpected,
  ciTransitionDatabaseUrlProtocolNextExpected,
  nextGateCiHandoffTransitionExpectedSummary,
  nextGateCiHandoffTransitionExpectedSummaryField,
  nextGateCiHandoffTransitionCommandSummary,
  nextGateCiHandoffTransitionCommandSummaryField,
  ciTransitionOrderedSteps,
  ciTransitionOrderedStepCount,
  ciTransitionOrderedStepSummary,
  ciTransitionFirstStepId,
  ciTransitionSecondStepId,
  ciTransitionThirdStepId,
  ciTransitionFirstStepCommand,
  ciTransitionSecondStepCommand,
  ciTransitionThirdStepCommand,
  ciTransitionFirstStepTarget,
  ciTransitionSecondStepTarget,
  ciTransitionThirdStepTarget,
  nextGateCiHandoffTransitionTargetSummary,
  nextGateCiHandoffTransitionTargetSummaryField,
  ciRollback,
  ciRollbackMode,
  ciRollbackModeField,
  ciRollbackExpectedMode,
  ciRollbackExpectedModeField,
  nextGateCiHandoffRollbackModeSummary,
  nextGateCiHandoffRollbackModeSummaryField,
  ciRollbackSummary,
  ciRollbackSummaryField,
  ciRollbackCommand,
  ciRollbackCommandField,
  ciRollbackCommands,
  ciRollbackCommandsField,
  ciRollbackFirstCommand,
  ciRollbackFirstCommandField,
  ciRollbackSecondCommand,
  ciRollbackSecondCommandField,
  ciRollbackThirdCommand,
  ciRollbackThirdCommandField,
  nextGateCiHandoffRollbackCommandSequenceSummary,
  nextGateCiHandoffRollbackCommandSequenceSummaryField,
  ciRollbackVerificationCommand,
  ciRollbackVerificationCommandField,
  ciRollbackReportCommand,
  ciRollbackReportCommandField,
  nextGateCiHandoffRollbackVerificationReportSummary,
  nextGateCiHandoffRollbackVerificationReportSummaryField,
  ciRollbackCommandCount,
  ciRollbackCommandCountField,
  ciRollbackCommandLastIndex,
  ciRollbackCommandLastIndexField,
  nextGateCiHandoffRollbackCommandCountSummary,
  nextGateCiHandoffRollbackCommandCountSummaryField,
  ciRollbackCommandFirst,
  ciRollbackCommandFirstField,
  ciRollbackCommandLast,
  ciRollbackCommandLastField,
  nextGateCiHandoffRollbackCommandFieldSummary,
  nextGateCiHandoffRollbackCommandFieldSummaryField,
  ciRollbackCommandEndpoints,
  ciRollbackCommandEndpointsField,
  ciRollbackCommandEndpointSummary,
  ciRollbackCommandEndpointSummaryField,
  nextGateCiHandoffRollbackEndpointFieldSummary,
  nextGateCiHandoffRollbackEndpointFieldSummaryField,
  ciRollbackCommandRegistryStatus,
  ciRollbackCommandRegistryStatusField,
  ciRollbackCommandRegistryInvariant,
  ciRollbackCommandRegistryInvariantField,
  nextGateCiHandoffRollbackRegistryFieldSummary,
  nextGateCiHandoffRollbackRegistryFieldSummaryField,
  nextGateCiHandoffRollbackMode,
  nextGateCiHandoffRollbackModeField,
  nextGateCiHandoffRollbackSummary,
  nextGateCiHandoffRollbackSummaryField,
  nextGateCiHandoffRollbackCommandEndpointSummary,
  nextGateCiHandoffRollbackCommandEndpointSummaryField,
  nextGateCiHandoffRollbackCommandRegistrySummary,
  nextGateCiHandoffRollbackCommandRegistrySummaryField,
  nextGateCiHandoffRollbackTopSummary,
  nextGateCiHandoffRollbackTopSummaryField,
  nextGateCiHandoffRollbackTopFieldSummary,
  nextGateCiHandoffRollbackTopFieldSummaryField,
  completedLocally,
  completedLocallyCount,
  completedLocallyCountField,
  completedLocallyFirst,
  completedLocallyFirstField,
  completedLocallyLastIndex,
  completedLocallyLastIndexField,
  completedLocallyLast,
  completedLocallyLastField,
  completedLocallyRegistryStatus,
  completedLocallyRegistryStatusField,
  completedLocallyRegistryInvariant,
  completedLocallyRegistryInvariantField,
  completedLocallySummary,
  completedLocallySummaryField,
  fullTestBaseline,
  fullTestBaselineField,
  fullTestBaselineCommand,
  fullTestBaselineCommandField,
  fullTestBaselineSummary,
  fullTestBaselineSummaryField,
  localApiBoundaryChecks,
  localApiBoundaryCheckCount,
  localApiBoundaryCheckCountField,
  localApiBoundaryCheckFirst,
  localApiBoundaryCheckFirstField,
  localApiBoundaryCheckLastIndex,
  localApiBoundaryCheckLastIndexField,
  localApiBoundaryCheckLast,
  localApiBoundaryCheckLastField,
  localApiBoundaryCheckSummary,
  localApiBoundaryCheckSummaryField,
  stillNotDone,
  remainingBlockersSummary,
  remainingBlockersSummaryField,
  remainingBlockerCount,
  remainingBlockerCountField,
  remainingBlockerFirst,
  remainingBlockerFirstField,
  remainingBlockerLastIndex,
  remainingBlockerLastIndexField,
  remainingBlockerLast,
  remainingBlockerLastField,
  remainingBlockerRegistryStatus,
  remainingBlockerRegistryStatusField,
  remainingBlockerRegistryInvariant,
  remainingBlockerRegistryInvariantField,
  remainingBlockerFields,
  remainingBlockerFieldsField,
  remainingBlockerFieldIndexes,
  remainingBlockerFieldIndexesField,
  remainingBlockerFieldCount,
  remainingBlockerFieldCountField,
  remainingBlockerFieldLastIndex,
  remainingBlockerFieldLastIndexField,
  remainingBlockerFieldFirst,
  remainingBlockerFieldFirstField,
  remainingBlockerFieldLast,
  remainingBlockerFieldLastField,
  remainingBlockerFieldRegistryStatus,
  remainingBlockerFieldRegistryStatusField,
  remainingBlockerFieldRegistryInvariant,
  remainingBlockerFieldRegistryInvariantField,
  remainingBlockerFieldSummary,
  remainingBlockerFieldSummaryField,
  productionBlockersSummary,
  productionBlockersSummaryField,
  productionBlockerCount,
  productionBlockerCountField,
  productionGateOrderDetailsSummary,
  productionGateOrderDetailsSummaryField,
  productionBlockerFields,
  productionBlockerFieldsField,
  productionBlockerFieldIndexes,
  productionBlockerFieldIndexesField,
  productionBlockerFieldCount,
  productionBlockerFieldCountField,
  productionBlockerFieldLastIndex,
  productionBlockerFieldLastIndexField,
  productionBlockerFieldFirst,
  productionBlockerFieldFirstField,
  productionBlockerFieldLast,
  productionBlockerFieldLastField,
  productionBlockerFieldRegistryStatus,
  productionBlockerFieldRegistryStatusField,
  productionBlockerFieldRegistryInvariant,
  productionBlockerFieldRegistryInvariantField,
  productionBlockerFieldSummary,
  productionBlockerFieldSummaryField,
  relatedDocs,
  relatedDocCount,
  relatedDocCountField,
  relatedDocFirst,
  relatedDocFirstField,
  relatedDocLastIndex,
  relatedDocLastIndexField,
  relatedDocLast,
  relatedDocLastField,
  relatedDocSummary,
  relatedDocSummaryField,
  persistenceModeDefault,
  persistenceModeDefaultField,
  supportedPersistenceModes,
  supportedPersistenceModeCount,
  supportedPersistenceModeCountField,
  supportedPersistenceModeFirst,
  supportedPersistenceModeFirstField,
  supportedPersistenceModeLastIndex,
  supportedPersistenceModeLastIndexField,
  supportedPersistenceModeLast,
  supportedPersistenceModeLastField,
  supportedPersistenceModeSummary,
  supportedPersistenceModeSummaryField,
  latestAndroidDeviceSmoke,
  latestAndroidDeviceSmokeField,
  latestAndroidDeviceSmokeStatusField,
  latestAndroidDeviceSmokeRunIdField,
  latestAndroidDeviceSmokeManufacturerField,
  latestAndroidDeviceSmokeModelField,
  latestAndroidDeviceSmokeAndroidReleaseField,
  latestAndroidDeviceSmokeAndroidSdkField,
  latestAndroidDeviceSmokeDevice,
  latestAndroidDeviceSmokeDeviceField,
  latestAndroidDeviceSmokeAndroid,
  latestAndroidDeviceSmokeAndroidField,
  latestAndroidDeviceSmokeSummary,
  latestAndroidDeviceSmokeSummaryField,
  nextGate,
  nextGateField,
  nextGateDoc,
  nextGateDocField,
  nextGateDocPath,
  nextGateDocPathField,
  nextGateCommand,
  nextGateCommandField,
  nextGateSummary,
  nextGateSummaryField,
  nextGateCheckCommand,
  nextGateCheckCommandField,
  nextGateCheckJsonCommand,
  nextGateCheckJsonCommandField,
  nextGateCheckCommandSummary,
  nextGateCheckCommandSummaryField,
  nextGateMigrationStatusCommand,
  nextGateMigrationStatusCommandField,
  nextGateMigrationStatus,
  nextGateMigrationStatusField,
  nextGateMigrationStatusCurrentExpectedStatusField,
  nextGateMigrationStatusNextExpectedStatusField,
  nextGateMigrationStatusGuardCommandField,
  nextGateMigrationStatusSummary,
  nextGateMigrationStatusSummaryField,
  nextGatePrismaScaffold,
  nextGatePrismaScaffoldField,
  nextGatePrismaScaffoldSchemaPathField,
  nextGatePrismaScaffoldMigrationsPathField,
  nextGatePrismaScaffoldSchemaPresentCommandField,
  nextGatePrismaScaffoldMigrationsPresentCommandField,
  nextGatePrismaScaffoldExpectedPresentField,
  nextGatePrismaScaffoldSummary,
  nextGatePrismaScaffoldSummaryField,
  prismaScaffoldStatusSummary,
  nextGateSeedParityStatus,
  nextGateSeedParityStatusField,
  nextGateSeedParityStatusSummaryField,
  nextGateDatabaseUrlStatusCommand,
  nextGateDatabaseUrlStatusCommandField,
  nextGateDatabaseUrlProtocolCommand,
  nextGateDatabaseUrlProtocolCommandField,
  nextGateDatabaseUrlValidationCommand,
  nextGateDatabaseUrlValidationCommandField,
  nextGateDatabaseUrlExpectedStatus,
  nextGateDatabaseUrlExpectedStatusField,
  nextGateDatabaseUrlExpectedProtocols,
  nextGateDatabaseUrlExpectedProtocolsField,
  nextGateDatabaseUrl,
  nextGateDatabaseUrlField,
  nextGateDatabaseUrlExpectedStatusNestedField,
  nextGateDatabaseUrlExpectedProtocolsNestedField,
  nextGateDatabaseUrlSummary,
  nextGateDatabaseUrlSummaryField,
  nextGateMigrationGuardCommand,
  nextGateMigrationGuardCommandField,
  nextGateMigrationGuardMigrationCommand,
  nextGateMigrationGuardMigrationCommandField,
  nextGateMigrationGuardHelperCommand,
  nextGateMigrationGuardHelperCommandField,
  nextGateMigrationGuardErrorCode,
  nextGateMigrationGuardErrorCodeField,
  nextGateMigrationGuard,
  nextGateMigrationGuardField,
  nextGateMigrationGuardErrorCodeNestedField,
  nextGateMigrationGuardSummary,
  nextGateMigrationGuardSummaryField,
  nextGateDbMatrix,
  nextGateDbMatrixField,
  nextGateDbMatrixCheckCommandField,
  nextGateDbMatrixJsonCommandField,
  nextGateDbMatrixMigrationStatusCommandField,
  nextGateDbMatrixDatabaseUrlExpectedStatusField,
  nextGateDbMatrixPrismaScaffoldStatusSummaryField,
  nextGateDbMatrixSeedParityStatusSummaryField,
  nextGateDbMatrixRequiredChecksSourceField,
  nextGateDbMatrixRequiredChecksParsedField,
  nextGateDbMatrixSummary,
  nextGateDbMatrixSummaryField,
  nextGateRequiredChecksSource,
  nextGateRequiredChecksSourceField,
  nextGateRequiredChecksParsed,
  nextGateRequiredChecksParsedField,
  nextGateRequiredChecksSummary,
  nextGateRequiredChecksSummaryField,
  nextGateRequiredChecksSummaryCountField,
  nextGateRequiredChecksSummarySourceField,
  nextGateRequiredChecksSummaryParsedField,
  nextGateRequiredChecksCompactSummary,
  nextGateRequiredChecksCompactSummaryField,
  nextGateRequiredChecksByTypeSummary,
  nextGateRequiredChecksByTypeSummaryField,
  nextGateRequiredChecksByTypeEndpointSummary,
  nextGateRequiredChecksByTypeEndpointSummaryField,
  nextGateRequiredChecksByTypeRegistrySummary,
  nextGateRequiredChecksByTypeRegistrySummaryField,
  nextGateRequiredChecksByTypeFieldSummary,
  nextGateRequiredChecksByTypeFieldSummaryField,
  nextGateRequiredChecksByTypeCommandCountSummary,
  nextGateRequiredChecksByTypeCommandCountSummaryField,
  nextGateRequiredChecksByTypeCommandEndpointSummary,
  nextGateRequiredChecksByTypeCommandEndpointSummaryField,
  nextGateRequiredChecksByTypeCommandRegistrySummary,
  nextGateRequiredChecksByTypeCommandRegistrySummaryField,
  nextGateRequiredChecksByTypeCommandRegistryStatusSummary,
  nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField,
  nextGateRequiredChecksByTypeCommandFieldSummary,
  nextGateRequiredChecksByTypeCommandFieldSummaryField,
  nextGateRequiredChecksByType,
  nextGateReadiness,
  nextGateReadinessField,
  nextGateReadinessVerifiedNowCountField,
  nextGateReadinessTransitionCountField,
  nextGateReadinessVerifiedNowCommandsField,
  nextGateReadinessTransitionCommandsField,
  nextGateReadinessSummary,
  nextGateReadinessSummaryField,
  nextGateTransitionPlan,
  nextGateTransitionPlanField,
  nextGateTransitionPlanCountField,
  nextGateTransitionPlanMigrationStatusNextExpectedField,
  nextGateTransitionPlanDatabaseUrlStatusNextExpectedField,
  nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField,
  nextGateTransitionPlanOrderedStepsField,
  nextGateTransitionPlanFirstStepIdField,
  nextGateTransitionPlanStepSummary,
  nextGateTransitionPlanStepSummaryField,
  nextGateTransitionPlanSummary,
  nextGateTransitionPlanSummaryField,
  nextGateCiHandoff,
  nextGateCiHandoffField,
  nextGateCiHandoffRequiredCheckCountFieldAlias,
  nextGateCiHandoffWatchFieldCountFieldAlias,
  nextGateCiHandoffCommandCountFieldAlias,
  nextGateCiHandoffSummary,
  nextGateCiHandoffSummaryField,
  nextGateCiHandoffReadyStatus,
  nextGateCiHandoffReadyStatusField,
  nextGateCiHandoffReadySummary,
  nextGateCiHandoffReadySummaryField,
  nextGateCiHandoffReadyTopSummary,
  nextGateCiHandoffReadyTopSummaryField,
  nextGateRequiredChecksField,
  nextGateRequiredChecks
};

if (requestedField) {
  const value = getField(summary, requestedField);
  if (value === undefined) {
    console.error(`TM_GATE0_STATUS_FIELD_MISSING\n${requestedField} is not present in Gate 0 status summary.`);
    process.exit(1);
  }
  console.log(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value));
  await flushStdout();
  process.exit(0);
}

if (shouldPrintJson) {
  console.log(JSON.stringify(summary, null, 2));
  await flushStdout();
  process.exit(0);
}

console.log(`Gate 0 status: ${currentStatus}`);
console.log(`Progress: ${progressPercent}%`);
if (completedLocally.length > 0) {
  console.log(`Completed locally: ${completedLocally.join("; ")}`);
}
console.log(`Full test baseline: ${fullTestBaseline}`);
if (localApiBoundaryChecks.length > 0) {
  console.log(`Local API boundary checks: ${localApiBoundaryChecks.join(", ")}`);
}
if (stillNotDone.length > 0) {
  console.log(`Still not done: ${stillNotDone.join("; ")}`);
}
console.log(`Production blockers summary: ${productionBlockersSummary.count} blockers, next=${productionBlockersSummary.nextGateBlocker} -> ${productionBlockersSummary.nextGateDocPath}`);
if (relatedDocs.length > 0) {
  console.log(`Related docs: ${relatedDocs.join(", ")}`);
}
console.log(`Persistence default: ${persistenceModeDefault}`);
console.log(`Supported persistence modes: ${supportedPersistenceModes.join(", ")}`);

if (latestAndroidDeviceSmoke) {
  const device = [latestAndroidDeviceSmoke.deviceManufacturer, latestAndroidDeviceSmoke.deviceModel].filter(Boolean).join(" ");
  const android = [latestAndroidDeviceSmoke.androidRelease && `Android ${latestAndroidDeviceSmoke.androidRelease}`, latestAndroidDeviceSmoke.androidSdk && `API ${latestAndroidDeviceSmoke.androidSdk}`].filter(Boolean).join(" / ");
  console.log(`Latest Android device smoke: ${latestAndroidDeviceSmoke.status} (${device || "device unknown"}${android ? `, ${android}` : ""}, ${latestAndroidDeviceSmoke.runId ?? "run unknown"})`);
} else {
  console.log("Latest Android device smoke: no saved result");
}

console.log(`Next gate: ${nextGate}`);
console.log(`Next gate doc: ${nextGateDoc}`);
console.log(`Next gate doc path: ${nextGateDocPath}`);
console.log(`Next gate command: ${nextGateCommand}`);
console.log(`Next gate check command: ${nextGateCheckCommand}`);
console.log(`Next gate check JSON command: ${nextGateCheckJsonCommand}`);
console.log(`Next gate migration status command: ${nextGateMigrationStatusCommand}`);
console.log(`Next gate migration status handoff: ${nextGateMigrationStatus.currentExpectedStatus} -> ${nextGateMigrationStatus.nextExpectedStatus}`);
console.log(`Next gate Prisma scaffold: ${nextGatePrismaScaffold.schemaPath}, ${nextGatePrismaScaffold.migrationsPath} -> ${nextGatePrismaScaffold.expectedPresent}`);
console.log(`Next gate database URL status command: ${nextGateDatabaseUrlStatusCommand}`);
console.log(`Next gate database URL protocol command: ${nextGateDatabaseUrlProtocolCommand}`);
console.log(`Next gate database URL validation command: ${nextGateDatabaseUrlValidationCommand}`);
console.log(`Next gate database URL expected status: ${nextGateDatabaseUrlExpectedStatus}`);
console.log(`Next gate database URL expected protocols: ${nextGateDatabaseUrlExpectedProtocols.join(", ")}`);
console.log(`Next gate database URL handoff: ${nextGateDatabaseUrl.statusCommand} -> ${nextGateDatabaseUrl.expectedStatus}`);
console.log(`Next gate migration guard command: ${nextGateMigrationGuardCommand}`);
console.log(`Next gate migration guard migration command: ${nextGateMigrationGuardMigrationCommand}`);
console.log(`Next gate migration guard helper command: ${nextGateMigrationGuardHelperCommand}`);
console.log(`Next gate migration guard error code: ${nextGateMigrationGuardErrorCode}`);
console.log(`Next gate migration guard: ${nextGateMigrationGuard.command} -> ${nextGateMigrationGuard.migrationCommand} -> ${nextGateMigrationGuard.errorCode}`);
console.log(`Next gate DB matrix handoff: ${nextGateDbMatrix.jsonCommand} -> ${nextGateDbMatrix.migrationStatusCommand}`);
console.log(`Next gate required checks source: ${nextGateRequiredChecksSource}`);
console.log(`Next gate required checks parsed: ${nextGateRequiredChecksParsed}`);
console.log(`Next gate required checks summary: ${nextGateRequiredChecksSummary.count} checks from ${nextGateRequiredChecksSummary.source}`);
console.log(`Next gate required checks by type: ${formatRequiredCheckGroups(nextGateRequiredChecksByType)}`);
console.log(`Next gate readiness: ${nextGateReadiness.verifiedNowCount} verified now, ${nextGateReadiness.transitionCount} transition checks`);
console.log(`Next gate transition plan: ${nextGateTransitionPlan.count} transitions -> ${formatTransitionTargets(nextGateTransitionPlan)}`);
console.log(`Next gate transition steps: ${nextGateTransitionPlan.orderedSteps.map((step) => step.id).join(" -> ")}`);
console.log(`Next gate CI handoff: ${nextGateCiHandoff.watchFields.length} watch fields, ${nextGateCiHandoff.requiredCheckCount} required checks`);
console.log(`Next gate required checks: ${nextGateRequiredChecks.join(", ")}`);

async function readDeviceResult() {
  try {
    return JSON.parse(await readFile(deviceResultPath, "utf8"));
  } catch {
    return null;
  }
}

async function readOptionalText(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function pathExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

function firstMatch(text, pattern) {
  return pattern.exec(text)?.[1] ?? null;
}

function listSectionItems(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${heading}:`);
  if (start === -1) return [];

  const items = [];
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const item = /^- `(.+)`$/.exec(trimmed)?.[1] ?? /^- (.+)$/.exec(trimmed)?.[1];
    if (!item) break;
    items.push(item);
  }
  return items;
}

function buildProgressBasis(completed, remaining) {
  const total = completed.length + remaining.length;
  return {
    completedCount: completed.length,
    remainingCount: remaining.length,
    totalCount: total,
    percent: total === 0 ? 0 : Math.round((completed.length / total) * 100)
  };
}

function buildProductionBlockersSummary(blockers, nextGateName, nextGateDocPathValue) {
  const lastIndex = blockers.length - 1;
  const nextGateBlocker = blockers.find((blocker) => blocker === "Production backend persistence.") ?? blockers[0] ?? null;
  const byGate = buildProductionBlockersByGate(blockers);
  const byGateKeys = Object.keys(byGate);
  const byGateLastIndex = byGateKeys.length - 1;
  const preGateKey = "gate1Prep";
  const gateOrder = byGateKeys.filter((key) => key !== preGateKey);
  const gateOrderLastIndex = gateOrder.length - 1;
  const gateOrderDetails = gateOrder.map((key) => ({ key, ...byGate[key] }));
  const gateOrderDetailsLastIndex = gateOrderDetails.length - 1;
  const gateOrderDetailsSummary = gateOrderDetails
    .map((detail) => `${detail.key}: ${detail.blocker} -> ${detail.docPath}`)
    .join(" | ");
  return {
    count: blockers.length,
    countField: "productionBlockersSummary.count",
    first: blockers[0] ?? null,
    firstField: "productionBlockersSummary.first",
    last: blockers[lastIndex] ?? null,
    lastField: "productionBlockersSummary.last",
    lastIndex,
    lastIndexField: "productionBlockersSummary.lastIndex",
    registryStatus: "consistent",
    registryStatusField: "productionBlockersSummary.registryStatus",
    registryInvariant: `count=${blockers.length},lastIndex=${lastIndex}`,
    registryInvariantField: "productionBlockersSummary.registryInvariant",
    nextGateBlocker,
    nextGateBlockerField: "productionBlockersSummary.nextGateBlocker",
    nextGate: nextGateName,
    nextGateField: "productionBlockersSummary.nextGate",
    nextGateDocPath: nextGateDocPathValue,
    nextGateDocPathField: "productionBlockersSummary.nextGateDocPath",
    byGate,
    byGateField: "productionBlockersSummary.byGate",
    byGateKeys,
    byGateKeysField: "productionBlockersSummary.byGateKeys",
    byGateCount: byGateKeys.length,
    byGateCountField: "productionBlockersSummary.byGateCount",
    byGateLastIndex,
    byGateLastIndexField: "productionBlockersSummary.byGateLastIndex",
    byGateFirst: byGateKeys[0] ?? null,
    byGateFirstField: "productionBlockersSummary.byGateFirst",
    byGateLast: byGateKeys[byGateLastIndex] ?? null,
    byGateLastField: "productionBlockersSummary.byGateLast",
    byGateRegistryStatus: "consistent",
    byGateRegistryStatusField: "productionBlockersSummary.byGateRegistryStatus",
    byGateRegistryInvariant: `count=${byGateKeys.length},lastIndex=${byGateLastIndex}`,
    byGateRegistryInvariantField: "productionBlockersSummary.byGateRegistryInvariant",
    preGateKey,
    preGateKeyField: "productionBlockersSummary.preGateKey",
    gateOrder,
    gateOrderField: "productionBlockersSummary.gateOrder",
    gateOrderCount: gateOrder.length,
    gateOrderCountField: "productionBlockersSummary.gateOrderCount",
    gateOrderLastIndex,
    gateOrderLastIndexField: "productionBlockersSummary.gateOrderLastIndex",
    gateOrderFirst: gateOrder[0] ?? null,
    gateOrderFirstField: "productionBlockersSummary.gateOrderFirst",
    gateOrderLast: gateOrder[gateOrderLastIndex] ?? null,
    gateOrderLastField: "productionBlockersSummary.gateOrderLast",
    gateOrderRegistryStatus: "consistent",
    gateOrderRegistryStatusField: "productionBlockersSummary.gateOrderRegistryStatus",
    gateOrderRegistryInvariant: `count=${gateOrder.length},lastIndex=${gateOrderLastIndex}`,
    gateOrderRegistryInvariantField: "productionBlockersSummary.gateOrderRegistryInvariant",
    gateOrderDetails,
    gateOrderDetailsField: "productionBlockersSummary.gateOrderDetails",
    gateOrderDetailsCount: gateOrderDetails.length,
    gateOrderDetailsCountField: "productionBlockersSummary.gateOrderDetailsCount",
    gateOrderDetailsLastIndex,
    gateOrderDetailsLastIndexField: "productionBlockersSummary.gateOrderDetailsLastIndex",
    gateOrderDetailsFirst: gateOrderDetails[0]?.key ?? null,
    gateOrderDetailsFirstField: "productionBlockersSummary.gateOrderDetailsFirst",
    gateOrderDetailsLast: gateOrderDetails[gateOrderDetailsLastIndex]?.key ?? null,
    gateOrderDetailsLastField: "productionBlockersSummary.gateOrderDetailsLast",
    gateOrderDetailsRegistryStatus: "consistent",
    gateOrderDetailsRegistryStatusField: "productionBlockersSummary.gateOrderDetailsRegistryStatus",
    gateOrderDetailsRegistryInvariant: `count=${gateOrderDetails.length},lastIndex=${gateOrderDetailsLastIndex}`,
    gateOrderDetailsRegistryInvariantField: "productionBlockersSummary.gateOrderDetailsRegistryInvariant",
    gateOrderDetailsSummary,
    gateOrderDetailsSummaryField: "productionBlockersSummary.gateOrderDetailsSummary",
    blockersField: "productionBlockersSummary.blockers",
    blockers
  };
}

function buildProductionBlockersByGate(blockers) {
  return {
    gate1Prep: {
      gate: "Gate 1 prep",
      blocker: blockers[0] ?? null,
      docPath: "docs/dev/PRODUCTION_GAPS.md"
    },
    gate1: {
      gate: "Gate 1 production backend persistence",
      blocker: blockers[1] ?? null,
      docPath: "docs/dev/GATE1_PERSISTENCE.md"
    },
    gate2: {
      gate: "Gate 2 AWS CI/deploy pipeline",
      blocker: blockers[2] ?? null,
      docPath: "docs/dev/CI.md"
    },
    gate3: {
      gate: "Gate 3 Figma source of truth",
      blocker: blockers[3] ?? null,
      docPath: "docs/dev/DESIGN_STATUS.md"
    },
    gate4: {
      gate: "Gate 4 release signing",
      blocker: blockers[4] ?? null,
      docPath: "docs/dev/ROADMAP.md"
    }
  };
}

function buildDeviceSmokeSummary(result) {
  if (!result) return null;
  return {
    status: result.status ?? "unknown",
    runId: result.runId ?? null,
    deviceManufacturer: result.deviceManufacturer ?? null,
    deviceModel: result.deviceModel ?? null,
    androidRelease: result.androidRelease ?? null,
    androidSdk: result.androidSdk ?? null
  };
}

function parseRequiredChecks(text) {
  const match = /## Required Checks\s+```[^\n]*\n([\s\S]*?)```/m.exec(text);
  if (!match) return null;
  const checks = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("npm ") || line.startsWith("node "));
  return checks.length > 0 ? checks : null;
}

function parseFieldArg(argv) {
  const equalsArg = argv.find((arg) => arg.startsWith("--field="));
  if (equalsArg) return equalsArg.slice("--field=".length);
  const fieldIndex = argv.indexOf("--field");
  if (fieldIndex === -1) return null;
  const field = argv[fieldIndex + 1];
  if (!field || field.startsWith("--")) {
    console.error("TM_GATE0_STATUS_FIELD_REQUIRED\nPass a field name after --field.");
    process.exit(1);
  }
  return field;
}

function validateArgs(argv) {
  const knownOptions = new Set(["--field", "--help", "--json"]);
  let fieldValueShouldFollow = false;
  let fieldCount = 0;

  for (const arg of argv.slice(2)) {
    if (fieldValueShouldFollow) {
      fieldValueShouldFollow = false;
      continue;
    }

    if (arg === "--field") {
      fieldCount += 1;
      fieldValueShouldFollow = true;
      continue;
    }

    if (arg.startsWith("--field=")) {
      fieldCount += 1;
      continue;
    }

    if (arg.startsWith("--") && !knownOptions.has(arg)) {
      console.error(`TM_GATE0_STATUS_UNKNOWN_OPTION\nUnknown option: ${arg}`);
      process.exit(1);
    }
  }

  if (shouldPrintJson && requestedField) {
    console.error("TM_GATE0_STATUS_OPTION_CONFLICT\nUse only one of --json or --field.");
    process.exit(1);
  }

  if (fieldCount > 1) {
    console.error("TM_GATE0_STATUS_OPTION_CONFLICT\nUse --field only once.");
    process.exit(1);
  }
}

function getField(source, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => {
    if (value === null || value === undefined || typeof value !== "object") return undefined;
    return value[key];
  }, source);
}

function printHelp() {
  console.log("Usage: npm run gate0:status -- [--json | --field <name> | --help]");
  console.log("");
  console.log("Options:");
  console.log("  --json        Print a compact machine-readable Gate 0 status summary.");
  console.log("  --field NAME  Print one summary field, such as currentStatus or latestAndroidDeviceSmoke.status.");
  console.log("  --help        Print this help.");
  console.log("");
  console.log("Stable fields:");
  for (const field of [
    "currentStatus",
    "currentStatusField",
    "currentStatusSummary",
    "currentStatusSummaryField",
    "progressPercent",
    "progressBasis",
    "progressBasis.completedCount",
    "progressBasis.remainingCount",
    "progressBasis.totalCount",
    "progressBasis.percent",
    "progressBasisSummary",
    "ciReadyStatus",
    "ciReadySummary",
    "ciReadyReportValues",
    "ciReadyReportValueKeys",
    "ciReadyReportValueCount",
    "ciReadyReportValueSummary",
    "ciReadyReportValueEndpoints",
    "ciReadyReportValueEndpointSummary",
    "ciReadyReportValueRegistryStatus",
    "ciReadyReportValueRegistryInvariant",
    "ciReadyReportValueLastIndex",
    "ciReadyReportValueFirst",
    "ciReadyReportValueLast",
    "ciReadyReportValueRollbackCommandFirst",
    "ciReadyReportValueRollbackCommandFirstField",
    "ciReadyReportValueRollbackCommandLast",
    "ciReadyReportValueRollbackCommandLastField",
    "ciReadyReportValueRollbackCommandEndpointSummary",
    "ciReadyReportValueRollbackCommandEndpointSummaryField",
    "ciReadyReportValueRollbackCommandFields",
    "ciReadyReportValueRollbackCommandFieldsField",
    "ciReadyReportValueRollbackCommandField0",
    "ciReadyReportValueRollbackCommandField0Field",
    "ciReadyReportValueRollbackCommandField1",
    "ciReadyReportValueRollbackCommandField1Field",
    "ciReadyReportValueRollbackCommandField2",
    "ciReadyReportValueRollbackCommandField2Field",
    "ciReadyReportValueRollbackCommandFieldIndexes",
    "ciReadyReportValueRollbackCommandFieldIndexesField",
    "ciReadyReportValueRollbackCommandFieldIndexCount",
    "ciReadyReportValueRollbackCommandFieldIndexCountField",
    "ciReadyReportValueRollbackCommandFieldIndexSummary",
    "ciReadyReportValueRollbackCommandFieldIndexSummaryField",
    "ciReadyReportValueRollbackCommandFieldCount",
    "ciReadyReportValueRollbackCommandFieldCountField",
    "ciReadyReportValueRollbackCommandFieldLastIndex",
    "ciReadyReportValueRollbackCommandFieldLastIndexField",
    "ciReadyReportValueRollbackCommandFieldFirst",
    "ciReadyReportValueRollbackCommandFieldFirstField",
    "ciReadyReportValueRollbackCommandFieldLast",
    "ciReadyReportValueRollbackCommandFieldLastField",
    "ciReadyReportValueRollbackCommandFieldEndpoints",
    "ciReadyReportValueRollbackCommandFieldEndpointsField",
    "ciReadyReportValueRollbackCommandFieldEndpointSummary",
    "ciReadyReportValueRollbackCommandFieldEndpointSummaryField",
    "ciReadyReportValueRollbackCommandFieldRegistryStatus",
    "ciReadyReportValueRollbackCommandFieldRegistryStatusField",
    "ciReadyReportValueRollbackCommandFieldRegistryInvariant",
    "ciReadyReportValueRollbackCommandFieldRegistryInvariantField",
    "ciReadyReportValueRollbackCommandFieldSummary",
    "ciReadyReportValueRollbackCommandFieldSummaryField",
    "ciReadyReportValuesField",
    "ciReadyReportValueKeysField",
    "ciReadyReportValueCountField",
    "ciReadyReportValueSummaryField",
    "ciReadyReportValueEndpointsField",
    "ciReadyReportValueEndpointSummaryField",
    "ciReadyReportValueRegistryStatusField",
    "ciReadyReportValueRegistryInvariantField",
    "ciReadyReportValueLastIndexField",
    "ciReadyReportValueFirstField",
    "ciReadyReportValueLastField",
    "ciReadyRequiredFields",
    "ciReadyRequiredFieldCount",
    "ciReadyRequiredFieldsField",
    "ciReadyRequiredFieldCountField",
    "ciReadyCommands",
    "ciReadyCommandCount",
    "ciReadyCommandsField",
    "ciReadyCommandCountField",
    "ciAssertions",
    "ciAssertionCount",
    "ciAssertionsField",
    "ciAssertionCountField",
    "ciReadyAssertionCount",
    "ciReadyAssertionCountField",
    "ciAssertionMigrationStatusExpected",
    "ciAssertionMigrationStatusCommand",
    "ciAssertionDatabaseUrlStatusExpected",
    "ciAssertionDatabaseUrlStatusCommand",
    "ciAssertionDatabaseUrlProtocolExpected",
    "ciAssertionDatabaseUrlProtocolCommand",
    "ciPassCriteria",
    "ciPassCriteriaCount",
    "ciPassCriteriaField",
    "ciPassCriteriaCountField",
    "ciPassCriteriaMigrationStatus",
    "ciPassCriteriaDatabaseUrlStatus",
    "ciPassCriteriaDatabaseUrlProtocol",
    "nextGateCiHandoffPassCriteriaSummary",
    "nextGateCiHandoffPassCriteriaSummaryField",
    "ciFailureCodes",
    "ciFailureCodeCount",
    "ciFailureCodesField",
    "ciFailureCodeCountField",
    "ciFailureCodeMigrationGuard",
    "ciFailureCodeDbMatrixUnknownField",
    "ciFailureCodeStatusFieldMissing",
    "nextGateCiHandoffFailureCodeSummary",
    "nextGateCiHandoffFailureCodeSummaryField",
    "ciEvidenceDocs",
    "ciEvidenceDocCount",
    "ciEvidenceDocsField",
    "ciEvidenceDocCountField",
    "ciEvidenceDocNextGate",
    "ciEvidenceDocDbConstraints",
    "ciEvidenceDocStatus",
    "nextGateCiHandoffEvidenceDocSummary",
    "nextGateCiHandoffEvidenceDocSummaryField",
    "ciWatchFields",
    "ciWatchFieldCount",
    "ciWatchFieldsField",
    "ciWatchFieldCountField",
    "ciWatchFieldMigrationStatus",
    "ciWatchFieldDatabaseUrlStatus",
    "ciWatchFieldDatabaseUrlProtocol",
    "nextGateCiHandoffWatchFieldSummary",
    "nextGateCiHandoffWatchFieldSummaryField",
    "ciRequiredCheckCount",
    "ciRequiredCheckCountField",
    "ciRequiredChecksSource",
    "ciRequiredChecksSourceField",
    "ciRequiredChecksParsed",
    "ciRequiredChecksParsedField",
    "nextGateCiHandoffRequiredChecksSummary",
    "nextGateCiHandoffRequiredChecksSummaryField",
    "ciReadiness",
    "ciReadinessField",
    "ciReadinessVerifiedNowCount",
    "ciReadinessTransitionCount",
    "ciTransitionPlan",
    "ciTransitionPlanField",
    "ciTransitionPlanTransitionCount",
    "nextGateCiHandoffReadinessTransitionSummary",
    "nextGateCiHandoffReadinessTransitionSummaryField",
    "ciTransitionMigrationStatusCommand",
    "ciTransitionMigrationStatusCurrentExpected",
    "ciTransitionMigrationStatusNextExpected",
    "ciTransitionDatabaseUrlStatusCommand",
    "ciTransitionDatabaseUrlStatusCurrentExpected",
    "ciTransitionDatabaseUrlStatusNextExpected",
    "ciTransitionDatabaseUrlProtocolCommand",
    "ciTransitionDatabaseUrlProtocolCurrentExpected",
    "ciTransitionDatabaseUrlProtocolNextExpected",
    "nextGateCiHandoffTransitionExpectedSummary",
    "nextGateCiHandoffTransitionExpectedSummaryField",
    "nextGateCiHandoffTransitionCommandSummary",
    "nextGateCiHandoffTransitionCommandSummaryField",
    "ciTransitionOrderedSteps",
    "ciTransitionOrderedStepCount",
    "ciTransitionOrderedStepSummary",
    "ciTransitionFirstStepId",
    "ciTransitionSecondStepId",
    "ciTransitionThirdStepId",
    "ciTransitionFirstStepCommand",
    "ciTransitionSecondStepCommand",
    "ciTransitionThirdStepCommand",
    "ciTransitionFirstStepTarget",
    "ciTransitionSecondStepTarget",
    "ciTransitionThirdStepTarget",
    "nextGateCiHandoffTransitionTargetSummary",
    "nextGateCiHandoffTransitionTargetSummaryField",
    "ciRollback",
    "ciRollbackMode",
    "ciRollbackModeField",
    "ciRollbackExpectedMode",
    "ciRollbackExpectedModeField",
    "nextGateCiHandoffRollbackModeSummary",
    "nextGateCiHandoffRollbackModeSummaryField",
    "ciRollbackSummary",
    "ciRollbackSummaryField",
    "ciRollbackCommand",
    "ciRollbackCommandField",
    "ciRollbackCommands",
    "ciRollbackCommandsField",
    "ciRollbackFirstCommand",
    "ciRollbackFirstCommandField",
    "ciRollbackSecondCommand",
    "ciRollbackSecondCommandField",
    "ciRollbackThirdCommand",
    "ciRollbackThirdCommandField",
    "nextGateCiHandoffRollbackCommandSequenceSummary",
    "nextGateCiHandoffRollbackCommandSequenceSummaryField",
    "ciRollbackVerificationCommand",
    "ciRollbackVerificationCommandField",
    "ciRollbackReportCommand",
    "ciRollbackReportCommandField",
    "nextGateCiHandoffRollbackVerificationReportSummary",
    "nextGateCiHandoffRollbackVerificationReportSummaryField",
    "ciRollbackCommandCount",
    "ciRollbackCommandCountField",
    "ciRollbackCommandLastIndex",
    "ciRollbackCommandLastIndexField",
    "nextGateCiHandoffRollbackCommandCountSummary",
    "nextGateCiHandoffRollbackCommandCountSummaryField",
    "ciRollbackCommandFirst",
    "ciRollbackCommandFirstField",
    "ciRollbackCommandLast",
    "ciRollbackCommandLastField",
    "nextGateCiHandoffRollbackCommandFieldSummary",
    "nextGateCiHandoffRollbackCommandFieldSummaryField",
    "ciRollbackCommandEndpoints",
    "ciRollbackCommandEndpointsField",
    "ciRollbackCommandEndpointSummary",
    "ciRollbackCommandEndpointSummaryField",
    "nextGateCiHandoffRollbackEndpointFieldSummary",
    "nextGateCiHandoffRollbackEndpointFieldSummaryField",
    "ciRollbackCommandRegistryStatus",
    "ciRollbackCommandRegistryStatusField",
    "ciRollbackCommandRegistryInvariant",
    "ciRollbackCommandRegistryInvariantField",
    "nextGateCiHandoffRollbackRegistryFieldSummary",
    "nextGateCiHandoffRollbackRegistryFieldSummaryField",
    "nextGateCiHandoffRollbackMode",
    "nextGateCiHandoffRollbackModeField",
    "nextGateCiHandoffRollbackSummary",
    "nextGateCiHandoffRollbackSummaryField",
    "nextGateCiHandoffRollbackCommandEndpointSummary",
    "nextGateCiHandoffRollbackCommandEndpointSummaryField",
    "nextGateCiHandoffRollbackCommandRegistrySummary",
    "nextGateCiHandoffRollbackCommandRegistrySummaryField",
    "nextGateCiHandoffRollbackTopSummary",
    "nextGateCiHandoffRollbackTopSummaryField",
    "nextGateCiHandoffRollbackTopFieldSummary",
    "nextGateCiHandoffRollbackTopFieldSummaryField",
    "completedLocally",
    "completedLocallyCount",
    "completedLocallyCountField",
    "completedLocallyFirst",
    "completedLocallyFirstField",
    "completedLocallyLastIndex",
    "completedLocallyLastIndexField",
    "completedLocallyLast",
    "completedLocallyLastField",
    "completedLocallyRegistryStatus",
    "completedLocallyRegistryStatusField",
    "completedLocallyRegistryInvariant",
    "completedLocallyRegistryInvariantField",
    "completedLocallySummary",
    "completedLocallySummaryField",
    "fullTestBaseline",
    "fullTestBaselineField",
    "fullTestBaselineCommand",
    "fullTestBaselineCommandField",
    "fullTestBaselineSummary",
    "fullTestBaselineSummaryField",
    "localApiBoundaryChecks",
    "localApiBoundaryChecks.0",
    "localApiBoundaryChecks.1",
    "localApiBoundaryCheckCount",
    "localApiBoundaryCheckCountField",
    "localApiBoundaryCheckFirst",
    "localApiBoundaryCheckFirstField",
    "localApiBoundaryCheckLastIndex",
    "localApiBoundaryCheckLastIndexField",
    "localApiBoundaryCheckLast",
    "localApiBoundaryCheckLastField",
    "localApiBoundaryCheckSummary",
    "localApiBoundaryCheckSummaryField",
    "stillNotDone",
    "stillNotDone.0",
    "stillNotDone.4",
    "remainingBlockersSummary",
    "remainingBlockersSummaryField",
    "remainingBlockerCount",
    "remainingBlockerCountField",
    "remainingBlockerFirst",
    "remainingBlockerFirstField",
    "remainingBlockerLastIndex",
    "remainingBlockerLastIndexField",
    "remainingBlockerLast",
    "remainingBlockerLastField",
    "remainingBlockerRegistryStatus",
    "remainingBlockerRegistryStatusField",
    "remainingBlockerRegistryInvariant",
    "remainingBlockerRegistryInvariantField",
    "remainingBlockerFields",
    "remainingBlockerFieldsField",
    "remainingBlockerFieldIndexes",
    "remainingBlockerFieldIndexesField",
    "remainingBlockerFieldCount",
    "remainingBlockerFieldCountField",
    "remainingBlockerFieldLastIndex",
    "remainingBlockerFieldLastIndexField",
    "remainingBlockerFieldFirst",
    "remainingBlockerFieldFirstField",
    "remainingBlockerFieldLast",
    "remainingBlockerFieldLastField",
    "remainingBlockerFieldRegistryStatus",
    "remainingBlockerFieldRegistryStatusField",
    "remainingBlockerFieldRegistryInvariant",
    "remainingBlockerFieldRegistryInvariantField",
    "remainingBlockerFieldSummary",
    "remainingBlockerFieldSummaryField",
    "productionBlockersSummary",
    "productionBlockersSummaryField",
    "productionBlockerCount",
    "productionBlockerCountField",
    "productionGateOrderDetailsSummary",
    "productionGateOrderDetailsSummaryField",
    "productionBlockerFields",
    "productionBlockerFieldsField",
    "productionBlockerFieldIndexes",
    "productionBlockerFieldIndexesField",
    "productionBlockerFieldCount",
    "productionBlockerFieldCountField",
    "productionBlockerFieldLastIndex",
    "productionBlockerFieldLastIndexField",
    "productionBlockerFieldFirst",
    "productionBlockerFieldFirstField",
    "productionBlockerFieldLast",
    "productionBlockerFieldLastField",
    "productionBlockerFieldRegistryStatus",
    "productionBlockerFieldRegistryStatusField",
    "productionBlockerFieldRegistryInvariant",
    "productionBlockerFieldRegistryInvariantField",
    "productionBlockerFieldSummary",
    "productionBlockerFieldSummaryField",
    "prismaScaffoldStatusSummary",
    "productionBlockersSummary.count",
    "productionBlockersSummary.countField",
    "productionBlockersSummary.first",
    "productionBlockersSummary.last",
    "productionBlockersSummary.lastIndex",
    "productionBlockersSummary.lastIndexField",
    "productionBlockersSummary.registryStatus",
    "productionBlockersSummary.registryStatusField",
    "productionBlockersSummary.registryInvariant",
    "productionBlockersSummary.registryInvariantField",
    "productionBlockersSummary.nextGateBlocker",
    "productionBlockersSummary.nextGateBlockerField",
    "productionBlockersSummary.nextGate",
    "productionBlockersSummary.nextGateField",
    "productionBlockersSummary.nextGateDocPath",
    "productionBlockersSummary.nextGateDocPathField",
    "productionBlockersSummary.byGate",
    "productionBlockersSummary.byGateField",
    "productionBlockersSummary.byGateKeys",
    "productionBlockersSummary.byGateKeysField",
    "productionBlockersSummary.byGateCount",
    "productionBlockersSummary.byGateCountField",
    "productionBlockersSummary.byGateLastIndex",
    "productionBlockersSummary.byGateLastIndexField",
    "productionBlockersSummary.byGateFirst",
    "productionBlockersSummary.byGateFirstField",
    "productionBlockersSummary.byGateLast",
    "productionBlockersSummary.byGateLastField",
    "productionBlockersSummary.byGateRegistryStatus",
    "productionBlockersSummary.byGateRegistryStatusField",
    "productionBlockersSummary.byGateRegistryInvariant",
    "productionBlockersSummary.byGateRegistryInvariantField",
    "productionBlockersSummary.preGateKey",
    "productionBlockersSummary.preGateKeyField",
    "productionBlockersSummary.gateOrder",
    "productionBlockersSummary.gateOrderField",
    "productionBlockersSummary.gateOrder.0",
    "productionBlockersSummary.gateOrder.3",
    "productionBlockersSummary.gateOrderCount",
    "productionBlockersSummary.gateOrderCountField",
    "productionBlockersSummary.gateOrderLastIndex",
    "productionBlockersSummary.gateOrderLastIndexField",
    "productionBlockersSummary.gateOrderFirst",
    "productionBlockersSummary.gateOrderFirstField",
    "productionBlockersSummary.gateOrderLast",
    "productionBlockersSummary.gateOrderLastField",
    "productionBlockersSummary.gateOrderRegistryStatus",
    "productionBlockersSummary.gateOrderRegistryStatusField",
    "productionBlockersSummary.gateOrderRegistryInvariant",
    "productionBlockersSummary.gateOrderRegistryInvariantField",
    "productionBlockersSummary.gateOrderDetails",
    "productionBlockersSummary.gateOrderDetailsField",
    "productionBlockersSummary.gateOrderDetails.0.key",
    "productionBlockersSummary.gateOrderDetails.0.docPath",
    "productionBlockersSummary.gateOrderDetails.3.key",
    "productionBlockersSummary.gateOrderDetails.3.docPath",
    "productionBlockersSummary.gateOrderDetailsCount",
    "productionBlockersSummary.gateOrderDetailsCountField",
    "productionBlockersSummary.gateOrderDetailsLastIndex",
    "productionBlockersSummary.gateOrderDetailsLastIndexField",
    "productionBlockersSummary.gateOrderDetailsFirst",
    "productionBlockersSummary.gateOrderDetailsFirstField",
    "productionBlockersSummary.gateOrderDetailsLast",
    "productionBlockersSummary.gateOrderDetailsLastField",
    "productionBlockersSummary.gateOrderDetailsRegistryStatus",
    "productionBlockersSummary.gateOrderDetailsRegistryStatusField",
    "productionBlockersSummary.gateOrderDetailsRegistryInvariant",
    "productionBlockersSummary.gateOrderDetailsRegistryInvariantField",
    "productionBlockersSummary.gateOrderDetailsSummary",
    "productionBlockersSummary.gateOrderDetailsSummaryField",
    "productionBlockersSummary.byGate.gate1Prep.blocker",
    "productionBlockersSummary.byGate.gate1Prep.docPath",
    "productionBlockersSummary.byGate.gate1.blocker",
    "productionBlockersSummary.byGate.gate1.docPath",
    "productionBlockersSummary.byGate.gate2.blocker",
    "productionBlockersSummary.byGate.gate2.docPath",
    "productionBlockersSummary.byGate.gate3.blocker",
    "productionBlockersSummary.byGate.gate3.docPath",
    "productionBlockersSummary.byGate.gate4.blocker",
    "productionBlockersSummary.byGate.gate4.docPath",
    "productionBlockersSummary.blockersField",
    "productionBlockersSummary.blockers.0",
    "productionBlockersSummary.blockers.4",
    "relatedDocs",
    "relatedDocs.0",
    "relatedDocs.4",
    "relatedDocCount",
    "relatedDocCountField",
    "relatedDocFirst",
    "relatedDocFirstField",
    "relatedDocLastIndex",
    "relatedDocLastIndexField",
    "relatedDocLast",
    "relatedDocLastField",
    "relatedDocSummary",
    "relatedDocSummaryField",
    "persistenceModeDefault",
    "persistenceModeDefaultField",
    "supportedPersistenceModes",
    "supportedPersistenceModes.0",
    "supportedPersistenceModes.1",
    "supportedPersistenceModeCount",
    "supportedPersistenceModeCountField",
    "supportedPersistenceModeFirst",
    "supportedPersistenceModeFirstField",
    "supportedPersistenceModeLastIndex",
    "supportedPersistenceModeLastIndexField",
    "supportedPersistenceModeLast",
    "supportedPersistenceModeLastField",
    "supportedPersistenceModeSummary",
    "supportedPersistenceModeSummaryField",
    "latestAndroidDeviceSmoke",
    "latestAndroidDeviceSmokeField",
    "latestAndroidDeviceSmoke.status",
    "latestAndroidDeviceSmokeStatusField",
    "latestAndroidDeviceSmoke.runId",
    "latestAndroidDeviceSmokeRunIdField",
    "latestAndroidDeviceSmoke.deviceManufacturer",
    "latestAndroidDeviceSmokeManufacturerField",
    "latestAndroidDeviceSmoke.deviceModel",
    "latestAndroidDeviceSmokeModelField",
    "latestAndroidDeviceSmoke.androidRelease",
    "latestAndroidDeviceSmokeAndroidReleaseField",
    "latestAndroidDeviceSmoke.androidSdk",
    "latestAndroidDeviceSmokeAndroidSdkField",
    "latestAndroidDeviceSmokeDevice",
    "latestAndroidDeviceSmokeDeviceField",
    "latestAndroidDeviceSmokeAndroid",
    "latestAndroidDeviceSmokeAndroidField",
    "latestAndroidDeviceSmokeSummary",
    "latestAndroidDeviceSmokeSummaryField",
    "nextGate",
    "nextGateField",
    "nextGateDoc",
    "nextGateDocField",
    "nextGateDocPath",
    "nextGateDocPathField",
    "nextGateCommand",
    "nextGateCommandField",
    "nextGateSummary",
    "nextGateSummaryField",
    "nextGateCheckCommand",
    "nextGateCheckCommandField",
    "nextGateCheckJsonCommand",
    "nextGateCheckJsonCommandField",
    "nextGateCheckCommandSummary",
    "nextGateCheckCommandSummaryField",
    "nextGateMigrationStatusCommand",
    "nextGateMigrationStatusCommandField",
    "nextGateMigrationStatus",
    "nextGateMigrationStatusField",
    "nextGateMigrationStatus.currentExpectedStatus",
    "nextGateMigrationStatusCurrentExpectedStatusField",
    "nextGateMigrationStatus.nextExpectedStatus",
    "nextGateMigrationStatusNextExpectedStatusField",
    "nextGateMigrationStatus.guardCommand",
    "nextGateMigrationStatusGuardCommandField",
    "nextGateMigrationStatusSummary",
    "nextGateMigrationStatusSummaryField",
    "nextGatePrismaScaffold",
    "nextGatePrismaScaffoldField",
    "nextGatePrismaScaffold.schemaPath",
    "nextGatePrismaScaffoldSchemaPathField",
    "nextGatePrismaScaffold.migrationsPath",
    "nextGatePrismaScaffoldMigrationsPathField",
    "nextGatePrismaScaffold.schemaPresentCommand",
    "nextGatePrismaScaffoldSchemaPresentCommandField",
    "nextGatePrismaScaffold.migrationsPresentCommand",
    "nextGatePrismaScaffoldMigrationsPresentCommandField",
    "nextGatePrismaScaffold.expectedPresent",
    "nextGatePrismaScaffoldExpectedPresentField",
    "nextGatePrismaScaffoldSummary",
    "nextGatePrismaScaffoldSummaryField",
    "nextGateSeedParityStatus",
    "nextGateSeedParityStatusField",
    "nextGateSeedParityStatus.summary",
    "nextGateSeedParityStatusSummaryField",
    "nextGateDatabaseUrlStatusCommand",
    "nextGateDatabaseUrlStatusCommandField",
    "nextGateDatabaseUrlProtocolCommand",
    "nextGateDatabaseUrlProtocolCommandField",
    "nextGateDatabaseUrlValidationCommand",
    "nextGateDatabaseUrlValidationCommandField",
    "nextGateDatabaseUrlExpectedStatus",
    "nextGateDatabaseUrlExpectedStatusField",
    "nextGateDatabaseUrlExpectedProtocols",
    "nextGateDatabaseUrlExpectedProtocolsField",
    "nextGateDatabaseUrl",
    "nextGateDatabaseUrlField",
    "nextGateDatabaseUrl.expectedStatus",
    "nextGateDatabaseUrlExpectedStatusNestedField",
    "nextGateDatabaseUrl.expectedProtocols",
    "nextGateDatabaseUrlExpectedProtocolsNestedField",
    "nextGateDatabaseUrlSummary",
    "nextGateDatabaseUrlSummaryField",
    "nextGateMigrationGuardCommand",
    "nextGateMigrationGuardCommandField",
    "nextGateMigrationGuardMigrationCommand",
    "nextGateMigrationGuardMigrationCommandField",
    "nextGateMigrationGuardHelperCommand",
    "nextGateMigrationGuardHelperCommandField",
    "nextGateMigrationGuardErrorCode",
    "nextGateMigrationGuardErrorCodeField",
    "nextGateMigrationGuard",
    "nextGateMigrationGuardField",
    "nextGateMigrationGuard.errorCode",
    "nextGateMigrationGuardErrorCodeNestedField",
    "nextGateMigrationGuardSummary",
    "nextGateMigrationGuardSummaryField",
    "nextGateDbMatrix",
    "nextGateDbMatrixField",
    "nextGateDbMatrix.checkCommand",
    "nextGateDbMatrixCheckCommandField",
    "nextGateDbMatrix.jsonCommand",
    "nextGateDbMatrixJsonCommandField",
    "nextGateDbMatrix.migrationStatusCommand",
    "nextGateDbMatrixMigrationStatusCommandField",
    "nextGateDbMatrix.prismaScaffoldStatus",
    "nextGateDbMatrix.prismaScaffoldStatus.summary",
    "nextGateDbMatrixPrismaScaffoldStatusSummaryField",
    "nextGateDbMatrix.seedParityStatus",
    "nextGateDbMatrix.seedParityStatus.summary",
    "nextGateDbMatrixSeedParityStatusSummaryField",
    "nextGateDbMatrix.databaseUrl.expectedStatus",
    "nextGateDbMatrixDatabaseUrlExpectedStatusField",
    "nextGateDbMatrix.requiredChecksSource",
    "nextGateDbMatrixRequiredChecksSourceField",
    "nextGateDbMatrix.requiredChecksParsed",
    "nextGateDbMatrixRequiredChecksParsedField",
    "nextGateDbMatrixSummary",
    "nextGateDbMatrixSummaryField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeysField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.0",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.4",
    "nextGateDbMatrix.requiredChecksSummary.byTypeCount",
    "nextGateDbMatrix.requiredChecksSummary.byTypeCountField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeFirst",
    "nextGateDbMatrix.requiredChecksSummary.byTypeFirstField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLast",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.7",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.1",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commands.0",
    "nextGateRequiredChecksSource",
    "nextGateRequiredChecksSourceField",
    "nextGateRequiredChecksParsed",
    "nextGateRequiredChecksParsedField",
    "nextGateRequiredChecksSummary",
    "nextGateRequiredChecksSummaryField",
    "nextGateRequiredChecksSummary.count",
    "nextGateRequiredChecksSummaryCountField",
    "nextGateRequiredChecksSummary.source",
    "nextGateRequiredChecksSummarySourceField",
    "nextGateRequiredChecksSummary.parsed",
    "nextGateRequiredChecksSummaryParsedField",
    "nextGateRequiredChecksCompactSummary",
    "nextGateRequiredChecksCompactSummaryField",
    "nextGateRequiredChecksByTypeSummary",
    "nextGateRequiredChecksByTypeSummaryField",
    "nextGateRequiredChecksByTypeEndpointSummary",
    "nextGateRequiredChecksByTypeEndpointSummaryField",
    "nextGateRequiredChecksByTypeRegistrySummary",
    "nextGateRequiredChecksByTypeRegistrySummaryField",
    "nextGateRequiredChecksByTypeFieldSummary",
    "nextGateRequiredChecksByTypeFieldSummaryField",
    "nextGateRequiredChecksByTypeCommandCountSummary",
    "nextGateRequiredChecksByTypeCommandCountSummaryField",
    "nextGateRequiredChecksByTypeCommandEndpointSummary",
    "nextGateRequiredChecksByTypeCommandEndpointSummaryField",
    "nextGateRequiredChecksByTypeCommandRegistrySummary",
    "nextGateRequiredChecksByTypeCommandRegistrySummaryField",
    "nextGateRequiredChecksByTypeCommandRegistryStatusSummary",
    "nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField",
    "nextGateRequiredChecksByTypeCommandFieldSummary",
    "nextGateRequiredChecksByTypeCommandFieldSummaryField",
    "nextGateRequiredChecksSummary.byTypeKeys",
    "nextGateRequiredChecksSummary.byTypeKeysField",
    "nextGateRequiredChecksSummary.byTypeKeys.0",
    "nextGateRequiredChecksSummary.byTypeKeys.4",
    "nextGateRequiredChecksSummary.byTypeCount",
    "nextGateRequiredChecksSummary.byTypeCountField",
    "nextGateRequiredChecksSummary.byTypeLastIndex",
    "nextGateRequiredChecksSummary.byTypeLastIndexField",
    "nextGateRequiredChecksSummary.byTypeFirst",
    "nextGateRequiredChecksSummary.byTypeFirstField",
    "nextGateRequiredChecksSummary.byTypeLast",
    "nextGateRequiredChecksSummary.byTypeLastField",
    "nextGateRequiredChecksSummary.byTypeRegistryStatus",
    "nextGateRequiredChecksSummary.byTypeRegistryStatusField",
    "nextGateRequiredChecksSummary.byTypeRegistryInvariant",
    "nextGateRequiredChecksSummary.byTypeRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.db.count",
    "nextGateRequiredChecksSummary.byType.guard.count",
    "nextGateRequiredChecksSummary.byType.test.count",
    "nextGateRequiredChecksSummary.byType.privacy.count",
    "nextGateRequiredChecksSummary.byType.errors.count",
    "nextGateRequiredChecksSummary.byType.db.countField",
    "nextGateRequiredChecksSummary.byType.guard.countField",
    "nextGateRequiredChecksSummary.byType.test.countField",
    "nextGateRequiredChecksSummary.byType.privacy.countField",
    "nextGateRequiredChecksSummary.byType.errors.countField",
    "nextGateRequiredChecksSummary.byType.db.commandsField",
    "nextGateRequiredChecksSummary.byType.guard.commandsField",
    "nextGateRequiredChecksSummary.byType.test.commandsField",
    "nextGateRequiredChecksSummary.byType.privacy.commandsField",
    "nextGateRequiredChecksSummary.byType.errors.commandsField",
    "nextGateRequiredChecksSummary.byType.db.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.guard.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.test.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.privacy.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.errors.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.db.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.guard.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.test.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.privacy.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.errors.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.db.commands.0",
    "nextGateRequiredChecksSummary.byType.db.commands.7",
    "nextGateRequiredChecksSummary.byType.guard.commands.0",
    "nextGateRequiredChecksSummary.byType.guard.commands.1",
    "nextGateRequiredChecksSummary.byType.test.commands.0",
    "nextGateRequiredChecksSummary.byType.privacy.commands.0",
    "nextGateRequiredChecksSummary.byType.errors.commands.0",
    "nextGateRequiredChecksByType",
    "nextGateReadiness",
    "nextGateReadinessField",
    "nextGateReadiness.verifiedNowCount",
    "nextGateReadinessVerifiedNowCountField",
    "nextGateReadiness.transitionCount",
    "nextGateReadinessTransitionCountField",
    "nextGateReadiness.verifiedNowCommands",
    "nextGateReadinessVerifiedNowCommandsField",
    "nextGateReadiness.transitionCommands",
    "nextGateReadinessTransitionCommandsField",
    "nextGateReadinessSummary",
    "nextGateReadinessSummaryField",
    "nextGateTransitionPlan",
    "nextGateTransitionPlanField",
    "nextGateTransitionPlan.count",
    "nextGateTransitionPlanCountField",
    "nextGateTransitionPlan.transitions.migrationStatus.nextExpected",
    "nextGateTransitionPlanMigrationStatusNextExpectedField",
    "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected",
    "nextGateTransitionPlanDatabaseUrlStatusNextExpectedField",
    "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected",
    "nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField",
    "nextGateTransitionPlan.orderedSteps",
    "nextGateTransitionPlanOrderedStepsField",
    "nextGateTransitionPlan.orderedSteps.0.id",
    "nextGateTransitionPlanFirstStepIdField",
    "nextGateTransitionPlanStepSummary",
    "nextGateTransitionPlanStepSummaryField",
    "nextGateTransitionPlanSummary",
    "nextGateTransitionPlanSummaryField",
    "nextGateCiHandoff",
    "nextGateCiHandoffField",
    "nextGateCiHandoff.requiredCheckCount",
    "nextGateCiHandoffRequiredCheckCountFieldAlias",
    "nextGateCiHandoff.watchFieldCount",
    "nextGateCiHandoffWatchFieldCountFieldAlias",
    "nextGateCiHandoff.commandCount",
    "nextGateCiHandoffCommandCountFieldAlias",
    "nextGateCiHandoffSummary",
    "nextGateCiHandoffSummaryField",
    "nextGateCiHandoffReadyStatus",
    "nextGateCiHandoffReadyStatusField",
    "nextGateCiHandoffReadySummary",
    "nextGateCiHandoffReadySummaryField",
    "nextGateCiHandoffReadyTopSummary",
    "nextGateCiHandoffReadyTopSummaryField",
    "nextGateCiHandoff.fieldAliasCount",
    "nextGateCiHandoff.fieldAliasCountField",
    "nextGateCiHandoff.fieldAliasLastIndex",
    "nextGateCiHandoff.fieldAliasLastIndexField",
    "nextGateCiHandoff.fieldAliasRegistryStatus",
    "nextGateCiHandoff.fieldAliasRegistryStatusField",
    "nextGateCiHandoff.fieldAliasRegistryInvariant",
    "nextGateCiHandoff.fieldAliasRegistryInvariantField",
    "nextGateCiHandoff.fieldAliasFirst",
    "nextGateCiHandoff.fieldAliasFirstField",
    "nextGateCiHandoff.fieldAliasLast",
    "nextGateCiHandoff.fieldAliasLastField",
    "nextGateCiHandoff.fieldAliasEndpointsField",
    "nextGateCiHandoff.fieldAliasEndpoints.first",
    "nextGateCiHandoff.fieldAliasEndpoints.last",
    "nextGateCiHandoff.fieldAliasSummary",
    "nextGateCiHandoff.fieldAliasSummaryField",
    "nextGateCiHandoff.fieldAliasesField",
    "nextGateCiHandoff.fieldAliases.0",
    "nextGateCiHandoff.fieldAliases.323",
    "nextGateCiHandoff.requiredCheckCount",
    "nextGateCiHandoff.requiredCheckCountField",
    "nextGateCiHandoff.requiredChecksSource",
    "nextGateCiHandoff.requiredChecksSourceField",
    "nextGateCiHandoff.requiredChecksParsed",
    "nextGateCiHandoff.requiredChecksParsedField",
    "nextGateCiHandoff.transitionPlanField",
    "nextGateCiHandoff.readinessField",
    "nextGateCiHandoff.commandCount",
    "nextGateCiHandoff.commandCountField",
    "nextGateCiHandoff.commandLastIndex",
    "nextGateCiHandoff.commandLastIndexField",
    "nextGateCiHandoff.commandRegistryStatus",
    "nextGateCiHandoff.commandRegistryStatusField",
    "nextGateCiHandoff.commandRegistryInvariant",
    "nextGateCiHandoff.commandRegistryInvariantField",
    "nextGateCiHandoff.commandsField",
    "nextGateCiHandoff.commands.0",
    "nextGateCiHandoff.commands.1",
    "nextGateCiHandoff.commands.2",
    "nextGateCiHandoff.commands.3",
    "nextGateCiHandoff.commands.4",
    "nextGateCiHandoff.commands.5",
    "nextGateCiHandoff.commands.6",
    "nextGateCiHandoff.commands.7",
    "nextGateCiHandoff.commands.8",
    "nextGateCiHandoff.commands.9",
    "nextGateCiHandoff.commands.10",
    "nextGateCiHandoff.commands.11",
    "nextGateCiHandoff.commands.12",
    "nextGateCiHandoff.watchFieldsField",
    "nextGateCiHandoff.watchFields.0",
    "nextGateCiHandoff.watchFields.1",
    "nextGateCiHandoff.watchFields.2",
    "nextGateCiHandoff.watchFieldCount",
    "nextGateCiHandoff.watchFieldCountField",
    "nextGateCiHandoff.passCriteriaField",
    "nextGateCiHandoff.passCriteriaCount",
    "nextGateCiHandoff.passCriteriaCountField",
    "nextGateCiHandoff.passCriteria.migrationStatus",
    "nextGateCiHandoff.passCriteria.databaseUrlStatus",
    "nextGateCiHandoff.passCriteria.databaseUrlProtocol",
    "nextGateCiHandoff.failureCodesField",
    "nextGateCiHandoff.failureCodes.migrationGuard",
    "nextGateCiHandoff.failureCodes.dbMatrixUnknownField",
    "nextGateCiHandoff.failureCodes.statusFieldMissing",
    "nextGateCiHandoff.failureCodeCount",
    "nextGateCiHandoff.failureCodeCountField",
    "nextGateCiHandoff.evidenceDocsField",
    "nextGateCiHandoff.evidenceDocs.nextGate",
    "nextGateCiHandoff.evidenceDocs.dbConstraints",
    "nextGateCiHandoff.evidenceDocs.status",
    "nextGateCiHandoff.evidenceDocCount",
    "nextGateCiHandoff.evidenceDocCountField",
    "nextGateCiHandoff.assertionsField",
    "nextGateCiHandoff.assertionCount",
    "nextGateCiHandoff.assertionCountField",
    "nextGateCiHandoff.assertions.migrationStatus.expected",
    "nextGateCiHandoff.assertions.migrationStatus.command",
    "nextGateCiHandoff.assertions.databaseUrlStatus.expected",
    "nextGateCiHandoff.assertions.databaseUrlStatus.command",
    "nextGateCiHandoff.assertions.databaseUrlProtocol.expected",
    "nextGateCiHandoff.assertions.databaseUrlProtocol.command",
    "nextGateCiHandoff.readyWhen.status",
    "nextGateCiHandoff.readyWhen.summary",
    "nextGateCiHandoff.readyWhen.requiredFields.0",
    "nextGateCiHandoff.readyWhen.requiredFields.1",
    "nextGateCiHandoff.readyWhen.requiredFields.2",
    "nextGateCiHandoff.readyWhen.requiredFieldCount",
    "nextGateCiHandoff.readyWhen.requiredFieldCountField",
    "nextGateCiHandoff.readyWhen.requiredFieldLastIndex",
    "nextGateCiHandoff.readyWhen.requiredFieldLastIndexField",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.assertionCount",
    "nextGateCiHandoff.readyWhen.assertionCountField",
    "nextGateCiHandoff.readyWhen.statusField",
    "nextGateCiHandoff.readyWhen.summaryField",
    "nextGateCiHandoff.readyWhen.requiredFieldsField",
    "nextGateCiHandoff.readyWhen.commandsField",
    "nextGateCiHandoff.readyWhen.reportFieldsField",
    "nextGateCiHandoff.readyWhen.reportFieldCount",
    "nextGateCiHandoff.readyWhen.reportFieldCountField",
    "nextGateCiHandoff.readyWhen.reportFieldLastIndex",
    "nextGateCiHandoff.readyWhen.reportFieldLastIndexField",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.reportFieldFirst",
    "nextGateCiHandoff.readyWhen.reportFieldFirstField",
    "nextGateCiHandoff.readyWhen.reportFieldLast",
    "nextGateCiHandoff.readyWhen.reportFieldLastField",
    "nextGateCiHandoff.readyWhen.reportFieldEndpointsField",
    "nextGateCiHandoff.readyWhen.reportFieldEndpoints.first",
    "nextGateCiHandoff.readyWhen.reportFieldEndpoints.last",
    "nextGateCiHandoff.readyWhen.reportFieldSummary",
    "nextGateCiHandoff.readyWhen.reportFieldSummaryField",
    "nextGateCiHandoff.readyWhen.reportValues",
    "nextGateCiHandoff.readyWhen.reportValuesField",
    "nextGateCiHandoff.readyWhen.reportValueKeys",
    "nextGateCiHandoff.readyWhen.reportValueKeysField",
    "nextGateCiHandoff.readyWhen.reportValueKeys.0",
    "nextGateCiHandoff.readyWhen.reportValueKeys.16",
    "nextGateCiHandoff.readyWhen.reportValueKeys.17",
    "nextGateCiHandoff.readyWhen.reportValueKeys.18",
    "nextGateCiHandoff.readyWhen.reportValueKeys.19",
    "nextGateCiHandoff.readyWhen.reportValueKeys.20",
    "nextGateCiHandoff.readyWhen.reportValueKeys.21",
    "nextGateCiHandoff.readyWhen.reportValueKeys.22",
    "nextGateCiHandoff.readyWhen.reportValueKeys.23",
    "nextGateCiHandoff.readyWhen.reportValueKeys.24",
    "nextGateCiHandoff.readyWhen.reportValueKeys.22",
    "nextGateCiHandoff.readyWhen.reportValueKeys.23",
    "nextGateCiHandoff.readyWhen.reportValueKeys.24",
    "nextGateCiHandoff.readyWhen.reportValueCount",
    "nextGateCiHandoff.readyWhen.reportValueCountField",
    "nextGateCiHandoff.readyWhen.reportValueLastIndex",
    "nextGateCiHandoff.readyWhen.reportValueLastIndexField",
    "nextGateCiHandoff.readyWhen.reportValueFirst",
    "nextGateCiHandoff.readyWhen.reportValueFirstField",
    "nextGateCiHandoff.readyWhen.reportValueLast",
    "nextGateCiHandoff.readyWhen.reportValueLastField",
    "nextGateCiHandoff.readyWhen.reportValueEndpointsField",
    "nextGateCiHandoff.readyWhen.reportValueEndpoints.first",
    "nextGateCiHandoff.readyWhen.reportValueEndpoints.last",
    "nextGateCiHandoff.readyWhen.reportValueEndpointSummary",
    "nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField",
    "nextGateCiHandoff.readyWhen.reportValueRegistryStatus",
    "nextGateCiHandoff.readyWhen.reportValueRegistryStatusField",
    "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant",
    "nextGateCiHandoff.readyWhen.reportValueRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.reportValueSummary",
    "nextGateCiHandoff.readyWhen.reportValueSummaryField",
    "nextGateCiHandoff.readyWhen.reportValues.status",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary",
    "nextGateCiHandoff.readyWhen.reportValues.prismaScaffoldStatusSummary",
    "nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary",
    "nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount",
    "nextGateCiHandoff.readyWhen.reportValues.progressPercent",
    "nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary",
    "nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary",
    "nextGateCiHandoff.readyWhen.commandCount",
    "nextGateCiHandoff.readyWhen.commandCountField",
    "nextGateCiHandoff.readyWhen.commandLastIndex",
    "nextGateCiHandoff.readyWhen.commandLastIndexField",
    "nextGateCiHandoff.readyWhen.commandRegistryStatus",
    "nextGateCiHandoff.readyWhen.commandRegistryStatusField",
    "nextGateCiHandoff.readyWhen.commandRegistryInvariant",
    "nextGateCiHandoff.readyWhen.commandRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.commands.0",
    "nextGateCiHandoff.readyWhen.commands.1",
    "nextGateCiHandoff.readyWhen.commands.2",
    "nextGateCiHandoff.readyWhen.reportFields.0",
    "nextGateCiHandoff.readyWhen.reportFields.1",
    "nextGateCiHandoff.readyWhen.reportFields.2",
    "nextGateCiHandoff.readyWhen.reportFields.3",
    "nextGateCiHandoff.readyWhen.reportFields.4",
    "nextGateCiHandoff.readyWhen.reportFields.5",
    "nextGateCiHandoff.readyWhen.reportFields.6",
    "nextGateCiHandoff.readyWhen.reportFields.7",
    "nextGateCiHandoff.readyWhen.reportFields.8",
    "nextGateCiHandoff.readyWhen.reportFields.9",
    "nextGateCiHandoff.readyWhen.reportFields.10",
    "nextGateCiHandoff.readyWhen.reportFields.11",
    "nextGateCiHandoff.readyWhen.reportFields.12",
    "nextGateCiHandoff.readyWhen.reportFields.13",
    "nextGateCiHandoff.readyWhen.reportFields.14",
    "nextGateCiHandoff.readyWhen.reportFields.15",
    "nextGateCiHandoff.readyWhen.reportFields.16",
    "nextGateCiHandoff.readyWhen.reportFields.17",
    "nextGateCiHandoff.readyWhen.reportFields.18",
    "nextGateCiHandoff.readyWhen.reportFields.19",
    "nextGateCiHandoff.readyWhen.reportFields.20",
    "nextGateCiHandoff.readyWhen.reportFields.21",
    "nextGateCiHandoff.rollback.mode",
    "nextGateCiHandoff.rollback.modeField",
    "nextGateCiHandoff.rollback.expectedMode",
    "nextGateCiHandoff.rollback.expectedModeField",
    "nextGateCiHandoff.rollback.summary",
    "nextGateCiHandoff.rollback.summaryField",
    "nextGateCiHandoff.rollback.command",
    "nextGateCiHandoff.rollback.commandField",
    "nextGateCiHandoff.rollback.commandsField",
    "nextGateCiHandoff.rollback.verificationCommand",
    "nextGateCiHandoff.rollback.verificationCommandField",
    "nextGateCiHandoff.rollback.reportCommand",
    "nextGateCiHandoff.rollback.reportCommandField",
    "nextGateCiHandoff.rollback.commandCount",
    "nextGateCiHandoff.rollback.commandCountField",
    "nextGateCiHandoff.rollback.commandLastIndex",
    "nextGateCiHandoff.rollback.commandLastIndexField",
    "nextGateCiHandoff.rollback.commandFirst",
    "nextGateCiHandoff.rollback.commandFirstField",
    "nextGateCiHandoff.rollback.commandLast",
    "nextGateCiHandoff.rollback.commandLastField",
    "nextGateCiHandoff.rollback.commandEndpoints",
    "nextGateCiHandoff.rollback.commandEndpointsField",
    "nextGateCiHandoff.rollback.commandEndpointSummary",
    "nextGateCiHandoff.rollback.commandEndpointSummaryField",
    "nextGateCiHandoff.rollback.commandRegistryStatus",
    "nextGateCiHandoff.rollback.commandRegistryStatusField",
    "nextGateCiHandoff.rollback.commandRegistryInvariant",
    "nextGateCiHandoff.rollback.commandRegistryInvariantField",
    "nextGateCiHandoff.rollback.commands.0",
    "nextGateCiHandoff.rollback.commands.1",
    "nextGateCiHandoff.rollback.commands.2",
    "nextGateRequiredChecks"
  ]) {
    console.log(`  ${field}`);
  }
  console.log("");
  console.log("Field notes:");
  console.log("  nextGateCommand returns the command that prints nextGateDocPath.");
  console.log("  nextGateCheckCommand returns the first Gate 1 handoff check.");
  console.log("  nextGateCheckJsonCommand returns the machine-readable Gate 1 DB matrix check.");
  console.log("  nextGateMigrationStatusCommand returns the Gate 1 migration status field.");
  console.log("  nextGateMigrationStatus returns the Gate 1 migration status handoff object.");
  console.log("  nextGatePrismaScaffold returns the Gate 1 Prisma schema and migrations handoff object.");
  console.log("  nextGateDatabaseUrlStatusCommand returns the Gate 1 DATABASE_URL status field.");
  console.log("  nextGateDatabaseUrlProtocolCommand returns the Gate 1 DATABASE_URL protocol field.");
  console.log("  nextGateDatabaseUrlValidationCommand returns a PowerShell placeholder command that never stores the real DATABASE_URL in docs.");
  console.log("  nextGateDatabaseUrlExpectedStatus returns the passing DATABASE_URL status.");
  console.log("  nextGateDatabaseUrlExpectedProtocols returns the accepted PostgreSQL URL protocols.");
  console.log("  nextGateDatabaseUrl returns the full DATABASE_URL handoff object without the real URL.");
  console.log("  nextGateMigrationGuardCommand returns the fail-closed migration guard test.");
  console.log("  nextGateMigrationGuardMigrationCommand returns the migration command that must fail closed in Gate 0.");
  console.log("  nextGateMigrationGuardHelperCommand returns the helper command documenting the guard output.");
  console.log("  nextGateMigrationGuardErrorCode returns the stable fail-closed migration error code.");
  console.log("  nextGateMigrationGuard returns the full fail-closed migration guard object.");
  console.log("  nextGateDbMatrix returns the full Gate 1 DB matrix handoff object.");
  console.log("  nextGateRequiredChecksSource points to the parsed Required Checks block.");
  console.log("  nextGateRequiredChecksParsed is true when the checks came from the Gate 1 doc.");
  console.log("  nextGateRequiredChecksSummary returns the parsed Gate 1 check count, source, type groups, and commands.");
  console.log("  nextGateRequiredChecksByType groups parsed Gate 1 checks by command category.");
  console.log("  nextGateReadiness separates Gate 0 verified checks from Gate 1 transition checks.");
  console.log("  nextGateTransitionPlan maps transition checks to their current and Gate 1 expected values plus ordered steps.");
  console.log("  nextGateCiHandoff returns CI-friendly required checks source, parsed status, watch fields, commands, pass criteria, assertions, ready status, ready summary, required fields, report fields, rollback guidance, failure codes, evidence docs, and handoff counts.");
  console.log("  nextGateRequiredChecks is parsed from GATE1_PERSISTENCE.md.");
}

function buildNextGateCiHandoff(commands) {
  const readyReportFields = [
    "nextGateCiHandoff.readyWhen.status",
    "nextGateCiHandoff.readyWhen.summary",
    "nextGateCiHandoff.readyWhen.requiredFields",
    "nextGateCiHandoff.rollback.mode",
    "nextGateCiHandoff.rollback.verificationCommand",
    "nextGateCiHandoff.rollback.reportCommand",
    "nextGateCiHandoff.rollback.expectedMode",
    "nextGateCiHandoff.rollback.summary",
    "nextGateCiHandoff.rollback.summaryField",
    "nextGateCiHandoff.rollback.modeField",
    "nextGateCiHandoff.rollback.expectedModeField",
    "nextGateCiHandoff.requiredChecksSource",
    "nextGateCiHandoff.requiredChecksParsed",
    "nextGateCiHandoff.failureCodeCount",
    "nextGateCiHandoff.evidenceDocCount",
    "nextGateCiHandoff.requiredCheckCount",
    "nextGateDbMatrix.prismaScaffoldStatus.summary",
    "productionBlockersSummary.gateOrderDetailsSummary",
    "productionBlockersSummary.count",
    "progressPercent",
    "progressBasis",
    "stillNotDone"
  ];
  const readyCommands = [
    nextGateMigrationStatusCommand,
    nextGateDatabaseUrlStatusCommand,
    nextGateDatabaseUrlProtocolCommand
  ];
  const readyRequiredFields = [
    "nextGateCiHandoff.assertions.migrationStatus.expected",
    "nextGateCiHandoff.assertions.databaseUrlStatus.expected",
    "nextGateCiHandoff.assertions.databaseUrlProtocol.expected"
  ];
  const assertions = {
    migrationStatus: {
      command: nextGateMigrationStatusCommand,
      expected: nextGateTransitionPlan.transitions.migrationStatus.nextExpected
    },
    databaseUrlStatus: {
      command: nextGateDatabaseUrlStatusCommand,
      expected: nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected
    },
    databaseUrlProtocol: {
      command: nextGateDatabaseUrlProtocolCommand,
      expected: nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected
    }
  };
  const passCriteria = {
    migrationStatus: nextGateTransitionPlan.transitions.migrationStatus.nextExpected,
    databaseUrlStatus: nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected,
    databaseUrlProtocol: nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected
  };
  const watchFields = [
    "nextGateTransitionPlan.transitions.migrationStatus.nextExpected",
    "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected",
    "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected"
  ];
  const evidenceDocs = {
    nextGate: nextGateDocPath,
    dbConstraints: "docs/dev/DB_CONSTRAINTS.md",
    status: "docs/dev/GATE0_STATUS.md"
  };
  const failureCodes = {
    migrationGuard: nextGateMigrationGuardErrorCode,
    dbMatrixUnknownField: "TM_DB_MATRIX_UNKNOWN_FIELD",
    statusFieldMissing: "TM_GATE0_STATUS_FIELD_MISSING"
  };
  const rollbackCommands = [
    "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue",
    "npm run gate0:status -- --field persistenceModeDefault",
    "npm run gate0:status -- --field nextGateCiHandoff.rollback"
  ];
  const rollbackCommandLastIndex = rollbackCommands.length - 1;
  const reportValues = {
    status: ciReadyStatus,
    summary: ciReadySummary,
    requiredFields: readyRequiredFields,
    rollbackMode: "fixture",
    rollbackVerificationCommand: "npm run gate0:status -- --field persistenceModeDefault",
    rollbackReportCommand: "npm run gate0:status -- --field nextGateCiHandoff.rollback",
    rollbackExpectedMode: "fixture",
    rollbackSummary: "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff",
    rollbackSummaryField: "nextGateCiHandoff.rollback.summary",
    rollbackModeField: "nextGateCiHandoff.rollback.mode",
    rollbackExpectedModeField: "nextGateCiHandoff.rollback.expectedMode",
    rollbackCommandFirst: rollbackCommands[0],
    rollbackCommandLast: rollbackCommands[rollbackCommandLastIndex],
    rollbackCommandEndpointSummary: `first=${rollbackCommands[0]}, last=${rollbackCommands[rollbackCommandLastIndex]}`,
    requiredChecksSource: "docs/dev/GATE1_PERSISTENCE.md#required-checks",
    requiredChecksParsed: true,
    failureCodeCount: Object.keys(failureCodes).length,
    evidenceDocCount: Object.keys(evidenceDocs).length,
    requiredCheckCount: commands.length,
    prismaScaffoldStatusSummary,
    productionGateOrderDetailsSummary,
    productionBlockerCount,
    progressPercent,
    progressBasisSummary,
    remainingBlockersSummary
  };
  const reportValueKeys = Object.keys(reportValues);
  const reportValueLastIndex = reportValueKeys.length - 1;
  const fieldAliases = [
    "nextGateCiHandoff.transitionPlanField",
    "nextGateCiHandoff.readinessField",
    "nextGateCiHandoff.requiredCheckCountField",
    "nextGateCiHandoff.requiredChecksSourceField",
    "nextGateCiHandoff.requiredChecksParsedField",
    "nextGateCiHandoff.commandCountField",
    "nextGateCiHandoff.commandsField",
    "nextGateCiHandoff.watchFieldsField",
    "nextGateCiHandoff.watchFieldCountField",
    "nextGateCiHandoff.passCriteriaCountField",
    "nextGateCiHandoff.passCriteriaField",
    "nextGateCiHandoff.failureCodeCountField",
    "nextGateCiHandoff.failureCodesField",
    "nextGateCiHandoff.evidenceDocCountField",
    "nextGateCiHandoff.evidenceDocsField",
    "nextGateCiHandoff.assertionCountField",
    "nextGateCiHandoff.assertionsField",
    "nextGateCiHandoff.readyWhen.statusField",
    "nextGateCiHandoff.readyWhen.summaryField",
    "nextGateCiHandoff.readyWhen.requiredFieldsField",
    "nextGateCiHandoff.readyWhen.commandsField",
    "nextGateCiHandoff.readyWhen.reportFieldsField",
    "nextGateCiHandoff.readyWhen.assertionCountField",
    "nextGateCiHandoff.readyWhen.requiredFieldCountField",
    "nextGateCiHandoff.readyWhen.reportFieldCountField",
    "nextGateCiHandoff.readyWhen.commandCountField",
    "nextGateCiHandoff.rollback.modeField",
    "nextGateCiHandoff.rollback.expectedModeField",
    "nextGateCiHandoff.rollback.summaryField",
    "nextGateCiHandoff.rollback.commandField",
    "nextGateCiHandoff.rollback.commandsField",
    "nextGateCiHandoff.rollback.verificationCommandField",
    "nextGateCiHandoff.rollback.reportCommandField",
    "nextGateCiHandoff.rollback.commandCountField",
    "nextGateCiHandoff.readyWhen.reportFieldFirstField",
    "nextGateCiHandoff.readyWhen.reportFieldLastField",
    "nextGateCiHandoff.fieldAliasLastIndexField",
    "nextGateCiHandoff.readyWhen.reportFieldLastIndexField",
    "nextGateCiHandoff.readyWhen.reportFieldEndpointsField",
    "nextGateCiHandoff.readyWhen.reportFieldSummaryField",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField",
    "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField",
    "nextGateCiHandoff.fieldAliasRegistryStatusField",
    "nextGateCiHandoff.fieldAliasRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.commandLastIndexField",
    "nextGateCiHandoff.readyWhen.commandRegistryStatusField",
    "nextGateCiHandoff.readyWhen.commandRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.requiredFieldLastIndexField",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField",
    "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField",
    "nextGateCiHandoff.readyWhen.reportValues",
    "nextGateCiHandoff.readyWhen.reportValuesField",
    "nextGateCiHandoff.readyWhen.reportValueKeys",
    "nextGateCiHandoff.readyWhen.reportValueKeysField",
    "nextGateCiHandoff.readyWhen.reportValueKeys.0",
    "nextGateCiHandoff.readyWhen.reportValueKeys.16",
    "nextGateCiHandoff.readyWhen.reportValueKeys.17",
    "nextGateCiHandoff.readyWhen.reportValueKeys.18",
    "nextGateCiHandoff.readyWhen.reportValueKeys.19",
    "nextGateCiHandoff.readyWhen.reportValueKeys.20",
    "nextGateCiHandoff.readyWhen.reportValueKeys.21",
    "nextGateCiHandoff.readyWhen.reportValueKeys.22",
    "nextGateCiHandoff.readyWhen.reportValueKeys.23",
    "nextGateCiHandoff.readyWhen.reportValueKeys.24",
    "nextGateCiHandoff.readyWhen.reportValueKeys.22",
    "nextGateCiHandoff.readyWhen.reportValueKeys.23",
    "nextGateCiHandoff.readyWhen.reportValueKeys.24",
    "nextGateCiHandoff.readyWhen.reportValueCount",
    "nextGateCiHandoff.readyWhen.reportValueCountField",
    "nextGateCiHandoff.readyWhen.reportValueLastIndex",
    "nextGateCiHandoff.readyWhen.reportValueLastIndexField",
    "nextGateCiHandoff.readyWhen.reportValueFirst",
    "nextGateCiHandoff.readyWhen.reportValueFirstField",
    "nextGateCiHandoff.readyWhen.reportValueLast",
    "nextGateCiHandoff.readyWhen.reportValueLastField",
    "nextGateCiHandoff.readyWhen.reportValueEndpointsField",
    "nextGateCiHandoff.readyWhen.reportValueEndpoints.first",
    "nextGateCiHandoff.readyWhen.reportValueEndpoints.last",
    "nextGateCiHandoff.readyWhen.reportValueEndpointSummary",
    "nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField",
    "nextGateCiHandoff.readyWhen.reportValueRegistryStatus",
    "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant",
    "nextGateCiHandoff.readyWhen.reportValueSummary",
    "nextGateCiHandoff.readyWhen.reportValueSummaryField",
    "nextGateCiHandoff.readyWhen.reportValues.status",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast",
    "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary",
    "nextGateCiHandoff.readyWhen.reportValues.prismaScaffoldStatusSummary",
    "nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary",
    "nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount",
    "nextGateCiHandoff.readyWhen.reportValues.progressPercent",
    "nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary",
    "nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary",
    "nextGateCiHandoff.rollback.commandFirstField",
    "nextGateCiHandoff.rollback.commandLastField",
    "nextGateCiHandoff.rollback.commandEndpointsField",
    "nextGateCiHandoff.rollback.commandEndpointSummaryField",
    "nextGateCiHandoff.rollback.commandLastIndexField",
    "nextGateCiHandoff.rollback.commandRegistryStatusField",
    "nextGateCiHandoff.rollback.commandRegistryInvariantField",
    "nextGateCiHandoff.commandLastIndexField",
    "nextGateCiHandoff.commandRegistryStatusField",
    "nextGateCiHandoff.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeysField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.0",
    "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.4",
    "nextGateDbMatrix.requiredChecksSummary.byTypeCount",
    "nextGateDbMatrix.requiredChecksSummary.byTypeCountField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeFirst",
    "nextGateDbMatrix.requiredChecksSummary.byTypeFirstField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLast",
    "nextGateDbMatrix.requiredChecksSummary.byTypeLastField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.count",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.countField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandsField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndex",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndexField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatus",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatusField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariant",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariantField",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.7",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.1",
    "nextGateDbMatrix.requiredChecksSummary.byType.test.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commands.0",
    "nextGateDbMatrix.requiredChecksSummary.byType.errors.commands.0",
    "nextGateRequiredChecksSummary.byTypeKeys",
    "nextGateRequiredChecksSummary.byTypeKeysField",
    "nextGateRequiredChecksSummary.byTypeKeys.0",
    "nextGateRequiredChecksSummary.byTypeKeys.4",
    "nextGateRequiredChecksSummary.byTypeCount",
    "nextGateRequiredChecksSummary.byTypeCountField",
    "nextGateRequiredChecksSummary.byTypeLastIndex",
    "nextGateRequiredChecksSummary.byTypeLastIndexField",
    "nextGateRequiredChecksSummary.byTypeFirst",
    "nextGateRequiredChecksSummary.byTypeFirstField",
    "nextGateRequiredChecksSummary.byTypeLast",
    "nextGateRequiredChecksSummary.byTypeLastField",
    "nextGateRequiredChecksSummary.byTypeRegistryStatus",
    "nextGateRequiredChecksSummary.byTypeRegistryStatusField",
    "nextGateRequiredChecksSummary.byTypeRegistryInvariant",
    "nextGateRequiredChecksSummary.byTypeRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.db.count",
    "nextGateRequiredChecksSummary.byType.guard.count",
    "nextGateRequiredChecksSummary.byType.test.count",
    "nextGateRequiredChecksSummary.byType.privacy.count",
    "nextGateRequiredChecksSummary.byType.errors.count",
    "nextGateRequiredChecksSummary.byType.db.countField",
    "nextGateRequiredChecksSummary.byType.guard.countField",
    "nextGateRequiredChecksSummary.byType.test.countField",
    "nextGateRequiredChecksSummary.byType.privacy.countField",
    "nextGateRequiredChecksSummary.byType.errors.countField",
    "nextGateRequiredChecksSummary.byType.db.commandsField",
    "nextGateRequiredChecksSummary.byType.guard.commandsField",
    "nextGateRequiredChecksSummary.byType.test.commandsField",
    "nextGateRequiredChecksSummary.byType.privacy.commandsField",
    "nextGateRequiredChecksSummary.byType.errors.commandsField",
    "nextGateRequiredChecksSummary.byType.db.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.guard.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.test.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.privacy.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.errors.commandLastIndex",
    "nextGateRequiredChecksSummary.byType.db.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.guard.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.test.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.privacy.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.errors.commandLastIndexField",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatusField",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant",
    "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariantField",
    "nextGateRequiredChecksSummary.byType.db.commands.0",
    "nextGateRequiredChecksSummary.byType.db.commands.7",
    "nextGateRequiredChecksSummary.byType.guard.commands.0",
    "nextGateRequiredChecksSummary.byType.guard.commands.1",
    "nextGateRequiredChecksSummary.byType.test.commands.0",
    "nextGateRequiredChecksSummary.byType.privacy.commands.0",
    "nextGateRequiredChecksSummary.byType.errors.commands.0",
    "productionBlockersSummary",
    "productionBlockersSummary.count",
    "productionBlockersSummary.countField",
    "productionBlockersSummary.first",
    "productionBlockersSummary.firstField",
    "productionBlockersSummary.last",
    "productionBlockersSummary.lastField",
    "productionBlockersSummary.lastIndex",
    "productionBlockersSummary.lastIndexField",
    "productionBlockersSummary.registryStatus",
    "productionBlockersSummary.registryStatusField",
    "productionBlockersSummary.registryInvariant",
    "productionBlockersSummary.registryInvariantField",
    "productionBlockersSummary.nextGateBlocker",
    "productionBlockersSummary.nextGateBlockerField",
    "productionBlockersSummary.nextGate",
    "productionBlockersSummary.nextGateField",
    "productionBlockersSummary.nextGateDocPath",
    "productionBlockersSummary.nextGateDocPathField",
    "productionBlockersSummary.blockersField",
    "productionBlockersSummary.blockers.0",
    "productionBlockersSummary.blockers.4",
    "productionBlockersSummary.byGate",
    "productionBlockersSummary.byGateField",
    "productionBlockersSummary.byGateCount",
    "productionBlockersSummary.byGateCountField",
    "productionBlockersSummary.byGate.gate1.blocker",
    "productionBlockersSummary.byGate.gate1.docPath",
    "productionBlockersSummary.byGate.gate2.blocker",
    "productionBlockersSummary.byGate.gate2.docPath",
    "productionBlockersSummary.byGate.gate3.blocker",
    "productionBlockersSummary.byGate.gate3.docPath",
    "productionBlockersSummary.byGate.gate4.blocker",
    "productionBlockersSummary.byGate.gate4.docPath",
    "productionBlockersSummary.byGateKeys",
    "productionBlockersSummary.byGateKeysField",
    "productionBlockersSummary.byGateLastIndex",
    "productionBlockersSummary.byGateLastIndexField",
    "productionBlockersSummary.byGateFirst",
    "productionBlockersSummary.byGateFirstField",
    "productionBlockersSummary.byGateLast",
    "productionBlockersSummary.byGateLastField",
    "productionBlockersSummary.byGateRegistryStatus",
    "productionBlockersSummary.byGateRegistryStatusField",
    "productionBlockersSummary.byGateRegistryInvariant",
    "productionBlockersSummary.byGateRegistryInvariantField",
    "productionBlockersSummary.preGateKey",
    "productionBlockersSummary.preGateKeyField",
    "productionBlockersSummary.gateOrder",
    "productionBlockersSummary.gateOrderField",
    "productionBlockersSummary.gateOrder.0",
    "productionBlockersSummary.gateOrder.3",
    "productionBlockersSummary.gateOrderCount",
    "productionBlockersSummary.gateOrderCountField",
    "productionBlockersSummary.gateOrderLastIndex",
    "productionBlockersSummary.gateOrderLastIndexField",
    "productionBlockersSummary.gateOrderFirst",
    "productionBlockersSummary.gateOrderFirstField",
    "productionBlockersSummary.gateOrderLast",
    "productionBlockersSummary.gateOrderLastField",
    "productionBlockersSummary.gateOrderRegistryStatus",
    "productionBlockersSummary.gateOrderRegistryStatusField",
    "productionBlockersSummary.gateOrderRegistryInvariant",
    "productionBlockersSummary.gateOrderRegistryInvariantField",
    "productionBlockersSummary.gateOrderDetails",
    "productionBlockersSummary.gateOrderDetailsField",
    "productionBlockersSummary.gateOrderDetails.0.key",
    "productionBlockersSummary.gateOrderDetails.0.docPath",
    "productionBlockersSummary.gateOrderDetails.3.key",
    "productionBlockersSummary.gateOrderDetails.3.docPath",
    "productionBlockersSummary.gateOrderDetailsCount",
    "productionBlockersSummary.gateOrderDetailsCountField",
    "productionBlockersSummary.gateOrderDetailsLastIndex",
    "productionBlockersSummary.gateOrderDetailsLastIndexField",
    "productionBlockersSummary.gateOrderDetailsFirst",
    "productionBlockersSummary.gateOrderDetailsFirstField",
    "productionBlockersSummary.gateOrderDetailsLast",
    "productionBlockersSummary.gateOrderDetailsLastField",
    "productionBlockersSummary.gateOrderDetailsRegistryStatus",
    "productionBlockersSummary.gateOrderDetailsRegistryStatusField",
    "productionBlockersSummary.gateOrderDetailsRegistryInvariant",
    "productionBlockersSummary.gateOrderDetailsRegistryInvariantField",
    "productionBlockersSummary.gateOrderDetailsSummary",
    "productionBlockersSummary.gateOrderDetailsSummaryField"
  ];
  const fieldAliasLastIndex = fieldAliases.length - 1;
  const commandLastIndex = commands.length - 1;
  const reportFieldLastIndex = readyReportFields.length - 1;
  const readyCommandLastIndex = readyCommands.length - 1;
  const readyRequiredFieldLastIndex = readyRequiredFields.length - 1;

  return {
    fieldAliasCount: fieldAliases.length,
    fieldAliasCountField: "nextGateCiHandoff.fieldAliasCount",
    fieldAliasLastIndex,
    fieldAliasLastIndexField: "nextGateCiHandoff.fieldAliasLastIndex",
    fieldAliasRegistryStatus: "consistent",
    fieldAliasRegistryStatusField: "nextGateCiHandoff.fieldAliasRegistryStatus",
    fieldAliasRegistryInvariant: `count=${fieldAliases.length},lastIndex=${fieldAliasLastIndex}`,
    fieldAliasRegistryInvariantField: "nextGateCiHandoff.fieldAliasRegistryInvariant",
    fieldAliasFirst: fieldAliases[0],
    fieldAliasFirstField: "nextGateCiHandoff.fieldAliasFirst",
    fieldAliasLast: fieldAliases[fieldAliases.length - 1],
    fieldAliasLastField: "nextGateCiHandoff.fieldAliasLast",
    fieldAliasEndpointsField: "nextGateCiHandoff.fieldAliasEndpoints",
    fieldAliasEndpoints: {
      first: fieldAliases[0],
      last: fieldAliases[fieldAliases.length - 1]
    },
    fieldAliasSummary: `${fieldAliases.length} aliases, first=${fieldAliases[0]}, last=${fieldAliases[fieldAliases.length - 1]}`,
    fieldAliasSummaryField: "nextGateCiHandoff.fieldAliasSummary",
    fieldAliasesField: "nextGateCiHandoff.fieldAliases",
    fieldAliases,
    transitionPlanField: "nextGateTransitionPlan",
    readinessField: "nextGateReadiness",
    requiredCheckCount: commands.length,
    requiredCheckCountField: "nextGateCiHandoff.requiredCheckCount",
    requiredChecksSource: nextGateRequiredChecksSource,
    requiredChecksSourceField: "nextGateCiHandoff.requiredChecksSource",
    requiredChecksParsed: nextGateRequiredChecksParsed,
    requiredChecksParsedField: "nextGateCiHandoff.requiredChecksParsed",
    commandCount: commands.length,
    commandCountField: "nextGateCiHandoff.commandCount",
    commandLastIndex,
    commandLastIndexField: "nextGateCiHandoff.commandLastIndex",
    commandRegistryStatus: "consistent",
    commandRegistryStatusField: "nextGateCiHandoff.commandRegistryStatus",
    commandRegistryInvariant: `count=${commands.length},lastIndex=${commandLastIndex}`,
    commandRegistryInvariantField: "nextGateCiHandoff.commandRegistryInvariant",
    commandsField: "nextGateCiHandoff.commands",
    watchFieldsField: "nextGateCiHandoff.watchFields",
    watchFieldCount: watchFields.length,
    watchFieldCountField: "nextGateCiHandoff.watchFieldCount",
    watchFields,
    passCriteriaCount: Object.keys(passCriteria).length,
    passCriteriaCountField: "nextGateCiHandoff.passCriteriaCount",
    passCriteriaField: "nextGateCiHandoff.passCriteria",
    passCriteria,
    failureCodeCount: Object.keys(failureCodes).length,
    failureCodeCountField: "nextGateCiHandoff.failureCodeCount",
    failureCodesField: "nextGateCiHandoff.failureCodes",
    failureCodes,
    evidenceDocCount: Object.keys(evidenceDocs).length,
    evidenceDocCountField: "nextGateCiHandoff.evidenceDocCount",
    evidenceDocsField: "nextGateCiHandoff.evidenceDocs",
    evidenceDocs,
    assertionCount: Object.keys(assertions).length,
    assertionCountField: "nextGateCiHandoff.assertionCount",
    assertionsField: "nextGateCiHandoff.assertions",
    assertions,
    readyWhen: {
      status: ciReadyStatus,
      summary: ciReadySummary,
      statusField: "nextGateCiHandoff.readyWhen.status",
      summaryField: "nextGateCiHandoff.readyWhen.summary",
      requiredFieldsField: "nextGateCiHandoff.readyWhen.requiredFields",
      commandsField: "nextGateCiHandoff.readyWhen.commands",
      reportFieldsField: "nextGateCiHandoff.readyWhen.reportFields",
      assertionCount: 3,
      assertionCountField: "nextGateCiHandoff.readyWhen.assertionCount",
      requiredFieldCount: readyRequiredFields.length,
      requiredFieldCountField: "nextGateCiHandoff.readyWhen.requiredFieldCount",
      requiredFields: readyRequiredFields,
      requiredFieldLastIndex: readyRequiredFieldLastIndex,
      requiredFieldLastIndexField: "nextGateCiHandoff.readyWhen.requiredFieldLastIndex",
      requiredFieldRegistryStatus: "consistent",
      requiredFieldRegistryStatusField: "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus",
      requiredFieldRegistryInvariant: `count=${readyRequiredFields.length},lastIndex=${readyRequiredFieldLastIndex}`,
      requiredFieldRegistryInvariantField: "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant",
      reportFieldCount: readyReportFields.length,
      reportFieldCountField: "nextGateCiHandoff.readyWhen.reportFieldCount",
      reportFieldLastIndex,
      reportFieldLastIndexField: "nextGateCiHandoff.readyWhen.reportFieldLastIndex",
      reportFieldRegistryStatus: "consistent",
      reportFieldRegistryStatusField: "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus",
      reportFieldRegistryInvariant: `count=${readyReportFields.length},lastIndex=${reportFieldLastIndex}`,
      reportFieldRegistryInvariantField: "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant",
      reportFieldFirst: readyReportFields[0],
      reportFieldFirstField: "nextGateCiHandoff.readyWhen.reportFieldFirst",
      reportFieldLast: readyReportFields[readyReportFields.length - 1],
      reportFieldLastField: "nextGateCiHandoff.readyWhen.reportFieldLast",
      reportFieldEndpointsField: "nextGateCiHandoff.readyWhen.reportFieldEndpoints",
      reportFieldEndpoints: {
        first: readyReportFields[0],
        last: readyReportFields[readyReportFields.length - 1]
      },
      reportFieldSummary: `${readyReportFields.length} report fields, first=${readyReportFields[0]}, last=${readyReportFields[readyReportFields.length - 1]}`,
      reportFieldSummaryField: "nextGateCiHandoff.readyWhen.reportFieldSummary",
      reportFields: readyReportFields,
      reportValues,
      reportValuesField: "nextGateCiHandoff.readyWhen.reportValues",
      reportValueKeys,
      reportValueKeysField: "nextGateCiHandoff.readyWhen.reportValueKeys",
      reportValueCount: reportValueKeys.length,
      reportValueCountField: "nextGateCiHandoff.readyWhen.reportValueCount",
      reportValueLastIndex,
      reportValueLastIndexField: "nextGateCiHandoff.readyWhen.reportValueLastIndex",
      reportValueFirst: reportValueKeys[0],
      reportValueFirstField: "nextGateCiHandoff.readyWhen.reportValueFirst",
      reportValueLast: reportValueKeys[reportValueLastIndex],
      reportValueLastField: "nextGateCiHandoff.readyWhen.reportValueLast",
      reportValueEndpointsField: "nextGateCiHandoff.readyWhen.reportValueEndpoints",
      reportValueEndpoints: {
        first: reportValueKeys[0],
        last: reportValueKeys[reportValueLastIndex]
      },
      reportValueEndpointSummary: `first=${reportValueKeys[0]}, last=${reportValueKeys[reportValueLastIndex]}`,
      reportValueEndpointSummaryField: "nextGateCiHandoff.readyWhen.reportValueEndpointSummary",
      reportValueRegistryStatus: "consistent",
      reportValueRegistryStatusField: "nextGateCiHandoff.readyWhen.reportValueRegistryStatus",
      reportValueRegistryInvariant: `count=${reportValueKeys.length},lastIndex=${reportValueLastIndex}`,
      reportValueRegistryInvariantField: "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant",
      reportValueSummary: `${reportValueKeys.length} values, first=${reportValueKeys[0]}, last=${reportValueKeys[reportValueLastIndex]}`,
      reportValueSummaryField: "nextGateCiHandoff.readyWhen.reportValueSummary",
      commandCount: readyCommands.length,
      commandCountField: "nextGateCiHandoff.readyWhen.commandCount",
      commandLastIndex: readyCommandLastIndex,
      commandLastIndexField: "nextGateCiHandoff.readyWhen.commandLastIndex",
      commandRegistryStatus: "consistent",
      commandRegistryStatusField: "nextGateCiHandoff.readyWhen.commandRegistryStatus",
      commandRegistryInvariant: `count=${readyCommands.length},lastIndex=${readyCommandLastIndex}`,
      commandRegistryInvariantField: "nextGateCiHandoff.readyWhen.commandRegistryInvariant",
      commands: readyCommands
    },
    rollback: {
      mode: "fixture",
      modeField: "nextGateCiHandoff.rollback.mode",
      expectedModeField: "nextGateCiHandoff.rollback.expectedMode",
      summary: "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff",
      summaryField: "nextGateCiHandoff.rollback.summary",
      command: "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue",
      commandField: "nextGateCiHandoff.rollback.command",
      commandsField: "nextGateCiHandoff.rollback.commands",
      verificationCommand: "npm run gate0:status -- --field persistenceModeDefault",
      verificationCommandField: "nextGateCiHandoff.rollback.verificationCommand",
      reportCommand: "npm run gate0:status -- --field nextGateCiHandoff.rollback",
      reportCommandField: "nextGateCiHandoff.rollback.reportCommand",
      commandCount: rollbackCommands.length,
      commandCountField: "nextGateCiHandoff.rollback.commandCount",
      commandLastIndex: rollbackCommandLastIndex,
      commandLastIndexField: "nextGateCiHandoff.rollback.commandLastIndex",
      commandFirst: rollbackCommands[0],
      commandFirstField: "nextGateCiHandoff.rollback.commandFirst",
      commandLast: rollbackCommands[rollbackCommandLastIndex],
      commandLastField: "nextGateCiHandoff.rollback.commandLast",
      commandEndpoints: {
        first: rollbackCommands[0],
        last: rollbackCommands[rollbackCommandLastIndex]
      },
      commandEndpointsField: "nextGateCiHandoff.rollback.commandEndpoints",
      commandEndpointSummary: `first=${rollbackCommands[0]}, last=${rollbackCommands[rollbackCommandLastIndex]}`,
      commandEndpointSummaryField: "nextGateCiHandoff.rollback.commandEndpointSummary",
      commandRegistryStatus: "consistent",
      commandRegistryStatusField: "nextGateCiHandoff.rollback.commandRegistryStatus",
      commandRegistryInvariant: `count=${rollbackCommands.length},lastIndex=${rollbackCommandLastIndex}`,
      commandRegistryInvariantField: "nextGateCiHandoff.rollback.commandRegistryInvariant",
      commands: rollbackCommands,
      expectedMode: "fixture"
    },
    commands
  };
}

function buildNextGateTransitionPlan() {
  return {
    count: 3,
    transitions: {
      migrationStatus: {
        command: nextGateMigrationStatusCommand,
        currentExpected: "scaffolded",
        nextExpected: "database_read_parity"
      },
      databaseUrlStatus: {
        command: nextGateDatabaseUrlStatusCommand,
        currentExpected: "missing",
        nextExpected: nextGateDatabaseUrlExpectedStatus
      },
      databaseUrlProtocol: {
        command: nextGateDatabaseUrlProtocolCommand,
        currentExpected: "none",
        nextExpected: nextGateDatabaseUrlExpectedProtocols
      }
    },
    orderedSteps: [
      {
        id: "scaffold-prisma",
        command: nextGateMigrationStatusCommand,
        target: "database_read_parity"
      },
      {
        id: "set-database-url",
        command: nextGateDatabaseUrlValidationCommand,
        target: "valid postgresql|postgres DATABASE_URL"
      },
      {
        id: "verify-db-matrix",
        command: nextGateCheckJsonCommand,
        target: "all Gate 1 DB matrix fields pass"
      }
    ]
  };
}

function formatTransitionTargets(plan) {
  return [
    plan.transitions.migrationStatus.nextExpected,
    plan.transitions.databaseUrlStatus.nextExpected,
    plan.transitions.databaseUrlProtocol.nextExpected.join("|")
  ].join(", ");
}

function buildNextGateReadiness(commands) {
  const transitionCommands = commands.filter(isGate1TransitionCommand);
  const verifiedNowCommands = commands.filter((command) => !isGate1TransitionCommand(command));
  return {
    verifiedNowCount: verifiedNowCommands.length,
    transitionCount: transitionCommands.length,
    verifiedNowCommands,
    transitionCommands
  };
}

function isGate1TransitionCommand(command) {
  return command === "npm run db:check -- --field migrationStatus"
    || command === "npm run db:check -- --field databaseUrlStatus"
    || command === "npm run db:check -- --field databaseUrlProtocol";
}

function groupRequiredChecksByType(commands) {
  const groups = {};
  for (const command of commands) {
    const type = requiredCheckType(command);
    groups[type] ??= { count: 0, commands: [] };
    groups[type].count += 1;
    groups[type].commands.push(command);
  }
  for (const [type, group] of Object.entries(groups)) {
    group.countField = `nextGateRequiredChecksSummary.byType.${type}.count`;
    group.commandsField = `nextGateRequiredChecksSummary.byType.${type}.commands`;
    group.commandLastIndex = group.commands.length - 1;
    group.commandLastIndexField = `nextGateRequiredChecksSummary.byType.${type}.commandLastIndex`;
    group.commandRegistryStatus = "consistent";
    group.commandRegistryStatusField = `nextGateRequiredChecksSummary.byType.${type}.commandRegistryStatus`;
    group.commandRegistryInvariant = `count=${group.count},lastIndex=${group.commandLastIndex}`;
    group.commandRegistryInvariantField = `nextGateRequiredChecksSummary.byType.${type}.commandRegistryInvariant`;
  }
  return groups;
}

function requiredCheckType(command) {
  if (command.includes("db:check")) return "db";
  if (command.includes("not-scaffolded")) return "guard";
  if (command === "npm test") return "test";
  if (command.includes("privacy")) return "privacy";
  if (command.includes("errors")) return "errors";
  if (command.includes("api:")) return "api";
  return "other";
}

function formatRequiredCheckGroups(groups) {
  return Object.entries(groups)
    .map(([type, group]) => `${type}=${group.count}`)
    .join(", ");
}

function flushStdout() {
  return new Promise((resolve) => process.stdout.write("", resolve));
}
