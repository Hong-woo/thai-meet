import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { existsSync } from "node:fs";
import { access, copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { inflateSync } from "node:zlib";

const root = process.cwd();
const mobileDir = path.join(root, "apps", "mobile");
const apkPath = path.join(mobileDir, "build", "app", "outputs", "flutter-apk", "app-debug.apk");
const screenshotDir = path.join(root, ".thai-meet", "device-smoke");
const runResultDir = path.join(screenshotDir, "runs");
const screenshotPath = path.join(screenshotDir, "latest.png");
const resultPath = path.join(screenshotDir, "latest.json");
const packageName = "com.example.thai_meet_mobile";
const launchCategory = "android.intent.category.LAUNCHER";
const renderWaitMs = Number.parseInt(process.env.ANDROID_DEVICE_SMOKE_RENDER_WAIT_MS ?? "7000", 10);
const renderWaitSource = process.env.ANDROID_DEVICE_SMOKE_RENDER_WAIT_MS ? "ANDROID_DEVICE_SMOKE_RENDER_WAIT_MS" : "default";
const flutter = resolveFlutterCommand();
const adb = resolveAdbCommand();
const startedAt = new Date();
const runId = formatRunId(startedAt);
const runResultPath = path.join(runResultDir, `${runId}.json`);
const runScreenshotPath = path.join(runResultDir, `${runId}.png`);
const requestedDeviceSerial = process.env.ANDROID_SERIAL ?? null;
const deviceSelectionMode = requestedDeviceSerial ? "ANDROID_SERIAL" : "auto";
let authorizedDeviceCount = null;
let selectedDevice = null;
let flutterBuildInfo = null;
let adbVersion = null;
let toolchainProbeDurationMs = null;
let buildDurationMs = null;
let deviceProbeDurationMs = null;
let apkBuiltAt = null;
let apkSizeBytes = null;
let apkSha256 = null;
let screenshotCapturedAt = null;
let screenshotDurationMs = null;
let screenshotSizeBytes = null;
let screenshotSha256 = null;
let screenshotWidth = null;
let screenshotHeight = null;
let screenshotDiverseSamples = null;
let screenshotCapturedForRun = false;
let runScreenshotArchived = false;
let currentRunScreenshotPath = null;
let failedStage = null;

try {
  failedStage = "build";
  const toolchainProbeStartedAt = Date.now();
  flutterBuildInfo = await readFlutterBuildInfo();
  adbVersion = await readAdbVersion();
  toolchainProbeDurationMs = Date.now() - toolchainProbeStartedAt;
  const buildStartedAt = Date.now();
  await run(flutter, ["build", "apk", "--debug"], {
    cwd: mobileDir,
    label: "flutter build apk --debug"
  });
  buildDurationMs = Date.now() - buildStartedAt;
  await access(apkPath);
  const apkStat = await stat(apkPath);
  apkBuiltAt = apkStat.mtime;
  apkSizeBytes = apkStat.size;
  apkSha256 = sha256Hex(await readFile(apkPath));

  failedStage = "device";
  const deviceProbeStartedAt = Date.now();
  const devices = await run(adb, ["devices"], {
    cwd: root,
    label: "adb devices",
    capture: true
  });
  const authorizedDevices = parseAuthorizedDevices(devices.stdout);
  authorizedDeviceCount = authorizedDevices.length;
  deviceProbeDurationMs = Date.now() - deviceProbeStartedAt;
  selectedDevice = selectDevice(authorizedDevices);
  const deviceInfo = await readDeviceInfo(selectedDevice);
  const screenInfo = await readScreenInfo(selectedDevice);
  deviceProbeDurationMs = Date.now() - deviceProbeStartedAt;

  failedStage = "install";
  const installStartedAt = Date.now();
  await run(adb, ["-s", selectedDevice, "install", "-r", "-t", apkPath], {
    cwd: root,
    label: "adb install -r -t"
  });
  const installDurationMs = Date.now() - installStartedAt;
  const packageInfoStartedAt = Date.now();
  const installedPackageInfo = await readInstalledPackageInfo(selectedDevice);
  const packageInfoDurationMs = Date.now() - packageInfoStartedAt;
  failedStage = "launch";
  const launchStartedAt = Date.now();
  await run(adb, ["-s", selectedDevice, "shell", "input", "keyevent", "KEYCODE_WAKEUP"], {
    cwd: root,
    label: "wake device"
  });
  await run(adb, ["-s", selectedDevice, "shell", "wm", "dismiss-keyguard"], {
    cwd: root,
    label: "dismiss-keyguard"
  });
  await run(adb, ["-s", selectedDevice, "shell", "monkey", "-p", packageName, "-c", launchCategory, "1"], {
    cwd: root,
    label: "monkey -p"
  });
  await sleep(Number.isFinite(renderWaitMs) ? renderWaitMs : 7000);
  const foreground = await assertForegroundPackage(selectedDevice);
  const launchDurationMs = Date.now() - launchStartedAt;
  failedStage = "screenshot";
  await mkdir(screenshotDir, { recursive: true });
  const screenshotStartedAt = Date.now();
  await runToFile(adb, ["-s", selectedDevice, "exec-out", "screencap", "-p"], screenshotPath, {
    cwd: root,
    label: "screencap -p"
  });
  screenshotCapturedForRun = true;
  screenshotCapturedAt = new Date();
  screenshotSizeBytes = (await stat(screenshotPath)).size;
  screenshotSha256 = sha256Hex(await readFile(screenshotPath));
  const screenshotMetrics = await validatePngScreenshot(screenshotPath);
  screenshotWidth = screenshotMetrics.width;
  screenshotHeight = screenshotMetrics.height;
  screenshotDiverseSamples = screenshotMetrics.diverseSamples;
  await mkdir(runResultDir, { recursive: true });
  await copyFile(screenshotPath, runScreenshotPath);
  runScreenshotArchived = true;
  currentRunScreenshotPath = path.relative(root, runScreenshotPath);
  screenshotDurationMs = Date.now() - screenshotStartedAt;
  const completedAt = new Date();
  const durationMs = completedAt.getTime() - startedAt.getTime();
  await writeDeviceSmokeResult({
    status: "passed",
    toolchainProbeDurationMs,
    deviceProbeDurationMs,
    authorizedDeviceCount,
    deviceSelectionMode,
    deviceSerial: selectedDevice,
    deviceManufacturer: deviceInfo.deviceManufacturer,
    deviceBrand: deviceInfo.deviceBrand,
    deviceModel: deviceInfo.deviceModel,
    androidRelease: deviceInfo.androidRelease,
    androidSdk: deviceInfo.androidSdk,
    screenPhysicalSize: screenInfo.screenPhysicalSize,
    screenDensityDpi: screenInfo.screenDensityDpi,
    adbVersion,
    apkBuiltAt,
    buildDurationMs,
    installDurationMs,
    launchDurationMs,
    packageInfoDurationMs,
    apkSha256,
    apkSizeBytes,
    flutterVersion: flutterBuildInfo.flutterVersion,
    flutterChannel: flutterBuildInfo.flutterChannel,
    dartVersion: flutterBuildInfo.dartVersion,
    installedVersionName: installedPackageInfo.installedVersionName,
    installedVersionCode: installedPackageInfo.installedVersionCode,
    foregroundPackage: foreground.foregroundPackage,
    foregroundActivity: foreground.foregroundActivity,
    screenshotCapturedAt,
    screenshotDurationMs,
    screenshotSha256,
    screenshotSizeBytes,
    screenshotWidth,
    screenshotHeight,
    screenshotDiverseSamples,
    screenshotCapturedForRun,
    runScreenshotArchived,
    startedAt,
    completedAt,
    durationMs
  });
  await verifyArchivedArtifacts();

  console.log(`Gate 0 Android device smoke OK: ${packageName} launched on ${selectedDevice}`);
  console.log(`Duration: ${formatDurationSeconds(durationMs)}`);
  console.log(`Device: ${formatDeviceSummary(deviceInfo, screenInfo)}`);
  console.log(`App: ${formatAppSummary(foreground, installedPackageInfo)}`);
  console.log(`Build: ${formatBuildSummary(flutterBuildInfo, apkSizeBytes, apkSha256)}`);
  console.log(`Timings: ${formatTimingSummary({
    buildDurationMs,
    installDurationMs,
    launchDurationMs,
    packageInfoDurationMs,
    screenshotDurationMs
  })}`);
  console.log(`Capture: ${formatCaptureSummary({
    screenshotWidth,
    screenshotHeight,
    screenshotSizeBytes,
    screenshotDiverseSamples,
    screenshotSha256
  })}`);
  console.log(`Run: ${formatRunSummary({
    runId,
    renderWaitMs: Number.isFinite(renderWaitMs) ? renderWaitMs : 7000,
    renderWaitSource,
    deviceSelectionMode,
    authorizedDeviceCount
  })}`);
  console.log(`Artifacts: ${formatArtifactSummary({
    currentRunResultStatus: "archived",
    currentRunScreenshotStatus: formatCurrentRunScreenshotStatus({
      screenshotCapturedForRun,
      runScreenshotArchived
    })
  })}`);
  console.log(`Host: ${formatHostSummary({
    hostPlatform: process.platform,
    hostArch: process.arch,
    nodeVersion: process.version,
    flutterCommand: flutter,
    adbCommand: adb,
    adbVersion
  })}`);
  console.log(`Screenshot: ${path.relative(root, screenshotPath)}`);
  console.log(`Result: ${path.relative(root, resultPath)}`);
  console.log(`Archive Screenshot: ${path.relative(root, runScreenshotPath)}`);
  console.log(`Archive Result: ${path.relative(root, runResultPath)}`);
} catch (error) {
  const completedAt = new Date();
  const durationMs = completedAt.getTime() - startedAt.getTime();
  const errorCode = extractErrorCode(error);
  const errorDetail = extractErrorDetail(error);
  const recoveryHintCode = formatRecoveryHintCode(errorCode);
  const recoveryHint = formatRecoveryHint(errorCode);
  await writeDeviceSmokeResult({
    status: "failed",
    failedStage,
    errorCode,
    errorDetail,
    recoveryHintCode,
    recoveryHint,
    error: error.message,
    startedAt,
    completedAt,
    durationMs
  });
  await verifyArchivedResult();
  console.error(`Failure Stage: ${failedStage ?? "unknown"}`);
  console.error(`Failure Code: ${errorCode}`);
  console.error(`Failure Detail: ${errorDetail ?? "none"}`);
  console.error(`Failure Hint Code: ${recoveryHintCode ?? "none"}`);
  console.error(`Failure Hint: ${recoveryHint ?? "none"}`);
  console.error(`Failure Duration: ${formatDurationSeconds(durationMs)}`);
  console.error(`Failure Timings: ${formatFailureTimingSummary({
    toolchainProbeDurationMs,
    buildDurationMs,
    deviceProbeDurationMs
  })}`);
  console.error(`Failure Run: ${runId}`);
  console.error(`Failure Config: ${formatFailureConfigSummary({
    renderWaitMs: Number.isFinite(renderWaitMs) ? renderWaitMs : 7000,
    renderWaitSource,
    deviceSelectionMode,
    authorizedDeviceCount
  })}`);
  console.error(`Failure Device: ${formatFailureDeviceSummary({
    deviceSelectionMode,
    requestedDeviceSerial,
    authorizedDeviceCount,
    selectedDevice
  })}`);
  console.error(`Failure Build: ${formatFailureBuildSummary({
    flutterBuildInfo,
    apkSizeBytes,
    apkSha256
  })}`);
  console.error(`Failure Capture: ${formatFailureCaptureSummary({
    screenshotCapturedAt,
    screenshotDurationMs,
    screenshotSizeBytes,
    screenshotSha256,
    screenshotWidth,
    screenshotHeight,
    screenshotDiverseSamples
  })}`);
  console.error(`Failure Screenshot: ${formatFailureScreenshotSummary({
    screenshotCapturedForRun,
    runScreenshotArchived
  })}`);
  console.error(`Failure Artifacts: ${formatFailureArtifactSummary({
    currentRunResultStatus: "archived",
    currentRunScreenshotStatus: formatCurrentRunScreenshotStatus({
      screenshotCapturedForRun,
      runScreenshotArchived
    })
  })}`);
  console.error(`Failure Host: ${formatFailureHostSummary({
    hostPlatform: process.platform,
    hostArch: process.arch,
    nodeVersion: process.version,
    flutterCommand: flutter,
    adbCommand: adb,
    adbVersion
  })}`);
  console.error(`Failure Result: ${path.relative(root, resultPath)}`);
  console.error(`Failure Archive Result: ${path.relative(root, runResultPath)}`);
  console.error(error.message);
  process.exit(1);
}

function sha256Hex(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function extractErrorCode(error) {
  const firstLine = String(error?.message ?? error)
    .split(/\r?\n/)
    .find(Boolean)
    ?.trim();
  if (firstLine?.startsWith("TM_")) return firstLine;
  return error?.name ?? "Error";
}

function extractErrorDetail(error) {
  const lines = String(error?.message ?? error)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(1).join(" ") || null;
}

function formatRecoveryHintCode(errorCode) {
  switch (errorCode) {
    case "TM_ANDROID_DEVICE_SMOKE_DEVICE_NOT_FOUND":
      return "check-device-serial";
    case "TM_ANDROID_DEVICE_SMOKE_NO_DEVICE":
      return "connect-authorized-device";
    case "TM_ANDROID_DEVICE_SMOKE_MULTIPLE_DEVICES":
      return "set-android-serial";
    case "TM_ANDROID_DEVICE_SMOKE_FOREGROUND_MISMATCH":
      return "unlock-and-relaunch";
    case "TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT":
    case "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT":
      return "unlock-render-and-retry";
    default:
      return null;
  }
}

function formatRecoveryHint(errorCode) {
  switch (errorCode) {
    case "TM_ANDROID_DEVICE_SMOKE_DEVICE_NOT_FOUND":
      return "Check that the phone is connected, USB debugging is enabled, the authorization prompt is accepted, and ANDROID_SERIAL matches an authorized adb device.";
    case "TM_ANDROID_DEVICE_SMOKE_NO_DEVICE":
      return "Connect one Android phone with USB debugging enabled, then confirm it appears as authorized in adb devices.";
    case "TM_ANDROID_DEVICE_SMOKE_MULTIPLE_DEVICES":
      return "Set ANDROID_SERIAL to the target authorized device serial before running npm run mobile:device:smoke.";
    case "TM_ANDROID_DEVICE_SMOKE_FOREGROUND_MISMATCH":
      return "Unlock the phone, close overlays, then rerun the smoke so the launched app can become the foreground package.";
    case "TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT":
    case "TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT":
      return "Wake and unlock the phone, confirm the app is visible, then rerun the smoke with a longer ANDROID_DEVICE_SMOKE_RENDER_WAIT_MS if rendering is slow.";
    default:
      return null;
  }
}

async function readFlutterBuildInfo() {
  const result = await run(flutter, ["--version", "--machine"], {
    cwd: root,
    label: "flutter --version --machine",
    capture: true
  });

  try {
    const version = JSON.parse(result.stdout);
    return {
      flutterVersion: version.frameworkVersion ?? "unknown",
      flutterChannel: version.channel ?? "unknown",
      dartVersion: version.dartSdkVersion ?? "unknown"
    };
  } catch {
    return {
      flutterVersion: "unknown",
      flutterChannel: "unknown",
      dartVersion: "unknown"
    };
  }
}

async function readAdbVersion() {
  const result = await run(adb, ["version"], {
    cwd: root,
    label: "adb version",
    capture: true
  });

  return result.stdout.split(/\r?\n/).find(Boolean)?.trim() ?? "unknown";
}

function resolveAdbCommand() {
  const candidates = [
    process.env.ADB,
    process.env.ANDROID_HOME ? path.join(process.env.ANDROID_HOME, "platform-tools", adbFileName()) : null,
    process.env.ANDROID_SDK_ROOT ? path.join(process.env.ANDROID_SDK_ROOT, "platform-tools", adbFileName()) : null,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk", "platform-tools", adbFileName()) : null
  ].filter(Boolean);

  return firstExistingCommand(candidates, "adb");
}

function resolveFlutterCommand() {
  const candidates = [
    process.env.FLUTTER,
    process.env.FLUTTER_ROOT ? path.join(process.env.FLUTTER_ROOT, "bin", flutterFileName()) : null,
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, "develop", "flutter", "bin", flutterFileName()) : null
  ].filter(Boolean);

  return firstExistingCommand(candidates, "flutter");
}

function firstExistingCommand(candidates, fallback) {
  for (const candidate of candidates) {
    if (!path.isAbsolute(candidate) || existsSync(candidate)) return candidate;
  }

  return fallback;
}

function adbFileName() {
  return process.platform === "win32" ? "adb.exe" : "adb";
}

function flutterFileName() {
  return process.platform === "win32" ? "flutter.bat" : "flutter";
}

function parseAuthorizedDevices(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter(([serial, state]) => serial && state === "device")
    .map(([serial]) => serial);
}

function selectDevice(devices) {
  if (devices.length === 0) {
    throw new Error(
      "TM_ANDROID_DEVICE_SMOKE_NO_AUTHORIZED_DEVICE\nNo authorized Android device found. Enable USB debugging, accept the phone prompt, then rerun npm run mobile:device:smoke."
    );
  }

  if (!process.env.ANDROID_SERIAL) return devices[0];

  if (!devices.includes(process.env.ANDROID_SERIAL)) {
    throw new Error(`TM_ANDROID_DEVICE_SMOKE_DEVICE_NOT_FOUND\nANDROID_SERIAL=${process.env.ANDROID_SERIAL} is not authorized.`);
  }

  return process.env.ANDROID_SERIAL;
}

async function readDeviceInfo(selectedDevice) {
  const [manufacturer, brand, model, release, sdk] = await Promise.all([
    readDeviceProp(selectedDevice, "ro.product.manufacturer"),
    readDeviceProp(selectedDevice, "ro.product.brand"),
    readDeviceProp(selectedDevice, "ro.product.model"),
    readDeviceProp(selectedDevice, "ro.build.version.release"),
    readDeviceProp(selectedDevice, "ro.build.version.sdk")
  ]);

  return {
    deviceManufacturer: manufacturer || "unknown",
    deviceBrand: brand || "unknown",
    deviceModel: model || "unknown",
    androidRelease: release || "unknown",
    androidSdk: sdk || "unknown"
  };
}

async function readScreenInfo(selectedDevice) {
  const [size, density] = await Promise.all([
    readShellLine(selectedDevice, ["wm", "size"], "wm size"),
    readShellLine(selectedDevice, ["wm", "density"], "wm density")
  ]);

  return {
    screenPhysicalSize: extractShellValue(size, /Physical size:\s*(.+)/),
    screenDensityDpi: extractShellValue(density, /Physical density:\s*(\d+)/)
  };
}

async function readShellLine(selectedDevice, shellArgs, label) {
  const result = await run(adb, ["-s", selectedDevice, "shell", ...shellArgs], {
    cwd: root,
    label,
    capture: true
  });

  return result.stdout.trim();
}

function extractShellValue(output, pattern) {
  return output.match(pattern)?.[1]?.trim() ?? "unknown";
}

async function readDeviceProp(selectedDevice, propName) {
  const result = await run(adb, ["-s", selectedDevice, "shell", "getprop", propName], {
    cwd: root,
    label: `getprop ${propName}`,
    capture: true
  });

  return result.stdout.trim();
}

async function readInstalledPackageInfo(selectedDevice) {
  const result = await run(adb, ["-s", selectedDevice, "shell", "dumpsys", "package", packageName], {
    cwd: root,
    label: "dumpsys package",
    capture: true
  });

  return {
    installedVersionName: extractPackageValue(result.stdout, /versionName=([^\s]+)/),
    installedVersionCode: extractPackageValue(result.stdout, /versionCode=([^\s]+)/)
  };
}

function extractPackageValue(output, pattern) {
  return output.match(pattern)?.[1] ?? "unknown";
}

function run(command, args, options = {}) {
  const label = options.label ?? [command, ...args].join(" ");
  return new Promise((resolve, reject) => {
    const invocation = commandInvocation(command, args);
    const child = spawn(invocation.command, invocation.args, {
      cwd: options.cwd ?? root,
      shell: false,
      stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
    });
    let stdout = "";
    let stderr = "";

    if (options.capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", (error) => {
      reject(new Error(`TM_ANDROID_DEVICE_SMOKE_COMMAND_UNAVAILABLE\n${label} failed to start: ${error.message}`));
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`TM_ANDROID_DEVICE_SMOKE_COMMAND_FAILED\n${label} exited with ${code}${stderr ? `\n${stderr}` : ""}`));
    });
  });
}

function runToFile(command, args, filePath, options = {}) {
  const label = options.label ?? [command, ...args].join(" ");
  return new Promise((resolve, reject) => {
    let settled = false;
    let exitCode = null;
    let outputFinished = false;
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const output = createWriteStream(filePath);
    let stderr = "";

    child.stdout.pipe(output);
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    output.on("finish", () => {
      outputFinished = true;
      maybeFinish();
    });
    output.on("error", (error) => {
      fail(new Error(`TM_ANDROID_DEVICE_SMOKE_COMMAND_FAILED\n${label} could not write ${path.relative(root, filePath)}: ${error.message}`));
    });
    child.on("error", (error) => {
      output.destroy();
      fail(new Error(`TM_ANDROID_DEVICE_SMOKE_COMMAND_UNAVAILABLE\n${label} failed to start: ${error.message}`));
    });
    child.on("exit", (code) => {
      exitCode = code;
      if (code === 0) {
        maybeFinish();
        return;
      }
      output.destroy();
      fail(new Error(`TM_ANDROID_DEVICE_SMOKE_COMMAND_FAILED\n${label} exited with ${code}${stderr ? `\n${stderr}` : ""}`));
    });

    function maybeFinish() {
      if (settled || exitCode !== 0 || !outputFinished) return;
      settled = true;
      resolve();
    }

    function fail(error) {
      if (settled) return;
      settled = true;
      reject(error);
    }
  });
}

function commandInvocation(command, args) {
  if (process.platform === "win32" && /\.(bat|cmd)$/i.test(command)) {
    return {
      command: process.env.ComSpec ?? "cmd.exe",
      args: ["/d", "/c", "call", command, ...args]
    };
  }

  return { command, args };
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function assertForegroundPackage(selectedDevice) {
  const focus = await run(adb, ["-s", selectedDevice, "shell", "dumpsys", "window"], {
    cwd: root,
    label: "dumpsys window",
    capture: true
  });
  const foregroundPackage = extractForegroundPackage(focus.stdout);
  if (foregroundPackage !== packageName) {
    throw new Error(
      `TM_ANDROID_DEVICE_SMOKE_FOREGROUND_MISMATCH\nExpected ${packageName} in foreground, got ${foregroundPackage || "unknown"}.`
    );
  }

  return {
    foregroundPackage,
    foregroundActivity: extractForegroundActivity(focus.stdout)
  };
}

function extractForegroundPackage(output) {
  const focusLine = output
    .split(/\r?\n/)
    .find((line) => line.includes("mCurrentFocus") || line.includes("mFocusedApp") || line.includes("topResumedActivity"));
  if (!focusLine) return null;

  return focusLine.includes(packageName) ? packageName : null;
}

function extractForegroundActivity(output) {
  const focusLine = output
    .split(/\r?\n/)
    .find((line) => line.includes("mCurrentFocus") || line.includes("mFocusedApp") || line.includes("topResumedActivity"));
  if (!focusLine) return "unknown";

  return focusLine.match(new RegExp(`${escapeRegExp(packageName)}/([^\\s}\\]]+)`))?.[1] ?? "unknown";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatRunId(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function formatDurationSeconds(durationMs) {
  return `${(durationMs / 1000).toFixed(1)}s`;
}

function formatDeviceSummary(deviceInfo, screenInfo) {
  return `${deviceInfo.deviceBrand} ${deviceInfo.deviceModel}, Android ${deviceInfo.androidRelease} (API ${deviceInfo.androidSdk}), ${screenInfo.screenPhysicalSize} @ ${screenInfo.screenDensityDpi} dpi`;
}

function formatAppSummary(foreground, installedPackageInfo) {
  return `${foreground.foregroundPackage}/${foreground.foregroundActivity}, version ${installedPackageInfo.installedVersionName} (${installedPackageInfo.installedVersionCode})`;
}

function formatBuildSummary(flutterBuildInfo, apkSizeBytes, apkSha256) {
  return `Flutter ${flutterBuildInfo.flutterVersion} ${flutterBuildInfo.flutterChannel}, Dart ${flutterBuildInfo.dartVersion}, APK ${formatBytes(apkSizeBytes)}, sha256 ${apkSha256.slice(0, 12)}`;
}

function formatTimingSummary(timings) {
  return `build ${formatDurationSeconds(timings.buildDurationMs)}, install ${formatDurationSeconds(timings.installDurationMs)}, package ${formatDurationSeconds(timings.packageInfoDurationMs)}, launch ${formatDurationSeconds(timings.launchDurationMs)}, screenshot ${formatDurationSeconds(timings.screenshotDurationMs)}`;
}

function formatCaptureSummary(capture) {
  return `${capture.screenshotWidth}x${capture.screenshotHeight}, ${formatBytes(capture.screenshotSizeBytes)}, diversity ${capture.screenshotDiverseSamples}, sha256 ${capture.screenshotSha256.slice(0, 12)}`;
}

function formatRunSummary(run) {
  return `${run.runId}, wait ${formatDurationSeconds(run.renderWaitMs)} from ${run.renderWaitSource}, device ${run.deviceSelectionMode}, authorized ${run.authorizedDeviceCount}`;
}

function formatArtifactSummary(artifacts) {
  return `result ${artifacts.currentRunResultStatus}, screenshot ${artifacts.currentRunScreenshotStatus}`;
}

function formatFailureDeviceSummary(device) {
  return `mode ${device.deviceSelectionMode}, requested ${device.requestedDeviceSerial ?? "none"}, selected ${device.selectedDevice ?? "none"}, authorized ${device.authorizedDeviceCount ?? "unknown"}`;
}

function formatFailureBuildSummary(build) {
  if (!build.flutterBuildInfo || !build.apkSizeBytes || !build.apkSha256) return "unavailable";
  return formatBuildSummary(build.flutterBuildInfo, build.apkSizeBytes, build.apkSha256);
}

function formatFailureCaptureSummary(capture) {
  if (!capture.screenshotCapturedAt && !Number.isFinite(capture.screenshotDurationMs) && !capture.screenshotSizeBytes && !capture.screenshotSha256 && !Number.isFinite(capture.screenshotWidth) && !Number.isFinite(capture.screenshotHeight) && !Number.isFinite(capture.screenshotDiverseSamples)) {
    return "unavailable";
  }

  const dimensions = Number.isFinite(capture.screenshotWidth) && Number.isFinite(capture.screenshotHeight)
    ? `${capture.screenshotWidth}x${capture.screenshotHeight}`
    : "pending";
  const size = Number.isFinite(capture.screenshotSizeBytes) ? formatBytes(capture.screenshotSizeBytes) : "pending";
  const diversity = Number.isFinite(capture.screenshotDiverseSamples) ? capture.screenshotDiverseSamples : "pending";
  const sha = capture.screenshotSha256 ? capture.screenshotSha256.slice(0, 12) : "pending";
  const capturedAt = capture.screenshotCapturedAt ? capture.screenshotCapturedAt.toISOString() : "pending";
  return `${dimensions}, ${size}, diversity ${diversity}, sha256 ${sha}, duration ${formatMaybeDuration(capture.screenshotDurationMs)}, captured ${capturedAt}`;
}

function formatFailureScreenshotSummary(screenshot) {
  if (!screenshot.screenshotCapturedForRun) return "not captured for this run";
  const archivePath = screenshot.runScreenshotArchived ? path.relative(root, runScreenshotPath) : "not archived";
  return `captured ${path.relative(root, screenshotPath)}, archive ${archivePath}`;
}

function formatFailureArtifactSummary(artifacts) {
  return formatArtifactSummary(artifacts);
}

function formatFailureTimingSummary(timings) {
  return `toolchain ${formatMaybeDuration(timings.toolchainProbeDurationMs)}, build ${formatMaybeDuration(timings.buildDurationMs)}, device ${formatMaybeDuration(timings.deviceProbeDurationMs)}`;
}

function formatFailureConfigSummary(config) {
  return `wait ${formatDurationSeconds(config.renderWaitMs)} from ${config.renderWaitSource}, device ${config.deviceSelectionMode}, authorized ${config.authorizedDeviceCount ?? "unknown"}`;
}

function formatMaybeDuration(durationMs) {
  return Number.isFinite(durationMs) ? formatDurationSeconds(durationMs) : "pending";
}

function formatFailureHostSummary(host) {
  return formatHostSummary({
    ...host,
    adbVersion: host.adbVersion ?? "unknown"
  });
}

function formatHostSummary(host) {
  return `${host.hostPlatform}/${host.hostArch}, Node ${host.nodeVersion}, Flutter ${path.basename(host.flutterCommand)}, ADB ${path.basename(host.adbCommand)} (${host.adbVersion})`;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

async function writeDeviceSmokeResult(result) {
  await mkdir(runResultDir, { recursive: true });
  const payload = `${JSON.stringify({
    schemaVersion: 1,
    runId,
    command: "npm run mobile:device:smoke",
    packageName,
    hostPlatform: process.platform,
    hostArch: process.arch,
    nodeVersion: process.version,
    flutterCommand: flutter,
    adbCommand: adb,
    apkPath: path.relative(root, apkPath),
    screenshotPath: path.relative(root, screenshotPath),
    runResultPath: path.relative(root, runResultPath),
    currentRunResultPath: result.currentRunResultPath ?? path.relative(root, runResultPath),
    currentRunResultStatus: result.currentRunResultStatus ?? "archived",
    runResultArchived: result.runResultArchived ?? true,
    runScreenshotPath: path.relative(root, runScreenshotPath),
    renderWaitMs: Number.isFinite(renderWaitMs) ? renderWaitMs : 7000,
    renderWaitSource,
    ...result,
    deviceSelectionMode: result.deviceSelectionMode ?? deviceSelectionMode,
    authorizedDeviceCount: result.authorizedDeviceCount ?? authorizedDeviceCount,
    requestedDeviceSerial: result.requestedDeviceSerial ?? requestedDeviceSerial,
    deviceSerial: result.deviceSerial ?? selectedDevice,
    toolchainProbeDurationMs: result.toolchainProbeDurationMs ?? toolchainProbeDurationMs,
    flutterVersion: result.flutterVersion ?? flutterBuildInfo?.flutterVersion ?? null,
    flutterChannel: result.flutterChannel ?? flutterBuildInfo?.flutterChannel ?? null,
    dartVersion: result.dartVersion ?? flutterBuildInfo?.dartVersion ?? null,
    adbVersion: result.adbVersion ?? adbVersion,
    buildDurationMs: result.buildDurationMs ?? buildDurationMs,
    apkBuiltAt: result.apkBuiltAt ?? apkBuiltAt,
    apkSizeBytes: result.apkSizeBytes ?? apkSizeBytes,
    apkSha256: result.apkSha256 ?? apkSha256,
    screenshotCapturedAt: result.screenshotCapturedAt ?? screenshotCapturedAt,
    screenshotDurationMs: result.screenshotDurationMs ?? screenshotDurationMs,
    screenshotSizeBytes: result.screenshotSizeBytes ?? screenshotSizeBytes,
    screenshotSha256: result.screenshotSha256 ?? screenshotSha256,
    screenshotWidth: result.screenshotWidth ?? screenshotWidth,
    screenshotHeight: result.screenshotHeight ?? screenshotHeight,
    screenshotDiverseSamples: result.screenshotDiverseSamples ?? screenshotDiverseSamples,
    screenshotCapturedForRun: result.screenshotCapturedForRun ?? screenshotCapturedForRun,
    runScreenshotArchived: result.runScreenshotArchived ?? runScreenshotArchived,
    currentRunScreenshotPath: result.currentRunScreenshotPath ?? currentRunScreenshotPath,
    currentRunScreenshotStatus: result.currentRunScreenshotStatus ?? formatCurrentRunScreenshotStatus({
      screenshotCapturedForRun,
      runScreenshotArchived
    }),
    latestScreenshotMayBeStale: result.latestScreenshotMayBeStale ?? (result.status === "failed" && !screenshotCapturedForRun),
    deviceProbeDurationMs: result.deviceProbeDurationMs ?? deviceProbeDurationMs,
    failedStage: result.failedStage ?? null,
    errorCode: result.errorCode ?? null,
    errorDetail: result.errorDetail ?? null,
    recoveryHintCode: result.recoveryHintCode ?? null,
    recoveryHint: result.recoveryHint ?? null,
    error: result.error ?? null,
    startedAt: result.startedAt.toISOString(),
    completedAt: result.completedAt.toISOString(),
    ...(result.apkBuiltAt ? { apkBuiltAt: result.apkBuiltAt.toISOString() } : {}),
    ...(result.screenshotCapturedAt ? { screenshotCapturedAt: result.screenshotCapturedAt.toISOString() } : {})
  }, null, 2)}\n`;
  await writeFile(resultPath, payload, "utf8");
  await writeFile(runResultPath, payload, "utf8");
}

function formatCurrentRunScreenshotStatus(screenshot) {
  if (!screenshot.screenshotCapturedForRun) return "not-captured";
  return screenshot.runScreenshotArchived ? "captured-and-archived" : "captured-not-archived";
}

async function verifyArchivedArtifacts() {
  await verifyArchivedResult();

  const latestScreenshotSha256 = sha256Hex(await readFile(screenshotPath));
  const runScreenshotSha256 = sha256Hex(await readFile(runScreenshotPath));
  if (latestScreenshotSha256 !== runScreenshotSha256) {
    throw new Error(
      `TM_ANDROID_DEVICE_SMOKE_ARCHIVE_MISMATCH\n${path.relative(root, runScreenshotPath)} does not match ${path.relative(root, screenshotPath)}.`
    );
  }
}

async function verifyArchivedResult() {
  const latestResultSha256 = sha256Hex(await readFile(resultPath));
  const runResultSha256 = sha256Hex(await readFile(runResultPath));
  if (latestResultSha256 !== runResultSha256) {
    throw new Error(
      `TM_ANDROID_DEVICE_SMOKE_RESULT_ARCHIVE_MISMATCH\n${path.relative(root, runResultPath)} does not match ${path.relative(root, resultPath)}.`
    );
  }
}

async function validatePngScreenshot(filePath) {
  const file = await readFile(filePath);
  const signature = "89504e470d0a1a0a";
  if (file.subarray(0, 8).toString("hex") !== signature) {
    throw new Error(`TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT\n${path.relative(root, filePath)} is not a PNG file.`);
  }

  const parsed = parsePng(file);
  if (parsed.width < 100 || parsed.height < 100) {
    throw new Error(`TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT\n${path.relative(root, filePath)} is too small.`);
  }

  const pixels = inflateSync(Buffer.concat(parsed.idatChunks));
  const diverseSamples = countDiversePixelSamples(pixels, parsed);
  if (diverseSamples < 8) {
    throw new Error(
      `TM_ANDROID_DEVICE_SMOKE_BLANK_SCREENSHOT\n${path.relative(root, filePath)} looks blank or blocked; wake the phone, unlock it, and rerun npm run mobile:device:smoke.`
    );
  }

  return {
    width: parsed.width,
    height: parsed.height,
    diverseSamples
  };
}

function parsePng(file) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset + 8 <= file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.subarray(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = file.subarray(dataStart, dataEnd);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  if (!width || !height || bitDepth !== 8 || (colorType !== 2 && colorType !== 6) || idatChunks.length === 0) {
    throw new Error("TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT\nScreenshot must be an 8-bit RGB or RGBA PNG.");
  }

  return { width, height, bytesPerPixel: colorType === 6 ? 4 : 3, idatChunks };
}

function countDiversePixelSamples(raw, png) {
  const stride = png.width * png.bytesPerPixel;
  const expectedRowLength = stride + 1;
  const previousRow = Buffer.alloc(stride);
  const currentRow = Buffer.alloc(stride);
  const colors = new Set();
  const stepX = Math.max(1, Math.floor(png.width / 24));
  const stepY = Math.max(1, Math.floor(png.height / 36));

  for (let y = 0; y < png.height; y += 1) {
    const rowOffset = y * expectedRowLength;
    const filter = raw[rowOffset];
    raw.copy(currentRow, 0, rowOffset + 1, rowOffset + expectedRowLength);
    unfilterRow(currentRow, previousRow, filter, png.bytesPerPixel);

    if (y % stepY === 0) {
      for (let x = 0; x < png.width; x += stepX) {
        const pixel = x * png.bytesPerPixel;
        colors.add(`${currentRow[pixel]},${currentRow[pixel + 1]},${currentRow[pixel + 2]},${currentRow[pixel + 3]}`);
      }
    }

    currentRow.copy(previousRow);
  }

  return colors.size;
}

function unfilterRow(row, previousRow, filter, bytesPerPixel) {
  for (let index = 0; index < row.length; index += 1) {
    const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
    const up = previousRow[index];
    const upLeft = index >= bytesPerPixel ? previousRow[index - bytesPerPixel] : 0;
    if (filter === 1) row[index] = (row[index] + left) & 0xff;
    else if (filter === 2) row[index] = (row[index] + up) & 0xff;
    else if (filter === 3) row[index] = (row[index] + Math.floor((left + up) / 2)) & 0xff;
    else if (filter === 4) row[index] = (row[index] + paeth(left, up, upLeft)) & 0xff;
    else if (filter !== 0) throw new Error(`TM_ANDROID_DEVICE_SMOKE_INVALID_SCREENSHOT\nUnsupported PNG filter ${filter}.`);
  }
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;
  return upLeft;
}
