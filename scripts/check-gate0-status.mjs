import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const statusScriptPath = path.join(root, "scripts", "gate0-status.mjs");
const tempRoot = await mkdtemp(path.join(os.tmpdir(), "thai-meet-gate0-status-"));
const realStatusDoc = await readFile(path.join(root, "docs", "dev", "GATE0_STATUS.md"), "utf8");
assertIncludes(realStatusDoc, "Gate 1 persistence handoff exposes DB matrix JSON, nested fields, required checks, and fail-closed migration guard automation.", "real Gate 0 status doc should include completed Gate 1 handoff automation");
assertIncludes(realStatusDoc, "Gate 1 CI ready report includes the compact Prisma scaffold status summary.", "real Gate 0 status doc should include completed Prisma scaffold status ready report value");
assertIncludes(realStatusDoc, "Gate 0 status exposes Prisma scaffold status summary as a top-level stable field.", "real Gate 0 status doc should include completed top-level Prisma scaffold status summary field");
assertIncludes(realStatusDoc, "Gate 1 CI ready report includes the production blocker count for compact handoff logs.", "real Gate 0 status doc should include completed production blocker count ready report value");
assertIncludes(realStatusDoc, "Gate 0 status exposes production blocker count as a top-level stable field.", "real Gate 0 status doc should include completed top-level production blocker count field");
assertIncludes(realStatusDoc, "Gate 0 status exposes production gate order details summary as a top-level stable field.", "real Gate 0 status doc should include completed top-level production gate order details summary field");
assertIncludes(realStatusDoc, "Gate 1 CI ready report includes progress percent for compact handoff logs.", "real Gate 0 status doc should include completed progress percent ready report value");
assertIncludes(realStatusDoc, "Gate 1 CI ready report includes progress basis summary for compact handoff logs.", "real Gate 0 status doc should include completed progress basis summary ready report value");
assertIncludes(realStatusDoc, "Gate 1 CI ready report includes remaining blockers summary for compact handoff logs.", "real Gate 0 status doc should include completed remaining blockers summary ready report value");
assertIncludes(realStatusDoc, "Gate 0 status exposes progress basis summary as a top-level stable field.", "real Gate 0 status doc should include completed top-level progress basis summary field");
assertIncludes(realStatusDoc, "Gate 0 status exposes remaining blockers summary as a top-level stable field.", "real Gate 0 status doc should include completed top-level remaining blockers summary field");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready status and summary as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready status fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report values as a top-level stable field.", "real Gate 0 status doc should include completed top-level CI ready report values field");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value keys as a top-level stable field.", "real Gate 0 status doc should include completed top-level CI ready report value keys field");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value count and summary as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready report value count fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value endpoints as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready report value endpoint fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value registry status as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready report value registry fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value endpoints and indexes as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready report value endpoint/index fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready report value alias fields as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready report value alias fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes all CI ready report value alias fields as top-level stable fields.", "real Gate 0 status doc should include completed all top-level CI ready report value alias fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready required fields as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready required fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI ready commands as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI ready commands");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI assertions as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI assertions");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI assertion expected values and commands as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI assertion expected values and commands");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI pass criteria as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI pass criteria");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI failure codes as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI failure codes");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI evidence docs as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI evidence docs");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI watch fields as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI watch fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI required check metadata as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI required check metadata");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI readiness and transition plan as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI readiness fields");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI transition expectations as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI transition expectations");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI transition ordered steps as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI transition ordered steps");
assertIncludes(realStatusDoc, "Gate 0 status exposes CI rollback summary as top-level stable fields.", "real Gate 0 status doc should include completed top-level CI rollback summary");
assertIncludes(realStatusDoc, "Gate 1 database persistence mode now exists as a fail-closed store boundary while fixture remains the default.", "real Gate 0 status doc should include completed database mode fail-closed boundary");
assertIncludes(realStatusDoc, "Gate 1 database persistence mode routes unscaffolded reads through a stable error envelope.", "real Gate 0 status doc should include completed database mode error envelope boundary");

try {
  await mkdir(path.join(tempRoot, "docs", "dev"), { recursive: true });
  await mkdir(path.join(tempRoot, ".thai-meet", "device-smoke"), { recursive: true });
  await mkdir(path.join(tempRoot, "apps", "api", "prisma", "migrations", "20260615000000_gate1_persistence_scaffold"), { recursive: true });

  await writeFile(path.join(tempRoot, "docs", "dev", "GATE0_STATUS.md"), [
    "# Gate 0 Status",
    "",
    "Current local status: executable vertical slice, production-incomplete.",
    "",
    "Completed locally:",
    "",
    "- Flutter app runs on web, Windows, and Android device targets.",
    "- Gate 0 nav is `Discover`, `Swipe`, `Chat`, `List`, `My`.",
    "- Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.",
    "",
    "Full test baseline: `npm test` passed with 89 Flutter widget tests.",
    "",
    "Local API boundary checks:",
    "",
    "- `npm run api:fixture-store:test`",
    "- `npm run api:service:test`",
    "",
    "Still not done:",
    "",
    "- Real auth/provider/storage integrations.",
    "- Production backend persistence.",
    "- AWS CI/deploy pipeline.",
    "- Formal Figma/DESIGN.md source of truth.",
    "- App store/release build signing.",
    "",
    "Related docs:",
    "",
    "- `CI.md`",
    "- `DESIGN_STATUS.md`",
    "- `PRODUCTION_GAPS.md`",
    "- `GATE1_PERSISTENCE.md`",
    "- `ROADMAP.md`",
    ""
  ].join("\n"));

  await writeFile(path.join(tempRoot, "docs", "dev", "GATE1_PERSISTENCE.md"), [
    "# Gate 1 Persistence",
    "",
    "## Required Checks",
    "",
    "```powershell",
    "npm run db:check",
    "npm run db:check -- --json",
    "npm run db:check -- --field migrationStatus",
    "npm run db:check -- --field prismaSchemaPresent",
    "npm run db:check -- --field prismaScaffoldStatus.summary",
    "npm run db:check -- --field databaseUrlPresent",
    "npm run db:check -- --field databaseUrlStatus",
    "npm run db:check -- --field databaseUrlProtocol",
    "npm run not-scaffolded:test",
    "node scripts/not-scaffolded.mjs --help",
    "npm test",
    "npm run privacy:test",
    "npm run errors:check",
    "```",
    ""
  ].join("\n"));

  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"), JSON.stringify({
    status: "passed",
    runId: "fixture-run",
    deviceManufacturer: "OPPO",
    deviceModel: "CPH2695",
    androidRelease: "16",
    androidSdk: "36"
  }, null, 2));
  await writeFile(path.join(tempRoot, "apps", "api", "prisma", "schema.prisma"), "model User {\n  id String @id\n}\n");
  await writeFile(path.join(tempRoot, "apps", "api", "prisma", "migrations", "20260615000000_gate1_persistence_scaffold", "migration.sql"), "CREATE TABLE \"User\" (\"id\" TEXT PRIMARY KEY);\n");

  const result = await runStatus();

  assertExit(result, 0, "gate0 status should pass");
  assertIncludes(result.stdout, "Gate 0 status: executable vertical slice, production-incomplete.", "status output should include current status");
  assertIncludes(result.stdout, "Progress: 38%", "status output should include progress percent");
  assertIncludes(result.stdout, "Completed locally: Flutter app runs on web, Windows, and Android device targets.; Gate 0 nav is `Discover`, `Swipe`, `Chat`, `List`, `My`.; Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.", "status output should include completed local work");
  assertIncludes(result.stdout, "Full test baseline: 89 Flutter widget tests", "status output should include test baseline");
  assertIncludes(result.stdout, "Still not done: Real auth/provider/storage integrations.; Production backend persistence.; AWS CI/deploy pipeline.; Formal Figma/DESIGN.md source of truth.; App store/release build signing.", "status output should include remaining production blockers");
  assertIncludes(result.stdout, "Related docs: CI.md, DESIGN_STATUS.md, PRODUCTION_GAPS.md, GATE1_PERSISTENCE.md, ROADMAP.md", "status output should include related docs");
  assertIncludes(result.stdout, "Persistence default: fixture", "status output should include persistence default");
  assertIncludes(result.stdout, "Supported persistence modes: fixture, database", "status output should include supported persistence modes");
  assertIncludes(result.stdout, "Latest Android device smoke: passed (OPPO CPH2695, Android 16 / API 36, fixture-run)", "status output should include device summary");
  assertIncludes(result.stdout, "Next gate: Gate 1 production backend persistence", "status output should include next gate");
  assertIncludes(result.stdout, "Next gate doc: GATE1_PERSISTENCE.md", "status output should include next gate doc");
  assertIncludes(result.stdout, "Next gate doc path: docs/dev/GATE1_PERSISTENCE.md", "status output should include next gate doc path");
  assertIncludes(result.stdout, "Next gate command: npm run gate0:status -- --field nextGateDocPath", "status output should include next gate command");
  assertIncludes(result.stdout, "Next gate check command: npm run db:check", "status output should include next gate check command");
  assertIncludes(result.stdout, "Next gate check JSON command: npm run db:check -- --json", "status output should include next gate check JSON command");
  assertIncludes(result.stdout, "Next gate migration status command: npm run db:check -- --field migrationStatus", "status output should include next gate migration status command");
  assertIncludes(result.stdout, "Next gate migration status handoff: scaffolded -> database_read_parity", "status output should include next gate migration status handoff summary");
  assertIncludes(result.stdout, "Next gate database URL status command: npm run db:check -- --field databaseUrlStatus", "status output should include next gate database URL status command");
  assertIncludes(result.stdout, "Next gate database URL protocol command: npm run db:check -- --field databaseUrlProtocol", "status output should include next gate database URL protocol command");
  assertIncludes(result.stdout, "Next gate database URL validation command: $env:DATABASE_URL='<postgresql-url>'; npm run db:check -- --field databaseUrlStatus; npm run db:check -- --field databaseUrlProtocol; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue", "status output should include next gate database URL validation command");
  assertIncludes(result.stdout, "Next gate database URL expected status: valid", "status output should include next gate database URL expected status");
  assertIncludes(result.stdout, "Next gate database URL expected protocols: postgresql, postgres", "status output should include next gate database URL expected protocols");
  assertIncludes(result.stdout, "Next gate database URL handoff: npm run db:check -- --field databaseUrlStatus -> valid", "status output should include compact next gate database URL handoff summary");
  assertIncludes(result.stdout, "Next gate Prisma scaffold: apps/api/prisma/schema.prisma, apps/api/prisma/migrations -> true", "status output should include compact next gate Prisma scaffold summary");
  assertIncludes(result.stdout, "Next gate migration guard command: npm run not-scaffolded:test", "status output should include next gate migration guard command");
  assertIncludes(result.stdout, "Next gate migration guard migration command: npm run db:migrate", "status output should include next gate migration guard migration command");
  assertIncludes(result.stdout, "Next gate migration guard helper command: node scripts/not-scaffolded.mjs --help", "status output should include next gate migration guard helper command");
  assertIncludes(result.stdout, "Next gate migration guard error code: TM_COMMAND_NOT_SCAFFOLDED", "status output should include next gate migration guard error code");
  assertIncludes(result.stdout, "Next gate migration guard: npm run not-scaffolded:test -> npm run db:migrate -> TM_COMMAND_NOT_SCAFFOLDED", "status output should include compact next gate migration guard summary");
  assertIncludes(result.stdout, "Next gate DB matrix handoff: npm run db:check -- --json -> npm run db:check -- --field migrationStatus", "status output should include compact next gate DB matrix handoff summary");
  assertIncludes(result.stdout, "Next gate required checks source: docs/dev/GATE1_PERSISTENCE.md#required-checks", "status output should include next gate required checks source");
  assertIncludes(result.stdout, "Next gate required checks parsed: true", "status output should include parsed required checks status");
  assertIncludes(result.stdout, "Next gate required checks summary: 13 checks from docs/dev/GATE1_PERSISTENCE.md#required-checks", "status output should include next gate required checks summary");
  assertIncludes(result.stdout, "Next gate required checks by type: db=8, guard=2, test=1, privacy=1, errors=1", "status output should include next gate required checks type summary");
  assertIncludes(result.stdout, "Next gate readiness: 10 verified now, 3 transition checks", "status output should include next gate readiness summary");
  assertIncludes(result.stdout, "Next gate transition plan: 3 transitions -> database_read_parity, valid, postgresql|postgres", "status output should include next gate transition plan summary");
  assertIncludes(result.stdout, "Next gate transition steps: scaffold-prisma -> set-database-url -> verify-db-matrix", "status output should include next gate transition steps summary");
  assertIncludes(result.stdout, "Next gate CI handoff: 3 watch fields, 13 required checks", "status output should include next gate CI handoff summary");
  assertIncludes(result.stdout, "Next gate required checks: npm run db:check, npm run db:check -- --json, npm run db:check -- --field migrationStatus, npm run db:check -- --field prismaSchemaPresent, npm run db:check -- --field prismaScaffoldStatus.summary, npm run db:check -- --field databaseUrlPresent, npm run db:check -- --field databaseUrlStatus, npm run db:check -- --field databaseUrlProtocol, npm run not-scaffolded:test, node scripts/not-scaffolded.mjs --help, npm test, npm run privacy:test, npm run errors:check", "status output should include next gate required checks from Gate 1 doc");

  const jsonResult = await runStatus(["--json"]);
  assertExit(jsonResult, 0, "gate0 status JSON should pass");
  const parsed = JSON.parse(jsonResult.stdout);
  assertEqual(parsed.currentStatus, "executable vertical slice, production-incomplete.", "JSON should include current status");
  assertEqual(parsed.currentStatusField, "currentStatus", "JSON should include current status alias");
  assertEqual(parsed.currentStatusSummary, "Gate 0 status: executable vertical slice, production-incomplete.", "JSON should include current status summary");
  assertEqual(parsed.currentStatusSummaryField, "currentStatusSummary", "JSON should include current status summary alias");
  assertEqual(parsed.progressPercent, 38, "JSON should include progress percent");
  assertObject(parsed.progressBasis, "JSON should include progress basis");
  assertEqual(parsed.progressBasis.completedCount, 3, "JSON should include completed progress count");
  assertEqual(parsed.progressBasis.remainingCount, 5, "JSON should include remaining progress count");
  assertEqual(parsed.progressBasis.totalCount, 8, "JSON should include total progress count");
  assertEqual(parsed.progressBasisSummary, "3/8 completed, 5 remaining, 38%", "JSON should include compact progress basis summary");
  assertEqual(parsed.ciReadyStatus, "all_assertions_pass", "JSON should include compact CI ready status");
  assertEqual(parsed.ciReadySummary, "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON should include compact CI ready summary");
  assertObject(parsed.ciReadyReportValues, "JSON should include compact CI ready report values");
  assertEqual(parsed.ciReadyReportValues.status, "all_assertions_pass", "JSON CI ready report values should include ready status");
  assertEqual(parsed.ciReadyReportValues.summary, "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON CI ready report values should include ready summary");
  assertArrayIncludes(parsed.ciReadyReportValueKeys, "status", "JSON CI ready report value keys should include status");
  assertArrayIncludes(parsed.ciReadyReportValueKeys, "remainingBlockersSummary", "JSON CI ready report value keys should include remaining blockers summary");
  assertEqual(parsed.ciReadyReportValueCount, 25, "JSON CI ready report value count should include report value count");
  assertEqual(parsed.ciReadyReportValueSummary, "25 values, first=status, last=remainingBlockersSummary", "JSON CI ready report value summary should include compact report value summary");
  assertObject(parsed.ciReadyReportValueEndpoints, "JSON CI ready report value endpoints should include endpoint object");
  assertEqual(parsed.ciReadyReportValueEndpoints.first, "status", "JSON CI ready report value endpoints should include first key");
  assertEqual(parsed.ciReadyReportValueEndpoints.last, "remainingBlockersSummary", "JSON CI ready report value endpoints should include last key");
  assertEqual(parsed.ciReadyReportValueEndpointSummary, "first=status, last=remainingBlockersSummary", "JSON CI ready report value endpoint summary should include compact endpoint summary");
  assertEqual(parsed.ciReadyReportValueRegistryStatus, "consistent", "JSON CI ready report value registry status should include registry status");
  assertEqual(parsed.ciReadyReportValueRegistryInvariant, "count=25,lastIndex=24", "JSON CI ready report value registry invariant should include compact invariant");
  assertEqual(parsed.ciReadyReportValueLastIndex, 24, "JSON CI ready report value last index should include last index");
  assertEqual(parsed.ciReadyReportValueFirst, "status", "JSON CI ready report value first should include first key");
  assertEqual(parsed.ciReadyReportValueLast, "remainingBlockersSummary", "JSON CI ready report value last should include last key");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFirst, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI ready report value rollback first command should include command");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFirstField, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst", "JSON CI ready report value rollback first command alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandLast, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI ready report value rollback last command should include command");
  assertEqual(parsed.ciReadyReportValueRollbackCommandLastField, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast", "JSON CI ready report value rollback last command alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandEndpointSummary, "first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI ready report value rollback endpoint summary should include compact summary");
  assertEqual(parsed.ciReadyReportValueRollbackCommandEndpointSummaryField, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready report value rollback endpoint summary alias should include canonical path");
  assertArrayIncludes(parsed.ciReadyReportValueRollbackCommandFields, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst", "JSON CI ready rollback report value fields should include first command alias");
  assertArrayIncludes(parsed.ciReadyReportValueRollbackCommandFields, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value fields should include endpoint summary alias");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldsField, "ciReadyReportValueRollbackCommandFields", "JSON CI ready rollback report value fields alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField0, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst", "JSON CI ready rollback report value field 0 should include first field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField0Field, "ciReadyReportValueRollbackCommandFields.0", "JSON CI ready rollback report value field 0 alias should include indexed path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField1, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast", "JSON CI ready rollback report value field 1 should include last command field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField1Field, "ciReadyReportValueRollbackCommandFields.1", "JSON CI ready rollback report value field 1 alias should include indexed path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField2, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value field 2 should include endpoint summary field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandField2Field, "ciReadyReportValueRollbackCommandFields.2", "JSON CI ready rollback report value field 2 alias should include indexed path");
  assertArrayIncludes(parsed.ciReadyReportValueRollbackCommandFieldIndexes, 0, "JSON CI ready rollback report value field indexes should include first index");
  assertArrayIncludes(parsed.ciReadyReportValueRollbackCommandFieldIndexes, 2, "JSON CI ready rollback report value field indexes should include last index");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldIndexesField, "ciReadyReportValueRollbackCommandFieldIndexes", "JSON CI ready rollback report value field indexes alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldIndexCount, 3, "JSON CI ready rollback report value field index count should include count");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldIndexCountField, "ciReadyReportValueRollbackCommandFieldIndexCount", "JSON CI ready rollback report value field index count alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldIndexSummary, "0,1,2", "JSON CI ready rollback report value field index summary should include compact indexes");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldIndexSummaryField, "ciReadyReportValueRollbackCommandFieldIndexSummary", "JSON CI ready rollback report value field index summary alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldCount, 3, "JSON CI ready rollback report value field count should include count");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldCountField, "ciReadyReportValueRollbackCommandFieldCount", "JSON CI ready rollback report value field count alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldLastIndex, 2, "JSON CI ready rollback report value field last index should include last index");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldLastIndexField, "ciReadyReportValueRollbackCommandFieldLastIndex", "JSON CI ready rollback report value field last index alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldFirst, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst", "JSON CI ready rollback report value field first should include first field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldFirstField, "ciReadyReportValueRollbackCommandFieldFirst", "JSON CI ready rollback report value field first alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldLast, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value field last should include last field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldLastField, "ciReadyReportValueRollbackCommandFieldLast", "JSON CI ready rollback report value field last alias should include top-level path");
  assertObject(parsed.ciReadyReportValueRollbackCommandFieldEndpoints, "JSON CI ready rollback report value field endpoints should include object");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldEndpoints.first, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst", "JSON CI ready rollback report value field endpoints should include first field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldEndpoints.last, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value field endpoints should include last field");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldEndpointSummary, "first=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst, last=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value field endpoint summary should include endpoints");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldRegistryStatus, "consistent", "JSON CI ready rollback report value field registry status should include status");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldRegistryStatusField, "ciReadyReportValueRollbackCommandFieldRegistryStatus", "JSON CI ready rollback report value field registry status alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldRegistryInvariant, "count=3,lastIndex=2", "JSON CI ready rollback report value field registry invariant should include invariant");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldRegistryInvariantField, "ciReadyReportValueRollbackCommandFieldRegistryInvariant", "JSON CI ready rollback report value field registry invariant alias should include top-level path");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldSummary, "3 fields, first=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandFirst, last=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI ready rollback report value field summary should include endpoints");
  assertEqual(parsed.ciReadyReportValueRollbackCommandFieldSummaryField, "ciReadyReportValueRollbackCommandFieldSummary", "JSON CI ready rollback report value field summary alias should include top-level path");
  assertEqual(parsed.ciReadyReportValuesField, "nextGateCiHandoff.readyWhen.reportValues", "JSON CI ready report values field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueKeysField, "nextGateCiHandoff.readyWhen.reportValueKeys", "JSON CI ready report value keys field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueCountField, "nextGateCiHandoff.readyWhen.reportValueCount", "JSON CI ready report value count field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueSummaryField, "nextGateCiHandoff.readyWhen.reportValueSummary", "JSON CI ready report value summary field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueEndpointsField, "nextGateCiHandoff.readyWhen.reportValueEndpoints", "JSON CI ready report value endpoints field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueEndpointSummaryField, "nextGateCiHandoff.readyWhen.reportValueEndpointSummary", "JSON CI ready report value endpoint summary field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueRegistryStatusField, "nextGateCiHandoff.readyWhen.reportValueRegistryStatus", "JSON CI ready report value registry status field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueRegistryInvariantField, "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant", "JSON CI ready report value registry invariant field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueLastIndexField, "nextGateCiHandoff.readyWhen.reportValueLastIndex", "JSON CI ready report value last index field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueFirstField, "nextGateCiHandoff.readyWhen.reportValueFirst", "JSON CI ready report value first field alias should include canonical path");
  assertEqual(parsed.ciReadyReportValueLastField, "nextGateCiHandoff.readyWhen.reportValueLast", "JSON CI ready report value last field alias should include canonical path");
  assertArrayIncludes(parsed.ciReadyRequiredFields, "nextGateCiHandoff.assertions.migrationStatus.expected", "JSON CI ready required fields should include migration assertion");
  assertEqual(parsed.ciReadyRequiredFieldCount, 3, "JSON CI ready required field count should include count");
  assertEqual(parsed.ciReadyRequiredFieldsField, "nextGateCiHandoff.readyWhen.requiredFields", "JSON CI ready required fields alias should include canonical path");
  assertEqual(parsed.ciReadyRequiredFieldCountField, "nextGateCiHandoff.readyWhen.requiredFieldCount", "JSON CI ready required field count alias should include canonical path");
  assertArrayIncludes(parsed.ciReadyCommands, "npm run db:check -- --field migrationStatus", "JSON CI ready commands should include migration status command");
  assertEqual(parsed.ciReadyCommandCount, 3, "JSON CI ready command count should include count");
  assertEqual(parsed.ciReadyCommandsField, "nextGateCiHandoff.readyWhen.commands", "JSON CI ready commands alias should include canonical path");
  assertEqual(parsed.ciReadyCommandCountField, "nextGateCiHandoff.readyWhen.commandCount", "JSON CI ready command count alias should include canonical path");
  assertObject(parsed.ciAssertions, "JSON CI assertions should include assertions");
  assertEqual(parsed.ciAssertionCount, 3, "JSON CI assertion count should include count");
  assertEqual(parsed.ciAssertionsField, "nextGateCiHandoff.assertions", "JSON CI assertions alias should include canonical path");
  assertEqual(parsed.ciAssertionCountField, "nextGateCiHandoff.assertionCount", "JSON CI assertion count alias should include canonical path");
  assertEqual(parsed.ciReadyAssertionCount, 3, "JSON CI ready assertion count should include count");
  assertEqual(parsed.ciReadyAssertionCountField, "nextGateCiHandoff.readyWhen.assertionCount", "JSON CI ready assertion count alias should include canonical path");
  assertEqual(parsed.ciAssertionMigrationStatusExpected, "database_read_parity", "JSON CI assertion migration status expected should include expected value");
  assertEqual(parsed.ciAssertionMigrationStatusCommand, "npm run db:check -- --field migrationStatus", "JSON CI assertion migration status command should include command");
  assertEqual(parsed.ciAssertionDatabaseUrlStatusExpected, "valid", "JSON CI assertion database URL status expected should include expected value");
  assertEqual(parsed.ciAssertionDatabaseUrlStatusCommand, "npm run db:check -- --field databaseUrlStatus", "JSON CI assertion database URL status command should include command");
  assertArrayIncludes(parsed.ciAssertionDatabaseUrlProtocolExpected, "postgresql", "JSON CI assertion database URL protocol expected should include postgresql");
  assertEqual(parsed.ciAssertionDatabaseUrlProtocolCommand, "npm run db:check -- --field databaseUrlProtocol", "JSON CI assertion database URL protocol command should include command");
  assertObject(parsed.ciPassCriteria, "JSON CI pass criteria should include pass criteria");
  assertEqual(parsed.ciPassCriteriaCount, 3, "JSON CI pass criteria count should include count");
  assertEqual(parsed.ciPassCriteriaField, "nextGateCiHandoff.passCriteria", "JSON CI pass criteria alias should include canonical path");
  assertEqual(parsed.ciPassCriteriaCountField, "nextGateCiHandoff.passCriteriaCount", "JSON CI pass criteria count alias should include canonical path");
  assertEqual(parsed.ciPassCriteriaMigrationStatus, "database_read_parity", "JSON CI pass criteria migration status should include expected value");
  assertEqual(parsed.ciPassCriteriaDatabaseUrlStatus, "valid", "JSON CI pass criteria database URL status should include expected value");
  assertArrayIncludes(parsed.ciPassCriteriaDatabaseUrlProtocol, "postgresql", "JSON CI pass criteria database URL protocol should include postgresql");
  assertEqual(parsed.nextGateCiHandoffPassCriteriaSummary, "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON should include next gate CI handoff pass criteria summary");
  assertEqual(parsed.nextGateCiHandoffPassCriteriaSummaryField, "nextGateCiHandoffPassCriteriaSummary", "JSON should include next gate CI handoff pass criteria summary alias");
  assertObject(parsed.ciFailureCodes, "JSON CI failure codes should include failure codes");
  assertEqual(parsed.ciFailureCodeCount, 3, "JSON CI failure code count should include count");
  assertEqual(parsed.ciFailureCodesField, "nextGateCiHandoff.failureCodes", "JSON CI failure codes alias should include canonical path");
  assertEqual(parsed.ciFailureCodeCountField, "nextGateCiHandoff.failureCodeCount", "JSON CI failure code count alias should include canonical path");
  assertEqual(parsed.ciFailureCodeMigrationGuard, "TM_COMMAND_NOT_SCAFFOLDED", "JSON CI failure migration guard code should include code");
  assertEqual(parsed.ciFailureCodeDbMatrixUnknownField, "TM_DB_MATRIX_UNKNOWN_FIELD", "JSON CI failure DB matrix unknown field code should include code");
  assertEqual(parsed.ciFailureCodeStatusFieldMissing, "TM_GATE0_STATUS_FIELD_MISSING", "JSON CI failure status field missing code should include code");
  assertEqual(parsed.nextGateCiHandoffFailureCodeSummary, "migrationGuard=TM_COMMAND_NOT_SCAFFOLDED, dbMatrixUnknownField=TM_DB_MATRIX_UNKNOWN_FIELD, statusFieldMissing=TM_GATE0_STATUS_FIELD_MISSING", "JSON should include next gate CI handoff failure code summary");
  assertEqual(parsed.nextGateCiHandoffFailureCodeSummaryField, "nextGateCiHandoffFailureCodeSummary", "JSON should include next gate CI handoff failure code summary alias");
  assertObject(parsed.ciEvidenceDocs, "JSON CI evidence docs should include docs object");
  assertEqual(parsed.ciEvidenceDocCount, 3, "JSON CI evidence doc count should include count");
  assertEqual(parsed.ciEvidenceDocsField, "nextGateCiHandoff.evidenceDocs", "JSON CI evidence docs alias should include canonical path");
  assertEqual(parsed.ciEvidenceDocCountField, "nextGateCiHandoff.evidenceDocCount", "JSON CI evidence doc count alias should include canonical path");
  assertEqual(parsed.ciEvidenceDocNextGate, "docs/dev/GATE1_PERSISTENCE.md", "JSON CI evidence next gate doc should include path");
  assertEqual(parsed.ciEvidenceDocDbConstraints, "docs/dev/DB_CONSTRAINTS.md", "JSON CI evidence DB constraints doc should include path");
  assertEqual(parsed.ciEvidenceDocStatus, "docs/dev/GATE0_STATUS.md", "JSON CI evidence status doc should include path");
  assertEqual(parsed.nextGateCiHandoffEvidenceDocSummary, "nextGate=docs/dev/GATE1_PERSISTENCE.md, dbConstraints=docs/dev/DB_CONSTRAINTS.md, status=docs/dev/GATE0_STATUS.md", "JSON should include next gate CI handoff evidence doc summary");
  assertEqual(parsed.nextGateCiHandoffEvidenceDocSummaryField, "nextGateCiHandoffEvidenceDocSummary", "JSON should include next gate CI handoff evidence doc summary alias");
  assertArrayIncludes(parsed.ciWatchFields, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "JSON CI watch fields should include migration status watch field");
  assertEqual(parsed.ciWatchFieldCount, 3, "JSON CI watch field count should include count");
  assertEqual(parsed.ciWatchFieldsField, "nextGateCiHandoff.watchFields", "JSON CI watch fields alias should include canonical path");
  assertEqual(parsed.ciWatchFieldCountField, "nextGateCiHandoff.watchFieldCount", "JSON CI watch field count alias should include canonical path");
  assertEqual(parsed.ciWatchFieldMigrationStatus, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "JSON CI watch migration status field should include field path");
  assertEqual(parsed.ciWatchFieldDatabaseUrlStatus, "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected", "JSON CI watch database URL status field should include field path");
  assertEqual(parsed.ciWatchFieldDatabaseUrlProtocol, "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "JSON CI watch database URL protocol field should include field path");
  assertEqual(parsed.nextGateCiHandoffWatchFieldSummary, "migrationStatus=nextGateTransitionPlan.transitions.migrationStatus.nextExpected, databaseUrlStatus=nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected, databaseUrlProtocol=nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "JSON should include next gate CI handoff watch field summary");
  assertEqual(parsed.nextGateCiHandoffWatchFieldSummaryField, "nextGateCiHandoffWatchFieldSummary", "JSON should include next gate CI handoff watch field summary alias");
  assertEqual(parsed.ciRequiredCheckCount, 13, "JSON CI required check count should include count");
  assertEqual(parsed.ciRequiredCheckCountField, "nextGateCiHandoff.requiredCheckCount", "JSON CI required check count alias should include canonical path");
  assertEqual(parsed.ciRequiredChecksSource, "docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON CI required checks source should include source");
  assertEqual(parsed.ciRequiredChecksSourceField, "nextGateCiHandoff.requiredChecksSource", "JSON CI required checks source alias should include canonical path");
  assertEqual(parsed.ciRequiredChecksParsed, true, "JSON CI required checks parsed should include parsed status");
  assertEqual(parsed.ciRequiredChecksParsedField, "nextGateCiHandoff.requiredChecksParsed", "JSON CI required checks parsed alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRequiredChecksSummary, "count=13, source=docs/dev/GATE1_PERSISTENCE.md#required-checks, parsed=true", "JSON should include next gate CI handoff required checks summary");
  assertEqual(parsed.nextGateCiHandoffRequiredChecksSummaryField, "nextGateCiHandoffRequiredChecksSummary", "JSON should include next gate CI handoff required checks summary alias");
  assertObject(parsed.ciReadiness, "JSON CI readiness should include readiness object");
  assertEqual(parsed.ciReadinessField, "nextGateReadiness", "JSON CI readiness alias should include canonical path");
  assertEqual(parsed.ciReadinessVerifiedNowCount, 10, "JSON CI readiness verified count should include count");
  assertEqual(parsed.ciReadinessTransitionCount, 3, "JSON CI readiness transition count should include count");
  assertObject(parsed.ciTransitionPlan, "JSON CI transition plan should include transition plan object");
  assertEqual(parsed.ciTransitionPlanField, "nextGateTransitionPlan", "JSON CI transition plan alias should include canonical path");
  assertEqual(parsed.ciTransitionPlanTransitionCount, 3, "JSON CI transition plan transition count should include count");
  assertEqual(parsed.nextGateCiHandoffReadinessTransitionSummary, "verifiedNow=10, readinessTransitions=3, transitionPlan=3", "JSON should include next gate CI handoff readiness transition summary");
  assertEqual(parsed.nextGateCiHandoffReadinessTransitionSummaryField, "nextGateCiHandoffReadinessTransitionSummary", "JSON should include next gate CI handoff readiness transition summary alias");
  assertEqual(parsed.ciTransitionMigrationStatusCommand, "npm run db:check -- --field migrationStatus", "JSON CI transition migration command should include command");
  assertEqual(parsed.ciTransitionMigrationStatusCurrentExpected, "scaffolded", "JSON CI transition migration current expected should include current value");
  assertEqual(parsed.ciTransitionMigrationStatusNextExpected, "database_read_parity", "JSON CI transition migration next expected should include next value");
  assertEqual(parsed.ciTransitionDatabaseUrlStatusCommand, "npm run db:check -- --field databaseUrlStatus", "JSON CI transition database URL status command should include command");
  assertEqual(parsed.ciTransitionDatabaseUrlStatusCurrentExpected, "missing", "JSON CI transition database URL status current expected should include current value");
  assertEqual(parsed.ciTransitionDatabaseUrlStatusNextExpected, "valid", "JSON CI transition database URL status next expected should include next value");
  assertEqual(parsed.ciTransitionDatabaseUrlProtocolCommand, "npm run db:check -- --field databaseUrlProtocol", "JSON CI transition database URL protocol command should include command");
  assertEqual(parsed.ciTransitionDatabaseUrlProtocolCurrentExpected, "none", "JSON CI transition database URL protocol current expected should include current value");
  assertArrayIncludes(parsed.ciTransitionDatabaseUrlProtocolNextExpected, "postgresql", "JSON CI transition database URL protocol next expected should include postgresql");
  assertEqual(parsed.nextGateCiHandoffTransitionExpectedSummary, "migrationStatus=scaffolded->database_read_parity, databaseUrlStatus=missing->valid, databaseUrlProtocol=none->postgresql|postgres", "JSON should include next gate CI handoff transition expected summary");
  assertEqual(parsed.nextGateCiHandoffTransitionExpectedSummaryField, "nextGateCiHandoffTransitionExpectedSummary", "JSON should include next gate CI handoff transition expected summary alias");
  assertEqual(parsed.nextGateCiHandoffTransitionCommandSummary, "migrationStatus=npm run db:check -- --field migrationStatus, databaseUrlStatus=npm run db:check -- --field databaseUrlStatus, databaseUrlProtocol=npm run db:check -- --field databaseUrlProtocol", "JSON should include next gate CI handoff transition command summary");
  assertEqual(parsed.nextGateCiHandoffTransitionCommandSummaryField, "nextGateCiHandoffTransitionCommandSummary", "JSON should include next gate CI handoff transition command summary alias");
  assertArrayIncludes(parsed.ciTransitionOrderedSteps.map((step) => step.id), "scaffold-prisma", "JSON CI transition ordered steps should include Prisma step");
  assertEqual(parsed.ciTransitionOrderedStepCount, 3, "JSON CI transition ordered step count should include count");
  assertEqual(parsed.ciTransitionOrderedStepSummary, "scaffold-prisma -> set-database-url -> verify-db-matrix", "JSON CI transition ordered step summary should include compact step list");
  assertEqual(parsed.ciTransitionFirstStepId, "scaffold-prisma", "JSON CI transition first step should include id");
  assertEqual(parsed.ciTransitionSecondStepId, "set-database-url", "JSON CI transition second step should include id");
  assertEqual(parsed.ciTransitionThirdStepId, "verify-db-matrix", "JSON CI transition third step should include id");
  assertEqual(parsed.ciTransitionFirstStepCommand, "npm run db:check -- --field migrationStatus", "JSON CI transition first step command should include command");
  assertEqual(parsed.ciTransitionThirdStepCommand, "npm run db:check -- --json", "JSON CI transition third step command should include command");
  assertEqual(parsed.ciTransitionFirstStepTarget, "database_read_parity", "JSON CI transition first step target should include target");
  assertEqual(parsed.ciTransitionThirdStepTarget, "all Gate 1 DB matrix fields pass", "JSON CI transition third step target should include target");
  assertEqual(parsed.nextGateCiHandoffTransitionTargetSummary, "scaffold-prisma=database_read_parity, set-database-url=valid postgresql|postgres DATABASE_URL, verify-db-matrix=all Gate 1 DB matrix fields pass", "JSON should include next gate CI handoff transition target summary");
  assertEqual(parsed.nextGateCiHandoffTransitionTargetSummaryField, "nextGateCiHandoffTransitionTargetSummary", "JSON should include next gate CI handoff transition target summary alias");
  assertObject(parsed.ciRollback, "JSON CI rollback should include rollback object");
  assertEqual(parsed.ciRollbackMode, "fixture", "JSON CI rollback mode should include fixture");
  assertEqual(parsed.ciRollbackModeField, "nextGateCiHandoff.rollback.mode", "JSON CI rollback mode alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackMode, "fixture", "JSON should include next gate CI handoff rollback mode top field");
  assertEqual(parsed.nextGateCiHandoffRollbackModeField, "nextGateCiHandoff.rollback.mode", "JSON should include next gate CI handoff rollback mode top alias");
  assertEqual(parsed.ciRollbackExpectedMode, "fixture", "JSON CI rollback expected mode should include fixture");
  assertEqual(parsed.ciRollbackExpectedModeField, "nextGateCiHandoff.rollback.expectedMode", "JSON CI rollback expected mode alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackModeSummary, "mode=fixture, expected=fixture", "JSON should include next gate CI handoff rollback mode summary");
  assertEqual(parsed.nextGateCiHandoffRollbackModeSummaryField, "nextGateCiHandoffRollbackModeSummary", "JSON should include next gate CI handoff rollback mode summary alias");
  assertEqual(parsed.ciRollbackSummary, "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "JSON CI rollback summary should include compact summary");
  assertEqual(parsed.ciRollbackSummaryField, "nextGateCiHandoff.rollback.summary", "JSON CI rollback summary alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackSummary, "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "JSON should include next gate CI handoff rollback summary top field");
  assertEqual(parsed.nextGateCiHandoffRollbackSummaryField, "nextGateCiHandoff.rollback.summary", "JSON should include next gate CI handoff rollback summary top alias");
  assertEqual(parsed.nextGateCiHandoffRollbackTopSummary, "fixture: rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "JSON should include next gate CI handoff rollback top summary");
  assertEqual(parsed.nextGateCiHandoffRollbackTopSummaryField, "nextGateCiHandoffRollbackTopSummary", "JSON should include next gate CI handoff rollback top summary alias");
  assertEqual(parsed.nextGateCiHandoffRollbackTopFieldSummary, "modeField=nextGateCiHandoff.rollback.mode, summaryField=nextGateCiHandoff.rollback.summary, topSummaryField=nextGateCiHandoffRollbackTopSummary", "JSON should include next gate CI handoff rollback top field summary");
  assertEqual(parsed.nextGateCiHandoffRollbackTopFieldSummaryField, "nextGateCiHandoffRollbackTopFieldSummary", "JSON should include next gate CI handoff rollback top field summary alias");
  assertEqual(parsed.ciRollbackCommand, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI rollback command should include command");
  assertEqual(parsed.ciRollbackCommandField, "nextGateCiHandoff.rollback.command", "JSON CI rollback command alias should include canonical path");
  assertArrayIncludes(parsed.ciRollbackCommands, "npm run gate0:status -- --field persistenceModeDefault", "JSON CI rollback commands should include verification command");
  assertEqual(parsed.ciRollbackCommandsField, "nextGateCiHandoff.rollback.commands", "JSON CI rollback commands alias should include canonical path");
  assertEqual(parsed.ciRollbackFirstCommand, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI rollback first command should include fixture test rollback");
  assertEqual(parsed.ciRollbackFirstCommandField, "nextGateCiHandoff.rollback.commands.0", "JSON CI rollback first command alias should include canonical path");
  assertEqual(parsed.ciRollbackSecondCommand, "npm run gate0:status -- --field persistenceModeDefault", "JSON CI rollback second command should include verification command");
  assertEqual(parsed.ciRollbackSecondCommandField, "nextGateCiHandoff.rollback.commands.1", "JSON CI rollback second command alias should include canonical path");
  assertEqual(parsed.ciRollbackThirdCommand, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI rollback third command should include report command");
  assertEqual(parsed.ciRollbackThirdCommandField, "nextGateCiHandoff.rollback.commands.2", "JSON CI rollback third command alias should include canonical path");
  assertIncludes(parsed.nextGateCiHandoffRollbackCommandSequenceSummary, "$env:PERSISTENCE_MODE='fixture'; npm test", "JSON should include next gate CI handoff rollback command sequence summary first command");
  assertIncludes(parsed.nextGateCiHandoffRollbackCommandSequenceSummary, " -> npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON should include next gate CI handoff rollback command sequence summary report command");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandSequenceSummaryField, "nextGateCiHandoffRollbackCommandSequenceSummary", "JSON should include next gate CI handoff rollback command sequence summary alias");
  assertEqual(parsed.ciRollbackVerificationCommand, "npm run gate0:status -- --field persistenceModeDefault", "JSON CI rollback verification command should include command");
  assertEqual(parsed.ciRollbackVerificationCommandField, "nextGateCiHandoff.rollback.verificationCommand", "JSON CI rollback verification command alias should include canonical path");
  assertEqual(parsed.ciRollbackReportCommand, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI rollback report command should include command");
  assertEqual(parsed.ciRollbackReportCommandField, "nextGateCiHandoff.rollback.reportCommand", "JSON CI rollback report command alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackVerificationReportSummary, "verify=npm run gate0:status -- --field persistenceModeDefault, report=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON should include next gate CI handoff rollback verification report summary");
  assertEqual(parsed.nextGateCiHandoffRollbackVerificationReportSummaryField, "nextGateCiHandoffRollbackVerificationReportSummary", "JSON should include next gate CI handoff rollback verification report summary alias");
  assertEqual(parsed.ciRollbackCommandCount, 3, "JSON CI rollback command count should include count");
  assertEqual(parsed.ciRollbackCommandCountField, "nextGateCiHandoff.rollback.commandCount", "JSON CI rollback command count alias should include canonical path");
  assertEqual(parsed.ciRollbackCommandLastIndex, 2, "JSON CI rollback command last index should include last index");
  assertEqual(parsed.ciRollbackCommandLastIndexField, "nextGateCiHandoff.rollback.commandLastIndex", "JSON CI rollback command last index alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandCountSummary, "count=3, lastIndex=2", "JSON should include next gate CI handoff rollback command count summary");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandCountSummaryField, "nextGateCiHandoffRollbackCommandCountSummary", "JSON should include next gate CI handoff rollback command count summary alias");
  assertEqual(parsed.ciRollbackCommandFirst, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI rollback command first should include first command");
  assertEqual(parsed.ciRollbackCommandFirstField, "nextGateCiHandoff.rollback.commandFirst", "JSON CI rollback command first alias should include canonical path");
  assertEqual(parsed.ciRollbackCommandLast, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI rollback command last should include last command");
  assertEqual(parsed.ciRollbackCommandLastField, "nextGateCiHandoff.rollback.commandLast", "JSON CI rollback command last alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandFieldSummary, "firstField=nextGateCiHandoff.rollback.commandFirst, lastField=nextGateCiHandoff.rollback.commandLast", "JSON should include next gate CI handoff rollback command field summary");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandFieldSummaryField, "nextGateCiHandoffRollbackCommandFieldSummary", "JSON should include next gate CI handoff rollback command field summary alias");
  assertObject(parsed.ciRollbackCommandEndpoints, "JSON CI rollback command endpoints should include endpoint object");
  assertEqual(parsed.ciRollbackCommandEndpointsField, "nextGateCiHandoff.rollback.commandEndpoints", "JSON CI rollback command endpoints alias should include canonical path");
  assertEqual(parsed.ciRollbackCommandEndpoints.first, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI rollback command endpoints should include first command");
  assertEqual(parsed.ciRollbackCommandEndpoints.last, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI rollback command endpoints should include last command");
  assertEqual(parsed.ciRollbackCommandEndpointSummary, "first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI rollback command endpoint summary should include compact endpoints");
  assertEqual(parsed.ciRollbackCommandEndpointSummaryField, "nextGateCiHandoff.rollback.commandEndpointSummary", "JSON CI rollback command endpoint summary alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackEndpointFieldSummary, "endpointsField=nextGateCiHandoff.rollback.commandEndpoints, endpointSummaryField=nextGateCiHandoff.rollback.commandEndpointSummary", "JSON should include next gate CI handoff rollback endpoint field summary");
  assertEqual(parsed.nextGateCiHandoffRollbackEndpointFieldSummaryField, "nextGateCiHandoffRollbackEndpointFieldSummary", "JSON should include next gate CI handoff rollback endpoint field summary alias");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandEndpointSummary, "first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON should include next gate CI handoff rollback endpoint top summary");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandEndpointSummaryField, "nextGateCiHandoff.rollback.commandEndpointSummary", "JSON should include next gate CI handoff rollback endpoint top alias");
  assertEqual(parsed.ciRollbackCommandRegistryStatus, "consistent", "JSON CI rollback command registry status should include status");
  assertEqual(parsed.ciRollbackCommandRegistryStatusField, "nextGateCiHandoff.rollback.commandRegistryStatus", "JSON CI rollback command registry status alias should include canonical path");
  assertEqual(parsed.ciRollbackCommandRegistryInvariant, "count=3,lastIndex=2", "JSON CI rollback command registry invariant should include invariant");
  assertEqual(parsed.ciRollbackCommandRegistryInvariantField, "nextGateCiHandoff.rollback.commandRegistryInvariant", "JSON CI rollback command registry invariant alias should include canonical path");
  assertEqual(parsed.nextGateCiHandoffRollbackRegistryFieldSummary, "statusField=nextGateCiHandoff.rollback.commandRegistryStatus, invariantField=nextGateCiHandoff.rollback.commandRegistryInvariant", "JSON should include next gate CI handoff rollback registry field summary");
  assertEqual(parsed.nextGateCiHandoffRollbackRegistryFieldSummaryField, "nextGateCiHandoffRollbackRegistryFieldSummary", "JSON should include next gate CI handoff rollback registry field summary alias");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandRegistrySummary, "consistent: count=3,lastIndex=2, first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON should include next gate CI handoff rollback command registry summary");
  assertEqual(parsed.nextGateCiHandoffRollbackCommandRegistrySummaryField, "nextGateCiHandoffRollbackCommandRegistrySummary", "JSON should include next gate CI handoff rollback command registry summary alias");
  assertArrayIncludes(parsed.completedLocally, "Gate 0 nav is `Discover`, `Swipe`, `Chat`, `List`, `My`.", "JSON should include completed local work");
  assertEqual(parsed.completedLocallyCount, 3, "JSON should include completed locally count");
  assertEqual(parsed.completedLocallyCountField, "completedLocallyCount", "JSON should include completed locally count alias");
  assertEqual(parsed.completedLocallyFirst, "Flutter app runs on web, Windows, and Android device targets.", "JSON should include first completed local item");
  assertEqual(parsed.completedLocallyFirstField, "completedLocallyFirst", "JSON should include first completed local item alias");
  assertEqual(parsed.completedLocallyLastIndex, 2, "JSON should include completed locally last index");
  assertEqual(parsed.completedLocallyLastIndexField, "completedLocallyLastIndex", "JSON should include completed locally last index alias");
  assertEqual(parsed.completedLocallyLast, "Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.", "JSON should include last completed local item");
  assertEqual(parsed.completedLocallyLastField, "completedLocallyLast", "JSON should include last completed local item alias");
  assertEqual(parsed.completedLocallyRegistryStatus, "consistent", "JSON should include completed locally registry status");
  assertEqual(parsed.completedLocallyRegistryStatusField, "completedLocallyRegistryStatus", "JSON should include completed locally registry status alias");
  assertEqual(parsed.completedLocallyRegistryInvariant, "count=3,lastIndex=2", "JSON should include completed locally registry invariant");
  assertEqual(parsed.completedLocallyRegistryInvariantField, "completedLocallyRegistryInvariant", "JSON should include completed locally registry invariant alias");
  assertEqual(parsed.completedLocallySummary, "3 completed, first=Flutter app runs on web, Windows, and Android device targets., last=Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.", "JSON should include completed locally summary");
  assertEqual(parsed.completedLocallySummaryField, "completedLocallySummary", "JSON should include completed locally summary alias");
  assertEqual(parsed.fullTestBaseline, "89 Flutter widget tests", "JSON should include test baseline");
  assertEqual(parsed.fullTestBaselineField, "fullTestBaseline", "JSON should include test baseline alias");
  assertEqual(parsed.fullTestBaselineCommand, "npm test", "JSON should include test baseline command");
  assertEqual(parsed.fullTestBaselineCommandField, "fullTestBaselineCommand", "JSON should include test baseline command alias");
  assertEqual(parsed.fullTestBaselineSummary, "npm test passed with 89 Flutter widget tests", "JSON should include test baseline summary");
  assertEqual(parsed.fullTestBaselineSummaryField, "fullTestBaselineSummary", "JSON should include test baseline summary alias");
  assertArrayIncludes(parsed.localApiBoundaryChecks, "npm run api:fixture-store:test", "JSON should include fixture store boundary check");
  assertArrayIncludes(parsed.localApiBoundaryChecks, "npm run api:service:test", "JSON should include service boundary check");
  assertEqual(parsed.localApiBoundaryCheckCount, 2, "JSON should include local API boundary check count");
  assertEqual(parsed.localApiBoundaryCheckCountField, "localApiBoundaryCheckCount", "JSON should include local API boundary check count alias");
  assertEqual(parsed.localApiBoundaryCheckFirst, "npm run api:fixture-store:test", "JSON should include first local API boundary check");
  assertEqual(parsed.localApiBoundaryCheckFirstField, "localApiBoundaryCheckFirst", "JSON should include first local API boundary check alias");
  assertEqual(parsed.localApiBoundaryCheckLastIndex, 1, "JSON should include local API boundary check last index");
  assertEqual(parsed.localApiBoundaryCheckLastIndexField, "localApiBoundaryCheckLastIndex", "JSON should include local API boundary check last index alias");
  assertEqual(parsed.localApiBoundaryCheckLast, "npm run api:service:test", "JSON should include last local API boundary check");
  assertEqual(parsed.localApiBoundaryCheckLastField, "localApiBoundaryCheckLast", "JSON should include last local API boundary check alias");
  assertEqual(parsed.localApiBoundaryCheckSummary, "2 checks, first=npm run api:fixture-store:test, last=npm run api:service:test", "JSON should include local API boundary check summary");
  assertEqual(parsed.localApiBoundaryCheckSummaryField, "localApiBoundaryCheckSummary", "JSON should include local API boundary check summary alias");
  assertArrayIncludes(parsed.stillNotDone, "AWS CI/deploy pipeline.", "JSON should include remaining production blockers");
  assertEqual(parsed.remainingBlockersSummary, "Real auth/provider/storage integrations. | Production backend persistence. | AWS CI/deploy pipeline. | Formal Figma/DESIGN.md source of truth. | App store/release build signing.", "JSON should include compact remaining blockers summary");
  assertEqual(parsed.remainingBlockersSummaryField, "remainingBlockersSummary", "JSON should include remaining blockers summary alias");
  assertEqual(parsed.remainingBlockerCount, 5, "JSON should include remaining blocker count");
  assertEqual(parsed.remainingBlockerCountField, "remainingBlockerCount", "JSON should include remaining blocker count alias");
  assertEqual(parsed.remainingBlockerFirst, "Real auth/provider/storage integrations.", "JSON should include first remaining blocker");
  assertEqual(parsed.remainingBlockerFirstField, "remainingBlockerFirst", "JSON should include first remaining blocker alias");
  assertEqual(parsed.remainingBlockerLastIndex, 4, "JSON should include remaining blocker last index");
  assertEqual(parsed.remainingBlockerLastIndexField, "remainingBlockerLastIndex", "JSON should include remaining blocker last index alias");
  assertEqual(parsed.remainingBlockerLast, "App store/release build signing.", "JSON should include last remaining blocker");
  assertEqual(parsed.remainingBlockerLastField, "remainingBlockerLast", "JSON should include last remaining blocker alias");
  assertEqual(parsed.remainingBlockerRegistryStatus, "consistent", "JSON should include remaining blocker registry status");
  assertEqual(parsed.remainingBlockerRegistryStatusField, "remainingBlockerRegistryStatus", "JSON should include remaining blocker registry status alias");
  assertEqual(parsed.remainingBlockerRegistryInvariant, "count=5,lastIndex=4", "JSON should include remaining blocker registry invariant");
  assertEqual(parsed.remainingBlockerRegistryInvariantField, "remainingBlockerRegistryInvariant", "JSON should include remaining blocker registry invariant alias");
  assertArrayIncludes(parsed.remainingBlockerFields, "remainingBlockerFirst", "JSON should include remaining blocker first field in registry");
  assertArrayIncludes(parsed.remainingBlockerFields, "remainingBlockersSummary", "JSON should include remaining blockers summary field in registry");
  assertEqual(parsed.remainingBlockerFieldsField, "remainingBlockerFields", "JSON should include remaining blocker fields alias");
  assertArrayIncludes(parsed.remainingBlockerFieldIndexes, 0, "JSON should include remaining blocker field first index");
  assertArrayIncludes(parsed.remainingBlockerFieldIndexes, 2, "JSON should include remaining blocker field last index");
  assertEqual(parsed.remainingBlockerFieldIndexesField, "remainingBlockerFieldIndexes", "JSON should include remaining blocker field indexes alias");
  assertEqual(parsed.remainingBlockerFieldCount, 3, "JSON should include remaining blocker field count");
  assertEqual(parsed.remainingBlockerFieldCountField, "remainingBlockerFieldCount", "JSON should include remaining blocker field count alias");
  assertEqual(parsed.remainingBlockerFieldLastIndex, 2, "JSON should include remaining blocker field last index");
  assertEqual(parsed.remainingBlockerFieldLastIndexField, "remainingBlockerFieldLastIndex", "JSON should include remaining blocker field last index alias");
  assertEqual(parsed.remainingBlockerFieldFirst, "remainingBlockerFirst", "JSON should include remaining blocker field first");
  assertEqual(parsed.remainingBlockerFieldFirstField, "remainingBlockerFieldFirst", "JSON should include remaining blocker field first alias");
  assertEqual(parsed.remainingBlockerFieldLast, "remainingBlockersSummary", "JSON should include remaining blocker field last");
  assertEqual(parsed.remainingBlockerFieldLastField, "remainingBlockerFieldLast", "JSON should include remaining blocker field last alias");
  assertEqual(parsed.remainingBlockerFieldRegistryStatus, "consistent", "JSON should include remaining blocker field registry status");
  assertEqual(parsed.remainingBlockerFieldRegistryStatusField, "remainingBlockerFieldRegistryStatus", "JSON should include remaining blocker field registry status alias");
  assertEqual(parsed.remainingBlockerFieldRegistryInvariant, "count=3,lastIndex=2", "JSON should include remaining blocker field registry invariant");
  assertEqual(parsed.remainingBlockerFieldRegistryInvariantField, "remainingBlockerFieldRegistryInvariant", "JSON should include remaining blocker field registry invariant alias");
  assertEqual(parsed.remainingBlockerFieldSummary, "3 fields, first=remainingBlockerFirst, last=remainingBlockersSummary", "JSON should include remaining blocker field summary");
  assertEqual(parsed.remainingBlockerFieldSummaryField, "remainingBlockerFieldSummary", "JSON should include remaining blocker field summary alias");
  assertEqual(parsed.productionBlockerCount, 5, "JSON should include production blocker count");
  assertEqual(parsed.productionBlockerCountField, "productionBlockerCount", "JSON should include production blocker count alias");
  assertEqual(parsed.productionBlockersSummaryField, "productionBlockersSummary", "JSON should include production blockers summary alias");
  assertEqual(parsed.productionGateOrderDetailsSummary, "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "JSON should include compact production gate order details summary");
  assertEqual(parsed.productionGateOrderDetailsSummaryField, "productionGateOrderDetailsSummary", "JSON should include production gate order detail summary alias");
  assertArrayIncludes(parsed.productionBlockerFields, "productionBlockersSummary", "JSON should include production blockers summary field in registry");
  assertArrayIncludes(parsed.productionBlockerFields, "productionGateOrderDetailsSummary", "JSON should include production gate order detail field in registry");
  assertEqual(parsed.productionBlockerFieldsField, "productionBlockerFields", "JSON should include production blocker fields alias");
  assertArrayIncludes(parsed.productionBlockerFieldIndexes, 0, "JSON should include production blocker field first index");
  assertArrayIncludes(parsed.productionBlockerFieldIndexes, 2, "JSON should include production blocker field last index");
  assertEqual(parsed.productionBlockerFieldIndexesField, "productionBlockerFieldIndexes", "JSON should include production blocker field indexes alias");
  assertEqual(parsed.productionBlockerFieldCount, 3, "JSON should include production blocker field count");
  assertEqual(parsed.productionBlockerFieldCountField, "productionBlockerFieldCount", "JSON should include production blocker field count alias");
  assertEqual(parsed.productionBlockerFieldLastIndex, 2, "JSON should include production blocker field last index");
  assertEqual(parsed.productionBlockerFieldLastIndexField, "productionBlockerFieldLastIndex", "JSON should include production blocker field last index alias");
  assertEqual(parsed.productionBlockerFieldFirst, "productionBlockersSummary", "JSON should include production blocker first field");
  assertEqual(parsed.productionBlockerFieldFirstField, "productionBlockerFieldFirst", "JSON should include production blocker first field alias");
  assertEqual(parsed.productionBlockerFieldLast, "productionGateOrderDetailsSummary", "JSON should include production blocker last field");
  assertEqual(parsed.productionBlockerFieldLastField, "productionBlockerFieldLast", "JSON should include production blocker last field alias");
  assertEqual(parsed.productionBlockerFieldRegistryStatus, "consistent", "JSON should include production blocker field registry status");
  assertEqual(parsed.productionBlockerFieldRegistryStatusField, "productionBlockerFieldRegistryStatus", "JSON should include production blocker field registry status alias");
  assertEqual(parsed.productionBlockerFieldRegistryInvariant, "count=3,lastIndex=2", "JSON should include production blocker field registry invariant");
  assertEqual(parsed.productionBlockerFieldRegistryInvariantField, "productionBlockerFieldRegistryInvariant", "JSON should include production blocker field registry invariant alias");
  assertEqual(parsed.productionBlockerFieldSummary, "3 fields, first=productionBlockersSummary, last=productionGateOrderDetailsSummary", "JSON should include production blocker field summary");
  assertEqual(parsed.productionBlockerFieldSummaryField, "productionBlockerFieldSummary", "JSON should include production blocker field summary alias");
  assertObject(parsed.productionBlockersSummary, "JSON should include production blockers summary");
  assertEqual(parsed.productionBlockersSummary.count, 5, "JSON production blockers summary should include blocker count");
  assertEqual(parsed.productionBlockersSummary.countField, "productionBlockersSummary.count", "JSON production blockers summary should include count field alias");
  assertEqual(parsed.productionBlockersSummary.first, "Real auth/provider/storage integrations.", "JSON production blockers summary should include first blocker");
  assertEqual(parsed.productionBlockersSummary.last, "App store/release build signing.", "JSON production blockers summary should include last blocker");
  assertEqual(parsed.productionBlockersSummary.lastIndex, 4, "JSON production blockers summary should include last index");
  assertEqual(parsed.productionBlockersSummary.registryInvariant, "count=5,lastIndex=4", "JSON production blockers summary should include registry invariant");
  assertEqual(parsed.productionBlockersSummary.nextGateBlocker, "Production backend persistence.", "JSON production blockers summary should include next gate blocker");
  assertEqual(parsed.productionBlockersSummary.nextGate, "Gate 1 production backend persistence", "JSON production blockers summary should include next gate");
  assertEqual(parsed.productionBlockersSummary.nextGateDocPath, "docs/dev/GATE1_PERSISTENCE.md", "JSON production blockers summary should include next gate doc path");
  assertObject(parsed.productionBlockersSummary.byGate, "JSON production blockers summary should include by-gate map");
  assertArrayIncludes(parsed.productionBlockersSummary.byGateKeys, "gate1Prep", "JSON production blockers summary should include Gate 1 prep key");
  assertArrayIncludes(parsed.productionBlockersSummary.byGateKeys, "gate4", "JSON production blockers summary should include Gate 4 key");
  assertEqual(parsed.productionBlockersSummary.byGateKeysField, "productionBlockersSummary.byGateKeys", "JSON production blockers summary should include by-gate keys field alias");
  assertEqual(parsed.productionBlockersSummary.byGateCount, 5, "JSON production blockers summary should include by-gate count");
  assertEqual(parsed.productionBlockersSummary.byGateCountField, "productionBlockersSummary.byGateCount", "JSON production blockers summary should include by-gate count field alias");
  assertEqual(parsed.productionBlockersSummary.byGateLastIndex, 4, "JSON production blockers summary should include by-gate last index");
  assertEqual(parsed.productionBlockersSummary.byGateLastIndexField, "productionBlockersSummary.byGateLastIndex", "JSON production blockers summary should include by-gate last index field alias");
  assertEqual(parsed.productionBlockersSummary.byGateFirst, "gate1Prep", "JSON production blockers summary should include first by-gate key");
  assertEqual(parsed.productionBlockersSummary.byGateLast, "gate4", "JSON production blockers summary should include last by-gate key");
  assertEqual(parsed.productionBlockersSummary.byGateRegistryStatus, "consistent", "JSON production blockers summary should include by-gate registry status");
  assertEqual(parsed.productionBlockersSummary.byGateRegistryInvariant, "count=5,lastIndex=4", "JSON production blockers summary should include by-gate registry invariant");
  assertEqual(parsed.productionBlockersSummary.preGateKey, "gate1Prep", "JSON production blockers summary should include pre-gate key");
  assertEqual(parsed.productionBlockersSummary.gateOrderCount, 4, "JSON production blockers summary should include gate order count");
  assertEqual(parsed.productionBlockersSummary.gateOrderCountField, "productionBlockersSummary.gateOrderCount", "JSON production blockers summary should include gate order count field alias");
  assertEqual(parsed.productionBlockersSummary.gateOrderLastIndex, 3, "JSON production blockers summary should include gate order last index");
  assertEqual(parsed.productionBlockersSummary.gateOrderRegistryInvariant, "count=4,lastIndex=3", "JSON production blockers summary should include gate order registry invariant");
  assertEqual(parsed.productionBlockersSummary.gateOrder[0], "gate1", "JSON production blockers summary should start gate order at Gate 1");
  assertEqual(parsed.productionBlockersSummary.gateOrder[3], "gate4", "JSON production blockers summary should end gate order at Gate 4");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsCount, 4, "JSON production blockers summary should include gate order detail count");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsCountField, "productionBlockersSummary.gateOrderDetailsCount", "JSON production blockers summary should include gate order detail count alias");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsLastIndex, 3, "JSON production blockers summary should include gate order detail last index");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsRegistryInvariant, "count=4,lastIndex=3", "JSON production blockers summary should include gate order detail invariant");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsSummary, "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "JSON production blockers summary should include compact gate order detail summary");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetailsSummaryField, "productionBlockersSummary.gateOrderDetailsSummary", "JSON production blockers summary should include gate order detail summary alias");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetails[0].key, "gate1", "JSON production blockers summary should include first gate order detail key");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetails[0].docPath, "docs/dev/GATE1_PERSISTENCE.md", "JSON production blockers summary should include first gate order detail doc");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetails[3].key, "gate4", "JSON production blockers summary should include last gate order detail key");
  assertEqual(parsed.productionBlockersSummary.gateOrderDetails[3].docPath, "docs/dev/ROADMAP.md", "JSON production blockers summary should include last gate order detail doc");
  assertEqual(parsed.productionBlockersSummary.byGate.gate1.blocker, "Production backend persistence.", "JSON production blockers summary should include Gate 1 blocker");
  assertEqual(parsed.productionBlockersSummary.byGate.gate1.docPath, "docs/dev/GATE1_PERSISTENCE.md", "JSON production blockers summary should include Gate 1 doc path");
  assertEqual(parsed.productionBlockersSummary.byGate.gate2.blocker, "AWS CI/deploy pipeline.", "JSON production blockers summary should include Gate 2 blocker");
  assertEqual(parsed.productionBlockersSummary.byGate.gate2.docPath, "docs/dev/CI.md", "JSON production blockers summary should include Gate 2 doc path");
  assertEqual(parsed.productionBlockersSummary.byGate.gate3.blocker, "Formal Figma/DESIGN.md source of truth.", "JSON production blockers summary should include Gate 3 blocker");
  assertEqual(parsed.productionBlockersSummary.byGate.gate3.docPath, "docs/dev/DESIGN_STATUS.md", "JSON production blockers summary should include Gate 3 doc path");
  assertEqual(parsed.productionBlockersSummary.byGate.gate4.blocker, "App store/release build signing.", "JSON production blockers summary should include Gate 4 blocker");
  assertEqual(parsed.productionBlockersSummary.byGate.gate4.docPath, "docs/dev/ROADMAP.md", "JSON production blockers summary should include Gate 4 doc path");
  assertArrayIncludes(parsed.relatedDocs, "ROADMAP.md", "JSON should include related docs");
  assertArrayIncludes(parsed.relatedDocs, "GATE1_PERSISTENCE.md", "JSON should include Gate 1 persistence doc");
  assertEqual(parsed.relatedDocCount, 5, "JSON should include related doc count");
  assertEqual(parsed.relatedDocCountField, "relatedDocCount", "JSON should include related doc count alias");
  assertEqual(parsed.relatedDocFirst, "CI.md", "JSON should include first related doc");
  assertEqual(parsed.relatedDocFirstField, "relatedDocFirst", "JSON should include first related doc alias");
  assertEqual(parsed.relatedDocLastIndex, 4, "JSON should include related doc last index");
  assertEqual(parsed.relatedDocLastIndexField, "relatedDocLastIndex", "JSON should include related doc last index alias");
  assertEqual(parsed.relatedDocLast, "ROADMAP.md", "JSON should include last related doc");
  assertEqual(parsed.relatedDocLastField, "relatedDocLast", "JSON should include last related doc alias");
  assertEqual(parsed.relatedDocSummary, "5 docs, first=CI.md, last=ROADMAP.md", "JSON should include related doc summary");
  assertEqual(parsed.relatedDocSummaryField, "relatedDocSummary", "JSON should include related doc summary alias");
  assertEqual(parsed.persistenceModeDefault, "fixture", "JSON should include persistence default");
  assertEqual(parsed.persistenceModeDefaultField, "persistenceModeDefault", "JSON should include persistence default alias");
  assertArrayIncludes(parsed.supportedPersistenceModes, "fixture", "JSON should include supported persistence modes");
  assertArrayIncludes(parsed.supportedPersistenceModes, "database", "JSON should include database persistence mode");
  assertEqual(parsed.supportedPersistenceModeCount, 2, "JSON should include supported persistence mode count");
  assertEqual(parsed.supportedPersistenceModeCountField, "supportedPersistenceModeCount", "JSON should include supported persistence mode count alias");
  assertEqual(parsed.supportedPersistenceModeFirst, "fixture", "JSON should include first supported persistence mode");
  assertEqual(parsed.supportedPersistenceModeFirstField, "supportedPersistenceModeFirst", "JSON should include first supported persistence mode alias");
  assertEqual(parsed.supportedPersistenceModeLastIndex, 1, "JSON should include supported persistence mode last index");
  assertEqual(parsed.supportedPersistenceModeLastIndexField, "supportedPersistenceModeLastIndex", "JSON should include supported persistence mode last index alias");
  assertEqual(parsed.supportedPersistenceModeLast, "database", "JSON should include last supported persistence mode");
  assertEqual(parsed.supportedPersistenceModeLastField, "supportedPersistenceModeLast", "JSON should include last supported persistence mode alias");
  assertEqual(parsed.supportedPersistenceModeSummary, "2 modes, default=fixture, first=fixture, last=database", "JSON should include supported persistence mode summary");
  assertEqual(parsed.supportedPersistenceModeSummaryField, "supportedPersistenceModeSummary", "JSON should include supported persistence mode summary alias");
  assertEqual(parsed.latestAndroidDeviceSmoke.status, "passed", "JSON should include device smoke status");
  assertEqual(parsed.latestAndroidDeviceSmoke.runId, "fixture-run", "JSON should include device smoke run ID");
  assertEqual(parsed.latestAndroidDeviceSmokeField, "latestAndroidDeviceSmoke", "JSON should include device smoke alias");
  assertEqual(parsed.latestAndroidDeviceSmokeStatusField, "latestAndroidDeviceSmoke.status", "JSON should include device smoke status alias");
  assertEqual(parsed.latestAndroidDeviceSmokeRunIdField, "latestAndroidDeviceSmoke.runId", "JSON should include device smoke run ID alias");
  assertEqual(parsed.latestAndroidDeviceSmokeManufacturerField, "latestAndroidDeviceSmoke.deviceManufacturer", "JSON should include device smoke manufacturer alias");
  assertEqual(parsed.latestAndroidDeviceSmokeModelField, "latestAndroidDeviceSmoke.deviceModel", "JSON should include device smoke model alias");
  assertEqual(parsed.latestAndroidDeviceSmokeAndroidReleaseField, "latestAndroidDeviceSmoke.androidRelease", "JSON should include device smoke Android release alias");
  assertEqual(parsed.latestAndroidDeviceSmokeAndroidSdkField, "latestAndroidDeviceSmoke.androidSdk", "JSON should include device smoke Android SDK alias");
  assertEqual(parsed.latestAndroidDeviceSmokeDevice, "OPPO CPH2695", "JSON should include compact device identity");
  assertEqual(parsed.latestAndroidDeviceSmokeDeviceField, "latestAndroidDeviceSmokeDevice", "JSON should include compact device identity alias");
  assertEqual(parsed.latestAndroidDeviceSmokeAndroid, "Android 16 / API 36", "JSON should include compact Android identity");
  assertEqual(parsed.latestAndroidDeviceSmokeAndroidField, "latestAndroidDeviceSmokeAndroid", "JSON should include compact Android identity alias");
  assertEqual(parsed.latestAndroidDeviceSmokeSummary, "passed (OPPO CPH2695, Android 16 / API 36, fixture-run)", "JSON should include compact device smoke summary");
  assertEqual(parsed.latestAndroidDeviceSmokeSummaryField, "latestAndroidDeviceSmokeSummary", "JSON should include compact device smoke summary alias");
  assertEqual(parsed.nextGate, "Gate 1 production backend persistence", "JSON should include next gate");
  assertEqual(parsed.nextGateField, "nextGate", "JSON should include next gate alias");
  assertEqual(parsed.nextGateDoc, "GATE1_PERSISTENCE.md", "JSON should include next gate doc");
  assertEqual(parsed.nextGateDocField, "nextGateDoc", "JSON should include next gate doc alias");
  assertEqual(parsed.nextGateDocPath, "docs/dev/GATE1_PERSISTENCE.md", "JSON should include next gate doc path");
  assertEqual(parsed.nextGateDocPathField, "nextGateDocPath", "JSON should include next gate doc path alias");
  assertEqual(parsed.prismaScaffoldStatusSummary, "schema=true, migrations=true, migrationStatus=scaffolded", "JSON should include compact Prisma scaffold status summary");
  assertEqual(parsed.nextGateCommand, "npm run gate0:status -- --field nextGateDocPath", "JSON should include next gate command");
  assertEqual(parsed.nextGateCommandField, "nextGateCommand", "JSON should include next gate command alias");
  assertEqual(parsed.nextGateSummary, "Gate 1 production backend persistence -> docs/dev/GATE1_PERSISTENCE.md", "JSON should include next gate summary");
  assertEqual(parsed.nextGateSummaryField, "nextGateSummary", "JSON should include next gate summary alias");
  assertEqual(parsed.nextGateCheckCommand, "npm run db:check", "JSON should include next gate check command");
  assertEqual(parsed.nextGateCheckCommandField, "nextGateCheckCommand", "JSON should include next gate check command alias");
  assertEqual(parsed.nextGateCheckJsonCommand, "npm run db:check -- --json", "JSON should include next gate check JSON command");
  assertEqual(parsed.nextGateCheckJsonCommandField, "nextGateCheckJsonCommand", "JSON should include next gate check JSON command alias");
  assertEqual(parsed.nextGateCheckCommandSummary, "npm run db:check | npm run db:check -- --json", "JSON should include next gate check command summary");
  assertEqual(parsed.nextGateCheckCommandSummaryField, "nextGateCheckCommandSummary", "JSON should include next gate check command summary alias");
  assertEqual(parsed.nextGateMigrationStatusCommand, "npm run db:check -- --field migrationStatus", "JSON should include next gate migration status command");
  assertEqual(parsed.nextGateMigrationStatusCommandField, "nextGateMigrationStatusCommand", "JSON should include next gate migration status command alias");
  assertObject(parsed.nextGateMigrationStatus, "JSON should include next gate migration status handoff object");
  assertEqual(parsed.nextGateMigrationStatusField, "nextGateMigrationStatus", "JSON should include next gate migration status object alias");
  assertEqual(parsed.nextGateMigrationStatus.command, "npm run db:check -- --field migrationStatus", "JSON migration status object should include command");
  assertEqual(parsed.nextGateMigrationStatus.currentExpectedStatus, "scaffolded", "JSON migration status object should include current expected status");
  assertEqual(parsed.nextGateMigrationStatusCurrentExpectedStatusField, "nextGateMigrationStatus.currentExpectedStatus", "JSON should include next gate migration status current alias");
  assertEqual(parsed.nextGateMigrationStatus.nextExpectedStatus, "database_read_parity", "JSON migration status object should include next expected status");
  assertEqual(parsed.nextGateMigrationStatusNextExpectedStatusField, "nextGateMigrationStatus.nextExpectedStatus", "JSON should include next gate migration status next alias");
  assertEqual(parsed.nextGateMigrationStatus.guardCommand, "npm run not-scaffolded:test", "JSON migration status object should include guard command");
  assertEqual(parsed.nextGateMigrationStatusGuardCommandField, "nextGateMigrationStatus.guardCommand", "JSON should include next gate migration status guard alias");
  assertEqual(parsed.nextGateMigrationStatusSummary, "scaffolded -> database_read_parity", "JSON should include next gate migration status summary");
  assertEqual(parsed.nextGateMigrationStatusSummaryField, "nextGateMigrationStatusSummary", "JSON should include next gate migration status summary alias");
  assertEqual(parsed.nextGateDatabaseUrlStatusCommand, "npm run db:check -- --field databaseUrlStatus", "JSON should include next gate database URL status command");
  assertEqual(parsed.nextGateDatabaseUrlStatusCommandField, "nextGateDatabaseUrlStatusCommand", "JSON should include next gate database URL status command alias");
  assertEqual(parsed.nextGateDatabaseUrlProtocolCommand, "npm run db:check -- --field databaseUrlProtocol", "JSON should include next gate database URL protocol command");
  assertEqual(parsed.nextGateDatabaseUrlProtocolCommandField, "nextGateDatabaseUrlProtocolCommand", "JSON should include next gate database URL protocol command alias");
  assertEqual(parsed.nextGateDatabaseUrlValidationCommand, "$env:DATABASE_URL='<postgresql-url>'; npm run db:check -- --field databaseUrlStatus; npm run db:check -- --field databaseUrlProtocol; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue", "JSON should include next gate database URL validation command");
  assertEqual(parsed.nextGateDatabaseUrlValidationCommandField, "nextGateDatabaseUrlValidationCommand", "JSON should include next gate database URL validation command alias");
  assertEqual(parsed.nextGateDatabaseUrlExpectedStatus, "valid", "JSON should include next gate database URL expected status");
  assertEqual(parsed.nextGateDatabaseUrlExpectedStatusField, "nextGateDatabaseUrlExpectedStatus", "JSON should include next gate database URL expected status alias");
  assertArrayIncludes(parsed.nextGateDatabaseUrlExpectedProtocols, "postgresql", "JSON should include postgresql as expected database URL protocol");
  assertArrayIncludes(parsed.nextGateDatabaseUrlExpectedProtocols, "postgres", "JSON should include postgres as expected database URL protocol");
  assertEqual(parsed.nextGateDatabaseUrlExpectedProtocolsField, "nextGateDatabaseUrlExpectedProtocols", "JSON should include next gate database URL expected protocols alias");
  assertObject(parsed.nextGateDatabaseUrl, "JSON should include next gate database URL handoff object");
  assertEqual(parsed.nextGateDatabaseUrlField, "nextGateDatabaseUrl", "JSON should include next gate database URL object alias");
  assertEqual(parsed.nextGateDatabaseUrl.statusCommand, "npm run db:check -- --field databaseUrlStatus", "JSON database URL object should include status command");
  assertEqual(parsed.nextGateDatabaseUrl.protocolCommand, "npm run db:check -- --field databaseUrlProtocol", "JSON database URL object should include protocol command");
  assertEqual(parsed.nextGateDatabaseUrl.validationCommand, "$env:DATABASE_URL='<postgresql-url>'; npm run db:check -- --field databaseUrlStatus; npm run db:check -- --field databaseUrlProtocol; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue", "JSON database URL object should include validation command");
  assertEqual(parsed.nextGateDatabaseUrl.expectedStatus, "valid", "JSON database URL object should include expected status");
  assertArrayIncludes(parsed.nextGateDatabaseUrl.expectedProtocols, "postgresql", "JSON database URL object should include postgresql");
  assertArrayIncludes(parsed.nextGateDatabaseUrl.expectedProtocols, "postgres", "JSON database URL object should include postgres");
  assertEqual(parsed.nextGateDatabaseUrlExpectedStatusNestedField, "nextGateDatabaseUrl.expectedStatus", "JSON should include next gate database URL expected status nested alias");
  assertEqual(parsed.nextGateDatabaseUrlExpectedProtocolsNestedField, "nextGateDatabaseUrl.expectedProtocols", "JSON should include next gate database URL expected protocols nested alias");
  assertEqual(parsed.nextGateDatabaseUrlSummary, "valid postgresql|postgres", "JSON should include next gate database URL summary");
  assertEqual(parsed.nextGateDatabaseUrlSummaryField, "nextGateDatabaseUrlSummary", "JSON should include next gate database URL summary alias");
  assertObject(parsed.nextGatePrismaScaffold, "JSON should include next gate Prisma scaffold object");
  assertEqual(parsed.nextGatePrismaScaffoldField, "nextGatePrismaScaffold", "JSON should include next gate Prisma scaffold object alias");
  assertEqual(parsed.nextGatePrismaScaffold.schemaPath, "apps/api/prisma/schema.prisma", "JSON Prisma scaffold object should include schema path");
  assertEqual(parsed.nextGatePrismaScaffoldSchemaPathField, "nextGatePrismaScaffold.schemaPath", "JSON should include next gate Prisma scaffold schema path alias");
  assertEqual(parsed.nextGatePrismaScaffold.migrationsPath, "apps/api/prisma/migrations", "JSON Prisma scaffold object should include migrations path");
  assertEqual(parsed.nextGatePrismaScaffoldMigrationsPathField, "nextGatePrismaScaffold.migrationsPath", "JSON should include next gate Prisma scaffold migrations path alias");
  assertEqual(parsed.nextGatePrismaScaffold.schemaPresentCommand, "npm run db:check -- --field prismaSchemaPresent", "JSON Prisma scaffold object should include schema presence command");
  assertEqual(parsed.nextGatePrismaScaffoldSchemaPresentCommandField, "nextGatePrismaScaffold.schemaPresentCommand", "JSON should include next gate Prisma scaffold schema presence command alias");
  assertEqual(parsed.nextGatePrismaScaffold.migrationsPresentCommand, "npm run db:check -- --field prismaMigrationsPresent", "JSON Prisma scaffold object should include migrations presence command");
  assertEqual(parsed.nextGatePrismaScaffoldMigrationsPresentCommandField, "nextGatePrismaScaffold.migrationsPresentCommand", "JSON should include next gate Prisma scaffold migrations presence command alias");
  assertEqual(parsed.nextGatePrismaScaffold.expectedPresent, true, "JSON Prisma scaffold object should include expected presence");
  assertEqual(parsed.nextGatePrismaScaffoldExpectedPresentField, "nextGatePrismaScaffold.expectedPresent", "JSON should include next gate Prisma scaffold expected presence alias");
  assertEqual(parsed.nextGatePrismaScaffoldSummary, "schema=apps/api/prisma/schema.prisma, migrations=apps/api/prisma/migrations, expectedPresent=true", "JSON should include next gate Prisma scaffold summary");
  assertEqual(parsed.nextGatePrismaScaffoldSummaryField, "nextGatePrismaScaffoldSummary", "JSON should include next gate Prisma scaffold summary alias");
  assertEqual(parsed.nextGateMigrationGuardCommand, "npm run not-scaffolded:test", "JSON should include next gate migration guard command");
  assertEqual(parsed.nextGateMigrationGuardCommandField, "nextGateMigrationGuardCommand", "JSON should include next gate migration guard command alias");
  assertEqual(parsed.nextGateMigrationGuardMigrationCommand, "npm run db:migrate", "JSON should include next gate migration guard migration command");
  assertEqual(parsed.nextGateMigrationGuardMigrationCommandField, "nextGateMigrationGuardMigrationCommand", "JSON should include next gate migration guard migration command alias");
  assertEqual(parsed.nextGateMigrationGuardHelperCommand, "node scripts/not-scaffolded.mjs --help", "JSON should include next gate migration guard helper command");
  assertEqual(parsed.nextGateMigrationGuardHelperCommandField, "nextGateMigrationGuardHelperCommand", "JSON should include next gate migration guard helper command alias");
  assertEqual(parsed.nextGateMigrationGuardErrorCode, "TM_COMMAND_NOT_SCAFFOLDED", "JSON should include next gate migration guard error code");
  assertEqual(parsed.nextGateMigrationGuardErrorCodeField, "nextGateMigrationGuardErrorCode", "JSON should include next gate migration guard error code alias");
  assertObject(parsed.nextGateMigrationGuard, "JSON should include next gate migration guard object");
  assertEqual(parsed.nextGateMigrationGuardField, "nextGateMigrationGuard", "JSON should include next gate migration guard object alias");
  assertEqual(parsed.nextGateMigrationGuard.command, "npm run not-scaffolded:test", "JSON guard object should include guard command");
  assertEqual(parsed.nextGateMigrationGuard.migrationCommand, "npm run db:migrate", "JSON guard object should include migration command");
  assertEqual(parsed.nextGateMigrationGuard.helperCommand, "node scripts/not-scaffolded.mjs --help", "JSON guard object should include helper command");
  assertEqual(parsed.nextGateMigrationGuard.errorCode, "TM_COMMAND_NOT_SCAFFOLDED", "JSON guard object should include stable error code");
  assertEqual(parsed.nextGateMigrationGuardErrorCodeNestedField, "nextGateMigrationGuard.errorCode", "JSON should include next gate migration guard nested error code alias");
  assertEqual(parsed.nextGateMigrationGuardSummary, "npm run not-scaffolded:test blocks npm run db:migrate with TM_COMMAND_NOT_SCAFFOLDED", "JSON should include next gate migration guard summary");
  assertEqual(parsed.nextGateMigrationGuardSummaryField, "nextGateMigrationGuardSummary", "JSON should include next gate migration guard summary alias");
  assertObject(parsed.nextGateDbMatrix, "JSON should include next gate DB matrix handoff object");
  assertEqual(parsed.nextGateDbMatrixField, "nextGateDbMatrix", "JSON should include next gate DB matrix object alias");
  assertEqual(parsed.nextGateDbMatrix.checkCommand, "npm run db:check", "JSON DB matrix object should include check command");
  assertEqual(parsed.nextGateDbMatrixCheckCommandField, "nextGateDbMatrix.checkCommand", "JSON should include next gate DB matrix check command alias");
  assertEqual(parsed.nextGateDbMatrix.jsonCommand, "npm run db:check -- --json", "JSON DB matrix object should include JSON command");
  assertEqual(parsed.nextGateDbMatrixJsonCommandField, "nextGateDbMatrix.jsonCommand", "JSON should include next gate DB matrix JSON command alias");
  assertEqual(parsed.nextGateDbMatrix.migrationStatusCommand, "npm run db:check -- --field migrationStatus", "JSON DB matrix object should include migration status command");
  assertEqual(parsed.nextGateDbMatrixMigrationStatusCommandField, "nextGateDbMatrix.migrationStatusCommand", "JSON should include next gate DB matrix migration status command alias");
  assertEqual(parsed.nextGateDbMatrix.migrationStatus.currentExpectedStatus, "scaffolded", "JSON DB matrix object should include migration status handoff object");
  assertEqual(parsed.nextGateDbMatrix.prismaScaffold.schemaPath, "apps/api/prisma/schema.prisma", "JSON DB matrix object should include Prisma scaffold object");
  assertObject(parsed.nextGateDbMatrix.prismaScaffoldStatus, "JSON DB matrix object should include Prisma scaffold status object");
  assertEqual(parsed.nextGateDbMatrix.prismaScaffoldStatus.schemaPresent, true, "JSON DB matrix object should include current Prisma schema presence");
  assertEqual(parsed.nextGateDbMatrix.prismaScaffoldStatus.migrationsPresent, true, "JSON DB matrix object should include current Prisma migrations presence");
  assertEqual(parsed.nextGateDbMatrix.prismaScaffoldStatus.migrationStatus, "scaffolded", "JSON DB matrix object should include current migration status");
  assertEqual(parsed.nextGateDbMatrix.prismaScaffoldStatus.summary, "schema=true, migrations=true, migrationStatus=scaffolded", "JSON DB matrix object should include Prisma scaffold status summary");
  assertEqual(parsed.nextGateDbMatrixPrismaScaffoldStatusSummaryField, "nextGateDbMatrix.prismaScaffoldStatus.summary", "JSON should include next gate DB matrix Prisma scaffold status summary alias");
  assertEqual(parsed.nextGateDbMatrix.databaseUrl.expectedStatus, "valid", "JSON DB matrix object should include database URL object");
  assertEqual(parsed.nextGateDbMatrixDatabaseUrlExpectedStatusField, "nextGateDbMatrix.databaseUrl.expectedStatus", "JSON should include next gate DB matrix database URL expected status alias");
  assertEqual(parsed.nextGateDbMatrix.migrationGuard.errorCode, "TM_COMMAND_NOT_SCAFFOLDED", "JSON DB matrix object should include migration guard object");
  assertEqual(parsed.nextGateDbMatrix.requiredChecksSource, "docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON DB matrix object should include required checks source");
  assertEqual(parsed.nextGateDbMatrixRequiredChecksSourceField, "nextGateDbMatrix.requiredChecksSource", "JSON should include next gate DB matrix required checks source alias");
  assertEqual(parsed.nextGateDbMatrix.requiredChecksParsed, true, "JSON DB matrix object should include required checks parsed status");
  assertEqual(parsed.nextGateDbMatrixRequiredChecksParsedField, "nextGateDbMatrix.requiredChecksParsed", "JSON should include next gate DB matrix required checks parsed alias");
  assertArrayIncludes(parsed.nextGateDbMatrix.requiredChecks, "npm run db:check -- --json", "JSON DB matrix object should include required checks");
  assertEqual(parsed.nextGateDbMatrixSummary, "check=npm run db:check, json=npm run db:check -- --json, requiredChecks=13", "JSON should include next gate DB matrix summary");
  assertEqual(parsed.nextGateDbMatrixSummaryField, "nextGateDbMatrixSummary", "JSON should include next gate DB matrix summary alias");
  assertEqual(parsed.nextGateRequiredChecksSource, "docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON should include next gate required checks source");
  assertEqual(parsed.nextGateRequiredChecksSourceField, "nextGateRequiredChecksSource", "JSON should include next gate required checks source alias");
  assertEqual(parsed.nextGateRequiredChecksParsed, true, "JSON should include parsed required checks status");
  assertEqual(parsed.nextGateRequiredChecksParsedField, "nextGateRequiredChecksParsed", "JSON should include next gate required checks parsed alias");
  assertObject(parsed.nextGateRequiredChecksSummary, "JSON should include next gate required checks summary object");
  assertEqual(parsed.nextGateRequiredChecksSummaryField, "nextGateRequiredChecksSummary", "JSON should include next gate required checks summary alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.count, 13, "JSON required checks summary should include count");
  assertEqual(parsed.nextGateRequiredChecksSummaryCountField, "nextGateRequiredChecksSummary.count", "JSON should include next gate required checks count alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.source, "docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON required checks summary should include source");
  assertEqual(parsed.nextGateRequiredChecksSummarySourceField, "nextGateRequiredChecksSummary.source", "JSON should include next gate required checks source nested alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.parsed, true, "JSON required checks summary should include parsed status");
  assertEqual(parsed.nextGateRequiredChecksSummaryParsedField, "nextGateRequiredChecksSummary.parsed", "JSON should include next gate required checks parsed nested alias");
  assertEqual(parsed.nextGateRequiredChecksCompactSummary, "13 checks, parsed=true, source=docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON should include next gate required checks compact summary");
  assertEqual(parsed.nextGateRequiredChecksCompactSummaryField, "nextGateRequiredChecksCompactSummary", "JSON should include next gate required checks compact summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeSummary, "db=8, guard=2, test=1, privacy=1, errors=1", "JSON should include next gate required checks by type summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeSummaryField, "nextGateRequiredChecksByTypeSummary", "JSON should include next gate required checks by type summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeEndpointSummary, "first=db, last=errors", "JSON should include next gate required checks by type endpoint summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeEndpointSummaryField, "nextGateRequiredChecksByTypeEndpointSummary", "JSON should include next gate required checks by type endpoint summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeRegistrySummary, "consistent: count=5,lastIndex=4", "JSON should include next gate required checks by type registry summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeRegistrySummaryField, "nextGateRequiredChecksByTypeRegistrySummary", "JSON should include next gate required checks by type registry summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeFieldSummary, "keysField=nextGateRequiredChecksSummary.byTypeKeys, countField=nextGateRequiredChecksSummary.byTypeCount, firstField=nextGateRequiredChecksSummary.byTypeFirst, lastField=nextGateRequiredChecksSummary.byTypeLast", "JSON should include next gate required checks by type field summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeFieldSummaryField, "nextGateRequiredChecksByTypeFieldSummary", "JSON should include next gate required checks by type field summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandCountSummary, "dbCommands=8, guardCommands=2, testCommands=1, privacyCommands=1, errorsCommands=1", "JSON should include next gate required checks by type command count summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandCountSummaryField, "nextGateRequiredChecksByTypeCommandCountSummary", "JSON should include next gate required checks by type command count summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandEndpointSummary, "db: first=npm run db:check, last=npm run db:check -- --field databaseUrlProtocol | guard: first=npm run not-scaffolded:test, last=node scripts/not-scaffolded.mjs --help | test: first=npm test, last=npm test | privacy: first=npm run privacy:test, last=npm run privacy:test | errors: first=npm run errors:check, last=npm run errors:check", "JSON should include next gate required checks by type command endpoint summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandEndpointSummaryField, "nextGateRequiredChecksByTypeCommandEndpointSummary", "JSON should include next gate required checks by type command endpoint summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandRegistrySummary, "db=count=8,lastIndex=7, guard=count=2,lastIndex=1, test=count=1,lastIndex=0, privacy=count=1,lastIndex=0, errors=count=1,lastIndex=0", "JSON should include next gate required checks by type command registry summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandRegistrySummaryField, "nextGateRequiredChecksByTypeCommandRegistrySummary", "JSON should include next gate required checks by type command registry summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandRegistryStatusSummary, "db=consistent, guard=consistent, test=consistent, privacy=consistent, errors=consistent", "JSON should include next gate required checks by type command registry status summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField, "nextGateRequiredChecksByTypeCommandRegistryStatusSummary", "JSON should include next gate required checks by type command registry status summary alias");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandFieldSummary, "dbCommandsField=nextGateRequiredChecksSummary.byType.db.commands, guardCommandsField=nextGateRequiredChecksSummary.byType.guard.commands, testCommandsField=nextGateRequiredChecksSummary.byType.test.commands, privacyCommandsField=nextGateRequiredChecksSummary.byType.privacy.commands, errorsCommandsField=nextGateRequiredChecksSummary.byType.errors.commands", "JSON should include next gate required checks by type command field summary");
  assertEqual(parsed.nextGateRequiredChecksByTypeCommandFieldSummaryField, "nextGateRequiredChecksByTypeCommandFieldSummary", "JSON should include next gate required checks by type command field summary alias");
  assertObject(parsed.nextGateRequiredChecksSummary.byType, "JSON required checks summary should include by type");
  assertArrayIncludes(parsed.nextGateRequiredChecksSummary.byTypeKeys, "db", "JSON required checks summary should include DB type key");
  assertArrayIncludes(parsed.nextGateRequiredChecksSummary.byTypeKeys, "errors", "JSON required checks summary should include errors type key");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeKeys[0], "db", "JSON required checks summary should include first type key");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeKeys[4], "errors", "JSON required checks summary should include last type key");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeKeysField, "nextGateRequiredChecksSummary.byTypeKeys", "JSON required checks summary should include type keys field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeCount, 5, "JSON required checks summary should include type count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeCountField, "nextGateRequiredChecksSummary.byTypeCount", "JSON required checks summary should include type count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeLastIndex, 4, "JSON required checks summary should include type last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeLastIndexField, "nextGateRequiredChecksSummary.byTypeLastIndex", "JSON required checks summary should include type last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeFirst, "db", "JSON required checks summary should include first type");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeFirstField, "nextGateRequiredChecksSummary.byTypeFirst", "JSON required checks summary should include first type field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeLast, "errors", "JSON required checks summary should include last type");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeLastField, "nextGateRequiredChecksSummary.byTypeLast", "JSON required checks summary should include last type field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeRegistryStatus, "consistent", "JSON required checks summary should include type registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeRegistryStatusField, "nextGateRequiredChecksSummary.byTypeRegistryStatus", "JSON required checks summary should include type registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeRegistryInvariant, "count=5,lastIndex=4", "JSON required checks summary should include type registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byTypeRegistryInvariantField, "nextGateRequiredChecksSummary.byTypeRegistryInvariant", "JSON required checks summary should include type registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.count, 8, "JSON required checks summary should include DB count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.count, 2, "JSON required checks summary should include guard count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.count, 1, "JSON required checks summary should include test count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.count, 1, "JSON required checks summary should include privacy count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.count, 1, "JSON required checks summary should include errors count");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.countField, "nextGateRequiredChecksSummary.byType.db.count", "JSON required checks summary should include DB count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.countField, "nextGateRequiredChecksSummary.byType.guard.count", "JSON required checks summary should include guard count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.countField, "nextGateRequiredChecksSummary.byType.test.count", "JSON required checks summary should include test count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.countField, "nextGateRequiredChecksSummary.byType.privacy.count", "JSON required checks summary should include privacy count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.countField, "nextGateRequiredChecksSummary.byType.errors.count", "JSON required checks summary should include errors count field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandsField, "nextGateRequiredChecksSummary.byType.db.commands", "JSON required checks summary should include DB commands field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandsField, "nextGateRequiredChecksSummary.byType.guard.commands", "JSON required checks summary should include guard commands field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandsField, "nextGateRequiredChecksSummary.byType.test.commands", "JSON required checks summary should include test commands field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandsField, "nextGateRequiredChecksSummary.byType.privacy.commands", "JSON required checks summary should include privacy commands field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandsField, "nextGateRequiredChecksSummary.byType.errors.commands", "JSON required checks summary should include errors commands field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandLastIndex, 7, "JSON required checks summary should include DB command last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandLastIndex, 1, "JSON required checks summary should include guard command last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandLastIndex, 0, "JSON required checks summary should include test command last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandLastIndex, 0, "JSON required checks summary should include privacy command last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandLastIndex, 0, "JSON required checks summary should include errors command last index");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandRegistryStatus, "consistent", "JSON required checks summary should include DB command registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus, "consistent", "JSON required checks summary should include guard command registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandRegistryStatus, "consistent", "JSON required checks summary should include test command registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus, "consistent", "JSON required checks summary should include privacy command registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus, "consistent", "JSON required checks summary should include errors command registry status");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant, "count=8,lastIndex=7", "JSON required checks summary should include DB command registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant, "count=2,lastIndex=1", "JSON required checks summary should include guard command registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant, "count=1,lastIndex=0", "JSON required checks summary should include test command registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant, "count=1,lastIndex=0", "JSON required checks summary should include privacy command registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant, "count=1,lastIndex=0", "JSON required checks summary should include errors command registry invariant");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandLastIndexField, "nextGateRequiredChecksSummary.byType.db.commandLastIndex", "JSON required checks summary should include DB command last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandLastIndexField, "nextGateRequiredChecksSummary.byType.guard.commandLastIndex", "JSON required checks summary should include guard command last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandLastIndexField, "nextGateRequiredChecksSummary.byType.test.commandLastIndex", "JSON required checks summary should include test command last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandLastIndexField, "nextGateRequiredChecksSummary.byType.privacy.commandLastIndex", "JSON required checks summary should include privacy command last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandLastIndexField, "nextGateRequiredChecksSummary.byType.errors.commandLastIndex", "JSON required checks summary should include errors command last index field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField, "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus", "JSON required checks summary should include DB command registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField, "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus", "JSON required checks summary should include guard command registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandRegistryStatusField, "nextGateRequiredChecksSummary.byType.test.commandRegistryStatus", "JSON required checks summary should include test command registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatusField, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus", "JSON required checks summary should include privacy command registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandRegistryStatusField, "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus", "JSON required checks summary should include errors command registry status field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField, "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant", "JSON required checks summary should include DB command registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField, "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant", "JSON required checks summary should include guard command registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commandRegistryInvariantField, "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant", "JSON required checks summary should include test command registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariantField, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant", "JSON required checks summary should include privacy command registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariantField, "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant", "JSON required checks summary should include errors command registry invariant field alias");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commands[0], "npm run db:check", "JSON required checks summary should include first DB command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commands[4], "npm run db:check -- --field prismaScaffoldStatus.summary", "JSON required checks summary should include Prisma scaffold status command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.db.commands[7], "npm run db:check -- --field databaseUrlProtocol", "JSON required checks summary should include last DB command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commands[0], "npm run not-scaffolded:test", "JSON required checks summary should include first guard command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.guard.commands[1], "node scripts/not-scaffolded.mjs --help", "JSON required checks summary should include last guard command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.test.commands[0], "npm test", "JSON required checks summary should include test command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.privacy.commands[0], "npm run privacy:test", "JSON required checks summary should include privacy command");
  assertEqual(parsed.nextGateRequiredChecksSummary.byType.errors.commands[0], "npm run errors:check", "JSON required checks summary should include errors command");
  assertArrayIncludes(parsed.nextGateRequiredChecksSummary.commands, "npm run db:check -- --json", "JSON required checks summary should include commands");
  assertObject(parsed.nextGateReadiness, "JSON should include next gate readiness object");
  assertEqual(parsed.nextGateReadinessField, "nextGateReadiness", "JSON should include next gate readiness alias");
  assertEqual(parsed.nextGateReadiness.verifiedNowCount, 10, "JSON readiness should include verified-now count");
  assertEqual(parsed.nextGateReadinessVerifiedNowCountField, "nextGateReadiness.verifiedNowCount", "JSON should include next gate readiness verified count alias");
  assertEqual(parsed.nextGateReadiness.transitionCount, 3, "JSON readiness should include transition count");
  assertEqual(parsed.nextGateReadinessTransitionCountField, "nextGateReadiness.transitionCount", "JSON should include next gate readiness transition count alias");
  assertArrayIncludes(parsed.nextGateReadiness.verifiedNowCommands, "npm run not-scaffolded:test", "JSON readiness should include current guard check");
  assertEqual(parsed.nextGateReadinessVerifiedNowCommandsField, "nextGateReadiness.verifiedNowCommands", "JSON should include next gate readiness verified commands alias");
  assertArrayIncludes(parsed.nextGateReadiness.transitionCommands, "npm run db:check -- --field databaseUrlStatus", "JSON readiness should include database URL transition check");
  assertArrayIncludes(parsed.nextGateReadiness.transitionCommands, "npm run db:check -- --field migrationStatus", "JSON readiness should include migration status transition check");
  assertEqual(parsed.nextGateReadinessTransitionCommandsField, "nextGateReadiness.transitionCommands", "JSON should include next gate readiness transition commands alias");
  assertEqual(parsed.nextGateReadinessSummary, "10 verified now, 3 transition checks", "JSON should include next gate readiness summary");
  assertEqual(parsed.nextGateReadinessSummaryField, "nextGateReadinessSummary", "JSON should include next gate readiness summary alias");
  assertObject(parsed.nextGateTransitionPlan, "JSON should include next gate transition plan");
  assertEqual(parsed.nextGateTransitionPlanField, "nextGateTransitionPlan", "JSON should include next gate transition plan alias");
  assertEqual(parsed.nextGateTransitionPlan.count, 3, "JSON transition plan should include transition count");
  assertEqual(parsed.nextGateTransitionPlanCountField, "nextGateTransitionPlan.count", "JSON should include next gate transition plan count alias");
  assertEqual(parsed.nextGateTransitionPlan.transitions.migrationStatus.currentExpected, "scaffolded", "JSON transition plan should include migration current expectation");
  assertEqual(parsed.nextGateTransitionPlan.transitions.migrationStatus.nextExpected, "database_read_parity", "JSON transition plan should include migration next expectation");
  assertEqual(parsed.nextGateTransitionPlanMigrationStatusNextExpectedField, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "JSON should include next gate transition plan migration next alias");
  assertEqual(parsed.nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected, "valid", "JSON transition plan should include database URL status next expectation");
  assertEqual(parsed.nextGateTransitionPlanDatabaseUrlStatusNextExpectedField, "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected", "JSON should include next gate transition plan database URL status alias");
  assertArrayIncludes(parsed.nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected, "postgresql", "JSON transition plan should include postgresql protocol expectation");
  assertEqual(parsed.nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField, "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "JSON should include next gate transition plan database URL protocol alias");
  assertEqual(parsed.nextGateTransitionPlanOrderedStepsField, "nextGateTransitionPlan.orderedSteps", "JSON should include next gate transition plan ordered steps alias");
  assertArrayIncludes(parsed.nextGateTransitionPlan.orderedSteps.map((step) => step.id), "scaffold-prisma", "JSON transition plan should include Prisma scaffold step");
  assertArrayIncludes(parsed.nextGateTransitionPlan.orderedSteps.map((step) => step.id), "set-database-url", "JSON transition plan should include database URL step");
  assertArrayIncludes(parsed.nextGateTransitionPlan.orderedSteps.map((step) => step.id), "verify-db-matrix", "JSON transition plan should include DB matrix verification step");
  assertEqual(parsed.nextGateTransitionPlanFirstStepIdField, "nextGateTransitionPlan.orderedSteps.0.id", "JSON should include next gate transition plan first step alias");
  assertEqual(parsed.nextGateTransitionPlanStepSummary, "scaffold-prisma -> set-database-url -> verify-db-matrix", "JSON should include next gate transition plan step summary");
  assertEqual(parsed.nextGateTransitionPlanStepSummaryField, "nextGateTransitionPlanStepSummary", "JSON should include next gate transition plan step summary alias");
  assertEqual(parsed.nextGateTransitionPlanSummary, "3 transitions -> database_read_parity, valid, postgresql|postgres", "JSON should include next gate transition plan summary");
  assertEqual(parsed.nextGateTransitionPlanSummaryField, "nextGateTransitionPlanSummary", "JSON should include next gate transition plan summary alias");
  assertObject(parsed.nextGateCiHandoff, "JSON should include next gate CI handoff");
  assertEqual(parsed.nextGateCiHandoffField, "nextGateCiHandoff", "JSON should include next gate CI handoff alias");
  assertEqual(parsed.nextGateCiHandoffRequiredCheckCountFieldAlias, "nextGateCiHandoff.requiredCheckCount", "JSON should include next gate CI handoff required check count alias");
  assertEqual(parsed.nextGateCiHandoffWatchFieldCountFieldAlias, "nextGateCiHandoff.watchFieldCount", "JSON should include next gate CI handoff watch field count alias");
  assertEqual(parsed.nextGateCiHandoffCommandCountFieldAlias, "nextGateCiHandoff.commandCount", "JSON should include next gate CI handoff command count alias");
  assertEqual(parsed.nextGateCiHandoffSummary, "13 required checks, 3 watch fields, 13 commands", "JSON should include next gate CI handoff summary");
  assertEqual(parsed.nextGateCiHandoffSummaryField, "nextGateCiHandoffSummary", "JSON should include next gate CI handoff summary alias");
  assertEqual(parsed.nextGateCiHandoffReadyStatus, "all_assertions_pass", "JSON should include next gate CI handoff ready status");
  assertEqual(parsed.nextGateCiHandoffReadyStatusField, "nextGateCiHandoff.readyWhen.status", "JSON should include next gate CI handoff ready status alias");
  assertEqual(parsed.nextGateCiHandoffReadySummary, "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON should include next gate CI handoff ready summary");
  assertEqual(parsed.nextGateCiHandoffReadySummaryField, "nextGateCiHandoff.readyWhen.summary", "JSON should include next gate CI handoff ready summary alias");
  assertEqual(parsed.nextGateCiHandoffReadyTopSummary, "all_assertions_pass: migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON should include next gate CI handoff ready top summary");
  assertEqual(parsed.nextGateCiHandoffReadyTopSummaryField, "nextGateCiHandoffReadyTopSummary", "JSON should include next gate CI handoff ready top summary alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasCount, 324, "JSON CI handoff should include field alias count");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasCountField, "nextGateCiHandoff.fieldAliasCount", "JSON CI handoff should include field alias count alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasLastIndex, 323, "JSON CI handoff should include field alias last index");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasLastIndexField, "nextGateCiHandoff.fieldAliasLastIndex", "JSON CI handoff should include field alias last index alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasRegistryStatus, "consistent", "JSON CI handoff should include alias registry status");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasRegistryStatusField, "nextGateCiHandoff.fieldAliasRegistryStatus", "JSON CI handoff should include alias registry status alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasRegistryInvariant, "count=324,lastIndex=323", "JSON CI handoff should include alias registry invariant");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasRegistryInvariantField, "nextGateCiHandoff.fieldAliasRegistryInvariant", "JSON CI handoff should include alias registry invariant alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasFirst, "nextGateCiHandoff.transitionPlanField", "JSON CI handoff should include first field alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasFirstField, "nextGateCiHandoff.fieldAliasFirst", "JSON CI handoff should include first field alias field alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasLast, "productionBlockersSummary.gateOrderDetailsSummaryField", "JSON CI handoff should include last field alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasLastField, "nextGateCiHandoff.fieldAliasLast", "JSON CI handoff should include last field alias field alias");
  assertObject(parsed.nextGateCiHandoff.fieldAliasEndpoints, "JSON CI handoff should include field alias endpoints object");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasEndpoints.first, "nextGateCiHandoff.transitionPlanField", "JSON CI handoff should include field alias endpoint first");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasEndpoints.last, "productionBlockersSummary.gateOrderDetailsSummaryField", "JSON CI handoff should include field alias endpoint last");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasEndpointsField, "nextGateCiHandoff.fieldAliasEndpoints", "JSON CI handoff should include field alias endpoints field alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasesField, "nextGateCiHandoff.fieldAliases", "JSON CI handoff should include field aliases field alias");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasSummary, "324 aliases, first=nextGateCiHandoff.transitionPlanField, last=productionBlockersSummary.gateOrderDetailsSummaryField", "JSON CI handoff should include field alias summary");
  assertEqual(parsed.nextGateCiHandoff.fieldAliasSummaryField, "nextGateCiHandoff.fieldAliasSummary", "JSON CI handoff should include field alias summary alias");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.commandsField", "JSON CI handoff should include commands alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.commandLastIndexField", "JSON CI handoff should include command last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.commandRegistryStatusField", "JSON CI handoff should include command registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.commandRegistryInvariantField", "JSON CI handoff should include command registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.commandCountField", "JSON CI handoff should include ready command count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.commandLastIndexField", "JSON CI handoff should include ready command last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.commandRegistryStatusField", "JSON CI handoff should include ready command registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.commandRegistryInvariantField", "JSON CI handoff should include ready command registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.requiredFieldLastIndexField", "JSON CI handoff should include ready required field last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField", "JSON CI handoff should include ready required field registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField", "JSON CI handoff should include ready required field registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandFirstField", "JSON CI handoff should include rollback command first alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandLastField", "JSON CI handoff should include rollback command last alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandEndpointsField", "JSON CI handoff should include rollback command endpoints alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandEndpointSummaryField", "JSON CI handoff should include rollback command endpoint summary alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandLastIndexField", "JSON CI handoff should include rollback command last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandRegistryStatusField", "JSON CI handoff should include rollback command registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.commandRegistryInvariantField", "JSON CI handoff should include rollback command registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.rollback.reportCommandField", "JSON CI handoff should include rollback report command alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldFirstField", "JSON CI handoff should include ready report first alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldLastField", "JSON CI handoff should include ready report last alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldEndpointsField", "JSON CI handoff should include ready report endpoints alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.fieldAliasLastIndexField", "JSON CI handoff should include alias last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldLastIndexField", "JSON CI handoff should include ready report last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldSummaryField", "JSON CI handoff should include ready report summary alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField", "JSON CI handoff should include ready report registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField", "JSON CI handoff should include ready report registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValuesField", "JSON CI handoff should include ready report values alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueKeysField", "JSON CI handoff should include ready report value keys alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueKeys.24", "JSON CI handoff should include final ready report value key alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueEndpointsField", "JSON CI handoff should include ready report value endpoints alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField", "JSON CI handoff should include ready report value endpoint summary alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueSummaryField", "JSON CI handoff should include ready report value summary alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValueCountField", "JSON CI handoff should include ready report value count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary", "JSON CI handoff should include production gate report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "JSON CI handoff should include rollback command endpoint summary report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount", "JSON CI handoff should include production blocker count report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.progressPercent", "JSON CI handoff should include progress percent report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary", "JSON CI handoff should include progress basis summary report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary", "JSON CI handoff should include remaining blockers summary report value alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.fieldAliasRegistryStatusField", "JSON CI handoff should include alias registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateCiHandoff.fieldAliasRegistryInvariantField", "JSON CI handoff should include alias registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byTypeKeysField", "JSON CI handoff should include DB matrix required check type keys alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byTypeCountField", "JSON CI handoff should include DB matrix required check type count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndexField", "JSON CI handoff should include DB matrix required check type last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatusField", "JSON CI handoff should include DB matrix required check type registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariantField", "JSON CI handoff should include DB matrix required check type registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.db.countField", "JSON CI handoff should include DB matrix DB count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandsField", "JSON CI handoff should include DB matrix guard commands alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndexField", "JSON CI handoff should include DB matrix DB last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatusField", "JSON CI handoff should include DB matrix DB registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariantField", "JSON CI handoff should include DB matrix DB registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.0", "JSON CI handoff should include DB matrix first DB command endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commands.0", "JSON CI handoff should include DB matrix errors command endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byTypeKeysField", "JSON CI handoff should include required check type keys alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byTypeCountField", "JSON CI handoff should include required check type count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byTypeLastIndexField", "JSON CI handoff should include required check type last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byTypeRegistryStatusField", "JSON CI handoff should include required check type registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byTypeRegistryInvariantField", "JSON CI handoff should include required check type registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.db.countField", "JSON CI handoff should include required check DB count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.guard.commandsField", "JSON CI handoff should include required check guard commands alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.db.commandLastIndexField", "JSON CI handoff should include required check DB last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField", "JSON CI handoff should include required check DB registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField", "JSON CI handoff should include required check DB registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.db.commands.0", "JSON CI handoff should include required check first DB command endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "nextGateRequiredChecksSummary.byType.errors.commands.0", "JSON CI handoff should include required check errors command endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.countField", "JSON CI handoff should include production blocker count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.registryInvariantField", "JSON CI handoff should include production blocker registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.nextGateBlockerField", "JSON CI handoff should include production blocker next gate blocker alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.nextGateDocPathField", "JSON CI handoff should include production blocker next gate doc alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.blockers.0", "JSON CI handoff should include first production blocker endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.blockers.4", "JSON CI handoff should include last production blocker endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateField", "JSON CI handoff should include production blockers by-gate alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateCountField", "JSON CI handoff should include production blockers by-gate count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGate.gate1.docPath", "JSON CI handoff should include Gate 1 blocker doc alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGate.gate2.docPath", "JSON CI handoff should include Gate 2 blocker doc alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGate.gate3.blocker", "JSON CI handoff should include Gate 3 blocker alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGate.gate4.docPath", "JSON CI handoff should include Gate 4 blocker doc alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateKeysField", "JSON CI handoff should include by-gate keys alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateLastIndexField", "JSON CI handoff should include by-gate last index alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateFirstField", "JSON CI handoff should include by-gate first alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateLastField", "JSON CI handoff should include by-gate last alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateRegistryStatusField", "JSON CI handoff should include by-gate registry status alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.byGateRegistryInvariantField", "JSON CI handoff should include by-gate registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.preGateKeyField", "JSON CI handoff should include pre-gate key alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderField", "JSON CI handoff should include gate order alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrder.0", "JSON CI handoff should include first gate order endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrder.3", "JSON CI handoff should include last gate order endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderCountField", "JSON CI handoff should include gate order count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderRegistryInvariantField", "JSON CI handoff should include gate order registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetailsField", "JSON CI handoff should include gate order details alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetails.0.docPath", "JSON CI handoff should include first gate order detail doc endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetails.3.key", "JSON CI handoff should include last gate order detail key endpoint in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetailsCountField", "JSON CI handoff should include gate order detail count alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetailsRegistryInvariantField", "JSON CI handoff should include gate order detail registry invariant alias in alias list");
  assertArrayIncludes(parsed.nextGateCiHandoff.fieldAliases, "productionBlockersSummary.gateOrderDetailsSummaryField", "JSON CI handoff should include gate order detail summary alias in alias list");
  assertEqual(parsed.nextGateCiHandoff.requiredCheckCount, 13, "JSON CI handoff should include required check count");
  assertEqual(parsed.nextGateCiHandoff.requiredCheckCountField, "nextGateCiHandoff.requiredCheckCount", "JSON CI handoff should include required check count field alias");
  assertEqual(parsed.nextGateCiHandoff.requiredChecksSource, "docs/dev/GATE1_PERSISTENCE.md#required-checks", "JSON CI handoff should include required checks source");
  assertEqual(parsed.nextGateCiHandoff.requiredChecksSourceField, "nextGateCiHandoff.requiredChecksSource", "JSON CI handoff should include required checks source field alias");
  assertEqual(parsed.nextGateCiHandoff.requiredChecksParsed, true, "JSON CI handoff should include required checks parsed status");
  assertEqual(parsed.nextGateCiHandoff.requiredChecksParsedField, "nextGateCiHandoff.requiredChecksParsed", "JSON CI handoff should include required checks parsed field alias");
  assertEqual(parsed.nextGateCiHandoff.commandCount, 13, "JSON CI handoff should include command count");
  assertEqual(parsed.nextGateCiHandoff.commandCountField, "nextGateCiHandoff.commandCount", "JSON CI handoff should include command count field alias");
  assertEqual(parsed.nextGateCiHandoff.commandLastIndex, 12, "JSON CI handoff should include command last index");
  assertEqual(parsed.nextGateCiHandoff.commandLastIndexField, "nextGateCiHandoff.commandLastIndex", "JSON CI handoff should include command last index field alias");
  assertEqual(parsed.nextGateCiHandoff.commandRegistryStatus, "consistent", "JSON CI handoff should include command registry status");
  assertEqual(parsed.nextGateCiHandoff.commandRegistryStatusField, "nextGateCiHandoff.commandRegistryStatus", "JSON CI handoff should include command registry status field alias");
  assertEqual(parsed.nextGateCiHandoff.commandRegistryInvariant, "count=13,lastIndex=12", "JSON CI handoff should include command registry invariant");
  assertEqual(parsed.nextGateCiHandoff.commandRegistryInvariantField, "nextGateCiHandoff.commandRegistryInvariant", "JSON CI handoff should include command registry invariant field alias");
  assertEqual(parsed.nextGateCiHandoff.commandsField, "nextGateCiHandoff.commands", "JSON CI handoff should include commands field alias");
  assertEqual(parsed.nextGateCiHandoff.watchFieldsField, "nextGateCiHandoff.watchFields", "JSON CI handoff should include watch fields alias");
  assertEqual(parsed.nextGateCiHandoff.watchFieldCount, 3, "JSON CI handoff should include watch field count");
  assertEqual(parsed.nextGateCiHandoff.watchFieldCountField, "nextGateCiHandoff.watchFieldCount", "JSON CI handoff should include watch field count alias");
  assertArrayIncludes(parsed.nextGateCiHandoff.watchFields, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "JSON CI handoff should include migration watch field");
  assertArrayIncludes(parsed.nextGateCiHandoff.commands, "npm run db:check -- --json", "JSON CI handoff should include db JSON command");
  assertEqual(parsed.nextGateCiHandoff.transitionPlanField, "nextGateTransitionPlan", "JSON CI handoff should include transition plan field");
  assertEqual(parsed.nextGateCiHandoff.readinessField, "nextGateReadiness", "JSON CI handoff should include readiness field");
  assertObject(parsed.nextGateCiHandoff.passCriteria, "JSON CI handoff should include pass criteria");
  assertEqual(parsed.nextGateCiHandoff.passCriteriaField, "nextGateCiHandoff.passCriteria", "JSON CI handoff should include pass criteria field alias");
  assertEqual(parsed.nextGateCiHandoff.passCriteriaCount, 3, "JSON CI handoff should include pass criteria count");
  assertEqual(parsed.nextGateCiHandoff.passCriteriaCountField, "nextGateCiHandoff.passCriteriaCount", "JSON CI handoff should include pass criteria count field alias");
  assertEqual(parsed.nextGateCiHandoff.passCriteria.migrationStatus, "database_read_parity", "JSON CI handoff should include migration pass criteria");
  assertEqual(parsed.nextGateCiHandoff.passCriteria.databaseUrlStatus, "valid", "JSON CI handoff should include database URL status pass criteria");
  assertArrayIncludes(parsed.nextGateCiHandoff.passCriteria.databaseUrlProtocol, "postgresql", "JSON CI handoff should include database URL protocol pass criteria");
  assertObject(parsed.nextGateCiHandoff.failureCodes, "JSON CI handoff should include failure codes");
  assertEqual(parsed.nextGateCiHandoff.failureCodesField, "nextGateCiHandoff.failureCodes", "JSON CI handoff should include failure codes alias");
  assertEqual(parsed.nextGateCiHandoff.failureCodeCount, 3, "JSON CI handoff should include failure code count");
  assertEqual(parsed.nextGateCiHandoff.failureCodeCountField, "nextGateCiHandoff.failureCodeCount", "JSON CI handoff should include failure code count field alias");
  assertEqual(parsed.nextGateCiHandoff.failureCodes.migrationGuard, "TM_COMMAND_NOT_SCAFFOLDED", "JSON CI handoff should include migration guard failure code");
  assertEqual(parsed.nextGateCiHandoff.failureCodes.dbMatrixUnknownField, "TM_DB_MATRIX_UNKNOWN_FIELD", "JSON CI handoff should include DB matrix unknown field code");
  assertEqual(parsed.nextGateCiHandoff.failureCodes.statusFieldMissing, "TM_GATE0_STATUS_FIELD_MISSING", "JSON CI handoff should include status field missing code");
  assertObject(parsed.nextGateCiHandoff.evidenceDocs, "JSON CI handoff should include evidence docs");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocsField, "nextGateCiHandoff.evidenceDocs", "JSON CI handoff should include evidence docs alias");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocCount, 3, "JSON CI handoff should include evidence doc count");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocCountField, "nextGateCiHandoff.evidenceDocCount", "JSON CI handoff should include evidence doc count field alias");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocs.nextGate, "docs/dev/GATE1_PERSISTENCE.md", "JSON CI handoff should include next gate doc");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocs.dbConstraints, "docs/dev/DB_CONSTRAINTS.md", "JSON CI handoff should include DB constraints doc");
  assertEqual(parsed.nextGateCiHandoff.evidenceDocs.status, "docs/dev/GATE0_STATUS.md", "JSON CI handoff should include status doc");
  assertObject(parsed.nextGateCiHandoff.assertions, "JSON CI handoff should include assertions");
  assertEqual(parsed.nextGateCiHandoff.assertionsField, "nextGateCiHandoff.assertions", "JSON CI handoff should include assertions field alias");
  assertEqual(parsed.nextGateCiHandoff.assertionCount, 3, "JSON CI handoff should include assertion count");
  assertEqual(parsed.nextGateCiHandoff.assertionCountField, "nextGateCiHandoff.assertionCount", "JSON CI handoff should include assertion count field alias");
  assertEqual(parsed.nextGateCiHandoff.assertions.migrationStatus.command, "npm run db:check -- --field migrationStatus", "JSON CI handoff should include migration assertion command");
  assertEqual(parsed.nextGateCiHandoff.assertions.migrationStatus.expected, "database_read_parity", "JSON CI handoff should include migration assertion expected value");
  assertEqual(parsed.nextGateCiHandoff.assertions.databaseUrlStatus.expected, "valid", "JSON CI handoff should include database URL status assertion expected value");
  assertArrayIncludes(parsed.nextGateCiHandoff.assertions.databaseUrlProtocol.expected, "postgresql", "JSON CI handoff should include database URL protocol assertion expected value");
  assertObject(parsed.nextGateCiHandoff.readyWhen, "JSON CI handoff should include ready-when summary");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.status, "all_assertions_pass", "JSON CI handoff should include ready status");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.summary, "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "JSON CI handoff should include ready summary");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.statusField, "nextGateCiHandoff.readyWhen.status", "JSON CI handoff should include ready status field alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.summaryField, "nextGateCiHandoff.readyWhen.summary", "JSON CI handoff should include ready summary field alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldsField, "nextGateCiHandoff.readyWhen.requiredFields", "JSON CI handoff should include ready required fields alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandsField, "nextGateCiHandoff.readyWhen.commands", "JSON CI handoff should include ready commands alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldsField, "nextGateCiHandoff.readyWhen.reportFields", "JSON CI handoff should include ready report fields alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.assertionCount, 3, "JSON CI handoff should include ready assertion count");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.assertionCountField, "nextGateCiHandoff.readyWhen.assertionCount", "JSON CI handoff should include ready assertion count alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldCount, 3, "JSON CI handoff should include ready required field count");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldCountField, "nextGateCiHandoff.readyWhen.requiredFieldCount", "JSON CI handoff should include ready required field count alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldLastIndex, 2, "JSON CI handoff should include ready required field last index");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldLastIndexField, "nextGateCiHandoff.readyWhen.requiredFieldLastIndex", "JSON CI handoff should include ready required field last index alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus, "consistent", "JSON CI handoff should include ready required field registry status");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField, "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus", "JSON CI handoff should include ready required field registry status alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant, "count=3,lastIndex=2", "JSON CI handoff should include ready required field registry invariant");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField, "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant", "JSON CI handoff should include ready required field registry invariant alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldCount, 22, "JSON CI handoff should include ready report field count");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldCountField, "nextGateCiHandoff.readyWhen.reportFieldCount", "JSON CI handoff should include ready report field count alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldLastIndex, 21, "JSON CI handoff should include ready report field last index");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldLastIndexField, "nextGateCiHandoff.readyWhen.reportFieldLastIndex", "JSON CI handoff should include ready report field last index alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldRegistryStatus, "consistent", "JSON CI handoff should include ready report field registry status");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField, "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus", "JSON CI handoff should include ready report field registry status alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant, "count=22,lastIndex=21", "JSON CI handoff should include ready report field registry invariant");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField, "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant", "JSON CI handoff should include ready report field registry invariant alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldFirst, "nextGateCiHandoff.readyWhen.status", "JSON CI handoff should include ready first report field");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldFirstField, "nextGateCiHandoff.readyWhen.reportFieldFirst", "JSON CI handoff should include ready first report field alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldLast, "stillNotDone", "JSON CI handoff should include ready last report field");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldLastField, "nextGateCiHandoff.readyWhen.reportFieldLast", "JSON CI handoff should include ready last report field alias");
  assertObject(parsed.nextGateCiHandoff.readyWhen.reportFieldEndpoints, "JSON CI handoff should include ready report field endpoints object");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldEndpoints.first, "nextGateCiHandoff.readyWhen.status", "JSON CI handoff should include ready report field endpoint first");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldEndpoints.last, "stillNotDone", "JSON CI handoff should include ready report field endpoint last");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldEndpointsField, "nextGateCiHandoff.readyWhen.reportFieldEndpoints", "JSON CI handoff should include ready report field endpoints alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldSummary, "22 report fields, first=nextGateCiHandoff.readyWhen.status, last=stillNotDone", "JSON CI handoff should include ready report field summary");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportFieldSummaryField, "nextGateCiHandoff.readyWhen.reportFieldSummary", "JSON CI handoff should include ready report field summary alias");
  assertObject(parsed.nextGateCiHandoff.readyWhen.reportValues, "JSON CI handoff should include ready report values object");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValuesField, "nextGateCiHandoff.readyWhen.reportValues", "JSON CI handoff should include ready report values field alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueCount, 25, "JSON CI handoff should include ready report value count");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueCountField, "nextGateCiHandoff.readyWhen.reportValueCount", "JSON CI handoff should include ready report value count alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueLastIndex, 24, "JSON CI handoff should include ready report value last index");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueLastIndexField, "nextGateCiHandoff.readyWhen.reportValueLastIndex", "JSON CI handoff should include ready report value last index alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueFirst, "status", "JSON CI handoff should include first ready report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueLast, "remainingBlockersSummary", "JSON CI handoff should include last ready report value key");
  assertObject(parsed.nextGateCiHandoff.readyWhen.reportValueEndpoints, "JSON CI handoff should include ready report value endpoints object");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueEndpointsField, "nextGateCiHandoff.readyWhen.reportValueEndpoints", "JSON CI handoff should include ready report value endpoints alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueEndpoints.first, "status", "JSON CI handoff should include ready report value endpoint first");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueEndpoints.last, "remainingBlockersSummary", "JSON CI handoff should include ready report value endpoint last");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueEndpointSummary, "first=status, last=remainingBlockersSummary", "JSON CI handoff should include ready report value endpoint summary");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField, "nextGateCiHandoff.readyWhen.reportValueEndpointSummary", "JSON CI handoff should include ready report value endpoint summary alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueRegistryStatus, "consistent", "JSON CI handoff should include ready report value registry status");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueRegistryInvariant, "count=25,lastIndex=24", "JSON CI handoff should include ready report value registry invariant");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueSummary, "25 values, first=status, last=remainingBlockersSummary", "JSON CI handoff should include ready report value summary");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueSummaryField, "nextGateCiHandoff.readyWhen.reportValueSummary", "JSON CI handoff should include ready report value summary alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeysField, "nextGateCiHandoff.readyWhen.reportValueKeys", "JSON CI handoff should include ready report value keys field alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[0], "status", "JSON CI handoff should include first ready report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[11], "rollbackCommandFirst", "JSON CI handoff should include rollback command first report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[13], "rollbackCommandEndpointSummary", "JSON CI handoff should include rollback command endpoint summary report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[19], "prismaScaffoldStatusSummary", "JSON CI handoff should include Prisma scaffold status ready report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[20], "productionGateOrderDetailsSummary", "JSON CI handoff should include production gate summary report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[21], "productionBlockerCount", "JSON CI handoff should include production blocker count report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[22], "progressPercent", "JSON CI handoff should include progress percent report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[23], "progressBasisSummary", "JSON CI handoff should include progress basis summary report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValueKeys[24], "remainingBlockersSummary", "JSON CI handoff should include last ready report value key");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.status, "all_assertions_pass", "JSON CI handoff should include ready status report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff should include rollback command last report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary, "first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff should include rollback command endpoint summary report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.prismaScaffoldStatusSummary, "schema=true, migrations=true, migrationStatus=scaffolded", "JSON CI handoff should include Prisma scaffold status report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary, "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "JSON CI handoff should include production gate summary report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount, 5, "JSON CI handoff should include production blocker count report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.progressPercent, 38, "JSON CI handoff should include progress percent report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary, "3/8 completed, 5 remaining, 38%", "JSON CI handoff should include progress basis summary report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary, "Real auth/provider/storage integrations. | Production backend persistence. | AWS CI/deploy pipeline. | Formal Figma/DESIGN.md source of truth. | App store/release build signing.", "JSON CI handoff should include remaining blockers summary report value");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandCount, 3, "JSON CI handoff should include ready command count");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandCountField, "nextGateCiHandoff.readyWhen.commandCount", "JSON CI handoff should include ready command count alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandLastIndex, 2, "JSON CI handoff should include ready command last index");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandLastIndexField, "nextGateCiHandoff.readyWhen.commandLastIndex", "JSON CI handoff should include ready command last index alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandRegistryStatus, "consistent", "JSON CI handoff should include ready command registry status");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandRegistryStatusField, "nextGateCiHandoff.readyWhen.commandRegistryStatus", "JSON CI handoff should include ready command registry status alias");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandRegistryInvariant, "count=3,lastIndex=2", "JSON CI handoff should include ready command registry invariant");
  assertEqual(parsed.nextGateCiHandoff.readyWhen.commandRegistryInvariantField, "nextGateCiHandoff.readyWhen.commandRegistryInvariant", "JSON CI handoff should include ready command registry invariant alias");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.commands, "npm run db:check -- --field migrationStatus", "JSON CI handoff should include ready commands");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.requiredFields, "nextGateCiHandoff.assertions.migrationStatus.expected", "JSON CI handoff should include ready required fields");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.readyWhen.status", "JSON CI handoff should include ready report fields");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.mode", "JSON CI handoff should include rollback report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "productionBlockersSummary.gateOrderDetailsSummary", "JSON CI handoff should include production gate order summary report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.verificationCommand", "JSON CI handoff should include rollback verification report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.reportCommand", "JSON CI handoff should include rollback command report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.expectedMode", "JSON CI handoff should include rollback expected mode report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.summary", "JSON CI handoff should include rollback summary report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.summaryField", "JSON CI handoff should include rollback summary alias report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.modeField", "JSON CI handoff should include rollback mode alias report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.rollback.expectedModeField", "JSON CI handoff should include rollback expected mode alias report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.requiredChecksSource", "JSON CI handoff should include required checks source report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.requiredChecksParsed", "JSON CI handoff should include required checks parsed report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.failureCodeCount", "JSON CI handoff should include failure code count report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.evidenceDocCount", "JSON CI handoff should include evidence doc count report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateCiHandoff.requiredCheckCount", "JSON CI handoff should include required check count report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "nextGateDbMatrix.prismaScaffoldStatus.summary", "JSON CI handoff should include Prisma scaffold status report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "productionBlockersSummary.count", "JSON CI handoff should include production blocker count report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "progressPercent", "JSON CI handoff should include progress percent report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "progressBasis", "JSON CI handoff should include progress basis report field");
  assertArrayIncludes(parsed.nextGateCiHandoff.readyWhen.reportFields, "stillNotDone", "JSON CI handoff should include remaining blockers report field");
  assertObject(parsed.nextGateCiHandoff.rollback, "JSON CI handoff should include rollback object");
  assertEqual(parsed.nextGateCiHandoff.rollback.mode, "fixture", "JSON CI handoff rollback should target fixture mode");
  assertEqual(parsed.nextGateCiHandoff.rollback.modeField, "nextGateCiHandoff.rollback.mode", "JSON CI handoff rollback should include mode field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.expectedMode, "fixture", "JSON CI handoff rollback should include expected mode");
  assertEqual(parsed.nextGateCiHandoff.rollback.expectedModeField, "nextGateCiHandoff.rollback.expectedMode", "JSON CI handoff rollback should include expected mode field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.summary, "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "JSON CI handoff rollback should include summary");
  assertEqual(parsed.nextGateCiHandoff.rollback.summaryField, "nextGateCiHandoff.rollback.summary", "JSON CI handoff rollback should include summary field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.command, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI handoff rollback should include command");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandField, "nextGateCiHandoff.rollback.command", "JSON CI handoff rollback should include command field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandsField, "nextGateCiHandoff.rollback.commands", "JSON CI handoff rollback should include commands field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.verificationCommand, "npm run gate0:status -- --field persistenceModeDefault", "JSON CI handoff rollback should include verification command");
  assertEqual(parsed.nextGateCiHandoff.rollback.verificationCommandField, "nextGateCiHandoff.rollback.verificationCommand", "JSON CI handoff rollback should include verification command field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.reportCommand, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff rollback should include report command");
  assertEqual(parsed.nextGateCiHandoff.rollback.reportCommandField, "nextGateCiHandoff.rollback.reportCommand", "JSON CI handoff rollback should include report command field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandCount, 3, "JSON CI handoff rollback should include command count");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandCountField, "nextGateCiHandoff.rollback.commandCount", "JSON CI handoff rollback should include command count field alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandLastIndex, 2, "JSON CI handoff rollback should include command last index");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandLastIndexField, "nextGateCiHandoff.rollback.commandLastIndex", "JSON CI handoff rollback should include command last index alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandFirst, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI handoff rollback should include command first");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandFirstField, "nextGateCiHandoff.rollback.commandFirst", "JSON CI handoff rollback should include command first alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandLast, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff rollback should include command last");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandLastField, "nextGateCiHandoff.rollback.commandLast", "JSON CI handoff rollback should include command last alias");
  assertObject(parsed.nextGateCiHandoff.rollback.commandEndpoints, "JSON CI handoff rollback should include command endpoints");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandEndpointsField, "nextGateCiHandoff.rollback.commandEndpoints", "JSON CI handoff rollback should include command endpoints alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandEndpointSummary, "first=$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue, last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff rollback should include command endpoint summary");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandEndpointSummaryField, "nextGateCiHandoff.rollback.commandEndpointSummary", "JSON CI handoff rollback should include command endpoint summary alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandRegistryStatus, "consistent", "JSON CI handoff rollback should include command registry status");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandRegistryStatusField, "nextGateCiHandoff.rollback.commandRegistryStatus", "JSON CI handoff rollback should include command registry status alias");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandRegistryInvariant, "count=3,lastIndex=2", "JSON CI handoff rollback should include command registry invariant");
  assertEqual(parsed.nextGateCiHandoff.rollback.commandRegistryInvariantField, "nextGateCiHandoff.rollback.commandRegistryInvariant", "JSON CI handoff rollback should include command registry invariant alias");
  assertArrayIncludes(parsed.nextGateCiHandoff.rollback.commands, "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "JSON CI handoff rollback should include rollback command list");
  assertArrayIncludes(parsed.nextGateCiHandoff.rollback.commands, "npm run gate0:status -- --field persistenceModeDefault", "JSON CI handoff rollback should include verification command list");
  assertArrayIncludes(parsed.nextGateCiHandoff.rollback.commands, "npm run gate0:status -- --field nextGateCiHandoff.rollback", "JSON CI handoff rollback should include report command list");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check", "JSON should include db check in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --json", "JSON should include db check JSON in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --field migrationStatus", "JSON should include migration status in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --field databaseUrlStatus", "JSON should include database URL status in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --field databaseUrlProtocol", "JSON should include database URL protocol in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run not-scaffolded:test", "JSON should include not-scaffolded test in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "node scripts/not-scaffolded.mjs --help", "JSON should include not-scaffolded help in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm test", "JSON should include test in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run privacy:test", "JSON should include privacy check in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run errors:check", "JSON should include error check in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --field prismaSchemaPresent", "JSON should include doc-defined Prisma schema check in next gate required checks");
  assertArrayIncludes(parsed.nextGateRequiredChecks, "npm run db:check -- --field databaseUrlPresent", "JSON should include doc-defined database URL present check in next gate required checks");

  const currentStatusField = await runStatus(["--field", "currentStatus"]);
  assertExit(currentStatusField, 0, "gate0 status field should pass");
  assertEqual(currentStatusField.stdout.trim(), "executable vertical slice, production-incomplete.", "field output should include current status only");

  const currentStatusAliasField = await runStatus(["--field", "currentStatusField"]);
  assertExit(currentStatusAliasField, 0, "gate0 status current status alias field should pass");
  assertEqual(currentStatusAliasField.stdout.trim(), "currentStatus", "current status alias field should include top-level path");

  const currentStatusSummaryField = await runStatus(["--field", "currentStatusSummary"]);
  assertExit(currentStatusSummaryField, 0, "gate0 status current status summary field should pass");
  assertEqual(currentStatusSummaryField.stdout.trim(), "Gate 0 status: executable vertical slice, production-incomplete.", "current status summary field should include compact summary");

  const currentStatusSummaryAliasField = await runStatus(["--field", "currentStatusSummaryField"]);
  assertExit(currentStatusSummaryAliasField, 0, "gate0 status current status summary alias field should pass");
  assertEqual(currentStatusSummaryAliasField.stdout.trim(), "currentStatusSummary", "current status summary alias field should include top-level path");

  const progressField = await runStatus(["--field", "progressPercent"]);
  assertExit(progressField, 0, "gate0 status progress field should pass");
  assertEqual(progressField.stdout.trim(), "38", "progress field should include rounded percent");

  const progressBasisField = await runStatus(["--field", "progressBasis"]);
  assertExit(progressBasisField, 0, "gate0 status progress basis field should pass");
  assertIncludes(progressBasisField.stdout, "\"completedCount\": 3", "progress basis should include completed count");
  assertIncludes(progressBasisField.stdout, "\"remainingCount\": 5", "progress basis should include remaining count");

  const progressBasisCompletedCountField = await runStatus(["--field", "progressBasis.completedCount"]);
  assertExit(progressBasisCompletedCountField, 0, "gate0 status progress basis completed count field should pass");
  assertEqual(progressBasisCompletedCountField.stdout.trim(), "3", "progress basis completed count field should include completed count");

  const progressBasisRemainingCountField = await runStatus(["--field", "progressBasis.remainingCount"]);
  assertExit(progressBasisRemainingCountField, 0, "gate0 status progress basis remaining count field should pass");
  assertEqual(progressBasisRemainingCountField.stdout.trim(), "5", "progress basis remaining count field should include remaining count");

  const progressBasisTotalCountField = await runStatus(["--field", "progressBasis.totalCount"]);
  assertExit(progressBasisTotalCountField, 0, "gate0 status progress basis total count field should pass");
  assertEqual(progressBasisTotalCountField.stdout.trim(), "8", "progress basis total count field should include total count");

  const progressBasisPercentField = await runStatus(["--field", "progressBasis.percent"]);
  assertExit(progressBasisPercentField, 0, "gate0 status progress basis percent field should pass");
  assertEqual(progressBasisPercentField.stdout.trim(), "38", "progress basis percent field should include rounded percent");

  const progressBasisSummaryField = await runStatus(["--field", "progressBasisSummary"]);
  assertExit(progressBasisSummaryField, 0, "gate0 status progress basis summary field should pass");
  assertEqual(progressBasisSummaryField.stdout.trim(), "3/8 completed, 5 remaining, 38%", "progress basis summary field should include compact progress summary");

  const ciReadyStatusField = await runStatus(["--field", "ciReadyStatus"]);
  assertExit(ciReadyStatusField, 0, "gate0 status CI ready status field should pass");
  assertEqual(ciReadyStatusField.stdout.trim(), "all_assertions_pass", "CI ready status field should include compact ready status");

  const ciReadySummaryField = await runStatus(["--field", "ciReadySummary"]);
  assertExit(ciReadySummaryField, 0, "gate0 status CI ready summary field should pass");
  assertEqual(ciReadySummaryField.stdout.trim(), "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "CI ready summary field should include compact ready summary");

  const ciReadyReportValuesField = await runStatus(["--field", "ciReadyReportValues"]);
  assertExit(ciReadyReportValuesField, 0, "gate0 status CI ready report values field should pass");
  assertIncludes(ciReadyReportValuesField.stdout, "\"status\": \"all_assertions_pass\"", "CI ready report values field should include ready status");
  assertIncludes(ciReadyReportValuesField.stdout, "\"productionBlockerCount\": 5", "CI ready report values field should include blocker count");

  const ciReadyReportValueKeysField = await runStatus(["--field", "ciReadyReportValueKeys"]);
  assertExit(ciReadyReportValueKeysField, 0, "gate0 status CI ready report value keys field should pass");
  assertIncludes(ciReadyReportValueKeysField.stdout, "\"status\"", "CI ready report value keys field should include status");
  assertIncludes(ciReadyReportValueKeysField.stdout, "\"remainingBlockersSummary\"", "CI ready report value keys field should include remaining blockers summary");

  const ciReadyReportValueCountField = await runStatus(["--field", "ciReadyReportValueCount"]);
  assertExit(ciReadyReportValueCountField, 0, "gate0 status CI ready report value count field should pass");
  assertEqual(ciReadyReportValueCountField.stdout.trim(), "25", "CI ready report value count field should include count");

  const ciReadyReportValueSummaryField = await runStatus(["--field", "ciReadyReportValueSummary"]);
  assertExit(ciReadyReportValueSummaryField, 0, "gate0 status CI ready report value summary field should pass");
  assertEqual(ciReadyReportValueSummaryField.stdout.trim(), "25 values, first=status, last=remainingBlockersSummary", "CI ready report value summary field should include compact summary");

  const ciReadyReportValueEndpointsField = await runStatus(["--field", "ciReadyReportValueEndpoints"]);
  assertExit(ciReadyReportValueEndpointsField, 0, "gate0 status CI ready report value endpoints field should pass");
  assertIncludes(ciReadyReportValueEndpointsField.stdout, "\"first\": \"status\"", "CI ready report value endpoints field should include first key");
  assertIncludes(ciReadyReportValueEndpointsField.stdout, "\"last\": \"remainingBlockersSummary\"", "CI ready report value endpoints field should include last key");

  const ciReadyReportValueEndpointSummaryField = await runStatus(["--field", "ciReadyReportValueEndpointSummary"]);
  assertExit(ciReadyReportValueEndpointSummaryField, 0, "gate0 status CI ready report value endpoint summary field should pass");
  assertEqual(ciReadyReportValueEndpointSummaryField.stdout.trim(), "first=status, last=remainingBlockersSummary", "CI ready report value endpoint summary field should include compact endpoint summary");

  const ciReadyReportValueRegistryStatusField = await runStatus(["--field", "ciReadyReportValueRegistryStatus"]);
  assertExit(ciReadyReportValueRegistryStatusField, 0, "gate0 status CI ready report value registry status field should pass");
  assertEqual(ciReadyReportValueRegistryStatusField.stdout.trim(), "consistent", "CI ready report value registry status field should include status");

  const ciReadyReportValueRegistryInvariantField = await runStatus(["--field", "ciReadyReportValueRegistryInvariant"]);
  assertExit(ciReadyReportValueRegistryInvariantField, 0, "gate0 status CI ready report value registry invariant field should pass");
  assertEqual(ciReadyReportValueRegistryInvariantField.stdout.trim(), "count=25,lastIndex=24", "CI ready report value registry invariant field should include invariant");

  const ciReadyReportValueLastIndexField = await runStatus(["--field", "ciReadyReportValueLastIndex"]);
  assertExit(ciReadyReportValueLastIndexField, 0, "gate0 status CI ready report value last index field should pass");
  assertEqual(ciReadyReportValueLastIndexField.stdout.trim(), "24", "CI ready report value last index field should include last index");

  const ciReadyReportValueFirstField = await runStatus(["--field", "ciReadyReportValueFirst"]);
  assertExit(ciReadyReportValueFirstField, 0, "gate0 status CI ready report value first field should pass");
  assertEqual(ciReadyReportValueFirstField.stdout.trim(), "status", "CI ready report value first field should include first key");

  const ciReadyReportValueLastField = await runStatus(["--field", "ciReadyReportValueLast"]);
  assertExit(ciReadyReportValueLastField, 0, "gate0 status CI ready report value last field should pass");
  assertEqual(ciReadyReportValueLastField.stdout.trim(), "remainingBlockersSummary", "CI ready report value last field should include last key");

  const ciReadyReportValueRollbackCommandLastField = await runStatus(["--field", "ciReadyReportValueRollbackCommandLast"]);
  assertExit(ciReadyReportValueRollbackCommandLastField, 0, "gate0 status CI ready report value rollback command last field should pass");
  assertEqual(ciReadyReportValueRollbackCommandLastField.stdout.trim(), "npm run gate0:status -- --field nextGateCiHandoff.rollback", "CI ready report value rollback command last field should include command");

  const ciReadyReportValueRollbackCommandEndpointSummaryField = await runStatus(["--field", "ciReadyReportValueRollbackCommandEndpointSummary"]);
  assertExit(ciReadyReportValueRollbackCommandEndpointSummaryField, 0, "gate0 status CI ready report value rollback command endpoint summary field should pass");
  assertIncludes(ciReadyReportValueRollbackCommandEndpointSummaryField.stdout, "last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "CI ready report value rollback endpoint summary field should include last command");

  const ciReadyReportValueRollbackCommandLastAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandLastField"]);
  assertExit(ciReadyReportValueRollbackCommandLastAliasField, 0, "gate0 status CI ready report value rollback command last alias field should pass");
  assertEqual(ciReadyReportValueRollbackCommandLastAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast", "CI ready report value rollback command last alias field should include canonical path");

  const ciReadyReportValueRollbackCommandEndpointSummaryAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandEndpointSummaryField"]);
  assertExit(ciReadyReportValueRollbackCommandEndpointSummaryAliasField, 0, "gate0 status CI ready report value rollback endpoint summary alias field should pass");
  assertEqual(ciReadyReportValueRollbackCommandEndpointSummaryAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "CI ready report value rollback endpoint summary alias field should include canonical path");

  const ciReadyReportValueRollbackCommandFieldCountField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldCount"]);
  assertExit(ciReadyReportValueRollbackCommandFieldCountField, 0, "gate0 status CI ready report value rollback command field count should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldCountField.stdout.trim(), "3", "CI ready report value rollback command field count should include count");

  const ciReadyReportValueRollbackCommandFieldSummaryField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldSummary"]);
  assertExit(ciReadyReportValueRollbackCommandFieldSummaryField, 0, "gate0 status CI ready report value rollback command field summary should pass");
  assertIncludes(ciReadyReportValueRollbackCommandFieldSummaryField.stdout, "last=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "CI ready report value rollback command field summary should include last field");

  const ciReadyReportValueRollbackCommandFieldsAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldsField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldsAliasField, 0, "gate0 status CI ready report value rollback command fields alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldsAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFields", "CI ready report value rollback command fields alias should include top-level path");

  const ciReadyReportValueRollbackCommandField1Field = await runStatus(["--field", "ciReadyReportValueRollbackCommandField1"]);
  assertExit(ciReadyReportValueRollbackCommandField1Field, 0, "gate0 status CI ready report value rollback command field 1 should pass");
  assertEqual(ciReadyReportValueRollbackCommandField1Field.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandLast", "CI ready report value rollback command field 1 should include last command field");

  const ciReadyReportValueRollbackCommandField2AliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandField2Field"]);
  assertExit(ciReadyReportValueRollbackCommandField2AliasField, 0, "gate0 status CI ready report value rollback command field 2 alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandField2AliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFields.2", "CI ready report value rollback command field 2 alias should include indexed path");

  const ciReadyReportValueRollbackCommandFieldIndexSummaryField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldIndexSummary"]);
  assertExit(ciReadyReportValueRollbackCommandFieldIndexSummaryField, 0, "gate0 status CI ready report value rollback command field index summary should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldIndexSummaryField.stdout.trim(), "0,1,2", "CI ready report value rollback command field index summary should include compact indexes");

  const ciReadyReportValueRollbackCommandFieldIndexCountField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldIndexCount"]);
  assertExit(ciReadyReportValueRollbackCommandFieldIndexCountField, 0, "gate0 status CI ready report value rollback command field index count should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldIndexCountField.stdout.trim(), "3", "CI ready report value rollback command field index count should include count");

  const ciReadyReportValueRollbackCommandFieldIndexesAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldIndexesField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldIndexesAliasField, 0, "gate0 status CI ready report value rollback command field indexes alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldIndexesAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldIndexes", "CI ready report value rollback command field indexes alias should include top-level path");

  const ciReadyReportValueRollbackCommandFieldIndexCountAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldIndexCountField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldIndexCountAliasField, 0, "gate0 status CI ready report value rollback command field index count alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldIndexCountAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldIndexCount", "CI ready report value rollback command field index count alias should include top-level path");

  const ciReadyReportValueRollbackCommandFieldIndexSummaryAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldIndexSummaryField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldIndexSummaryAliasField, 0, "gate0 status CI ready report value rollback command field index summary alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldIndexSummaryAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldIndexSummary", "CI ready report value rollback command field index summary alias should include top-level path");

  const ciReadyReportValueRollbackCommandFieldEndpointSummaryField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldEndpointSummary"]);
  assertExit(ciReadyReportValueRollbackCommandFieldEndpointSummaryField, 0, "gate0 status CI ready report value rollback command field endpoint summary should pass");
  assertIncludes(ciReadyReportValueRollbackCommandFieldEndpointSummaryField.stdout, "last=nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "CI ready report value rollback command field endpoint summary should include last field");

  const ciReadyReportValueRollbackCommandFieldEndpointsAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldEndpointsField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldEndpointsAliasField, 0, "gate0 status CI ready report value rollback command field endpoints alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldEndpointsAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldEndpoints", "CI ready report value rollback command field endpoints alias should include top-level path");

  const ciReadyReportValueRollbackCommandFieldRegistryInvariantField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldRegistryInvariant"]);
  assertExit(ciReadyReportValueRollbackCommandFieldRegistryInvariantField, 0, "gate0 status CI ready report value rollback command field registry invariant should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "CI ready report value rollback command field registry invariant should include invariant");

  const ciReadyReportValueRollbackCommandFieldRegistryStatusAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldRegistryStatusField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldRegistryStatusAliasField, 0, "gate0 status CI ready report value rollback command field registry status alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldRegistryStatusAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldRegistryStatus", "CI ready report value rollback command field registry status alias should include top-level path");

  const ciReadyReportValueRollbackCommandFieldSummaryAliasField = await runStatus(["--field", "ciReadyReportValueRollbackCommandFieldSummaryField"]);
  assertExit(ciReadyReportValueRollbackCommandFieldSummaryAliasField, 0, "gate0 status CI ready report value rollback command field summary alias should pass");
  assertEqual(ciReadyReportValueRollbackCommandFieldSummaryAliasField.stdout.trim(), "ciReadyReportValueRollbackCommandFieldSummary", "CI ready report value rollback command field summary alias should include top-level path");

  const ciReadyReportValuesAliasField = await runStatus(["--field", "ciReadyReportValuesField"]);
  assertExit(ciReadyReportValuesAliasField, 0, "gate0 status CI ready report values alias field should pass");
  assertEqual(ciReadyReportValuesAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValues", "CI ready report values alias field should include canonical path");

  const ciReadyReportValueKeysAliasField = await runStatus(["--field", "ciReadyReportValueKeysField"]);
  assertExit(ciReadyReportValueKeysAliasField, 0, "gate0 status CI ready report value keys alias field should pass");
  assertEqual(ciReadyReportValueKeysAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueKeys", "CI ready report value keys alias field should include canonical path");

  const ciReadyReportValueEndpointsAliasField = await runStatus(["--field", "ciReadyReportValueEndpointsField"]);
  assertExit(ciReadyReportValueEndpointsAliasField, 0, "gate0 status CI ready report value endpoints alias field should pass");
  assertEqual(ciReadyReportValueEndpointsAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueEndpoints", "CI ready report value endpoints alias field should include canonical path");

  const ciReadyReportValueRegistryInvariantAliasField = await runStatus(["--field", "ciReadyReportValueRegistryInvariantField"]);
  assertExit(ciReadyReportValueRegistryInvariantAliasField, 0, "gate0 status CI ready report value registry invariant alias field should pass");
  assertEqual(ciReadyReportValueRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant", "CI ready report value registry invariant alias field should include canonical path");

  const ciReadyRequiredFieldsField = await runStatus(["--field", "ciReadyRequiredFields"]);
  assertExit(ciReadyRequiredFieldsField, 0, "gate0 status CI ready required fields field should pass");
  assertIncludes(ciReadyRequiredFieldsField.stdout, "nextGateCiHandoff.assertions.migrationStatus.expected", "CI ready required fields field should include migration assertion");

  const ciReadyRequiredFieldCountField = await runStatus(["--field", "ciReadyRequiredFieldCount"]);
  assertExit(ciReadyRequiredFieldCountField, 0, "gate0 status CI ready required field count field should pass");
  assertEqual(ciReadyRequiredFieldCountField.stdout.trim(), "3", "CI ready required field count field should include count");

  const ciReadyCommandsField = await runStatus(["--field", "ciReadyCommands"]);
  assertExit(ciReadyCommandsField, 0, "gate0 status CI ready commands field should pass");
  assertIncludes(ciReadyCommandsField.stdout, "npm run db:check -- --field migrationStatus", "CI ready commands field should include migration status command");

  const ciReadyCommandCountField = await runStatus(["--field", "ciReadyCommandCount"]);
  assertExit(ciReadyCommandCountField, 0, "gate0 status CI ready command count field should pass");
  assertEqual(ciReadyCommandCountField.stdout.trim(), "3", "CI ready command count field should include count");

  const ciAssertionsField = await runStatus(["--field", "ciAssertions"]);
  assertExit(ciAssertionsField, 0, "gate0 status CI assertions field should pass");
  assertIncludes(ciAssertionsField.stdout, "\"migrationStatus\"", "CI assertions field should include migration assertion");

  const ciAssertionCountField = await runStatus(["--field", "ciAssertionCount"]);
  assertExit(ciAssertionCountField, 0, "gate0 status CI assertion count field should pass");
  assertEqual(ciAssertionCountField.stdout.trim(), "3", "CI assertion count field should include count");

  const ciAssertionMigrationStatusExpectedField = await runStatus(["--field", "ciAssertionMigrationStatusExpected"]);
  assertExit(ciAssertionMigrationStatusExpectedField, 0, "gate0 status CI assertion migration status expected field should pass");
  assertEqual(ciAssertionMigrationStatusExpectedField.stdout.trim(), "database_read_parity", "CI assertion migration status expected field should include expected value");

  const ciAssertionDatabaseUrlProtocolExpectedField = await runStatus(["--field", "ciAssertionDatabaseUrlProtocolExpected"]);
  assertExit(ciAssertionDatabaseUrlProtocolExpectedField, 0, "gate0 status CI assertion database URL protocol expected field should pass");
  assertIncludes(ciAssertionDatabaseUrlProtocolExpectedField.stdout, "\"postgresql\"", "CI assertion database URL protocol expected field should include postgresql");

  const ciPassCriteriaField = await runStatus(["--field", "ciPassCriteria"]);
  assertExit(ciPassCriteriaField, 0, "gate0 status CI pass criteria field should pass");
  assertIncludes(ciPassCriteriaField.stdout, "\"migrationStatus\": \"database_read_parity\"", "CI pass criteria field should include migration status");

  const ciPassCriteriaCountField = await runStatus(["--field", "ciPassCriteriaCount"]);
  assertExit(ciPassCriteriaCountField, 0, "gate0 status CI pass criteria count field should pass");
  assertEqual(ciPassCriteriaCountField.stdout.trim(), "3", "CI pass criteria count field should include count");

  const nextGateCiHandoffPassCriteriaSummaryField = await runStatus(["--field", "nextGateCiHandoffPassCriteriaSummary"]);
  assertExit(nextGateCiHandoffPassCriteriaSummaryField, 0, "gate0 status next gate CI handoff pass criteria summary should pass");
  assertEqual(nextGateCiHandoffPassCriteriaSummaryField.stdout.trim(), "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "next gate CI handoff pass criteria summary should include compact criteria");

  const nextGateCiHandoffPassCriteriaSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffPassCriteriaSummaryField"]);
  assertExit(nextGateCiHandoffPassCriteriaSummaryAliasField, 0, "gate0 status next gate CI handoff pass criteria summary alias should pass");
  assertEqual(nextGateCiHandoffPassCriteriaSummaryAliasField.stdout.trim(), "nextGateCiHandoffPassCriteriaSummary", "next gate CI handoff pass criteria summary alias should include field name");

  const ciFailureCodesField = await runStatus(["--field", "ciFailureCodes"]);
  assertExit(ciFailureCodesField, 0, "gate0 status CI failure codes field should pass");
  assertIncludes(ciFailureCodesField.stdout, "TM_COMMAND_NOT_SCAFFOLDED", "CI failure codes field should include migration guard code");

  const ciFailureCodeCountField = await runStatus(["--field", "ciFailureCodeCount"]);
  assertExit(ciFailureCodeCountField, 0, "gate0 status CI failure code count field should pass");
  assertEqual(ciFailureCodeCountField.stdout.trim(), "3", "CI failure code count field should include count");

  const nextGateCiHandoffFailureCodeSummaryField = await runStatus(["--field", "nextGateCiHandoffFailureCodeSummary"]);
  assertExit(nextGateCiHandoffFailureCodeSummaryField, 0, "gate0 status next gate CI handoff failure code summary should pass");
  assertEqual(nextGateCiHandoffFailureCodeSummaryField.stdout.trim(), "migrationGuard=TM_COMMAND_NOT_SCAFFOLDED, dbMatrixUnknownField=TM_DB_MATRIX_UNKNOWN_FIELD, statusFieldMissing=TM_GATE0_STATUS_FIELD_MISSING", "next gate CI handoff failure code summary should include compact codes");

  const nextGateCiHandoffFailureCodeSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffFailureCodeSummaryField"]);
  assertExit(nextGateCiHandoffFailureCodeSummaryAliasField, 0, "gate0 status next gate CI handoff failure code summary alias should pass");
  assertEqual(nextGateCiHandoffFailureCodeSummaryAliasField.stdout.trim(), "nextGateCiHandoffFailureCodeSummary", "next gate CI handoff failure code summary alias should include field name");

  const ciEvidenceDocsField = await runStatus(["--field", "ciEvidenceDocs"]);
  assertExit(ciEvidenceDocsField, 0, "gate0 status CI evidence docs field should pass");
  assertIncludes(ciEvidenceDocsField.stdout, "docs/dev/GATE1_PERSISTENCE.md", "CI evidence docs field should include Gate 1 persistence doc");

  const ciEvidenceDocCountField = await runStatus(["--field", "ciEvidenceDocCount"]);
  assertExit(ciEvidenceDocCountField, 0, "gate0 status CI evidence doc count field should pass");
  assertEqual(ciEvidenceDocCountField.stdout.trim(), "3", "CI evidence doc count field should include count");

  const nextGateCiHandoffEvidenceDocSummaryField = await runStatus(["--field", "nextGateCiHandoffEvidenceDocSummary"]);
  assertExit(nextGateCiHandoffEvidenceDocSummaryField, 0, "gate0 status next gate CI handoff evidence doc summary should pass");
  assertEqual(nextGateCiHandoffEvidenceDocSummaryField.stdout.trim(), "nextGate=docs/dev/GATE1_PERSISTENCE.md, dbConstraints=docs/dev/DB_CONSTRAINTS.md, status=docs/dev/GATE0_STATUS.md", "next gate CI handoff evidence doc summary should include compact docs");

  const nextGateCiHandoffEvidenceDocSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffEvidenceDocSummaryField"]);
  assertExit(nextGateCiHandoffEvidenceDocSummaryAliasField, 0, "gate0 status next gate CI handoff evidence doc summary alias should pass");
  assertEqual(nextGateCiHandoffEvidenceDocSummaryAliasField.stdout.trim(), "nextGateCiHandoffEvidenceDocSummary", "next gate CI handoff evidence doc summary alias should include field name");

  const ciWatchFieldsField = await runStatus(["--field", "ciWatchFields"]);
  assertExit(ciWatchFieldsField, 0, "gate0 status CI watch fields field should pass");
  assertIncludes(ciWatchFieldsField.stdout, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "CI watch fields field should include migration status watch field");

  const ciWatchFieldCountField = await runStatus(["--field", "ciWatchFieldCount"]);
  assertExit(ciWatchFieldCountField, 0, "gate0 status CI watch field count field should pass");
  assertEqual(ciWatchFieldCountField.stdout.trim(), "3", "CI watch field count field should include count");

  const nextGateCiHandoffWatchFieldSummaryField = await runStatus(["--field", "nextGateCiHandoffWatchFieldSummary"]);
  assertExit(nextGateCiHandoffWatchFieldSummaryField, 0, "gate0 status next gate CI handoff watch field summary should pass");
  assertEqual(nextGateCiHandoffWatchFieldSummaryField.stdout.trim(), "migrationStatus=nextGateTransitionPlan.transitions.migrationStatus.nextExpected, databaseUrlStatus=nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected, databaseUrlProtocol=nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "next gate CI handoff watch field summary should include compact fields");

  const nextGateCiHandoffWatchFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffWatchFieldSummaryField"]);
  assertExit(nextGateCiHandoffWatchFieldSummaryAliasField, 0, "gate0 status next gate CI handoff watch field summary alias should pass");
  assertEqual(nextGateCiHandoffWatchFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoffWatchFieldSummary", "next gate CI handoff watch field summary alias should include field name");

  const ciRequiredCheckCountField = await runStatus(["--field", "ciRequiredCheckCount"]);
  assertExit(ciRequiredCheckCountField, 0, "gate0 status CI required check count field should pass");
  assertEqual(ciRequiredCheckCountField.stdout.trim(), "13", "CI required check count field should include count");

  const ciRequiredChecksSourceField = await runStatus(["--field", "ciRequiredChecksSource"]);
  assertExit(ciRequiredChecksSourceField, 0, "gate0 status CI required checks source field should pass");
  assertEqual(ciRequiredChecksSourceField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md#required-checks", "CI required checks source field should include source");

  const nextGateCiHandoffRequiredChecksSummaryField = await runStatus(["--field", "nextGateCiHandoffRequiredChecksSummary"]);
  assertExit(nextGateCiHandoffRequiredChecksSummaryField, 0, "gate0 status next gate CI handoff required checks summary should pass");
  assertEqual(nextGateCiHandoffRequiredChecksSummaryField.stdout.trim(), "count=13, source=docs/dev/GATE1_PERSISTENCE.md#required-checks, parsed=true", "next gate CI handoff required checks summary should include compact status");

  const nextGateCiHandoffRequiredChecksSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRequiredChecksSummaryField"]);
  assertExit(nextGateCiHandoffRequiredChecksSummaryAliasField, 0, "gate0 status next gate CI handoff required checks summary alias should pass");
  assertEqual(nextGateCiHandoffRequiredChecksSummaryAliasField.stdout.trim(), "nextGateCiHandoffRequiredChecksSummary", "next gate CI handoff required checks summary alias should include field name");

  const ciReadinessField = await runStatus(["--field", "ciReadiness"]);
  assertExit(ciReadinessField, 0, "gate0 status CI readiness field should pass");
  assertIncludes(ciReadinessField.stdout, "\"verifiedNowCount\": 10", "CI readiness field should include verified count");

  const ciTransitionPlanTransitionCountField = await runStatus(["--field", "ciTransitionPlanTransitionCount"]);
  assertExit(ciTransitionPlanTransitionCountField, 0, "gate0 status CI transition count field should pass");
  assertEqual(ciTransitionPlanTransitionCountField.stdout.trim(), "3", "CI transition count field should include count");

  const nextGateCiHandoffReadinessTransitionSummaryField = await runStatus(["--field", "nextGateCiHandoffReadinessTransitionSummary"]);
  assertExit(nextGateCiHandoffReadinessTransitionSummaryField, 0, "gate0 status next gate CI handoff readiness transition summary should pass");
  assertEqual(nextGateCiHandoffReadinessTransitionSummaryField.stdout.trim(), "verifiedNow=10, readinessTransitions=3, transitionPlan=3", "next gate CI handoff readiness transition summary should include compact counts");

  const nextGateCiHandoffReadinessTransitionSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffReadinessTransitionSummaryField"]);
  assertExit(nextGateCiHandoffReadinessTransitionSummaryAliasField, 0, "gate0 status next gate CI handoff readiness transition summary alias should pass");
  assertEqual(nextGateCiHandoffReadinessTransitionSummaryAliasField.stdout.trim(), "nextGateCiHandoffReadinessTransitionSummary", "next gate CI handoff readiness transition summary alias should include field name");

  const ciTransitionMigrationStatusNextExpectedField = await runStatus(["--field", "ciTransitionMigrationStatusNextExpected"]);
  assertExit(ciTransitionMigrationStatusNextExpectedField, 0, "gate0 status CI transition migration next expected field should pass");
  assertEqual(ciTransitionMigrationStatusNextExpectedField.stdout.trim(), "database_read_parity", "CI transition migration next expected field should include next expected value");

  const ciTransitionDatabaseUrlProtocolNextExpectedField = await runStatus(["--field", "ciTransitionDatabaseUrlProtocolNextExpected"]);
  assertExit(ciTransitionDatabaseUrlProtocolNextExpectedField, 0, "gate0 status CI transition database URL protocol next expected field should pass");
  assertIncludes(ciTransitionDatabaseUrlProtocolNextExpectedField.stdout, "\"postgresql\"", "CI transition database URL protocol next expected field should include postgresql");

  const nextGateCiHandoffTransitionExpectedSummaryField = await runStatus(["--field", "nextGateCiHandoffTransitionExpectedSummary"]);
  assertExit(nextGateCiHandoffTransitionExpectedSummaryField, 0, "gate0 status next gate CI handoff transition expected summary should pass");
  assertEqual(nextGateCiHandoffTransitionExpectedSummaryField.stdout.trim(), "migrationStatus=scaffolded->database_read_parity, databaseUrlStatus=missing->valid, databaseUrlProtocol=none->postgresql|postgres", "next gate CI handoff transition expected summary should include compact expected values");

  const nextGateCiHandoffTransitionExpectedSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffTransitionExpectedSummaryField"]);
  assertExit(nextGateCiHandoffTransitionExpectedSummaryAliasField, 0, "gate0 status next gate CI handoff transition expected summary alias should pass");
  assertEqual(nextGateCiHandoffTransitionExpectedSummaryAliasField.stdout.trim(), "nextGateCiHandoffTransitionExpectedSummary", "next gate CI handoff transition expected summary alias should include field name");

  const nextGateCiHandoffTransitionCommandSummaryField = await runStatus(["--field", "nextGateCiHandoffTransitionCommandSummary"]);
  assertExit(nextGateCiHandoffTransitionCommandSummaryField, 0, "gate0 status next gate CI handoff transition command summary should pass");
  assertEqual(nextGateCiHandoffTransitionCommandSummaryField.stdout.trim(), "migrationStatus=npm run db:check -- --field migrationStatus, databaseUrlStatus=npm run db:check -- --field databaseUrlStatus, databaseUrlProtocol=npm run db:check -- --field databaseUrlProtocol", "next gate CI handoff transition command summary should include compact commands");

  const nextGateCiHandoffTransitionCommandSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffTransitionCommandSummaryField"]);
  assertExit(nextGateCiHandoffTransitionCommandSummaryAliasField, 0, "gate0 status next gate CI handoff transition command summary alias should pass");
  assertEqual(nextGateCiHandoffTransitionCommandSummaryAliasField.stdout.trim(), "nextGateCiHandoffTransitionCommandSummary", "next gate CI handoff transition command summary alias should include field name");

  const ciTransitionOrderedStepSummaryField = await runStatus(["--field", "ciTransitionOrderedStepSummary"]);
  assertExit(ciTransitionOrderedStepSummaryField, 0, "gate0 status CI transition ordered step summary field should pass");
  assertEqual(ciTransitionOrderedStepSummaryField.stdout.trim(), "scaffold-prisma -> set-database-url -> verify-db-matrix", "CI transition ordered step summary field should include compact step list");

  const ciTransitionFirstStepIdField = await runStatus(["--field", "ciTransitionFirstStepId"]);
  assertExit(ciTransitionFirstStepIdField, 0, "gate0 status CI transition first step ID field should pass");
  assertEqual(ciTransitionFirstStepIdField.stdout.trim(), "scaffold-prisma", "CI transition first step ID field should include first step");

  const nextGateCiHandoffTransitionTargetSummaryField = await runStatus(["--field", "nextGateCiHandoffTransitionTargetSummary"]);
  assertExit(nextGateCiHandoffTransitionTargetSummaryField, 0, "gate0 status next gate CI handoff transition target summary should pass");
  assertEqual(nextGateCiHandoffTransitionTargetSummaryField.stdout.trim(), "scaffold-prisma=database_read_parity, set-database-url=valid postgresql|postgres DATABASE_URL, verify-db-matrix=all Gate 1 DB matrix fields pass", "next gate CI handoff transition target summary should include compact targets");

  const nextGateCiHandoffTransitionTargetSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffTransitionTargetSummaryField"]);
  assertExit(nextGateCiHandoffTransitionTargetSummaryAliasField, 0, "gate0 status next gate CI handoff transition target summary alias should pass");
  assertEqual(nextGateCiHandoffTransitionTargetSummaryAliasField.stdout.trim(), "nextGateCiHandoffTransitionTargetSummary", "next gate CI handoff transition target summary alias should include field name");

  const ciRollbackModeField = await runStatus(["--field", "ciRollbackMode"]);
  assertExit(ciRollbackModeField, 0, "gate0 status CI rollback mode field should pass");
  assertEqual(ciRollbackModeField.stdout.trim(), "fixture", "CI rollback mode field should include fixture");

  const ciRollbackModeAliasField = await runStatus(["--field", "ciRollbackModeField"]);
  assertExit(ciRollbackModeAliasField, 0, "gate0 status CI rollback mode alias field should pass");
  assertEqual(ciRollbackModeAliasField.stdout.trim(), "nextGateCiHandoff.rollback.mode", "CI rollback mode alias field should include canonical path");

  const nextGateCiHandoffRollbackModeTopField = await runStatus(["--field", "nextGateCiHandoffRollbackMode"]);
  assertExit(nextGateCiHandoffRollbackModeTopField, 0, "gate0 status next gate CI rollback mode top field should pass");
  assertEqual(nextGateCiHandoffRollbackModeTopField.stdout.trim(), "fixture", "next gate CI rollback mode top field should include fixture");

  const nextGateCiHandoffRollbackModeTopAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackModeField"]);
  assertExit(nextGateCiHandoffRollbackModeTopAliasField, 0, "gate0 status next gate CI rollback mode top alias field should pass");
  assertEqual(nextGateCiHandoffRollbackModeTopAliasField.stdout.trim(), "nextGateCiHandoff.rollback.mode", "next gate CI rollback mode top alias field should include nested field name");

  const nextGateCiHandoffRollbackModeSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackModeSummary"]);
  assertExit(nextGateCiHandoffRollbackModeSummaryField, 0, "gate0 status next gate CI rollback mode summary field should pass");
  assertEqual(nextGateCiHandoffRollbackModeSummaryField.stdout.trim(), "mode=fixture, expected=fixture", "next gate CI rollback mode summary field should include mode and expected mode");

  const nextGateCiHandoffRollbackModeSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackModeSummaryField"]);
  assertExit(nextGateCiHandoffRollbackModeSummaryAliasField, 0, "gate0 status next gate CI rollback mode summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackModeSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackModeSummary", "next gate CI rollback mode summary alias should include field name");

  const nextGateCiHandoffRollbackSummaryTopField = await runStatus(["--field", "nextGateCiHandoffRollbackSummary"]);
  assertExit(nextGateCiHandoffRollbackSummaryTopField, 0, "gate0 status next gate CI rollback summary top field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryTopField.stdout.trim(), "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "next gate CI rollback summary top field should include summary");

  const nextGateCiHandoffRollbackSummaryTopAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackSummaryField"]);
  assertExit(nextGateCiHandoffRollbackSummaryTopAliasField, 0, "gate0 status next gate CI rollback summary top alias field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryTopAliasField.stdout.trim(), "nextGateCiHandoff.rollback.summary", "next gate CI rollback summary top alias field should include nested field name");

  const nextGateCiHandoffRollbackTopSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackTopSummary"]);
  assertExit(nextGateCiHandoffRollbackTopSummaryField, 0, "gate0 status next gate CI rollback top summary field should pass");
  assertEqual(nextGateCiHandoffRollbackTopSummaryField.stdout.trim(), "fixture: rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "next gate CI rollback top summary field should include compact summary");

  const nextGateCiHandoffRollbackTopSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackTopSummaryField"]);
  assertExit(nextGateCiHandoffRollbackTopSummaryAliasField, 0, "gate0 status next gate CI rollback top summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackTopSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackTopSummary", "next gate CI rollback top summary alias field should include field name");

  const nextGateCiHandoffRollbackTopFieldSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackTopFieldSummary"]);
  assertExit(nextGateCiHandoffRollbackTopFieldSummaryField, 0, "gate0 status next gate CI rollback top field summary should pass");
  assertEqual(nextGateCiHandoffRollbackTopFieldSummaryField.stdout.trim(), "modeField=nextGateCiHandoff.rollback.mode, summaryField=nextGateCiHandoff.rollback.summary, topSummaryField=nextGateCiHandoffRollbackTopSummary", "next gate CI rollback top field summary should include aliases");

  const nextGateCiHandoffRollbackTopFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackTopFieldSummaryField"]);
  assertExit(nextGateCiHandoffRollbackTopFieldSummaryAliasField, 0, "gate0 status next gate CI rollback top field summary alias should pass");
  assertEqual(nextGateCiHandoffRollbackTopFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackTopFieldSummary", "next gate CI rollback top field summary alias should include field name");

  const ciRollbackCommandCountField = await runStatus(["--field", "ciRollbackCommandCount"]);
  assertExit(ciRollbackCommandCountField, 0, "gate0 status CI rollback command count field should pass");
  assertEqual(ciRollbackCommandCountField.stdout.trim(), "3", "CI rollback command count field should include count");

  const ciRollbackReportCommandAliasField = await runStatus(["--field", "ciRollbackReportCommandField"]);
  assertExit(ciRollbackReportCommandAliasField, 0, "gate0 status CI rollback report command alias field should pass");
  assertEqual(ciRollbackReportCommandAliasField.stdout.trim(), "nextGateCiHandoff.rollback.reportCommand", "CI rollback report command alias field should include canonical path");

  const ciRollbackSecondCommandField = await runStatus(["--field", "ciRollbackSecondCommand"]);
  assertExit(ciRollbackSecondCommandField, 0, "gate0 status CI rollback second command field should pass");
  assertEqual(ciRollbackSecondCommandField.stdout.trim(), "npm run gate0:status -- --field persistenceModeDefault", "CI rollback second command field should include verification command");

  const ciRollbackSecondCommandAliasField = await runStatus(["--field", "ciRollbackSecondCommandField"]);
  assertExit(ciRollbackSecondCommandAliasField, 0, "gate0 status CI rollback second command alias field should pass");
  assertEqual(ciRollbackSecondCommandAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commands.1", "CI rollback second command alias field should include canonical path");

  const nextGateCiHandoffRollbackCommandSequenceSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandSequenceSummary"]);
  assertExit(nextGateCiHandoffRollbackCommandSequenceSummaryField, 0, "gate0 status next gate CI rollback command sequence summary field should pass");
  assertIncludes(nextGateCiHandoffRollbackCommandSequenceSummaryField.stdout, "$env:PERSISTENCE_MODE='fixture'; npm test", "next gate CI rollback command sequence summary should include fixture test command");
  assertIncludes(nextGateCiHandoffRollbackCommandSequenceSummaryField.stdout, " -> npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI rollback command sequence summary should include report command");

  const nextGateCiHandoffRollbackCommandSequenceSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandSequenceSummaryField"]);
  assertExit(nextGateCiHandoffRollbackCommandSequenceSummaryAliasField, 0, "gate0 status next gate CI rollback command sequence summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandSequenceSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackCommandSequenceSummary", "next gate CI rollback command sequence summary alias should include field name");

  const nextGateCiHandoffRollbackVerificationReportSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackVerificationReportSummary"]);
  assertExit(nextGateCiHandoffRollbackVerificationReportSummaryField, 0, "gate0 status next gate CI rollback verification report summary field should pass");
  assertEqual(nextGateCiHandoffRollbackVerificationReportSummaryField.stdout.trim(), "verify=npm run gate0:status -- --field persistenceModeDefault, report=npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI rollback verification report summary should include verify and report commands");

  const nextGateCiHandoffRollbackVerificationReportSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackVerificationReportSummaryField"]);
  assertExit(nextGateCiHandoffRollbackVerificationReportSummaryAliasField, 0, "gate0 status next gate CI rollback verification report summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackVerificationReportSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackVerificationReportSummary", "next gate CI rollback verification report summary alias should include field name");

  const nextGateCiHandoffRollbackCommandCountSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandCountSummary"]);
  assertExit(nextGateCiHandoffRollbackCommandCountSummaryField, 0, "gate0 status next gate CI rollback command count summary field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandCountSummaryField.stdout.trim(), "count=3, lastIndex=2", "next gate CI rollback command count summary should include count and last index");

  const nextGateCiHandoffRollbackCommandCountSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandCountSummaryField"]);
  assertExit(nextGateCiHandoffRollbackCommandCountSummaryAliasField, 0, "gate0 status next gate CI rollback command count summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandCountSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackCommandCountSummary", "next gate CI rollback command count summary alias should include field name");

  const ciRollbackCommandEndpointSummaryField = await runStatus(["--field", "ciRollbackCommandEndpointSummary"]);
  assertExit(ciRollbackCommandEndpointSummaryField, 0, "gate0 status CI rollback command endpoint summary field should pass");
  assertIncludes(ciRollbackCommandEndpointSummaryField.stdout, "last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "CI rollback command endpoint summary should include last command");

  const nextGateCiHandoffRollbackEndpointSummaryTopField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandEndpointSummary"]);
  assertExit(nextGateCiHandoffRollbackEndpointSummaryTopField, 0, "gate0 status next gate CI rollback endpoint summary top field should pass");
  assertIncludes(nextGateCiHandoffRollbackEndpointSummaryTopField.stdout, "last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI rollback endpoint summary top field should include last command");

  const nextGateCiHandoffRollbackEndpointSummaryTopAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandEndpointSummaryField"]);
  assertExit(nextGateCiHandoffRollbackEndpointSummaryTopAliasField, 0, "gate0 status next gate CI rollback endpoint summary top alias field should pass");
  assertEqual(nextGateCiHandoffRollbackEndpointSummaryTopAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandEndpointSummary", "next gate CI rollback endpoint summary top alias field should include nested field name");

  const ciRollbackCommandLastAliasField = await runStatus(["--field", "ciRollbackCommandLastField"]);
  assertExit(ciRollbackCommandLastAliasField, 0, "gate0 status CI rollback command last alias field should pass");
  assertEqual(ciRollbackCommandLastAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandLast", "CI rollback command last alias field should include canonical path");

  const nextGateCiHandoffRollbackCommandFieldSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandFieldSummary"]);
  assertExit(nextGateCiHandoffRollbackCommandFieldSummaryField, 0, "gate0 status next gate CI rollback command field summary field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandFieldSummaryField.stdout.trim(), "firstField=nextGateCiHandoff.rollback.commandFirst, lastField=nextGateCiHandoff.rollback.commandLast", "next gate CI rollback command field summary should include first and last fields");

  const nextGateCiHandoffRollbackCommandFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandFieldSummaryField"]);
  assertExit(nextGateCiHandoffRollbackCommandFieldSummaryAliasField, 0, "gate0 status next gate CI rollback command field summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackCommandFieldSummary", "next gate CI rollback command field summary alias should include field name");

  const nextGateCiHandoffRollbackCommandEndpointSummaryField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandEndpointSummary"]);
  assertExit(nextGateCiHandoffRollbackCommandEndpointSummaryField, 0, "gate0 status next gate CI handoff rollback command endpoint summary should pass");
  assertIncludes(nextGateCiHandoffRollbackCommandEndpointSummaryField.stdout, "first=$env:PERSISTENCE_MODE='fixture'", "next gate CI handoff rollback command endpoint summary should include first command");

  const nextGateCiHandoffRollbackEndpointFieldSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackEndpointFieldSummary"]);
  assertExit(nextGateCiHandoffRollbackEndpointFieldSummaryField, 0, "gate0 status next gate CI rollback endpoint field summary should pass");
  assertEqual(nextGateCiHandoffRollbackEndpointFieldSummaryField.stdout.trim(), "endpointsField=nextGateCiHandoff.rollback.commandEndpoints, endpointSummaryField=nextGateCiHandoff.rollback.commandEndpointSummary", "next gate CI rollback endpoint field summary should include endpoint aliases");

  const nextGateCiHandoffRollbackEndpointFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackEndpointFieldSummaryField"]);
  assertExit(nextGateCiHandoffRollbackEndpointFieldSummaryAliasField, 0, "gate0 status next gate CI rollback endpoint field summary alias should pass");
  assertEqual(nextGateCiHandoffRollbackEndpointFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackEndpointFieldSummary", "next gate CI rollback endpoint field summary alias should include field name");

  const nextGateCiHandoffRollbackRegistryFieldSummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackRegistryFieldSummary"]);
  assertExit(nextGateCiHandoffRollbackRegistryFieldSummaryField, 0, "gate0 status next gate CI rollback registry field summary should pass");
  assertEqual(nextGateCiHandoffRollbackRegistryFieldSummaryField.stdout.trim(), "statusField=nextGateCiHandoff.rollback.commandRegistryStatus, invariantField=nextGateCiHandoff.rollback.commandRegistryInvariant", "next gate CI rollback registry field summary should include registry aliases");

  const nextGateCiHandoffRollbackRegistryFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackRegistryFieldSummaryField"]);
  assertExit(nextGateCiHandoffRollbackRegistryFieldSummaryAliasField, 0, "gate0 status next gate CI rollback registry field summary alias should pass");
  assertEqual(nextGateCiHandoffRollbackRegistryFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackRegistryFieldSummary", "next gate CI rollback registry field summary alias should include field name");

  const nextGateCiHandoffRollbackCommandRegistrySummaryField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandRegistrySummary"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistrySummaryField, 0, "gate0 status next gate CI rollback command registry summary top field should pass");
  assertIncludes(nextGateCiHandoffRollbackCommandRegistrySummaryField.stdout, "consistent: count=3,lastIndex=2", "next gate CI rollback command registry summary should include invariant");

  const nextGateCiHandoffRollbackCommandRegistrySummaryAliasField = await runStatus(["--field", "nextGateCiHandoffRollbackCommandRegistrySummaryField"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistrySummaryAliasField, 0, "gate0 status next gate CI rollback command registry summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandRegistrySummaryAliasField.stdout.trim(), "nextGateCiHandoffRollbackCommandRegistrySummary", "next gate CI rollback command registry summary alias should include field name");

  const completedField = await runStatus(["--field", "completedLocally"]);
  assertExit(completedField, 0, "gate0 status completed field should pass");
  assertIncludes(completedField.stdout, "Gate 0 nav is `Discover`, `Swipe`, `Chat`, `List`, `My`.", "completed field should include nav completion");

  const completedLocallyCountField = await runStatus(["--field", "completedLocallyCount"]);
  assertExit(completedLocallyCountField, 0, "gate0 status completed locally count field should pass");
  assertEqual(completedLocallyCountField.stdout.trim(), "3", "completed locally count field should include count");

  const completedLocallyCountAliasField = await runStatus(["--field", "completedLocallyCountField"]);
  assertExit(completedLocallyCountAliasField, 0, "gate0 status completed locally count alias field should pass");
  assertEqual(completedLocallyCountAliasField.stdout.trim(), "completedLocallyCount", "completed locally count alias field should include top-level path");

  const completedLocallyFirstField = await runStatus(["--field", "completedLocallyFirst"]);
  assertExit(completedLocallyFirstField, 0, "gate0 status completed locally first field should pass");
  assertEqual(completedLocallyFirstField.stdout.trim(), "Flutter app runs on web, Windows, and Android device targets.", "completed locally first field should include first item");

  const completedLocallyFirstAliasField = await runStatus(["--field", "completedLocallyFirstField"]);
  assertExit(completedLocallyFirstAliasField, 0, "gate0 status completed locally first alias field should pass");
  assertEqual(completedLocallyFirstAliasField.stdout.trim(), "completedLocallyFirst", "completed locally first alias field should include top-level path");

  const completedLocallyLastIndexField = await runStatus(["--field", "completedLocallyLastIndex"]);
  assertExit(completedLocallyLastIndexField, 0, "gate0 status completed locally last index field should pass");
  assertEqual(completedLocallyLastIndexField.stdout.trim(), "2", "completed locally last index field should include last index");

  const completedLocallyLastIndexAliasField = await runStatus(["--field", "completedLocallyLastIndexField"]);
  assertExit(completedLocallyLastIndexAliasField, 0, "gate0 status completed locally last index alias field should pass");
  assertEqual(completedLocallyLastIndexAliasField.stdout.trim(), "completedLocallyLastIndex", "completed locally last index alias field should include top-level path");

  const completedLocallyLastField = await runStatus(["--field", "completedLocallyLast"]);
  assertExit(completedLocallyLastField, 0, "gate0 status completed locally last field should pass");
  assertEqual(completedLocallyLastField.stdout.trim(), "Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.", "completed locally last field should include last item");

  const completedLocallyLastAliasField = await runStatus(["--field", "completedLocallyLastField"]);
  assertExit(completedLocallyLastAliasField, 0, "gate0 status completed locally last alias field should pass");
  assertEqual(completedLocallyLastAliasField.stdout.trim(), "completedLocallyLast", "completed locally last alias field should include top-level path");

  const completedLocallyRegistryStatusField = await runStatus(["--field", "completedLocallyRegistryStatus"]);
  assertExit(completedLocallyRegistryStatusField, 0, "gate0 status completed locally registry status field should pass");
  assertEqual(completedLocallyRegistryStatusField.stdout.trim(), "consistent", "completed locally registry status field should include status");

  const completedLocallyRegistryStatusAliasField = await runStatus(["--field", "completedLocallyRegistryStatusField"]);
  assertExit(completedLocallyRegistryStatusAliasField, 0, "gate0 status completed locally registry status alias field should pass");
  assertEqual(completedLocallyRegistryStatusAliasField.stdout.trim(), "completedLocallyRegistryStatus", "completed locally registry status alias field should include top-level path");

  const completedLocallyRegistryInvariantField = await runStatus(["--field", "completedLocallyRegistryInvariant"]);
  assertExit(completedLocallyRegistryInvariantField, 0, "gate0 status completed locally registry invariant field should pass");
  assertEqual(completedLocallyRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "completed locally registry invariant field should include invariant");

  const completedLocallyRegistryInvariantAliasField = await runStatus(["--field", "completedLocallyRegistryInvariantField"]);
  assertExit(completedLocallyRegistryInvariantAliasField, 0, "gate0 status completed locally registry invariant alias field should pass");
  assertEqual(completedLocallyRegistryInvariantAliasField.stdout.trim(), "completedLocallyRegistryInvariant", "completed locally registry invariant alias field should include top-level path");

  const completedLocallySummaryField = await runStatus(["--field", "completedLocallySummary"]);
  assertExit(completedLocallySummaryField, 0, "gate0 status completed locally summary field should pass");
  assertEqual(completedLocallySummaryField.stdout.trim(), "3 completed, first=Flutter app runs on web, Windows, and Android device targets., last=Android device smoke passed on OPPO CPH2695 / Android 16 / API 36 with archived result and screenshot artifacts.", "completed locally summary field should include compact summary");

  const completedLocallySummaryAliasField = await runStatus(["--field", "completedLocallySummaryField"]);
  assertExit(completedLocallySummaryAliasField, 0, "gate0 status completed locally summary alias field should pass");
  assertEqual(completedLocallySummaryAliasField.stdout.trim(), "completedLocallySummary", "completed locally summary alias field should include top-level path");

  const fullTestBaselineField = await runStatus(["--field", "fullTestBaseline"]);
  assertExit(fullTestBaselineField, 0, "gate0 status full test baseline field should pass");
  assertEqual(fullTestBaselineField.stdout.trim(), "89 Flutter widget tests", "full test baseline field should include test count");

  const fullTestBaselineAliasField = await runStatus(["--field", "fullTestBaselineField"]);
  assertExit(fullTestBaselineAliasField, 0, "gate0 status full test baseline alias field should pass");
  assertEqual(fullTestBaselineAliasField.stdout.trim(), "fullTestBaseline", "full test baseline alias field should include top-level path");

  const fullTestBaselineCommandField = await runStatus(["--field", "fullTestBaselineCommand"]);
  assertExit(fullTestBaselineCommandField, 0, "gate0 status full test baseline command field should pass");
  assertEqual(fullTestBaselineCommandField.stdout.trim(), "npm test", "full test baseline command field should include command");

  const fullTestBaselineSummaryField = await runStatus(["--field", "fullTestBaselineSummary"]);
  assertExit(fullTestBaselineSummaryField, 0, "gate0 status full test baseline summary field should pass");
  assertEqual(fullTestBaselineSummaryField.stdout.trim(), "npm test passed with 89 Flutter widget tests", "full test baseline summary field should include compact summary");

  const deviceStatusField = await runStatus(["--field", "latestAndroidDeviceSmoke.status"]);
  assertExit(deviceStatusField, 0, "gate0 status nested field should pass");
  assertEqual(deviceStatusField.stdout.trim(), "passed", "nested field output should include device status only");

  const deviceStatusAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeStatusField"]);
  assertExit(deviceStatusAliasField, 0, "gate0 status device smoke status alias field should pass");
  assertEqual(deviceStatusAliasField.stdout.trim(), "latestAndroidDeviceSmoke.status", "device smoke status alias field should include nested path");

  const deviceRunIdAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeRunIdField"]);
  assertExit(deviceRunIdAliasField, 0, "gate0 status device smoke run ID alias field should pass");
  assertEqual(deviceRunIdAliasField.stdout.trim(), "latestAndroidDeviceSmoke.runId", "device smoke run ID alias field should include nested path");

  const deviceManufacturerField = await runStatus(["--field", "latestAndroidDeviceSmoke.deviceManufacturer"]);
  assertExit(deviceManufacturerField, 0, "gate0 status device smoke manufacturer field should pass");
  assertEqual(deviceManufacturerField.stdout.trim(), "OPPO", "device smoke manufacturer field should include manufacturer");

  const deviceManufacturerAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeManufacturerField"]);
  assertExit(deviceManufacturerAliasField, 0, "gate0 status device smoke manufacturer alias field should pass");
  assertEqual(deviceManufacturerAliasField.stdout.trim(), "latestAndroidDeviceSmoke.deviceManufacturer", "device smoke manufacturer alias field should include nested path");

  const deviceModelField = await runStatus(["--field", "latestAndroidDeviceSmoke.deviceModel"]);
  assertExit(deviceModelField, 0, "gate0 status device smoke model field should pass");
  assertEqual(deviceModelField.stdout.trim(), "CPH2695", "device smoke model field should include model");

  const deviceModelAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeModelField"]);
  assertExit(deviceModelAliasField, 0, "gate0 status device smoke model alias field should pass");
  assertEqual(deviceModelAliasField.stdout.trim(), "latestAndroidDeviceSmoke.deviceModel", "device smoke model alias field should include nested path");

  const deviceAndroidReleaseField = await runStatus(["--field", "latestAndroidDeviceSmoke.androidRelease"]);
  assertExit(deviceAndroidReleaseField, 0, "gate0 status device smoke Android release field should pass");
  assertEqual(deviceAndroidReleaseField.stdout.trim(), "16", "device smoke Android release field should include release");

  const deviceAndroidReleaseAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeAndroidReleaseField"]);
  assertExit(deviceAndroidReleaseAliasField, 0, "gate0 status device smoke Android release alias field should pass");
  assertEqual(deviceAndroidReleaseAliasField.stdout.trim(), "latestAndroidDeviceSmoke.androidRelease", "device smoke Android release alias field should include nested path");

  const deviceAndroidSdkField = await runStatus(["--field", "latestAndroidDeviceSmoke.androidSdk"]);
  assertExit(deviceAndroidSdkField, 0, "gate0 status device smoke Android SDK field should pass");
  assertEqual(deviceAndroidSdkField.stdout.trim(), "36", "device smoke Android SDK field should include SDK");

  const deviceAndroidSdkAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeAndroidSdkField"]);
  assertExit(deviceAndroidSdkAliasField, 0, "gate0 status device smoke Android SDK alias field should pass");
  assertEqual(deviceAndroidSdkAliasField.stdout.trim(), "latestAndroidDeviceSmoke.androidSdk", "device smoke Android SDK alias field should include nested path");

  const deviceIdentityField = await runStatus(["--field", "latestAndroidDeviceSmokeDevice"]);
  assertExit(deviceIdentityField, 0, "gate0 status device smoke identity field should pass");
  assertEqual(deviceIdentityField.stdout.trim(), "OPPO CPH2695", "device smoke identity field should include manufacturer and model");

  const deviceIdentityAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeDeviceField"]);
  assertExit(deviceIdentityAliasField, 0, "gate0 status device smoke identity alias field should pass");
  assertEqual(deviceIdentityAliasField.stdout.trim(), "latestAndroidDeviceSmokeDevice", "device smoke identity alias field should include top-level path");

  const deviceAndroidField = await runStatus(["--field", "latestAndroidDeviceSmokeAndroid"]);
  assertExit(deviceAndroidField, 0, "gate0 status device smoke Android field should pass");
  assertEqual(deviceAndroidField.stdout.trim(), "Android 16 / API 36", "device smoke Android field should include Android version");

  const deviceAndroidAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeAndroidField"]);
  assertExit(deviceAndroidAliasField, 0, "gate0 status device smoke Android alias field should pass");
  assertEqual(deviceAndroidAliasField.stdout.trim(), "latestAndroidDeviceSmokeAndroid", "device smoke Android alias field should include top-level path");

  const deviceSummaryField = await runStatus(["--field", "latestAndroidDeviceSmokeSummary"]);
  assertExit(deviceSummaryField, 0, "gate0 status device smoke summary field should pass");
  assertEqual(deviceSummaryField.stdout.trim(), "passed (OPPO CPH2695, Android 16 / API 36, fixture-run)", "device smoke summary field should include compact summary");

  const deviceSummaryAliasField = await runStatus(["--field", "latestAndroidDeviceSmokeSummaryField"]);
  assertExit(deviceSummaryAliasField, 0, "gate0 status device smoke summary alias field should pass");
  assertEqual(deviceSummaryAliasField.stdout.trim(), "latestAndroidDeviceSmokeSummary", "device smoke summary alias field should include top-level path");

  const apiChecksField = await runStatus(["--field", "localApiBoundaryChecks"]);
  assertExit(apiChecksField, 0, "gate0 status API checks field should pass");
  assertIncludes(apiChecksField.stdout, "npm run api:fixture-store:test", "API checks field should include fixture store boundary check");

  const apiChecksFirstField = await runStatus(["--field", "localApiBoundaryChecks.0"]);
  assertExit(apiChecksFirstField, 0, "gate0 status first API check field should pass");
  assertEqual(apiChecksFirstField.stdout.trim(), "npm run api:fixture-store:test", "first API check field should include fixture store command");

  const apiChecksLastField = await runStatus(["--field", "localApiBoundaryChecks.1"]);
  assertExit(apiChecksLastField, 0, "gate0 status last API check field should pass");
  assertEqual(apiChecksLastField.stdout.trim(), "npm run api:service:test", "last API check field should include service command");

  const apiCheckCountField = await runStatus(["--field", "localApiBoundaryCheckCount"]);
  assertExit(apiCheckCountField, 0, "gate0 status API check count field should pass");
  assertEqual(apiCheckCountField.stdout.trim(), "2", "API check count field should include count");

  const apiCheckCountAliasField = await runStatus(["--field", "localApiBoundaryCheckCountField"]);
  assertExit(apiCheckCountAliasField, 0, "gate0 status API check count alias field should pass");
  assertEqual(apiCheckCountAliasField.stdout.trim(), "localApiBoundaryCheckCount", "API check count alias field should include top-level path");

  const apiCheckFirstField = await runStatus(["--field", "localApiBoundaryCheckFirst"]);
  assertExit(apiCheckFirstField, 0, "gate0 status API check first field should pass");
  assertEqual(apiCheckFirstField.stdout.trim(), "npm run api:fixture-store:test", "API check first field should include fixture store command");

  const apiCheckFirstAliasField = await runStatus(["--field", "localApiBoundaryCheckFirstField"]);
  assertExit(apiCheckFirstAliasField, 0, "gate0 status API check first alias field should pass");
  assertEqual(apiCheckFirstAliasField.stdout.trim(), "localApiBoundaryCheckFirst", "API check first alias field should include top-level path");

  const apiCheckLastIndexField = await runStatus(["--field", "localApiBoundaryCheckLastIndex"]);
  assertExit(apiCheckLastIndexField, 0, "gate0 status API check last index field should pass");
  assertEqual(apiCheckLastIndexField.stdout.trim(), "1", "API check last index field should include last index");

  const apiCheckLastIndexAliasField = await runStatus(["--field", "localApiBoundaryCheckLastIndexField"]);
  assertExit(apiCheckLastIndexAliasField, 0, "gate0 status API check last index alias field should pass");
  assertEqual(apiCheckLastIndexAliasField.stdout.trim(), "localApiBoundaryCheckLastIndex", "API check last index alias field should include top-level path");

  const apiCheckLastField = await runStatus(["--field", "localApiBoundaryCheckLast"]);
  assertExit(apiCheckLastField, 0, "gate0 status API check last field should pass");
  assertEqual(apiCheckLastField.stdout.trim(), "npm run api:service:test", "API check last field should include service command");

  const apiCheckLastAliasField = await runStatus(["--field", "localApiBoundaryCheckLastField"]);
  assertExit(apiCheckLastAliasField, 0, "gate0 status API check last alias field should pass");
  assertEqual(apiCheckLastAliasField.stdout.trim(), "localApiBoundaryCheckLast", "API check last alias field should include top-level path");

  const apiCheckSummaryField = await runStatus(["--field", "localApiBoundaryCheckSummary"]);
  assertExit(apiCheckSummaryField, 0, "gate0 status API check summary field should pass");
  assertEqual(apiCheckSummaryField.stdout.trim(), "2 checks, first=npm run api:fixture-store:test, last=npm run api:service:test", "API check summary field should include compact summary");

  const apiCheckSummaryAliasField = await runStatus(["--field", "localApiBoundaryCheckSummaryField"]);
  assertExit(apiCheckSummaryAliasField, 0, "gate0 status API check summary alias field should pass");
  assertEqual(apiCheckSummaryAliasField.stdout.trim(), "localApiBoundaryCheckSummary", "API check summary alias field should include top-level path");

  const blockersField = await runStatus(["--field", "stillNotDone"]);
  assertExit(blockersField, 0, "gate0 status blockers field should pass");
  assertIncludes(blockersField.stdout, "AWS CI/deploy pipeline.", "blockers field should include AWS CI/deploy pipeline");

  const blockersFirstField = await runStatus(["--field", "stillNotDone.0"]);
  assertExit(blockersFirstField, 0, "gate0 status first blocker field should pass");
  assertEqual(blockersFirstField.stdout.trim(), "Real auth/provider/storage integrations.", "first blocker field should include first blocker");

  const blockersLastField = await runStatus(["--field", "stillNotDone.4"]);
  assertExit(blockersLastField, 0, "gate0 status last blocker field should pass");
  assertEqual(blockersLastField.stdout.trim(), "App store/release build signing.", "last blocker field should include last blocker");

  const remainingBlockersSummaryField = await runStatus(["--field", "remainingBlockersSummary"]);
  assertExit(remainingBlockersSummaryField, 0, "gate0 status remaining blockers summary field should pass");
  assertEqual(remainingBlockersSummaryField.stdout.trim(), "Real auth/provider/storage integrations. | Production backend persistence. | AWS CI/deploy pipeline. | Formal Figma/DESIGN.md source of truth. | App store/release build signing.", "remaining blockers summary field should include compact blocker list");

  const remainingBlockersSummaryAliasField = await runStatus(["--field", "remainingBlockersSummaryField"]);
  assertExit(remainingBlockersSummaryAliasField, 0, "gate0 status remaining blockers summary alias field should pass");
  assertEqual(remainingBlockersSummaryAliasField.stdout.trim(), "remainingBlockersSummary", "remaining blockers summary alias field should include top-level path");

  const remainingBlockerCountField = await runStatus(["--field", "remainingBlockerCount"]);
  assertExit(remainingBlockerCountField, 0, "gate0 status remaining blocker count field should pass");
  assertEqual(remainingBlockerCountField.stdout.trim(), "5", "remaining blocker count field should include blocker count");

  const remainingBlockerFirstField = await runStatus(["--field", "remainingBlockerFirst"]);
  assertExit(remainingBlockerFirstField, 0, "gate0 status remaining blocker first field should pass");
  assertEqual(remainingBlockerFirstField.stdout.trim(), "Real auth/provider/storage integrations.", "remaining blocker first field should include first blocker");

  const remainingBlockerLastIndexField = await runStatus(["--field", "remainingBlockerLastIndex"]);
  assertExit(remainingBlockerLastIndexField, 0, "gate0 status remaining blocker last index field should pass");
  assertEqual(remainingBlockerLastIndexField.stdout.trim(), "4", "remaining blocker last index field should include last index");

  const remainingBlockerLastAliasField = await runStatus(["--field", "remainingBlockerLastField"]);
  assertExit(remainingBlockerLastAliasField, 0, "gate0 status remaining blocker last alias field should pass");
  assertEqual(remainingBlockerLastAliasField.stdout.trim(), "remainingBlockerLast", "remaining blocker last alias field should include top-level path");

  const remainingBlockerCountAliasField = await runStatus(["--field", "remainingBlockerCountField"]);
  assertExit(remainingBlockerCountAliasField, 0, "gate0 status remaining blocker count alias field should pass");
  assertEqual(remainingBlockerCountAliasField.stdout.trim(), "remainingBlockerCount", "remaining blocker count alias field should include top-level path");

  const remainingBlockerFirstAliasField = await runStatus(["--field", "remainingBlockerFirstField"]);
  assertExit(remainingBlockerFirstAliasField, 0, "gate0 status remaining blocker first alias field should pass");
  assertEqual(remainingBlockerFirstAliasField.stdout.trim(), "remainingBlockerFirst", "remaining blocker first alias field should include top-level path");

  const remainingBlockerLastIndexAliasField = await runStatus(["--field", "remainingBlockerLastIndexField"]);
  assertExit(remainingBlockerLastIndexAliasField, 0, "gate0 status remaining blocker last index alias field should pass");
  assertEqual(remainingBlockerLastIndexAliasField.stdout.trim(), "remainingBlockerLastIndex", "remaining blocker last index alias field should include top-level path");

  const remainingBlockerRegistryStatusField = await runStatus(["--field", "remainingBlockerRegistryStatus"]);
  assertExit(remainingBlockerRegistryStatusField, 0, "gate0 status remaining blocker registry status field should pass");
  assertEqual(remainingBlockerRegistryStatusField.stdout.trim(), "consistent", "remaining blocker registry status field should include status");

  const remainingBlockerRegistryInvariantField = await runStatus(["--field", "remainingBlockerRegistryInvariant"]);
  assertExit(remainingBlockerRegistryInvariantField, 0, "gate0 status remaining blocker registry invariant field should pass");
  assertEqual(remainingBlockerRegistryInvariantField.stdout.trim(), "count=5,lastIndex=4", "remaining blocker registry invariant field should include invariant");

  const remainingBlockerRegistryStatusAliasField = await runStatus(["--field", "remainingBlockerRegistryStatusField"]);
  assertExit(remainingBlockerRegistryStatusAliasField, 0, "gate0 status remaining blocker registry status alias field should pass");
  assertEqual(remainingBlockerRegistryStatusAliasField.stdout.trim(), "remainingBlockerRegistryStatus", "remaining blocker registry status alias field should include top-level path");

  const remainingBlockerRegistryInvariantAliasField = await runStatus(["--field", "remainingBlockerRegistryInvariantField"]);
  assertExit(remainingBlockerRegistryInvariantAliasField, 0, "gate0 status remaining blocker registry invariant alias field should pass");
  assertEqual(remainingBlockerRegistryInvariantAliasField.stdout.trim(), "remainingBlockerRegistryInvariant", "remaining blocker registry invariant alias field should include top-level path");

  const remainingBlockerFieldsField = await runStatus(["--field", "remainingBlockerFields"]);
  assertExit(remainingBlockerFieldsField, 0, "gate0 status remaining blocker fields field should pass");
  assertIncludes(remainingBlockerFieldsField.stdout, "remainingBlockersSummary", "remaining blocker fields should include summary field");

  const remainingBlockerFieldCountField = await runStatus(["--field", "remainingBlockerFieldCount"]);
  assertExit(remainingBlockerFieldCountField, 0, "gate0 status remaining blocker field count should pass");
  assertEqual(remainingBlockerFieldCountField.stdout.trim(), "3", "remaining blocker field count should include count");

  const remainingBlockerFieldIndexesField = await runStatus(["--field", "remainingBlockerFieldIndexes"]);
  assertExit(remainingBlockerFieldIndexesField, 0, "gate0 status remaining blocker field indexes should pass");
  assertIncludes(remainingBlockerFieldIndexesField.stdout, "2", "remaining blocker field indexes should include last index");

  const remainingBlockerFieldIndexesAliasField = await runStatus(["--field", "remainingBlockerFieldIndexesField"]);
  assertExit(remainingBlockerFieldIndexesAliasField, 0, "gate0 status remaining blocker field indexes alias should pass");
  assertEqual(remainingBlockerFieldIndexesAliasField.stdout.trim(), "remainingBlockerFieldIndexes", "remaining blocker field indexes alias should include top-level path");

  const remainingBlockerFieldFirstField = await runStatus(["--field", "remainingBlockerFieldFirst"]);
  assertExit(remainingBlockerFieldFirstField, 0, "gate0 status remaining blocker field first should pass");
  assertEqual(remainingBlockerFieldFirstField.stdout.trim(), "remainingBlockerFirst", "remaining blocker field first should include first field");

  const remainingBlockerFieldFirstAliasField = await runStatus(["--field", "remainingBlockerFieldFirstField"]);
  assertExit(remainingBlockerFieldFirstAliasField, 0, "gate0 status remaining blocker field first alias should pass");
  assertEqual(remainingBlockerFieldFirstAliasField.stdout.trim(), "remainingBlockerFieldFirst", "remaining blocker field first alias should include top-level path");

  const remainingBlockerFieldLastField = await runStatus(["--field", "remainingBlockerFieldLast"]);
  assertExit(remainingBlockerFieldLastField, 0, "gate0 status remaining blocker field last should pass");
  assertEqual(remainingBlockerFieldLastField.stdout.trim(), "remainingBlockersSummary", "remaining blocker field last should include last field");

  const remainingBlockerFieldLastAliasField = await runStatus(["--field", "remainingBlockerFieldLastField"]);
  assertExit(remainingBlockerFieldLastAliasField, 0, "gate0 status remaining blocker field last alias should pass");
  assertEqual(remainingBlockerFieldLastAliasField.stdout.trim(), "remainingBlockerFieldLast", "remaining blocker field last alias should include top-level path");

  const remainingBlockerFieldLastIndexAliasField = await runStatus(["--field", "remainingBlockerFieldLastIndexField"]);
  assertExit(remainingBlockerFieldLastIndexAliasField, 0, "gate0 status remaining blocker field last index alias should pass");
  assertEqual(remainingBlockerFieldLastIndexAliasField.stdout.trim(), "remainingBlockerFieldLastIndex", "remaining blocker field last index alias should include top-level path");

  const remainingBlockerFieldRegistryStatusField = await runStatus(["--field", "remainingBlockerFieldRegistryStatus"]);
  assertExit(remainingBlockerFieldRegistryStatusField, 0, "gate0 status remaining blocker field registry status should pass");
  assertEqual(remainingBlockerFieldRegistryStatusField.stdout.trim(), "consistent", "remaining blocker field registry status should include status");

  const remainingBlockerFieldRegistryStatusAliasField = await runStatus(["--field", "remainingBlockerFieldRegistryStatusField"]);
  assertExit(remainingBlockerFieldRegistryStatusAliasField, 0, "gate0 status remaining blocker field registry status alias should pass");
  assertEqual(remainingBlockerFieldRegistryStatusAliasField.stdout.trim(), "remainingBlockerFieldRegistryStatus", "remaining blocker field registry status alias should include top-level path");

  const remainingBlockerFieldRegistryInvariantField = await runStatus(["--field", "remainingBlockerFieldRegistryInvariant"]);
  assertExit(remainingBlockerFieldRegistryInvariantField, 0, "gate0 status remaining blocker field registry invariant should pass");
  assertEqual(remainingBlockerFieldRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "remaining blocker field registry invariant should include invariant");

  const remainingBlockerFieldRegistryInvariantAliasField = await runStatus(["--field", "remainingBlockerFieldRegistryInvariantField"]);
  assertExit(remainingBlockerFieldRegistryInvariantAliasField, 0, "gate0 status remaining blocker field registry invariant alias should pass");
  assertEqual(remainingBlockerFieldRegistryInvariantAliasField.stdout.trim(), "remainingBlockerFieldRegistryInvariant", "remaining blocker field registry invariant alias should include top-level path");

  const remainingBlockerFieldSummaryField = await runStatus(["--field", "remainingBlockerFieldSummary"]);
  assertExit(remainingBlockerFieldSummaryField, 0, "gate0 status remaining blocker field summary should pass");
  assertEqual(remainingBlockerFieldSummaryField.stdout.trim(), "3 fields, first=remainingBlockerFirst, last=remainingBlockersSummary", "remaining blocker field summary should include compact field summary");

  const remainingBlockerFieldSummaryAliasField = await runStatus(["--field", "remainingBlockerFieldSummaryField"]);
  assertExit(remainingBlockerFieldSummaryAliasField, 0, "gate0 status remaining blocker field summary alias should pass");
  assertEqual(remainingBlockerFieldSummaryAliasField.stdout.trim(), "remainingBlockerFieldSummary", "remaining blocker field summary alias should include top-level path");

  const productionBlockersSummaryField = await runStatus(["--field", "productionBlockersSummary"]);
  assertExit(productionBlockersSummaryField, 0, "gate0 status production blockers summary field should pass");
  assertIncludes(productionBlockersSummaryField.stdout, "\"nextGateBlocker\": \"Production backend persistence.\"", "production blockers summary should include next gate blocker");

  const productionBlockerCountField = await runStatus(["--field", "productionBlockerCount"]);
  assertExit(productionBlockerCountField, 0, "gate0 status production blocker count field should pass");
  assertEqual(productionBlockerCountField.stdout.trim(), "5", "production blocker count field should include blocker count");

  const productionBlockerCountAliasField = await runStatus(["--field", "productionBlockerCountField"]);
  assertExit(productionBlockerCountAliasField, 0, "gate0 status production blocker count alias field should pass");
  assertEqual(productionBlockerCountAliasField.stdout.trim(), "productionBlockerCount", "production blocker count alias field should include top-level path");

  const productionBlockersSummaryAliasField = await runStatus(["--field", "productionBlockersSummaryField"]);
  assertExit(productionBlockersSummaryAliasField, 0, "gate0 status production blockers summary alias field should pass");
  assertEqual(productionBlockersSummaryAliasField.stdout.trim(), "productionBlockersSummary", "production blockers summary alias field should include top-level path");

  const productionGateOrderDetailsSummaryField = await runStatus(["--field", "productionGateOrderDetailsSummary"]);
  assertExit(productionGateOrderDetailsSummaryField, 0, "gate0 status production gate order details summary field should pass");
  assertEqual(productionGateOrderDetailsSummaryField.stdout.trim(), "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "production gate order details summary field should include compact gate order");

  const productionGateOrderDetailsSummaryAliasField = await runStatus(["--field", "productionGateOrderDetailsSummaryField"]);
  assertExit(productionGateOrderDetailsSummaryAliasField, 0, "gate0 status production gate order details summary alias field should pass");
  assertEqual(productionGateOrderDetailsSummaryAliasField.stdout.trim(), "productionGateOrderDetailsSummary", "production gate order details summary alias field should include top-level path");

  const productionBlockerFieldsField = await runStatus(["--field", "productionBlockerFields"]);
  assertExit(productionBlockerFieldsField, 0, "gate0 status production blocker fields should pass");
  assertIncludes(productionBlockerFieldsField.stdout, "productionGateOrderDetailsSummary", "production blocker fields should include gate summary field");

  const productionBlockerFieldCountField = await runStatus(["--field", "productionBlockerFieldCount"]);
  assertExit(productionBlockerFieldCountField, 0, "gate0 status production blocker field count should pass");
  assertEqual(productionBlockerFieldCountField.stdout.trim(), "3", "production blocker field count should include count");

  const productionBlockerFieldIndexesField = await runStatus(["--field", "productionBlockerFieldIndexes"]);
  assertExit(productionBlockerFieldIndexesField, 0, "gate0 status production blocker field indexes should pass");
  assertIncludes(productionBlockerFieldIndexesField.stdout, "2", "production blocker field indexes should include last index");

  const productionBlockerFieldLastIndexField = await runStatus(["--field", "productionBlockerFieldLastIndex"]);
  assertExit(productionBlockerFieldLastIndexField, 0, "gate0 status production blocker field last index should pass");
  assertEqual(productionBlockerFieldLastIndexField.stdout.trim(), "2", "production blocker field last index should include last index");

  const productionBlockerFieldIndexesAliasField = await runStatus(["--field", "productionBlockerFieldIndexesField"]);
  assertExit(productionBlockerFieldIndexesAliasField, 0, "gate0 status production blocker field indexes alias should pass");
  assertEqual(productionBlockerFieldIndexesAliasField.stdout.trim(), "productionBlockerFieldIndexes", "production blocker field indexes alias should include top-level path");

  const productionBlockerFieldFirstField = await runStatus(["--field", "productionBlockerFieldFirst"]);
  assertExit(productionBlockerFieldFirstField, 0, "gate0 status production blocker field first should pass");
  assertEqual(productionBlockerFieldFirstField.stdout.trim(), "productionBlockersSummary", "production blocker field first should include first field");

  const productionBlockerFieldLastField = await runStatus(["--field", "productionBlockerFieldLast"]);
  assertExit(productionBlockerFieldLastField, 0, "gate0 status production blocker field last should pass");
  assertEqual(productionBlockerFieldLastField.stdout.trim(), "productionGateOrderDetailsSummary", "production blocker field last should include last field");

  const productionBlockerFieldLastIndexAliasField = await runStatus(["--field", "productionBlockerFieldLastIndexField"]);
  assertExit(productionBlockerFieldLastIndexAliasField, 0, "gate0 status production blocker field last index alias should pass");
  assertEqual(productionBlockerFieldLastIndexAliasField.stdout.trim(), "productionBlockerFieldLastIndex", "production blocker field last index alias should include top-level path");

  const productionBlockerFieldRegistryStatusField = await runStatus(["--field", "productionBlockerFieldRegistryStatus"]);
  assertExit(productionBlockerFieldRegistryStatusField, 0, "gate0 status production blocker field registry status should pass");
  assertEqual(productionBlockerFieldRegistryStatusField.stdout.trim(), "consistent", "production blocker field registry status should include status");

  const productionBlockerFieldRegistryStatusAliasField = await runStatus(["--field", "productionBlockerFieldRegistryStatusField"]);
  assertExit(productionBlockerFieldRegistryStatusAliasField, 0, "gate0 status production blocker field registry status alias should pass");
  assertEqual(productionBlockerFieldRegistryStatusAliasField.stdout.trim(), "productionBlockerFieldRegistryStatus", "production blocker field registry status alias should include top-level path");

  const productionBlockerFieldRegistryInvariantField = await runStatus(["--field", "productionBlockerFieldRegistryInvariant"]);
  assertExit(productionBlockerFieldRegistryInvariantField, 0, "gate0 status production blocker field registry invariant should pass");
  assertEqual(productionBlockerFieldRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "production blocker field registry invariant should include invariant");

  const productionBlockerFieldRegistryInvariantAliasField = await runStatus(["--field", "productionBlockerFieldRegistryInvariantField"]);
  assertExit(productionBlockerFieldRegistryInvariantAliasField, 0, "gate0 status production blocker field registry invariant alias should pass");
  assertEqual(productionBlockerFieldRegistryInvariantAliasField.stdout.trim(), "productionBlockerFieldRegistryInvariant", "production blocker field registry invariant alias should include top-level path");

  const productionBlockerFieldSummaryField = await runStatus(["--field", "productionBlockerFieldSummary"]);
  assertExit(productionBlockerFieldSummaryField, 0, "gate0 status production blocker field summary should pass");
  assertEqual(productionBlockerFieldSummaryField.stdout.trim(), "3 fields, first=productionBlockersSummary, last=productionGateOrderDetailsSummary", "production blocker field summary should include compact summary");

  const productionBlockerFieldSummaryAliasField = await runStatus(["--field", "productionBlockerFieldSummaryField"]);
  assertExit(productionBlockerFieldSummaryAliasField, 0, "gate0 status production blocker field summary alias should pass");
  assertEqual(productionBlockerFieldSummaryAliasField.stdout.trim(), "productionBlockerFieldSummary", "production blocker field summary alias should include top-level path");

  const prismaScaffoldStatusSummaryField = await runStatus(["--field", "prismaScaffoldStatusSummary"]);
  assertExit(prismaScaffoldStatusSummaryField, 0, "gate0 status Prisma scaffold status summary field should pass");
  assertEqual(prismaScaffoldStatusSummaryField.stdout.trim(), "schema=true, migrations=true, migrationStatus=scaffolded", "Prisma scaffold status summary field should include compact scaffold state");

  const productionBlockersCountField = await runStatus(["--field", "productionBlockersSummary.count"]);
  assertExit(productionBlockersCountField, 0, "gate0 status production blockers count field should pass");
  assertEqual(productionBlockersCountField.stdout.trim(), "5", "production blockers count field should include blocker count");

  const productionBlockersFirstField = await runStatus(["--field", "productionBlockersSummary.first"]);
  assertExit(productionBlockersFirstField, 0, "gate0 status production blockers first field should pass");
  assertEqual(productionBlockersFirstField.stdout.trim(), "Real auth/provider/storage integrations.", "production blockers first field should include first blocker");

  const productionBlockersLastField = await runStatus(["--field", "productionBlockersSummary.last"]);
  assertExit(productionBlockersLastField, 0, "gate0 status production blockers last field should pass");
  assertEqual(productionBlockersLastField.stdout.trim(), "App store/release build signing.", "production blockers last field should include last blocker");

  const productionBlockersLastIndexField = await runStatus(["--field", "productionBlockersSummary.lastIndex"]);
  assertExit(productionBlockersLastIndexField, 0, "gate0 status production blockers last index field should pass");
  assertEqual(productionBlockersLastIndexField.stdout.trim(), "4", "production blockers last index field should include last index");

  const productionBlockersRegistryStatusField = await runStatus(["--field", "productionBlockersSummary.registryStatus"]);
  assertExit(productionBlockersRegistryStatusField, 0, "gate0 status production blockers registry status field should pass");
  assertEqual(productionBlockersRegistryStatusField.stdout.trim(), "consistent", "production blockers registry status should include status");

  const productionBlockersRegistryInvariantField = await runStatus(["--field", "productionBlockersSummary.registryInvariant"]);
  assertExit(productionBlockersRegistryInvariantField, 0, "gate0 status production blockers registry invariant field should pass");
  assertEqual(productionBlockersRegistryInvariantField.stdout.trim(), "count=5,lastIndex=4", "production blockers registry invariant should include invariant");

  const productionBlockersCountAliasField = await runStatus(["--field", "productionBlockersSummary.countField"]);
  assertExit(productionBlockersCountAliasField, 0, "gate0 status production blockers count alias field should pass");
  assertEqual(productionBlockersCountAliasField.stdout.trim(), "productionBlockersSummary.count", "production blockers count alias should include nested path");

  const productionBlockersFirstAliasField = await runStatus(["--field", "productionBlockersSummary.firstField"]);
  assertExit(productionBlockersFirstAliasField, 0, "gate0 status production blockers first alias field should pass");
  assertEqual(productionBlockersFirstAliasField.stdout.trim(), "productionBlockersSummary.first", "production blockers first alias should include nested path");

  const productionBlockersLastAliasField = await runStatus(["--field", "productionBlockersSummary.lastField"]);
  assertExit(productionBlockersLastAliasField, 0, "gate0 status production blockers last alias field should pass");
  assertEqual(productionBlockersLastAliasField.stdout.trim(), "productionBlockersSummary.last", "production blockers last alias should include nested path");

  const productionBlockersLastIndexAliasField = await runStatus(["--field", "productionBlockersSummary.lastIndexField"]);
  assertExit(productionBlockersLastIndexAliasField, 0, "gate0 status production blockers last index alias field should pass");
  assertEqual(productionBlockersLastIndexAliasField.stdout.trim(), "productionBlockersSummary.lastIndex", "production blockers last index alias should include nested path");

  const productionBlockersRegistryStatusAliasField = await runStatus(["--field", "productionBlockersSummary.registryStatusField"]);
  assertExit(productionBlockersRegistryStatusAliasField, 0, "gate0 status production blockers registry status alias field should pass");
  assertEqual(productionBlockersRegistryStatusAliasField.stdout.trim(), "productionBlockersSummary.registryStatus", "production blockers registry status alias should include nested path");

  const productionBlockersRegistryInvariantAliasField = await runStatus(["--field", "productionBlockersSummary.registryInvariantField"]);
  assertExit(productionBlockersRegistryInvariantAliasField, 0, "gate0 status production blockers registry invariant alias field should pass");
  assertEqual(productionBlockersRegistryInvariantAliasField.stdout.trim(), "productionBlockersSummary.registryInvariant", "production blockers registry invariant alias should include nested path");

  const productionBlockersNextGateBlockerAliasField = await runStatus(["--field", "productionBlockersSummary.nextGateBlockerField"]);
  assertExit(productionBlockersNextGateBlockerAliasField, 0, "gate0 status production blockers next gate blocker alias field should pass");
  assertEqual(productionBlockersNextGateBlockerAliasField.stdout.trim(), "productionBlockersSummary.nextGateBlocker", "production blockers next gate blocker alias should include nested path");

  const productionBlockersNextGateBlockerField = await runStatus(["--field", "productionBlockersSummary.nextGateBlocker"]);
  assertExit(productionBlockersNextGateBlockerField, 0, "gate0 status production blockers next gate blocker field should pass");
  assertEqual(productionBlockersNextGateBlockerField.stdout.trim(), "Production backend persistence.", "production blockers next gate blocker field should include blocker");

  const productionBlockersNextGateField = await runStatus(["--field", "productionBlockersSummary.nextGate"]);
  assertExit(productionBlockersNextGateField, 0, "gate0 status production blockers next gate field should pass");
  assertEqual(productionBlockersNextGateField.stdout.trim(), "Gate 1 production backend persistence", "production blockers next gate field should include gate");

  const productionBlockersNextGateAliasField = await runStatus(["--field", "productionBlockersSummary.nextGateField"]);
  assertExit(productionBlockersNextGateAliasField, 0, "gate0 status production blockers next gate alias field should pass");
  assertEqual(productionBlockersNextGateAliasField.stdout.trim(), "productionBlockersSummary.nextGate", "production blockers next gate alias should include nested path");

  const productionBlockersNextGateDocField = await runStatus(["--field", "productionBlockersSummary.nextGateDocPath"]);
  assertExit(productionBlockersNextGateDocField, 0, "gate0 status production blockers next gate doc field should pass");
  assertEqual(productionBlockersNextGateDocField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md", "production blockers next gate doc field should include Gate 1 doc path");

  const productionBlockersNextGateDocAliasField = await runStatus(["--field", "productionBlockersSummary.nextGateDocPathField"]);
  assertExit(productionBlockersNextGateDocAliasField, 0, "gate0 status production blockers next gate doc alias field should pass");
  assertEqual(productionBlockersNextGateDocAliasField.stdout.trim(), "productionBlockersSummary.nextGateDocPath", "production blockers next gate doc alias should include nested path");

  const productionBlockersBlockersAliasField = await runStatus(["--field", "productionBlockersSummary.blockersField"]);
  assertExit(productionBlockersBlockersAliasField, 0, "gate0 status production blockers list alias field should pass");
  assertEqual(productionBlockersBlockersAliasField.stdout.trim(), "productionBlockersSummary.blockers", "production blockers list alias should include nested path");

  const productionBlockersFirstListField = await runStatus(["--field", "productionBlockersSummary.blockers.0"]);
  assertExit(productionBlockersFirstListField, 0, "gate0 status production blockers first list field should pass");
  assertEqual(productionBlockersFirstListField.stdout.trim(), "Real auth/provider/storage integrations.", "production blockers first list field should include first blocker");

  const productionBlockersLastListField = await runStatus(["--field", "productionBlockersSummary.blockers.4"]);
  assertExit(productionBlockersLastListField, 0, "gate0 status production blockers last list field should pass");
  assertEqual(productionBlockersLastListField.stdout.trim(), "App store/release build signing.", "production blockers last list field should include last blocker");

  const productionBlockersByGateField = await runStatus(["--field", "productionBlockersSummary.byGate"]);
  assertExit(productionBlockersByGateField, 0, "gate0 status production blockers by-gate field should pass");
  assertIncludes(productionBlockersByGateField.stdout, "\"gate2\"", "production blockers by-gate field should include Gate 2");

  const productionBlockersByGateAliasField = await runStatus(["--field", "productionBlockersSummary.byGateField"]);
  assertExit(productionBlockersByGateAliasField, 0, "gate0 status production blockers by-gate alias field should pass");
  assertEqual(productionBlockersByGateAliasField.stdout.trim(), "productionBlockersSummary.byGate", "production blockers by-gate alias should include nested path");

  const productionBlockersByGateCountField = await runStatus(["--field", "productionBlockersSummary.byGateCount"]);
  assertExit(productionBlockersByGateCountField, 0, "gate0 status production blockers by-gate count field should pass");
  assertEqual(productionBlockersByGateCountField.stdout.trim(), "5", "production blockers by-gate count should include count");

  const productionBlockersByGateCountAliasField = await runStatus(["--field", "productionBlockersSummary.byGateCountField"]);
  assertExit(productionBlockersByGateCountAliasField, 0, "gate0 status production blockers by-gate count alias field should pass");
  assertEqual(productionBlockersByGateCountAliasField.stdout.trim(), "productionBlockersSummary.byGateCount", "production blockers by-gate count alias should include nested path");

  const productionBlockersByGateKeysField = await runStatus(["--field", "productionBlockersSummary.byGateKeys"]);
  assertExit(productionBlockersByGateKeysField, 0, "gate0 status production blockers by-gate keys field should pass");
  assertIncludes(productionBlockersByGateKeysField.stdout, "gate1Prep", "production blockers by-gate keys field should include first gate key");
  assertIncludes(productionBlockersByGateKeysField.stdout, "gate4", "production blockers by-gate keys field should include last gate key");

  const productionBlockersByGateKeysAliasField = await runStatus(["--field", "productionBlockersSummary.byGateKeysField"]);
  assertExit(productionBlockersByGateKeysAliasField, 0, "gate0 status production blockers by-gate keys alias field should pass");
  assertEqual(productionBlockersByGateKeysAliasField.stdout.trim(), "productionBlockersSummary.byGateKeys", "production blockers by-gate keys alias should include nested path");

  const productionBlockersByGateLastIndexField = await runStatus(["--field", "productionBlockersSummary.byGateLastIndex"]);
  assertExit(productionBlockersByGateLastIndexField, 0, "gate0 status production blockers by-gate last index field should pass");
  assertEqual(productionBlockersByGateLastIndexField.stdout.trim(), "4", "production blockers by-gate last index should include last index");

  const productionBlockersByGateLastIndexAliasField = await runStatus(["--field", "productionBlockersSummary.byGateLastIndexField"]);
  assertExit(productionBlockersByGateLastIndexAliasField, 0, "gate0 status production blockers by-gate last index alias field should pass");
  assertEqual(productionBlockersByGateLastIndexAliasField.stdout.trim(), "productionBlockersSummary.byGateLastIndex", "production blockers by-gate last index alias should include nested path");

  const productionBlockersByGateFirstField = await runStatus(["--field", "productionBlockersSummary.byGateFirst"]);
  assertExit(productionBlockersByGateFirstField, 0, "gate0 status production blockers by-gate first field should pass");
  assertEqual(productionBlockersByGateFirstField.stdout.trim(), "gate1Prep", "production blockers by-gate first should include first key");

  const productionBlockersByGateFirstAliasField = await runStatus(["--field", "productionBlockersSummary.byGateFirstField"]);
  assertExit(productionBlockersByGateFirstAliasField, 0, "gate0 status production blockers by-gate first alias field should pass");
  assertEqual(productionBlockersByGateFirstAliasField.stdout.trim(), "productionBlockersSummary.byGateFirst", "production blockers by-gate first alias should include nested path");

  const productionBlockersByGateLastField = await runStatus(["--field", "productionBlockersSummary.byGateLast"]);
  assertExit(productionBlockersByGateLastField, 0, "gate0 status production blockers by-gate last field should pass");
  assertEqual(productionBlockersByGateLastField.stdout.trim(), "gate4", "production blockers by-gate last should include last key");

  const productionBlockersByGateLastAliasField = await runStatus(["--field", "productionBlockersSummary.byGateLastField"]);
  assertExit(productionBlockersByGateLastAliasField, 0, "gate0 status production blockers by-gate last alias field should pass");
  assertEqual(productionBlockersByGateLastAliasField.stdout.trim(), "productionBlockersSummary.byGateLast", "production blockers by-gate last alias should include nested path");

  const productionBlockersByGateRegistryStatusField = await runStatus(["--field", "productionBlockersSummary.byGateRegistryStatus"]);
  assertExit(productionBlockersByGateRegistryStatusField, 0, "gate0 status production blockers by-gate registry status field should pass");
  assertEqual(productionBlockersByGateRegistryStatusField.stdout.trim(), "consistent", "production blockers by-gate registry status should include status");

  const productionBlockersByGateRegistryStatusAliasField = await runStatus(["--field", "productionBlockersSummary.byGateRegistryStatusField"]);
  assertExit(productionBlockersByGateRegistryStatusAliasField, 0, "gate0 status production blockers by-gate registry status alias field should pass");
  assertEqual(productionBlockersByGateRegistryStatusAliasField.stdout.trim(), "productionBlockersSummary.byGateRegistryStatus", "production blockers by-gate registry status alias should include nested path");

  const productionBlockersByGateInvariantField = await runStatus(["--field", "productionBlockersSummary.byGateRegistryInvariant"]);
  assertExit(productionBlockersByGateInvariantField, 0, "gate0 status production blockers by-gate invariant field should pass");
  assertEqual(productionBlockersByGateInvariantField.stdout.trim(), "count=5,lastIndex=4", "production blockers by-gate invariant should include count and last index");

  const productionBlockersByGateInvariantAliasField = await runStatus(["--field", "productionBlockersSummary.byGateRegistryInvariantField"]);
  assertExit(productionBlockersByGateInvariantAliasField, 0, "gate0 status production blockers by-gate invariant alias field should pass");
  assertEqual(productionBlockersByGateInvariantAliasField.stdout.trim(), "productionBlockersSummary.byGateRegistryInvariant", "production blockers by-gate invariant alias should include nested path");

  const productionBlockersGateOrderField = await runStatus(["--field", "productionBlockersSummary.gateOrder"]);
  assertExit(productionBlockersGateOrderField, 0, "gate0 status production blockers gate order field should pass");
  assertIncludes(productionBlockersGateOrderField.stdout, "gate1", "production blockers gate order field should include Gate 1");
  assertIncludes(productionBlockersGateOrderField.stdout, "gate4", "production blockers gate order field should include Gate 4");

  const productionBlockersGateOrderAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderField"]);
  assertExit(productionBlockersGateOrderAliasField, 0, "gate0 status production blockers gate order alias field should pass");
  assertEqual(productionBlockersGateOrderAliasField.stdout.trim(), "productionBlockersSummary.gateOrder", "production blockers gate order alias should include nested path");

  const productionBlockersGateOrderFirstField = await runStatus(["--field", "productionBlockersSummary.gateOrder.0"]);
  assertExit(productionBlockersGateOrderFirstField, 0, "gate0 status production blockers first gate order field should pass");
  assertEqual(productionBlockersGateOrderFirstField.stdout.trim(), "gate1", "production blockers first gate order should include Gate 1");

  const productionBlockersGateOrderLastField = await runStatus(["--field", "productionBlockersSummary.gateOrder.3"]);
  assertExit(productionBlockersGateOrderLastField, 0, "gate0 status production blockers last gate order field should pass");
  assertEqual(productionBlockersGateOrderLastField.stdout.trim(), "gate4", "production blockers last gate order should include Gate 4");

  const productionBlockersGateOrderCountField = await runStatus(["--field", "productionBlockersSummary.gateOrderCount"]);
  assertExit(productionBlockersGateOrderCountField, 0, "gate0 status production blockers gate order count field should pass");
  assertEqual(productionBlockersGateOrderCountField.stdout.trim(), "4", "production blockers gate order count should include count");

  const productionBlockersGateOrderCountAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderCountField"]);
  assertExit(productionBlockersGateOrderCountAliasField, 0, "gate0 status production blockers gate order count alias field should pass");
  assertEqual(productionBlockersGateOrderCountAliasField.stdout.trim(), "productionBlockersSummary.gateOrderCount", "production blockers gate order count alias should include nested path");

  const productionBlockersGateOrderLastIndexField = await runStatus(["--field", "productionBlockersSummary.gateOrderLastIndex"]);
  assertExit(productionBlockersGateOrderLastIndexField, 0, "gate0 status production blockers gate order last index field should pass");
  assertEqual(productionBlockersGateOrderLastIndexField.stdout.trim(), "3", "production blockers gate order last index should include last index");

  const productionBlockersGateOrderLastIndexAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderLastIndexField"]);
  assertExit(productionBlockersGateOrderLastIndexAliasField, 0, "gate0 status production blockers gate order last index alias field should pass");
  assertEqual(productionBlockersGateOrderLastIndexAliasField.stdout.trim(), "productionBlockersSummary.gateOrderLastIndex", "production blockers gate order last index alias should include nested path");

  const productionBlockersGateOrderFirstValueField = await runStatus(["--field", "productionBlockersSummary.gateOrderFirst"]);
  assertExit(productionBlockersGateOrderFirstValueField, 0, "gate0 status production blockers gate order first field should pass");
  assertEqual(productionBlockersGateOrderFirstValueField.stdout.trim(), "gate1", "production blockers gate order first should include first gate");

  const productionBlockersGateOrderFirstAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderFirstField"]);
  assertExit(productionBlockersGateOrderFirstAliasField, 0, "gate0 status production blockers gate order first alias field should pass");
  assertEqual(productionBlockersGateOrderFirstAliasField.stdout.trim(), "productionBlockersSummary.gateOrderFirst", "production blockers gate order first alias should include nested path");

  const productionBlockersGateOrderLastValueField = await runStatus(["--field", "productionBlockersSummary.gateOrderLast"]);
  assertExit(productionBlockersGateOrderLastValueField, 0, "gate0 status production blockers gate order last field should pass");
  assertEqual(productionBlockersGateOrderLastValueField.stdout.trim(), "gate4", "production blockers gate order last should include last gate");

  const productionBlockersGateOrderLastAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderLastField"]);
  assertExit(productionBlockersGateOrderLastAliasField, 0, "gate0 status production blockers gate order last alias field should pass");
  assertEqual(productionBlockersGateOrderLastAliasField.stdout.trim(), "productionBlockersSummary.gateOrderLast", "production blockers gate order last alias should include nested path");

  const productionBlockersGateOrderRegistryStatusField = await runStatus(["--field", "productionBlockersSummary.gateOrderRegistryStatus"]);
  assertExit(productionBlockersGateOrderRegistryStatusField, 0, "gate0 status production blockers gate order registry status field should pass");
  assertEqual(productionBlockersGateOrderRegistryStatusField.stdout.trim(), "consistent", "production blockers gate order registry status should include status");

  const productionBlockersGateOrderRegistryStatusAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderRegistryStatusField"]);
  assertExit(productionBlockersGateOrderRegistryStatusAliasField, 0, "gate0 status production blockers gate order registry status alias field should pass");
  assertEqual(productionBlockersGateOrderRegistryStatusAliasField.stdout.trim(), "productionBlockersSummary.gateOrderRegistryStatus", "production blockers gate order registry status alias should include nested path");

  const productionBlockersGateOrderInvariantField = await runStatus(["--field", "productionBlockersSummary.gateOrderRegistryInvariant"]);
  assertExit(productionBlockersGateOrderInvariantField, 0, "gate0 status production blockers gate order invariant field should pass");
  assertEqual(productionBlockersGateOrderInvariantField.stdout.trim(), "count=4,lastIndex=3", "production blockers gate order invariant should include count and last index");

  const productionBlockersGateOrderInvariantAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderRegistryInvariantField"]);
  assertExit(productionBlockersGateOrderInvariantAliasField, 0, "gate0 status production blockers gate order invariant alias field should pass");
  assertEqual(productionBlockersGateOrderInvariantAliasField.stdout.trim(), "productionBlockersSummary.gateOrderRegistryInvariant", "production blockers gate order invariant alias should include nested path");

  const productionBlockersGateOrderDetailsField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetails"]);
  assertExit(productionBlockersGateOrderDetailsField, 0, "gate0 status production blockers gate order details field should pass");
  assertIncludes(productionBlockersGateOrderDetailsField.stdout, "\"key\": \"gate1\"", "production blockers gate order details field should include Gate 1 key");
  assertIncludes(productionBlockersGateOrderDetailsField.stdout, "\"docPath\": \"docs/dev/ROADMAP.md\"", "production blockers gate order details field should include final doc path");

  const productionBlockersGateOrderDetailsAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsField"]);
  assertExit(productionBlockersGateOrderDetailsAliasField, 0, "gate0 status production blockers gate order details alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetails", "production blockers gate order details alias should include nested path");

  const productionBlockersGateOrderDetailsCountField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsCount"]);
  assertExit(productionBlockersGateOrderDetailsCountField, 0, "gate0 status production blockers gate order details count field should pass");
  assertEqual(productionBlockersGateOrderDetailsCountField.stdout.trim(), "4", "production blockers gate order details count should include count");

  const productionBlockersGateOrderDetailsCountAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsCountField"]);
  assertExit(productionBlockersGateOrderDetailsCountAliasField, 0, "gate0 status production blockers gate order details count alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsCountAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsCount", "production blockers gate order details count alias should include nested path");

  const productionBlockersGateOrderDetailsLastIndexField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsLastIndex"]);
  assertExit(productionBlockersGateOrderDetailsLastIndexField, 0, "gate0 status production blockers gate order details last index field should pass");
  assertEqual(productionBlockersGateOrderDetailsLastIndexField.stdout.trim(), "3", "production blockers gate order details last index should include last index");

  const productionBlockersGateOrderDetailsLastIndexAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsLastIndexField"]);
  assertExit(productionBlockersGateOrderDetailsLastIndexAliasField, 0, "gate0 status production blockers gate order details last index alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsLastIndexAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsLastIndex", "production blockers gate order details last index alias should include nested path");

  const productionBlockersGateOrderDetailsRegistryStatusField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsRegistryStatus"]);
  assertExit(productionBlockersGateOrderDetailsRegistryStatusField, 0, "gate0 status production blockers gate order details registry status field should pass");
  assertEqual(productionBlockersGateOrderDetailsRegistryStatusField.stdout.trim(), "consistent", "production blockers gate order details registry status should include status");

  const productionBlockersGateOrderDetailsRegistryStatusAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsRegistryStatusField"]);
  assertExit(productionBlockersGateOrderDetailsRegistryStatusAliasField, 0, "gate0 status production blockers gate order details registry status alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsRegistryStatusAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsRegistryStatus", "production blockers gate order details registry status alias should include nested path");

  const productionBlockersGateOrderDetailsRegistryInvariantField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsRegistryInvariant"]);
  assertExit(productionBlockersGateOrderDetailsRegistryInvariantField, 0, "gate0 status production blockers gate order details registry invariant field should pass");
  assertEqual(productionBlockersGateOrderDetailsRegistryInvariantField.stdout.trim(), "count=4,lastIndex=3", "production blockers gate order details registry invariant should include invariant");

  const productionBlockersGateOrderDetailsRegistryInvariantAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsRegistryInvariantField"]);
  assertExit(productionBlockersGateOrderDetailsRegistryInvariantAliasField, 0, "gate0 status production blockers gate order details registry invariant alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsRegistryInvariantAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsRegistryInvariant", "production blockers gate order details registry invariant alias should include nested path");

  const productionBlockersGateOrderFirstDetailDocField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetails.0.docPath"]);
  assertExit(productionBlockersGateOrderFirstDetailDocField, 0, "gate0 status production blockers first gate order detail doc field should pass");
  assertEqual(productionBlockersGateOrderFirstDetailDocField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md", "production blockers first gate order detail doc should include Gate 1 doc");

  const productionBlockersGateOrderDetailsFirstField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsFirst"]);
  assertExit(productionBlockersGateOrderDetailsFirstField, 0, "gate0 status production blockers gate order details first field should pass");
  assertEqual(productionBlockersGateOrderDetailsFirstField.stdout.trim(), "gate1", "production blockers gate order details first should include first key");

  const productionBlockersGateOrderDetailsFirstAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsFirstField"]);
  assertExit(productionBlockersGateOrderDetailsFirstAliasField, 0, "gate0 status production blockers gate order details first alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsFirstAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsFirst", "production blockers gate order details first alias should include nested path");

  const productionBlockersGateOrderLastDetailKeyField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetails.3.key"]);
  assertExit(productionBlockersGateOrderLastDetailKeyField, 0, "gate0 status production blockers last gate order detail key field should pass");
  assertEqual(productionBlockersGateOrderLastDetailKeyField.stdout.trim(), "gate4", "production blockers last gate order detail key should include Gate 4 key");

  const productionBlockersGateOrderDetailsLastField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsLast"]);
  assertExit(productionBlockersGateOrderDetailsLastField, 0, "gate0 status production blockers gate order details last field should pass");
  assertEqual(productionBlockersGateOrderDetailsLastField.stdout.trim(), "gate4", "production blockers gate order details last should include last key");

  const productionBlockersGateOrderDetailsLastAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsLastField"]);
  assertExit(productionBlockersGateOrderDetailsLastAliasField, 0, "gate0 status production blockers gate order details last alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsLastAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsLast", "production blockers gate order details last alias should include nested path");

  const productionBlockersGateOrderDetailsSummaryField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsSummary"]);
  assertExit(productionBlockersGateOrderDetailsSummaryField, 0, "gate0 status production blockers gate order detail summary field should pass");
  assertEqual(productionBlockersGateOrderDetailsSummaryField.stdout.trim(), "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "production blockers gate order detail summary should include compact gate docs");

  const productionBlockersGateOrderDetailsSummaryAliasField = await runStatus(["--field", "productionBlockersSummary.gateOrderDetailsSummaryField"]);
  assertExit(productionBlockersGateOrderDetailsSummaryAliasField, 0, "gate0 status production blockers gate order detail summary alias field should pass");
  assertEqual(productionBlockersGateOrderDetailsSummaryAliasField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsSummary", "production blockers gate order detail summary alias should include nested path");

  const productionBlockersGate1PrepBlockerField = await runStatus(["--field", "productionBlockersSummary.byGate.gate1Prep.blocker"]);
  assertExit(productionBlockersGate1PrepBlockerField, 0, "gate0 status production blockers Gate 1 prep blocker field should pass");
  assertEqual(productionBlockersGate1PrepBlockerField.stdout.trim(), "Real auth/provider/storage integrations.", "production blockers Gate 1 prep blocker field should include auth/provider/storage blocker");

  const productionBlockersGate1PrepDocField = await runStatus(["--field", "productionBlockersSummary.byGate.gate1Prep.docPath"]);
  assertExit(productionBlockersGate1PrepDocField, 0, "gate0 status production blockers Gate 1 prep doc field should pass");
  assertEqual(productionBlockersGate1PrepDocField.stdout.trim(), "docs/dev/PRODUCTION_GAPS.md", "production blockers Gate 1 prep doc field should include production gaps doc path");

  const productionBlockersGate1BlockerField = await runStatus(["--field", "productionBlockersSummary.byGate.gate1.blocker"]);
  assertExit(productionBlockersGate1BlockerField, 0, "gate0 status production blockers Gate 1 blocker field should pass");
  assertEqual(productionBlockersGate1BlockerField.stdout.trim(), "Production backend persistence.", "production blockers Gate 1 blocker field should include persistence blocker");

  const productionBlockersGate1DocField = await runStatus(["--field", "productionBlockersSummary.byGate.gate1.docPath"]);
  assertExit(productionBlockersGate1DocField, 0, "gate0 status production blockers Gate 1 doc field should pass");
  assertEqual(productionBlockersGate1DocField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md", "production blockers Gate 1 doc field should include persistence doc path");

  const productionBlockersGate2BlockerField = await runStatus(["--field", "productionBlockersSummary.byGate.gate2.blocker"]);
  assertExit(productionBlockersGate2BlockerField, 0, "gate0 status production blockers Gate 2 blocker field should pass");
  assertEqual(productionBlockersGate2BlockerField.stdout.trim(), "AWS CI/deploy pipeline.", "production blockers Gate 2 blocker field should include CI blocker");

  const productionBlockersGate2DocField = await runStatus(["--field", "productionBlockersSummary.byGate.gate2.docPath"]);
  assertExit(productionBlockersGate2DocField, 0, "gate0 status production blockers Gate 2 doc field should pass");
  assertEqual(productionBlockersGate2DocField.stdout.trim(), "docs/dev/CI.md", "production blockers Gate 2 doc field should include CI doc path");

  const productionBlockersGate3BlockerField = await runStatus(["--field", "productionBlockersSummary.byGate.gate3.blocker"]);
  assertExit(productionBlockersGate3BlockerField, 0, "gate0 status production blockers Gate 3 blocker field should pass");
  assertEqual(productionBlockersGate3BlockerField.stdout.trim(), "Formal Figma/DESIGN.md source of truth.", "production blockers Gate 3 blocker field should include Figma blocker");

  const productionBlockersGate3DocField = await runStatus(["--field", "productionBlockersSummary.byGate.gate3.docPath"]);
  assertExit(productionBlockersGate3DocField, 0, "gate0 status production blockers Gate 3 doc field should pass");
  assertEqual(productionBlockersGate3DocField.stdout.trim(), "docs/dev/DESIGN_STATUS.md", "production blockers Gate 3 doc field should include design status doc path");

  const productionBlockersGate4BlockerField = await runStatus(["--field", "productionBlockersSummary.byGate.gate4.blocker"]);
  assertExit(productionBlockersGate4BlockerField, 0, "gate0 status production blockers Gate 4 blocker field should pass");
  assertEqual(productionBlockersGate4BlockerField.stdout.trim(), "App store/release build signing.", "production blockers Gate 4 blocker field should include release blocker");

  const productionBlockersGate4DocField = await runStatus(["--field", "productionBlockersSummary.byGate.gate4.docPath"]);
  assertExit(productionBlockersGate4DocField, 0, "gate0 status production blockers Gate 4 doc field should pass");
  assertEqual(productionBlockersGate4DocField.stdout.trim(), "docs/dev/ROADMAP.md", "production blockers Gate 4 doc field should include roadmap doc path");

  const relatedDocsField = await runStatus(["--field", "relatedDocs"]);
  assertExit(relatedDocsField, 0, "gate0 status related docs field should pass");
  assertIncludes(relatedDocsField.stdout, "ROADMAP.md", "related docs field should include roadmap");

  const relatedDocsFirstField = await runStatus(["--field", "relatedDocs.0"]);
  assertExit(relatedDocsFirstField, 0, "gate0 status first related doc field should pass");
  assertEqual(relatedDocsFirstField.stdout.trim(), "CI.md", "first related doc field should include CI doc");

  const relatedDocsLastField = await runStatus(["--field", "relatedDocs.4"]);
  assertExit(relatedDocsLastField, 0, "gate0 status last related doc field should pass");
  assertEqual(relatedDocsLastField.stdout.trim(), "ROADMAP.md", "last related doc field should include roadmap doc");

  const relatedDocCountField = await runStatus(["--field", "relatedDocCount"]);
  assertExit(relatedDocCountField, 0, "gate0 status related doc count field should pass");
  assertEqual(relatedDocCountField.stdout.trim(), "5", "related doc count field should include count");

  const relatedDocCountAliasField = await runStatus(["--field", "relatedDocCountField"]);
  assertExit(relatedDocCountAliasField, 0, "gate0 status related doc count alias field should pass");
  assertEqual(relatedDocCountAliasField.stdout.trim(), "relatedDocCount", "related doc count alias field should include top-level path");

  const relatedDocFirstField = await runStatus(["--field", "relatedDocFirst"]);
  assertExit(relatedDocFirstField, 0, "gate0 status related doc first field should pass");
  assertEqual(relatedDocFirstField.stdout.trim(), "CI.md", "related doc first field should include CI doc");

  const relatedDocFirstAliasField = await runStatus(["--field", "relatedDocFirstField"]);
  assertExit(relatedDocFirstAliasField, 0, "gate0 status related doc first alias field should pass");
  assertEqual(relatedDocFirstAliasField.stdout.trim(), "relatedDocFirst", "related doc first alias field should include top-level path");

  const relatedDocLastIndexField = await runStatus(["--field", "relatedDocLastIndex"]);
  assertExit(relatedDocLastIndexField, 0, "gate0 status related doc last index field should pass");
  assertEqual(relatedDocLastIndexField.stdout.trim(), "4", "related doc last index field should include last index");

  const relatedDocLastIndexAliasField = await runStatus(["--field", "relatedDocLastIndexField"]);
  assertExit(relatedDocLastIndexAliasField, 0, "gate0 status related doc last index alias field should pass");
  assertEqual(relatedDocLastIndexAliasField.stdout.trim(), "relatedDocLastIndex", "related doc last index alias field should include top-level path");

  const relatedDocLastField = await runStatus(["--field", "relatedDocLast"]);
  assertExit(relatedDocLastField, 0, "gate0 status related doc last field should pass");
  assertEqual(relatedDocLastField.stdout.trim(), "ROADMAP.md", "related doc last field should include roadmap doc");

  const relatedDocLastAliasField = await runStatus(["--field", "relatedDocLastField"]);
  assertExit(relatedDocLastAliasField, 0, "gate0 status related doc last alias field should pass");
  assertEqual(relatedDocLastAliasField.stdout.trim(), "relatedDocLast", "related doc last alias field should include top-level path");

  const relatedDocSummaryField = await runStatus(["--field", "relatedDocSummary"]);
  assertExit(relatedDocSummaryField, 0, "gate0 status related doc summary field should pass");
  assertEqual(relatedDocSummaryField.stdout.trim(), "5 docs, first=CI.md, last=ROADMAP.md", "related doc summary field should include compact summary");

  const relatedDocSummaryAliasField = await runStatus(["--field", "relatedDocSummaryField"]);
  assertExit(relatedDocSummaryAliasField, 0, "gate0 status related doc summary alias field should pass");
  assertEqual(relatedDocSummaryAliasField.stdout.trim(), "relatedDocSummary", "related doc summary alias field should include top-level path");

  const persistenceDefaultField = await runStatus(["--field", "persistenceModeDefault"]);
  assertExit(persistenceDefaultField, 0, "gate0 status persistence default field should pass");
  assertEqual(persistenceDefaultField.stdout.trim(), "fixture", "persistence default field should include fixture");

  const persistenceDefaultAliasField = await runStatus(["--field", "persistenceModeDefaultField"]);
  assertExit(persistenceDefaultAliasField, 0, "gate0 status persistence default alias field should pass");
  assertEqual(persistenceDefaultAliasField.stdout.trim(), "persistenceModeDefault", "persistence default alias field should include top-level path");

  const supportedPersistenceModesField = await runStatus(["--field", "supportedPersistenceModes"]);
  assertExit(supportedPersistenceModesField, 0, "gate0 status supported persistence modes field should pass");
  assertIncludes(supportedPersistenceModesField.stdout, "fixture", "supported persistence modes field should include fixture");
  assertIncludes(supportedPersistenceModesField.stdout, "database", "supported persistence modes field should include database");

  const supportedPersistenceModeFirstIndexField = await runStatus(["--field", "supportedPersistenceModes.0"]);
  assertExit(supportedPersistenceModeFirstIndexField, 0, "gate0 status first supported persistence mode index field should pass");
  assertEqual(supportedPersistenceModeFirstIndexField.stdout.trim(), "fixture", "first supported persistence mode index field should include fixture");

  const supportedPersistenceModeLastIndexValueField = await runStatus(["--field", "supportedPersistenceModes.1"]);
  assertExit(supportedPersistenceModeLastIndexValueField, 0, "gate0 status last supported persistence mode index field should pass");
  assertEqual(supportedPersistenceModeLastIndexValueField.stdout.trim(), "database", "last supported persistence mode index field should include database");

  const supportedPersistenceModeCountField = await runStatus(["--field", "supportedPersistenceModeCount"]);
  assertExit(supportedPersistenceModeCountField, 0, "gate0 status supported persistence mode count field should pass");
  assertEqual(supportedPersistenceModeCountField.stdout.trim(), "2", "supported persistence mode count field should include count");

  const supportedPersistenceModeCountAliasField = await runStatus(["--field", "supportedPersistenceModeCountField"]);
  assertExit(supportedPersistenceModeCountAliasField, 0, "gate0 status supported persistence mode count alias field should pass");
  assertEqual(supportedPersistenceModeCountAliasField.stdout.trim(), "supportedPersistenceModeCount", "supported persistence mode count alias field should include top-level path");

  const supportedPersistenceModeFirstField = await runStatus(["--field", "supportedPersistenceModeFirst"]);
  assertExit(supportedPersistenceModeFirstField, 0, "gate0 status supported persistence mode first field should pass");
  assertEqual(supportedPersistenceModeFirstField.stdout.trim(), "fixture", "supported persistence mode first field should include fixture");

  const supportedPersistenceModeFirstAliasField = await runStatus(["--field", "supportedPersistenceModeFirstField"]);
  assertExit(supportedPersistenceModeFirstAliasField, 0, "gate0 status supported persistence mode first alias field should pass");
  assertEqual(supportedPersistenceModeFirstAliasField.stdout.trim(), "supportedPersistenceModeFirst", "supported persistence mode first alias field should include top-level path");

  const supportedPersistenceModeLastIndexField = await runStatus(["--field", "supportedPersistenceModeLastIndex"]);
  assertExit(supportedPersistenceModeLastIndexField, 0, "gate0 status supported persistence mode last index field should pass");
  assertEqual(supportedPersistenceModeLastIndexField.stdout.trim(), "1", "supported persistence mode last index field should include last index");

  const supportedPersistenceModeLastIndexAliasField = await runStatus(["--field", "supportedPersistenceModeLastIndexField"]);
  assertExit(supportedPersistenceModeLastIndexAliasField, 0, "gate0 status supported persistence mode last index alias field should pass");
  assertEqual(supportedPersistenceModeLastIndexAliasField.stdout.trim(), "supportedPersistenceModeLastIndex", "supported persistence mode last index alias field should include top-level path");

  const supportedPersistenceModeLastField = await runStatus(["--field", "supportedPersistenceModeLast"]);
  assertExit(supportedPersistenceModeLastField, 0, "gate0 status supported persistence mode last field should pass");
  assertEqual(supportedPersistenceModeLastField.stdout.trim(), "database", "supported persistence mode last field should include database");

  const supportedPersistenceModeLastAliasField = await runStatus(["--field", "supportedPersistenceModeLastField"]);
  assertExit(supportedPersistenceModeLastAliasField, 0, "gate0 status supported persistence mode last alias field should pass");
  assertEqual(supportedPersistenceModeLastAliasField.stdout.trim(), "supportedPersistenceModeLast", "supported persistence mode last alias field should include top-level path");

  const supportedPersistenceModeSummaryField = await runStatus(["--field", "supportedPersistenceModeSummary"]);
  assertExit(supportedPersistenceModeSummaryField, 0, "gate0 status supported persistence mode summary field should pass");
  assertEqual(supportedPersistenceModeSummaryField.stdout.trim(), "2 modes, default=fixture, first=fixture, last=database", "supported persistence mode summary field should include compact summary");

  const supportedPersistenceModeSummaryAliasField = await runStatus(["--field", "supportedPersistenceModeSummaryField"]);
  assertExit(supportedPersistenceModeSummaryAliasField, 0, "gate0 status supported persistence mode summary alias field should pass");
  assertEqual(supportedPersistenceModeSummaryAliasField.stdout.trim(), "supportedPersistenceModeSummary", "supported persistence mode summary alias field should include top-level path");

  const nextGateDocField = await runStatus(["--field", "nextGateDoc"]);
  assertExit(nextGateDocField, 0, "gate0 status next gate doc field should pass");
  assertEqual(nextGateDocField.stdout.trim(), "GATE1_PERSISTENCE.md", "next gate doc field should include Gate 1 persistence doc");

  const nextGateAliasField = await runStatus(["--field", "nextGateField"]);
  assertExit(nextGateAliasField, 0, "gate0 status next gate alias field should pass");
  assertEqual(nextGateAliasField.stdout.trim(), "nextGate", "next gate alias field should include top-level path");

  const nextGateDocAliasField = await runStatus(["--field", "nextGateDocField"]);
  assertExit(nextGateDocAliasField, 0, "gate0 status next gate doc alias field should pass");
  assertEqual(nextGateDocAliasField.stdout.trim(), "nextGateDoc", "next gate doc alias field should include top-level path");

  const nextGateDocPathField = await runStatus(["--field", "nextGateDocPath"]);
  assertExit(nextGateDocPathField, 0, "gate0 status next gate doc path field should pass");
  assertEqual(nextGateDocPathField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md", "next gate doc path field should include Gate 1 persistence doc path");

  const nextGateDocPathAliasField = await runStatus(["--field", "nextGateDocPathField"]);
  assertExit(nextGateDocPathAliasField, 0, "gate0 status next gate doc path alias field should pass");
  assertEqual(nextGateDocPathAliasField.stdout.trim(), "nextGateDocPath", "next gate doc path alias field should include top-level path");

  const nextGateCommandField = await runStatus(["--field", "nextGateCommand"]);
  assertExit(nextGateCommandField, 0, "gate0 status next gate command field should pass");
  assertEqual(nextGateCommandField.stdout.trim(), "npm run gate0:status -- --field nextGateDocPath", "next gate command field should include command");

  const nextGateCommandAliasField = await runStatus(["--field", "nextGateCommandField"]);
  assertExit(nextGateCommandAliasField, 0, "gate0 status next gate command alias field should pass");
  assertEqual(nextGateCommandAliasField.stdout.trim(), "nextGateCommand", "next gate command alias field should include top-level path");

  const nextGateSummaryField = await runStatus(["--field", "nextGateSummary"]);
  assertExit(nextGateSummaryField, 0, "gate0 status next gate summary field should pass");
  assertEqual(nextGateSummaryField.stdout.trim(), "Gate 1 production backend persistence -> docs/dev/GATE1_PERSISTENCE.md", "next gate summary field should include compact summary");

  const nextGateCheckCommandField = await runStatus(["--field", "nextGateCheckCommand"]);
  assertExit(nextGateCheckCommandField, 0, "gate0 status next gate check command field should pass");
  assertEqual(nextGateCheckCommandField.stdout.trim(), "npm run db:check", "next gate check command field should include db check command");

  const nextGateCheckCommandAliasField = await runStatus(["--field", "nextGateCheckCommandField"]);
  assertExit(nextGateCheckCommandAliasField, 0, "gate0 status next gate check command alias field should pass");
  assertEqual(nextGateCheckCommandAliasField.stdout.trim(), "nextGateCheckCommand", "next gate check command alias field should include top-level path");

  const nextGateCheckJsonCommandField = await runStatus(["--field", "nextGateCheckJsonCommand"]);
  assertExit(nextGateCheckJsonCommandField, 0, "gate0 status next gate check JSON command field should pass");
  assertEqual(nextGateCheckJsonCommandField.stdout.trim(), "npm run db:check -- --json", "next gate check JSON command field should include db check JSON command");

  const nextGateCheckJsonCommandAliasField = await runStatus(["--field", "nextGateCheckJsonCommandField"]);
  assertExit(nextGateCheckJsonCommandAliasField, 0, "gate0 status next gate check JSON command alias field should pass");
  assertEqual(nextGateCheckJsonCommandAliasField.stdout.trim(), "nextGateCheckJsonCommand", "next gate check JSON command alias field should include top-level path");

  const nextGateCheckCommandSummaryField = await runStatus(["--field", "nextGateCheckCommandSummary"]);
  assertExit(nextGateCheckCommandSummaryField, 0, "gate0 status next gate check command summary field should pass");
  assertEqual(nextGateCheckCommandSummaryField.stdout.trim(), "npm run db:check | npm run db:check -- --json", "next gate check command summary field should include compact summary");

  const nextGateMigrationStatusCommandField = await runStatus(["--field", "nextGateMigrationStatusCommand"]);
  assertExit(nextGateMigrationStatusCommandField, 0, "gate0 status next gate migration status command field should pass");
  assertEqual(nextGateMigrationStatusCommandField.stdout.trim(), "npm run db:check -- --field migrationStatus", "next gate migration status command field should include migration status command");

  const nextGateMigrationStatusCommandAliasField = await runStatus(["--field", "nextGateMigrationStatusCommandField"]);
  assertExit(nextGateMigrationStatusCommandAliasField, 0, "gate0 status next gate migration status command alias field should pass");
  assertEqual(nextGateMigrationStatusCommandAliasField.stdout.trim(), "nextGateMigrationStatusCommand", "next gate migration status command alias field should include field name");

  const nextGateMigrationStatusField = await runStatus(["--field", "nextGateMigrationStatus"]);
  assertExit(nextGateMigrationStatusField, 0, "gate0 status next gate migration status field should pass");
  assertIncludes(nextGateMigrationStatusField.stdout, "\"currentExpectedStatus\": \"scaffolded\"", "next gate migration status field should include current expected status");
  assertIncludes(nextGateMigrationStatusField.stdout, "\"nextExpectedStatus\": \"database_read_parity\"", "next gate migration status field should include next expected status");

  const nextGateMigrationStatusAliasField = await runStatus(["--field", "nextGateMigrationStatusField"]);
  assertExit(nextGateMigrationStatusAliasField, 0, "gate0 status next gate migration status alias field should pass");
  assertEqual(nextGateMigrationStatusAliasField.stdout.trim(), "nextGateMigrationStatus", "next gate migration status alias field should include object field name");

  const nextGateMigrationStatusNestedField = await runStatus(["--field", "nextGateMigrationStatus.currentExpectedStatus"]);
  assertExit(nextGateMigrationStatusNestedField, 0, "gate0 status next gate migration status nested field should pass");
  assertEqual(nextGateMigrationStatusNestedField.stdout.trim(), "scaffolded", "next gate migration status nested field should include current expected status");

  const nextGateMigrationStatusCurrentAliasField = await runStatus(["--field", "nextGateMigrationStatusCurrentExpectedStatusField"]);
  assertExit(nextGateMigrationStatusCurrentAliasField, 0, "gate0 status next gate migration status current alias field should pass");
  assertEqual(nextGateMigrationStatusCurrentAliasField.stdout.trim(), "nextGateMigrationStatus.currentExpectedStatus", "next gate migration status current alias field should include nested field name");

  const nextGateMigrationStatusNextField = await runStatus(["--field", "nextGateMigrationStatus.nextExpectedStatus"]);
  assertExit(nextGateMigrationStatusNextField, 0, "gate0 status next gate migration status next field should pass");
  assertEqual(nextGateMigrationStatusNextField.stdout.trim(), "database_read_parity", "next gate migration status next field should include target expected status");

  const nextGateMigrationStatusNextAliasField = await runStatus(["--field", "nextGateMigrationStatusNextExpectedStatusField"]);
  assertExit(nextGateMigrationStatusNextAliasField, 0, "gate0 status next gate migration status next alias field should pass");
  assertEqual(nextGateMigrationStatusNextAliasField.stdout.trim(), "nextGateMigrationStatus.nextExpectedStatus", "next gate migration status next alias field should include nested field name");

  const nextGateMigrationStatusGuardField = await runStatus(["--field", "nextGateMigrationStatus.guardCommand"]);
  assertExit(nextGateMigrationStatusGuardField, 0, "gate0 status next gate migration status guard field should pass");
  assertEqual(nextGateMigrationStatusGuardField.stdout.trim(), "npm run not-scaffolded:test", "next gate migration status guard field should include guard command");

  const nextGateMigrationStatusGuardAliasField = await runStatus(["--field", "nextGateMigrationStatusGuardCommandField"]);
  assertExit(nextGateMigrationStatusGuardAliasField, 0, "gate0 status next gate migration status guard alias field should pass");
  assertEqual(nextGateMigrationStatusGuardAliasField.stdout.trim(), "nextGateMigrationStatus.guardCommand", "next gate migration status guard alias field should include nested field name");

  const nextGateMigrationStatusSummaryField = await runStatus(["--field", "nextGateMigrationStatusSummary"]);
  assertExit(nextGateMigrationStatusSummaryField, 0, "gate0 status next gate migration status summary field should pass");
  assertEqual(nextGateMigrationStatusSummaryField.stdout.trim(), "scaffolded -> database_read_parity", "next gate migration status summary field should include transition summary");

  const nextGateMigrationStatusSummaryAliasField = await runStatus(["--field", "nextGateMigrationStatusSummaryField"]);
  assertExit(nextGateMigrationStatusSummaryAliasField, 0, "gate0 status next gate migration status summary alias field should pass");
  assertEqual(nextGateMigrationStatusSummaryAliasField.stdout.trim(), "nextGateMigrationStatusSummary", "next gate migration status summary alias field should include field name");

  const nextGateDatabaseUrlStatusCommandField = await runStatus(["--field", "nextGateDatabaseUrlStatusCommand"]);
  assertExit(nextGateDatabaseUrlStatusCommandField, 0, "gate0 status next gate database URL status command field should pass");
  assertEqual(nextGateDatabaseUrlStatusCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlStatus", "next gate database URL status command field should include database URL status command");

  const nextGateDatabaseUrlStatusCommandAliasField = await runStatus(["--field", "nextGateDatabaseUrlStatusCommandField"]);
  assertExit(nextGateDatabaseUrlStatusCommandAliasField, 0, "gate0 status next gate database URL status command alias field should pass");
  assertEqual(nextGateDatabaseUrlStatusCommandAliasField.stdout.trim(), "nextGateDatabaseUrlStatusCommand", "next gate database URL status command alias field should include field name");

  const nextGateDatabaseUrlProtocolCommandField = await runStatus(["--field", "nextGateDatabaseUrlProtocolCommand"]);
  assertExit(nextGateDatabaseUrlProtocolCommandField, 0, "gate0 status next gate database URL protocol command field should pass");
  assertEqual(nextGateDatabaseUrlProtocolCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlProtocol", "next gate database URL protocol command field should include database URL protocol command");

  const nextGateDatabaseUrlProtocolCommandAliasField = await runStatus(["--field", "nextGateDatabaseUrlProtocolCommandField"]);
  assertExit(nextGateDatabaseUrlProtocolCommandAliasField, 0, "gate0 status next gate database URL protocol command alias field should pass");
  assertEqual(nextGateDatabaseUrlProtocolCommandAliasField.stdout.trim(), "nextGateDatabaseUrlProtocolCommand", "next gate database URL protocol command alias field should include field name");

  const nextGateDatabaseUrlValidationCommandField = await runStatus(["--field", "nextGateDatabaseUrlValidationCommand"]);
  assertExit(nextGateDatabaseUrlValidationCommandField, 0, "gate0 status next gate database URL validation command field should pass");
  assertEqual(nextGateDatabaseUrlValidationCommandField.stdout.trim(), "$env:DATABASE_URL='<postgresql-url>'; npm run db:check -- --field databaseUrlStatus; npm run db:check -- --field databaseUrlProtocol; Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue", "next gate database URL validation command field should include safe placeholder command");

  const nextGateDatabaseUrlValidationCommandAliasField = await runStatus(["--field", "nextGateDatabaseUrlValidationCommandField"]);
  assertExit(nextGateDatabaseUrlValidationCommandAliasField, 0, "gate0 status next gate database URL validation command alias field should pass");
  assertEqual(nextGateDatabaseUrlValidationCommandAliasField.stdout.trim(), "nextGateDatabaseUrlValidationCommand", "next gate database URL validation command alias field should include field name");

  const nextGateDatabaseUrlExpectedStatusField = await runStatus(["--field", "nextGateDatabaseUrlExpectedStatus"]);
  assertExit(nextGateDatabaseUrlExpectedStatusField, 0, "gate0 status next gate database URL expected status field should pass");
  assertEqual(nextGateDatabaseUrlExpectedStatusField.stdout.trim(), "valid", "next gate database URL expected status field should include valid");

  const nextGateDatabaseUrlExpectedStatusAliasField = await runStatus(["--field", "nextGateDatabaseUrlExpectedStatusField"]);
  assertExit(nextGateDatabaseUrlExpectedStatusAliasField, 0, "gate0 status next gate database URL expected status alias field should pass");
  assertEqual(nextGateDatabaseUrlExpectedStatusAliasField.stdout.trim(), "nextGateDatabaseUrlExpectedStatus", "next gate database URL expected status alias field should include field name");

  const nextGateDatabaseUrlExpectedProtocolsField = await runStatus(["--field", "nextGateDatabaseUrlExpectedProtocols"]);
  assertExit(nextGateDatabaseUrlExpectedProtocolsField, 0, "gate0 status next gate database URL expected protocols field should pass");
  assertIncludes(nextGateDatabaseUrlExpectedProtocolsField.stdout, "postgresql", "next gate database URL expected protocols field should include postgresql");
  assertIncludes(nextGateDatabaseUrlExpectedProtocolsField.stdout, "postgres", "next gate database URL expected protocols field should include postgres");

  const nextGateDatabaseUrlExpectedProtocolsAliasField = await runStatus(["--field", "nextGateDatabaseUrlExpectedProtocolsField"]);
  assertExit(nextGateDatabaseUrlExpectedProtocolsAliasField, 0, "gate0 status next gate database URL expected protocols alias field should pass");
  assertEqual(nextGateDatabaseUrlExpectedProtocolsAliasField.stdout.trim(), "nextGateDatabaseUrlExpectedProtocols", "next gate database URL expected protocols alias field should include field name");

  const nextGateDatabaseUrlField = await runStatus(["--field", "nextGateDatabaseUrl"]);
  assertExit(nextGateDatabaseUrlField, 0, "gate0 status next gate database URL field should pass");
  assertIncludes(nextGateDatabaseUrlField.stdout, "\"statusCommand\": \"npm run db:check -- --field databaseUrlStatus\"", "next gate database URL field should include status command");
  assertIncludes(nextGateDatabaseUrlField.stdout, "\"protocolCommand\": \"npm run db:check -- --field databaseUrlProtocol\"", "next gate database URL field should include protocol command");
  assertIncludes(nextGateDatabaseUrlField.stdout, "\"expectedStatus\": \"valid\"", "next gate database URL field should include expected status");
  assertIncludes(nextGateDatabaseUrlField.stdout, "\"postgresql\"", "next gate database URL field should include postgresql");
  assertIncludes(nextGateDatabaseUrlField.stdout, "\"postgres\"", "next gate database URL field should include postgres");

  const nextGateDatabaseUrlAliasField = await runStatus(["--field", "nextGateDatabaseUrlField"]);
  assertExit(nextGateDatabaseUrlAliasField, 0, "gate0 status next gate database URL alias field should pass");
  assertEqual(nextGateDatabaseUrlAliasField.stdout.trim(), "nextGateDatabaseUrl", "next gate database URL alias field should include object field name");

  const nextGateDatabaseUrlNestedField = await runStatus(["--field", "nextGateDatabaseUrl.expectedStatus"]);
  assertExit(nextGateDatabaseUrlNestedField, 0, "gate0 status next gate database URL nested field should pass");
  assertEqual(nextGateDatabaseUrlNestedField.stdout.trim(), "valid", "next gate database URL nested field should include expected status");

  const nextGateDatabaseUrlExpectedStatusNestedAliasField = await runStatus(["--field", "nextGateDatabaseUrlExpectedStatusNestedField"]);
  assertExit(nextGateDatabaseUrlExpectedStatusNestedAliasField, 0, "gate0 status next gate database URL expected status nested alias field should pass");
  assertEqual(nextGateDatabaseUrlExpectedStatusNestedAliasField.stdout.trim(), "nextGateDatabaseUrl.expectedStatus", "next gate database URL expected status nested alias field should include nested field name");

  const nextGateDatabaseUrlExpectedProtocolsNestedField = await runStatus(["--field", "nextGateDatabaseUrl.expectedProtocols"]);
  assertExit(nextGateDatabaseUrlExpectedProtocolsNestedField, 0, "gate0 status next gate database URL expected protocols nested field should pass");
  assertIncludes(nextGateDatabaseUrlExpectedProtocolsNestedField.stdout, "postgresql", "next gate database URL expected protocols nested field should include postgresql");
  assertIncludes(nextGateDatabaseUrlExpectedProtocolsNestedField.stdout, "postgres", "next gate database URL expected protocols nested field should include postgres");

  const nextGateDatabaseUrlExpectedProtocolsNestedAliasField = await runStatus(["--field", "nextGateDatabaseUrlExpectedProtocolsNestedField"]);
  assertExit(nextGateDatabaseUrlExpectedProtocolsNestedAliasField, 0, "gate0 status next gate database URL expected protocols nested alias field should pass");
  assertEqual(nextGateDatabaseUrlExpectedProtocolsNestedAliasField.stdout.trim(), "nextGateDatabaseUrl.expectedProtocols", "next gate database URL expected protocols nested alias field should include nested field name");

  const nextGateDatabaseUrlSummaryField = await runStatus(["--field", "nextGateDatabaseUrlSummary"]);
  assertExit(nextGateDatabaseUrlSummaryField, 0, "gate0 status next gate database URL summary field should pass");
  assertEqual(nextGateDatabaseUrlSummaryField.stdout.trim(), "valid postgresql|postgres", "next gate database URL summary field should include compact summary");

  const nextGateDatabaseUrlSummaryAliasField = await runStatus(["--field", "nextGateDatabaseUrlSummaryField"]);
  assertExit(nextGateDatabaseUrlSummaryAliasField, 0, "gate0 status next gate database URL summary alias field should pass");
  assertEqual(nextGateDatabaseUrlSummaryAliasField.stdout.trim(), "nextGateDatabaseUrlSummary", "next gate database URL summary alias field should include field name");

  const nextGatePrismaScaffoldField = await runStatus(["--field", "nextGatePrismaScaffold"]);
  assertExit(nextGatePrismaScaffoldField, 0, "gate0 status next gate Prisma scaffold field should pass");
  assertIncludes(nextGatePrismaScaffoldField.stdout, "\"schemaPath\": \"apps/api/prisma/schema.prisma\"", "next gate Prisma scaffold field should include schema path");
  assertIncludes(nextGatePrismaScaffoldField.stdout, "\"migrationsPath\": \"apps/api/prisma/migrations\"", "next gate Prisma scaffold field should include migrations path");
  assertIncludes(nextGatePrismaScaffoldField.stdout, "\"expectedPresent\": true", "next gate Prisma scaffold field should include expected presence");

  const nextGatePrismaScaffoldAliasField = await runStatus(["--field", "nextGatePrismaScaffoldField"]);
  assertExit(nextGatePrismaScaffoldAliasField, 0, "gate0 status next gate Prisma scaffold alias field should pass");
  assertEqual(nextGatePrismaScaffoldAliasField.stdout.trim(), "nextGatePrismaScaffold", "next gate Prisma scaffold alias field should include object field name");

  const nextGatePrismaSchemaPathField = await runStatus(["--field", "nextGatePrismaScaffold.schemaPath"]);
  assertExit(nextGatePrismaSchemaPathField, 0, "gate0 status next gate Prisma schema path nested field should pass");
  assertEqual(nextGatePrismaSchemaPathField.stdout.trim(), "apps/api/prisma/schema.prisma", "next gate Prisma schema path field should include schema path");

  const nextGatePrismaSchemaPathAliasField = await runStatus(["--field", "nextGatePrismaScaffoldSchemaPathField"]);
  assertExit(nextGatePrismaSchemaPathAliasField, 0, "gate0 status next gate Prisma schema path alias field should pass");
  assertEqual(nextGatePrismaSchemaPathAliasField.stdout.trim(), "nextGatePrismaScaffold.schemaPath", "next gate Prisma schema path alias field should include nested field name");

  const nextGatePrismaMigrationsPathField = await runStatus(["--field", "nextGatePrismaScaffold.migrationsPath"]);
  assertExit(nextGatePrismaMigrationsPathField, 0, "gate0 status next gate Prisma migrations path nested field should pass");
  assertEqual(nextGatePrismaMigrationsPathField.stdout.trim(), "apps/api/prisma/migrations", "next gate Prisma migrations path field should include migrations path");

  const nextGatePrismaMigrationsPathAliasField = await runStatus(["--field", "nextGatePrismaScaffoldMigrationsPathField"]);
  assertExit(nextGatePrismaMigrationsPathAliasField, 0, "gate0 status next gate Prisma migrations path alias field should pass");
  assertEqual(nextGatePrismaMigrationsPathAliasField.stdout.trim(), "nextGatePrismaScaffold.migrationsPath", "next gate Prisma migrations path alias field should include nested field name");

  const nextGatePrismaSchemaPresentCommandField = await runStatus(["--field", "nextGatePrismaScaffold.schemaPresentCommand"]);
  assertExit(nextGatePrismaSchemaPresentCommandField, 0, "gate0 status next gate Prisma schema present command nested field should pass");
  assertEqual(nextGatePrismaSchemaPresentCommandField.stdout.trim(), "npm run db:check -- --field prismaSchemaPresent", "next gate Prisma schema present command field should include command");

  const nextGatePrismaSchemaPresentCommandAliasField = await runStatus(["--field", "nextGatePrismaScaffoldSchemaPresentCommandField"]);
  assertExit(nextGatePrismaSchemaPresentCommandAliasField, 0, "gate0 status next gate Prisma schema present command alias field should pass");
  assertEqual(nextGatePrismaSchemaPresentCommandAliasField.stdout.trim(), "nextGatePrismaScaffold.schemaPresentCommand", "next gate Prisma schema present command alias field should include nested field name");

  const nextGatePrismaMigrationsPresentCommandField = await runStatus(["--field", "nextGatePrismaScaffold.migrationsPresentCommand"]);
  assertExit(nextGatePrismaMigrationsPresentCommandField, 0, "gate0 status next gate Prisma migrations present command nested field should pass");
  assertEqual(nextGatePrismaMigrationsPresentCommandField.stdout.trim(), "npm run db:check -- --field prismaMigrationsPresent", "next gate Prisma migrations present command field should include command");

  const nextGatePrismaMigrationsPresentCommandAliasField = await runStatus(["--field", "nextGatePrismaScaffoldMigrationsPresentCommandField"]);
  assertExit(nextGatePrismaMigrationsPresentCommandAliasField, 0, "gate0 status next gate Prisma migrations present command alias field should pass");
  assertEqual(nextGatePrismaMigrationsPresentCommandAliasField.stdout.trim(), "nextGatePrismaScaffold.migrationsPresentCommand", "next gate Prisma migrations present command alias field should include nested field name");

  const nextGatePrismaExpectedPresentField = await runStatus(["--field", "nextGatePrismaScaffold.expectedPresent"]);
  assertExit(nextGatePrismaExpectedPresentField, 0, "gate0 status next gate Prisma expected present nested field should pass");
  assertEqual(nextGatePrismaExpectedPresentField.stdout.trim(), "true", "next gate Prisma expected present field should include true");

  const nextGatePrismaExpectedPresentAliasField = await runStatus(["--field", "nextGatePrismaScaffoldExpectedPresentField"]);
  assertExit(nextGatePrismaExpectedPresentAliasField, 0, "gate0 status next gate Prisma expected present alias field should pass");
  assertEqual(nextGatePrismaExpectedPresentAliasField.stdout.trim(), "nextGatePrismaScaffold.expectedPresent", "next gate Prisma expected present alias field should include nested field name");

  const nextGatePrismaScaffoldSummaryField = await runStatus(["--field", "nextGatePrismaScaffoldSummary"]);
  assertExit(nextGatePrismaScaffoldSummaryField, 0, "gate0 status next gate Prisma scaffold summary field should pass");
  assertEqual(nextGatePrismaScaffoldSummaryField.stdout.trim(), "schema=apps/api/prisma/schema.prisma, migrations=apps/api/prisma/migrations, expectedPresent=true", "next gate Prisma scaffold summary field should include compact summary");

  const nextGatePrismaScaffoldSummaryAliasField = await runStatus(["--field", "nextGatePrismaScaffoldSummaryField"]);
  assertExit(nextGatePrismaScaffoldSummaryAliasField, 0, "gate0 status next gate Prisma scaffold summary alias field should pass");
  assertEqual(nextGatePrismaScaffoldSummaryAliasField.stdout.trim(), "nextGatePrismaScaffoldSummary", "next gate Prisma scaffold summary alias field should include field name");

  const nextGateMigrationGuardCommandField = await runStatus(["--field", "nextGateMigrationGuardCommand"]);
  assertExit(nextGateMigrationGuardCommandField, 0, "gate0 status next gate migration guard command field should pass");
  assertEqual(nextGateMigrationGuardCommandField.stdout.trim(), "npm run not-scaffolded:test", "next gate migration guard command field should include not-scaffolded test");

  const nextGateMigrationGuardCommandAliasField = await runStatus(["--field", "nextGateMigrationGuardCommandField"]);
  assertExit(nextGateMigrationGuardCommandAliasField, 0, "gate0 status next gate migration guard command alias field should pass");
  assertEqual(nextGateMigrationGuardCommandAliasField.stdout.trim(), "nextGateMigrationGuardCommand", "next gate migration guard command alias field should include field name");

  const nextGateMigrationGuardMigrationCommandField = await runStatus(["--field", "nextGateMigrationGuardMigrationCommand"]);
  assertExit(nextGateMigrationGuardMigrationCommandField, 0, "gate0 status next gate migration guard migration command field should pass");
  assertEqual(nextGateMigrationGuardMigrationCommandField.stdout.trim(), "npm run db:migrate", "next gate migration guard migration command field should include db migrate");

  const nextGateMigrationGuardMigrationCommandAliasField = await runStatus(["--field", "nextGateMigrationGuardMigrationCommandField"]);
  assertExit(nextGateMigrationGuardMigrationCommandAliasField, 0, "gate0 status next gate migration guard migration command alias field should pass");
  assertEqual(nextGateMigrationGuardMigrationCommandAliasField.stdout.trim(), "nextGateMigrationGuardMigrationCommand", "next gate migration guard migration command alias field should include field name");

  const nextGateMigrationGuardHelperCommandField = await runStatus(["--field", "nextGateMigrationGuardHelperCommand"]);
  assertExit(nextGateMigrationGuardHelperCommandField, 0, "gate0 status next gate migration guard helper command field should pass");
  assertEqual(nextGateMigrationGuardHelperCommandField.stdout.trim(), "node scripts/not-scaffolded.mjs --help", "next gate migration guard helper command field should include not-scaffolded help");

  const nextGateMigrationGuardHelperCommandAliasField = await runStatus(["--field", "nextGateMigrationGuardHelperCommandField"]);
  assertExit(nextGateMigrationGuardHelperCommandAliasField, 0, "gate0 status next gate migration guard helper command alias field should pass");
  assertEqual(nextGateMigrationGuardHelperCommandAliasField.stdout.trim(), "nextGateMigrationGuardHelperCommand", "next gate migration guard helper command alias field should include field name");

  const nextGateMigrationGuardErrorCodeField = await runStatus(["--field", "nextGateMigrationGuardErrorCode"]);
  assertExit(nextGateMigrationGuardErrorCodeField, 0, "gate0 status next gate migration guard error code field should pass");
  assertEqual(nextGateMigrationGuardErrorCodeField.stdout.trim(), "TM_COMMAND_NOT_SCAFFOLDED", "next gate migration guard error code field should include stable error code");

  const nextGateMigrationGuardErrorCodeAliasField = await runStatus(["--field", "nextGateMigrationGuardErrorCodeField"]);
  assertExit(nextGateMigrationGuardErrorCodeAliasField, 0, "gate0 status next gate migration guard error code alias field should pass");
  assertEqual(nextGateMigrationGuardErrorCodeAliasField.stdout.trim(), "nextGateMigrationGuardErrorCode", "next gate migration guard error code alias field should include field name");

  const nextGateMigrationGuardField = await runStatus(["--field", "nextGateMigrationGuard"]);
  assertExit(nextGateMigrationGuardField, 0, "gate0 status next gate migration guard field should pass");
  assertIncludes(nextGateMigrationGuardField.stdout, "\"command\": \"npm run not-scaffolded:test\"", "next gate migration guard field should include guard command");
  assertIncludes(nextGateMigrationGuardField.stdout, "\"migrationCommand\": \"npm run db:migrate\"", "next gate migration guard field should include migration command");
  assertIncludes(nextGateMigrationGuardField.stdout, "\"helperCommand\": \"node scripts/not-scaffolded.mjs --help\"", "next gate migration guard field should include helper command");
  assertIncludes(nextGateMigrationGuardField.stdout, "\"errorCode\": \"TM_COMMAND_NOT_SCAFFOLDED\"", "next gate migration guard field should include stable error code");

  const nextGateMigrationGuardAliasField = await runStatus(["--field", "nextGateMigrationGuardField"]);
  assertExit(nextGateMigrationGuardAliasField, 0, "gate0 status next gate migration guard alias field should pass");
  assertEqual(nextGateMigrationGuardAliasField.stdout.trim(), "nextGateMigrationGuard", "next gate migration guard alias field should include object field name");

  const nextGateMigrationGuardNestedField = await runStatus(["--field", "nextGateMigrationGuard.errorCode"]);
  assertExit(nextGateMigrationGuardNestedField, 0, "gate0 status next gate migration guard nested field should pass");
  assertEqual(nextGateMigrationGuardNestedField.stdout.trim(), "TM_COMMAND_NOT_SCAFFOLDED", "next gate migration guard nested field should include stable error code");

  const nextGateMigrationGuardErrorCodeNestedAliasField = await runStatus(["--field", "nextGateMigrationGuardErrorCodeNestedField"]);
  assertExit(nextGateMigrationGuardErrorCodeNestedAliasField, 0, "gate0 status next gate migration guard nested alias field should pass");
  assertEqual(nextGateMigrationGuardErrorCodeNestedAliasField.stdout.trim(), "nextGateMigrationGuard.errorCode", "next gate migration guard nested alias field should include nested field name");

  const nextGateMigrationGuardSummaryField = await runStatus(["--field", "nextGateMigrationGuardSummary"]);
  assertExit(nextGateMigrationGuardSummaryField, 0, "gate0 status next gate migration guard summary field should pass");
  assertEqual(nextGateMigrationGuardSummaryField.stdout.trim(), "npm run not-scaffolded:test blocks npm run db:migrate with TM_COMMAND_NOT_SCAFFOLDED", "next gate migration guard summary field should include compact summary");

  const nextGateMigrationGuardSummaryAliasField = await runStatus(["--field", "nextGateMigrationGuardSummaryField"]);
  assertExit(nextGateMigrationGuardSummaryAliasField, 0, "gate0 status next gate migration guard summary alias field should pass");
  assertEqual(nextGateMigrationGuardSummaryAliasField.stdout.trim(), "nextGateMigrationGuardSummary", "next gate migration guard summary alias field should include field name");

  const nextGateDbMatrixField = await runStatus(["--field", "nextGateDbMatrix"]);
  assertExit(nextGateDbMatrixField, 0, "gate0 status next gate DB matrix field should pass");
  assertIncludes(nextGateDbMatrixField.stdout, "\"checkCommand\": \"npm run db:check\"", "next gate DB matrix field should include check command");
  assertIncludes(nextGateDbMatrixField.stdout, "\"jsonCommand\": \"npm run db:check -- --json\"", "next gate DB matrix field should include JSON command");
  assertIncludes(nextGateDbMatrixField.stdout, "\"prismaScaffold\"", "next gate DB matrix field should include Prisma scaffold object");
  assertIncludes(nextGateDbMatrixField.stdout, "\"prismaScaffoldStatus\"", "next gate DB matrix field should include Prisma scaffold status object");
  assertIncludes(nextGateDbMatrixField.stdout, "\"databaseUrl\"", "next gate DB matrix field should include database URL object");
  assertIncludes(nextGateDbMatrixField.stdout, "\"migrationGuard\"", "next gate DB matrix field should include migration guard object");

  const nextGateDbMatrixAliasField = await runStatus(["--field", "nextGateDbMatrixField"]);
  assertExit(nextGateDbMatrixAliasField, 0, "gate0 status next gate DB matrix alias field should pass");
  assertEqual(nextGateDbMatrixAliasField.stdout.trim(), "nextGateDbMatrix", "next gate DB matrix alias field should include object field name");

  const nextGateDbMatrixCheckCommandField = await runStatus(["--field", "nextGateDbMatrix.checkCommand"]);
  assertExit(nextGateDbMatrixCheckCommandField, 0, "gate0 status next gate DB matrix check command nested field should pass");
  assertEqual(nextGateDbMatrixCheckCommandField.stdout.trim(), "npm run db:check", "next gate DB matrix check command field should include check command");

  const nextGateDbMatrixCheckCommandAliasField = await runStatus(["--field", "nextGateDbMatrixCheckCommandField"]);
  assertExit(nextGateDbMatrixCheckCommandAliasField, 0, "gate0 status next gate DB matrix check command alias field should pass");
  assertEqual(nextGateDbMatrixCheckCommandAliasField.stdout.trim(), "nextGateDbMatrix.checkCommand", "next gate DB matrix check command alias field should include nested field name");

  const nextGateDbMatrixJsonCommandField = await runStatus(["--field", "nextGateDbMatrix.jsonCommand"]);
  assertExit(nextGateDbMatrixJsonCommandField, 0, "gate0 status next gate DB matrix JSON command nested field should pass");
  assertEqual(nextGateDbMatrixJsonCommandField.stdout.trim(), "npm run db:check -- --json", "next gate DB matrix JSON command field should include JSON command");

  const nextGateDbMatrixJsonCommandAliasField = await runStatus(["--field", "nextGateDbMatrixJsonCommandField"]);
  assertExit(nextGateDbMatrixJsonCommandAliasField, 0, "gate0 status next gate DB matrix JSON command alias field should pass");
  assertEqual(nextGateDbMatrixJsonCommandAliasField.stdout.trim(), "nextGateDbMatrix.jsonCommand", "next gate DB matrix JSON command alias field should include nested field name");

  const nextGateDbMatrixMigrationStatusCommandField = await runStatus(["--field", "nextGateDbMatrix.migrationStatusCommand"]);
  assertExit(nextGateDbMatrixMigrationStatusCommandField, 0, "gate0 status next gate DB matrix migration status command nested field should pass");
  assertEqual(nextGateDbMatrixMigrationStatusCommandField.stdout.trim(), "npm run db:check -- --field migrationStatus", "next gate DB matrix migration status command field should include command");

  const nextGateDbMatrixMigrationStatusCommandAliasField = await runStatus(["--field", "nextGateDbMatrixMigrationStatusCommandField"]);
  assertExit(nextGateDbMatrixMigrationStatusCommandAliasField, 0, "gate0 status next gate DB matrix migration status command alias field should pass");
  assertEqual(nextGateDbMatrixMigrationStatusCommandAliasField.stdout.trim(), "nextGateDbMatrix.migrationStatusCommand", "next gate DB matrix migration status command alias field should include nested field name");

  const nextGateDbMatrixNestedField = await runStatus(["--field", "nextGateDbMatrix.databaseUrl.expectedStatus"]);
  assertExit(nextGateDbMatrixNestedField, 0, "gate0 status next gate DB matrix nested field should pass");
  assertEqual(nextGateDbMatrixNestedField.stdout.trim(), "valid", "next gate DB matrix nested field should include database URL expected status");

  const nextGateDbMatrixDatabaseUrlExpectedStatusAliasField = await runStatus(["--field", "nextGateDbMatrixDatabaseUrlExpectedStatusField"]);
  assertExit(nextGateDbMatrixDatabaseUrlExpectedStatusAliasField, 0, "gate0 status next gate DB matrix database URL expected status alias field should pass");
  assertEqual(nextGateDbMatrixDatabaseUrlExpectedStatusAliasField.stdout.trim(), "nextGateDbMatrix.databaseUrl.expectedStatus", "next gate DB matrix database URL expected status alias field should include nested field name");

  const nextGateDbMatrixPrismaScaffoldStatusSummaryField = await runStatus(["--field", "nextGateDbMatrix.prismaScaffoldStatus.summary"]);
  assertExit(nextGateDbMatrixPrismaScaffoldStatusSummaryField, 0, "gate0 status next gate DB matrix Prisma scaffold status summary field should pass");
  assertEqual(nextGateDbMatrixPrismaScaffoldStatusSummaryField.stdout.trim(), "schema=true, migrations=true, migrationStatus=scaffolded", "next gate DB matrix Prisma scaffold status summary field should include current scaffold status");

  const nextGateDbMatrixPrismaScaffoldStatusSummaryAliasField = await runStatus(["--field", "nextGateDbMatrixPrismaScaffoldStatusSummaryField"]);
  assertExit(nextGateDbMatrixPrismaScaffoldStatusSummaryAliasField, 0, "gate0 status next gate DB matrix Prisma scaffold status summary alias field should pass");
  assertEqual(nextGateDbMatrixPrismaScaffoldStatusSummaryAliasField.stdout.trim(), "nextGateDbMatrix.prismaScaffoldStatus.summary", "next gate DB matrix Prisma scaffold status summary alias field should include nested field name");

  const nextGateDbMatrixRequiredChecksSourceField = await runStatus(["--field", "nextGateDbMatrix.requiredChecksSource"]);
  assertExit(nextGateDbMatrixRequiredChecksSourceField, 0, "gate0 status next gate DB matrix required checks source nested field should pass");
  assertEqual(nextGateDbMatrixRequiredChecksSourceField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md#required-checks", "next gate DB matrix required checks source field should include Gate 1 doc anchor");

  const nextGateDbMatrixRequiredChecksSourceAliasField = await runStatus(["--field", "nextGateDbMatrixRequiredChecksSourceField"]);
  assertExit(nextGateDbMatrixRequiredChecksSourceAliasField, 0, "gate0 status next gate DB matrix required checks source alias field should pass");
  assertEqual(nextGateDbMatrixRequiredChecksSourceAliasField.stdout.trim(), "nextGateDbMatrix.requiredChecksSource", "next gate DB matrix required checks source alias field should include nested field name");

  const nextGateDbMatrixRequiredChecksParsedField = await runStatus(["--field", "nextGateDbMatrix.requiredChecksParsed"]);
  assertExit(nextGateDbMatrixRequiredChecksParsedField, 0, "gate0 status next gate DB matrix required checks parsed nested field should pass");
  assertEqual(nextGateDbMatrixRequiredChecksParsedField.stdout.trim(), "true", "next gate DB matrix required checks parsed field should include true");

  const nextGateDbMatrixRequiredChecksParsedAliasField = await runStatus(["--field", "nextGateDbMatrixRequiredChecksParsedField"]);
  assertExit(nextGateDbMatrixRequiredChecksParsedAliasField, 0, "gate0 status next gate DB matrix required checks parsed alias field should pass");
  assertEqual(nextGateDbMatrixRequiredChecksParsedAliasField.stdout.trim(), "nextGateDbMatrix.requiredChecksParsed", "next gate DB matrix required checks parsed alias field should include nested field name");

  const nextGateDbMatrixSummaryField = await runStatus(["--field", "nextGateDbMatrixSummary"]);
  assertExit(nextGateDbMatrixSummaryField, 0, "gate0 status next gate DB matrix summary field should pass");
  assertEqual(nextGateDbMatrixSummaryField.stdout.trim(), "check=npm run db:check, json=npm run db:check -- --json, requiredChecks=13", "next gate DB matrix summary field should include compact summary");

  const nextGateDbMatrixSummaryAliasField = await runStatus(["--field", "nextGateDbMatrixSummaryField"]);
  assertExit(nextGateDbMatrixSummaryAliasField, 0, "gate0 status next gate DB matrix summary alias field should pass");
  assertEqual(nextGateDbMatrixSummaryAliasField.stdout.trim(), "nextGateDbMatrixSummary", "next gate DB matrix summary alias field should include field name");

  const nextGateRequiredChecksSourceField = await runStatus(["--field", "nextGateRequiredChecksSource"]);
  assertExit(nextGateRequiredChecksSourceField, 0, "gate0 status next gate required checks source field should pass");
  assertEqual(nextGateRequiredChecksSourceField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md#required-checks", "next gate required checks source field should include Gate 1 doc anchor");

  const nextGateRequiredChecksSourceAliasField = await runStatus(["--field", "nextGateRequiredChecksSourceField"]);
  assertExit(nextGateRequiredChecksSourceAliasField, 0, "gate0 status next gate required checks source alias field should pass");
  assertEqual(nextGateRequiredChecksSourceAliasField.stdout.trim(), "nextGateRequiredChecksSource", "next gate required checks source alias field should include field name");

  const nextGateRequiredChecksParsedField = await runStatus(["--field", "nextGateRequiredChecksParsed"]);
  assertExit(nextGateRequiredChecksParsedField, 0, "gate0 status next gate required checks parsed field should pass");
  assertEqual(nextGateRequiredChecksParsedField.stdout.trim(), "true", "next gate required checks parsed field should indicate doc parse success");

  const nextGateRequiredChecksParsedAliasField = await runStatus(["--field", "nextGateRequiredChecksParsedField"]);
  assertExit(nextGateRequiredChecksParsedAliasField, 0, "gate0 status next gate required checks parsed alias field should pass");
  assertEqual(nextGateRequiredChecksParsedAliasField.stdout.trim(), "nextGateRequiredChecksParsed", "next gate required checks parsed alias field should include field name");

  const nextGateRequiredChecksSummaryField = await runStatus(["--field", "nextGateRequiredChecksSummary"]);
  assertExit(nextGateRequiredChecksSummaryField, 0, "gate0 status next gate required checks summary field should pass");
  assertIncludes(nextGateRequiredChecksSummaryField.stdout, "\"count\": 13", "next gate required checks summary field should include count");
  assertIncludes(nextGateRequiredChecksSummaryField.stdout, "\"source\": \"docs/dev/GATE1_PERSISTENCE.md#required-checks\"", "next gate required checks summary field should include source");
  assertIncludes(nextGateRequiredChecksSummaryField.stdout, "\"byType\"", "next gate required checks summary field should include type groups");

  const nextGateRequiredChecksSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksSummaryField"]);
  assertExit(nextGateRequiredChecksSummaryAliasField, 0, "gate0 status next gate required checks summary alias field should pass");
  assertEqual(nextGateRequiredChecksSummaryAliasField.stdout.trim(), "nextGateRequiredChecksSummary", "next gate required checks summary alias field should include field name");

  const nextGateRequiredChecksCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.count"]);
  assertExit(nextGateRequiredChecksCountField, 0, "gate0 status next gate required checks count nested field should pass");
  assertEqual(nextGateRequiredChecksCountField.stdout.trim(), "13", "next gate required checks count field should include count");

  const nextGateRequiredChecksCountAliasField = await runStatus(["--field", "nextGateRequiredChecksSummaryCountField"]);
  assertExit(nextGateRequiredChecksCountAliasField, 0, "gate0 status next gate required checks count alias field should pass");
  assertEqual(nextGateRequiredChecksCountAliasField.stdout.trim(), "nextGateRequiredChecksSummary.count", "next gate required checks count alias field should include nested field name");

  const nextGateRequiredChecksSummarySourceField = await runStatus(["--field", "nextGateRequiredChecksSummary.source"]);
  assertExit(nextGateRequiredChecksSummarySourceField, 0, "gate0 status next gate required checks summary source nested field should pass");
  assertEqual(nextGateRequiredChecksSummarySourceField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md#required-checks", "next gate required checks summary source field should include Gate 1 doc anchor");

  const nextGateRequiredChecksSummarySourceAliasField = await runStatus(["--field", "nextGateRequiredChecksSummarySourceField"]);
  assertExit(nextGateRequiredChecksSummarySourceAliasField, 0, "gate0 status next gate required checks summary source alias field should pass");
  assertEqual(nextGateRequiredChecksSummarySourceAliasField.stdout.trim(), "nextGateRequiredChecksSummary.source", "next gate required checks summary source alias field should include nested field name");

  const nextGateRequiredChecksSummaryParsedField = await runStatus(["--field", "nextGateRequiredChecksSummary.parsed"]);
  assertExit(nextGateRequiredChecksSummaryParsedField, 0, "gate0 status next gate required checks summary parsed nested field should pass");
  assertEqual(nextGateRequiredChecksSummaryParsedField.stdout.trim(), "true", "next gate required checks summary parsed field should include true");

  const nextGateRequiredChecksSummaryParsedAliasField = await runStatus(["--field", "nextGateRequiredChecksSummaryParsedField"]);
  assertExit(nextGateRequiredChecksSummaryParsedAliasField, 0, "gate0 status next gate required checks summary parsed alias field should pass");
  assertEqual(nextGateRequiredChecksSummaryParsedAliasField.stdout.trim(), "nextGateRequiredChecksSummary.parsed", "next gate required checks summary parsed alias field should include nested field name");

  const nextGateRequiredChecksCompactSummaryField = await runStatus(["--field", "nextGateRequiredChecksCompactSummary"]);
  assertExit(nextGateRequiredChecksCompactSummaryField, 0, "gate0 status next gate required checks compact summary field should pass");
  assertEqual(nextGateRequiredChecksCompactSummaryField.stdout.trim(), "13 checks, parsed=true, source=docs/dev/GATE1_PERSISTENCE.md#required-checks", "next gate required checks compact summary field should include count, parsed status, and source");

  const nextGateRequiredChecksCompactSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksCompactSummaryField"]);
  assertExit(nextGateRequiredChecksCompactSummaryAliasField, 0, "gate0 status next gate required checks compact summary alias field should pass");
  assertEqual(nextGateRequiredChecksCompactSummaryAliasField.stdout.trim(), "nextGateRequiredChecksCompactSummary", "next gate required checks compact summary alias field should include field name");

  const nextGateRequiredChecksByTypeSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeSummary"]);
  assertExit(nextGateRequiredChecksByTypeSummaryField, 0, "gate0 status next gate required checks by type summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeSummaryField.stdout.trim(), "db=8, guard=2, test=1, privacy=1, errors=1", "next gate required checks by type summary should include grouped counts");

  const nextGateRequiredChecksByTypeSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeSummaryAliasField, 0, "gate0 status next gate required checks by type summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeSummary", "next gate required checks by type summary alias field should include field name");

  const nextGateRequiredChecksByTypeEndpointSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeEndpointSummary"]);
  assertExit(nextGateRequiredChecksByTypeEndpointSummaryField, 0, "gate0 status next gate required checks by type endpoint summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeEndpointSummaryField.stdout.trim(), "first=db, last=errors", "next gate required checks by type endpoint summary should include endpoints");

  const nextGateRequiredChecksByTypeEndpointSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeEndpointSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeEndpointSummaryAliasField, 0, "gate0 status next gate required checks by type endpoint summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeEndpointSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeEndpointSummary", "next gate required checks by type endpoint summary alias field should include field name");

  const nextGateRequiredChecksByTypeRegistrySummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeRegistrySummary"]);
  assertExit(nextGateRequiredChecksByTypeRegistrySummaryField, 0, "gate0 status next gate required checks by type registry summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistrySummaryField.stdout.trim(), "consistent: count=5,lastIndex=4", "next gate required checks by type registry summary should include registry invariant");

  const nextGateRequiredChecksByTypeRegistrySummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeRegistrySummaryField"]);
  assertExit(nextGateRequiredChecksByTypeRegistrySummaryAliasField, 0, "gate0 status next gate required checks by type registry summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistrySummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeRegistrySummary", "next gate required checks by type registry summary alias field should include field name");

  const nextGateRequiredChecksByTypeFieldSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeFieldSummary"]);
  assertExit(nextGateRequiredChecksByTypeFieldSummaryField, 0, "gate0 status next gate required checks by type field summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeFieldSummaryField.stdout.trim(), "keysField=nextGateRequiredChecksSummary.byTypeKeys, countField=nextGateRequiredChecksSummary.byTypeCount, firstField=nextGateRequiredChecksSummary.byTypeFirst, lastField=nextGateRequiredChecksSummary.byTypeLast", "next gate required checks by type field summary should include aliases");

  const nextGateRequiredChecksByTypeFieldSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeFieldSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeFieldSummaryAliasField, 0, "gate0 status next gate required checks by type field summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeFieldSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeFieldSummary", "next gate required checks by type field summary alias field should include field name");

  const nextGateRequiredChecksByTypeCommandCountSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandCountSummary"]);
  assertExit(nextGateRequiredChecksByTypeCommandCountSummaryField, 0, "gate0 status next gate required checks by type command count summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandCountSummaryField.stdout.trim(), "dbCommands=8, guardCommands=2, testCommands=1, privacyCommands=1, errorsCommands=1", "next gate required checks by type command count summary should include grouped command counts");

  const nextGateRequiredChecksByTypeCommandCountSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandCountSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeCommandCountSummaryAliasField, 0, "gate0 status next gate required checks by type command count summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandCountSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeCommandCountSummary", "next gate required checks by type command count summary alias field should include field name");

  const nextGateRequiredChecksByTypeCommandEndpointSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandEndpointSummary"]);
  assertExit(nextGateRequiredChecksByTypeCommandEndpointSummaryField, 0, "gate0 status next gate required checks by type command endpoint summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandEndpointSummaryField.stdout.trim(), "db: first=npm run db:check, last=npm run db:check -- --field databaseUrlProtocol | guard: first=npm run not-scaffolded:test, last=node scripts/not-scaffolded.mjs --help | test: first=npm test, last=npm test | privacy: first=npm run privacy:test, last=npm run privacy:test | errors: first=npm run errors:check, last=npm run errors:check", "next gate required checks by type command endpoint summary should include first and last commands");

  const nextGateRequiredChecksByTypeCommandEndpointSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandEndpointSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeCommandEndpointSummaryAliasField, 0, "gate0 status next gate required checks by type command endpoint summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandEndpointSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeCommandEndpointSummary", "next gate required checks by type command endpoint summary alias field should include field name");

  const nextGateRequiredChecksByTypeCommandRegistrySummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandRegistrySummary"]);
  assertExit(nextGateRequiredChecksByTypeCommandRegistrySummaryField, 0, "gate0 status next gate required checks by type command registry summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandRegistrySummaryField.stdout.trim(), "db=count=8,lastIndex=7, guard=count=2,lastIndex=1, test=count=1,lastIndex=0, privacy=count=1,lastIndex=0, errors=count=1,lastIndex=0", "next gate required checks by type command registry summary should include invariants");

  const nextGateRequiredChecksByTypeCommandRegistrySummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandRegistrySummaryField"]);
  assertExit(nextGateRequiredChecksByTypeCommandRegistrySummaryAliasField, 0, "gate0 status next gate required checks by type command registry summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandRegistrySummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeCommandRegistrySummary", "next gate required checks by type command registry summary alias field should include field name");

  const nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandRegistryStatusSummary"]);
  assertExit(nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField, 0, "gate0 status next gate required checks by type command registry status summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField.stdout.trim(), "db=consistent, guard=consistent, test=consistent, privacy=consistent, errors=consistent", "next gate required checks by type command registry status summary should include statuses");

  const nextGateRequiredChecksByTypeCommandRegistryStatusSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandRegistryStatusSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeCommandRegistryStatusSummaryAliasField, 0, "gate0 status next gate required checks by type command registry status summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandRegistryStatusSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeCommandRegistryStatusSummary", "next gate required checks by type command registry status summary alias field should include field name");

  const nextGateRequiredChecksByTypeCommandFieldSummaryField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandFieldSummary"]);
  assertExit(nextGateRequiredChecksByTypeCommandFieldSummaryField, 0, "gate0 status next gate required checks by type command field summary field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandFieldSummaryField.stdout.trim(), "dbCommandsField=nextGateRequiredChecksSummary.byType.db.commands, guardCommandsField=nextGateRequiredChecksSummary.byType.guard.commands, testCommandsField=nextGateRequiredChecksSummary.byType.test.commands, privacyCommandsField=nextGateRequiredChecksSummary.byType.privacy.commands, errorsCommandsField=nextGateRequiredChecksSummary.byType.errors.commands", "next gate required checks by type command field summary should include command aliases");

  const nextGateRequiredChecksByTypeCommandFieldSummaryAliasField = await runStatus(["--field", "nextGateRequiredChecksByTypeCommandFieldSummaryField"]);
  assertExit(nextGateRequiredChecksByTypeCommandFieldSummaryAliasField, 0, "gate0 status next gate required checks by type command field summary alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCommandFieldSummaryAliasField.stdout.trim(), "nextGateRequiredChecksByTypeCommandFieldSummary", "next gate required checks by type command field summary alias field should include field name");

  const nextGateRequiredChecksByTypeKeysField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeKeys"]);
  assertExit(nextGateRequiredChecksByTypeKeysField, 0, "gate0 status next gate required checks type keys field should pass");
  assertIncludes(nextGateRequiredChecksByTypeKeysField.stdout, "\"db\"", "next gate required checks type keys field should include first type");
  assertIncludes(nextGateRequiredChecksByTypeKeysField.stdout, "\"errors\"", "next gate required checks type keys field should include last type");

  const nextGateRequiredChecksFirstTypeKeyField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeKeys.0"]);
  assertExit(nextGateRequiredChecksFirstTypeKeyField, 0, "gate0 status next gate required checks first type key field should pass");
  assertEqual(nextGateRequiredChecksFirstTypeKeyField.stdout.trim(), "db", "next gate required checks first type key field should include first key");

  const nextGateRequiredChecksLastTypeKeyField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeKeys.4"]);
  assertExit(nextGateRequiredChecksLastTypeKeyField, 0, "gate0 status next gate required checks last type key field should pass");
  assertEqual(nextGateRequiredChecksLastTypeKeyField.stdout.trim(), "errors", "next gate required checks last type key field should include last key");

  const nextGateRequiredChecksByTypeKeysAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeKeysField"]);
  assertExit(nextGateRequiredChecksByTypeKeysAliasField, 0, "gate0 status next gate required checks type keys alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeKeysAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeKeys", "next gate required checks type keys alias should include canonical field");

  const nextGateRequiredChecksByTypeCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeCount"]);
  assertExit(nextGateRequiredChecksByTypeCountField, 0, "gate0 status next gate required checks type count field should pass");
  assertEqual(nextGateRequiredChecksByTypeCountField.stdout.trim(), "5", "next gate required checks type count field should include count");

  const nextGateRequiredChecksByTypeCountAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeCountField"]);
  assertExit(nextGateRequiredChecksByTypeCountAliasField, 0, "gate0 status next gate required checks type count alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeCountAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeCount", "next gate required checks type count alias should include canonical field");

  const nextGateRequiredChecksByTypeLastIndexField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeLastIndex"]);
  assertExit(nextGateRequiredChecksByTypeLastIndexField, 0, "gate0 status next gate required checks type last index field should pass");
  assertEqual(nextGateRequiredChecksByTypeLastIndexField.stdout.trim(), "4", "next gate required checks type last index field should include index");

  const nextGateRequiredChecksByTypeLastIndexAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeLastIndexField"]);
  assertExit(nextGateRequiredChecksByTypeLastIndexAliasField, 0, "gate0 status next gate required checks type last index alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeLastIndexAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeLastIndex", "next gate required checks type last index alias should include canonical field");

  const nextGateRequiredChecksByTypeFirstField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeFirst"]);
  assertExit(nextGateRequiredChecksByTypeFirstField, 0, "gate0 status next gate required checks first type field should pass");
  assertEqual(nextGateRequiredChecksByTypeFirstField.stdout.trim(), "db", "next gate required checks first type field should include first type");

  const nextGateRequiredChecksByTypeFirstAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeFirstField"]);
  assertExit(nextGateRequiredChecksByTypeFirstAliasField, 0, "gate0 status next gate required checks first type alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeFirstAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeFirst", "next gate required checks first type alias should include canonical field");

  const nextGateRequiredChecksByTypeLastField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeLast"]);
  assertExit(nextGateRequiredChecksByTypeLastField, 0, "gate0 status next gate required checks last type field should pass");
  assertEqual(nextGateRequiredChecksByTypeLastField.stdout.trim(), "errors", "next gate required checks last type field should include last type");

  const nextGateRequiredChecksByTypeLastAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeLastField"]);
  assertExit(nextGateRequiredChecksByTypeLastAliasField, 0, "gate0 status next gate required checks last type alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeLastAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeLast", "next gate required checks last type alias should include canonical field");

  const nextGateRequiredChecksByTypeRegistryStatusField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeRegistryStatus"]);
  assertExit(nextGateRequiredChecksByTypeRegistryStatusField, 0, "gate0 status next gate required checks type registry status field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistryStatusField.stdout.trim(), "consistent", "next gate required checks type registry status field should include status");

  const nextGateRequiredChecksByTypeRegistryStatusAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeRegistryStatusField"]);
  assertExit(nextGateRequiredChecksByTypeRegistryStatusAliasField, 0, "gate0 status next gate required checks type registry status alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistryStatusAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeRegistryStatus", "next gate required checks type registry status alias should include canonical field");

  const nextGateRequiredChecksByTypeRegistryInvariantField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeRegistryInvariant"]);
  assertExit(nextGateRequiredChecksByTypeRegistryInvariantField, 0, "gate0 status next gate required checks type registry invariant field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistryInvariantField.stdout.trim(), "count=5,lastIndex=4", "next gate required checks type registry invariant field should include invariant");

  const nextGateRequiredChecksByTypeRegistryInvariantAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byTypeRegistryInvariantField"]);
  assertExit(nextGateRequiredChecksByTypeRegistryInvariantAliasField, 0, "gate0 status next gate required checks type registry invariant alias field should pass");
  assertEqual(nextGateRequiredChecksByTypeRegistryInvariantAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byTypeRegistryInvariant", "next gate required checks type registry invariant alias should include canonical field");

  const nextGateRequiredChecksDbCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.count"]);
  assertExit(nextGateRequiredChecksDbCountField, 0, "gate0 status next gate required checks DB count nested field should pass");
  assertEqual(nextGateRequiredChecksDbCountField.stdout.trim(), "8", "next gate required checks DB count field should include count");

  const nextGateRequiredChecksGuardCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.count"]);
  assertExit(nextGateRequiredChecksGuardCountField, 0, "gate0 status next gate required checks guard count nested field should pass");
  assertEqual(nextGateRequiredChecksGuardCountField.stdout.trim(), "2", "next gate required checks guard count field should include count");

  const nextGateRequiredChecksTestCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.test.count"]);
  assertExit(nextGateRequiredChecksTestCountField, 0, "gate0 status next gate required checks test count nested field should pass");
  assertEqual(nextGateRequiredChecksTestCountField.stdout.trim(), "1", "next gate required checks test count field should include count");

  const nextGateRequiredChecksPrivacyCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.privacy.count"]);
  assertExit(nextGateRequiredChecksPrivacyCountField, 0, "gate0 status next gate required checks privacy count nested field should pass");
  assertEqual(nextGateRequiredChecksPrivacyCountField.stdout.trim(), "1", "next gate required checks privacy count field should include count");

  const nextGateRequiredChecksErrorsCountField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.errors.count"]);
  assertExit(nextGateRequiredChecksErrorsCountField, 0, "gate0 status next gate required checks errors count nested field should pass");
  assertEqual(nextGateRequiredChecksErrorsCountField.stdout.trim(), "1", "next gate required checks errors count field should include count");

  const nextGateRequiredChecksDbCountAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.countField"]);
  assertExit(nextGateRequiredChecksDbCountAliasField, 0, "gate0 status next gate required checks DB count alias field should pass");
  assertEqual(nextGateRequiredChecksDbCountAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.db.count", "next gate required checks DB count alias should include canonical field");

  const nextGateRequiredChecksGuardCountAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.countField"]);
  assertExit(nextGateRequiredChecksGuardCountAliasField, 0, "gate0 status next gate required checks guard count alias field should pass");
  assertEqual(nextGateRequiredChecksGuardCountAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.guard.count", "next gate required checks guard count alias should include canonical field");

  const nextGateRequiredChecksDbCommandsAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandsField"]);
  assertExit(nextGateRequiredChecksDbCommandsAliasField, 0, "gate0 status next gate required checks DB commands alias field should pass");
  assertEqual(nextGateRequiredChecksDbCommandsAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.db.commands", "next gate required checks DB commands alias should include canonical field");

  const nextGateRequiredChecksGuardCommandsAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandsField"]);
  assertExit(nextGateRequiredChecksGuardCommandsAliasField, 0, "gate0 status next gate required checks guard commands alias field should pass");
  assertEqual(nextGateRequiredChecksGuardCommandsAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.guard.commands", "next gate required checks guard commands alias should include canonical field");

  const nextGateRequiredChecksDbLastIndexField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandLastIndex"]);
  assertExit(nextGateRequiredChecksDbLastIndexField, 0, "gate0 status next gate required checks DB last index nested field should pass");
  assertEqual(nextGateRequiredChecksDbLastIndexField.stdout.trim(), "7", "next gate required checks DB last index field should include index");

  const nextGateRequiredChecksGuardLastIndexField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandLastIndex"]);
  assertExit(nextGateRequiredChecksGuardLastIndexField, 0, "gate0 status next gate required checks guard last index nested field should pass");
  assertEqual(nextGateRequiredChecksGuardLastIndexField.stdout.trim(), "1", "next gate required checks guard last index field should include index");

  const nextGateRequiredChecksTestLastIndexField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.test.commandLastIndex"]);
  assertExit(nextGateRequiredChecksTestLastIndexField, 0, "gate0 status next gate required checks test last index nested field should pass");
  assertEqual(nextGateRequiredChecksTestLastIndexField.stdout.trim(), "0", "next gate required checks test last index field should include index");

  const nextGateRequiredChecksDbRegistryStatusField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus"]);
  assertExit(nextGateRequiredChecksDbRegistryStatusField, 0, "gate0 status next gate required checks DB registry status nested field should pass");
  assertEqual(nextGateRequiredChecksDbRegistryStatusField.stdout.trim(), "consistent", "next gate required checks DB registry status field should include status");

  const nextGateRequiredChecksGuardRegistryStatusField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus"]);
  assertExit(nextGateRequiredChecksGuardRegistryStatusField, 0, "gate0 status next gate required checks guard registry status nested field should pass");
  assertEqual(nextGateRequiredChecksGuardRegistryStatusField.stdout.trim(), "consistent", "next gate required checks guard registry status field should include status");

  const nextGateRequiredChecksDbRegistryInvariantField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant"]);
  assertExit(nextGateRequiredChecksDbRegistryInvariantField, 0, "gate0 status next gate required checks DB registry invariant nested field should pass");
  assertEqual(nextGateRequiredChecksDbRegistryInvariantField.stdout.trim(), "count=8,lastIndex=7", "next gate required checks DB registry invariant field should include invariant");

  const nextGateRequiredChecksGuardRegistryInvariantField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant"]);
  assertExit(nextGateRequiredChecksGuardRegistryInvariantField, 0, "gate0 status next gate required checks guard registry invariant nested field should pass");
  assertEqual(nextGateRequiredChecksGuardRegistryInvariantField.stdout.trim(), "count=2,lastIndex=1", "next gate required checks guard registry invariant field should include invariant");

  const nextGateRequiredChecksDbLastIndexAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandLastIndexField"]);
  assertExit(nextGateRequiredChecksDbLastIndexAliasField, 0, "gate0 status next gate required checks DB last index alias field should pass");
  assertEqual(nextGateRequiredChecksDbLastIndexAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.db.commandLastIndex", "next gate required checks DB last index alias should include canonical field");

  const nextGateRequiredChecksGuardLastIndexAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandLastIndexField"]);
  assertExit(nextGateRequiredChecksGuardLastIndexAliasField, 0, "gate0 status next gate required checks guard last index alias field should pass");
  assertEqual(nextGateRequiredChecksGuardLastIndexAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.guard.commandLastIndex", "next gate required checks guard last index alias should include canonical field");

  const nextGateRequiredChecksDbRegistryStatusAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField"]);
  assertExit(nextGateRequiredChecksDbRegistryStatusAliasField, 0, "gate0 status next gate required checks DB registry status alias field should pass");
  assertEqual(nextGateRequiredChecksDbRegistryStatusAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus", "next gate required checks DB registry status alias should include canonical field");

  const nextGateRequiredChecksGuardRegistryStatusAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField"]);
  assertExit(nextGateRequiredChecksGuardRegistryStatusAliasField, 0, "gate0 status next gate required checks guard registry status alias field should pass");
  assertEqual(nextGateRequiredChecksGuardRegistryStatusAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus", "next gate required checks guard registry status alias should include canonical field");

  const nextGateRequiredChecksDbRegistryInvariantAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField"]);
  assertExit(nextGateRequiredChecksDbRegistryInvariantAliasField, 0, "gate0 status next gate required checks DB registry invariant alias field should pass");
  assertEqual(nextGateRequiredChecksDbRegistryInvariantAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant", "next gate required checks DB registry invariant alias should include canonical field");

  const nextGateRequiredChecksGuardRegistryInvariantAliasField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField"]);
  assertExit(nextGateRequiredChecksGuardRegistryInvariantAliasField, 0, "gate0 status next gate required checks guard registry invariant alias field should pass");
  assertEqual(nextGateRequiredChecksGuardRegistryInvariantAliasField.stdout.trim(), "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant", "next gate required checks guard registry invariant alias should include canonical field");

  const nextGateRequiredChecksFirstDbCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commands.0"]);
  assertExit(nextGateRequiredChecksFirstDbCommandField, 0, "gate0 status next gate required checks first DB command nested field should pass");
  assertEqual(nextGateRequiredChecksFirstDbCommandField.stdout.trim(), "npm run db:check", "next gate required checks first DB command field should include command");

  const nextGateRequiredChecksLastDbCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.db.commands.7"]);
  assertExit(nextGateRequiredChecksLastDbCommandField, 0, "gate0 status next gate required checks last DB command nested field should pass");
  assertEqual(nextGateRequiredChecksLastDbCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlProtocol", "next gate required checks last DB command field should include command");

  const nextGateRequiredChecksFirstGuardCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commands.0"]);
  assertExit(nextGateRequiredChecksFirstGuardCommandField, 0, "gate0 status next gate required checks first guard command nested field should pass");
  assertEqual(nextGateRequiredChecksFirstGuardCommandField.stdout.trim(), "npm run not-scaffolded:test", "next gate required checks first guard command field should include command");

  const nextGateRequiredChecksLastGuardCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.guard.commands.1"]);
  assertExit(nextGateRequiredChecksLastGuardCommandField, 0, "gate0 status next gate required checks last guard command nested field should pass");
  assertEqual(nextGateRequiredChecksLastGuardCommandField.stdout.trim(), "node scripts/not-scaffolded.mjs --help", "next gate required checks last guard command field should include command");

  const nextGateRequiredChecksTestCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.test.commands.0"]);
  assertExit(nextGateRequiredChecksTestCommandField, 0, "gate0 status next gate required checks test command nested field should pass");
  assertEqual(nextGateRequiredChecksTestCommandField.stdout.trim(), "npm test", "next gate required checks test command field should include command");

  const nextGateRequiredChecksPrivacyCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.privacy.commands.0"]);
  assertExit(nextGateRequiredChecksPrivacyCommandField, 0, "gate0 status next gate required checks privacy command nested field should pass");
  assertEqual(nextGateRequiredChecksPrivacyCommandField.stdout.trim(), "npm run privacy:test", "next gate required checks privacy command field should include command");

  const nextGateRequiredChecksErrorsCommandField = await runStatus(["--field", "nextGateRequiredChecksSummary.byType.errors.commands.0"]);
  assertExit(nextGateRequiredChecksErrorsCommandField, 0, "gate0 status next gate required checks errors command nested field should pass");
  assertEqual(nextGateRequiredChecksErrorsCommandField.stdout.trim(), "npm run errors:check", "next gate required checks errors command field should include command");

  const nextGateReadinessField = await runStatus(["--field", "nextGateReadiness"]);
  assertExit(nextGateReadinessField, 0, "gate0 status next gate readiness field should pass");
  assertIncludes(nextGateReadinessField.stdout, "\"verifiedNowCount\": 10", "next gate readiness field should include verified-now count");
  assertIncludes(nextGateReadinessField.stdout, "\"transitionCount\": 3", "next gate readiness field should include transition count");

  const nextGateReadinessAliasField = await runStatus(["--field", "nextGateReadinessField"]);
  assertExit(nextGateReadinessAliasField, 0, "gate0 status next gate readiness alias field should pass");
  assertEqual(nextGateReadinessAliasField.stdout.trim(), "nextGateReadiness", "next gate readiness alias field should include field name");

  const nextGateReadinessVerifiedNowCountField = await runStatus(["--field", "nextGateReadiness.verifiedNowCount"]);
  assertExit(nextGateReadinessVerifiedNowCountField, 0, "gate0 status next gate readiness verified count nested field should pass");
  assertEqual(nextGateReadinessVerifiedNowCountField.stdout.trim(), "10", "next gate readiness verified count field should include count");

  const nextGateReadinessVerifiedNowCountAliasField = await runStatus(["--field", "nextGateReadinessVerifiedNowCountField"]);
  assertExit(nextGateReadinessVerifiedNowCountAliasField, 0, "gate0 status next gate readiness verified count alias field should pass");
  assertEqual(nextGateReadinessVerifiedNowCountAliasField.stdout.trim(), "nextGateReadiness.verifiedNowCount", "next gate readiness verified count alias field should include nested field name");

  const nextGateReadinessTransitionCountField = await runStatus(["--field", "nextGateReadiness.transitionCount"]);
  assertExit(nextGateReadinessTransitionCountField, 0, "gate0 status next gate readiness transition count nested field should pass");
  assertEqual(nextGateReadinessTransitionCountField.stdout.trim(), "3", "next gate readiness transition count field should include count");

  const nextGateReadinessTransitionCountAliasField = await runStatus(["--field", "nextGateReadinessTransitionCountField"]);
  assertExit(nextGateReadinessTransitionCountAliasField, 0, "gate0 status next gate readiness transition count alias field should pass");
  assertEqual(nextGateReadinessTransitionCountAliasField.stdout.trim(), "nextGateReadiness.transitionCount", "next gate readiness transition count alias field should include nested field name");

  const nextGateReadinessVerifiedCommandsField = await runStatus(["--field", "nextGateReadiness.verifiedNowCommands"]);
  assertExit(nextGateReadinessVerifiedCommandsField, 0, "gate0 status next gate readiness verified commands field should pass");
  assertIncludes(nextGateReadinessVerifiedCommandsField.stdout, "npm run not-scaffolded:test", "next gate readiness verified commands field should include guard check");

  const nextGateReadinessVerifiedCommandsAliasField = await runStatus(["--field", "nextGateReadinessVerifiedNowCommandsField"]);
  assertExit(nextGateReadinessVerifiedCommandsAliasField, 0, "gate0 status next gate readiness verified commands alias field should pass");
  assertEqual(nextGateReadinessVerifiedCommandsAliasField.stdout.trim(), "nextGateReadiness.verifiedNowCommands", "next gate readiness verified commands alias field should include nested field name");

  const nextGateReadinessTransitionCommandsField = await runStatus(["--field", "nextGateReadiness.transitionCommands"]);
  assertExit(nextGateReadinessTransitionCommandsField, 0, "gate0 status next gate readiness transition commands field should pass");
  assertIncludes(nextGateReadinessTransitionCommandsField.stdout, "npm run db:check -- --field migrationStatus", "next gate readiness transition commands field should include migration status check");

  const nextGateReadinessTransitionCommandsAliasField = await runStatus(["--field", "nextGateReadinessTransitionCommandsField"]);
  assertExit(nextGateReadinessTransitionCommandsAliasField, 0, "gate0 status next gate readiness transition commands alias field should pass");
  assertEqual(nextGateReadinessTransitionCommandsAliasField.stdout.trim(), "nextGateReadiness.transitionCommands", "next gate readiness transition commands alias field should include nested field name");

  const nextGateReadinessSummaryField = await runStatus(["--field", "nextGateReadinessSummary"]);
  assertExit(nextGateReadinessSummaryField, 0, "gate0 status next gate readiness summary field should pass");
  assertEqual(nextGateReadinessSummaryField.stdout.trim(), "10 verified now, 3 transition checks", "next gate readiness summary field should include compact summary");

  const nextGateReadinessSummaryAliasField = await runStatus(["--field", "nextGateReadinessSummaryField"]);
  assertExit(nextGateReadinessSummaryAliasField, 0, "gate0 status next gate readiness summary alias field should pass");
  assertEqual(nextGateReadinessSummaryAliasField.stdout.trim(), "nextGateReadinessSummary", "next gate readiness summary alias field should include field name");

  const nextGateTransitionPlanField = await runStatus(["--field", "nextGateTransitionPlan"]);
  assertExit(nextGateTransitionPlanField, 0, "gate0 status next gate transition plan field should pass");
  assertIncludes(nextGateTransitionPlanField.stdout, "\"count\": 3", "next gate transition plan field should include count");
  assertIncludes(nextGateTransitionPlanField.stdout, "\"migrationStatus\"", "next gate transition plan field should include migration status");
  assertIncludes(nextGateTransitionPlanField.stdout, "\"databaseUrlStatus\"", "next gate transition plan field should include database URL status");
  assertIncludes(nextGateTransitionPlanField.stdout, "\"orderedSteps\"", "next gate transition plan field should include ordered steps");

  const nextGateTransitionPlanAliasField = await runStatus(["--field", "nextGateTransitionPlanField"]);
  assertExit(nextGateTransitionPlanAliasField, 0, "gate0 status next gate transition plan alias field should pass");
  assertEqual(nextGateTransitionPlanAliasField.stdout.trim(), "nextGateTransitionPlan", "next gate transition plan alias field should include field name");

  const nextGateTransitionPlanCountField = await runStatus(["--field", "nextGateTransitionPlan.count"]);
  assertExit(nextGateTransitionPlanCountField, 0, "gate0 status next gate transition plan count field should pass");
  assertEqual(nextGateTransitionPlanCountField.stdout.trim(), "3", "next gate transition plan count field should include count");

  const nextGateTransitionPlanCountAliasField = await runStatus(["--field", "nextGateTransitionPlanCountField"]);
  assertExit(nextGateTransitionPlanCountAliasField, 0, "gate0 status next gate transition plan count alias field should pass");
  assertEqual(nextGateTransitionPlanCountAliasField.stdout.trim(), "nextGateTransitionPlan.count", "next gate transition plan count alias field should include nested field name");

  const nextGateTransitionPlanNestedField = await runStatus(["--field", "nextGateTransitionPlan.transitions.migrationStatus.nextExpected"]);
  assertExit(nextGateTransitionPlanNestedField, 0, "gate0 status next gate transition plan nested field should pass");
  assertEqual(nextGateTransitionPlanNestedField.stdout.trim(), "database_read_parity", "next gate transition plan nested field should include migration next expectation");

  const nextGateTransitionPlanMigrationNextAliasField = await runStatus(["--field", "nextGateTransitionPlanMigrationStatusNextExpectedField"]);
  assertExit(nextGateTransitionPlanMigrationNextAliasField, 0, "gate0 status next gate transition plan migration next alias field should pass");
  assertEqual(nextGateTransitionPlanMigrationNextAliasField.stdout.trim(), "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "next gate transition plan migration next alias field should include nested field name");

  const nextGateTransitionPlanDatabaseUrlStatusNextField = await runStatus(["--field", "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected"]);
  assertExit(nextGateTransitionPlanDatabaseUrlStatusNextField, 0, "gate0 status next gate transition plan database URL status next field should pass");
  assertEqual(nextGateTransitionPlanDatabaseUrlStatusNextField.stdout.trim(), "valid", "next gate transition plan database URL status next field should include valid");

  const nextGateTransitionPlanDatabaseUrlStatusNextAliasField = await runStatus(["--field", "nextGateTransitionPlanDatabaseUrlStatusNextExpectedField"]);
  assertExit(nextGateTransitionPlanDatabaseUrlStatusNextAliasField, 0, "gate0 status next gate transition plan database URL status next alias field should pass");
  assertEqual(nextGateTransitionPlanDatabaseUrlStatusNextAliasField.stdout.trim(), "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected", "next gate transition plan database URL status next alias field should include nested field name");

  const nextGateTransitionPlanDatabaseUrlProtocolNextField = await runStatus(["--field", "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected"]);
  assertExit(nextGateTransitionPlanDatabaseUrlProtocolNextField, 0, "gate0 status next gate transition plan database URL protocol next field should pass");
  assertIncludes(nextGateTransitionPlanDatabaseUrlProtocolNextField.stdout, "postgresql", "next gate transition plan database URL protocol next field should include postgresql");

  const nextGateTransitionPlanDatabaseUrlProtocolNextAliasField = await runStatus(["--field", "nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField"]);
  assertExit(nextGateTransitionPlanDatabaseUrlProtocolNextAliasField, 0, "gate0 status next gate transition plan database URL protocol next alias field should pass");
  assertEqual(nextGateTransitionPlanDatabaseUrlProtocolNextAliasField.stdout.trim(), "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "next gate transition plan database URL protocol next alias field should include nested field name");

  const nextGateTransitionOrderedStepsField = await runStatus(["--field", "nextGateTransitionPlan.orderedSteps"]);
  assertExit(nextGateTransitionOrderedStepsField, 0, "gate0 status next gate transition ordered steps field should pass");
  assertIncludes(nextGateTransitionOrderedStepsField.stdout, "scaffold-prisma", "next gate transition ordered steps field should include first step");

  const nextGateTransitionOrderedStepsAliasField = await runStatus(["--field", "nextGateTransitionPlanOrderedStepsField"]);
  assertExit(nextGateTransitionOrderedStepsAliasField, 0, "gate0 status next gate transition ordered steps alias field should pass");
  assertEqual(nextGateTransitionOrderedStepsAliasField.stdout.trim(), "nextGateTransitionPlan.orderedSteps", "next gate transition ordered steps alias field should include nested field name");

  const nextGateTransitionFirstStepField = await runStatus(["--field", "nextGateTransitionPlan.orderedSteps.0.id"]);
  assertExit(nextGateTransitionFirstStepField, 0, "gate0 status next gate transition plan first step nested field should pass");
  assertEqual(nextGateTransitionFirstStepField.stdout.trim(), "scaffold-prisma", "next gate transition plan first step field should include first step id");

  const nextGateTransitionFirstStepAliasField = await runStatus(["--field", "nextGateTransitionPlanFirstStepIdField"]);
  assertExit(nextGateTransitionFirstStepAliasField, 0, "gate0 status next gate transition first step alias field should pass");
  assertEqual(nextGateTransitionFirstStepAliasField.stdout.trim(), "nextGateTransitionPlan.orderedSteps.0.id", "next gate transition first step alias field should include nested field name");

  const nextGateTransitionStepSummaryField = await runStatus(["--field", "nextGateTransitionPlanStepSummary"]);
  assertExit(nextGateTransitionStepSummaryField, 0, "gate0 status next gate transition step summary field should pass");
  assertEqual(nextGateTransitionStepSummaryField.stdout.trim(), "scaffold-prisma -> set-database-url -> verify-db-matrix", "next gate transition step summary field should include ordered step summary");

  const nextGateTransitionStepSummaryAliasField = await runStatus(["--field", "nextGateTransitionPlanStepSummaryField"]);
  assertExit(nextGateTransitionStepSummaryAliasField, 0, "gate0 status next gate transition step summary alias field should pass");
  assertEqual(nextGateTransitionStepSummaryAliasField.stdout.trim(), "nextGateTransitionPlanStepSummary", "next gate transition step summary alias field should include field name");

  const nextGateTransitionPlanSummaryField = await runStatus(["--field", "nextGateTransitionPlanSummary"]);
  assertExit(nextGateTransitionPlanSummaryField, 0, "gate0 status next gate transition plan summary field should pass");
  assertEqual(nextGateTransitionPlanSummaryField.stdout.trim(), "3 transitions -> database_read_parity, valid, postgresql|postgres", "next gate transition plan summary field should include compact transition summary");

  const nextGateTransitionPlanSummaryAliasField = await runStatus(["--field", "nextGateTransitionPlanSummaryField"]);
  assertExit(nextGateTransitionPlanSummaryAliasField, 0, "gate0 status next gate transition plan summary alias field should pass");
  assertEqual(nextGateTransitionPlanSummaryAliasField.stdout.trim(), "nextGateTransitionPlanSummary", "next gate transition plan summary alias field should include field name");

  const nextGateCiHandoffField = await runStatus(["--field", "nextGateCiHandoff"]);
  assertExit(nextGateCiHandoffField, 0, "gate0 status next gate CI handoff field should pass");
  assertIncludes(nextGateCiHandoffField.stdout, "\"requiredCheckCount\": 13", "next gate CI handoff field should include required check count");
  assertIncludes(nextGateCiHandoffField.stdout, "\"watchFields\"", "next gate CI handoff field should include watch fields");
  assertIncludes(nextGateCiHandoffField.stdout, "\"passCriteria\"", "next gate CI handoff field should include pass criteria");
  assertIncludes(nextGateCiHandoffField.stdout, "\"failureCodes\"", "next gate CI handoff field should include failure codes");
  assertIncludes(nextGateCiHandoffField.stdout, "\"evidenceDocs\"", "next gate CI handoff field should include evidence docs");
  assertIncludes(nextGateCiHandoffField.stdout, "\"assertions\"", "next gate CI handoff field should include assertions");
  assertIncludes(nextGateCiHandoffField.stdout, "\"readyWhen\"", "next gate CI handoff field should include ready-when summary");
  assertIncludes(nextGateCiHandoffField.stdout, "\"rollback\"", "next gate CI handoff field should include rollback object");

  const nextGateCiHandoffAliasField = await runStatus(["--field", "nextGateCiHandoffField"]);
  assertExit(nextGateCiHandoffAliasField, 0, "gate0 status next gate CI handoff alias field should pass");
  assertEqual(nextGateCiHandoffAliasField.stdout.trim(), "nextGateCiHandoff", "next gate CI handoff alias field should include field name");

  const nextGateCiHandoffRequiredCheckCountField = await runStatus(["--field", "nextGateCiHandoff.requiredCheckCount"]);
  assertExit(nextGateCiHandoffRequiredCheckCountField, 0, "gate0 status next gate CI handoff required check count field should pass");
  assertEqual(nextGateCiHandoffRequiredCheckCountField.stdout.trim(), "13", "next gate CI handoff required check count field should include required check count");

  const nextGateCiHandoffRequiredCheckCountTopAliasField = await runStatus(["--field", "nextGateCiHandoffRequiredCheckCountFieldAlias"]);
  assertExit(nextGateCiHandoffRequiredCheckCountTopAliasField, 0, "gate0 status next gate CI handoff required check count top alias field should pass");
  assertEqual(nextGateCiHandoffRequiredCheckCountTopAliasField.stdout.trim(), "nextGateCiHandoff.requiredCheckCount", "next gate CI handoff required check count top alias field should include nested field name");

  const nextGateCiHandoffTopWatchFieldCountField = await runStatus(["--field", "nextGateCiHandoff.watchFieldCount"]);
  assertExit(nextGateCiHandoffTopWatchFieldCountField, 0, "gate0 status next gate CI handoff watch field count field should pass");
  assertEqual(nextGateCiHandoffTopWatchFieldCountField.stdout.trim(), "3", "next gate CI handoff watch field count field should include watch field count");

  const nextGateCiHandoffTopWatchFieldCountAliasField = await runStatus(["--field", "nextGateCiHandoffWatchFieldCountFieldAlias"]);
  assertExit(nextGateCiHandoffTopWatchFieldCountAliasField, 0, "gate0 status next gate CI handoff watch field count top alias field should pass");
  assertEqual(nextGateCiHandoffTopWatchFieldCountAliasField.stdout.trim(), "nextGateCiHandoff.watchFieldCount", "next gate CI handoff watch field count top alias field should include nested field name");

  const nextGateCiHandoffTopCommandCountField = await runStatus(["--field", "nextGateCiHandoff.commandCount"]);
  assertExit(nextGateCiHandoffTopCommandCountField, 0, "gate0 status next gate CI handoff command count field should pass");
  assertEqual(nextGateCiHandoffTopCommandCountField.stdout.trim(), "13", "next gate CI handoff command count field should include command count");

  const nextGateCiHandoffTopCommandCountAliasField = await runStatus(["--field", "nextGateCiHandoffCommandCountFieldAlias"]);
  assertExit(nextGateCiHandoffTopCommandCountAliasField, 0, "gate0 status next gate CI handoff command count top alias field should pass");
  assertEqual(nextGateCiHandoffTopCommandCountAliasField.stdout.trim(), "nextGateCiHandoff.commandCount", "next gate CI handoff command count top alias field should include nested field name");

  const nextGateCiHandoffSummaryField = await runStatus(["--field", "nextGateCiHandoffSummary"]);
  assertExit(nextGateCiHandoffSummaryField, 0, "gate0 status next gate CI handoff summary field should pass");
  assertEqual(nextGateCiHandoffSummaryField.stdout.trim(), "13 required checks, 3 watch fields, 13 commands", "next gate CI handoff summary field should include compact summary");

  const nextGateCiHandoffSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffSummaryField"]);
  assertExit(nextGateCiHandoffSummaryAliasField, 0, "gate0 status next gate CI handoff summary alias field should pass");
  assertEqual(nextGateCiHandoffSummaryAliasField.stdout.trim(), "nextGateCiHandoffSummary", "next gate CI handoff summary alias field should include field name");

  const nextGateCiHandoffReadyStatusTopField = await runStatus(["--field", "nextGateCiHandoffReadyStatus"]);
  assertExit(nextGateCiHandoffReadyStatusTopField, 0, "gate0 status next gate CI handoff ready status top field should pass");
  assertEqual(nextGateCiHandoffReadyStatusTopField.stdout.trim(), "all_assertions_pass", "next gate CI handoff ready status top field should include status");

  const nextGateCiHandoffReadyStatusTopAliasField = await runStatus(["--field", "nextGateCiHandoffReadyStatusField"]);
  assertExit(nextGateCiHandoffReadyStatusTopAliasField, 0, "gate0 status next gate CI handoff ready status top alias field should pass");
  assertEqual(nextGateCiHandoffReadyStatusTopAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.status", "next gate CI handoff ready status top alias field should include nested field name");

  const nextGateCiHandoffReadySummaryTopField = await runStatus(["--field", "nextGateCiHandoffReadySummary"]);
  assertExit(nextGateCiHandoffReadySummaryTopField, 0, "gate0 status next gate CI handoff ready summary top field should pass");
  assertEqual(nextGateCiHandoffReadySummaryTopField.stdout.trim(), "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "next gate CI handoff ready summary top field should include summary");

  const nextGateCiHandoffReadySummaryTopAliasField = await runStatus(["--field", "nextGateCiHandoffReadySummaryField"]);
  assertExit(nextGateCiHandoffReadySummaryTopAliasField, 0, "gate0 status next gate CI handoff ready summary top alias field should pass");
  assertEqual(nextGateCiHandoffReadySummaryTopAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.summary", "next gate CI handoff ready summary top alias field should include nested field name");

  const nextGateCiHandoffReadyTopSummaryField = await runStatus(["--field", "nextGateCiHandoffReadyTopSummary"]);
  assertExit(nextGateCiHandoffReadyTopSummaryField, 0, "gate0 status next gate CI handoff ready top summary field should pass");
  assertEqual(nextGateCiHandoffReadyTopSummaryField.stdout.trim(), "all_assertions_pass: migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "next gate CI handoff ready top summary field should include compact ready summary");

  const nextGateCiHandoffReadyTopSummaryAliasField = await runStatus(["--field", "nextGateCiHandoffReadyTopSummaryField"]);
  assertExit(nextGateCiHandoffReadyTopSummaryAliasField, 0, "gate0 status next gate CI handoff ready top summary alias field should pass");
  assertEqual(nextGateCiHandoffReadyTopSummaryAliasField.stdout.trim(), "nextGateCiHandoffReadyTopSummary", "next gate CI handoff ready top summary alias field should include field name");

  const nextGateCiHandoffFieldAliasCountField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasCount"]);
  assertExit(nextGateCiHandoffFieldAliasCountField, 0, "gate0 status next gate CI handoff field alias count should pass");
  assertEqual(nextGateCiHandoffFieldAliasCountField.stdout.trim(), "324", "next gate CI handoff field alias count should include alias count");

  const nextGateCiHandoffFieldAliasCountAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasCountField"]);
  assertExit(nextGateCiHandoffFieldAliasCountAliasField, 0, "gate0 status next gate CI handoff field alias count alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasCountAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasCount", "next gate CI handoff field alias count alias should include canonical count field");

  const nextGateCiHandoffFieldAliasLastIndexField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasLastIndex"]);
  assertExit(nextGateCiHandoffFieldAliasLastIndexField, 0, "gate0 status next gate CI handoff field alias last index should pass");
  assertEqual(nextGateCiHandoffFieldAliasLastIndexField.stdout.trim(), "323", "next gate CI handoff field alias last index should include last index");

  const nextGateCiHandoffFieldAliasLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasLastIndexField"]);
  assertExit(nextGateCiHandoffFieldAliasLastIndexAliasField, 0, "gate0 status next gate CI handoff field alias last index alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasLastIndex", "next gate CI handoff field alias last index alias should include canonical last index field");

  const nextGateCiHandoffFieldAliasRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasRegistryStatus"]);
  assertExit(nextGateCiHandoffFieldAliasRegistryStatusField, 0, "gate0 status next gate CI handoff field alias registry status should pass");
  assertEqual(nextGateCiHandoffFieldAliasRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff field alias registry status should include consistency status");

  const nextGateCiHandoffFieldAliasRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasRegistryStatusField"]);
  assertExit(nextGateCiHandoffFieldAliasRegistryStatusAliasField, 0, "gate0 status next gate CI handoff field alias registry status alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasRegistryStatus", "next gate CI handoff field alias registry status alias should include canonical status field");

  const nextGateCiHandoffFieldAliasRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasRegistryInvariant"]);
  assertExit(nextGateCiHandoffFieldAliasRegistryInvariantField, 0, "gate0 status next gate CI handoff field alias registry invariant should pass");
  assertEqual(nextGateCiHandoffFieldAliasRegistryInvariantField.stdout.trim(), "count=324,lastIndex=323", "next gate CI handoff field alias registry invariant should include count and last index");

  const nextGateCiHandoffFieldAliasRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasRegistryInvariantField"]);
  assertExit(nextGateCiHandoffFieldAliasRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff field alias registry invariant alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasRegistryInvariant", "next gate CI handoff field alias registry invariant alias should include canonical invariant field");

  const nextGateCiHandoffFieldAliasFirstField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasFirst"]);
  assertExit(nextGateCiHandoffFieldAliasFirstField, 0, "gate0 status next gate CI handoff first alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasFirstField.stdout.trim(), "nextGateCiHandoff.transitionPlanField", "next gate CI handoff first alias should include registry first value");

  const nextGateCiHandoffFieldAliasFirstAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasFirstField"]);
  assertExit(nextGateCiHandoffFieldAliasFirstAliasField, 0, "gate0 status next gate CI handoff first alias field alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasFirstAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasFirst", "next gate CI handoff first alias field alias should include canonical first alias field");

  const nextGateCiHandoffFieldAliasLastField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasLast"]);
  assertExit(nextGateCiHandoffFieldAliasLastField, 0, "gate0 status next gate CI handoff last alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasLastField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsSummaryField", "next gate CI handoff last alias should include registry last value");

  const nextGateCiHandoffFieldAliasLastAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasLastField"]);
  assertExit(nextGateCiHandoffFieldAliasLastAliasField, 0, "gate0 status next gate CI handoff last alias field alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasLastAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasLast", "next gate CI handoff last alias field alias should include canonical last alias field");

  const nextGateCiHandoffFieldAliasEndpointsFirstField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasEndpoints.first"]);
  assertExit(nextGateCiHandoffFieldAliasEndpointsFirstField, 0, "gate0 status next gate CI handoff field alias endpoints first should pass");
  assertEqual(nextGateCiHandoffFieldAliasEndpointsFirstField.stdout.trim(), "nextGateCiHandoff.transitionPlanField", "next gate CI handoff field alias endpoints first should include first alias");

  const nextGateCiHandoffFieldAliasEndpointsLastField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasEndpoints.last"]);
  assertExit(nextGateCiHandoffFieldAliasEndpointsLastField, 0, "gate0 status next gate CI handoff field alias endpoints last should pass");
  assertEqual(nextGateCiHandoffFieldAliasEndpointsLastField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsSummaryField", "next gate CI handoff field alias endpoints last should include last alias");

  const nextGateCiHandoffFieldAliasEndpointsAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasEndpointsField"]);
  assertExit(nextGateCiHandoffFieldAliasEndpointsAliasField, 0, "gate0 status next gate CI handoff field alias endpoints alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasEndpointsAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasEndpoints", "next gate CI handoff field alias endpoints alias should include canonical endpoints field");

  const nextGateCiHandoffFieldAliasSummaryField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasSummary"]);
  assertExit(nextGateCiHandoffFieldAliasSummaryField, 0, "gate0 status next gate CI handoff field alias summary should pass");
  assertEqual(nextGateCiHandoffFieldAliasSummaryField.stdout.trim(), "324 aliases, first=nextGateCiHandoff.transitionPlanField, last=productionBlockersSummary.gateOrderDetailsSummaryField", "next gate CI handoff field alias summary should include count and endpoints");

  const nextGateCiHandoffFieldAliasSummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasSummaryField"]);
  assertExit(nextGateCiHandoffFieldAliasSummaryAliasField, 0, "gate0 status next gate CI handoff field alias summary alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasSummaryAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliasSummary", "next gate CI handoff field alias summary alias should include canonical summary field");

  const nextGateCiHandoffFirstFieldAlias = await runStatus(["--field", "nextGateCiHandoff.fieldAliases.0"]);
  assertExit(nextGateCiHandoffFirstFieldAlias, 0, "gate0 status next gate CI handoff first field alias should pass");
  assertEqual(nextGateCiHandoffFirstFieldAlias.stdout.trim(), "nextGateCiHandoff.transitionPlanField", "next gate CI handoff first field alias should include transition plan alias");

  const nextGateCiHandoffLastFieldAlias = await runStatus(["--field", "nextGateCiHandoff.fieldAliases.323"]);
  assertExit(nextGateCiHandoffLastFieldAlias, 0, "gate0 status next gate CI handoff last field alias should pass");
  assertEqual(nextGateCiHandoffLastFieldAlias.stdout.trim(), "productionBlockersSummary.gateOrderDetailsSummaryField", "next gate CI handoff last field alias should include gate order detail summary alias");

  const nextGateCiHandoffFieldAliasesAliasField = await runStatus(["--field", "nextGateCiHandoff.fieldAliasesField"]);
  assertExit(nextGateCiHandoffFieldAliasesAliasField, 0, "gate0 status next gate CI handoff field aliases alias should pass");
  assertEqual(nextGateCiHandoffFieldAliasesAliasField.stdout.trim(), "nextGateCiHandoff.fieldAliases", "next gate CI handoff field aliases alias should include canonical alias registry field");

  const nextGateCiHandoffRequiredCheckCountAliasField = await runStatus(["--field", "nextGateCiHandoff.requiredCheckCountField"]);
  assertExit(nextGateCiHandoffRequiredCheckCountAliasField, 0, "gate0 status next gate CI handoff required check count alias field should pass");
  assertEqual(nextGateCiHandoffRequiredCheckCountAliasField.stdout.trim(), "nextGateCiHandoff.requiredCheckCount", "next gate CI handoff required check count alias field should include canonical required check count field");

  const nextGateCiHandoffRequiredChecksSourceField = await runStatus(["--field", "nextGateCiHandoff.requiredChecksSource"]);
  assertExit(nextGateCiHandoffRequiredChecksSourceField, 0, "gate0 status next gate CI handoff required checks source field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksSourceField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md#required-checks", "next gate CI handoff required checks source field should include required checks source");

  const nextGateCiHandoffRequiredChecksSourceAliasField = await runStatus(["--field", "nextGateCiHandoff.requiredChecksSourceField"]);
  assertExit(nextGateCiHandoffRequiredChecksSourceAliasField, 0, "gate0 status next gate CI handoff required checks source alias field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksSourceAliasField.stdout.trim(), "nextGateCiHandoff.requiredChecksSource", "next gate CI handoff required checks source alias field should include canonical required checks source field");

  const nextGateCiHandoffRequiredChecksParsedField = await runStatus(["--field", "nextGateCiHandoff.requiredChecksParsed"]);
  assertExit(nextGateCiHandoffRequiredChecksParsedField, 0, "gate0 status next gate CI handoff required checks parsed field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksParsedField.stdout.trim(), "true", "next gate CI handoff required checks parsed field should include parsed status");

  const nextGateCiHandoffRequiredChecksParsedAliasField = await runStatus(["--field", "nextGateCiHandoff.requiredChecksParsedField"]);
  assertExit(nextGateCiHandoffRequiredChecksParsedAliasField, 0, "gate0 status next gate CI handoff required checks parsed alias field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksParsedAliasField.stdout.trim(), "nextGateCiHandoff.requiredChecksParsed", "next gate CI handoff required checks parsed alias field should include canonical required checks parsed field");

  const nextGateCiHandoffTransitionPlanAliasField = await runStatus(["--field", "nextGateCiHandoff.transitionPlanField"]);
  assertExit(nextGateCiHandoffTransitionPlanAliasField, 0, "gate0 status next gate CI handoff transition plan alias field should pass");
  assertEqual(nextGateCiHandoffTransitionPlanAliasField.stdout.trim(), "nextGateTransitionPlan", "next gate CI handoff transition plan alias field should include transition plan field");

  const nextGateCiHandoffReadinessAliasField = await runStatus(["--field", "nextGateCiHandoff.readinessField"]);
  assertExit(nextGateCiHandoffReadinessAliasField, 0, "gate0 status next gate CI handoff readiness alias field should pass");
  assertEqual(nextGateCiHandoffReadinessAliasField.stdout.trim(), "nextGateReadiness", "next gate CI handoff readiness alias field should include readiness field");

  const nextGateCiHandoffPassCriteriaAliasField = await runStatus(["--field", "nextGateCiHandoff.passCriteriaField"]);
  assertExit(nextGateCiHandoffPassCriteriaAliasField, 0, "gate0 status next gate CI handoff pass criteria alias field should pass");
  assertEqual(nextGateCiHandoffPassCriteriaAliasField.stdout.trim(), "nextGateCiHandoff.passCriteria", "next gate CI handoff pass criteria alias field should include canonical pass criteria field");

  const nextGateCiHandoffWatchFieldsAliasField = await runStatus(["--field", "nextGateCiHandoff.watchFieldsField"]);
  assertExit(nextGateCiHandoffWatchFieldsAliasField, 0, "gate0 status next gate CI handoff watch fields alias field should pass");
  assertEqual(nextGateCiHandoffWatchFieldsAliasField.stdout.trim(), "nextGateCiHandoff.watchFields", "next gate CI handoff watch fields alias field should include canonical watch fields field");

  const nextGateCiHandoffWatchField = await runStatus(["--field", "nextGateCiHandoff.watchFields.0"]);
  assertExit(nextGateCiHandoffWatchField, 0, "gate0 status next gate CI handoff watch field should pass");
  assertEqual(nextGateCiHandoffWatchField.stdout.trim(), "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "next gate CI handoff watch field should include first watch field");

  const nextGateCiHandoffCommandCountField = await runStatus(["--field", "nextGateCiHandoff.commandCount"]);
  assertExit(nextGateCiHandoffCommandCountField, 0, "gate0 status next gate CI handoff command count field should pass");
  assertEqual(nextGateCiHandoffCommandCountField.stdout.trim(), "13", "next gate CI handoff command count field should include command count");

  const nextGateCiHandoffCommandCountAliasField = await runStatus(["--field", "nextGateCiHandoff.commandCountField"]);
  assertExit(nextGateCiHandoffCommandCountAliasField, 0, "gate0 status next gate CI handoff command count alias field should pass");
  assertEqual(nextGateCiHandoffCommandCountAliasField.stdout.trim(), "nextGateCiHandoff.commandCount", "next gate CI handoff command count alias field should include canonical command count field");

  const nextGateCiHandoffCommandLastIndexField = await runStatus(["--field", "nextGateCiHandoff.commandLastIndex"]);
  assertExit(nextGateCiHandoffCommandLastIndexField, 0, "gate0 status next gate CI handoff command last index field should pass");
  assertEqual(nextGateCiHandoffCommandLastIndexField.stdout.trim(), "12", "next gate CI handoff command last index field should include command last index");

  const nextGateCiHandoffCommandLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.commandLastIndexField"]);
  assertExit(nextGateCiHandoffCommandLastIndexAliasField, 0, "gate0 status next gate CI handoff command last index alias field should pass");
  assertEqual(nextGateCiHandoffCommandLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.commandLastIndex", "next gate CI handoff command last index alias field should include canonical command last index field");

  const nextGateCiHandoffCommandRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.commandRegistryStatus"]);
  assertExit(nextGateCiHandoffCommandRegistryStatusField, 0, "gate0 status next gate CI handoff command registry status field should pass");
  assertEqual(nextGateCiHandoffCommandRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff command registry status field should include consistency status");

  const nextGateCiHandoffCommandRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.commandRegistryStatusField"]);
  assertExit(nextGateCiHandoffCommandRegistryStatusAliasField, 0, "gate0 status next gate CI handoff command registry status alias field should pass");
  assertEqual(nextGateCiHandoffCommandRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.commandRegistryStatus", "next gate CI handoff command registry status alias field should include canonical status field");

  const nextGateCiHandoffCommandRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.commandRegistryInvariant"]);
  assertExit(nextGateCiHandoffCommandRegistryInvariantField, 0, "gate0 status next gate CI handoff command registry invariant field should pass");
  assertEqual(nextGateCiHandoffCommandRegistryInvariantField.stdout.trim(), "count=13,lastIndex=12", "next gate CI handoff command registry invariant field should include count and last index");

  const nextGateCiHandoffCommandRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.commandRegistryInvariantField"]);
  assertExit(nextGateCiHandoffCommandRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff command registry invariant alias field should pass");
  assertEqual(nextGateCiHandoffCommandRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.commandRegistryInvariant", "next gate CI handoff command registry invariant alias field should include canonical invariant field");

  const nextGateCiHandoffCommandsAliasField = await runStatus(["--field", "nextGateCiHandoff.commandsField"]);
  assertExit(nextGateCiHandoffCommandsAliasField, 0, "gate0 status next gate CI handoff commands alias field should pass");
  assertEqual(nextGateCiHandoffCommandsAliasField.stdout.trim(), "nextGateCiHandoff.commands", "next gate CI handoff commands alias field should include canonical commands field");

  const nextGateCiHandoffFirstCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.0"]);
  assertExit(nextGateCiHandoffFirstCommandField, 0, "gate0 status next gate CI handoff first command field should pass");
  assertEqual(nextGateCiHandoffFirstCommandField.stdout.trim(), "npm run db:check", "next gate CI handoff first command field should include db check");

  const nextGateCiHandoffSecondCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.1"]);
  assertExit(nextGateCiHandoffSecondCommandField, 0, "gate0 status next gate CI handoff second command field should pass");
  assertEqual(nextGateCiHandoffSecondCommandField.stdout.trim(), "npm run db:check -- --json", "next gate CI handoff second command field should include db check JSON");

  const nextGateCiHandoffThirdCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.2"]);
  assertExit(nextGateCiHandoffThirdCommandField, 0, "gate0 status next gate CI handoff third command field should pass");
  assertEqual(nextGateCiHandoffThirdCommandField.stdout.trim(), "npm run db:check -- --field migrationStatus", "next gate CI handoff third command field should include migration status");

  const nextGateCiHandoffFourthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.3"]);
  assertExit(nextGateCiHandoffFourthCommandField, 0, "gate0 status next gate CI handoff fourth command field should pass");
  assertEqual(nextGateCiHandoffFourthCommandField.stdout.trim(), "npm run db:check -- --field prismaSchemaPresent", "next gate CI handoff fourth command field should include Prisma schema command");

  const nextGateCiHandoffFifthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.4"]);
  assertExit(nextGateCiHandoffFifthCommandField, 0, "gate0 status next gate CI handoff fifth command field should pass");
  assertEqual(nextGateCiHandoffFifthCommandField.stdout.trim(), "npm run db:check -- --field prismaScaffoldStatus.summary", "next gate CI handoff fifth command field should include Prisma scaffold status command");

  const nextGateCiHandoffSixthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.5"]);
  assertExit(nextGateCiHandoffSixthCommandField, 0, "gate0 status next gate CI handoff sixth command field should pass");
  assertEqual(nextGateCiHandoffSixthCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlPresent", "next gate CI handoff sixth command field should include database URL present command");

  const nextGateCiHandoffSeventhCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.6"]);
  assertExit(nextGateCiHandoffSeventhCommandField, 0, "gate0 status next gate CI handoff seventh command field should pass");
  assertEqual(nextGateCiHandoffSeventhCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlStatus", "next gate CI handoff seventh command field should include database URL status command");

  const nextGateCiHandoffEighthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.7"]);
  assertExit(nextGateCiHandoffEighthCommandField, 0, "gate0 status next gate CI handoff eighth command field should pass");
  assertEqual(nextGateCiHandoffEighthCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlProtocol", "next gate CI handoff eighth command field should include database URL protocol command");

  const nextGateCiHandoffNinthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.8"]);
  assertExit(nextGateCiHandoffNinthCommandField, 0, "gate0 status next gate CI handoff ninth command field should pass");
  assertEqual(nextGateCiHandoffNinthCommandField.stdout.trim(), "npm run not-scaffolded:test", "next gate CI handoff ninth command field should include not-scaffolded guard");

  const nextGateCiHandoffTenthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.9"]);
  assertExit(nextGateCiHandoffTenthCommandField, 0, "gate0 status next gate CI handoff tenth command field should pass");
  assertEqual(nextGateCiHandoffTenthCommandField.stdout.trim(), "node scripts/not-scaffolded.mjs --help", "next gate CI handoff tenth command field should include not-scaffolded help");

  const nextGateCiHandoffEleventhCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.10"]);
  assertExit(nextGateCiHandoffEleventhCommandField, 0, "gate0 status next gate CI handoff eleventh command field should pass");
  assertEqual(nextGateCiHandoffEleventhCommandField.stdout.trim(), "npm test", "next gate CI handoff eleventh command field should include full test command");

  const nextGateCiHandoffTwelfthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.11"]);
  assertExit(nextGateCiHandoffTwelfthCommandField, 0, "gate0 status next gate CI handoff twelfth command field should pass");
  assertEqual(nextGateCiHandoffTwelfthCommandField.stdout.trim(), "npm run privacy:test", "next gate CI handoff twelfth command field should include privacy test command");

  const nextGateCiHandoffThirteenthCommandField = await runStatus(["--field", "nextGateCiHandoff.commands.12"]);
  assertExit(nextGateCiHandoffThirteenthCommandField, 0, "gate0 status next gate CI handoff thirteenth command field should pass");
  assertEqual(nextGateCiHandoffThirteenthCommandField.stdout.trim(), "npm run errors:check", "next gate CI handoff thirteenth command field should include errors check command");

  const nextGateCiHandoffSecondWatchField = await runStatus(["--field", "nextGateCiHandoff.watchFields.1"]);
  assertExit(nextGateCiHandoffSecondWatchField, 0, "gate0 status next gate CI handoff second watch field should pass");
  assertEqual(nextGateCiHandoffSecondWatchField.stdout.trim(), "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected", "next gate CI handoff second watch field should include database URL status field");

  const nextGateCiHandoffThirdWatchField = await runStatus(["--field", "nextGateCiHandoff.watchFields.2"]);
  assertExit(nextGateCiHandoffThirdWatchField, 0, "gate0 status next gate CI handoff third watch field should pass");
  assertEqual(nextGateCiHandoffThirdWatchField.stdout.trim(), "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "next gate CI handoff third watch field should include database URL protocol field");

  const nextGateCiHandoffWatchFieldCountField = await runStatus(["--field", "nextGateCiHandoff.watchFieldCount"]);
  assertExit(nextGateCiHandoffWatchFieldCountField, 0, "gate0 status next gate CI handoff watch field count should pass");
  assertEqual(nextGateCiHandoffWatchFieldCountField.stdout.trim(), "3", "next gate CI handoff watch field count should include count");

  const nextGateCiHandoffWatchFieldCountAliasField = await runStatus(["--field", "nextGateCiHandoff.watchFieldCountField"]);
  assertExit(nextGateCiHandoffWatchFieldCountAliasField, 0, "gate0 status next gate CI handoff watch field count alias field should pass");
  assertEqual(nextGateCiHandoffWatchFieldCountAliasField.stdout.trim(), "nextGateCiHandoff.watchFieldCount", "next gate CI handoff watch field count alias field should include canonical watch field count field");

  const nextGateCiHandoffPassCriteriaField = await runStatus(["--field", "nextGateCiHandoff.passCriteria.migrationStatus"]);
  assertExit(nextGateCiHandoffPassCriteriaField, 0, "gate0 status next gate CI handoff pass criteria field should pass");
  assertEqual(nextGateCiHandoffPassCriteriaField.stdout.trim(), "database_read_parity", "next gate CI handoff pass criteria field should include migration target");

  const nextGateCiHandoffPassCriteriaCountField = await runStatus(["--field", "nextGateCiHandoff.passCriteriaCount"]);
  assertExit(nextGateCiHandoffPassCriteriaCountField, 0, "gate0 status next gate CI handoff pass criteria count field should pass");
  assertEqual(nextGateCiHandoffPassCriteriaCountField.stdout.trim(), "3", "next gate CI handoff pass criteria count field should include count");

  const nextGateCiHandoffPassCriteriaCountAliasField = await runStatus(["--field", "nextGateCiHandoff.passCriteriaCountField"]);
  assertExit(nextGateCiHandoffPassCriteriaCountAliasField, 0, "gate0 status next gate CI handoff pass criteria count alias field should pass");
  assertEqual(nextGateCiHandoffPassCriteriaCountAliasField.stdout.trim(), "nextGateCiHandoff.passCriteriaCount", "next gate CI handoff pass criteria count alias field should include canonical pass criteria count field");

  const nextGateCiHandoffDatabaseUrlStatusPassCriteriaField = await runStatus(["--field", "nextGateCiHandoff.passCriteria.databaseUrlStatus"]);
  assertExit(nextGateCiHandoffDatabaseUrlStatusPassCriteriaField, 0, "gate0 status next gate CI handoff database URL status pass criteria field should pass");
  assertEqual(nextGateCiHandoffDatabaseUrlStatusPassCriteriaField.stdout.trim(), "valid", "next gate CI handoff database URL status pass criteria field should include target");

  const nextGateCiHandoffDatabaseUrlProtocolPassCriteriaField = await runStatus(["--field", "nextGateCiHandoff.passCriteria.databaseUrlProtocol"]);
  assertExit(nextGateCiHandoffDatabaseUrlProtocolPassCriteriaField, 0, "gate0 status next gate CI handoff database URL protocol pass criteria field should pass");
  assertIncludes(nextGateCiHandoffDatabaseUrlProtocolPassCriteriaField.stdout, "postgresql", "next gate CI handoff database URL protocol pass criteria field should include postgresql");
  assertIncludes(nextGateCiHandoffDatabaseUrlProtocolPassCriteriaField.stdout, "postgres", "next gate CI handoff database URL protocol pass criteria field should include postgres");

  const nextGateCiHandoffFailureCodeField = await runStatus(["--field", "nextGateCiHandoff.failureCodes.migrationGuard"]);
  assertExit(nextGateCiHandoffFailureCodeField, 0, "gate0 status next gate CI handoff failure code field should pass");
  assertEqual(nextGateCiHandoffFailureCodeField.stdout.trim(), "TM_COMMAND_NOT_SCAFFOLDED", "next gate CI handoff failure code field should include migration guard code");

  const nextGateCiHandoffFailureCodesAliasField = await runStatus(["--field", "nextGateCiHandoff.failureCodesField"]);
  assertExit(nextGateCiHandoffFailureCodesAliasField, 0, "gate0 status next gate CI handoff failure codes alias field should pass");
  assertEqual(nextGateCiHandoffFailureCodesAliasField.stdout.trim(), "nextGateCiHandoff.failureCodes", "next gate CI handoff failure codes alias field should include canonical failure codes field");

  const nextGateCiHandoffDbMatrixUnknownFieldCodeField = await runStatus(["--field", "nextGateCiHandoff.failureCodes.dbMatrixUnknownField"]);
  assertExit(nextGateCiHandoffDbMatrixUnknownFieldCodeField, 0, "gate0 status next gate CI handoff DB matrix unknown field code field should pass");
  assertEqual(nextGateCiHandoffDbMatrixUnknownFieldCodeField.stdout.trim(), "TM_DB_MATRIX_UNKNOWN_FIELD", "next gate CI handoff DB matrix unknown field code field should include code");

  const nextGateCiHandoffStatusFieldMissingCodeField = await runStatus(["--field", "nextGateCiHandoff.failureCodes.statusFieldMissing"]);
  assertExit(nextGateCiHandoffStatusFieldMissingCodeField, 0, "gate0 status next gate CI handoff status field missing code field should pass");
  assertEqual(nextGateCiHandoffStatusFieldMissingCodeField.stdout.trim(), "TM_GATE0_STATUS_FIELD_MISSING", "next gate CI handoff status field missing code field should include code");

  const nextGateCiHandoffFailureCodeCountField = await runStatus(["--field", "nextGateCiHandoff.failureCodeCount"]);
  assertExit(nextGateCiHandoffFailureCodeCountField, 0, "gate0 status next gate CI handoff failure code count field should pass");
  assertEqual(nextGateCiHandoffFailureCodeCountField.stdout.trim(), "3", "next gate CI handoff failure code count field should include count");

  const nextGateCiHandoffFailureCodeCountAliasField = await runStatus(["--field", "nextGateCiHandoff.failureCodeCountField"]);
  assertExit(nextGateCiHandoffFailureCodeCountAliasField, 0, "gate0 status next gate CI handoff failure code count alias field should pass");
  assertEqual(nextGateCiHandoffFailureCodeCountAliasField.stdout.trim(), "nextGateCiHandoff.failureCodeCount", "next gate CI handoff failure code count alias field should include canonical failure code count field");

  const nextGateCiHandoffNextGateEvidenceDocField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocs.nextGate"]);
  assertExit(nextGateCiHandoffNextGateEvidenceDocField, 0, "gate0 status next gate CI handoff next gate evidence doc field should pass");
  assertEqual(nextGateCiHandoffNextGateEvidenceDocField.stdout.trim(), "docs/dev/GATE1_PERSISTENCE.md", "next gate CI handoff next gate evidence doc field should include Gate 1 doc");

  const nextGateCiHandoffEvidenceDocsAliasField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocsField"]);
  assertExit(nextGateCiHandoffEvidenceDocsAliasField, 0, "gate0 status next gate CI handoff evidence docs alias field should pass");
  assertEqual(nextGateCiHandoffEvidenceDocsAliasField.stdout.trim(), "nextGateCiHandoff.evidenceDocs", "next gate CI handoff evidence docs alias field should include canonical evidence docs field");

  const nextGateCiHandoffEvidenceDocField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocs.dbConstraints"]);
  assertExit(nextGateCiHandoffEvidenceDocField, 0, "gate0 status next gate CI handoff evidence doc field should pass");
  assertEqual(nextGateCiHandoffEvidenceDocField.stdout.trim(), "docs/dev/DB_CONSTRAINTS.md", "next gate CI handoff evidence doc field should include DB constraints doc");

  const nextGateCiHandoffStatusEvidenceDocField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocs.status"]);
  assertExit(nextGateCiHandoffStatusEvidenceDocField, 0, "gate0 status next gate CI handoff status evidence doc field should pass");
  assertEqual(nextGateCiHandoffStatusEvidenceDocField.stdout.trim(), "docs/dev/GATE0_STATUS.md", "next gate CI handoff status evidence doc field should include Gate 0 status doc");

  const nextGateCiHandoffEvidenceDocCountField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocCount"]);
  assertExit(nextGateCiHandoffEvidenceDocCountField, 0, "gate0 status next gate CI handoff evidence doc count field should pass");
  assertEqual(nextGateCiHandoffEvidenceDocCountField.stdout.trim(), "3", "next gate CI handoff evidence doc count field should include count");

  const nextGateCiHandoffEvidenceDocCountAliasField = await runStatus(["--field", "nextGateCiHandoff.evidenceDocCountField"]);
  assertExit(nextGateCiHandoffEvidenceDocCountAliasField, 0, "gate0 status next gate CI handoff evidence doc count alias field should pass");
  assertEqual(nextGateCiHandoffEvidenceDocCountAliasField.stdout.trim(), "nextGateCiHandoff.evidenceDocCount", "next gate CI handoff evidence doc count alias field should include canonical evidence doc count field");

  const nextGateCiHandoffAssertionCountField = await runStatus(["--field", "nextGateCiHandoff.assertionCount"]);
  assertExit(nextGateCiHandoffAssertionCountField, 0, "gate0 status next gate CI handoff assertion count field should pass");
  assertEqual(nextGateCiHandoffAssertionCountField.stdout.trim(), "3", "next gate CI handoff assertion count field should include count");

  const nextGateCiHandoffAssertionCountAliasField = await runStatus(["--field", "nextGateCiHandoff.assertionCountField"]);
  assertExit(nextGateCiHandoffAssertionCountAliasField, 0, "gate0 status next gate CI handoff assertion count alias field should pass");
  assertEqual(nextGateCiHandoffAssertionCountAliasField.stdout.trim(), "nextGateCiHandoff.assertionCount", "next gate CI handoff assertion count alias field should include canonical assertion count field");

  const nextGateCiHandoffAssertionField = await runStatus(["--field", "nextGateCiHandoff.assertions.migrationStatus.expected"]);
  assertExit(nextGateCiHandoffAssertionField, 0, "gate0 status next gate CI handoff assertion field should pass");
  assertEqual(nextGateCiHandoffAssertionField.stdout.trim(), "database_read_parity", "next gate CI handoff assertion field should include migration expected value");

  const nextGateCiHandoffAssertionsAliasField = await runStatus(["--field", "nextGateCiHandoff.assertionsField"]);
  assertExit(nextGateCiHandoffAssertionsAliasField, 0, "gate0 status next gate CI handoff assertions alias field should pass");
  assertEqual(nextGateCiHandoffAssertionsAliasField.stdout.trim(), "nextGateCiHandoff.assertions", "next gate CI handoff assertions alias field should include canonical assertions field");

  const nextGateCiHandoffMigrationAssertionCommandField = await runStatus(["--field", "nextGateCiHandoff.assertions.migrationStatus.command"]);
  assertExit(nextGateCiHandoffMigrationAssertionCommandField, 0, "gate0 status next gate CI handoff migration assertion command field should pass");
  assertEqual(nextGateCiHandoffMigrationAssertionCommandField.stdout.trim(), "npm run db:check -- --field migrationStatus", "next gate CI handoff migration assertion command field should include command");

  const nextGateCiHandoffDatabaseUrlStatusAssertionField = await runStatus(["--field", "nextGateCiHandoff.assertions.databaseUrlStatus.expected"]);
  assertExit(nextGateCiHandoffDatabaseUrlStatusAssertionField, 0, "gate0 status next gate CI handoff database URL status assertion field should pass");
  assertEqual(nextGateCiHandoffDatabaseUrlStatusAssertionField.stdout.trim(), "valid", "next gate CI handoff database URL status assertion field should include expected value");

  const nextGateCiHandoffDatabaseUrlStatusAssertionCommandField = await runStatus(["--field", "nextGateCiHandoff.assertions.databaseUrlStatus.command"]);
  assertExit(nextGateCiHandoffDatabaseUrlStatusAssertionCommandField, 0, "gate0 status next gate CI handoff database URL status assertion command field should pass");
  assertEqual(nextGateCiHandoffDatabaseUrlStatusAssertionCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlStatus", "next gate CI handoff database URL status assertion command field should include command");

  const nextGateCiHandoffDatabaseUrlProtocolAssertionField = await runStatus(["--field", "nextGateCiHandoff.assertions.databaseUrlProtocol.expected"]);
  assertExit(nextGateCiHandoffDatabaseUrlProtocolAssertionField, 0, "gate0 status next gate CI handoff database URL protocol assertion field should pass");
  assertIncludes(nextGateCiHandoffDatabaseUrlProtocolAssertionField.stdout, "postgresql", "next gate CI handoff database URL protocol assertion field should include postgresql");
  assertIncludes(nextGateCiHandoffDatabaseUrlProtocolAssertionField.stdout, "postgres", "next gate CI handoff database URL protocol assertion field should include postgres");

  const nextGateCiHandoffDatabaseUrlProtocolAssertionCommandField = await runStatus(["--field", "nextGateCiHandoff.assertions.databaseUrlProtocol.command"]);
  assertExit(nextGateCiHandoffDatabaseUrlProtocolAssertionCommandField, 0, "gate0 status next gate CI handoff database URL protocol assertion command field should pass");
  assertEqual(nextGateCiHandoffDatabaseUrlProtocolAssertionCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlProtocol", "next gate CI handoff database URL protocol assertion command field should include command");

  const nextGateCiHandoffReadyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.status"]);
  assertExit(nextGateCiHandoffReadyField, 0, "gate0 status next gate CI handoff ready status field should pass");
  assertEqual(nextGateCiHandoffReadyField.stdout.trim(), "all_assertions_pass", "next gate CI handoff ready status field should include status");

  const nextGateCiHandoffReadySummaryField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.summary"]);
  assertExit(nextGateCiHandoffReadySummaryField, 0, "gate0 status next gate CI handoff ready summary field should pass");
  assertEqual(nextGateCiHandoffReadySummaryField.stdout.trim(), "migrationStatus=database_read_parity, databaseUrlStatus=valid, databaseUrlProtocol=postgresql|postgres", "next gate CI handoff ready summary field should include summary");

  const nextGateCiHandoffReadyRequiredField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFields.0"]);
  assertExit(nextGateCiHandoffReadyRequiredField, 0, "gate0 status next gate CI handoff ready required field should pass");
  assertEqual(nextGateCiHandoffReadyRequiredField.stdout.trim(), "nextGateCiHandoff.assertions.migrationStatus.expected", "next gate CI handoff ready required field should include first assertion field");

  const nextGateCiHandoffReadySecondRequiredField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFields.1"]);
  assertExit(nextGateCiHandoffReadySecondRequiredField, 0, "gate0 status next gate CI handoff ready second required field should pass");
  assertEqual(nextGateCiHandoffReadySecondRequiredField.stdout.trim(), "nextGateCiHandoff.assertions.databaseUrlStatus.expected", "next gate CI handoff ready second required field should include database URL status assertion field");

  const nextGateCiHandoffReadyThirdRequiredField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFields.2"]);
  assertExit(nextGateCiHandoffReadyThirdRequiredField, 0, "gate0 status next gate CI handoff ready third required field should pass");
  assertEqual(nextGateCiHandoffReadyThirdRequiredField.stdout.trim(), "nextGateCiHandoff.assertions.databaseUrlProtocol.expected", "next gate CI handoff ready third required field should include database URL protocol assertion field");

  const nextGateCiHandoffReadyRequiredFieldCountField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldCount"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldCountField, 0, "gate0 status next gate CI handoff ready required field count should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldCountField.stdout.trim(), "3", "next gate CI handoff ready required field count should include array length");

  const nextGateCiHandoffReadyRequiredFieldCountAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldCountField"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldCountAliasField, 0, "gate0 status next gate CI handoff ready required field count alias should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldCountAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFieldCount", "next gate CI handoff ready required field count alias should include canonical count field");

  const nextGateCiHandoffReadyRequiredFieldLastIndexField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldLastIndex"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldLastIndexField, 0, "gate0 status next gate CI handoff ready required field last index should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldLastIndexField.stdout.trim(), "2", "next gate CI handoff ready required field last index should include last index");

  const nextGateCiHandoffReadyRequiredFieldLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldLastIndexField"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldLastIndexAliasField, 0, "gate0 status next gate CI handoff ready required field last index alias should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFieldLastIndex", "next gate CI handoff ready required field last index alias should include canonical last index field");

  const nextGateCiHandoffReadyRequiredFieldRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldRegistryStatusField, 0, "gate0 status next gate CI handoff ready required field registry status should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff ready required field registry status should include consistency status");

  const nextGateCiHandoffReadyRequiredFieldRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldRegistryStatusAliasField, 0, "gate0 status next gate CI handoff ready required field registry status alias should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus", "next gate CI handoff ready required field registry status alias should include canonical status field");

  const nextGateCiHandoffReadyRequiredFieldRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldRegistryInvariantField, 0, "gate0 status next gate CI handoff ready required field registry invariant should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "next gate CI handoff ready required field registry invariant should include count and last index");

  const nextGateCiHandoffReadyRequiredFieldRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff ready required field registry invariant alias should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant", "next gate CI handoff ready required field registry invariant alias should include canonical invariant field");

  const nextGateCiHandoffReadyAssertionCountField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.assertionCount"]);
  assertExit(nextGateCiHandoffReadyAssertionCountField, 0, "gate0 status next gate CI handoff ready assertion count should pass");
  assertEqual(nextGateCiHandoffReadyAssertionCountField.stdout.trim(), "3", "next gate CI handoff ready assertion count should include assertion count");

  const nextGateCiHandoffReadyAssertionCountAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.assertionCountField"]);
  assertExit(nextGateCiHandoffReadyAssertionCountAliasField, 0, "gate0 status next gate CI handoff ready assertion count alias should pass");
  assertEqual(nextGateCiHandoffReadyAssertionCountAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.assertionCount", "next gate CI handoff ready assertion count alias should include canonical assertion count field");

  const nextGateCiHandoffReadyStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.statusField"]);
  assertExit(nextGateCiHandoffReadyStatusAliasField, 0, "gate0 status next gate CI handoff ready status alias field should pass");
  assertEqual(nextGateCiHandoffReadyStatusAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.status", "next gate CI handoff ready status alias field should include canonical status field");

  const nextGateCiHandoffReadySummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.summaryField"]);
  assertExit(nextGateCiHandoffReadySummaryAliasField, 0, "gate0 status next gate CI handoff ready summary alias field should pass");
  assertEqual(nextGateCiHandoffReadySummaryAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.summary", "next gate CI handoff ready summary alias field should include canonical summary field");

  const nextGateCiHandoffReadyRequiredFieldsAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.requiredFieldsField"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldsAliasField, 0, "gate0 status next gate CI handoff ready required fields alias field should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldsAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFields", "next gate CI handoff ready required fields alias field should include canonical required fields field");

  const nextGateCiHandoffReadyCommandsAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandsField"]);
  assertExit(nextGateCiHandoffReadyCommandsAliasField, 0, "gate0 status next gate CI handoff ready commands alias field should pass");
  assertEqual(nextGateCiHandoffReadyCommandsAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.commands", "next gate CI handoff ready commands alias field should include canonical commands field");

  const nextGateCiHandoffReadyReportFieldsAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldsField"]);
  assertExit(nextGateCiHandoffReadyReportFieldsAliasField, 0, "gate0 status next gate CI handoff ready report fields alias field should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldsAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFields", "next gate CI handoff ready report fields alias field should include canonical report fields field");

  const nextGateCiHandoffReadyReportFieldCountField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldCount"]);
  assertExit(nextGateCiHandoffReadyReportFieldCountField, 0, "gate0 status next gate CI handoff ready report field count should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldCountField.stdout.trim(), "22", "next gate CI handoff ready report field count should include array length");

  const nextGateCiHandoffReadyReportFieldCountAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldCountField"]);
  assertExit(nextGateCiHandoffReadyReportFieldCountAliasField, 0, "gate0 status next gate CI handoff ready report field count alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldCountAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldCount", "next gate CI handoff ready report field count alias should include canonical report field count");

  const nextGateCiHandoffReadyReportFieldLastIndexField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldLastIndex"]);
  assertExit(nextGateCiHandoffReadyReportFieldLastIndexField, 0, "gate0 status next gate CI handoff ready report field last index should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldLastIndexField.stdout.trim(), "21", "next gate CI handoff ready report field last index should include last index");

  const nextGateCiHandoffReadyReportFieldLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldLastIndexField"]);
  assertExit(nextGateCiHandoffReadyReportFieldLastIndexAliasField, 0, "gate0 status next gate CI handoff ready report field last index alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldLastIndex", "next gate CI handoff ready report field last index alias should include canonical last index field");

  const nextGateCiHandoffReadyReportFieldRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus"]);
  assertExit(nextGateCiHandoffReadyReportFieldRegistryStatusField, 0, "gate0 status next gate CI handoff ready report field registry status should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff ready report field registry status should include consistency status");

  const nextGateCiHandoffReadyReportFieldRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField"]);
  assertExit(nextGateCiHandoffReadyReportFieldRegistryStatusAliasField, 0, "gate0 status next gate CI handoff ready report field registry status alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus", "next gate CI handoff ready report field registry status alias should include canonical status field");

  const nextGateCiHandoffReadyReportFieldRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant"]);
  assertExit(nextGateCiHandoffReadyReportFieldRegistryInvariantField, 0, "gate0 status next gate CI handoff ready report field registry invariant should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldRegistryInvariantField.stdout.trim(), "count=22,lastIndex=21", "next gate CI handoff ready report field registry invariant should include count and last index");

  const nextGateCiHandoffReadyReportFieldRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField"]);
  assertExit(nextGateCiHandoffReadyReportFieldRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff ready report field registry invariant alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant", "next gate CI handoff ready report field registry invariant alias should include canonical invariant field");

  const nextGateCiHandoffReadyReportFieldFirstField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldFirst"]);
  assertExit(nextGateCiHandoffReadyReportFieldFirstField, 0, "gate0 status next gate CI handoff ready report field first should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldFirstField.stdout.trim(), "nextGateCiHandoff.readyWhen.status", "next gate CI handoff ready report field first should include first report field");

  const nextGateCiHandoffReadyReportFieldFirstAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldFirstField"]);
  assertExit(nextGateCiHandoffReadyReportFieldFirstAliasField, 0, "gate0 status next gate CI handoff ready report field first alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldFirstAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldFirst", "next gate CI handoff ready report field first alias should include canonical first field");

  const nextGateCiHandoffReadyReportFieldLastField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldLast"]);
  assertExit(nextGateCiHandoffReadyReportFieldLastField, 0, "gate0 status next gate CI handoff ready report field last should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldLastField.stdout.trim(), "stillNotDone", "next gate CI handoff ready report field last should include last report field");

  const nextGateCiHandoffReadyReportFieldLastAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldLastField"]);
  assertExit(nextGateCiHandoffReadyReportFieldLastAliasField, 0, "gate0 status next gate CI handoff ready report field last alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldLastAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldLast", "next gate CI handoff ready report field last alias should include canonical last field");

  const nextGateCiHandoffReadyReportFieldEndpointsFirstField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldEndpoints.first"]);
  assertExit(nextGateCiHandoffReadyReportFieldEndpointsFirstField, 0, "gate0 status next gate CI handoff ready report field endpoints first should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldEndpointsFirstField.stdout.trim(), "nextGateCiHandoff.readyWhen.status", "next gate CI handoff ready report field endpoints first should include first report field");

  const nextGateCiHandoffReadyReportFieldEndpointsLastField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldEndpoints.last"]);
  assertExit(nextGateCiHandoffReadyReportFieldEndpointsLastField, 0, "gate0 status next gate CI handoff ready report field endpoints last should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldEndpointsLastField.stdout.trim(), "stillNotDone", "next gate CI handoff ready report field endpoints last should include last report field");

  const nextGateCiHandoffReadyReportFieldEndpointsAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldEndpointsField"]);
  assertExit(nextGateCiHandoffReadyReportFieldEndpointsAliasField, 0, "gate0 status next gate CI handoff ready report field endpoints alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldEndpointsAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldEndpoints", "next gate CI handoff ready report field endpoints alias should include canonical endpoints field");

  const nextGateCiHandoffReadyReportFieldSummaryField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldSummary"]);
  assertExit(nextGateCiHandoffReadyReportFieldSummaryField, 0, "gate0 status next gate CI handoff ready report field summary should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldSummaryField.stdout.trim(), "22 report fields, first=nextGateCiHandoff.readyWhen.status, last=stillNotDone", "next gate CI handoff ready report field summary should include count and endpoints");

  const nextGateCiHandoffReadyReportFieldSummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFieldSummaryField"]);
  assertExit(nextGateCiHandoffReadyReportFieldSummaryAliasField, 0, "gate0 status next gate CI handoff ready report field summary alias should pass");
  assertEqual(nextGateCiHandoffReadyReportFieldSummaryAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportFieldSummary", "next gate CI handoff ready report field summary alias should include canonical summary field");

  const nextGateCiHandoffReadyReportValuesField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues"]);
  assertExit(nextGateCiHandoffReadyReportValuesField, 0, "gate0 status next gate CI handoff ready report values should pass");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"prismaScaffoldStatusSummary\"", "next gate CI handoff ready report values should include Prisma scaffold status key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"productionGateOrderDetailsSummary\"", "next gate CI handoff ready report values should include production gate summary key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"productionBlockerCount\"", "next gate CI handoff ready report values should include production blocker count key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"progressPercent\"", "next gate CI handoff ready report values should include progress percent key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"progressBasisSummary\"", "next gate CI handoff ready report values should include progress basis summary key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"remainingBlockersSummary\"", "next gate CI handoff ready report values should include remaining blockers summary key");
  assertIncludes(nextGateCiHandoffReadyReportValuesField.stdout, "\"rollbackCommandEndpointSummary\"", "next gate CI handoff ready report values should include rollback command endpoint summary key");

  const nextGateCiHandoffReadyReportValuesAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValuesField"]);
  assertExit(nextGateCiHandoffReadyReportValuesAliasField, 0, "gate0 status next gate CI handoff ready report values alias should pass");
  assertEqual(nextGateCiHandoffReadyReportValuesAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValues", "next gate CI handoff ready report values alias should include canonical values field");

  const nextGateCiHandoffReadyReportValueCountField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueCount"]);
  assertExit(nextGateCiHandoffReadyReportValueCountField, 0, "gate0 status next gate CI handoff ready report value count should pass");
  assertEqual(nextGateCiHandoffReadyReportValueCountField.stdout.trim(), "25", "next gate CI handoff ready report value count should include report field length");

  const nextGateCiHandoffReadyReportValueCountAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueCountField"]);
  assertExit(nextGateCiHandoffReadyReportValueCountAliasField, 0, "gate0 status next gate CI handoff ready report value count alias should pass");
  assertEqual(nextGateCiHandoffReadyReportValueCountAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueCount", "next gate CI handoff ready report value count alias should include canonical count field");

  const nextGateCiHandoffReadyReportValueLastIndexField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueLastIndex"]);
  assertExit(nextGateCiHandoffReadyReportValueLastIndexField, 0, "gate0 status next gate CI handoff ready report value last index should pass");
  assertEqual(nextGateCiHandoffReadyReportValueLastIndexField.stdout.trim(), "24", "next gate CI handoff ready report value last index should include last index");

  const nextGateCiHandoffReadyReportValueFirstField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueFirst"]);
  assertExit(nextGateCiHandoffReadyReportValueFirstField, 0, "gate0 status next gate CI handoff ready report value first should pass");
  assertEqual(nextGateCiHandoffReadyReportValueFirstField.stdout.trim(), "status", "next gate CI handoff ready report value first should include first key");

  const nextGateCiHandoffReadyReportValueLastField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueLast"]);
  assertExit(nextGateCiHandoffReadyReportValueLastField, 0, "gate0 status next gate CI handoff ready report value last should pass");
  assertEqual(nextGateCiHandoffReadyReportValueLastField.stdout.trim(), "remainingBlockersSummary", "next gate CI handoff ready report value last should include last key");

  const nextGateCiHandoffReadyReportValueEndpointsFirstField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueEndpoints.first"]);
  assertExit(nextGateCiHandoffReadyReportValueEndpointsFirstField, 0, "gate0 status next gate CI handoff ready report value endpoint first should pass");
  assertEqual(nextGateCiHandoffReadyReportValueEndpointsFirstField.stdout.trim(), "status", "next gate CI handoff ready report value endpoint first should include first key");

  const nextGateCiHandoffReadyReportValueEndpointsLastField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueEndpoints.last"]);
  assertExit(nextGateCiHandoffReadyReportValueEndpointsLastField, 0, "gate0 status next gate CI handoff ready report value endpoint last should pass");
  assertEqual(nextGateCiHandoffReadyReportValueEndpointsLastField.stdout.trim(), "remainingBlockersSummary", "next gate CI handoff ready report value endpoint last should include last key");

  const nextGateCiHandoffReadyReportValueEndpointSummaryField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueEndpointSummary"]);
  assertExit(nextGateCiHandoffReadyReportValueEndpointSummaryField, 0, "gate0 status next gate CI handoff ready report value endpoint summary should pass");
  assertEqual(nextGateCiHandoffReadyReportValueEndpointSummaryField.stdout.trim(), "first=status, last=remainingBlockersSummary", "next gate CI handoff ready report value endpoint summary should include endpoints");

  const nextGateCiHandoffReadyReportValueEndpointSummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField"]);
  assertExit(nextGateCiHandoffReadyReportValueEndpointSummaryAliasField, 0, "gate0 status next gate CI handoff ready report value endpoint summary alias should pass");
  assertEqual(nextGateCiHandoffReadyReportValueEndpointSummaryAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueEndpointSummary", "next gate CI handoff ready report value endpoint summary alias should include canonical summary field");

  const nextGateCiHandoffReadyReportValueKeysField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys"]);
  assertExit(nextGateCiHandoffReadyReportValueKeysField, 0, "gate0 status next gate CI handoff ready report value keys should pass");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"status\"", "next gate CI handoff ready report value keys should include first key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"prismaScaffoldStatusSummary\"", "next gate CI handoff ready report value keys should include Prisma scaffold status key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"productionGateOrderDetailsSummary\"", "next gate CI handoff ready report value keys should include production gate key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"productionBlockerCount\"", "next gate CI handoff ready report value keys should include production blocker count key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"progressPercent\"", "next gate CI handoff ready report value keys should include progress percent key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"progressBasisSummary\"", "next gate CI handoff ready report value keys should include progress basis summary key");
  assertIncludes(nextGateCiHandoffReadyReportValueKeysField.stdout, "\"remainingBlockersSummary\"", "next gate CI handoff ready report value keys should include last key");

  const nextGateCiHandoffReadyReportValueFirstKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.0"]);
  assertExit(nextGateCiHandoffReadyReportValueFirstKeyField, 0, "gate0 status next gate CI handoff ready report value first key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueFirstKeyField.stdout.trim(), "status", "next gate CI handoff ready report value first key should include status");

  const nextGateCiHandoffReadyReportValuePrismaKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.19"]);
  assertExit(nextGateCiHandoffReadyReportValuePrismaKeyField, 0, "gate0 status next gate CI handoff ready report value Prisma key should pass");
  assertEqual(nextGateCiHandoffReadyReportValuePrismaKeyField.stdout.trim(), "prismaScaffoldStatusSummary", "next gate CI handoff ready report value Prisma key should include scaffold status key");

  const nextGateCiHandoffReadyReportValueProductionGateKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.20"]);
  assertExit(nextGateCiHandoffReadyReportValueProductionGateKeyField, 0, "gate0 status next gate CI handoff ready report value production gate key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueProductionGateKeyField.stdout.trim(), "productionGateOrderDetailsSummary", "next gate CI handoff ready report value production gate key should include production gate summary key");

  const nextGateCiHandoffReadyReportValueProductionBlockerCountKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.21"]);
  assertExit(nextGateCiHandoffReadyReportValueProductionBlockerCountKeyField, 0, "gate0 status next gate CI handoff ready report value production blocker count key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueProductionBlockerCountKeyField.stdout.trim(), "productionBlockerCount", "next gate CI handoff ready report value production blocker count key should include production blocker count key");

  const nextGateCiHandoffReadyReportValueProgressPercentKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.22"]);
  assertExit(nextGateCiHandoffReadyReportValueProgressPercentKeyField, 0, "gate0 status next gate CI handoff ready report value progress percent key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueProgressPercentKeyField.stdout.trim(), "progressPercent", "next gate CI handoff ready report value progress percent key should include progress percent key");

  const nextGateCiHandoffReadyReportValueProgressBasisSummaryKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.23"]);
  assertExit(nextGateCiHandoffReadyReportValueProgressBasisSummaryKeyField, 0, "gate0 status next gate CI handoff ready report value progress basis summary key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueProgressBasisSummaryKeyField.stdout.trim(), "progressBasisSummary", "next gate CI handoff ready report value progress basis summary key should include progress basis summary key");

  const nextGateCiHandoffReadyReportValueLastKeyField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueKeys.24"]);
  assertExit(nextGateCiHandoffReadyReportValueLastKeyField, 0, "gate0 status next gate CI handoff ready report value last key should pass");
  assertEqual(nextGateCiHandoffReadyReportValueLastKeyField.stdout.trim(), "remainingBlockersSummary", "next gate CI handoff ready report value last key should include remaining blockers summary key");

  const nextGateCiHandoffReadyReportValueRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant"]);
  assertExit(nextGateCiHandoffReadyReportValueRegistryInvariantField, 0, "gate0 status next gate CI handoff ready report value registry invariant should pass");
  assertEqual(nextGateCiHandoffReadyReportValueRegistryInvariantField.stdout.trim(), "count=25,lastIndex=24", "next gate CI handoff ready report value registry invariant should include count and last index");

  const nextGateCiHandoffReadyReportValueSummaryField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueSummary"]);
  assertExit(nextGateCiHandoffReadyReportValueSummaryField, 0, "gate0 status next gate CI handoff ready report value summary should pass");
  assertEqual(nextGateCiHandoffReadyReportValueSummaryField.stdout.trim(), "25 values, first=status, last=remainingBlockersSummary", "next gate CI handoff ready report value summary should include count and endpoints");

  const nextGateCiHandoffReadyReportValueSummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValueSummaryField"]);
  assertExit(nextGateCiHandoffReadyReportValueSummaryAliasField, 0, "gate0 status next gate CI handoff ready report value summary alias should pass");
  assertEqual(nextGateCiHandoffReadyReportValueSummaryAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.reportValueSummary", "next gate CI handoff ready report value summary alias should include canonical summary field");

  const nextGateCiHandoffReadyProductionGateReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary"]);
  assertExit(nextGateCiHandoffReadyProductionGateReportValueField, 0, "gate0 status next gate CI handoff ready production gate report value should pass");
  assertEqual(nextGateCiHandoffReadyProductionGateReportValueField.stdout.trim(), "gate1: Production backend persistence. -> docs/dev/GATE1_PERSISTENCE.md | gate2: AWS CI/deploy pipeline. -> docs/dev/CI.md | gate3: Formal Figma/DESIGN.md source of truth. -> docs/dev/DESIGN_STATUS.md | gate4: App store/release build signing. -> docs/dev/ROADMAP.md", "next gate CI handoff ready production gate report value should include compact summary");

  const nextGateCiHandoffReadyProductionBlockerCountReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount"]);
  assertExit(nextGateCiHandoffReadyProductionBlockerCountReportValueField, 0, "gate0 status next gate CI handoff ready production blocker count report value should pass");
  assertEqual(nextGateCiHandoffReadyProductionBlockerCountReportValueField.stdout.trim(), "5", "next gate CI handoff ready production blocker count report value should include blocker count");

  const nextGateCiHandoffReadyProgressPercentReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.progressPercent"]);
  assertExit(nextGateCiHandoffReadyProgressPercentReportValueField, 0, "gate0 status next gate CI handoff ready progress percent report value should pass");
  assertEqual(nextGateCiHandoffReadyProgressPercentReportValueField.stdout.trim(), "38", "next gate CI handoff ready progress percent report value should include progress percent");

  const nextGateCiHandoffReadyRollbackCommandEndpointSummaryReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary"]);
  assertExit(nextGateCiHandoffReadyRollbackCommandEndpointSummaryReportValueField, 0, "gate0 status next gate CI handoff ready rollback endpoint summary report value should pass");
  assertIncludes(nextGateCiHandoffReadyRollbackCommandEndpointSummaryReportValueField.stdout, "last=npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI handoff ready rollback endpoint summary report value should include last rollback command");

  const nextGateCiHandoffReadyProgressBasisSummaryReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary"]);
  assertExit(nextGateCiHandoffReadyProgressBasisSummaryReportValueField, 0, "gate0 status next gate CI handoff ready progress basis summary report value should pass");
  assertEqual(nextGateCiHandoffReadyProgressBasisSummaryReportValueField.stdout.trim(), "3/8 completed, 5 remaining, 38%", "next gate CI handoff ready progress basis summary report value should include progress basis summary");

  const nextGateCiHandoffReadyRemainingBlockersSummaryReportValueField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary"]);
  assertExit(nextGateCiHandoffReadyRemainingBlockersSummaryReportValueField, 0, "gate0 status next gate CI handoff ready remaining blockers summary report value should pass");
  assertEqual(nextGateCiHandoffReadyRemainingBlockersSummaryReportValueField.stdout.trim(), "Real auth/provider/storage integrations. | Production backend persistence. | AWS CI/deploy pipeline. | Formal Figma/DESIGN.md source of truth. | App store/release build signing.", "next gate CI handoff ready remaining blockers summary report value should include blockers summary");

  const nextGateCiHandoffReadyCommandCountField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandCount"]);
  assertExit(nextGateCiHandoffReadyCommandCountField, 0, "gate0 status next gate CI handoff ready command count should pass");
  assertEqual(nextGateCiHandoffReadyCommandCountField.stdout.trim(), "3", "next gate CI handoff ready command count should include array length");

  const nextGateCiHandoffReadyCommandCountAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandCountField"]);
  assertExit(nextGateCiHandoffReadyCommandCountAliasField, 0, "gate0 status next gate CI handoff ready command count alias should pass");
  assertEqual(nextGateCiHandoffReadyCommandCountAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.commandCount", "next gate CI handoff ready command count alias should include canonical command count");

  const nextGateCiHandoffReadyCommandLastIndexField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandLastIndex"]);
  assertExit(nextGateCiHandoffReadyCommandLastIndexField, 0, "gate0 status next gate CI handoff ready command last index should pass");
  assertEqual(nextGateCiHandoffReadyCommandLastIndexField.stdout.trim(), "2", "next gate CI handoff ready command last index should include last index");

  const nextGateCiHandoffReadyCommandLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandLastIndexField"]);
  assertExit(nextGateCiHandoffReadyCommandLastIndexAliasField, 0, "gate0 status next gate CI handoff ready command last index alias should pass");
  assertEqual(nextGateCiHandoffReadyCommandLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.commandLastIndex", "next gate CI handoff ready command last index alias should include canonical last index field");

  const nextGateCiHandoffReadyCommandRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandRegistryStatus"]);
  assertExit(nextGateCiHandoffReadyCommandRegistryStatusField, 0, "gate0 status next gate CI handoff ready command registry status should pass");
  assertEqual(nextGateCiHandoffReadyCommandRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff ready command registry status should include consistency status");

  const nextGateCiHandoffReadyCommandRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandRegistryStatusField"]);
  assertExit(nextGateCiHandoffReadyCommandRegistryStatusAliasField, 0, "gate0 status next gate CI handoff ready command registry status alias should pass");
  assertEqual(nextGateCiHandoffReadyCommandRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.commandRegistryStatus", "next gate CI handoff ready command registry status alias should include canonical status field");

  const nextGateCiHandoffReadyCommandRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandRegistryInvariant"]);
  assertExit(nextGateCiHandoffReadyCommandRegistryInvariantField, 0, "gate0 status next gate CI handoff ready command registry invariant should pass");
  assertEqual(nextGateCiHandoffReadyCommandRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "next gate CI handoff ready command registry invariant should include count and last index");

  const nextGateCiHandoffReadyCommandRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commandRegistryInvariantField"]);
  assertExit(nextGateCiHandoffReadyCommandRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff ready command registry invariant alias should pass");
  assertEqual(nextGateCiHandoffReadyCommandRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.readyWhen.commandRegistryInvariant", "next gate CI handoff ready command registry invariant alias should include canonical invariant field");

  const nextGateCiHandoffReadyFirstCommandField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commands.0"]);
  assertExit(nextGateCiHandoffReadyFirstCommandField, 0, "gate0 status next gate CI handoff ready first command should pass");
  assertEqual(nextGateCiHandoffReadyFirstCommandField.stdout.trim(), "npm run db:check -- --field migrationStatus", "next gate CI handoff ready first command should include migration status command");

  const nextGateCiHandoffReadySecondCommandField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commands.1"]);
  assertExit(nextGateCiHandoffReadySecondCommandField, 0, "gate0 status next gate CI handoff ready second command should pass");
  assertEqual(nextGateCiHandoffReadySecondCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlStatus", "next gate CI handoff ready second command should include database URL status command");

  const nextGateCiHandoffReadyThirdCommandField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.commands.2"]);
  assertExit(nextGateCiHandoffReadyThirdCommandField, 0, "gate0 status next gate CI handoff ready third command should pass");
  assertEqual(nextGateCiHandoffReadyThirdCommandField.stdout.trim(), "npm run db:check -- --field databaseUrlProtocol", "next gate CI handoff ready third command should include database URL protocol command");

  const nextGateCiHandoffReadyReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.0"]);
  assertExit(nextGateCiHandoffReadyReportField, 0, "gate0 status next gate CI handoff ready report field should pass");
  assertEqual(nextGateCiHandoffReadyReportField.stdout.trim(), "nextGateCiHandoff.readyWhen.status", "next gate CI handoff ready report field should include first report field");

  const nextGateCiHandoffReadySummaryReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.1"]);
  assertExit(nextGateCiHandoffReadySummaryReportField, 0, "gate0 status next gate CI handoff ready summary report field should pass");
  assertEqual(nextGateCiHandoffReadySummaryReportField.stdout.trim(), "nextGateCiHandoff.readyWhen.summary", "next gate CI handoff ready summary report field should include summary field");

  const nextGateCiHandoffReadyRequiredFieldsReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.2"]);
  assertExit(nextGateCiHandoffReadyRequiredFieldsReportField, 0, "gate0 status next gate CI handoff ready required fields report field should pass");
  assertEqual(nextGateCiHandoffReadyRequiredFieldsReportField.stdout.trim(), "nextGateCiHandoff.readyWhen.requiredFields", "next gate CI handoff ready required fields report field should include required fields field");

  const nextGateCiHandoffRollbackReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.3"]);
  assertExit(nextGateCiHandoffRollbackReportField, 0, "gate0 status next gate CI handoff rollback report field should pass");
  assertEqual(nextGateCiHandoffRollbackReportField.stdout.trim(), "nextGateCiHandoff.rollback.mode", "next gate CI handoff rollback report field should include rollback mode field");

  const nextGateCiHandoffRollbackVerificationReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.4"]);
  assertExit(nextGateCiHandoffRollbackVerificationReportField, 0, "gate0 status next gate CI handoff rollback verification report field should pass");
  assertEqual(nextGateCiHandoffRollbackVerificationReportField.stdout.trim(), "nextGateCiHandoff.rollback.verificationCommand", "next gate CI handoff rollback verification report field should include rollback verification field");

  const nextGateCiHandoffRollbackCommandReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.5"]);
  assertExit(nextGateCiHandoffRollbackCommandReportField, 0, "gate0 status next gate CI handoff rollback command report field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandReportField.stdout.trim(), "nextGateCiHandoff.rollback.reportCommand", "next gate CI handoff rollback command report field should include rollback report command field");

  const nextGateCiHandoffRollbackExpectedModeReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.6"]);
  assertExit(nextGateCiHandoffRollbackExpectedModeReportField, 0, "gate0 status next gate CI handoff rollback expected mode report field should pass");
  assertEqual(nextGateCiHandoffRollbackExpectedModeReportField.stdout.trim(), "nextGateCiHandoff.rollback.expectedMode", "next gate CI handoff rollback expected mode report field should include rollback expected mode field");

  const nextGateCiHandoffRollbackSummaryReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.7"]);
  assertExit(nextGateCiHandoffRollbackSummaryReportField, 0, "gate0 status next gate CI handoff rollback summary report field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryReportField.stdout.trim(), "nextGateCiHandoff.rollback.summary", "next gate CI handoff rollback summary report field should include rollback summary field");

  const nextGateCiHandoffRollbackSummaryAliasReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.8"]);
  assertExit(nextGateCiHandoffRollbackSummaryAliasReportField, 0, "gate0 status next gate CI handoff rollback summary alias report field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryAliasReportField.stdout.trim(), "nextGateCiHandoff.rollback.summaryField", "next gate CI handoff rollback summary alias report field should include rollback summary alias field");

  const nextGateCiHandoffRollbackModeAliasReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.9"]);
  assertExit(nextGateCiHandoffRollbackModeAliasReportField, 0, "gate0 status next gate CI handoff rollback mode alias report field should pass");
  assertEqual(nextGateCiHandoffRollbackModeAliasReportField.stdout.trim(), "nextGateCiHandoff.rollback.modeField", "next gate CI handoff rollback mode alias report field should include rollback mode alias field");

  const nextGateCiHandoffRollbackExpectedModeAliasReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.10"]);
  assertExit(nextGateCiHandoffRollbackExpectedModeAliasReportField, 0, "gate0 status next gate CI handoff rollback expected mode alias report field should pass");
  assertEqual(nextGateCiHandoffRollbackExpectedModeAliasReportField.stdout.trim(), "nextGateCiHandoff.rollback.expectedModeField", "next gate CI handoff rollback expected mode alias report field should include rollback expected mode alias field");

  const nextGateCiHandoffRequiredChecksSourceReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.11"]);
  assertExit(nextGateCiHandoffRequiredChecksSourceReportField, 0, "gate0 status next gate CI handoff required checks source report field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksSourceReportField.stdout.trim(), "nextGateCiHandoff.requiredChecksSource", "next gate CI handoff required checks source report field should include source field");

  const nextGateCiHandoffRequiredChecksParsedReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.12"]);
  assertExit(nextGateCiHandoffRequiredChecksParsedReportField, 0, "gate0 status next gate CI handoff required checks parsed report field should pass");
  assertEqual(nextGateCiHandoffRequiredChecksParsedReportField.stdout.trim(), "nextGateCiHandoff.requiredChecksParsed", "next gate CI handoff required checks parsed report field should include parsed field");

  const nextGateCiHandoffFailureCodeCountReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.13"]);
  assertExit(nextGateCiHandoffFailureCodeCountReportField, 0, "gate0 status next gate CI handoff failure code count report field should pass");
  assertEqual(nextGateCiHandoffFailureCodeCountReportField.stdout.trim(), "nextGateCiHandoff.failureCodeCount", "next gate CI handoff failure code count report field should include count field");

  const nextGateCiHandoffEvidenceDocCountReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.14"]);
  assertExit(nextGateCiHandoffEvidenceDocCountReportField, 0, "gate0 status next gate CI handoff evidence doc count report field should pass");
  assertEqual(nextGateCiHandoffEvidenceDocCountReportField.stdout.trim(), "nextGateCiHandoff.evidenceDocCount", "next gate CI handoff evidence doc count report field should include count field");

  const nextGateCiHandoffRequiredCheckCountReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.15"]);
  assertExit(nextGateCiHandoffRequiredCheckCountReportField, 0, "gate0 status next gate CI handoff required check count report field should pass");
  assertEqual(nextGateCiHandoffRequiredCheckCountReportField.stdout.trim(), "nextGateCiHandoff.requiredCheckCount", "next gate CI handoff required check count report field should include count field");

  const nextGateCiHandoffPrismaScaffoldStatusReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.16"]);
  assertExit(nextGateCiHandoffPrismaScaffoldStatusReportField, 0, "gate0 status next gate CI handoff Prisma scaffold status report field should pass");
  assertEqual(nextGateCiHandoffPrismaScaffoldStatusReportField.stdout.trim(), "nextGateDbMatrix.prismaScaffoldStatus.summary", "next gate CI handoff Prisma scaffold status report field should include scaffold status field");

  const nextGateCiHandoffProductionGateSummaryReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.17"]);
  assertExit(nextGateCiHandoffProductionGateSummaryReportField, 0, "gate0 status next gate CI handoff production gate summary report field should pass");
  assertEqual(nextGateCiHandoffProductionGateSummaryReportField.stdout.trim(), "productionBlockersSummary.gateOrderDetailsSummary", "next gate CI handoff production gate summary report field should include compact summary field");

  const nextGateCiHandoffProductionBlockerCountReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.18"]);
  assertExit(nextGateCiHandoffProductionBlockerCountReportField, 0, "gate0 status next gate CI handoff production blocker count report field should pass");
  assertEqual(nextGateCiHandoffProductionBlockerCountReportField.stdout.trim(), "productionBlockersSummary.count", "next gate CI handoff production blocker count report field should include blocker count field");

  const nextGateCiHandoffProgressPercentReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.19"]);
  assertExit(nextGateCiHandoffProgressPercentReportField, 0, "gate0 status next gate CI handoff progress percent report field should pass");
  assertEqual(nextGateCiHandoffProgressPercentReportField.stdout.trim(), "progressPercent", "next gate CI handoff progress percent report field should include progress percent field");

  const nextGateCiHandoffProgressBasisReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.20"]);
  assertExit(nextGateCiHandoffProgressBasisReportField, 0, "gate0 status next gate CI handoff progress basis report field should pass");
  assertEqual(nextGateCiHandoffProgressBasisReportField.stdout.trim(), "progressBasis", "next gate CI handoff progress basis report field should include progress basis field");

  const nextGateCiHandoffRemainingBlockersReportField = await runStatus(["--field", "nextGateCiHandoff.readyWhen.reportFields.21"]);
  assertExit(nextGateCiHandoffRemainingBlockersReportField, 0, "gate0 status next gate CI handoff remaining blockers report field should pass");
  assertEqual(nextGateCiHandoffRemainingBlockersReportField.stdout.trim(), "stillNotDone", "next gate CI handoff remaining blockers report field should include still not done field");

  const nextGateCiHandoffRollbackModeField = await runStatus(["--field", "nextGateCiHandoff.rollback.mode"]);
  assertExit(nextGateCiHandoffRollbackModeField, 0, "gate0 status next gate CI handoff rollback mode field should pass");
  assertEqual(nextGateCiHandoffRollbackModeField.stdout.trim(), "fixture", "next gate CI handoff rollback mode field should include fixture");

  const nextGateCiHandoffRollbackModeAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.modeField"]);
  assertExit(nextGateCiHandoffRollbackModeAliasField, 0, "gate0 status next gate CI handoff rollback mode alias field should pass");
  assertEqual(nextGateCiHandoffRollbackModeAliasField.stdout.trim(), "nextGateCiHandoff.rollback.mode", "next gate CI handoff rollback mode alias field should include canonical mode field");

  const nextGateCiHandoffRollbackExpectedModeField = await runStatus(["--field", "nextGateCiHandoff.rollback.expectedMode"]);
  assertExit(nextGateCiHandoffRollbackExpectedModeField, 0, "gate0 status next gate CI handoff rollback expected mode field should pass");
  assertEqual(nextGateCiHandoffRollbackExpectedModeField.stdout.trim(), "fixture", "next gate CI handoff rollback expected mode field should include fixture");

  const nextGateCiHandoffRollbackExpectedModeAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.expectedModeField"]);
  assertExit(nextGateCiHandoffRollbackExpectedModeAliasField, 0, "gate0 status next gate CI handoff rollback expected mode alias field should pass");
  assertEqual(nextGateCiHandoffRollbackExpectedModeAliasField.stdout.trim(), "nextGateCiHandoff.rollback.expectedMode", "next gate CI handoff rollback expected mode alias field should include canonical expected mode field");

  const nextGateCiHandoffRollbackSummaryField = await runStatus(["--field", "nextGateCiHandoff.rollback.summary"]);
  assertExit(nextGateCiHandoffRollbackSummaryField, 0, "gate0 status next gate CI handoff rollback summary field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryField.stdout.trim(), "rollback to fixture mode, verify persistenceModeDefault=fixture, then print rollback handoff", "next gate CI handoff rollback summary field should include summary");

  const nextGateCiHandoffRollbackSummaryAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.summaryField"]);
  assertExit(nextGateCiHandoffRollbackSummaryAliasField, 0, "gate0 status next gate CI handoff rollback summary alias field should pass");
  assertEqual(nextGateCiHandoffRollbackSummaryAliasField.stdout.trim(), "nextGateCiHandoff.rollback.summary", "next gate CI handoff rollback summary alias field should include canonical summary field");

  const nextGateCiHandoffRollbackCommandField = await runStatus(["--field", "nextGateCiHandoff.rollback.command"]);
  assertExit(nextGateCiHandoffRollbackCommandField, 0, "gate0 status next gate CI handoff rollback command field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandField.stdout.trim(), "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "next gate CI handoff rollback command field should include fixture rollback command");

  const nextGateCiHandoffRollbackCommandAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandField"]);
  assertExit(nextGateCiHandoffRollbackCommandAliasField, 0, "gate0 status next gate CI handoff rollback command alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandAliasField.stdout.trim(), "nextGateCiHandoff.rollback.command", "next gate CI handoff rollback command alias field should include canonical command field");

  const nextGateCiHandoffRollbackCommandsAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandsField"]);
  assertExit(nextGateCiHandoffRollbackCommandsAliasField, 0, "gate0 status next gate CI handoff rollback commands alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandsAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commands", "next gate CI handoff rollback commands alias field should include canonical commands field");

  const nextGateCiHandoffRollbackVerificationField = await runStatus(["--field", "nextGateCiHandoff.rollback.verificationCommand"]);
  assertExit(nextGateCiHandoffRollbackVerificationField, 0, "gate0 status next gate CI handoff rollback verification field should pass");
  assertEqual(nextGateCiHandoffRollbackVerificationField.stdout.trim(), "npm run gate0:status -- --field persistenceModeDefault", "next gate CI handoff rollback verification field should include persistence mode command");

  const nextGateCiHandoffRollbackVerificationAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.verificationCommandField"]);
  assertExit(nextGateCiHandoffRollbackVerificationAliasField, 0, "gate0 status next gate CI handoff rollback verification alias field should pass");
  assertEqual(nextGateCiHandoffRollbackVerificationAliasField.stdout.trim(), "nextGateCiHandoff.rollback.verificationCommand", "next gate CI handoff rollback verification alias field should include canonical verification command field");

  const nextGateCiHandoffRollbackReportCommandField = await runStatus(["--field", "nextGateCiHandoff.rollback.reportCommand"]);
  assertExit(nextGateCiHandoffRollbackReportCommandField, 0, "gate0 status next gate CI handoff rollback report command field should pass");
  assertEqual(nextGateCiHandoffRollbackReportCommandField.stdout.trim(), "npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI handoff rollback report command field should include rollback report command");

  const nextGateCiHandoffRollbackReportCommandAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.reportCommandField"]);
  assertExit(nextGateCiHandoffRollbackReportCommandAliasField, 0, "gate0 status next gate CI handoff rollback report command alias field should pass");
  assertEqual(nextGateCiHandoffRollbackReportCommandAliasField.stdout.trim(), "nextGateCiHandoff.rollback.reportCommand", "next gate CI handoff rollback report command alias field should include canonical report command field");

  const nextGateCiHandoffRollbackCommandCountField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandCount"]);
  assertExit(nextGateCiHandoffRollbackCommandCountField, 0, "gate0 status next gate CI handoff rollback command count field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandCountField.stdout.trim(), "3", "next gate CI handoff rollback command count field should include count");

  const nextGateCiHandoffRollbackCommandCountAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandCountField"]);
  assertExit(nextGateCiHandoffRollbackCommandCountAliasField, 0, "gate0 status next gate CI handoff rollback command count alias field should pass");
  assertEqual(nextGateCiHandoffRollbackCommandCountAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandCount", "next gate CI handoff rollback command count alias field should include canonical command count");

  const nextGateCiHandoffRollbackCommandLastIndexField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandLastIndex"]);
  assertExit(nextGateCiHandoffRollbackCommandLastIndexField, 0, "gate0 status next gate CI handoff rollback command last index should pass");
  assertEqual(nextGateCiHandoffRollbackCommandLastIndexField.stdout.trim(), "2", "next gate CI handoff rollback command last index should include last index");

  const nextGateCiHandoffRollbackCommandLastIndexAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandLastIndexField"]);
  assertExit(nextGateCiHandoffRollbackCommandLastIndexAliasField, 0, "gate0 status next gate CI handoff rollback command last index alias should pass");
  assertEqual(nextGateCiHandoffRollbackCommandLastIndexAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandLastIndex", "next gate CI handoff rollback command last index alias should include canonical last index field");

  const nextGateCiHandoffRollbackCommandRegistryStatusField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandRegistryStatus"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistryStatusField, 0, "gate0 status next gate CI handoff rollback command registry status should pass");
  assertEqual(nextGateCiHandoffRollbackCommandRegistryStatusField.stdout.trim(), "consistent", "next gate CI handoff rollback command registry status should include consistency status");

  const nextGateCiHandoffRollbackCommandRegistryStatusAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandRegistryStatusField"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistryStatusAliasField, 0, "gate0 status next gate CI handoff rollback command registry status alias should pass");
  assertEqual(nextGateCiHandoffRollbackCommandRegistryStatusAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandRegistryStatus", "next gate CI handoff rollback command registry status alias should include canonical status field");

  const nextGateCiHandoffRollbackCommandRegistryInvariantField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandRegistryInvariant"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistryInvariantField, 0, "gate0 status next gate CI handoff rollback command registry invariant should pass");
  assertEqual(nextGateCiHandoffRollbackCommandRegistryInvariantField.stdout.trim(), "count=3,lastIndex=2", "next gate CI handoff rollback command registry invariant should include count and last index");

  const nextGateCiHandoffRollbackCommandRegistryInvariantAliasField = await runStatus(["--field", "nextGateCiHandoff.rollback.commandRegistryInvariantField"]);
  assertExit(nextGateCiHandoffRollbackCommandRegistryInvariantAliasField, 0, "gate0 status next gate CI handoff rollback command registry invariant alias should pass");
  assertEqual(nextGateCiHandoffRollbackCommandRegistryInvariantAliasField.stdout.trim(), "nextGateCiHandoff.rollback.commandRegistryInvariant", "next gate CI handoff rollback command registry invariant alias should include canonical invariant field");

  const nextGateCiHandoffRollbackFirstCommandField = await runStatus(["--field", "nextGateCiHandoff.rollback.commands.0"]);
  assertExit(nextGateCiHandoffRollbackFirstCommandField, 0, "gate0 status next gate CI handoff rollback first command field should pass");
  assertEqual(nextGateCiHandoffRollbackFirstCommandField.stdout.trim(), "$env:PERSISTENCE_MODE='fixture'; npm test; Remove-Item Env:PERSISTENCE_MODE -ErrorAction SilentlyContinue", "next gate CI handoff rollback first command field should include fixture rollback command");

  const nextGateCiHandoffRollbackSecondCommandField = await runStatus(["--field", "nextGateCiHandoff.rollback.commands.1"]);
  assertExit(nextGateCiHandoffRollbackSecondCommandField, 0, "gate0 status next gate CI handoff rollback second command field should pass");
  assertEqual(nextGateCiHandoffRollbackSecondCommandField.stdout.trim(), "npm run gate0:status -- --field persistenceModeDefault", "next gate CI handoff rollback second command field should include verification command");

  const nextGateCiHandoffRollbackThirdCommandField = await runStatus(["--field", "nextGateCiHandoff.rollback.commands.2"]);
  assertExit(nextGateCiHandoffRollbackThirdCommandField, 0, "gate0 status next gate CI handoff rollback third command field should pass");
  assertEqual(nextGateCiHandoffRollbackThirdCommandField.stdout.trim(), "npm run gate0:status -- --field nextGateCiHandoff.rollback", "next gate CI handoff rollback third command field should include report command");

  const nextGateRequiredChecksField = await runStatus(["--field", "nextGateRequiredChecks"]);
  assertExit(nextGateRequiredChecksField, 0, "gate0 status next gate required checks field should pass");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check", "next gate required checks field should include db check");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --json", "next gate required checks field should include db check JSON");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --field migrationStatus", "next gate required checks field should include migration status");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --field databaseUrlStatus", "next gate required checks field should include database URL status");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --field databaseUrlProtocol", "next gate required checks field should include database URL protocol");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run not-scaffolded:test", "next gate required checks field should include not-scaffolded test");
  assertIncludes(nextGateRequiredChecksField.stdout, "node scripts/not-scaffolded.mjs --help", "next gate required checks field should include not-scaffolded help");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm test", "next gate required checks field should include test");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run privacy:test", "next gate required checks field should include privacy check");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run errors:check", "next gate required checks field should include error check");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --field prismaSchemaPresent", "next gate required checks field should include doc-defined Prisma schema check");
  assertIncludes(nextGateRequiredChecksField.stdout, "npm run db:check -- --field databaseUrlPresent", "next gate required checks field should include doc-defined database URL present check");

  const help = await runStatus(["--help"]);
  assertExit(help, 0, "gate0 status help should pass");
  assertIncludes(help.stdout, "Usage: npm run gate0:status -- [--json | --field <name> | --help]", "help should include usage");
  assertIncludes(help.stdout, "--field NAME", "help should document field output");
  assertIncludes(help.stdout, "Stable fields:", "help should include stable fields");
  assertIncludes(help.stdout, "Field notes:", "help should include field notes");
  assertIncludes(help.stdout, "currentStatusField", "help should include current status alias field");
  assertIncludes(help.stdout, "currentStatusSummary", "help should include current status summary field");
  assertIncludes(help.stdout, "currentStatusSummaryField", "help should include current status summary alias field");
  assertIncludes(help.stdout, "progressPercent", "help should include progress field");
  assertIncludes(help.stdout, "progressBasis", "help should include progress basis field");
  assertIncludes(help.stdout, "progressBasis.completedCount", "help should include progress basis completed count field");
  assertIncludes(help.stdout, "progressBasis.remainingCount", "help should include progress basis remaining count field");
  assertIncludes(help.stdout, "progressBasis.totalCount", "help should include progress basis total count field");
  assertIncludes(help.stdout, "progressBasis.percent", "help should include progress basis percent field");
  assertIncludes(help.stdout, "completedLocally", "help should include completed field");
  assertIncludes(help.stdout, "completedLocallyCount", "help should include completed locally count field");
  assertIncludes(help.stdout, "completedLocallyFirst", "help should include completed locally first field");
  assertIncludes(help.stdout, "completedLocallyLastIndex", "help should include completed locally last index field");
  assertIncludes(help.stdout, "completedLocallyLast", "help should include completed locally last field");
  assertIncludes(help.stdout, "completedLocallyRegistryStatus", "help should include completed locally registry status field");
  assertIncludes(help.stdout, "completedLocallyRegistryInvariant", "help should include completed locally registry invariant field");
  assertIncludes(help.stdout, "completedLocallySummary", "help should include completed locally summary field");
  assertIncludes(help.stdout, "fullTestBaselineField", "help should include full test baseline alias field");
  assertIncludes(help.stdout, "fullTestBaselineCommand", "help should include full test baseline command field");
  assertIncludes(help.stdout, "fullTestBaselineSummary", "help should include full test baseline summary field");
  assertIncludes(help.stdout, "localApiBoundaryChecks.0", "help should include first local API boundary check field");
  assertIncludes(help.stdout, "localApiBoundaryChecks.1", "help should include last local API boundary check field");
  assertIncludes(help.stdout, "localApiBoundaryCheckCount", "help should include local API boundary check count field");
  assertIncludes(help.stdout, "localApiBoundaryCheckFirst", "help should include local API boundary check first field");
  assertIncludes(help.stdout, "localApiBoundaryCheckLastIndex", "help should include local API boundary check last index field");
  assertIncludes(help.stdout, "localApiBoundaryCheckLast", "help should include local API boundary check last field");
  assertIncludes(help.stdout, "localApiBoundaryCheckSummary", "help should include local API boundary check summary field");
  assertIncludes(help.stdout, "stillNotDone.0", "help should include first remaining blocker field");
  assertIncludes(help.stdout, "stillNotDone.4", "help should include last remaining blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary", "help should include production blockers summary field");
  assertIncludes(help.stdout, "productionBlockersSummary.count", "help should include production blockers count field");
  assertIncludes(help.stdout, "productionBlockersSummary.nextGateBlocker", "help should include production blockers next gate blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.nextGateDocPath", "help should include production blockers next gate doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.blockersField", "help should include production blockers list alias field");
  assertIncludes(help.stdout, "productionBlockersSummary.blockers.0", "help should include production blockers first list field");
  assertIncludes(help.stdout, "productionBlockersSummary.blockers.4", "help should include production blockers last list field");
  assertIncludes(help.stdout, "relatedDocs.0", "help should include first related doc field");
  assertIncludes(help.stdout, "relatedDocs.4", "help should include last related doc field");
  assertIncludes(help.stdout, "relatedDocCount", "help should include related doc count field");
  assertIncludes(help.stdout, "relatedDocFirst", "help should include related doc first field");
  assertIncludes(help.stdout, "relatedDocLastIndex", "help should include related doc last index field");
  assertIncludes(help.stdout, "relatedDocLast", "help should include related doc last field");
  assertIncludes(help.stdout, "relatedDocSummary", "help should include related doc summary field");
  assertIncludes(help.stdout, "persistenceModeDefaultField", "help should include persistence default alias field");
  assertIncludes(help.stdout, "supportedPersistenceModes.0", "help should include first supported persistence mode field");
  assertIncludes(help.stdout, "supportedPersistenceModes.1", "help should include last supported persistence mode field");
  assertIncludes(help.stdout, "supportedPersistenceModeCount", "help should include supported persistence mode count field");
  assertIncludes(help.stdout, "supportedPersistenceModeFirst", "help should include supported persistence mode first field");
  assertIncludes(help.stdout, "supportedPersistenceModeLastIndex", "help should include supported persistence mode last index field");
  assertIncludes(help.stdout, "supportedPersistenceModeLast", "help should include supported persistence mode last field");
  assertIncludes(help.stdout, "supportedPersistenceModeSummary", "help should include supported persistence mode summary field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate", "help should include production blockers by-gate field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGateKeys", "help should include production blockers by-gate keys field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGateRegistryInvariant", "help should include production blockers by-gate invariant field");
  assertIncludes(help.stdout, "productionBlockersSummary.gateOrder", "help should include production blockers gate order field");
  assertIncludes(help.stdout, "productionBlockersSummary.gateOrderRegistryInvariant", "help should include production blockers gate order invariant field");
  assertIncludes(help.stdout, "productionBlockersSummary.gateOrderDetails", "help should include production blockers gate order details field");
  assertIncludes(help.stdout, "productionBlockersSummary.gateOrderDetails.0.docPath", "help should include production blockers first gate order detail doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.gateOrderDetailsSummary", "help should include production blockers gate order detail summary field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate1Prep.blocker", "help should include production blockers Gate 1 prep blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate1Prep.docPath", "help should include production blockers Gate 1 prep doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate1.blocker", "help should include production blockers Gate 1 blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate1.docPath", "help should include production blockers Gate 1 doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate2.blocker", "help should include production blockers Gate 2 blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate2.docPath", "help should include production blockers Gate 2 doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate3.blocker", "help should include production blockers Gate 3 blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate3.docPath", "help should include production blockers Gate 3 doc field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate4.blocker", "help should include production blockers Gate 4 blocker field");
  assertIncludes(help.stdout, "productionBlockersSummary.byGate.gate4.docPath", "help should include production blockers Gate 4 doc field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmoke.status", "help should include nested device field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeStatusField", "help should include device smoke status alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeRunIdField", "help should include device smoke run ID alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeManufacturerField", "help should include device smoke manufacturer alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeModelField", "help should include device smoke model alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeAndroidReleaseField", "help should include device smoke Android release alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeAndroidSdkField", "help should include device smoke Android SDK alias field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeDevice", "help should include device smoke compact identity field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeAndroid", "help should include device smoke compact Android field");
  assertIncludes(help.stdout, "latestAndroidDeviceSmokeSummary", "help should include device smoke summary field");
  assertIncludes(help.stdout, "persistenceModeDefault", "help should include persistence default field");
  assertIncludes(help.stdout, "supportedPersistenceModes", "help should include supported persistence modes field");
  assertIncludes(help.stdout, "nextGateDoc", "help should include next gate doc field");
  assertIncludes(help.stdout, "nextGateDocPath", "help should include next gate doc path field");
  assertIncludes(help.stdout, "nextGateDocPathField", "help should include next gate doc path alias field");
  assertIncludes(help.stdout, "nextGateCommand", "help should include next gate command field");
  assertIncludes(help.stdout, "nextGateCommandField", "help should include next gate command alias field");
  assertIncludes(help.stdout, "nextGateSummary", "help should include next gate summary field");
  assertIncludes(help.stdout, "nextGateCheckCommand", "help should include next gate check command field");
  assertIncludes(help.stdout, "nextGateCheckCommandField", "help should include next gate check command alias field");
  assertIncludes(help.stdout, "nextGateCheckJsonCommand", "help should include next gate check JSON command field");
  assertIncludes(help.stdout, "nextGateCheckJsonCommandField", "help should include next gate check JSON command alias field");
  assertIncludes(help.stdout, "nextGateCheckCommandSummary", "help should include next gate check command summary field");
  assertIncludes(help.stdout, "nextGateMigrationStatusCommand", "help should include next gate migration status command field");
  assertIncludes(help.stdout, "nextGateMigrationStatusCommandField", "help should include next gate migration status command alias field");
  assertIncludes(help.stdout, "nextGateMigrationStatus", "help should include next gate migration status object field");
  assertIncludes(help.stdout, "nextGateMigrationStatusField", "help should include next gate migration status object alias field");
  assertIncludes(help.stdout, "nextGateMigrationStatus.currentExpectedStatus", "help should include next gate migration status nested field");
  assertIncludes(help.stdout, "nextGateMigrationStatus.nextExpectedStatus", "help should include next gate migration status next field");
  assertIncludes(help.stdout, "nextGateMigrationStatus.guardCommand", "help should include next gate migration status guard field");
  assertIncludes(help.stdout, "nextGateMigrationStatusSummary", "help should include next gate migration status summary field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlStatusCommand", "help should include next gate database URL status command field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlStatusCommandField", "help should include next gate database URL status command alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlProtocolCommand", "help should include next gate database URL protocol command field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlProtocolCommandField", "help should include next gate database URL protocol command alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlValidationCommand", "help should include next gate database URL validation command field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlValidationCommandField", "help should include next gate database URL validation command alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedStatus", "help should include next gate database URL expected status field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedStatusField", "help should include next gate database URL expected status alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedProtocols", "help should include next gate database URL expected protocols field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedProtocolsField", "help should include next gate database URL expected protocols alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrl", "help should include next gate database URL object field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlField", "help should include next gate database URL object alias field");
  assertIncludes(help.stdout, "nextGateDatabaseUrl.expectedStatus", "help should include next gate database URL nested expected status field");
  assertIncludes(help.stdout, "nextGateDatabaseUrl.expectedProtocols", "help should include next gate database URL nested expected protocols field");
  assertIncludes(help.stdout, "nextGateDatabaseUrlSummary", "help should include next gate database URL summary field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold", "help should include next gate Prisma scaffold object field");
  assertIncludes(help.stdout, "nextGatePrismaScaffoldField", "help should include next gate Prisma scaffold object alias field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold.schemaPath", "help should include next gate Prisma scaffold nested schema path field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold.migrationsPath", "help should include next gate Prisma scaffold nested migrations path field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold.schemaPresentCommand", "help should include next gate Prisma scaffold schema command field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold.migrationsPresentCommand", "help should include next gate Prisma scaffold migrations command field");
  assertIncludes(help.stdout, "nextGatePrismaScaffold.expectedPresent", "help should include next gate Prisma scaffold expected present field");
  assertIncludes(help.stdout, "nextGatePrismaScaffoldSummary", "help should include next gate Prisma scaffold summary field");
  assertIncludes(help.stdout, "nextGateMigrationGuardCommand", "help should include next gate migration guard command field");
  assertIncludes(help.stdout, "nextGateMigrationGuardCommandField", "help should include next gate migration guard command alias field");
  assertIncludes(help.stdout, "nextGateMigrationGuardMigrationCommand", "help should include next gate migration guard migration command field");
  assertIncludes(help.stdout, "nextGateMigrationGuardMigrationCommandField", "help should include next gate migration guard migration command alias field");
  assertIncludes(help.stdout, "nextGateMigrationGuardHelperCommand", "help should include next gate migration guard helper command field");
  assertIncludes(help.stdout, "nextGateMigrationGuardHelperCommandField", "help should include next gate migration guard helper command alias field");
  assertIncludes(help.stdout, "nextGateMigrationGuardErrorCode", "help should include next gate migration guard error code field");
  assertIncludes(help.stdout, "nextGateMigrationGuardErrorCodeField", "help should include next gate migration guard error code alias field");
  assertIncludes(help.stdout, "nextGateMigrationGuard", "help should include next gate migration guard object field");
  assertIncludes(help.stdout, "nextGateMigrationGuardField", "help should include next gate migration guard object alias field");
  assertIncludes(help.stdout, "nextGateMigrationGuard.errorCode", "help should include next gate migration guard nested error code field");
  assertIncludes(help.stdout, "nextGateMigrationGuardSummary", "help should include next gate migration guard summary field");
  assertIncludes(help.stdout, "nextGateDbMatrix", "help should include next gate DB matrix object field");
  assertIncludes(help.stdout, "nextGateDbMatrixField", "help should include next gate DB matrix object alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.checkCommand", "help should include next gate DB matrix check command field");
  assertIncludes(help.stdout, "nextGateDbMatrixCheckCommandField", "help should include next gate DB matrix check command alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.jsonCommand", "help should include next gate DB matrix JSON command field");
  assertIncludes(help.stdout, "nextGateDbMatrixJsonCommandField", "help should include next gate DB matrix JSON command alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.migrationStatusCommand", "help should include next gate DB matrix migration status command field");
  assertIncludes(help.stdout, "nextGateDbMatrixMigrationStatusCommandField", "help should include next gate DB matrix migration status command alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.databaseUrl.expectedStatus", "help should include next gate DB matrix nested database URL field");
  assertIncludes(help.stdout, "nextGateDbMatrixDatabaseUrlExpectedStatusField", "help should include next gate DB matrix database URL expected status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrixPrismaScaffoldStatusSummaryField", "help should include next gate DB matrix Prisma scaffold status summary alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSource", "help should include next gate DB matrix required checks source field");
  assertIncludes(help.stdout, "nextGateDbMatrixRequiredChecksSourceField", "help should include next gate DB matrix required checks source alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksParsed", "help should include next gate DB matrix required checks parsed field");
  assertIncludes(help.stdout, "nextGateDbMatrixRequiredChecksParsedField", "help should include next gate DB matrix required checks parsed alias field");
  assertIncludes(help.stdout, "nextGateDbMatrixSummary", "help should include next gate DB matrix summary field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeKeys", "help should include next gate DB matrix required check type keys field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeKeysField", "help should include next gate DB matrix required check type keys alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.0", "help should include next gate DB matrix first required check type key field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeKeys.4", "help should include next gate DB matrix last required check type key field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeCount", "help should include next gate DB matrix required check type count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeCountField", "help should include next gate DB matrix required check type count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndex", "help should include next gate DB matrix required check type last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeLastIndexField", "help should include next gate DB matrix required check type last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeFirst", "help should include next gate DB matrix first required check type field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeFirstField", "help should include next gate DB matrix first required check type alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeLast", "help should include next gate DB matrix last required check type field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeLastField", "help should include next gate DB matrix last required check type alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatus", "help should include next gate DB matrix required check type registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryStatusField", "help should include next gate DB matrix required check type registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariant", "help should include next gate DB matrix required check type registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byTypeRegistryInvariantField", "help should include next gate DB matrix required check type registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.count", "help should include next gate DB matrix required check DB count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.count", "help should include next gate DB matrix required check guard count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.count", "help should include next gate DB matrix required check test count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.count", "help should include next gate DB matrix required check privacy count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.count", "help should include next gate DB matrix required check errors count field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.countField", "help should include next gate DB matrix required check DB count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.countField", "help should include next gate DB matrix required check guard count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.countField", "help should include next gate DB matrix required check test count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.countField", "help should include next gate DB matrix required check privacy count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.countField", "help should include next gate DB matrix required check errors count alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandsField", "help should include next gate DB matrix required check DB commands alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandsField", "help should include next gate DB matrix required check guard commands alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandsField", "help should include next gate DB matrix required check test commands alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandsField", "help should include next gate DB matrix required check privacy commands alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandsField", "help should include next gate DB matrix required check errors commands alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndex", "help should include next gate DB matrix required check DB command last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndex", "help should include next gate DB matrix required check guard command last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndex", "help should include next gate DB matrix required check test command last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndex", "help should include next gate DB matrix required check privacy command last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndex", "help should include next gate DB matrix required check errors command last index field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandLastIndexField", "help should include next gate DB matrix required check DB command last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandLastIndexField", "help should include next gate DB matrix required check guard command last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandLastIndexField", "help should include next gate DB matrix required check test command last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandLastIndexField", "help should include next gate DB matrix required check privacy command last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandLastIndexField", "help should include next gate DB matrix required check errors command last index alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatus", "help should include next gate DB matrix required check DB command registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatus", "help should include next gate DB matrix required check guard command registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatus", "help should include next gate DB matrix required check test command registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatus", "help should include next gate DB matrix required check privacy command registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatus", "help should include next gate DB matrix required check errors command registry status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryStatusField", "help should include next gate DB matrix required check DB command registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryStatusField", "help should include next gate DB matrix required check guard command registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryStatusField", "help should include next gate DB matrix required check test command registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryStatusField", "help should include next gate DB matrix required check privacy command registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryStatusField", "help should include next gate DB matrix required check errors command registry status alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariant", "help should include next gate DB matrix required check DB command registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariant", "help should include next gate DB matrix required check guard command registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariant", "help should include next gate DB matrix required check test command registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariant", "help should include next gate DB matrix required check privacy command registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariant", "help should include next gate DB matrix required check errors command registry invariant field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commandRegistryInvariantField", "help should include next gate DB matrix required check DB command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commandRegistryInvariantField", "help should include next gate DB matrix required check guard command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commandRegistryInvariantField", "help should include next gate DB matrix required check test command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commandRegistryInvariantField", "help should include next gate DB matrix required check privacy command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commandRegistryInvariantField", "help should include next gate DB matrix required check errors command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.0", "help should include next gate DB matrix first DB command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.db.commands.7", "help should include next gate DB matrix last DB command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.0", "help should include next gate DB matrix first guard command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.guard.commands.1", "help should include next gate DB matrix last guard command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.test.commands.0", "help should include next gate DB matrix test command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.privacy.commands.0", "help should include next gate DB matrix privacy command field");
  assertIncludes(help.stdout, "nextGateDbMatrix.requiredChecksSummary.byType.errors.commands.0", "help should include next gate DB matrix errors command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSource", "help should include next gate required checks source field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSourceField", "help should include next gate required checks source alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksParsed", "help should include next gate required checks parsed field");
  assertIncludes(help.stdout, "nextGateRequiredChecksParsedField", "help should include next gate required checks parsed alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary", "help should include next gate required checks summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummaryField", "help should include next gate required checks summary alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.count", "help should include next gate required checks summary count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummaryCountField", "help should include next gate required checks summary count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.source", "help should include next gate required checks summary source field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummarySourceField", "help should include next gate required checks summary source alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.parsed", "help should include next gate required checks summary parsed field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummaryParsedField", "help should include next gate required checks summary parsed alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksCompactSummary", "help should include next gate required checks compact summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeSummary", "help should include next gate required checks by type summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeEndpointSummary", "help should include next gate required checks by type endpoint summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeRegistrySummary", "help should include next gate required checks by type registry summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeFieldSummary", "help should include next gate required checks by type field summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeCommandCountSummary", "help should include next gate required checks by type command count summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeCommandEndpointSummary", "help should include next gate required checks by type command endpoint summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeCommandRegistrySummary", "help should include next gate required checks by type command registry summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeCommandRegistryStatusSummary", "help should include next gate required checks by type command registry status summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksByTypeCommandFieldSummary", "help should include next gate required checks by type command field summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeKeys", "help should include next gate required checks type keys field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeKeysField", "help should include next gate required checks type keys alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeKeys.0", "help should include next gate required checks first type key field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeKeys.4", "help should include next gate required checks last type key field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeCount", "help should include next gate required checks type count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeCountField", "help should include next gate required checks type count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeLastIndex", "help should include next gate required checks type last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeLastIndexField", "help should include next gate required checks type last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeFirst", "help should include next gate required checks first type field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeFirstField", "help should include next gate required checks first type alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeLast", "help should include next gate required checks last type field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeLastField", "help should include next gate required checks last type alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeRegistryStatus", "help should include next gate required checks type registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeRegistryStatusField", "help should include next gate required checks type registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeRegistryInvariant", "help should include next gate required checks type registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byTypeRegistryInvariantField", "help should include next gate required checks type registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.count", "help should include next gate required checks summary DB count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.count", "help should include next gate required checks summary guard count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.count", "help should include next gate required checks summary test count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.count", "help should include next gate required checks summary privacy count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.count", "help should include next gate required checks summary errors count field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.countField", "help should include next gate required checks DB count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.countField", "help should include next gate required checks guard count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.countField", "help should include next gate required checks test count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.countField", "help should include next gate required checks privacy count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.countField", "help should include next gate required checks errors count alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandsField", "help should include next gate required checks DB commands alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandsField", "help should include next gate required checks guard commands alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandsField", "help should include next gate required checks test commands alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandsField", "help should include next gate required checks privacy commands alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandsField", "help should include next gate required checks errors commands alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandLastIndex", "help should include next gate required checks DB last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandLastIndex", "help should include next gate required checks guard last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandLastIndex", "help should include next gate required checks test last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandLastIndex", "help should include next gate required checks privacy last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandLastIndex", "help should include next gate required checks errors last index field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandLastIndexField", "help should include next gate required checks DB last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandLastIndexField", "help should include next gate required checks guard last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandLastIndexField", "help should include next gate required checks test last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandLastIndexField", "help should include next gate required checks privacy last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandLastIndexField", "help should include next gate required checks errors last index alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandRegistryStatus", "help should include next gate required checks DB registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatus", "help should include next gate required checks guard registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandRegistryStatus", "help should include next gate required checks test registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatus", "help should include next gate required checks privacy registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatus", "help should include next gate required checks errors registry status field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandRegistryStatusField", "help should include next gate required checks DB registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandRegistryStatusField", "help should include next gate required checks guard registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandRegistryStatusField", "help should include next gate required checks test registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryStatusField", "help should include next gate required checks privacy registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandRegistryStatusField", "help should include next gate required checks errors registry status alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariant", "help should include next gate required checks DB registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariant", "help should include next gate required checks guard registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariant", "help should include next gate required checks test registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariant", "help should include next gate required checks privacy registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariant", "help should include next gate required checks errors registry invariant field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commandRegistryInvariantField", "help should include next gate required checks DB registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commandRegistryInvariantField", "help should include next gate required checks guard registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commandRegistryInvariantField", "help should include next gate required checks test registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commandRegistryInvariantField", "help should include next gate required checks privacy registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commandRegistryInvariantField", "help should include next gate required checks errors registry invariant alias field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commands.0", "help should include next gate required checks first DB command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.db.commands.7", "help should include next gate required checks last DB command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commands.0", "help should include next gate required checks first guard command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.guard.commands.1", "help should include next gate required checks last guard command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.test.commands.0", "help should include next gate required checks test command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.privacy.commands.0", "help should include next gate required checks privacy command field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary.byType.errors.commands.0", "help should include next gate required checks errors command field");
  assertIncludes(help.stdout, "nextGateReadiness", "help should include next gate readiness field");
  assertIncludes(help.stdout, "nextGateReadinessField", "help should include next gate readiness alias field");
  assertIncludes(help.stdout, "nextGateReadiness.verifiedNowCount", "help should include next gate readiness verified count field");
  assertIncludes(help.stdout, "nextGateReadinessVerifiedNowCountField", "help should include next gate readiness verified count alias field");
  assertIncludes(help.stdout, "nextGateReadiness.transitionCount", "help should include next gate readiness transition count field");
  assertIncludes(help.stdout, "nextGateReadinessTransitionCountField", "help should include next gate readiness transition count alias field");
  assertIncludes(help.stdout, "nextGateReadiness.verifiedNowCommands", "help should include next gate readiness verified commands field");
  assertIncludes(help.stdout, "nextGateReadinessVerifiedNowCommandsField", "help should include next gate readiness verified commands alias field");
  assertIncludes(help.stdout, "nextGateReadiness.transitionCommands", "help should include next gate readiness transition commands field");
  assertIncludes(help.stdout, "nextGateReadinessTransitionCommandsField", "help should include next gate readiness transition commands alias field");
  assertIncludes(help.stdout, "nextGateReadinessSummary", "help should include next gate readiness summary field");
  assertIncludes(help.stdout, "nextGateTransitionPlan", "help should include next gate transition plan field");
  assertIncludes(help.stdout, "nextGateTransitionPlanField", "help should include next gate transition plan alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.count", "help should include next gate transition plan count field");
  assertIncludes(help.stdout, "nextGateTransitionPlanCountField", "help should include next gate transition plan count alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.transitions.migrationStatus.nextExpected", "help should include next gate transition plan nested field");
  assertIncludes(help.stdout, "nextGateTransitionPlanMigrationStatusNextExpectedField", "help should include next gate transition plan migration next alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.transitions.databaseUrlStatus.nextExpected", "help should include next gate transition plan database URL status next field");
  assertIncludes(help.stdout, "nextGateTransitionPlanDatabaseUrlStatusNextExpectedField", "help should include next gate transition plan database URL status next alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.transitions.databaseUrlProtocol.nextExpected", "help should include next gate transition plan database URL protocol next field");
  assertIncludes(help.stdout, "nextGateTransitionPlanDatabaseUrlProtocolNextExpectedField", "help should include next gate transition plan database URL protocol next alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.orderedSteps", "help should include next gate transition plan ordered steps field");
  assertIncludes(help.stdout, "nextGateTransitionPlanOrderedStepsField", "help should include next gate transition plan ordered steps alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlan.orderedSteps.0.id", "help should include next gate transition plan ordered step nested field");
  assertIncludes(help.stdout, "nextGateTransitionPlanFirstStepIdField", "help should include next gate transition plan first step alias field");
  assertIncludes(help.stdout, "nextGateTransitionPlanStepSummary", "help should include next gate transition plan step summary field");
  assertIncludes(help.stdout, "nextGateTransitionPlanSummary", "help should include next gate transition plan summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff", "help should include next gate CI handoff field");
  assertIncludes(help.stdout, "nextGateCiHandoffField", "help should include next gate CI handoff alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredCheckCount", "help should include next gate CI handoff required check count field");
  assertIncludes(help.stdout, "nextGateCiHandoffRequiredCheckCountFieldAlias", "help should include next gate CI handoff required check count top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFieldCount", "help should include next gate CI handoff watch field count field");
  assertIncludes(help.stdout, "nextGateCiHandoffWatchFieldCountFieldAlias", "help should include next gate CI handoff watch field count top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandCount", "help should include next gate CI handoff command count field");
  assertIncludes(help.stdout, "nextGateCiHandoffCommandCountFieldAlias", "help should include next gate CI handoff command count top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffSummary", "help should include next gate CI handoff summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadyStatus", "help should include next gate CI handoff ready status top field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadyStatusField", "help should include next gate CI handoff ready status top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadySummary", "help should include next gate CI handoff ready summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadySummaryField", "help should include next gate CI handoff ready summary top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadyTopSummary", "help should include next gate CI handoff ready top summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasCount", "help should include next gate CI handoff field alias count");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasCountField", "help should include next gate CI handoff field alias count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasLastIndex", "help should include next gate CI handoff field alias last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasLastIndexField", "help should include next gate CI handoff field alias last index alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasRegistryStatus", "help should include next gate CI handoff field alias registry status");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasRegistryStatusField", "help should include next gate CI handoff field alias registry status alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasRegistryInvariant", "help should include next gate CI handoff field alias registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasRegistryInvariantField", "help should include next gate CI handoff field alias registry invariant alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasFirst", "help should include next gate CI handoff first alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasFirstField", "help should include next gate CI handoff first alias field alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasLast", "help should include next gate CI handoff last alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasLastField", "help should include next gate CI handoff last alias field alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasEndpointsField", "help should include next gate CI handoff field alias endpoints alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasEndpoints.first", "help should include next gate CI handoff field alias endpoints first");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasEndpoints.last", "help should include next gate CI handoff field alias endpoints last");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasSummary", "help should include next gate CI handoff field alias summary");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasSummaryField", "help should include next gate CI handoff field alias summary alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliasesField", "help should include next gate CI handoff field aliases alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliases.0", "help should include next gate CI handoff first field alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.fieldAliases.323", "help should include next gate CI handoff last field alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredCheckCount", "help should include next gate CI handoff required check count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredCheckCountField", "help should include next gate CI handoff required check count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredChecksSource", "help should include next gate CI handoff required checks source field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredChecksSourceField", "help should include next gate CI handoff required checks source alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredChecksParsed", "help should include next gate CI handoff required checks parsed field");
  assertIncludes(help.stdout, "nextGateCiHandoff.requiredChecksParsedField", "help should include next gate CI handoff required checks parsed alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.transitionPlanField", "help should include next gate CI handoff transition plan alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readinessField", "help should include next gate CI handoff readiness alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandCount", "help should include next gate CI handoff command count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandCountField", "help should include next gate CI handoff command count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandLastIndex", "help should include next gate CI handoff command last index field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandLastIndexField", "help should include next gate CI handoff command last index alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandRegistryStatus", "help should include next gate CI handoff command registry status field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandRegistryStatusField", "help should include next gate CI handoff command registry status alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandRegistryInvariant", "help should include next gate CI handoff command registry invariant field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandRegistryInvariantField", "help should include next gate CI handoff command registry invariant alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commandsField", "help should include next gate CI handoff commands alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.0", "help should include next gate CI handoff first command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.1", "help should include next gate CI handoff second command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.2", "help should include next gate CI handoff third command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.3", "help should include next gate CI handoff fourth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.4", "help should include next gate CI handoff fifth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.5", "help should include next gate CI handoff sixth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.6", "help should include next gate CI handoff seventh command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.7", "help should include next gate CI handoff eighth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.8", "help should include next gate CI handoff ninth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.9", "help should include next gate CI handoff tenth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.10", "help should include next gate CI handoff eleventh command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.commands.11", "help should include next gate CI handoff twelfth command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFieldsField", "help should include next gate CI handoff watch fields alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFields.0", "help should include next gate CI handoff watch field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFields.1", "help should include next gate CI handoff second watch field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFields.2", "help should include next gate CI handoff third watch field");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFieldCount", "help should include next gate CI handoff watch field count");
  assertIncludes(help.stdout, "nextGateCiHandoff.watchFieldCountField", "help should include next gate CI handoff watch field count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteriaField", "help should include next gate CI handoff pass criteria alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteriaCount", "help should include next gate CI handoff pass criteria count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteriaCountField", "help should include next gate CI handoff pass criteria count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteria.migrationStatus", "help should include next gate CI handoff pass criteria field");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteria.databaseUrlStatus", "help should include next gate CI handoff database URL status pass criteria field");
  assertIncludes(help.stdout, "nextGateCiHandoff.passCriteria.databaseUrlProtocol", "help should include next gate CI handoff database URL protocol pass criteria field");
  assertIncludes(help.stdout, "nextGateCiHandoffPassCriteriaSummary", "help should include next gate CI handoff pass criteria summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffFailureCodeSummary", "help should include next gate CI handoff failure code summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffEvidenceDocSummary", "help should include next gate CI handoff evidence doc summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffWatchFieldSummary", "help should include next gate CI handoff watch field summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffRequiredChecksSummary", "help should include next gate CI handoff required checks summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffReadinessTransitionSummary", "help should include next gate CI handoff readiness transition summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffTransitionExpectedSummary", "help should include next gate CI handoff transition expected summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffTransitionCommandSummary", "help should include next gate CI handoff transition command summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffTransitionTargetSummary", "help should include next gate CI handoff transition target summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodesField", "help should include next gate CI handoff failure codes alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodes.migrationGuard", "help should include next gate CI handoff failure code field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodes.dbMatrixUnknownField", "help should include next gate CI handoff DB matrix unknown field code field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodes.statusFieldMissing", "help should include next gate CI handoff status field missing code field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodeCount", "help should include next gate CI handoff failure code count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.failureCodeCountField", "help should include next gate CI handoff failure code count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocsField", "help should include next gate CI handoff evidence docs alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocs.nextGate", "help should include next gate CI handoff next gate evidence doc field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocs.dbConstraints", "help should include next gate CI handoff evidence doc field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocs.status", "help should include next gate CI handoff status evidence doc field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocCount", "help should include next gate CI handoff evidence doc count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.evidenceDocCountField", "help should include next gate CI handoff evidence doc count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertionCount", "help should include next gate CI handoff assertion count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertionCountField", "help should include next gate CI handoff assertion count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertionsField", "help should include next gate CI handoff assertions alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.migrationStatus.expected", "help should include next gate CI handoff assertion field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.migrationStatus.command", "help should include next gate CI handoff migration assertion command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.databaseUrlStatus.expected", "help should include next gate CI handoff database URL status assertion field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.databaseUrlStatus.command", "help should include next gate CI handoff database URL status assertion command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.databaseUrlProtocol.expected", "help should include next gate CI handoff database URL protocol assertion field");
  assertIncludes(help.stdout, "nextGateCiHandoff.assertions.databaseUrlProtocol.command", "help should include next gate CI handoff database URL protocol assertion command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.status", "help should include next gate CI handoff ready status field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.summary", "help should include next gate CI handoff ready summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFields.0", "help should include next gate CI handoff ready required field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFields.1", "help should include next gate CI handoff ready second required field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFields.2", "help should include next gate CI handoff ready third required field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldCount", "help should include next gate CI handoff ready required field count");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldCountField", "help should include next gate CI handoff ready required field count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldLastIndex", "help should include next gate CI handoff ready required field last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldLastIndexField", "help should include next gate CI handoff ready required field last index alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatus", "help should include next gate CI handoff ready required field registry status");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldRegistryStatusField", "help should include next gate CI handoff ready required field registry status alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariant", "help should include next gate CI handoff ready required field registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldRegistryInvariantField", "help should include next gate CI handoff ready required field registry invariant alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.assertionCount", "help should include next gate CI handoff ready assertion count");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.assertionCountField", "help should include next gate CI handoff ready assertion count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.statusField", "help should include next gate CI handoff ready status alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.summaryField", "help should include next gate CI handoff ready summary alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.requiredFieldsField", "help should include next gate CI handoff ready required fields alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandsField", "help should include next gate CI handoff ready commands alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldsField", "help should include next gate CI handoff ready report fields alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldCount", "help should include next gate CI handoff ready report field count");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldCountField", "help should include next gate CI handoff ready report field count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldLastIndex", "help should include next gate CI handoff ready report field last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldLastIndexField", "help should include next gate CI handoff ready report field last index alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldRegistryStatus", "help should include next gate CI handoff ready report field registry status");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldRegistryStatusField", "help should include next gate CI handoff ready report field registry status alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariant", "help should include next gate CI handoff ready report field registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldRegistryInvariantField", "help should include next gate CI handoff ready report field registry invariant alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldFirst", "help should include next gate CI handoff ready report field first");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldFirstField", "help should include next gate CI handoff ready report field first alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldLast", "help should include next gate CI handoff ready report field last");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldLastField", "help should include next gate CI handoff ready report field last alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldEndpointsField", "help should include next gate CI handoff ready report field endpoints alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldEndpoints.first", "help should include next gate CI handoff ready report field endpoints first");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldEndpoints.last", "help should include next gate CI handoff ready report field endpoints last");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldSummary", "help should include next gate CI handoff ready report field summary");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFieldSummaryField", "help should include next gate CI handoff ready report field summary alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues", "help should include next gate CI handoff ready report values");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValuesField", "help should include next gate CI handoff ready report values alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueCount", "help should include next gate CI handoff ready report value count");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueCountField", "help should include next gate CI handoff ready report value count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueKeys", "help should include next gate CI handoff ready report value keys");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueKeysField", "help should include next gate CI handoff ready report value keys alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueKeys.0", "help should include next gate CI handoff ready report first value key");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueKeys.24", "help should include next gate CI handoff ready report last value key");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueLastIndex", "help should include next gate CI handoff ready report value last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueFirst", "help should include next gate CI handoff ready report value first");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueLast", "help should include next gate CI handoff ready report value last");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueEndpointsField", "help should include next gate CI handoff ready report value endpoints alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueEndpoints.first", "help should include next gate CI handoff ready report value endpoint first");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueEndpoints.last", "help should include next gate CI handoff ready report value endpoint last");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueEndpointSummary", "help should include next gate CI handoff ready report value endpoint summary");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueEndpointSummaryField", "help should include next gate CI handoff ready report value endpoint summary alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueRegistryInvariant", "help should include next gate CI handoff ready report value registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueSummary", "help should include next gate CI handoff ready report value summary");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValueSummaryField", "help should include next gate CI handoff ready report value summary alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.prismaScaffoldStatusSummary", "help should include next gate CI handoff Prisma scaffold status report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.productionGateOrderDetailsSummary", "help should include next gate CI handoff production gate report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.productionBlockerCount", "help should include next gate CI handoff production blocker count report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.progressPercent", "help should include next gate CI handoff progress percent report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.rollbackCommandEndpointSummary", "help should include next gate CI handoff rollback command endpoint summary report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.progressBasisSummary", "help should include next gate CI handoff progress basis summary report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportValues.remainingBlockersSummary", "help should include next gate CI handoff remaining blockers summary report value");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandCount", "help should include next gate CI handoff ready command count");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandCountField", "help should include next gate CI handoff ready command count alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandLastIndex", "help should include next gate CI handoff ready command last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandLastIndexField", "help should include next gate CI handoff ready command last index alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandRegistryStatus", "help should include next gate CI handoff ready command registry status");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandRegistryStatusField", "help should include next gate CI handoff ready command registry status alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandRegistryInvariant", "help should include next gate CI handoff ready command registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commandRegistryInvariantField", "help should include next gate CI handoff ready command registry invariant alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commands.0", "help should include next gate CI handoff ready first command");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commands.1", "help should include next gate CI handoff ready second command");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.commands.2", "help should include next gate CI handoff ready third command");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.0", "help should include next gate CI handoff ready report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.1", "help should include next gate CI handoff ready summary report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.2", "help should include next gate CI handoff ready required fields report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.3", "help should include next gate CI handoff rollback report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.4", "help should include next gate CI handoff rollback verification report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.5", "help should include next gate CI handoff rollback command report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.6", "help should include next gate CI handoff rollback expected mode report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.7", "help should include next gate CI handoff rollback summary report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.8", "help should include next gate CI handoff rollback summary alias report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.9", "help should include next gate CI handoff rollback mode alias report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.10", "help should include next gate CI handoff rollback expected mode alias report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.11", "help should include next gate CI handoff required checks source report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.12", "help should include next gate CI handoff required checks parsed report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.13", "help should include next gate CI handoff failure code count report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.14", "help should include next gate CI handoff evidence doc count report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.15", "help should include next gate CI handoff required check count report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.16", "help should include next gate CI handoff Prisma scaffold status report field");
  assertIncludes(help.stdout, "nextGateCiHandoff.readyWhen.reportFields.21", "help should include next gate CI handoff remaining blockers report field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackMode", "help should include next gate CI handoff rollback mode top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackModeField", "help should include next gate CI handoff rollback mode top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackModeSummary", "help should include next gate CI handoff rollback mode summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackSummary", "help should include next gate CI handoff rollback summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackSummaryField", "help should include next gate CI handoff rollback summary top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandSequenceSummary", "help should include next gate CI handoff rollback command sequence summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackVerificationReportSummary", "help should include next gate CI handoff rollback verification report summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandCountSummary", "help should include next gate CI handoff rollback command count summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandFieldSummary", "help should include next gate CI handoff rollback command field summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackEndpointFieldSummary", "help should include next gate CI handoff rollback endpoint field summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackRegistryFieldSummary", "help should include next gate CI handoff rollback registry field summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandEndpointSummary", "help should include next gate CI handoff rollback endpoint summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandEndpointSummaryField", "help should include next gate CI handoff rollback endpoint summary top alias field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackCommandRegistrySummary", "help should include next gate CI handoff rollback command registry summary top field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackTopSummary", "help should include next gate CI handoff rollback top summary field");
  assertIncludes(help.stdout, "nextGateCiHandoffRollbackTopFieldSummary", "help should include next gate CI handoff rollback top field summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.mode", "help should include next gate CI handoff rollback mode field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.modeField", "help should include next gate CI handoff rollback mode alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.expectedMode", "help should include next gate CI handoff rollback expected mode field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.expectedModeField", "help should include next gate CI handoff rollback expected mode alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.summary", "help should include next gate CI handoff rollback summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.summaryField", "help should include next gate CI handoff rollback summary alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.command", "help should include next gate CI handoff rollback command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandField", "help should include next gate CI handoff rollback command alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandsField", "help should include next gate CI handoff rollback commands alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.verificationCommand", "help should include next gate CI handoff rollback verification field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.verificationCommandField", "help should include next gate CI handoff rollback verification alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.reportCommand", "help should include next gate CI handoff rollback report command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.reportCommandField", "help should include next gate CI handoff rollback report command alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandCount", "help should include next gate CI handoff rollback command count field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandCountField", "help should include next gate CI handoff rollback command count alias field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandFirst", "help should include next gate CI handoff rollback command first field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandFirstField", "help should include next gate CI handoff rollback command first alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandLast", "help should include next gate CI handoff rollback command last field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandLastField", "help should include next gate CI handoff rollback command last alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandEndpoints", "help should include next gate CI handoff rollback command endpoints field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandEndpointsField", "help should include next gate CI handoff rollback command endpoints alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandEndpointSummary", "help should include next gate CI handoff rollback command endpoint summary field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandEndpointSummaryField", "help should include next gate CI handoff rollback command endpoint summary alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandLastIndex", "help should include next gate CI handoff rollback command last index");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandLastIndexField", "help should include next gate CI handoff rollback command last index alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandRegistryStatus", "help should include next gate CI handoff rollback command registry status");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandRegistryStatusField", "help should include next gate CI handoff rollback command registry status alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandRegistryInvariant", "help should include next gate CI handoff rollback command registry invariant");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commandRegistryInvariantField", "help should include next gate CI handoff rollback command registry invariant alias");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commands.0", "help should include next gate CI handoff rollback first command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commands.1", "help should include next gate CI handoff rollback second command field");
  assertIncludes(help.stdout, "nextGateCiHandoff.rollback.commands.2", "help should include next gate CI handoff rollback third command field");
  assertIncludes(help.stdout, "nextGateRequiredChecks", "help should include next gate required checks field");
  assertIncludes(help.stdout, "nextGateCommand returns the command that prints nextGateDocPath.", "help should explain next gate command");
  assertIncludes(help.stdout, "nextGateCheckCommand returns the first Gate 1 handoff check.", "help should explain next gate check command");
  assertIncludes(help.stdout, "nextGateCheckJsonCommand returns the machine-readable Gate 1 DB matrix check.", "help should explain next gate check JSON command");
  assertIncludes(help.stdout, "nextGateMigrationStatusCommand returns the Gate 1 migration status field.", "help should explain next gate migration status command");
  assertIncludes(help.stdout, "nextGateMigrationStatus returns the Gate 1 migration status handoff object.", "help should explain next gate migration status object");
  assertIncludes(help.stdout, "nextGateDatabaseUrlStatusCommand returns the Gate 1 DATABASE_URL status field.", "help should explain next gate database URL status command");
  assertIncludes(help.stdout, "nextGateDatabaseUrlProtocolCommand returns the Gate 1 DATABASE_URL protocol field.", "help should explain next gate database URL protocol command");
  assertIncludes(help.stdout, "nextGateDatabaseUrlValidationCommand returns a PowerShell placeholder command that never stores the real DATABASE_URL in docs.", "help should explain next gate database URL validation command");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedStatus returns the passing DATABASE_URL status.", "help should explain next gate database URL expected status");
  assertIncludes(help.stdout, "nextGateDatabaseUrlExpectedProtocols returns the accepted PostgreSQL URL protocols.", "help should explain next gate database URL expected protocols");
  assertIncludes(help.stdout, "nextGateDatabaseUrl returns the full DATABASE_URL handoff object without the real URL.", "help should explain next gate database URL object");
  assertIncludes(help.stdout, "nextGatePrismaScaffold returns the Gate 1 Prisma schema and migrations handoff object.", "help should explain next gate Prisma scaffold object");
  assertIncludes(help.stdout, "nextGateMigrationGuardCommand returns the fail-closed migration guard test.", "help should explain next gate migration guard command");
  assertIncludes(help.stdout, "nextGateMigrationGuardMigrationCommand returns the migration command that must fail closed in Gate 0.", "help should explain next gate migration guard migration command");
  assertIncludes(help.stdout, "nextGateMigrationGuardHelperCommand returns the helper command documenting the guard output.", "help should explain next gate migration guard helper command");
  assertIncludes(help.stdout, "nextGateMigrationGuardErrorCode returns the stable fail-closed migration error code.", "help should explain next gate migration guard error code");
  assertIncludes(help.stdout, "nextGateMigrationGuard returns the full fail-closed migration guard object.", "help should explain next gate migration guard object");
  assertIncludes(help.stdout, "nextGateDbMatrix returns the full Gate 1 DB matrix handoff object.", "help should explain next gate DB matrix object");
  assertIncludes(help.stdout, "nextGateDbMatrix.prismaScaffoldStatus", "help should include next gate DB matrix Prisma scaffold status field");
  assertIncludes(help.stdout, "nextGateDbMatrix.prismaScaffoldStatus.summary", "help should include next gate DB matrix Prisma scaffold status summary field");
  assertIncludes(help.stdout, "nextGateRequiredChecksSource points to the parsed Required Checks block.", "help should explain next gate checks source");
  assertIncludes(help.stdout, "nextGateRequiredChecksParsed is true when the checks came from the Gate 1 doc.", "help should explain next gate checks parse status");
  assertIncludes(help.stdout, "nextGateRequiredChecksSummary returns the parsed Gate 1 check count, source, type groups, and commands.", "help should explain next gate required checks summary");
  assertIncludes(help.stdout, "nextGateReadiness separates Gate 0 verified checks from Gate 1 transition checks.", "help should explain next gate readiness");
  assertIncludes(help.stdout, "nextGateTransitionPlan maps transition checks to their current and Gate 1 expected values plus ordered steps.", "help should explain next gate transition plan");
  assertIncludes(help.stdout, "nextGateCiHandoff returns CI-friendly required checks source, parsed status, watch fields, commands, pass criteria, assertions, ready status, ready summary, required fields, report fields, rollback guidance, failure codes, evidence docs, and handoff counts.", "help should explain next gate CI handoff");
  assertIncludes(help.stdout, "nextGateRequiredChecks is parsed from GATE1_PERSISTENCE.md.", "help should explain next gate required checks");

  const unknownOption = await runStatus(["--wat"]);
  assertExit(unknownOption, 1, "unknown options should fail");
  assertIncludes(unknownOption.stderr, "TM_GATE0_STATUS_UNKNOWN_OPTION", "unknown options should print stable code");

  const conflictingOutput = await runStatus(["--json", "--field", "currentStatus"]);
  assertExit(conflictingOutput, 1, "--json and --field should conflict");
  assertIncludes(conflictingOutput.stderr, "TM_GATE0_STATUS_OPTION_CONFLICT", "conflicting output should print stable code");

  console.log("Gate 0 status command OK");
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

function runStatus(args = []) {
  return new Promise((resolve) => {
    execFile(process.execPath, [statusScriptPath, ...args], {
      cwd: tempRoot,
      maxBuffer: 16 * 1024 * 1024
    }, (error, stdout, stderr) => {
      resolve({
        status: typeof error?.code === "number" ? error.code : error ? 1 : 0,
        stdout,
        stderr: error?.code && typeof error.code !== "number"
          ? `${stderr}${stderr ? "\n" : ""}${error.code}`
          : stderr
      });
    });
  });
}

function assertExit(result, expected, message) {
  if (result.status !== expected) {
    fail(`${message}\nExpected exit ${expected}, got ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
}

function assertIncludes(text, expected, message) {
  if (!text.includes(expected)) {
    fail(`${message}\nMissing: ${expected}\nActual:\n${text}`);
  }
}

function assertArrayIncludes(values, expected, message) {
  if (!Array.isArray(values) || !values.includes(expected)) {
    fail(`${message}\nMissing: ${expected}\nActual:\n${JSON.stringify(values)}`);
  }
}

function assertObject(value, message) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail(`${message}\nActual:\n${JSON.stringify(value)}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function fail(message) {
  console.error(`TM_GATE0_STATUS_TEST_FAILED\n${message}`);
  process.exit(1);
}
