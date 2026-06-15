# Android Device Smoke

`npm run mobile:device:smoke` builds the Flutter debug APK, checks `adb devices`, installs the APK on one authorized Android device, and launches `com.example.thai_meet_mobile`.
It also saves the latest device screenshot to `.thai-meet/device-smoke/latest.png`, run metadata to `.thai-meet/device-smoke/latest.json`, a per-run screenshot to `.thai-meet/device-smoke/runs/<runId>.png`, and a per-run result copy to `.thai-meet/device-smoke/runs/<runId>.json` for local UI confirmation.
The command waits briefly after launch before capture; override with `ANDROID_DEVICE_SMOKE_RENDER_WAIT_MS` if a debug build needs more time on a device.
The saved PNG is validated so a blank, locked, or single-color screenshot fails the smoke instead of hiding a device-display problem.
The archived per-run JSON and PNG are also checked against the latest result files so archive write drift fails the smoke immediately; failed runs still verify the per-run JSON archive even when no fresh screenshot is available.
The result JSON records a run ID, start time, completion time, host platform, host architecture, Node version, resolved Flutter command, resolved ADB command, render wait source, toolchain probe duration, device probe duration, authorized device count, device selection mode, requested device serial, selected device serial, APK build duration, APK install duration, package info probe duration, app launch duration, screenshot capture duration, APK build time, APK size, APK SHA-256, Flutter version, Flutter channel, Dart version, ADB version, screenshot capture time, screenshot file size, screenshot SHA-256, installed version, device manufacturer, brand, model, Android release, Android SDK, physical screen size, screen density, foreground package, foreground Activity, screenshot width, height, pixel diversity, current-run result archive path, current-run result status, current-run screenshot archive path, current-run screenshot status, whether the latest screenshot may be stale, failure `errorCode`, failure `errorDetail`, failure `recoveryHintCode`, and failure `recoveryHint` so device-specific capture drift is visible without opening the image first. Failed runs also keep toolchain probe fields when the probe completed, APK build artifact fields when the build completed, plus `deviceSelectionMode`, `requestedDeviceSerial`, `deviceSerial`, and, when `adb devices` was reached, `authorizedDeviceCount` plus the elapsed `deviceProbeDurationMs`; if failure happens after device selection, `deviceSerial` is the selected device instead of `null`.

Prerequisites:

- Flutter stable is on PATH.
- Android SDK platform-tools are installed.
- The phone has USB debugging enabled.
- The phone appears as `authorized` in `adb devices`; accept the USB debugging prompt on the device if it appears.

Run:

```powershell
npm run mobile:device:smoke
```

Read the latest saved result without rerunning the device smoke:

```powershell
npm run mobile:device:result
```

The default result reader summary includes the run ID, render wait, device selection mode, authorized device count, selected device model, Android/API/screen details, foreground app package/activity, installed version, run duration, stage timings, screenshot capture quality, host/toolchain details, APK build provenance, APK path, latest result and screenshot paths, current-run archive status lines, and, for failed runs, the failed stage, error code, and error detail before the recovery hint.

Show the result reader options:

```powershell
npm run mobile:device:result -- --help
```

Run the result reader regression checks without touching a connected device:

```powershell
npm run mobile:device:result:test
```

For tooling, print the saved result JSON:

```powershell
npm run mobile:device:result -- --json
```

For tooling that only needs the key result, timing, host/toolchain, device, app, build, artifact, screenshot quality, and failure diagnostic fields, print a compact JSON summary:

```powershell
npm run mobile:device:result -- --summary-json
npm run mobile:device:result -- --summary-json --absolute
npm run mobile:device:result -- --summary-json --require-existing
npm run mobile:device:result -- --summary-keys
npm run mobile:device:result -- --summary-field resultPath
npm run mobile:device:result -- --summary-field resultPath --absolute
npm run mobile:device:result -- --summary-field resultPath --require-existing
```

For CI-style checks, fail when the latest saved result is not `passed`:

```powershell
npm run mobile:device:result -- --strict
```

When `--strict` fails, stderr includes the failed stage, error code, optional error detail, and recovery hint so CI logs point at the next local action without reopening `latest.json`. The same strict failure diagnostics are written for every result reader output mode, including `--json`, `--summary-json`, `--summary-keys`, `--summary-field`, `--field`, `--path`, `--paths`, `--paths-keys`, and `--paths-field`.

Print one top-level field for shell scripts:

```powershell
npm run mobile:device:result -- --field status
```

Print a saved artifact path for shell scripts:

```powershell
npm run mobile:device:result -- --path screenshot
npm run mobile:device:result -- --path latest-screenshot
npm run mobile:device:result -- --path current-result
npm run mobile:device:result -- --path current-screenshot
npm run mobile:device:result -- --path run-result
npm run mobile:device:result -- --path run-screenshot
npm run mobile:device:result -- --path result
npm run mobile:device:result -- --path latest
npm run mobile:device:result -- --path apk
npm run mobile:device:result -- --path screenshot --absolute
npm run mobile:device:result -- --path screenshot --require-existing
npm run mobile:device:result -- --paths
npm run mobile:device:result -- --paths-keys
npm run mobile:device:result -- --paths-field runResult
npm run mobile:device:result -- --paths-field runScreenshot --absolute
npm run mobile:device:result -- --paths --absolute
npm run mobile:device:result -- --paths --require-existing
```

The `--field` option requires a field name; missing or unknown fields fail with a structured error code.
Option-like values such as `--field -h` or `--field=-h` are treated as missing field names and fail before reading `latest.json`.
The `--path` option requires `apk`, `screenshot`, `latest-screenshot`, `current-result`, `current-screenshot`, `run-result`, `run-screenshot`, `result`, or `latest`; missing or unsupported targets fail with a structured error code.
Use `--paths` when a shell script needs the APK, latest result, latest screenshot, current-run result, current-run screenshot, per-run result, per-run screenshot, and screenshot paths as one JSON object.
Use `--paths-keys` when a shell script needs to inspect the artifact path field names before reading `--paths`.
Use `--paths-field` when a shell script needs one artifact path field by the same key name returned by `--paths`, such as `runResult` or `runScreenshot`.
Use `--absolute` with `--summary-json`, `--summary-field`, `--path`, `--paths`, or `--paths-field` when a shell script needs full filesystem paths; `--absolute` without one of those output modes fails with `TM_ANDROID_DEVICE_SMOKE_RESULT_ABSOLUTE_REQUIRES_PATH`.
Use `--require-existing` with `--summary-json`, artifact-path `--summary-field` values, `--path`, `--paths`, or `--paths-field` when a shell script needs to fail if any saved artifact is missing; in summary mode this checks APK, latest result, per-run result, and screenshot paths. `--require-existing` without one of those output modes fails with `TM_ANDROID_DEVICE_SMOKE_RESULT_REQUIRE_EXISTING_REQUIRES_PATH`.
Use `--summary-keys` when a shell script needs to inspect the compact summary field names before reading `--summary-json`.
Use `--summary-field` when a shell script needs one compact summary field such as `resultPath`, `runScreenshotPath`, or `recoveryHint`; missing or unknown summary fields fail with a structured error code. Pair `--summary-field` with `--require-existing` only for fields ending in `Path`.
Use only one of `--json`, `--summary-json`, `--summary-keys`, `--summary-field`, `--field`, `--path`, `--paths`, `--paths-keys`, or `--paths-field`; combining output modes or repeating the same output mode fails with `TM_ANDROID_DEVICE_SMOKE_RESULT_OPTION_CONFLICT`, even when `--help` is also present.
Unknown result reader options, including unsupported short options such as `-h`, fail with `TM_ANDROID_DEVICE_SMOKE_RESULT_UNKNOWN_OPTION`, even when `--help` is also present; run `npm run mobile:device:result -- --help` to see the supported options.
Unexpected positional arguments such as `npm run mobile:device:result -- status` fail with `TM_ANDROID_DEVICE_SMOKE_RESULT_UNEXPECTED_ARGUMENT`; use `--field status` to print one top-level field. If the positional argument is a saved artifact target such as `apk`, the error suggests `--path apk` instead.

If more than one device is connected, set `ANDROID_SERIAL` first:

```powershell
$env:ANDROID_SERIAL="YOUR_DEVICE_SERIAL"
npm run mobile:device:smoke
```

When `ANDROID_SERIAL` is set, the result JSON records that value as `requestedDeviceSerial`; otherwise it is `null`.

Expected result:

```text
Gate 0 Android device smoke OK: com.example.thai_meet_mobile launched on YOUR_DEVICE_SERIAL
Duration: 42.5s
Device: OPPO CPH2695, Android 16 (API 36), 720x1604 @ 320 dpi
App: com.example.thai_meet_mobile/com.example.thai_meet_mobile.MainActivity, version 0.0.0 (1)
Build: Flutter 3.44.1 stable, Dart 3.12.1, APK 152.7 MiB, sha256 abc123def456
Timings: build 3.8s, install 22.9s, package 0.2s, launch 9.0s, screenshot 0.3s
Capture: 720x1604, 0.1 MiB, diversity 41, sha256 abc123def456
Run: 2026-06-05T19-32-25-330Z, wait 7.0s from default, device auto, authorized 1
Artifacts: result archived, screenshot captured-and-archived
Host: win32/x64, Node v24.12.0, Flutter flutter.bat, ADB adb.exe (Android Debug Bridge version 1.0.41)
Screenshot: .thai-meet\device-smoke\latest.png
Result: .thai-meet\device-smoke\latest.json
Archive Screenshot: .thai-meet\device-smoke\runs\<runId>.png
Archive Result: .thai-meet\device-smoke\runs\<runId>.json
```

The `runResultPath` and `runScreenshotPath` fields inside `latest.json` point at the archived per-run JSON and PNG copies for that execution. `currentRunResultPath`, `currentRunResultStatus`, and `runResultArchived` make the JSON result archive state explicit for tooling.
The `currentRunScreenshotPath` field is the archived screenshot for the current run when one exists; failed runs that never captured a fresh screenshot set it to `null` and set `latestScreenshotMayBeStale` to `true`. `currentRunScreenshotStatus` is `captured-and-archived`, `captured-not-archived`, or `not-captured` for simple machine checks.

On successful runs, `failedStage`, `errorCode`, and `error` are present as `null` so result readers can depend on a stable schema.
On failure, the command writes a failed `latest.json` and per-run JSON archive with an `errorCode`, `errorDetail`, `recoveryHintCode`, and `recoveryHint`, then prints `Failure Stage:`, `Failure Code:`, `Failure Detail:`, `Failure Hint Code:`, `Failure Hint:`, `Failure Duration:`, `Failure Timings:`, `Failure Run:`, `Failure Config:`, `Failure Device:`, `Failure Build:`, `Failure Capture:`, `Failure Screenshot:`, `Failure Artifacts:`, `Failure Host:`, `Failure Result:`, and `Failure Archive Result:` so diagnostics can start from the structured result file. `Failure Screenshot:` says whether a screenshot was captured for the current run, which avoids mistaking a stale `latest.png` from an earlier pass for fresh evidence.

This command is intentionally separate from `npm test` and `corepack pnpm smoke` because scaffold smoke must not require a real Android phone.
