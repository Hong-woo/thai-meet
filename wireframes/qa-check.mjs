import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "wireframes", "index.html");
const html = await readFile(file, "utf8");
const design = await readFile(path.join(root, "DESIGN.md"), "utf8");
const product = await readFile(path.join(root, "PRODUCT.md"), "utf8");

const requiredRoutes = [
  "PublicMeetIdSetup",
  "DiscoverSwipe",
  "DiscoverNearby",
  "ProfileDetail",
  "ChatContactCard",
  "FirstShareConfirmation",
  "MyPublicMeetId",
  "ListSafetyActions"
];

const requiredSections = [
  "interaction-contract",
  "accessibility-contract",
  "localization-contract",
  "component-contract",
  "qa-contract"
];

const requiredNavLabels = [
  "Discover",
  "Swipe",
  "Chat",
  "List",
  "My"
];

const requiredPrimitives = [
  "surface-card",
  "contact-card-state",
  "sheet-panel",
  "state-pill",
  "id-badge"
];

const failures = [];

function requireIncludes(label, needle) {
  if (!html.includes(needle)) failures.push(`${label}: missing ${needle}`);
}

function requireNotIncludes(label, needle) {
  if (html.includes(needle)) failures.push(`${label}: forbidden ${needle}`);
}

function requireTextIncludes(label, text, needle) {
  if (!text.includes(needle)) failures.push(`${label}: missing ${needle}`);
}

function requireTextNotIncludes(label, text, needle) {
  if (text.includes(needle)) failures.push(`${label}: forbidden ${needle}`);
}

function count(pattern) {
  return [...html.matchAll(pattern)].length;
}

for (const route of requiredRoutes) {
  requireIncludes("route", `data-route="${route}"`);
  requireTextIncludes("design route", design, `- \`${route}\``);
}

for (const section of requiredSections) {
  requireIncludes("section", `id="${section}"`);
}

for (const [index, label] of requiredNavLabels.entries()) {
  requireIncludes("navigation", `<span class="single-line-safe">${label}</span>`);
  requireTextIncludes("design nav", design, `${index + 1}. ${label}.`);
}

for (const primitive of requiredPrimitives) {
  requireIncludes("primitive", primitive);
}

requireIncludes("motion", "--motion-ease-out");
requireIncludes("motion", "prefers-reduced-motion");
requireIncludes("accessibility", 'aria-current="page"');
requireIncludes("accessibility", 'role="progressbar"');
requireIncludes("navigation", 'aria-label="Primary app navigation"');
requireIncludes("localization", "Localization Contract");
requireIncludes("localization", "ไทย");
requireIncludes("localization", "한국어");
requireIncludes("localization", "中文");
requireIncludes("localization", "日本語");
requireIncludes("wrapping", "single-line-safe");
requireIncludes("wrapping", "overflow-wrap: anywhere");

requireNotIncludes("css", "transition: all");
requireNotIncludes("legacy", "profile-art");
requireNotIncludes("legacy", ">chatting<");
requireNotIncludes("legacy", ">list<");
requireTextNotIncludes("product legacy", product, "chatting");
requireTextNotIncludes("design legacy", design, "DiscoverSearch");
requireTextNotIncludes("design legacy", design, "LineContactExchange");
requireTextNotIncludes("design legacy", design, "PublicIdHome");
requireTextNotIncludes("design legacy", design, "PublicIdRegenerate");

const routeCount = count(/data-route="/g);
const navCount = count(/aria-label="Primary app navigation"/g);
const currentCount = count(/<a\b[^>]*aria-current="page"/g);
const progressCount = count(/<div\b[^>]*role="progressbar"/g);
const navSafeCount = count(/class="single-line-safe"/g);

if (routeCount !== requiredRoutes.length) failures.push(`route count: expected ${requiredRoutes.length}, got ${routeCount}`);
if (navCount !== 4) failures.push(`primary nav count: expected 4, got ${navCount}`);
if (currentCount !== 4) failures.push(`aria-current count: expected 4, got ${currentCount}`);
if (progressCount !== 2) failures.push(`progressbar count: expected 2, got ${progressCount}`);
if (navSafeCount < 20) failures.push(`nav safe label count: expected at least 20, got ${navSafeCount}`);

const summary = {
  file: path.relative(root, file),
  routes: routeCount,
  primaryNavs: navCount,
  currentTabs: currentCount,
  progressbars: progressCount,
  navSafeLabels: navSafeCount,
  failures
};

if (failures.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(summary, null, 2));
