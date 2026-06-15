import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["smoke:metrics"] !== "node scripts/smoke-metrics.mjs") {
  failures.push("package.json must expose smoke:metrics");
}
if (packageJson.scripts?.["mobile:device:smoke"] !== "node scripts/mobile-device-smoke.mjs") {
  failures.push("package.json must expose mobile:device:smoke");
}
if (packageJson.scripts?.["mobile:device:result"] !== "node scripts/read-mobile-device-smoke-result.mjs") {
  failures.push("package.json must expose mobile:device:result");
}
if (packageJson.scripts?.["mobile:device:result:test"] !== "node scripts/check-mobile-device-result-reader.mjs") {
  failures.push("package.json must expose mobile:device:result:test");
}
if (!packageJson.scripts?.test?.includes("npm run mobile:device:result:test")) {
  failures.push("npm test must run mobile:device:result:test");
}

await requireFile("scripts/smoke-metrics.mjs");
await requireFile("scripts/mobile-device-smoke.mjs");
await requireFile("scripts/read-mobile-device-smoke-result.mjs");
await requireFile("scripts/check-mobile-device-result-reader.mjs");
await requireFile("scripts/check-api-runtime.mjs");
await requireFile("docs/dev/DX_METRICS.md");
await requireFile("docs/dev/ANDROID_DEVICE_SMOKE.md");

const smokeSource = await readFile(path.join(root, "scripts/smoke.mjs"), "utf8");
for (const token of ["schemaVersion", "startedAt", "durationMs", "status", "failedStage", "runTemperature", "retryCount", "os", "nodeMajor", "pnpmMajor", "flutterChannel", "command", "runtime", "stages"]) {
  if (!smokeSource.includes(token)) {
    failures.push(`smoke result schema must include ${token}`);
  }
}

const workflow = await readFile(path.join(root, ".github/workflows/contract-drift.yml"), "utf8");
if (!workflow.includes("actions/upload-artifact@")) {
  failures.push("contract drift workflow must upload smoke run artifacts");
}
if (!workflow.includes(".thai-meet/smoke-runs/*.json")) {
  failures.push("contract drift workflow must upload .thai-meet/smoke-runs/*.json");
}
if (!workflow.includes("subosito/flutter-action@v2")) {
  failures.push("contract drift workflow must set up Flutter before npm test");
}
if (!workflow.includes("channel: stable")) {
  failures.push("contract drift workflow must use Flutter stable");
}

const androidDeviceSmokeSource = await readFile(path.join(root, "scripts/mobile-device-smoke.mjs"), "utf8").catch(() => "");
for (const token of [
  "adb devices",
  "adb version",
  "--version --machine",
  "flutter build apk --debug",
  "adb install -r -t",
  "KEYCODE_WAKEUP",
  "dismiss-keyguard",
  "wm size",
  "wm density",
  "monkey -p",
  "dumpsys",
  "assertForegroundPackage",
  "foregroundPackage",
  "foregroundActivity",
  "extractForegroundActivity",
  "TM_ANDROID_DEVICE_SMOKE_FOREGROUND_MISMATCH",
  "renderWaitMs",
  "renderWaitSource",
  "runId",
  "exec-out",
  "screencap -p",
  ".thai-meet",
  "device-smoke",
  "runs",
  "latest.png",
  "latest.json",
  "runResultPath",
  "currentRunResultPath",
  "currentRunResultStatus",
  "runResultArchived",
  "Archive Result:",
  "Archive Screenshot:",
  "Failure Stage:",
  "Failure Code:",
  "Failure Detail:",
  "Failure Hint Code:",
  "Failure Hint:",
  "formatRecoveryHint",
  "formatRecoveryHintCode",
  "Failure Duration:",
  "Failure Timings:",
  "formatFailureTimingSummary",
  "Failure Run:",
  "Failure Config:",
  "formatFailureConfigSummary",
  "Failure Device:",
  "formatFailureDeviceSummary",
  "Failure Build:",
  "formatFailureBuildSummary",
  "Failure Capture:",
  "formatFailureCaptureSummary",
  "Failure Screenshot:",
  "formatFailureScreenshotSummary",
  "Failure Artifacts:",
  "formatFailureArtifactSummary",
  "Failure Host:",
  "formatFailureHostSummary",
  "Failure Result:",
  "Failure Archive Result:",
  "errorCode",
  "extractErrorCode",
  "errorDetail",
  "extractErrorDetail",
  "recoveryHint",
  "recoveryHintCode",
  "verifyArchivedArtifacts",
  "TM_ANDROID_DEVICE_SMOKE_ARCHIVE_MISMATCH",
  "Duration:",
  "formatDurationSeconds",
  "Device:",
  "formatDeviceSummary",
  "App:",
  "formatAppSummary",
  "Build:",
  "formatBuildSummary",
  "Timings:",
  "formatTimingSummary",
  "Capture:",
  "formatCaptureSummary",
  "Run:",
  "formatRunSummary",
  "Artifacts:",
  "formatArtifactSummary",
  "Host:",
  "formatHostSummary",
  "Result:",
  "writeDeviceSmokeResult",
  "failedStage: result.failedStage ?? null",
  "errorCode: result.errorCode ?? null",
  "errorDetail: result.errorDetail ?? null",
  "recoveryHint: result.recoveryHint ?? null",
  "recoveryHintCode: result.recoveryHintCode ?? null",
  "error: result.error ?? null",
  "deviceSelectionMode: result.deviceSelectionMode ?? deviceSelectionMode",
  "authorizedDeviceCount: result.authorizedDeviceCount ?? authorizedDeviceCount",
  "requestedDeviceSerial",
  "requestedDeviceSerial: result.requestedDeviceSerial ?? requestedDeviceSerial",
  "let selectedDevice = null",
  "let flutterBuildInfo = null",
  "let adbVersion = null",
  "let toolchainProbeDurationMs = null",
  "let buildDurationMs = null",
  "let deviceProbeDurationMs = null",
  "let apkBuiltAt = null",
  "let apkSizeBytes = null",
  "let apkSha256 = null",
  "let screenshotCapturedAt = null",
  "let screenshotDurationMs = null",
  "let screenshotSizeBytes = null",
  "let screenshotSha256 = null",
  "let screenshotWidth = null",
  "let screenshotHeight = null",
  "let screenshotDiverseSamples = null",
  "let screenshotCapturedForRun = false",
  "let runScreenshotArchived = false",
  "let currentRunScreenshotPath = null",
  "currentRunScreenshotStatus",
  "formatCurrentRunScreenshotStatus",
  "flutterBuildInfo = await readFlutterBuildInfo()",
  "adbVersion = await readAdbVersion()",
  "toolchainProbeDurationMs = Date.now() - toolchainProbeStartedAt",
  "buildDurationMs = Date.now() - buildStartedAt",
  "apkBuiltAt = apkStat.mtime",
  "apkSizeBytes = apkStat.size",
  "apkSha256 = sha256Hex(await readFile(apkPath))",
  "deviceProbeDurationMs = Date.now() - deviceProbeStartedAt",
  "selectedDevice = selectDevice(authorizedDevices)",
  "deviceSerial: result.deviceSerial ?? selectedDevice",
  "toolchainProbeDurationMs: result.toolchainProbeDurationMs ?? toolchainProbeDurationMs",
  "flutterVersion: result.flutterVersion ?? flutterBuildInfo?.flutterVersion ?? null",
  "flutterChannel: result.flutterChannel ?? flutterBuildInfo?.flutterChannel ?? null",
  "dartVersion: result.dartVersion ?? flutterBuildInfo?.dartVersion ?? null",
  "adbVersion: result.adbVersion ?? adbVersion",
  "buildDurationMs: result.buildDurationMs ?? buildDurationMs",
  "apkBuiltAt: result.apkBuiltAt ?? apkBuiltAt",
  "apkSizeBytes: result.apkSizeBytes ?? apkSizeBytes",
  "apkSha256: result.apkSha256 ?? apkSha256",
  "screenshotCapturedAt: result.screenshotCapturedAt ?? screenshotCapturedAt",
  "screenshotDurationMs: result.screenshotDurationMs ?? screenshotDurationMs",
  "screenshotSizeBytes: result.screenshotSizeBytes ?? screenshotSizeBytes",
  "screenshotSha256: result.screenshotSha256 ?? screenshotSha256",
  "screenshotWidth: result.screenshotWidth ?? screenshotWidth",
  "screenshotHeight: result.screenshotHeight ?? screenshotHeight",
  "screenshotDiverseSamples: result.screenshotDiverseSamples ?? screenshotDiverseSamples",
  "screenshotCapturedForRun: result.screenshotCapturedForRun ?? screenshotCapturedForRun",
  "runScreenshotArchived: result.runScreenshotArchived ?? runScreenshotArchived",
  "currentRunScreenshotPath: result.currentRunScreenshotPath ?? currentRunScreenshotPath",
  "currentRunScreenshotStatus: result.currentRunScreenshotStatus ?? formatCurrentRunScreenshotStatus({",
  "latestScreenshotMayBeStale: result.latestScreenshotMayBeStale ?? (result.status === \"failed\" && !screenshotCapturedForRun)",
  "currentRunResultPath: result.currentRunResultPath ?? path.relative(root, runResultPath)",
  "currentRunResultStatus: result.currentRunResultStatus ?? \"archived\"",
  "runResultArchived: result.runResultArchived ?? true",
  "deviceProbeDurationMs: result.deviceProbeDurationMs ?? deviceProbeDurationMs",
  "selected ${device.selectedDevice ?? \"none\"}",
  "verifyArchivedResult",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_ARCHIVE_MISMATCH",
  "hostPlatform",
  "hostArch",
  "nodeVersion",
  "flutterCommand",
  "adbCommand",
  "toolchainProbeDurationMs",
  "deviceProbeDurationMs",
  "authorizedDeviceCount",
  "deviceSelectionMode",
  "deviceSerial",
  "deviceManufacturer",
  "deviceBrand",
  "deviceModel",
  "androidRelease",
  "androidSdk",
  "screenPhysicalSize",
  "screenDensityDpi",
  "readScreenInfo",
  "readAdbVersion",
  "adbVersion",
  "apkBuiltAt",
  "buildDurationMs",
  "installDurationMs",
  "launchDurationMs",
  "apkSha256",
  "apkSizeBytes",
  "readFlutterBuildInfo",
  "flutterVersion",
  "flutterChannel",
  "dartVersion",
  "readInstalledPackageInfo",
  "packageInfoDurationMs",
  "installedVersionName",
  "installedVersionCode",
  "versionName",
  "versionCode",
  "ro.product.manufacturer",
  "ro.product.brand",
  "ro.product.model",
  "ro.build.version.release",
  "ro.build.version.sdk",
  "screenshotPath",
  "runScreenshotPath",
  "screenshotCapturedAt",
  "screenshotDurationMs",
  "screenshotSha256",
  "screenshotSizeBytes",
  "screenshotWidth",
  "screenshotHeight",
  "screenshotDiverseSamples",
  "completedAt",
  "durationMs",
  "output.on(\"finish\"",
  "copyFile",
  "validatePngScreenshot",
  "inflateSync",
  "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT"
]) {
  if (!androidDeviceSmokeSource.includes(token)) {
    failures.push(`Android device smoke script must include ${token}`);
  }
}

const androidDeviceResultSource = await readFile(path.join(root, "scripts/read-mobile-device-smoke-result.mjs"), "utf8").catch(() => "");
for (const token of [
  ".thai-meet",
  "device-smoke",
  "latest.json",
  "status",
  "deviceSerial",
  "currentRunResultStatus",
  "currentRunScreenshotStatus",
  "recoveryHintCode",
  "--json",
  "process.argv.includes(\"--json\")",
  "JSON.stringify(result",
  "--summary-json",
  "process.argv.includes(\"--summary-json\")",
  "buildResultSummary",
  "--summary-keys",
  "process.argv.includes(\"--summary-keys\")",
  "Object.keys(buildResultSummary",
  "--summary-field",
  "readRequestedSummaryFieldName",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_REQUIRED",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_MISSING",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_NOT_ARTIFACT",
  "assertSummaryFieldArtifactExists",
  "schemaVersion: sourceResult.schemaVersion",
  "command: sourceResult.command",
  "startedAt: sourceResult.startedAt",
  "completedAt: sourceResult.completedAt",
  "durationMs: sourceResult.durationMs",
  "deviceManufacturer: sourceResult.deviceManufacturer",
  "deviceBrand: sourceResult.deviceBrand",
  "deviceModel: sourceResult.deviceModel",
  "androidRelease: sourceResult.androidRelease",
  "androidSdk: sourceResult.androidSdk",
  "screenPhysicalSize: sourceResult.screenPhysicalSize",
  "screenDensityDpi: sourceResult.screenDensityDpi",
  "deviceSelectionMode: sourceResult.deviceSelectionMode",
  "requestedDeviceSerial: sourceResult.requestedDeviceSerial",
  "authorizedDeviceCount: sourceResult.authorizedDeviceCount",
  "deviceProbeDurationMs: sourceResult.deviceProbeDurationMs",
  "packageName: sourceResult.packageName",
  "foregroundPackage: sourceResult.foregroundPackage",
  "foregroundActivity: sourceResult.foregroundActivity",
  "installedVersionName: sourceResult.installedVersionName",
  "installedVersionCode: sourceResult.installedVersionCode",
  "flutterVersion: sourceResult.flutterVersion",
  "flutterChannel: sourceResult.flutterChannel",
  "dartVersion: sourceResult.dartVersion",
  "hostPlatform: sourceResult.hostPlatform",
  "hostArch: sourceResult.hostArch",
  "nodeVersion: sourceResult.nodeVersion",
  "flutterCommand: sourceResult.flutterCommand",
  "adbCommand: sourceResult.adbCommand",
  "adbVersion: sourceResult.adbVersion",
  "toolchainProbeDurationMs: sourceResult.toolchainProbeDurationMs",
  "renderWaitMs: sourceResult.renderWaitMs",
  "renderWaitSource: sourceResult.renderWaitSource",
  "buildDurationMs: sourceResult.buildDurationMs",
  "installDurationMs: sourceResult.installDurationMs",
  "packageInfoDurationMs: sourceResult.packageInfoDurationMs",
  "launchDurationMs: sourceResult.launchDurationMs",
  "screenshotDurationMs: sourceResult.screenshotDurationMs",
  "apkBuiltAt: sourceResult.apkBuiltAt",
  "apkSizeBytes: sourceResult.apkSizeBytes",
  "apkSha256: sourceResult.apkSha256",
  "apkPath: formatArtifactPath",
  "latestScreenshotPath: formatOptionalArtifactPath",
  "latest-screenshot",
  "current-result",
  "current-screenshot",
  "run-result",
  "run-screenshot",
  "currentRunResultStatus: sourceResult.currentRunResultStatus",
  "currentRunScreenshotStatus: sourceResult.currentRunScreenshotStatus",
  "runResultArchived: sourceResult.runResultArchived",
  "runResultPath: formatOptionalArtifactPath",
  "runScreenshotPath: formatOptionalArtifactPath",
  "currentRunResultPath: formatOptionalArtifactPath",
  "currentRunScreenshotPath: formatOptionalArtifactPath",
  "screenshotWidth: sourceResult.screenshotWidth",
  "screenshotHeight: sourceResult.screenshotHeight",
  "screenshotSizeBytes: sourceResult.screenshotSizeBytes",
  "screenshotDiverseSamples: sourceResult.screenshotDiverseSamples",
  "screenshotSha256: sourceResult.screenshotSha256",
  "screenshotCapturedAt: sourceResult.screenshotCapturedAt",
  "screenshotCapturedForRun: sourceResult.screenshotCapturedForRun",
  "runScreenshotArchived: sourceResult.runScreenshotArchived",
  "latestScreenshotMayBeStale: sourceResult.latestScreenshotMayBeStale",
  "latestPath: formatArtifactPath",
  "failedStage: sourceResult.failedStage",
  "error: sourceResult.error",
  "errorCode: sourceResult.errorCode",
  "errorDetail: sourceResult.errorDetail",
  "recoveryHint: sourceResult.recoveryHint",
  "--strict",
  "process.argv.includes(\"--strict\")",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_FAILED",
  "process.exit(1)",
  "--field",
  "readRequestedFieldName",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_MISSING",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT",
  "shouldPrintJson && fieldWasRequested",
  "Object.hasOwn(result",
  "--path",
  "readRequestedPathName",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_PATH_REQUIRED",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_PATH_UNKNOWN",
  "--paths",
  "process.argv.includes(\"--paths\")",
  "buildArtifactPaths",
  "--paths-keys",
  "process.argv.includes(\"--paths-keys\")",
  "Object.keys(buildArtifactPaths",
  "--paths-field",
  "readRequestedPathsFieldName",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_REQUIRED",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_MISSING",
  "latestScreenshot: formatArtifactPath",
  "currentResult: formatArtifactPath",
  "currentScreenshot: formatArtifactPath",
  "runResult: formatArtifactPath",
  "runScreenshot: formatArtifactPath",
  "--absolute",
  "process.argv.includes(\"--absolute\")",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_ABSOLUTE_REQUIRES_PATH",
  "formatArtifactPath",
  "formatOptionalArtifactPath",
  "--require-existing",
  "process.argv.includes(\"--require-existing\")",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_REQUIRE_EXISTING_REQUIRES_PATH",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING",
  "assertArtifactExists",
  "assertAllArtifactsExist",
  "assertSummaryArtifactsExist",
  "--help",
  "process.argv.includes(\"--help\")",
  "printUsage",
  "Usage: npm run mobile:device:result",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION",
  "findUnknownOption",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_UNEXPECTED_ARGUMENT",
  "findUnexpectedArgument",
  "formatUnexpectedArgumentHint",
  "artifactPathTargets",
  "isOptionLikeArgument",
  "findDuplicateOutputOption",
  "countOptionRequests",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_MISSING",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_JSON",
  "TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA",
  "validateResultSchema",
  "Latest Android device smoke",
  "formatReaderRunSummary",
  "formatReaderDeviceSummary",
  "normalizeScreenPhysicalSize",
  "formatReaderAppSummary",
  "formatReaderTimingSummary",
  "formatReaderDurationSeconds",
  "formatReaderCaptureSummary",
  "formatReaderHostSummary",
  "formatReaderBuildSummary",
  "Duration:",
  "Timings:",
  "Capture:",
  "Host:",
  "Build:",
  "App:",
  "APK:",
  "Latest Result:",
  "Latest Screenshot:",
  "exitIfStrictResultFailed",
  "Failure:",
  "Failure Detail:",
  "Failure Stage:",
  "Failure Code:",
  "Recovery Hint:"
]) {
  if (!androidDeviceResultSource.includes(token)) {
    failures.push(`Android device result reader must include ${token}`);
  }
}

const androidDeviceSmokeDocs = await readFile(path.join(root, "docs/dev/ANDROID_DEVICE_SMOKE.md"), "utf8").catch(() => "");
for (const token of ["npm run mobile:device:smoke", "npm run mobile:device:result", "USB debugging", "authorized", "com.example.thai_meet_mobile", ".thai-meet/device-smoke/latest.png", ".thai-meet/device-smoke/latest.json"]) {
  if (!androidDeviceSmokeDocs.includes(token)) {
    failures.push(`Android device smoke docs must mention ${token}`);
  }
}

if (smokeSource.includes('stages.infra = "passed";')) {
  failures.push("smoke must not mark infra passed while Docker Compose boot is deferred");
}

if (!smokeSource.includes('runNodeScript("api", "scripts/check-api-runtime.mjs")')) {
  failures.push("smoke must run the API runtime check before passing the api stage");
}

const trustLoopSource = await readFile(path.join(root, "scripts/check-trust-loop.mjs"), "utf8");
const errorEnvelopeSource = await readFile(path.join(root, "scripts/check-error-envelope.mjs"), "utf8");
for (const [name, source] of [["check-trust-loop", trustLoopSource], ["check-error-envelope", errorEnvelopeSource]]) {
  if (!source.includes("API_PORT: \"0\"") || !source.includes("waitForServerPort")) {
    failures.push(`${name} must bind the spawned API to an ephemeral port and read that child's port`);
  }
}

if (failures.length > 0) {
  console.error("TM_DX_METRICS_CONTRACT_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 DX metrics contract OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}
