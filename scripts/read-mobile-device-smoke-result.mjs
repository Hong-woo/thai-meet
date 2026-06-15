import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const resultPath = path.join(root, ".thai-meet", "device-smoke", "latest.json");
const artifactPathTargets = ["apk", "current-result", "current-screenshot", "latest", "latest-screenshot", "result", "run-result", "run-screenshot", "screenshot"];
const shouldPrintHelp = process.argv.includes("--help");
const shouldPrintJson = process.argv.includes("--json");
const shouldPrintSummaryJson = process.argv.includes("--summary-json");
const shouldPrintSummaryKeys = process.argv.includes("--summary-keys");
const shouldPrintPaths = process.argv.includes("--paths");
const shouldPrintPathKeys = process.argv.includes("--paths-keys");
const shouldPrintAbsolutePath = process.argv.includes("--absolute");
const shouldRequireExistingArtifact = process.argv.includes("--require-existing");
const shouldFailOnUnpassedResult = process.argv.includes("--strict");
const requestedPathsFieldName = readRequestedPathsFieldName(process.argv);
const pathsFieldWasRequested = process.argv.includes("--paths-field") || process.argv.some((arg) => arg.startsWith("--paths-field="));
const requestedSummaryFieldName = readRequestedSummaryFieldName(process.argv);
const summaryFieldWasRequested = process.argv.includes("--summary-field") || process.argv.some((arg) => arg.startsWith("--summary-field="));
const requestedFieldName = readRequestedFieldName(process.argv);
const fieldWasRequested = process.argv.includes("--field") || process.argv.some((arg) => arg.startsWith("--field="));
const requestedPathName = readRequestedPathName(process.argv);
const pathWasRequested = process.argv.includes("--path") || process.argv.some((arg) => arg.startsWith("--path="));
const unknownOption = findUnknownOption(process.argv);
const duplicateOutputOption = findDuplicateOutputOption(process.argv);
const unexpectedArgument = findUnexpectedArgument(process.argv);

if (unknownOption) {
  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION\nUnknown option: ${unknownOption}\nRun npm run mobile:device:result -- --help for usage.`);
  process.exit(1);
}

if (unexpectedArgument) {
  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_UNEXPECTED_ARGUMENT\nUnexpected argument: ${unexpectedArgument}\n${formatUnexpectedArgumentHint(unexpectedArgument)}`);
  process.exit(1);
}

if (
  duplicateOutputOption ||
  (shouldPrintSummaryJson && shouldPrintJson) ||
  (shouldPrintSummaryJson && shouldPrintSummaryKeys) ||
  (shouldPrintSummaryJson && summaryFieldWasRequested) ||
  (shouldPrintSummaryJson && fieldWasRequested) ||
  (shouldPrintSummaryJson && pathWasRequested) ||
  (shouldPrintSummaryJson && shouldPrintPaths) ||
  (shouldPrintSummaryJson && pathsFieldWasRequested) ||
  (shouldPrintSummaryKeys && summaryFieldWasRequested) ||
  (shouldPrintSummaryKeys && pathsFieldWasRequested) ||
  (shouldPrintSummaryKeys && shouldPrintJson) ||
  (shouldPrintSummaryKeys && fieldWasRequested) ||
  (shouldPrintSummaryKeys && pathWasRequested) ||
  (shouldPrintSummaryKeys && shouldPrintPaths) ||
  (shouldPrintSummaryKeys && shouldPrintPathKeys) ||
  (summaryFieldWasRequested && shouldPrintJson) ||
  (summaryFieldWasRequested && fieldWasRequested) ||
  (summaryFieldWasRequested && pathWasRequested) ||
  (summaryFieldWasRequested && shouldPrintPaths) ||
  (summaryFieldWasRequested && shouldPrintPathKeys) ||
  (summaryFieldWasRequested && pathsFieldWasRequested) ||
  (pathsFieldWasRequested && shouldPrintJson) ||
  (pathsFieldWasRequested && fieldWasRequested) ||
  (pathsFieldWasRequested && pathWasRequested) ||
  (pathsFieldWasRequested && shouldPrintPaths) ||
  (pathsFieldWasRequested && shouldPrintPathKeys) ||
  (shouldPrintJson && fieldWasRequested) ||
  (shouldPrintJson && pathWasRequested) ||
  (shouldPrintJson && shouldPrintPaths) ||
  (shouldPrintJson && shouldPrintPathKeys) ||
  (fieldWasRequested && pathWasRequested) ||
  (fieldWasRequested && shouldPrintPaths) ||
  (fieldWasRequested && shouldPrintPathKeys) ||
  (pathWasRequested && shouldPrintPaths) ||
  (pathWasRequested && shouldPrintPathKeys) ||
  (shouldPrintPaths && shouldPrintPathKeys) ||
  (shouldPrintPathKeys && shouldPrintSummaryJson)
) {
  const duplicateDetail = duplicateOutputOption ? `\nDuplicate output option: ${duplicateOutputOption}` : "";
  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT\nUse only one of --json, --summary-json, --summary-keys, --summary-field, --field, --path, --paths, --paths-keys, or --paths-field.${duplicateDetail}`);
  process.exit(1);
}

if (shouldPrintHelp) {
  printUsage();
  process.exit(0);
}

if (shouldPrintAbsolutePath && !pathWasRequested && !shouldPrintPaths && !pathsFieldWasRequested && !shouldPrintSummaryJson && !summaryFieldWasRequested) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_ABSOLUTE_REQUIRES_PATH\nUse --absolute together with --summary-json, --summary-field, --path apk, --path screenshot, --path latest-screenshot, --path current-result, --path current-screenshot, --path run-result, --path run-screenshot, --path result, --path latest, --paths, or --paths-field.");
  process.exit(1);
}

if (shouldRequireExistingArtifact && !pathWasRequested && !shouldPrintPaths && !pathsFieldWasRequested && !shouldPrintSummaryJson && !summaryFieldWasRequested) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_REQUIRE_EXISTING_REQUIRES_PATH\nUse --require-existing together with --summary-json, --summary-field, --path apk, --path screenshot, --path latest-screenshot, --path current-result, --path current-screenshot, --path run-result, --path run-screenshot, --path result, --path latest, --paths, or --paths-field.");
  process.exit(1);
}

if (pathsFieldWasRequested && !requestedPathsFieldName) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_REQUIRED\nPass an artifact paths field name after --paths-field.");
  process.exit(1);
}

if (summaryFieldWasRequested && !requestedSummaryFieldName) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_REQUIRED\nPass a compact summary field name after --summary-field.");
  process.exit(1);
}

if (fieldWasRequested && !requestedFieldName) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_REQUIRED\nPass a top-level result field name after --field.");
  process.exit(1);
}

if (pathWasRequested && !requestedPathName) {
  console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_PATH_REQUIRED\nPass apk, screenshot, latest-screenshot, current-result, current-screenshot, run-result, run-screenshot, result, or latest after --path.");
  process.exit(1);
}

if (requestedPathName && !artifactPathTargets.includes(requestedPathName)) {
  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_PATH_UNKNOWN\nUnknown path target: ${requestedPathName}\nUse apk, screenshot, latest-screenshot, current-result, current-screenshot, run-result, run-screenshot, result, or latest.`);
  process.exit(1);
}

let result;
let resultSource;
try {
  resultSource = await readFile(resultPath, "utf8");
} catch (error) {
  throw new Error(
    `TM_ANDROID_DEVICE_SMOKE_RESULT_MISSING\nRun npm run mobile:device:smoke before reading the latest device result.\n${error.message}`
  );
}
try {
  result = JSON.parse(resultSource);
} catch (error) {
  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_JSON\n${path.relative(root, resultPath)} is not valid JSON.\n${error.message}`);
  process.exit(1);
}
validateResultSchema(result);

if (shouldPrintJson) {
  console.log(JSON.stringify(result, null, 2));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (shouldPrintSummaryJson) {
  const resultSummary = buildResultSummary(result);
  await assertSummaryArtifactsExist(resultSummary);
  console.log(JSON.stringify(resultSummary, null, 2));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (shouldPrintSummaryKeys) {
  console.log(JSON.stringify(Object.keys(buildResultSummary(result)), null, 2));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (requestedSummaryFieldName) {
  const resultSummary = buildResultSummary(result);
  if (!Object.hasOwn(resultSummary, requestedSummaryFieldName)) {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_MISSING\n${requestedSummaryFieldName} is not present in compact Android device smoke summary.`);
    process.exit(1);
  }
  const value = resultSummary[requestedSummaryFieldName];
  await assertSummaryFieldArtifactExists(requestedSummaryFieldName, value);
  console.log(typeof value === "string" ? value : JSON.stringify(value));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (shouldPrintPaths) {
  const artifactPaths = buildArtifactPaths(result);
  await assertAllArtifactsExist(artifactPaths);
  console.log(JSON.stringify(artifactPaths, null, 2));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (shouldPrintPathKeys) {
  console.log(JSON.stringify(Object.keys(buildArtifactPaths(result)), null, 2));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (requestedPathsFieldName) {
  const artifactPaths = buildArtifactPaths(result);
  if (!Object.hasOwn(artifactPaths, requestedPathsFieldName)) {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_PATHS_FIELD_MISSING\n${requestedPathsFieldName} is not present in Android device smoke artifact paths.`);
    process.exit(1);
  }
  const artifactPath = artifactPaths[requestedPathsFieldName];
  await assertArtifactExists(artifactPath, requestedPathsFieldName);
  console.log(artifactPath);
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (requestedFieldName) {
  if (!Object.hasOwn(result, requestedFieldName)) {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_FIELD_MISSING\n${requestedFieldName} is not present in ${path.relative(root, resultPath)}.`);
    process.exit(1);
  }
  const value = result[requestedFieldName];
  console.log(typeof value === "string" ? value : JSON.stringify(value));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

if (requestedPathName) {
  let artifactPath;
  if (requestedPathName === "screenshot") {
    artifactPath = result.currentRunScreenshotPath ?? result.screenshotPath ?? "none";
  } else if (requestedPathName === "apk") {
    artifactPath = result.apkPath ?? "none";
  } else if (requestedPathName === "latest") {
    artifactPath = path.relative(root, resultPath);
  } else if (requestedPathName === "latest-screenshot") {
    artifactPath = result.screenshotPath ?? path.join(".thai-meet", "device-smoke", "latest.png");
  } else if (requestedPathName === "current-result") {
    artifactPath = result.currentRunResultPath ?? "none";
  } else if (requestedPathName === "current-screenshot") {
    artifactPath = result.currentRunScreenshotPath ?? "none";
  } else if (requestedPathName === "run-result") {
    artifactPath = result.runResultPath ?? "none";
  } else if (requestedPathName === "run-screenshot") {
    artifactPath = result.runScreenshotPath ?? "none";
  } else {
    artifactPath = result.currentRunResultPath ?? result.runResultPath ?? path.relative(root, resultPath);
  }
  await assertArtifactExists(artifactPath, requestedPathName);
  console.log(formatArtifactPath(artifactPath));
  exitIfStrictResultFailed(result);
  process.exit(0);
}

console.log(`Latest Android device smoke: ${result.status}`);
console.log(`Run: ${formatReaderRunSummary(result)}`);
console.log(`Device: ${formatReaderDeviceSummary(result)}`);
console.log(`App: ${formatReaderAppSummary(result)}`);
console.log(`Duration: ${formatReaderDurationSeconds(result.durationMs)}`);
console.log(`Timings: ${formatReaderTimingSummary(result)}`);
console.log(`Capture: ${formatReaderCaptureSummary(result)}`);
console.log(`Host: ${formatReaderHostSummary(result)}`);
console.log(`Build: ${formatReaderBuildSummary(result)}`);
console.log(`APK: ${result.apkPath ?? "none"}`);
console.log(`Latest Result: ${path.relative(root, resultPath)}`);
console.log(`Latest Screenshot: ${result.screenshotPath ?? path.join(".thai-meet", "device-smoke", "latest.png")}`);
console.log(`Result: ${result.currentRunResultStatus ?? "unknown"} (${result.currentRunResultPath ?? result.runResultPath ?? "none"})`);
console.log(`Screenshot: ${result.currentRunScreenshotStatus ?? "unknown"} (${result.currentRunScreenshotPath ?? "none"})`);
if (result.status !== "passed") {
  console.log(`Failure: ${result.failedStage ?? "unknown"}, ${result.errorCode ?? "unknown"}`);
  if (result.errorDetail) {
    console.log(`Failure Detail: ${result.errorDetail}`);
  }
}
console.log(`Recovery: ${result.recoveryHintCode ?? "none"}`);
if (result.recoveryHint) {
  console.log(`Hint: ${result.recoveryHint}`);
}
exitIfStrictResultFailed(result);

function exitIfStrictResultFailed(sourceResult) {
  if (!shouldFailOnUnpassedResult || sourceResult.status === "passed") {
    return;
  }

  console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_FAILED\nLatest Android device smoke status is ${sourceResult.status}.`);
  console.error(`Failure Stage: ${sourceResult.failedStage ?? "unknown"}`);
  console.error(`Failure Code: ${sourceResult.errorCode ?? "unknown"}`);
  if (sourceResult.errorDetail) {
    console.error(`Failure Detail: ${sourceResult.errorDetail}`);
  }
  if (sourceResult.recoveryHintCode) {
    console.error(`Recovery Hint Code: ${sourceResult.recoveryHintCode}`);
  }
  if (sourceResult.recoveryHint) {
    console.error(`Recovery Hint: ${sourceResult.recoveryHint}`);
  }
  process.exit(1);
}

function readRequestedFieldName(argv) {
  const fieldEqualsArg = argv.find((arg) => arg.startsWith("--field="));
  if (fieldEqualsArg) {
    const requestedValue = fieldEqualsArg.slice("--field=".length);
    return isOptionLikeArgument(requestedValue) ? null : requestedValue;
  }

  const fieldArgIndex = argv.indexOf("--field");
  if (fieldArgIndex === -1) return null;
  const requestedValue = argv[fieldArgIndex + 1] ?? null;
  return isOptionLikeArgument(requestedValue) ? null : requestedValue;
}

function formatReaderDeviceSummary(sourceResult) {
  const serial = sourceResult.deviceSerial ?? "none";
  const manufacturer = sourceResult.deviceManufacturer ?? sourceResult.deviceBrand ?? null;
  const model = sourceResult.deviceModel ?? null;
  const androidRelease = sourceResult.androidRelease ?? null;
  const androidSdk = sourceResult.androidSdk ?? null;
  const screenSize = normalizeScreenPhysicalSize(sourceResult.screenPhysicalSize ?? null);
  const density = sourceResult.screenDensityDpi ?? null;
  const deviceName = [manufacturer, model].filter(Boolean).join(" ");
  const details = [];
  if (deviceName) details.push(deviceName);
  if (androidRelease && androidSdk) {
    details.push(`Android ${androidRelease} (API ${androidSdk})`);
  } else if (androidRelease) {
    details.push(`Android ${androidRelease}`);
  } else if (androidSdk) {
    details.push(`API ${androidSdk}`);
  }
  if (screenSize && density) {
    details.push(`${screenSize} @ ${density} dpi`);
  } else if (screenSize) {
    details.push(screenSize);
  } else if (density) {
    details.push(`${density} dpi`);
  }
  return details.length > 0 ? `${serial} (${details.join(", ")})` : serial;
}

function formatReaderRunSummary(sourceResult) {
  const runId = sourceResult.runId ?? "unknown";
  const wait = formatReaderDurationSeconds(sourceResult.renderWaitMs);
  const waitSource = sourceResult.renderWaitSource ?? "unknown";
  const deviceSelection = sourceResult.deviceSelectionMode ?? "unknown";
  const requestedSerial = sourceResult.requestedDeviceSerial ? ` requested ${sourceResult.requestedDeviceSerial}` : "";
  const authorizedCount = sourceResult.authorizedDeviceCount ?? "unknown";
  return `${runId}, wait ${wait} from ${waitSource}, device ${deviceSelection}${requestedSerial}, authorized ${authorizedCount}`;
}

function normalizeScreenPhysicalSize(screenPhysicalSize) {
  return screenPhysicalSize?.replace(/^Physical size:\s*/u, "") ?? null;
}

function formatReaderAppSummary(sourceResult) {
  const packageName = sourceResult.foregroundPackage ?? sourceResult.packageName ?? "none";
  const activity = sourceResult.foregroundActivity ?? "none";
  const versionName = sourceResult.installedVersionName ?? "unknown";
  const versionCode = sourceResult.installedVersionCode ?? "unknown";
  return `${packageName}/${activity}, version ${versionName} (${versionCode})`;
}

function formatReaderTimingSummary(sourceResult) {
  return [
    `build ${formatReaderDurationSeconds(sourceResult.buildDurationMs)}`,
    `install ${formatReaderDurationSeconds(sourceResult.installDurationMs)}`,
    `package ${formatReaderDurationSeconds(sourceResult.packageInfoDurationMs)}`,
    `launch ${formatReaderDurationSeconds(sourceResult.launchDurationMs)}`,
    `screenshot ${formatReaderDurationSeconds(sourceResult.screenshotDurationMs)}`
  ].join(", ");
}

function formatReaderDurationSeconds(durationMs) {
  return typeof durationMs === "number" ? `${(durationMs / 1000).toFixed(1)}s` : "unknown";
}

function formatReaderCaptureSummary(sourceResult) {
  const dimensions = typeof sourceResult.screenshotWidth === "number" && typeof sourceResult.screenshotHeight === "number"
    ? `${sourceResult.screenshotWidth}x${sourceResult.screenshotHeight}`
    : "unknown";
  const size = typeof sourceResult.screenshotSizeBytes === "number"
    ? `${(sourceResult.screenshotSizeBytes / 1024 / 1024).toFixed(1)} MiB`
    : "unknown";
  const diversity = sourceResult.screenshotDiverseSamples ?? "unknown";
  const sha256 = sourceResult.screenshotSha256 ?? "unknown";
  return `${dimensions}, ${size}, diversity ${diversity}, sha256 ${sha256}`;
}

function formatReaderHostSummary(sourceResult) {
  const host = `${sourceResult.hostPlatform ?? "unknown"}/${sourceResult.hostArch ?? "unknown"}`;
  const node = sourceResult.nodeVersion ?? "unknown";
  const flutterVersion = sourceResult.flutterVersion ?? "unknown";
  const flutterChannel = sourceResult.flutterChannel ?? "unknown";
  const dartVersion = sourceResult.dartVersion ?? "unknown";
  const adbVersion = sourceResult.adbVersion ?? "unknown";
  return `${host}, Node ${node}, Flutter ${flutterVersion} ${flutterChannel}, Dart ${dartVersion}, ADB ${adbVersion}`;
}

function formatReaderBuildSummary(sourceResult) {
  const size = typeof sourceResult.apkSizeBytes === "number"
    ? `${(sourceResult.apkSizeBytes / 1024 / 1024).toFixed(1)} MiB`
    : "unknown";
  const builtAt = sourceResult.apkBuiltAt ?? "unknown";
  const sha256 = sourceResult.apkSha256 ?? "unknown";
  return `APK ${size}, built ${builtAt}, sha256 ${sha256}`;
}

function readRequestedSummaryFieldName(argv) {
  const fieldEqualsArg = argv.find((arg) => arg.startsWith("--summary-field="));
  if (fieldEqualsArg) {
    const requestedValue = fieldEqualsArg.slice("--summary-field=".length);
    return isOptionLikeArgument(requestedValue) ? null : requestedValue;
  }

  const fieldArgIndex = argv.indexOf("--summary-field");
  if (fieldArgIndex === -1) return null;
  const requestedValue = argv[fieldArgIndex + 1] ?? null;
  return isOptionLikeArgument(requestedValue) ? null : requestedValue;
}

function readRequestedPathsFieldName(argv) {
  const fieldEqualsArg = argv.find((arg) => arg.startsWith("--paths-field="));
  if (fieldEqualsArg) {
    const requestedValue = fieldEqualsArg.slice("--paths-field=".length);
    return isOptionLikeArgument(requestedValue) ? null : requestedValue;
  }

  const fieldArgIndex = argv.indexOf("--paths-field");
  if (fieldArgIndex === -1) return null;
  const requestedValue = argv[fieldArgIndex + 1] ?? null;
  return isOptionLikeArgument(requestedValue) ? null : requestedValue;
}

function validateResultSchema(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA\nLatest Android device smoke result must be a JSON object.");
    process.exit(1);
  }
  if (typeof candidate.status !== "string") {
    console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA\nLatest Android device smoke result must include a string status.");
    process.exit(1);
  }
  if (!["failed", "passed"].includes(candidate.status)) {
    console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA\nLatest Android device smoke result status must be passed or failed.");
    process.exit(1);
  }
  if (typeof candidate.runId !== "string" || candidate.runId.length === 0) {
    console.error("TM_ANDROID_DEVICE_SMOKE_RESULT_INVALID_SCHEMA\nLatest Android device smoke result must include a string runId.");
    process.exit(1);
  }
}

function readRequestedPathName(argv) {
  const pathEqualsArg = argv.find((arg) => arg.startsWith("--path="));
  if (pathEqualsArg) {
    const requestedValue = pathEqualsArg.slice("--path=".length);
    return isOptionLikeArgument(requestedValue) ? null : requestedValue;
  }

  const pathArgIndex = argv.indexOf("--path");
  if (pathArgIndex === -1) return null;
  const requestedValue = argv[pathArgIndex + 1] ?? null;
  return isOptionLikeArgument(requestedValue) ? null : requestedValue;
}

function isOptionLikeArgument(value) {
  return !value || value.startsWith("-");
}

function findUnknownOption(argv) {
  const knownOptions = new Set(["--absolute", "--field", "--help", "--json", "--path", "--paths", "--paths-keys", "--paths-field", "--require-existing", "--strict", "--summary-json", "--summary-keys", "--summary-field"]);
  const optionsWithValues = new Set(["--field", "--path", "--paths-field", "--summary-field"]);
  let skipNext = false;
  for (const arg of argv.slice(2)) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (optionsWithValues.has(arg)) {
      skipNext = true;
      continue;
    }
    if (arg.startsWith("--field=") || arg.startsWith("--path=") || arg.startsWith("--summary-field=") || arg.startsWith("--paths-field=")) {
      continue;
    }
    if (arg.startsWith("-") && !knownOptions.has(arg)) {
      return arg;
    }
  }
  return null;
}

function findDuplicateOutputOption(argv) {
  const outputOptions = ["--field", "--json", "--path", "--paths", "--paths-field", "--paths-keys", "--summary-field", "--summary-json", "--summary-keys"];
  return outputOptions.find((option) => countOptionRequests(argv, option) > 1) ?? null;
}

function countOptionRequests(argv, option) {
  return argv.slice(2).filter((arg) => arg === option || arg.startsWith(`${option}=`)).length;
}

function findUnexpectedArgument(argv) {
  const optionsWithValues = new Set(["--field", "--path", "--paths-field", "--summary-field"]);
  let skipNext = false;
  for (const arg of argv.slice(2)) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (optionsWithValues.has(arg)) {
      skipNext = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      return arg;
    }
  }
  return null;
}

function formatUnexpectedArgumentHint(argument) {
  if (artifactPathTargets.includes(argument)) {
    return `Use --path ${argument} if you meant to read a saved artifact path.`;
  }
  return `Use --field ${argument} if you meant to read a top-level result field.`;
}

function buildResultSummary(sourceResult) {
  return {
    schemaVersion: sourceResult.schemaVersion ?? null,
    command: sourceResult.command ?? null,
    status: sourceResult.status,
    runId: sourceResult.runId,
    startedAt: sourceResult.startedAt ?? null,
    completedAt: sourceResult.completedAt ?? null,
    durationMs: sourceResult.durationMs ?? null,
    deviceSerial: sourceResult.deviceSerial ?? null,
    deviceManufacturer: sourceResult.deviceManufacturer ?? null,
    deviceBrand: sourceResult.deviceBrand ?? null,
    deviceModel: sourceResult.deviceModel ?? null,
    androidRelease: sourceResult.androidRelease ?? null,
    androidSdk: sourceResult.androidSdk ?? null,
    screenPhysicalSize: sourceResult.screenPhysicalSize ?? null,
    screenDensityDpi: sourceResult.screenDensityDpi ?? null,
    deviceSelectionMode: sourceResult.deviceSelectionMode ?? null,
    requestedDeviceSerial: sourceResult.requestedDeviceSerial ?? null,
    authorizedDeviceCount: sourceResult.authorizedDeviceCount ?? null,
    deviceProbeDurationMs: sourceResult.deviceProbeDurationMs ?? null,
    packageName: sourceResult.packageName ?? null,
    foregroundPackage: sourceResult.foregroundPackage ?? null,
    foregroundActivity: sourceResult.foregroundActivity ?? null,
    installedVersionName: sourceResult.installedVersionName ?? null,
    installedVersionCode: sourceResult.installedVersionCode ?? null,
    flutterVersion: sourceResult.flutterVersion ?? null,
    flutterChannel: sourceResult.flutterChannel ?? null,
    dartVersion: sourceResult.dartVersion ?? null,
    hostPlatform: sourceResult.hostPlatform ?? null,
    hostArch: sourceResult.hostArch ?? null,
    nodeVersion: sourceResult.nodeVersion ?? null,
    flutterCommand: sourceResult.flutterCommand ?? null,
    adbCommand: sourceResult.adbCommand ?? null,
    adbVersion: sourceResult.adbVersion ?? null,
    toolchainProbeDurationMs: sourceResult.toolchainProbeDurationMs ?? null,
    renderWaitMs: sourceResult.renderWaitMs ?? null,
    renderWaitSource: sourceResult.renderWaitSource ?? null,
    buildDurationMs: sourceResult.buildDurationMs ?? null,
    installDurationMs: sourceResult.installDurationMs ?? null,
    packageInfoDurationMs: sourceResult.packageInfoDurationMs ?? null,
    launchDurationMs: sourceResult.launchDurationMs ?? null,
    screenshotDurationMs: sourceResult.screenshotDurationMs ?? null,
    apkBuiltAt: sourceResult.apkBuiltAt ?? null,
    apkSizeBytes: sourceResult.apkSizeBytes ?? null,
    apkSha256: sourceResult.apkSha256 ?? null,
    apkPath: formatArtifactPath(sourceResult.apkPath ?? "none"),
    latestPath: formatArtifactPath(path.relative(root, resultPath)),
    latestScreenshotPath: formatOptionalArtifactPath(sourceResult.screenshotPath ?? null),
    resultStatus: sourceResult.currentRunResultStatus ?? null,
    currentRunResultStatus: sourceResult.currentRunResultStatus ?? null,
    runResultArchived: sourceResult.runResultArchived ?? null,
    runResultPath: formatOptionalArtifactPath(sourceResult.runResultPath ?? null),
    currentRunResultPath: formatOptionalArtifactPath(sourceResult.currentRunResultPath ?? null),
    resultPath: formatOptionalArtifactPath(sourceResult.currentRunResultPath ?? sourceResult.runResultPath ?? null),
    screenshotStatus: sourceResult.currentRunScreenshotStatus ?? null,
    currentRunScreenshotStatus: sourceResult.currentRunScreenshotStatus ?? null,
    runScreenshotPath: formatOptionalArtifactPath(sourceResult.runScreenshotPath ?? null),
    currentRunScreenshotPath: formatOptionalArtifactPath(sourceResult.currentRunScreenshotPath ?? null),
    screenshotPath: formatOptionalArtifactPath(sourceResult.currentRunScreenshotPath ?? sourceResult.screenshotPath ?? null),
    screenshotWidth: sourceResult.screenshotWidth ?? null,
    screenshotHeight: sourceResult.screenshotHeight ?? null,
    screenshotSizeBytes: sourceResult.screenshotSizeBytes ?? null,
    screenshotDiverseSamples: sourceResult.screenshotDiverseSamples ?? null,
    screenshotSha256: sourceResult.screenshotSha256 ?? null,
    screenshotCapturedAt: sourceResult.screenshotCapturedAt ?? null,
    screenshotCapturedForRun: sourceResult.screenshotCapturedForRun ?? null,
    runScreenshotArchived: sourceResult.runScreenshotArchived ?? null,
    latestScreenshotMayBeStale: sourceResult.latestScreenshotMayBeStale ?? null,
    failedStage: sourceResult.failedStage ?? null,
    error: sourceResult.error ?? null,
    errorCode: sourceResult.errorCode ?? null,
    errorDetail: sourceResult.errorDetail ?? null,
    recoveryHintCode: sourceResult.recoveryHintCode ?? null,
    recoveryHint: sourceResult.recoveryHint ?? null
  };
}

function buildArtifactPaths(sourceResult) {
  return {
    apk: formatArtifactPath(sourceResult.apkPath ?? "none"),
    latest: formatArtifactPath(path.relative(root, resultPath)),
    latestScreenshot: formatArtifactPath(sourceResult.screenshotPath ?? path.join(".thai-meet", "device-smoke", "latest.png")),
    currentResult: formatArtifactPath(sourceResult.currentRunResultPath ?? "none"),
    currentScreenshot: formatArtifactPath(sourceResult.currentRunScreenshotPath ?? "none"),
    runResult: formatArtifactPath(sourceResult.runResultPath ?? "none"),
    runScreenshot: formatArtifactPath(sourceResult.runScreenshotPath ?? "none"),
    result: formatArtifactPath(sourceResult.currentRunResultPath ?? sourceResult.runResultPath ?? path.relative(root, resultPath)),
    screenshot: formatArtifactPath(sourceResult.currentRunScreenshotPath ?? sourceResult.screenshotPath ?? "none")
  };
}

async function assertArtifactExists(artifactPath, requestedTargetName) {
  if (!shouldRequireExistingArtifact) return;
  if (artifactPath === "none") {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING\nNo saved ${requestedTargetName} artifact path is available.`);
    process.exit(1);
  }
  try {
    await access(path.resolve(root, artifactPath));
  } catch {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_ARTIFACT_MISSING\nSaved ${requestedTargetName} artifact does not exist: ${artifactPath}`);
    process.exit(1);
  }
}

async function assertAllArtifactsExist(artifactPaths) {
  if (!shouldRequireExistingArtifact) return;
  for (const [targetName, artifactPath] of Object.entries(artifactPaths)) {
    await assertArtifactExists(artifactPath, targetName);
  }
}

async function assertSummaryArtifactsExist(resultSummary) {
  if (!shouldRequireExistingArtifact) return;
  await assertArtifactExists(resultSummary.apkPath ?? "none", "apk");
  await assertArtifactExists(resultSummary.latestPath ?? "none", "latest");
  await assertArtifactExists(resultSummary.latestScreenshotPath ?? "none", "latest screenshot");
  await assertArtifactExists(resultSummary.runResultPath ?? "none", "per-run result");
  await assertArtifactExists(resultSummary.currentRunResultPath ?? "none", "current-run result");
  await assertArtifactExists(resultSummary.resultPath ?? "none", "result");
  await assertArtifactExists(resultSummary.runScreenshotPath ?? "none", "per-run screenshot");
  await assertArtifactExists(resultSummary.currentRunScreenshotPath ?? "none", "current-run screenshot");
  await assertArtifactExists(resultSummary.screenshotPath ?? "none", "screenshot");
}

async function assertSummaryFieldArtifactExists(fieldName, fieldValue) {
  if (!shouldRequireExistingArtifact) return;
  if (!fieldName.endsWith("Path")) {
    console.error(`TM_ANDROID_DEVICE_SMOKE_RESULT_SUMMARY_FIELD_NOT_ARTIFACT\n${fieldName} is not an artifact path field.`);
    process.exit(1);
  }
  await assertArtifactExists(fieldValue ?? "none", fieldName);
}

function formatArtifactPath(artifactPath) {
  if (!shouldPrintAbsolutePath || artifactPath === "none") return artifactPath;
  return path.resolve(root, artifactPath);
}

function formatOptionalArtifactPath(artifactPath) {
  if (!artifactPath) return null;
  return formatArtifactPath(artifactPath);
}

function printUsage() {
  console.log("Usage: npm run mobile:device:result -- [--json | --summary-json | --summary-keys | --summary-field <name> | --field <name> | --path apk|screenshot|latest-screenshot|current-result|current-screenshot|run-result|run-screenshot|result|latest | --paths | --paths-keys | --paths-field <name>] [--absolute] [--require-existing] [--strict]");
  console.log("");
  console.log("Options:");
  console.log("  --json         Print the saved latest Android device smoke JSON.");
  console.log("  --summary-json Print a compact machine-readable result summary.");
  console.log("  --summary-keys Print the compact summary field names as a JSON array.");
  console.log("  --summary-field NAME  Print one compact summary field.");
  console.log("  --field NAME   Print one top-level saved result field.");
  console.log("  --path TARGET  Print a saved artifact path: apk, screenshot, latest-screenshot, current-result, current-screenshot, run-result, run-screenshot, result, or latest.");
  console.log("  --paths        Print saved artifact paths as JSON.");
  console.log("  --paths-keys   Print the saved artifact path field names as a JSON array.");
  console.log("  --paths-field NAME  Print one saved artifact path field.");
  console.log("  --absolute     Print --summary-json, --summary-field, --path, --paths, or --paths-field output paths as absolute filesystem paths.");
  console.log("  --require-existing  Fail unless the --summary-json, --summary-field, --path, --paths, or --paths-field artifacts exist on disk.");
  console.log("  --strict       Exit nonzero unless the latest saved result is passed.");
  console.log("  --help         Show this help.");
}
