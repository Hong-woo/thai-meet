import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const routePath = path.join(root, "apps/mobile/lib/gate0_routes.dart");
const source = await readFile(routePath, "utf8");

const requiredRoutes = [
  ["onboarding.login", "/login"],
  ["onboarding.publicId", "/onboarding/public-id"],
  ["onboarding.profile", "/onboarding/profile"],
  ["discover.index", "/discover"],
  ["discover.profileDetail", "/profile/:publicIdentityId"],
  ["discover.filters", "/discover/filters"],
  ["chats.index", "/chats"],
  ["chats.detail", "/chat/:roomId"],
  ["chats.lineContactCard", "/chat/:roomId/contact-card/line"],
  ["myId.index", "/my-id"],
  ["myId.generate", "/my-id/generate"],
  ["myId.lineSetup", "/my-id/contact/line"],
  ["safety.index", "/safety"],
  ["safety.report", "/safety/report/:targetType/:targetId"],
  ["safety.blockedUsers", "/safety/blocked-users"],
  ["safety.contactExchanges", "/safety/contact-exchanges"]
];

const requiredTabs = ["Discover", "Chats", "My ID", "Safety"];
const broadTabs = ["Swipe", "Activity", "Profile"];
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
