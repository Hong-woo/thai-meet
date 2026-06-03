import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const valuesPath = path.join(root, "packages/api-contracts/fixtures/privacy-leak-values.json");
const leakValues = JSON.parse(await readFile(valuesPath, "utf8")).values;

const scanRoots = [
  "apps",
  "packages",
  "scripts",
  "docs",
  ".github",
  ".thai-meet/smoke-runs",
  ".env.example",
  "README.md",
  "CONTRIBUTING.md"
];

const allowedFiles = new Set([
  normalize("packages/api-contracts/fixtures/privacy-leak-values.json"),
  normalize("scripts/check-privacy-leaks.mjs")
]);

const findings = [];
const requiredScanRoots = [
  "apps",
  "packages",
  "scripts",
  "docs",
  ".github",
  ".thai-meet/smoke-runs",
  ".env.example",
  "README.md",
  "CONTRIBUTING.md"
];

for (const requiredRoot of requiredScanRoots) {
  if (!scanRoots.includes(requiredRoot)) {
    findings.push({ file: "scripts/check-privacy-leaks.mjs", value: `missing scan root ${requiredRoot}` });
  }
}

for (const scanRoot of scanRoots) {
  await scanPath(path.join(root, scanRoot));
}

if (findings.length > 0) {
  console.error("TM_PRIVACY_LEAK_TEST_FAILED");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.value}`);
  }
  process.exit(1);
}

console.log("Gate 0 privacy leak checks OK");

async function scanPath(target) {
  let info;
  try {
    info = await stat(target);
  } catch {
    return;
  }

  if (info.isDirectory()) {
    const entries = await readdir(target);
    for (const entry of entries) {
      if (entry === "node_modules" || entry === ".dart_tool" || entry === "build") continue;
      await scanPath(path.join(target, entry));
    }
    return;
  }

  if (!info.isFile()) return;
  const relative = normalize(path.relative(root, target));
  if (allowedFiles.has(relative)) return;
  if (!isTextFile(relative)) return;

  const content = await readFile(target, "utf8");
  for (const value of leakValues) {
    if (content.includes(value)) {
      findings.push({ file: relative, value });
    }
  }
}

function normalize(value) {
  return value.replace(/\\/g, "/");
}

function isTextFile(file) {
  return /\.(dart|json|md|mjs|js|ts|yaml|yml|txt|env|example)$/.test(file) || !path.extname(file);
}
