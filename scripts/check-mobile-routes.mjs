import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const routePath = path.join(root, "apps/mobile/lib/gate0_routes.dart");
const source = await readFile(routePath, "utf8");
const architecture = await readFile(path.join(root, "docs/dev/ARCHITECTURE.md"), "utf8");
const reviewChecklist = await readFile(path.join(root, "docs/dev/REVIEW_CHECKLIST.md"), "utf8");

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
const legacyTabs = ["Chats", "My ID"];
const broadTabs = ["Activity", "Profile"];
const missing = [];

for (const [name, route] of requiredRoutes) {
  if (!source.includes(`'${name}'`) || !source.includes(`'${route}'`)) {
    missing.push(`${name} ${route}`);
  }
}

for (const tab of requiredTabs) {
  if (!source.includes(`'${tab}'`)) {
    missing.push(`tab ${tab}`);
  }
}

const expectedNav = "Discover, Swipe, Chat, List, My";
for (const [label, text] of [["architecture", architecture], ["review checklist", reviewChecklist]]) {
  if (!text.includes(expectedNav)) {
    missing.push(`${label} must document Gate 0 nav as ${expectedNav}`);
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
