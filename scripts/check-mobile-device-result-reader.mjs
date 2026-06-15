import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const readerPath = path.join(root, "scripts", "read-mobile-device-smoke-result.mjs");
const tempRoot = await mkdtemp(path.join(os.tmpdir(), "thai-meet-device-result-"));

try {
  const helpWithUnknownOption = await runReader(["--help", "--definitely-unknown"]);
  assertExit(helpWithUnknownOption, 1, "--help with an unknown option should fail before printing usage");
  assertIncludes(helpWithUnknownOption.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION", "--help with an unknown option should print the unknown-option code");

  const shortUnknownOption = await runReader(["-h"]);
  assertExit(shortUnknownOption, 1, "short unknown options without a result file should fail");
  assertIncludes(shortUnknownOption.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION", "short unknown options should print the unknown-option code");

  const helpWithDuplicatePath = await runReader(["--help", "--path", "apk", "--path", "screenshot"]);
  assertExit(helpWithDuplicatePath, 1, "--help with duplicate output options should fail before printing usage");
  assertIncludes(helpWithDuplicatePath.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "--help with duplicate output options should print the option-conflict code");

  const unexpectedArgumentWithoutResult = await runReader(["status"]);
  assertExit(unexpectedArgumentWithoutResult, 1, "unexpected positional arguments without a result file should fail");
  assertIncludes(unexpectedArgumentWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_UNEXPECTED_ARGUMENT", "unexpected positional arguments should validate before reading latest.json");

  const unexpectedPathTargetWithoutResult = await runReader(["apk"]);
  assertExit(unexpectedPathTargetWithoutResult, 1, "unexpected path target arguments without a result file should fail");
  assertIncludes(unexpectedPathTargetWithoutResult.stderr, "Use --path apk", "unexpected artifact path targets should suggest --path");

  const extraArgumentAfterFieldWithoutResult = await runReader(["--field", "status", "extra"]);
  assertExit(extraArgumentAfterFieldWithoutResult, 1, "extra arguments after an option value without a result file should fail");
  assertIncludes(extraArgumentAfterFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_UNEXPECTED_ARGUMENT", "extra arguments after option values should validate before reading latest.json");

  const missingFieldWithoutResult = await runReader(["--field"]);
  assertExit(missingFieldWithoutResult, 1, "--field without a result file should fail as a missing field name");
  assertIncludes(missingFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED", "--field without a result file should validate arguments before reading latest.json");

  const shortOptionAfterFieldWithoutResult = await runReader(["--field", "-h"]);
  assertExit(shortOptionAfterFieldWithoutResult, 1, "--field followed by a short option should fail as a missing field name");
  assertIncludes(shortOptionAfterFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED", "--field followed by a short option should validate before reading latest.json");

  const shortOptionEqualsFieldWithoutResult = await runReader(["--field=-h"]);
  assertExit(shortOptionEqualsFieldWithoutResult, 1, "--field=-h should fail as a missing field name");
  assertIncludes(shortOptionEqualsFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED", "--field=-h should validate before reading latest.json");

  const missingSummaryFieldWithoutResult = await runReader(["--summary-field"]);
  assertExit(missingSummaryFieldWithoutResult, 1, "--summary-field without a result file should fail as a missing field name");
  assertIncludes(missingSummaryFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_REQUIRED", "--summary-field without a result file should validate arguments before reading latest.json");

  const missingPathsFieldWithoutResult = await runReader(["--paths-field"]);
  assertExit(missingPathsFieldWithoutResult, 1, "--paths-field without a result file should fail as a missing field name");
  assertIncludes(missingPathsFieldWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_REQUIRED", "--paths-field without a result file should validate arguments before reading latest.json");

  const conflictWithoutResult = await runReader(["--json", "--field", "status"]);
  assertExit(conflictWithoutResult, 1, "conflicting output options without a result file should fail");
  assertIncludes(conflictWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "option conflict should validate before reading latest.json");

  const duplicatePathWithoutResult = await runReader(["--path", "apk", "--path", "screenshot"]);
  assertExit(duplicatePathWithoutResult, 1, "duplicate output options without a result file should fail");
  assertIncludes(duplicatePathWithoutResult.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "duplicate output options should validate before reading latest.json");

  await writeInvalidResultFixture();
  const invalidJson = await runReader([]);
  assertExit(invalidJson, 1, "invalid latest.json should fail");
  assertIncludes(invalidJson.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_JSON", "invalid latest.json should print a stable code");

  await writeInvalidSchemaFixture();
  const invalidSchema = await runReader([]);
  assertExit(invalidSchema, 1, "latest.json without required result fields should fail");
  assertIncludes(invalidSchema.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA", "invalid latest.json schema should print a stable code");

  await writeInvalidStatusFixture();
  const invalidStatus = await runReader([]);
  assertExit(invalidStatus, 1, "latest.json with an unsupported status should fail");
  assertIncludes(invalidStatus.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA", "unsupported status should print a stable code");

  await writeMissingRunIdFixture();
  const missingRunId = await runReader([]);
  assertExit(missingRunId, 1, "latest.json without runId should fail");
  assertIncludes(missingRunId.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA", "missing runId should print a stable code");

  await writeFixture({
    currentRunResultPath: ".thai-meet/device-smoke/runs/fixture.json",
    currentRunScreenshotPath: ".thai-meet/device-smoke/runs/fixture.png"
  });

  const summary = await runReader([]);
  assertExit(summary, 0, "summary should pass");
  assertIncludes(summary.stdout, "Latest Android device smoke: passed", "summary should include status");
  assertIncludes(summary.stdout, "Run: fixture-run, wait 7.0s from default, device auto, authorized 1", "summary should include run configuration");
  assertIncludes(summary.stdout, "Device: TEST_DEVICE", "summary should include device");
  assertIncludes(summary.stdout, "Device: TEST_DEVICE (OPPO CPH2695, Android 16 (API 36), 720x1604 @ 320 dpi)", "summary should include device model and screen details");
  assertIncludes(summary.stdout, "App: com.example.thai_meet_mobile/com.example.thai_meet_mobile.MainActivity, version 0.0.0 (1)", "summary should include foreground app and version");
  assertIncludes(summary.stdout, "Duration: 42.5s", "summary should include run duration");
  assertIncludes(summary.stdout, "Timings: build 3.8s, install 2.1s, package 0.3s, launch 0.7s, screenshot 0.3s", "summary should include stage timings");
  assertIncludes(summary.stdout, "Capture: 720x1604, 0.1 MiB, diversity 41, sha256 abc123screenshot", "summary should include screenshot capture quality");
  assertIncludes(summary.stdout, "Host: win32/x64, Node v24.12.0, Flutter 3.44.1 stable, Dart 3.12.1, ADB Android Debug Bridge version 1.0.41", "summary should include host and toolchain details");
  assertIncludes(summary.stdout, "Build: APK 152.7 MiB, built 2026-06-06T01:00:05.000Z, sha256 abc123apk", "summary should include APK build provenance");
  assertIncludes(summary.stdout, "APK: apps/mobile/build/app/outputs/flutter-apk/app-debug.apk", "summary should include APK path");
  assertIncludes(summary.stdout, `Latest Result: ${path.join(".thai-meet", "device-smoke", "latest.json")}`, "summary should include latest result path");
  assertIncludes(summary.stdout, `Latest Screenshot: ${path.join(".thai-meet", "device-smoke", "latest.png")}`, "summary should include latest screenshot path");

  const json = await runReader(["--json"]);
  assertExit(json, 0, "--json should pass");
  assertEqual(JSON.parse(json.stdout).status, "passed", "--json should print parseable result");

  const help = await runReader(["--help"]);
  assertExit(help, 0, "--help should pass");
  assertIncludes(help.stdout, "--summary-field", "--help should mention summary field output");
  assertIncludes(help.stdout, "--require-existing  Fail unless the --summary-json, --summary-field, --path, --paths, or --paths-field artifacts exist on disk.", "--help should mention summary-field require-existing support");

  const summaryJson = await runReader(["--summary-json"]);
  assertExit(summaryJson, 0, "--summary-json should pass");
  const parsedSummaryJson = JSON.parse(summaryJson.stdout);
  assertEqual(parsedSummaryJson.schemaVersion, 1, "--summary-json should include schema version");
  assertEqual(parsedSummaryJson.command, "npm run mobile:device:smoke", "--summary-json should include smoke command");
  assertEqual(parsedSummaryJson.status, "passed", "--summary-json should include status");
  assertEqual(parsedSummaryJson.runId, "fixture-run", "--summary-json should include runId");
  assertEqual(parsedSummaryJson.startedAt, "2026-06-06T01:00:00.000Z", "--summary-json should include start time");
  assertEqual(parsedSummaryJson.completedAt, "2026-06-06T01:00:42.500Z", "--summary-json should include completion time");
  assertEqual(parsedSummaryJson.durationMs, 42500, "--summary-json should include duration");
  assertEqual(parsedSummaryJson.deviceSerial, "TEST_DEVICE", "--summary-json should include device serial");
  assertEqual(parsedSummaryJson.deviceManufacturer, "OPPO", "--summary-json should include device manufacturer");
  assertEqual(parsedSummaryJson.deviceBrand, "OPPO", "--summary-json should include device brand");
  assertEqual(parsedSummaryJson.deviceModel, "CPH2695", "--summary-json should include device model");
  assertEqual(parsedSummaryJson.androidRelease, "16", "--summary-json should include Android release");
  assertEqual(parsedSummaryJson.androidSdk, "36", "--summary-json should include Android SDK");
  assertEqual(parsedSummaryJson.screenPhysicalSize, "Physical size: 720x1604", "--summary-json should include physical screen size");
  assertEqual(parsedSummaryJson.screenDensityDpi, "320", "--summary-json should include screen density");
  assertEqual(parsedSummaryJson.deviceSelectionMode, "auto", "--summary-json should include device selection mode");
  assertEqual(parsedSummaryJson.requestedDeviceSerial, null, "--summary-json should include requested device serial");
  assertEqual(parsedSummaryJson.authorizedDeviceCount, 1, "--summary-json should include authorized device count");
  assertEqual(parsedSummaryJson.deviceProbeDurationMs, 900, "--summary-json should include device probe duration");
  assertEqual(parsedSummaryJson.packageName, "com.example.thai_meet_mobile", "--summary-json should include target package name");
  assertEqual(parsedSummaryJson.foregroundPackage, "com.example.thai_meet_mobile", "--summary-json should include foreground package");
  assertEqual(parsedSummaryJson.foregroundActivity, "com.example.thai_meet_mobile.MainActivity", "--summary-json should include foreground activity");
  assertEqual(parsedSummaryJson.installedVersionName, "0.0.0", "--summary-json should include installed version name");
  assertEqual(parsedSummaryJson.installedVersionCode, "1", "--summary-json should include installed version code");
  assertEqual(parsedSummaryJson.flutterVersion, "3.44.1", "--summary-json should include Flutter version");
  assertEqual(parsedSummaryJson.flutterChannel, "stable", "--summary-json should include Flutter channel");
  assertEqual(parsedSummaryJson.dartVersion, "3.12.1", "--summary-json should include Dart version");
  assertEqual(parsedSummaryJson.hostPlatform, "win32", "--summary-json should include host platform");
  assertEqual(parsedSummaryJson.hostArch, "x64", "--summary-json should include host architecture");
  assertEqual(parsedSummaryJson.nodeVersion, "v24.12.0", "--summary-json should include Node version");
  assertEqual(parsedSummaryJson.flutterCommand, "flutter.bat", "--summary-json should include Flutter command");
  assertEqual(parsedSummaryJson.adbCommand, "adb.exe", "--summary-json should include ADB command");
  assertEqual(parsedSummaryJson.adbVersion, "Android Debug Bridge version 1.0.41", "--summary-json should include ADB version");
  assertEqual(parsedSummaryJson.toolchainProbeDurationMs, 1200, "--summary-json should include toolchain probe duration");
  assertEqual(parsedSummaryJson.renderWaitMs, 7000, "--summary-json should include render wait");
  assertEqual(parsedSummaryJson.renderWaitSource, "default", "--summary-json should include render wait source");
  assertEqual(parsedSummaryJson.buildDurationMs, 3800, "--summary-json should include build duration");
  assertEqual(parsedSummaryJson.installDurationMs, 2100, "--summary-json should include install duration");
  assertEqual(parsedSummaryJson.packageInfoDurationMs, 250, "--summary-json should include package info duration");
  assertEqual(parsedSummaryJson.launchDurationMs, 650, "--summary-json should include launch duration");
  assertEqual(parsedSummaryJson.screenshotDurationMs, 350, "--summary-json should include screenshot capture duration");
  assertEqual(parsedSummaryJson.apkBuiltAt, "2026-06-06T01:00:05.000Z", "--summary-json should include APK built time");
  assertEqual(parsedSummaryJson.apkSizeBytes, 160117145, "--summary-json should include APK size");
  assertEqual(parsedSummaryJson.apkSha256, "abc123apk", "--summary-json should include APK sha256");
  assertEqual(parsedSummaryJson.apkPath, "apps/mobile/build/app/outputs/flutter-apk/app-debug.apk", "--summary-json should include apk path");
  assertEqual(parsedSummaryJson.latestPath, path.join(".thai-meet", "device-smoke", "latest.json"), "--summary-json should include latest result path");
  assertEqual(parsedSummaryJson.latestScreenshotPath, path.join(".thai-meet", "device-smoke", "latest.png"), "--summary-json should include latest screenshot path");
  assertEqual(parsedSummaryJson.resultStatus, "archived", "--summary-json should include result archive status");
  assertEqual(parsedSummaryJson.currentRunResultStatus, "archived", "--summary-json should include current-run result archive status");
  assertEqual(parsedSummaryJson.runResultArchived, true, "--summary-json should include run result archive flag");
  assertEqual(parsedSummaryJson.runResultPath, ".thai-meet/device-smoke/runs/fixture.json", "--summary-json should include per-run result archive path");
  assertEqual(parsedSummaryJson.currentRunResultPath, ".thai-meet/device-smoke/runs/fixture.json", "--summary-json should include current-run result archive path");
  assertEqual(parsedSummaryJson.screenshotStatus, "captured-and-archived", "--summary-json should include screenshot archive status");
  assertEqual(parsedSummaryJson.currentRunScreenshotStatus, "captured-and-archived", "--summary-json should include current-run screenshot archive status");
  assertEqual(parsedSummaryJson.runScreenshotPath, ".thai-meet/device-smoke/runs/fixture.png", "--summary-json should include per-run screenshot archive path");
  assertEqual(parsedSummaryJson.currentRunScreenshotPath, ".thai-meet/device-smoke/runs/fixture.png", "--summary-json should include current-run screenshot archive path");
  assertEqual(parsedSummaryJson.screenshotWidth, 720, "--summary-json should include screenshot width");
  assertEqual(parsedSummaryJson.screenshotHeight, 1604, "--summary-json should include screenshot height");
  assertEqual(parsedSummaryJson.screenshotSizeBytes, 123456, "--summary-json should include screenshot size");
  assertEqual(parsedSummaryJson.screenshotDiverseSamples, 41, "--summary-json should include screenshot diversity");
  assertEqual(parsedSummaryJson.screenshotSha256, "abc123screenshot", "--summary-json should include screenshot sha256");
  assertEqual(parsedSummaryJson.screenshotCapturedAt, "2026-06-06T01:00:41.000Z", "--summary-json should include screenshot capture time");
  assertEqual(parsedSummaryJson.screenshotCapturedForRun, true, "--summary-json should include current-run screenshot capture flag");
  assertEqual(parsedSummaryJson.runScreenshotArchived, true, "--summary-json should include run screenshot archive flag");
  assertEqual(parsedSummaryJson.latestScreenshotMayBeStale, false, "--summary-json should include stale screenshot flag");
  assertEqual(parsedSummaryJson.failedStage, null, "--summary-json should include failed stage");
  assertEqual(parsedSummaryJson.error, null, "--summary-json should include raw error field");
  assertEqual(parsedSummaryJson.errorCode, null, "--summary-json should include error code");
  assertEqual(parsedSummaryJson.errorDetail, null, "--summary-json should include error detail");
  assertEqual(parsedSummaryJson.recoveryHintCode, null, "--summary-json should include recovery hint code");
  assertEqual(parsedSummaryJson.recoveryHint, null, "--summary-json should include recovery hint");

  const summaryKeys = await runReader(["--summary-keys"]);
  assertExit(summaryKeys, 0, "--summary-keys should pass");
  const parsedSummaryKeys = JSON.parse(summaryKeys.stdout);
  assertEqual(Array.isArray(parsedSummaryKeys), true, "--summary-keys should print a JSON array");
  assertEqual(parsedSummaryKeys.join(","), Object.keys(parsedSummaryJson).join(","), "--summary-keys should match summary JSON key order");
  assertIncludes(parsedSummaryKeys, "status", "--summary-keys should include status");
  assertIncludes(parsedSummaryKeys, "runId", "--summary-keys should include runId");
  assertIncludes(parsedSummaryKeys, "apkPath", "--summary-keys should include apkPath");
  assertIncludes(parsedSummaryKeys, "runScreenshotPath", "--summary-keys should include runScreenshotPath");
  assertIncludes(parsedSummaryKeys, "recoveryHint", "--summary-keys should include recoveryHint");

  const summaryField = await runReader(["--summary-field", "resultPath"]);
  assertExit(summaryField, 0, "--summary-field resultPath should pass");
  assertEqual(summaryField.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.json", "--summary-field should print compact summary aliases");

  const summaryFieldEquals = await runReader(["--summary-field=durationMs"]);
  assertExit(summaryFieldEquals, 0, "--summary-field=name should pass");
  assertEqual(summaryFieldEquals.stdout.trim(), "42500", "--summary-field should print non-string summary values as JSON scalars");

  const summaryFieldNull = await runReader(["--summary-field", "recoveryHint"]);
  assertExit(summaryFieldNull, 0, "--summary-field should pass for null summary values");
  assertEqual(summaryFieldNull.stdout.trim(), "null", "--summary-field should print null summary values as JSON null");

  const absoluteSummaryField = await runReader(["--summary-field", "resultPath", "--absolute"]);
  assertExit(absoluteSummaryField, 0, "--summary-field resultPath --absolute should pass");
  assertEqual(path.isAbsolute(absoluteSummaryField.stdout.trim()), true, "--summary-field --absolute should print absolute artifact aliases");

  const existingSummaryField = await runReader(["--summary-field", "resultPath", "--require-existing"]);
  assertExit(existingSummaryField, 0, "--summary-field resultPath --require-existing should pass when the artifact exists");
  assertEqual(existingSummaryField.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.json", "--summary-field --require-existing should print the summary field value");

  const absoluteSummaryJson = await runReader(["--summary-json", "--absolute"]);
  assertExit(absoluteSummaryJson, 0, "--summary-json --absolute should pass");
  const parsedAbsoluteSummaryJson = JSON.parse(absoluteSummaryJson.stdout);
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.apkPath), true, "--summary-json --absolute should include absolute apk path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.latestPath), true, "--summary-json --absolute should include absolute latest path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.latestScreenshotPath), true, "--summary-json --absolute should include absolute latest screenshot path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.resultPath), true, "--summary-json --absolute should include absolute result path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.runResultPath), true, "--summary-json --absolute should include absolute per-run result path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.currentRunResultPath), true, "--summary-json --absolute should include absolute current-run result path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.screenshotPath), true, "--summary-json --absolute should include absolute screenshot path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.runScreenshotPath), true, "--summary-json --absolute should include absolute per-run screenshot path");
  assertEqual(path.isAbsolute(parsedAbsoluteSummaryJson.currentRunScreenshotPath), true, "--summary-json --absolute should include absolute current-run screenshot path");

  const existingSummaryJson = await runReader(["--summary-json", "--require-existing"]);
  assertExit(existingSummaryJson, 0, "--summary-json --require-existing should pass when summary artifacts exist");

  await writeFailedFixture();
  const failedSummaryJson = await runReader(["--summary-json"]);
  assertExit(failedSummaryJson, 0, "--summary-json should print failed result summaries");
  const parsedFailedSummaryJson = JSON.parse(failedSummaryJson.stdout);
  assertEqual(parsedFailedSummaryJson.status, "failed", "--summary-json should include failed status");
  assertEqual(parsedFailedSummaryJson.failedStage, "screenshot", "--summary-json should include failed stage for failed runs");
  assertEqual(parsedFailedSummaryJson.error, "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT\nlatest screenshot looked blank", "--summary-json should include raw error for failed runs");
  assertEqual(parsedFailedSummaryJson.errorCode, "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT", "--summary-json should include error code for failed runs");
  assertEqual(parsedFailedSummaryJson.errorDetail, "latest screenshot looked blank", "--summary-json should include error detail for failed runs");
  assertEqual(parsedFailedSummaryJson.recoveryHintCode, "WAKE_UNLOCK_DEVICE", "--summary-json should include recovery hint code for failed runs");
  assertEqual(parsedFailedSummaryJson.recoveryHint, "Wake and unlock the phone, then rerun the smoke.", "--summary-json should include recovery hint for failed runs");

  const failedSummary = await runReader([]);
  assertExit(failedSummary, 0, "default summary should print failed result summaries without --strict");
  assertIncludes(failedSummary.stdout, "Latest Android device smoke: failed", "failed summary should include failed status");
  assertIncludes(failedSummary.stdout, "Failure: screenshot, TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT", "failed summary should include failed stage and error code");
  assertIncludes(failedSummary.stdout, "Failure Detail: latest screenshot looked blank", "failed summary should include error detail");

  const failedStrictSummary = await runReader(["--strict"]);
  assertExit(failedStrictSummary, 1, "--strict should fail failed result summaries");
  assertIncludes(failedStrictSummary.stderr, "Failure Stage: screenshot", "--strict failure should include failed stage on stderr");
  assertIncludes(failedStrictSummary.stderr, "Failure Code: TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT", "--strict failure should include error code on stderr");
  assertIncludes(failedStrictSummary.stderr, "Recovery Hint: Wake and unlock the phone, then rerun the smoke.", "--strict failure should include recovery hint on stderr");

  const failedStrictSummaryJson = await runReader(["--summary-json", "--strict"]);
  assertExit(failedStrictSummaryJson, 1, "--summary-json --strict should fail failed result summaries");
  assertEqual(JSON.parse(failedStrictSummaryJson.stdout).status, "failed", "--summary-json --strict should still print parseable JSON on stdout");
  assertIncludes(failedStrictSummaryJson.stderr, "Failure Stage: screenshot", "--summary-json --strict should include failed stage on stderr");
  assertIncludes(failedStrictSummaryJson.stderr, "Failure Code: TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT", "--summary-json --strict should include error code on stderr");

  const failedStrictSummaryKeys = await runReader(["--summary-keys", "--strict"]);
  assertExit(failedStrictSummaryKeys, 1, "--summary-keys --strict should fail failed result summaries");
  assertIncludes(JSON.parse(failedStrictSummaryKeys.stdout), "recoveryHint", "--summary-keys --strict should still print parseable keys on stdout");
  assertIncludes(failedStrictSummaryKeys.stderr, "Failure Stage: screenshot", "--summary-keys --strict should include failed stage on stderr");

  const failedStrictPathKeys = await runReader(["--paths-keys", "--strict"]);
  assertExit(failedStrictPathKeys, 1, "--paths-keys --strict should fail failed result summaries");
  assertIncludes(JSON.parse(failedStrictPathKeys.stdout), "runResult", "--paths-keys --strict should still print parseable keys on stdout");
  assertIncludes(failedStrictPathKeys.stderr, "Failure Stage: screenshot", "--paths-keys --strict should include failed stage on stderr");

  await writeFixture({
    currentRunResultPath: ".thai-meet/device-smoke/runs/fixture.json",
    currentRunScreenshotPath: ".thai-meet/device-smoke/runs/fixture.png"
  });

  const field = await runReader(["--field", "status"]);
  assertExit(field, 0, "--field status should pass");
  assertEqual(field.stdout.trim(), "passed", "--field status should print status only");

  const missingSummaryFieldName = await runReader(["--summary-field", "--strict"]);
  assertExit(missingSummaryFieldName, 1, "--summary-field followed by another option should fail as a missing field name");
  assertIncludes(missingSummaryFieldName.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_REQUIRED", "--summary-field followed by another option should print the summary-field-required code");

  const missingSummaryField = await runReader(["--summary-field", "missingSummaryAlias"]);
  assertExit(missingSummaryField, 1, "unknown summary field should fail");
  assertIncludes(missingSummaryField.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_MISSING", "unknown summary field should print a stable code");

  const nonArtifactSummaryField = await runReader(["--summary-field", "durationMs", "--require-existing"]);
  assertExit(nonArtifactSummaryField, 1, "--summary-field --require-existing should fail for non-artifact summary fields");
  assertIncludes(nonArtifactSummaryField.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_NOT_ARTIFACT", "non-artifact summary field should print a stable code");

  const missingPathsFieldName = await runReader(["--paths-field", "--strict"]);
  assertExit(missingPathsFieldName, 1, "--paths-field followed by another option should fail as a missing field name");
  assertIncludes(missingPathsFieldName.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_REQUIRED", "--paths-field followed by another option should print the paths-field-required code");

  const missingPathsField = await runReader(["--paths-field", "missingArtifactAlias"]);
  assertExit(missingPathsField, 1, "unknown paths field should fail");
  assertIncludes(missingPathsField.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_MISSING", "unknown paths field should print a stable code");

  const missingFieldName = await runReader(["--field", "--strict"]);
  assertExit(missingFieldName, 1, "--field followed by another option should fail as a missing field name");
  assertIncludes(missingFieldName.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED", "--field followed by another option should print the field-required code");

  const screenshotPath = await runReader(["--path", "screenshot"]);
  assertExit(screenshotPath, 0, "--path screenshot should pass");
  assertEqual(screenshotPath.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.png", "--path screenshot should print relative screenshot path");

  const latestResultPath = await runReader(["--path", "latest"]);
  assertExit(latestResultPath, 0, "--path latest should pass");
  assertEqual(latestResultPath.stdout.trim(), path.join(".thai-meet", "device-smoke", "latest.json"), "--path latest should print the latest result path");

  const latestScreenshotPath = await runReader(["--path", "latest-screenshot"]);
  assertExit(latestScreenshotPath, 0, "--path latest-screenshot should pass");
  assertEqual(latestScreenshotPath.stdout.trim(), path.join(".thai-meet", "device-smoke", "latest.png"), "--path latest-screenshot should print the latest screenshot path");

  const currentResultPath = await runReader(["--path", "current-result"]);
  assertExit(currentResultPath, 0, "--path current-result should pass");
  assertEqual(currentResultPath.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.json", "--path current-result should print the current-run result path");

  const currentScreenshotPath = await runReader(["--path", "current-screenshot"]);
  assertExit(currentScreenshotPath, 0, "--path current-screenshot should pass");
  assertEqual(currentScreenshotPath.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.png", "--path current-screenshot should print the current-run screenshot path");

  const runResultPath = await runReader(["--path", "run-result"]);
  assertExit(runResultPath, 0, "--path run-result should pass");
  assertEqual(runResultPath.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.json", "--path run-result should print the per-run result path");

  const runScreenshotPath = await runReader(["--path", "run-screenshot"]);
  assertExit(runScreenshotPath, 0, "--path run-screenshot should pass");
  assertEqual(runScreenshotPath.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.png", "--path run-screenshot should print the per-run screenshot path");

  const apkPath = await runReader(["--path", "apk"]);
  assertExit(apkPath, 0, "--path apk should pass");
  assertEqual(apkPath.stdout.trim(), "apps/mobile/build/app/outputs/flutter-apk/app-debug.apk", "--path apk should print the APK artifact path");

  const paths = await runReader(["--paths"]);
  assertExit(paths, 0, "--paths should pass");
  const parsedPaths = JSON.parse(paths.stdout);
  assertEqual(parsedPaths.apk, "apps/mobile/build/app/outputs/flutter-apk/app-debug.apk", "--paths should include apk");
  assertEqual(parsedPaths.latest, path.join(".thai-meet", "device-smoke", "latest.json"), "--paths should include latest");
  assertEqual(parsedPaths.latestScreenshot, path.join(".thai-meet", "device-smoke", "latest.png"), "--paths should include latest screenshot");
  assertEqual(parsedPaths.currentResult, ".thai-meet/device-smoke/runs/fixture.json", "--paths should include current-run result");
  assertEqual(parsedPaths.currentScreenshot, ".thai-meet/device-smoke/runs/fixture.png", "--paths should include current-run screenshot");
  assertEqual(parsedPaths.runResult, ".thai-meet/device-smoke/runs/fixture.json", "--paths should include per-run result");
  assertEqual(parsedPaths.runScreenshot, ".thai-meet/device-smoke/runs/fixture.png", "--paths should include per-run screenshot");
  assertEqual(parsedPaths.result, ".thai-meet/device-smoke/runs/fixture.json", "--paths should include result");
  assertEqual(parsedPaths.screenshot, ".thai-meet/device-smoke/runs/fixture.png", "--paths should include screenshot");

  const pathKeys = await runReader(["--paths-keys"]);
  assertExit(pathKeys, 0, "--paths-keys should pass");
  const parsedPathKeys = JSON.parse(pathKeys.stdout);
  assertEqual(Array.isArray(parsedPathKeys), true, "--paths-keys should print a JSON array");
  assertEqual(parsedPathKeys.join(","), Object.keys(parsedPaths).join(","), "--paths-keys should match paths JSON key order");
  assertIncludes(parsedPathKeys, "apk", "--paths-keys should include apk");
  assertIncludes(parsedPathKeys, "latestScreenshot", "--paths-keys should include latestScreenshot");
  assertIncludes(parsedPathKeys, "runResult", "--paths-keys should include runResult");
  assertIncludes(parsedPathKeys, "runScreenshot", "--paths-keys should include runScreenshot");
  assertIncludes(parsedPathKeys, "screenshot", "--paths-keys should include screenshot");

  const pathsField = await runReader(["--paths-field", "runResult"]);
  assertExit(pathsField, 0, "--paths-field runResult should pass");
  assertEqual(pathsField.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.json", "--paths-field should print artifact path aliases");

  const pathsFieldEquals = await runReader(["--paths-field=currentScreenshot"]);
  assertExit(pathsFieldEquals, 0, "--paths-field=name should pass");
  assertEqual(pathsFieldEquals.stdout.trim(), ".thai-meet/device-smoke/runs/fixture.png", "--paths-field=name should print artifact path aliases");

  const absolutePathsField = await runReader(["--paths-field", "runScreenshot", "--absolute"]);
  assertExit(absolutePathsField, 0, "--paths-field runScreenshot --absolute should pass");
  assertEqual(path.isAbsolute(absolutePathsField.stdout.trim()), true, "--paths-field --absolute should print absolute artifact paths");

  const existingPathsField = await runReader(["--paths-field", "runScreenshot", "--require-existing"]);
  assertExit(existingPathsField, 0, "--paths-field --require-existing should pass when the artifact exists");

  const absolutePaths = await runReader(["--paths", "--absolute"]);
  assertExit(absolutePaths, 0, "--paths --absolute should pass");
  const parsedAbsolutePaths = JSON.parse(absolutePaths.stdout);
  assertEqual(path.isAbsolute(parsedAbsolutePaths.apk), true, "--paths --absolute should include absolute apk");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.latest), true, "--paths --absolute should include absolute latest");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.latestScreenshot), true, "--paths --absolute should include absolute latest screenshot");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.currentResult), true, "--paths --absolute should include absolute current-run result");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.currentScreenshot), true, "--paths --absolute should include absolute current-run screenshot");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.runResult), true, "--paths --absolute should include absolute per-run result");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.runScreenshot), true, "--paths --absolute should include absolute per-run screenshot");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.result), true, "--paths --absolute should include absolute result");
  assertEqual(path.isAbsolute(parsedAbsolutePaths.screenshot), true, "--paths --absolute should include absolute screenshot");

  const existingPaths = await runReader(["--paths", "--require-existing"]);
  assertExit(existingPaths, 0, "--paths --require-existing should pass when all artifacts exist");

  const absoluteScreenshotPath = await runReader(["--path", "screenshot", "--absolute"]);
  assertExit(absoluteScreenshotPath, 0, "--path screenshot --absolute should pass");
  assertEqual(path.isAbsolute(absoluteScreenshotPath.stdout.trim()), true, "--absolute should print an absolute path");

  const absoluteLatestScreenshotPath = await runReader(["--path", "latest-screenshot", "--absolute"]);
  assertExit(absoluteLatestScreenshotPath, 0, "--path latest-screenshot --absolute should pass");
  assertEqual(path.isAbsolute(absoluteLatestScreenshotPath.stdout.trim()), true, "--absolute should print an absolute latest screenshot path");

  const absoluteCurrentResultPath = await runReader(["--path", "current-result", "--absolute"]);
  assertExit(absoluteCurrentResultPath, 0, "--path current-result --absolute should pass");
  assertEqual(path.isAbsolute(absoluteCurrentResultPath.stdout.trim()), true, "--absolute should print an absolute current-run result path");

  const absoluteCurrentScreenshotPath = await runReader(["--path", "current-screenshot", "--absolute"]);
  assertExit(absoluteCurrentScreenshotPath, 0, "--path current-screenshot --absolute should pass");
  assertEqual(path.isAbsolute(absoluteCurrentScreenshotPath.stdout.trim()), true, "--absolute should print an absolute current-run screenshot path");

  const absoluteRunResultPath = await runReader(["--path", "run-result", "--absolute"]);
  assertExit(absoluteRunResultPath, 0, "--path run-result --absolute should pass");
  assertEqual(path.isAbsolute(absoluteRunResultPath.stdout.trim()), true, "--absolute should print an absolute per-run result path");

  const absoluteRunScreenshotPath = await runReader(["--path", "run-screenshot", "--absolute"]);
  assertExit(absoluteRunScreenshotPath, 0, "--path run-screenshot --absolute should pass");
  assertEqual(path.isAbsolute(absoluteRunScreenshotPath.stdout.trim()), true, "--absolute should print an absolute per-run screenshot path");

  const existingScreenshotPath = await runReader(["--path", "screenshot", "--require-existing"]);
  assertExit(existingScreenshotPath, 0, "--require-existing should pass when the artifact exists");

  const existingLatestScreenshotPath = await runReader(["--path", "latest-screenshot", "--require-existing"]);
  assertExit(existingLatestScreenshotPath, 0, "--path latest-screenshot --require-existing should pass when the artifact exists");

  const existingCurrentResultPath = await runReader(["--path", "current-result", "--require-existing"]);
  assertExit(existingCurrentResultPath, 0, "--path current-result --require-existing should pass when the artifact exists");

  const existingCurrentScreenshotPath = await runReader(["--path", "current-screenshot", "--require-existing"]);
  assertExit(existingCurrentScreenshotPath, 0, "--path current-screenshot --require-existing should pass when the artifact exists");

  const existingRunResultPath = await runReader(["--path", "run-result", "--require-existing"]);
  assertExit(existingRunResultPath, 0, "--path run-result --require-existing should pass when the artifact exists");

  const existingRunScreenshotPath = await runReader(["--path", "run-screenshot", "--require-existing"]);
  assertExit(existingRunScreenshotPath, 0, "--path run-screenshot --require-existing should pass when the artifact exists");

  const missingPathMode = await runReader(["--require-existing"]);
  assertExit(missingPathMode, 1, "--require-existing without --path should fail");
  assertIncludes(missingPathMode.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_REQUIRE_EXISTING_REQUIRES_PATH", "--require-existing without --path should print a stable code");

  await writeFixture({
    currentRunResultPath: ".thai-meet/device-smoke/runs/fixture.json",
    currentRunScreenshotPath: ".thai-meet/device-smoke/runs/missing.png"
  });
  const missingArtifact = await runReader(["--path", "screenshot", "--require-existing"]);
  assertExit(missingArtifact, 1, "--require-existing should fail when the artifact is missing");
  assertIncludes(missingArtifact.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING", "missing artifact should print a stable code");

  const missingPathsArtifact = await runReader(["--paths", "--require-existing"]);
  assertExit(missingPathsArtifact, 1, "--paths --require-existing should fail when any artifact is missing");
  assertIncludes(missingPathsArtifact.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING", "missing artifact from --paths should print a stable code");

  const missingPathsFieldArtifact = await runReader(["--paths-field", "screenshot", "--require-existing"]);
  assertExit(missingPathsFieldArtifact, 1, "--paths-field --require-existing should fail when the artifact is missing");
  assertIncludes(missingPathsFieldArtifact.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING", "missing artifact from --paths-field should print a stable code");

  const missingSummaryFieldArtifact = await runReader(["--summary-field", "screenshotPath", "--require-existing"]);
  assertExit(missingSummaryFieldArtifact, 1, "--summary-field --require-existing should fail when the artifact is missing");
  assertIncludes(missingSummaryFieldArtifact.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING", "missing artifact from --summary-field should print a stable code");

  const missingSummaryArtifact = await runReader(["--summary-json", "--require-existing"]);
  assertExit(missingSummaryArtifact, 1, "--summary-json --require-existing should fail when a summary artifact is missing");
  assertIncludes(missingSummaryArtifact.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING", "missing artifact from --summary-json should print a stable code");

  const unknownOption = await runReader(["--bogus"]);
  assertExit(unknownOption, 1, "unknown option should fail");
  assertIncludes(unknownOption.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION", "unknown option should print a stable code");

  const optionConflict = await runReader(["--json", "--field", "status"]);
  assertExit(optionConflict, 1, "conflicting output options should fail");
  assertIncludes(optionConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "option conflict should print a stable code");

  const summaryJsonConflict = await runReader(["--summary-json", "--paths"]);
  assertExit(summaryJsonConflict, 1, "summary JSON should conflict with other output modes");
  assertIncludes(summaryJsonConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "summary JSON conflict should print a stable code");

  const summaryKeysConflict = await runReader(["--summary-keys", "--paths"]);
  assertExit(summaryKeysConflict, 1, "summary keys should conflict with other output modes");
  assertIncludes(summaryKeysConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "summary keys conflict should print a stable code");

  const pathKeysConflict = await runReader(["--paths-keys", "--summary-json"]);
  assertExit(pathKeysConflict, 1, "path keys should conflict with other output modes");
  assertIncludes(pathKeysConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "path keys conflict should print a stable code");

  const summaryFieldConflict = await runReader(["--summary-field", "status", "--paths"]);
  assertExit(summaryFieldConflict, 1, "summary field should conflict with other output modes");
  assertIncludes(summaryFieldConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "summary field conflict should print a stable code");

  const pathsFieldConflict = await runReader(["--paths-field", "runResult", "--summary-json"]);
  assertExit(pathsFieldConflict, 1, "paths field should conflict with other output modes");
  assertIncludes(pathsFieldConflict.stderr, "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT", "paths field conflict should print a stable code");

  console.log("Gate 0 Android device result reader OK");
} finally {
  await rm(tempRoot, { force: true, recursive: true });
}

async function writeFixture(paths) {
  const runDir = path.join(tempRoot, ".thai-meet", "device-smoke", "runs");
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, "fixture.png"), "png-fixture");
  await writeFile(path.join(runDir, "fixture.json"), "{\"status\":\"passed\"}\n");
  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.png"), "latest-png-fixture");
  await mkdir(path.join(tempRoot, "apps", "mobile", "build", "app", "outputs", "flutter-apk"), { recursive: true });
  await writeFile(path.join(tempRoot, "apps", "mobile", "build", "app", "outputs", "flutter-apk", "app-debug.apk"), "apk-fixture");
  await writeFile(
    path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"),
    JSON.stringify({
      schemaVersion: 1,
      command: "npm run mobile:device:smoke",
      apkPath: "apps/mobile/build/app/outputs/flutter-apk/app-debug.apk",
      status: "passed",
      runId: "fixture-run",
      startedAt: "2026-06-06T01:00:00.000Z",
      completedAt: "2026-06-06T01:00:42.500Z",
      durationMs: 42500,
      deviceSerial: "TEST_DEVICE",
      deviceManufacturer: "OPPO",
      deviceBrand: "OPPO",
      deviceModel: "CPH2695",
      androidRelease: "16",
      androidSdk: "36",
      screenPhysicalSize: "Physical size: 720x1604",
      screenDensityDpi: "320",
      deviceSelectionMode: "auto",
      requestedDeviceSerial: null,
      authorizedDeviceCount: 1,
      deviceProbeDurationMs: 900,
      packageName: "com.example.thai_meet_mobile",
      foregroundPackage: "com.example.thai_meet_mobile",
      foregroundActivity: "com.example.thai_meet_mobile.MainActivity",
      installedVersionName: "0.0.0",
      installedVersionCode: "1",
      flutterVersion: "3.44.1",
      flutterChannel: "stable",
      dartVersion: "3.12.1",
      hostPlatform: "win32",
      hostArch: "x64",
      nodeVersion: "v24.12.0",
      flutterCommand: "flutter.bat",
      adbCommand: "adb.exe",
      adbVersion: "Android Debug Bridge version 1.0.41",
      toolchainProbeDurationMs: 1200,
      renderWaitMs: 7000,
      renderWaitSource: "default",
      buildDurationMs: 3800,
      installDurationMs: 2100,
      packageInfoDurationMs: 250,
      launchDurationMs: 650,
      screenshotDurationMs: 350,
      apkBuiltAt: "2026-06-06T01:00:05.000Z",
      apkSizeBytes: 160117145,
      apkSha256: "abc123apk",
      currentRunResultStatus: "archived",
      runResultArchived: true,
      currentRunResultPath: paths.currentRunResultPath,
      runResultPath: paths.currentRunResultPath,
      currentRunScreenshotStatus: "captured-and-archived",
      currentRunScreenshotPath: paths.currentRunScreenshotPath,
      runScreenshotPath: paths.currentRunScreenshotPath,
      screenshotPath: path.join(".thai-meet", "device-smoke", "latest.png"),
      screenshotWidth: 720,
      screenshotHeight: 1604,
      screenshotSizeBytes: 123456,
      screenshotDiverseSamples: 41,
      screenshotSha256: "abc123screenshot",
      screenshotCapturedAt: "2026-06-06T01:00:41.000Z",
      screenshotCapturedForRun: true,
      runScreenshotArchived: true,
      latestScreenshotMayBeStale: false,
      recoveryHintCode: null,
      recoveryHint: null
    }, null, 2)
  );
}

async function writeInvalidResultFixture() {
  await mkdir(path.join(tempRoot, ".thai-meet", "device-smoke"), { recursive: true });
  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"), "{not valid json");
}

async function writeInvalidSchemaFixture() {
  await mkdir(path.join(tempRoot, ".thai-meet", "device-smoke"), { recursive: true });
  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"), "{}\n");
}

async function writeInvalidStatusFixture() {
  await mkdir(path.join(tempRoot, ".thai-meet", "device-smoke"), { recursive: true });
  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"), JSON.stringify({ status: "unknown" }, null, 2));
}

async function writeMissingRunIdFixture() {
  await mkdir(path.join(tempRoot, ".thai-meet", "device-smoke"), { recursive: true });
  await writeFile(path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"), JSON.stringify({ status: "passed" }, null, 2));
}

async function writeFailedFixture() {
  const runDir = path.join(tempRoot, ".thai-meet", "device-smoke", "runs");
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, "failed.json"), "{\"status\":\"failed\"}\n");
  await writeFile(
    path.join(tempRoot, ".thai-meet", "device-smoke", "latest.json"),
    JSON.stringify({
      status: "failed",
      runId: "fixture-failed-run",
      startedAt: "2026-06-06T02:00:00.000Z",
      completedAt: "2026-06-06T02:00:07.000Z",
      durationMs: 7000,
      deviceSerial: "TEST_DEVICE",
      currentRunResultStatus: "archived",
      currentRunResultPath: ".thai-meet/device-smoke/runs/failed.json",
      currentRunScreenshotStatus: "not-captured",
      currentRunScreenshotPath: null,
      failedStage: "screenshot",
      error: "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT\nlatest screenshot looked blank",
      errorCode: "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT",
      errorDetail: "latest screenshot looked blank",
      recoveryHintCode: "WAKE_UNLOCK_DEVICE",
      recoveryHint: "Wake and unlock the phone, then rerun the smoke."
    }, null, 2)
  );
}

function runReader(args) {
  return new Promise((resolve) => {
    execFile(process.execPath, [readerPath, ...args], { cwd: tempRoot, windowsHide: true }, (error, stdout, stderr) => {
      resolve({
        code: error?.code ?? 0,
        stderr,
        stdout
      });
    });
  });
}

function assertExit(result, expectedCode, message) {
  if (result.code !== expectedCode) {
    throw new Error(`${message}\nExpected exit ${expectedCode}, got ${result.code}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
}

function assertIncludes(value, expectedNeedle, message) {
  if (!value.includes(expectedNeedle)) {
    throw new Error(`${message}\nExpected to include ${expectedNeedle}\nActual:\n${value}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}
