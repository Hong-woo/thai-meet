import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const routePath = path.join(root, "apps/mobile/lib/gate0_routes.dart");
const source = await readFile(routePath, "utf8");
const pubspecSource = await readFile(path.join(root, "apps/mobile/pubspec.yaml"), "utf8");
const mainSource = await readFile(path.join(root, "apps/mobile/lib/main.dart"), "utf8");
const mockDataSource = await readFile(path.join(root, "apps/mobile/lib/gate0_mock_data.dart"), "utf8").catch(() => "");
const generatorSource = await readFile(path.join(root, "scripts/generate-mobile-mock-data.mjs"), "utf8").catch(() => "");
const androidSettingsSource = await readFile(path.join(root, "apps/mobile/android/settings.gradle.kts"), "utf8").catch(() => "");
const androidBuildSource = await readFile(path.join(root, "apps/mobile/android/app/build.gradle.kts"), "utf8").catch(() => "");
const webIndexSource = await readFile(path.join(root, "apps/mobile/web/index.html"), "utf8").catch(() => "");
const smokeSource = await readFile(path.join(root, "scripts/smoke.mjs"), "utf8");
const gate0StatusScript = await readFile(path.join(root, "scripts/gate0-status.mjs"), "utf8").catch(() => "");
const gate0StatusTestScript = await readFile(path.join(root, "scripts/check-gate0-status.mjs"), "utf8").catch(() => "");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const fixture = JSON.parse(await readFile(path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json"), "utf8"));
const todos = await readFile(path.join(root, "TODOS.md"), "utf8");
const readme = await readFile(path.join(root, "README.md"), "utf8");
const gettingStarted = await readFile(path.join(root, "docs/dev/GETTING_STARTED.md"), "utf8");
const smokeDocs = await readFile(path.join(root, "docs/dev/SMOKE.md"), "utf8");
const gate0Status = await readFile(path.join(root, "docs/dev/GATE0_STATUS.md"), "utf8");
const gate0StatusCommandDocs = await readFile(path.join(root, "docs/dev/GATE0_STATUS_COMMAND.md"), "utf8").catch(() => "");
const ciDocs = await readFile(path.join(root, "docs/dev/CI.md"), "utf8").catch(() => "");
const designStatusDocs = await readFile(path.join(root, "docs/dev/DESIGN_STATUS.md"), "utf8").catch(() => "");
const productionGapsDocs = await readFile(path.join(root, "docs/dev/PRODUCTION_GAPS.md"), "utf8").catch(() => "");
const roadmapDocs = await readFile(path.join(root, "docs/dev/ROADMAP.md"), "utf8").catch(() => "");
const architecture = await readFile(path.join(root, "docs/dev/ARCHITECTURE.md"), "utf8");
const devDocsReadme = await readFile(path.join(root, "docs/dev/README.md"), "utf8");
const reviewChecklist = await readFile(path.join(root, "docs/dev/REVIEW_CHECKLIST.md"), "utf8");
const changelog = await readFile(path.join(root, "docs/dev/CHANGELOG.md"), "utf8");

const requiredRoutes = [
  ["onboarding.login", "/login"],
  ["onboarding.publicId", "/onboarding/public-id"],
  ["onboarding.profile", "/onboarding/profile"],
  ["discover.index", "/discover"],
  ["swipe.index", "/swipe"],
  ["discover.profileDetail", "/profile/:publicIdentityId"],
  ["discover.filters", "/discover/filters"],
  ["chat.index", "/chat"],
  ["chat.detail", "/chat/:roomId"],
  ["chat.lineContactCard", "/chat/:roomId/contact-card/line"],
  ["list.index", "/list"],
  ["list.safetyActions", "/list/safety"],
  ["my.index", "/my"],
  ["my.publicIdGenerate", "/my/public-id/generate"],
  ["my.lineSetup", "/my/contact/line"],
  ["safety.report", "/safety/report/:targetType/:targetId"],
  ["safety.blockedUsers", "/safety/blocked-users"],
  ["safety.contactExchanges", "/safety/contact-exchanges"]
];

const requiredTabs = ["Discover", "Swipe", "Chat", "List", "My"];
const requiredShellMarkers = [
  "Gate0Shell",
  "Gate0FlowStep",
  "BottomNavigationBar",
  "gate0Tabs",
  "gate0-shell-app-title",
  "gate0-shell-public-id-badge",
  "gate0-tab-discover-icon",
  "gate0-tab-swipe-icon",
  "gate0-tab-chat-icon",
  "gate0-tab-list-icon",
  "gate0-tab-my-icon",
  "_openProfileDetail",
  "_startChat",
  "_showLineContactCard",
  "_selectContactCardState",
  "DiscoverSwipe",
  "gate0-discover-screen-title",
  "gate0-discover-screen-subtitle",
  "gate0-start-chat",
  "gate0-start-chat-label",
  "gate0-swipe-screen-title",
  "gate0-swipe-screen-subtitle",
  "SwipeQueueCard",
  "gate0-swipe-queue-card",
  "gate0-swipe-queue-title",
  "Swipe Queue",
  "gate0-swipe-queue-count-chip",
  "gate0-swipe-queue-count-label",
  "1 of 8 nearby",
  "gate0-swipe-skip-action",
  "gate0-swipe-skip-action-label",
  "gate0-swipe-open-profile",
  "gate0-swipe-open-profile-label",
  "SwipeEmptyCard",
  "gate0-swipe-empty-card",
  "gate0-swipe-empty-title",
  "All caught up",
  "gate0-swipe-empty-privacy-copy",
  "That profile was skipped. LINE stayed hidden.",
  "gate0-swipe-empty-line-hidden-chip",
  "gate0-swipe-empty-line-hidden-label",
  "LINE stayed hidden",
  "gate0-swipe-empty-public-id-chip",
  "gate0-swipe-empty-public-id-label",
  "Public ID only",
  "gate0-swipe-return-discover",
  "gate0-swipe-return-discover-label",
  "gate0-swipe-line-hidden-chip",
  "gate0-swipe-line-hidden-label",
  "LINE hidden until chat",
  "gate0-swipe-public-id-first-chip",
  "gate0-swipe-public-id-first-label",
  "Public ID first",
  "ProfileDetail",
  "gate0-profile-screen-title",
  "gate0-profile-screen-subtitle",
  "gate0-profile-trust-card",
  "gate0-profile-trust-title",
  "gate0-profile-trust-avatar-initial",
  "gate0-profile-trust-public-id",
  "gate0-profile-trust-name",
  "gate0-profile-trust-location",
  "Profile Trust Check",
  "gate0-profile-public-id-verified-chip",
  "gate0-profile-public-id-verified-label",
  "Public ID verified",
  "gate0-profile-line-hidden-chip",
  "gate0-profile-line-hidden-label",
  "LINE hidden before chat",
  "gate0-profile-safety-copy",
  "Report or block before starting chat",
  "gate0-profile-start-chat",
  "gate0-profile-start-chat-label",
  "gate0-chat-screen-title",
  "gate0-chat-screen-subtitle",
  "ChatContactCard",
  "gate0-chat-message-$messageId",
  "gate0-chat-message-text-$messageId",
  "ChatLockCard",
  "gate0-chat-lock-card",
  "gate0-chat-lock-card-title",
  "gate0-chat-lock-card-hidden-chip",
  "gate0-chat-lock-card-hidden-label",
  "gate0-chat-lock-card-choice-chip",
  "gate0-chat-lock-card-choice-label",
  "Contact Card locked",
  "Raw LINE not in messages",
  "Share only by choice",
  "LineSetupRequiredCard",
  "gate0-line-setup-required",
  "gate0-line-setup-from-chat",
  "gate0-line-setup-from-chat-label",
  "gate0-line-setup-required-title",
  "gate0-line-setup-required-detail",
  "gate0-line-setup-required-hidden-chip",
  "gate0-line-setup-required-hidden-label",
  "gate0-line-setup-required-chat-chip",
  "gate0-line-setup-required-chat-label",
  "Set up LINE to share",
  "Register LINE before creating a Contact Card",
  "LINE not set up",
  "LineShareReceipt",
  "gate0-line-share-receipt",
  "gate0-line-share-receipt-title",
  "LINE share confirmed",
  "gate0-line-share-receipt-hidden-chip",
  "gate0-line-share-receipt-hidden-label",
  "Raw LINE still hidden",
  "gate0-line-share-receipt-revoke-copy",
  "Contact Card can be revoked",
  "FirstShareConfirmation",
  "gate0-share-line-confirmation",
  "gate0-share-line-confirmation-title",
  "gate0-share-line-confirmation-body",
  "gate0-share-line-cancel",
  "gate0-share-line-cancel-label",
  "gate0-share-line",
  "gate0-share-line-label",
  "LineShareCancelledCard",
  "gate0-line-share-cancelled",
  "gate0-line-share-cancelled-title",
  "gate0-line-share-cancelled-detail",
  "gate0-line-share-cancelled-hidden-chip",
  "gate0-line-share-cancelled-hidden-label",
  "gate0-line-share-cancelled-chat-chip",
  "gate0-line-share-cancelled-chat-label",
  "LINE share cancelled",
  "gate0-review-line-share",
  "gate0-review-line-share-label",
  "Review sharing again",
  "gate0-line-contact-card-panel",
  "gate0-line-contact-card-panel-title",
  "gate0-line-contact-card-panel-body",
  "gate0-contact-view-action",
  "gate0-contact-view-action-label",
  "gate0-contact-revoke",
  "gate0-contact-revoke-label",
  "LINE Contact Card",
  "LineContactPreview",
  "gate0-line-contact-preview",
  "gate0-line-contact-preview-title",
  "gate0-line-contact-preview-subtitle",
  "gate0-line-contact-preview-copy-chip",
  "gate0-line-contact-preview-copy-label",
  "gate0-line-contact-preview-choice-chip",
  "gate0-line-contact-preview-choice-label",
  "gate0-line-contact-preview-state-chip",
  "gate0-line-contact-preview-state-label",
  "gate0-line-contact-preview-safety-chip",
  "gate0-line-contact-preview-safety-label",
  "gate0-line-contact-preview-description",
  "Redacted LINE card",
  "Copy disabled",
  "Shared by choice",
  "Report or block anytime",
  "ContactStateAlert",
  "gate0-contact-state-alert",
  "gate0-contact-state-alert-title",
  "gate0-contact-state-alert-detail",
  "gate0-contact-state-alert-hidden-chip",
  "gate0-contact-state-alert-hidden-label",
  "gate0-contact-state-alert-chat-chip",
  "gate0-contact-state-alert-chat-label",
  "gate0-contact-state-alert-revoked-title",
  "gate0-contact-state-alert-reported-title",
  "gate0-contact-state-alert-provider-unavailable-title",
  "gate0-contact-state-alert-blocked-title",
  "gate0-contact-state-alert-revoked-detail",
  "gate0-contact-state-alert-reported-detail",
  "gate0-contact-state-alert-provider-unavailable-detail",
  "gate0-contact-state-alert-blocked-detail",
  "Contact access unavailable",
  "Raw LINE remains hidden",
  "Chat stays open",
  "ProfileVisual",
  "gate0-profile-visual",
  "gate0-profile-visual-title",
  "Public profile",
  "gate0-profile-visual-location",
  "gate0-profile-visual-line-off-chip",
  "gate0-profile-visual-line-off-label",
  "LINE off",
  "gate0-profile-card-name",
  "gate0-profile-card-location",
  "gate0-profile-card-privacy-copy",
  "PublicIdControlCard",
  "gate0-public-id-card",
  "gate0-public-id-title",
  "Public Meet ID",
  "gate0-public-id-current-value",
  "gate0-public-id-active-chip",
  "gate0-public-id-active-label",
  "Active now",
  "gate0-regenerate-public-id",
  "gate0-regenerate-public-id-label",
  "Regenerate Public ID",
  "gate0-share-public-id",
  "gate0-share-public-id-label",
  "Share Public ID",
  "gate0-line-setup-in-my",
  "gate0-line-setup-in-my-label",
  "gate0-public-id-line-status-chip",
  "gate0-public-id-line-status-label",
  "LINE ready",
  "Update LINE",
  "LineUpdateNotice",
  "gate0-line-update-notice",
  "gate0-line-update-notice-title",
  "LINE updated just now",
  "gate0-line-update-notice-privacy",
  "Raw LINE still separate",
  "gate0-public-id-share-notice-title",
  "gate0-public-id-share-notice-detail",
  "gate0-public-id-share-notice-privacy",
  "gate0-view-shared-public-id-history",
  "gate0-view-shared-public-id-history-label",
  "View in List",
  "gate0-public-id-history-title",
  "History starts after regeneration",
  "gate0-public-id-privacy-copy",
  "Your private LINE stays separate from this public identity.",
  "gate0-public-id-archive-notice",
  "gate0-public-id-archive-notice-title",
  "gate0-public-id-archive-notice-detail",
  "Previous ID archived",
  "Previous shared ID archived",
  "gate0-view-public-id-history",
  "gate0-view-public-id-history-label",
  "View history",
  "archived",
  "gate0-shared-public-id-row",
  "gate0-current-shared-public-id-summary-title",
  "Current shared Public ID",
  "gate0-current-shared-public-id-summary-detail",
  "gate0-current-shared-public-id-value-title",
  "gate0-current-shared-public-id-value-detail",
  "gate0-manage-shared-public-id",
  "gate0-manage-shared-public-id-label",
  "Manage Public ID",
  "gate0-list-screen-title",
  "gate0-list-screen-subtitle",
  "SafetyLedgerCard",
  "gate0-safety-ledger",
  "gate0-safety-ledger-title",
  "gate0-safety-ledger-subtitle",
  "gate0-safety-ledger-icon",
  "Safety Ledger",
  "gate0-contact-cards-summary-row",
  "gate0-contact-cards-summary-title",
  "gate0-contact-cards-summary-detail",
  "Contact cards",
  "gate0-public-id-summary-row",
  "gate0-public-id-summary-title",
  "gate0-public-id-summary-detail",
  "Public IDs",
  "No public ID events yet",
  "1 shared current ID",
  "gate0-manage-public-ids-from-summary",
  "gate0-manage-public-ids-from-summary-label",
  "current and",
  "No contact events yet",
  "1 shared Contact Card",
  "1 safety contact event",
  "safety contact events",
  "contact event",
  "gate0-start-contact-cards-from-summary",
  "gate0-start-contact-cards-from-summary-label",
  "Start Contact Cards",
  "gate0-review-contact-cards-from-summary",
  "gate0-review-contact-cards-from-summary-label",
  "Review Contact Cards",
  "gate0-report-contact-cards-from-summary",
  "gate0-report-contact-cards-from-summary-label",
  "Report Contact Cards",
  "gate0-block-contact-cards-from-summary",
  "gate0-block-contact-cards-from-summary-label",
  "Block Contact Cards",
  "gate0-retry-contact-cards-from-summary",
  "gate0-retry-contact-cards-from-summary-label",
  "Retry Contact Cards",
  "gate0-review-contact-cards-again-from-summary",
  "gate0-review-contact-cards-again-from-summary-label",
  "gate0-current-contact-card-row",
  "gate0-current-contact-card-title",
  "gate0-current-contact-card-detail",
  "gate0-start-contact-card-from-summary",
  "gate0-start-contact-card-from-summary-label",
  "Start Contact Card",
  "gate0-review-current-contact-card-from-summary",
  "gate0-review-current-contact-card-from-summary-label",
  "Review Current Card",
  "gate0-retry-current-contact-card-from-summary",
  "gate0-retry-current-contact-card-from-summary-label",
  "Retry Current Card",
  "gate0-review-sharing-again-from-summary",
  "gate0-review-sharing-again-from-summary-label",
  "gate0-ledger-review-contact-card",
  "gate0-ledger-review-contact-card-label",
  "Review Shared Card",
  "Review Revoked Card",
  "Review Reported Card",
  "Review Blocked Card",
  "Review Delayed Card",
  "Share first to review",
  "gate0-ledger-open-share",
  "gate0-ledger-open-share-label",
  "Open Chat to Share",
  "gate0-ledger-retry-contact-card",
  "gate0-ledger-retry-contact-card-label",
  "Retry Contact Card",
  "gate0-ledger-review-share-again",
  "gate0-ledger-review-share-again-label",
  "Block Reported Card",
  "Block Shared Card",
  "Block Delayed Card",
  "Block Revoked Card",
  "Report Shared Card",
  "Report Delayed Card",
  "Report Revoked Card",
  "gate0-ledger-report-action",
  "gate0-ledger-report-action-label",
  "gate0-reports-summary-row",
  "gate0-reports-summary-title",
  "gate0-reports-summary-detail",
  "gate0-review-reports-from-summary",
  "gate0-review-reports-from-summary-label",
  "Review Reports",
  "gate0-close-reports-from-summary",
  "gate0-close-reports-from-summary-label",
  "Close Reports",
  "gate0-reopen-reports-from-summary",
  "gate0-reopen-reports-from-summary-label",
  "Reopen Reports",
  "gate0-ledger-block-action",
  "gate0-ledger-block-action-label",
  "gate0-blocks-summary-row",
  "gate0-blocks-summary-title",
  "gate0-blocks-summary-detail",
  "gate0-review-blocks-from-summary",
  "gate0-review-blocks-from-summary-label",
  "Review Blocks",
  "gate0-unblock-from-summary",
  "gate0-unblock-from-summary-label",
  "Unblock Contact",
  "gate0-blocked-users-row",
  "gate0-blocked-users-summary-row",
  "Blocked users",
  "LINE cannot reopen while blocked",
  "gate0-current-blocked-user-row",
  "blocked from Contact Card",
  "gate0-review-blocked-user",
  "gate0-review-blocked-user-label",
  "Review blocked user",
  "gate0-unblock-user",
  "gate0-unblock-user-label",
  "Unblock user",
  "gate0-unblocked-user-notice",
  "Block removed",
  "Contact Card locked until you share again",
  "Report review still active",
  "gate0-current-shared-public-id-summary-row",
  "gate0-current-shared-public-id-value-row",
  "gate0-public-id-history-summary-row",
  "gate0-block-history-retained-row",
  "Block history retained",
  "Past block remains in event history",
  "gate0-report-history-retained-row",
  "Report history retained",
  "Block locks new report actions",
  "gate0-profile-report-action",
  "gate0-profile-report-action-label",
  "gate0-profile-block-action",
  "gate0-profile-block-action-label",
  "Report logged",
  "Report locked",
  "gate0-reported-contacts-row",
  "gate0-reported-contacts-summary-row",
  "Reported contacts",
  "Safety review keeps LINE hidden",
  "gate0-current-reported-user-row",
  "reported for Contact Card",
  "gate0-review-reported-user",
  "gate0-review-reported-user-label",
  "Review reported user",
  "gate0-block-reported-user",
  "gate0-block-reported-user-label",
  "Block reported user",
  "gate0-close-report-review",
  "gate0-close-report-review-label",
  "Close report review",
  "gate0-report-closed-notice",
  "Report review closed",
  "gate0-closed-report-retained-row",
  "gate0-closed-report-retained-summary-row",
  "Closed report retained",
  "Past report remains in event history",
  "gate0-reopen-report-review",
  "gate0-reopen-report-review-label",
  "Reopen report review",
  "Reopen Report",
  "Block active",
  "gate0-archived-public-id-row",
  "gate0-latest-archived-public-id-row",
  "gate0-older-archived-public-id-row",
  "gate0-latest-archived-public-id-manage-action",
  "gate0-latest-archived-public-id-manage-action-label",
  "gate0-older-archived-public-id-manage-action-label",
  "gate0-public-id-history-summary-title",
  "gate0-public-id-history-summary-detail",
  "gate0-latest-archived-public-id-title",
  "gate0-latest-archived-public-id-detail",
  "gate0-older-archived-public-id-title",
  "gate0-older-archived-public-id-detail",
  "Latest archived Public ID",
  "Latest shared archived Public ID",
  "Shared archived Public ID",
  "Archived Public ID",
  "gate0-my-screen-title",
  "gate0-my-screen-subtitle",
  "gate0-manage-archived-public-id",
  "Public ID history",
  "archived ID",
  "shared archived ID",
  "shared of",
  "shared before archive",
  "most recent first",
  "gate0-contact-safety-event-row",
  "gate0-contact-event-history-summary-row",
  "gate0-latest-contact-safety-event-row",
  "gate0-older-contact-safety-event-row",
  "gate0-contact-event-history-summary-title",
  "gate0-contact-event-history-summary-detail",
  "gate0-latest-contact-safety-event-title",
  "gate0-latest-contact-safety-event-detail",
  "gate0-older-contact-safety-event-title",
  "gate0-older-contact-safety-event-detail",
  "Contact event history",
  "Most recent first",
  "Current Contact Card",
  "Share not started",
  "Shared by choice",
  "Revoked by you",
  "Provider unavailable now",
  "Contact Card delayed",
  "Contact Card revoked",
  "Contact Card report",
  "Contact Card block",
  "LINE provider unavailable",
  "Raw LINE stays hidden",
  "Contact Card revoked by you",
  "Review sharing again to create a new card.",
  "Report under review",
  "Chat stays open while safety reviews it.",
  "Provider temporarily unavailable",
  "Retry keeps raw LINE hidden.",
  "Block stays active",
  "LINE cannot reopen from this chat.",
  "ContactStateSelector",
  "gate0-contact-state-selector",
  "gate0-contact-state-locked-label",
  "gate0-contact-state-available-label",
  "gate0-contact-state-revoked-label",
  "gate0-contact-state-reported-label",
  "gate0-contact-state-blocked-label",
  "gate0-contact-state-providerUnavailable-label",
  "Contact state:",
  "locked",
  "available",
  "revoked",
  "reported",
  "blocked",
  "providerUnavailable",
  "gate0-open-profile-detail",
  "gate0-open-profile-detail-label",
  "View Profile",
  "gate0-view-contact-card",
  "gate0-view-contact-card-label",
  "View Contact Card",
  "Preview visible",
  "View unavailable",
  "Revoke Contact Card",
  "gate0-contact-review-share",
  "gate0-contact-review-share-label",
  "gate0-contact-retry",
  "gate0-contact-retry-label",
  "Retry later",
  "Retry not needed",
  "gate0-contact-report",
  "gate0-contact-report-label",
  "Report",
  "gate0-contact-block",
  "gate0-contact-block-label",
  "Block",
  "Raw LINE ID stays out of chat"
];
const requiredMockDataMarkers = [
  "GENERATED from packages/api-contracts/fixtures/gate0-smoke.json",
  "Gate0MockData",
  "Gate0PublicIdentity",
  "Gate0DiscoverProfile",
  "Gate0ChatRoom",
  "Gate0ChatMessage",
  "Gate0ContactCardModel",
  "Gate0ContactCardState",
  "mockUser",
  "discoverProfile",
  "chatRoom",
  "chatMessages",
  "contactCardsByState",
  "TM-BKK-001",
  "TM-PTY-031",
  "cex_gate0_line_001",
  "locked",
  "available",
  "revoked",
  "reported",
  "blocked",
  "providerUnavailable",
  "copyRawValue: false",
  "valueRedacted: true"
];
const legacyTabs = ["Chats", "My ID"];
const broadTabs = ["Activity", "Profile"];
const missing = [];

if (packageJson.scripts?.["mobile:mock-data:generate"] !== "node scripts/generate-mobile-mock-data.mjs") {
  missing.push("package.json must expose mobile:mock-data:generate");
}

if (packageJson.scripts?.["mobile:flutter:analyze"] !== "cd apps/mobile && flutter analyze") {
  missing.push("package.json must expose mobile:flutter:analyze");
}

if (packageJson.scripts?.["mobile:flutter:test"] !== "cd apps/mobile && flutter test") {
  missing.push("package.json must expose mobile:flutter:test");
}

if (packageJson.scripts?.["mobile:flutter:build:android"] !== "cd apps/mobile && flutter build apk --debug") {
  missing.push("package.json must expose mobile:flutter:build:android");
}

if (packageJson.scripts?.["mobile:flutter:build:web"] !== "cd apps/mobile && flutter build web") {
  missing.push("package.json must expose mobile:flutter:build:web");
}

if (packageJson.scripts?.["mobile:preview:web"] !== "cd apps/mobile && flutter run -d web-server --web-hostname=127.0.0.1 --web-port=5370") {
  missing.push("package.json must expose mobile:preview:web on a stable local port");
}

if (packageJson.scripts?.["mobile:run"] !== "cd apps/mobile && flutter run") {
  missing.push("package.json must run the real Flutter app for mobile:run");
}

if (!packageJson.scripts?.test?.includes("npm run mobile:flutter:analyze && npm run mobile:flutter:test")) {
  missing.push("package.json test must run Flutter analyze before Flutter widget tests");
}

if (!pubspecSource.includes("uses-material-design: true")) {
  missing.push("pubspec.yaml must bundle Material Icons for Flutter web and Android UI");
}

if (!pubspecSource.includes("cupertino_icons:")) {
  missing.push("pubspec.yaml must include cupertino_icons for Flutter web icon fonts");
}

if (!smokeSource.includes('"mobile:flutter:analyze"') || !smokeSource.includes('"mobile:flutter:test"')) {
  missing.push("smoke mobile stage must run Flutter analyze and widget tests");
}

if (!generatorSource.includes("packages/api-contracts/fixtures/gate0-smoke.json")) {
  missing.push("mobile mock data generator must read gate0-smoke.json");
}

if (!generatorSource.includes("apps/mobile/lib/gate0_mock_data.dart")) {
  missing.push("mobile mock data generator must write gate0_mock_data.dart");
}

if (!androidSettingsSource.includes("pluginManagement")) {
  missing.push("mobile Android scaffold must include settings.gradle.kts plugin management");
}

if (!androidBuildSource.includes("com.android.application") || !androidBuildSource.includes("dev.flutter.flutter-gradle-plugin")) {
  missing.push("mobile Android scaffold must apply Android and Flutter Gradle plugins");
}

if (!webIndexSource.includes("flutter_bootstrap.js")) {
  missing.push("mobile web preview scaffold must include Flutter bootstrap");
}

for (const [name, route] of requiredRoutes) {
  if (!source.includes(`'${name}'`) || !source.includes(`'${route}'`)) {
    missing.push(`${name} ${route}`);
  }
}

for (const tab of requiredTabs) {
  if (!source.includes(`'${tab}'`)) {
    missing.push(`tab ${tab}`);
  }
  if (!mainSource.includes(`'${tab}'`)) {
    missing.push(`shell tab ${tab}`);
  }
}

for (const marker of requiredShellMarkers) {
  if (!mainSource.includes(marker)) {
    missing.push(`mobile shell marker ${marker}`);
  }
}

for (const marker of requiredMockDataMarkers) {
  if (!mockDataSource.includes(marker)) {
    missing.push(`mobile mock data marker ${marker}`);
  }
}

const fixtureValues = [
  fixture.mockUser?.userId,
  fixture.mockUser?.publicIdentityId,
  fixture.mockUser?.publicId,
  fixture.mockUser?.displayName,
  fixture.mockUser?.city,
  fixture.discoverProfile?.publicIdentityId,
  fixture.discoverProfile?.displayName,
  String(fixture.discoverProfile?.age),
  fixture.discoverProfile?.city,
  fixture.chatRoom?.id,
  ...(fixture.chatRoom?.participantSnapshot || []).flatMap((participant) => [
    participant.userId,
    participant.publicIdentityId,
    participant.publicId,
    participant.displayName,
    participant.city
  ]),
  ...(fixture.chatMessages || []).flatMap((message) => [
    message.id,
    message.roomId,
    message.senderPublicIdentityId,
    message.body,
    message.contactExchangeId
  ]),
  fixture.contactExchange?.id,
  fixture.contactExchange?.provider,
  fixture.contactExchange?.status,
  fixture.contactCard?.id,
  fixture.contactCard?.contactExchangeId,
  fixture.contactCard?.displayLabel,
  ...(fixture.contactCardStates || []).flatMap((entry) => [
    dartContactCardStateName(entry.state),
    entry.contactExchange?.id,
    entry.contactExchange?.status,
    entry.contactCard?.id,
    entry.contactCard?.contactExchangeId,
    entry.contactCard?.displayLabel
  ])
].filter(Boolean);

for (const value of fixtureValues) {
  if (!mockDataSource.includes(String(value))) {
    missing.push(`mobile mock data must mirror fixture value: ${value}`);
  }
}

if (!mainSource.includes("import 'gate0_mock_data.dart';")) {
  missing.push("main.dart must import gate0_mock_data.dart");
}

if (packageJson.scripts?.["gate0:status"] !== "node scripts/gate0-status.mjs") {
  missing.push("package.json must expose gate0:status script");
}

if (packageJson.scripts?.["gate0:status:test"] !== "node scripts/check-gate0-status.mjs") {
  missing.push("package.json must expose gate0:status:test script");
}

for (const marker of [
  "Gate 0 status:",
  "Latest Android device smoke:",
  "Next gate:",
  "shouldPrintJson",
  "latestAndroidDeviceSmoke",
  "parseFieldArg",
  "TM_GATE0_STATUS_FIELD_MISSING",
  "Usage: npm run gate0:status -- [--json | --field <name> | --help]"
]) {
  if (!gate0StatusScript.includes(marker)) {
    missing.push(`gate0 status script must print: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 status command OK",
  "TM_GATE0_STATUS_TEST_FAILED",
  "fixture-run",
  "--json",
  "--field",
  "latestAndroidDeviceSmoke.status",
  "--help"
]) {
  if (!gate0StatusTestScript.includes(marker)) {
    missing.push(`gate0 status test must include: ${marker}`);
  }
}

for (const marker of [
  "GATE0_STATUS.md",
  "Gate 0 complete status"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link Gate 0 status: ${marker}`);
  }
}

for (const marker of [
  "GATE0_STATUS_COMMAND.md",
  "quick status command"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link Gate 0 status command: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 Status",
  "docs/dev/GATE0_STATUS.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link Gate 0 status doc: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 Status Command",
  "docs/dev/GATE0_STATUS_COMMAND.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link Gate 0 status command doc: ${marker}`);
  }
}

for (const marker of [
  "npm run gate0:status",
  "npm run gate0:status -- --json",
  "npm run gate0:status -- --field currentStatus",
  "npm run gate0:status -- --help",
  "TM_GATE0_STATUS_UNKNOWN_OPTION",
  "TM_GATE0_STATUS_OPTION_CONFLICT",
  "TM_GATE0_STATUS_FIELD_MISSING",
  "TM_GATE0_STATUS_FIELD_REQUIRED"
]) {
  if (!gate0StatusCommandDocs.includes(marker)) {
    missing.push(`Gate 0 status command doc must include: ${marker}`);
  }
}

for (const marker of [
  "CI",
  "docs/dev/CI.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link CI doc: ${marker}`);
  }
}

for (const marker of [
  "Design Status",
  "docs/dev/DESIGN_STATUS.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link design status doc: ${marker}`);
  }
}

for (const marker of [
  "Production Gaps",
  "docs/dev/PRODUCTION_GAPS.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link production gaps doc: ${marker}`);
  }
}

for (const marker of [
  "Roadmap",
  "docs/dev/ROADMAP.md"
]) {
  if (!readme.includes(marker)) {
    missing.push(`README must link roadmap doc: ${marker}`);
  }
}

for (const marker of [
  "CI.md",
  "current CI gate"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link CI doc: ${marker}`);
  }
}

for (const marker of [
  "ROADMAP.md",
  "Gate 0 completion state"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link roadmap: ${marker}`);
  }
}

for (const marker of [
  "PRODUCTION_GAPS.md",
  "production readiness"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link production gaps: ${marker}`);
  }
}

for (const marker of [
  "Next execution order",
  "Gate 0 completion state",
  "production readiness contract",
  "Secret injection and environment provisioning",
  "Live deploy rehearsal",
  "Store-track packaging"
]) {
  if (!roadmapDocs.includes(marker)) {
    missing.push(`roadmap doc must include: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 local vertical slice is executable on Flutter web, Windows, and Android device",
  "OPPO CPH2695 Android 16 smoke passed",
  "Full `npm test` baseline passed with 89 Flutter widget tests",
  "Production gates now move in this order: persistence -> AWS CI/deploy -> product review of Figma source -> release signing",
  "Full mobile build/device smoke after Flutter toolchain is installed"
]) {
  if (!todos.includes(marker)) {
    missing.push(`TODOS status must include: ${marker}`);
  }
}

for (const marker of [
  "DESIGN_STATUS.md",
  "current design source boundary"
]) {
  if (!devDocsReadme.includes(marker)) {
    missing.push(`developer docs index must link design status: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 production readiness blockers are closed",
  "Real auth/provider/storage integrations: closed",
  "Production backend persistence: closed",
  "AWS CI/deploy pipeline: closed",
  "Formal Figma/DESIGN.md source of truth: closed",
  "App store/release build signing: closed"
]) {
  if (!productionGapsDocs.includes(marker)) {
    missing.push(`production gaps doc must include: ${marker}`);
  }
}

for (const marker of [
  "Contract Drift Gate",
  "npm test",
  "smoke-runs",
  "AWS CI/deploy pipeline is configured",
  "AWS CI Deploy",
  "Android physical-device smoke remains manual"
]) {
  if (!ciDocs.includes(marker)) {
    missing.push(`CI doc must include: ${marker}`);
  }
}

for (const marker of [
  "DESIGN.md is the Gate 0 source of truth",
  "Figma source: https://www.figma.com/design/Jls4ueBkuNa53XXPKv6Yxw",
  "Gate 0 may use the local design system",
  "Figma Gate 0 screens now replace the placeholder source",
  "Public ID image templates are available for Flutter handoff"
]) {
  if (!designStatusDocs.includes(marker)) {
    missing.push(`design status doc must include: ${marker}`);
  }
}

for (const marker of [
  "Gate 0 complete with production readiness contract",
  "production readiness contract",
  "OPPO CPH2695",
  "2026-06-13T05-03-10-371Z",
  "XC95L7LZ4HJ7FIY9",
  ".thai-meet\\device-smoke\\runs\\2026-06-13T05-03-10-371Z.json",
  ".thai-meet\\device-smoke\\runs\\2026-06-13T05-03-10-371Z.png",
  "npm run mobile:device:result -- --strict",
  "Full test baseline: `npm test` passed with 89 Flutter widget tests",
  "Related docs:",
  "CI.md",
  "DESIGN_STATUS.md",
  "PRODUCTION_GAPS.md",
  "RELEASE_SIGNING.md",
  "ROADMAP.md",
  "AWS CI/deploy pipeline",
  "Formal Figma/DESIGN.md"
]) {
  if (!gate0Status.includes(marker)) {
    missing.push(`Gate 0 status doc must include: ${marker}`);
  }
}

const expectedNav = "Discover, Swipe, Chat, List, My";
for (const [label, text] of [["architecture", architecture], ["review checklist", reviewChecklist]]) {
  if (!text.includes(expectedNav)) {
    missing.push(`${label} must document Gate 0 nav as ${expectedNav}`);
  }
}

for (const marker of [
  "npm run mobile:device:smoke",
  "npm run mobile:device:result -- --strict"
]) {
  if (!reviewChecklist.includes(marker)) {
    missing.push(`review checklist must document Android device smoke check: ${marker}`);
  }
}

for (const [label, text] of [["README", readme], ["Getting Started", gettingStarted]]) {
  if (!text.includes("npm run mobile:run")) {
    missing.push(`${label} must document npm run mobile:run`);
  }
  if (!text.includes("npm run gate0:status")) {
    missing.push(`${label} must document npm run gate0:status`);
  }
  if (!text.includes("npm run gate0:status -- --json")) {
    missing.push(`${label} must document npm run gate0:status -- --json`);
  }
  if (!text.includes("npm run gate0:status -- --field currentStatus")) {
    missing.push(`${label} must document npm run gate0:status -- --field currentStatus`);
  }
  if (!text.includes("npm run gate0:status -- --help")) {
    missing.push(`${label} must document npm run gate0:status -- --help`);
  }
  if (!text.includes("npm run mobile:flutter:build:android")) {
    missing.push(`${label} must document Android debug build command`);
  }
  if (!text.includes("npm run mobile:device:result -- --strict")) {
    missing.push(`${label} must document strict Android device smoke result check`);
  }
  if (!text.includes("npm run mobile:preview:web")) {
    missing.push(`${label} must document local web preview command`);
  }
}

if (smokeDocs.includes("does not require Flutter")) {
  missing.push("Smoke docs must not claim npm test skips Flutter");
}

if (!smokeDocs.includes("checks Gate 0 route contract, Flutter analyzer, and Flutter widget tests")) {
  missing.push("Smoke docs must describe Flutter analyzer and widget tests in mobile stage");
}

for (const marker of [
  "npm run mobile:device:smoke",
  "npm run mobile:device:result -- --strict"
]) {
  if (!smokeDocs.includes(marker)) {
    missing.push(`Smoke docs must document physical Android smoke command: ${marker}`);
  }
}

for (const marker of [
  "Safety Ledger report/block transitions",
  "restored report review",
  "stale unblock notices"
]) {
  if (!changelog.includes(marker)) {
    missing.push(`CHANGELOG must document Safety Ledger transition rule: ${marker}`);
  }
}

for (const tab of legacyTabs) {
  if (source.includes(`'${tab}'`)) {
    missing.push(`legacy Gate 0 tab must not be visible: ${tab}`);
  }
}

for (const tab of broadTabs) {
  if (source.includes(`'${tab}'`)) {
    missing.push(`broad Gate 1+ tab must not be visible in Gate 0: ${tab}`);
  }
}

if (missing.length > 0) {
  console.error("TM_MOBILE_ROUTE_CONTRACT_DRIFT");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Gate 0 mobile route contract OK");

function dartContactCardStateName(state) {
  if (state === "provider_unavailable") return "providerUnavailable";
  return state;
}
