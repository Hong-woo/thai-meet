import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const valuesPath = path.join(root, "packages/api-contracts/fixtures/privacy-leak-values.json");
const leakValues = JSON.parse(await readFile(valuesPath, "utf8")).values;
const scanRootFiles = true;

const scanRoots = [
  "apps",
  "packages",
  "scripts",
  "docs",
  "wireframes",
  "infra",
  ".github",
  ".thai-meet/smoke-runs",
  ".thai-meet/device-smoke",
  ".env.example",
  "README.md",
  "CONTRIBUTING.md",
  "DESIGN.md",
  "PRODUCT.md",
  "TODOS.md",
  "package.json",
  "pnpm-workspace.yaml"
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
  "wireframes",
  "infra",
  ".github",
  ".thai-meet/smoke-runs",
  ".thai-meet/device-smoke",
  ".env.example",
  "README.md",
  "CONTRIBUTING.md",
  "DESIGN.md",
  "PRODUCT.md",
  "TODOS.md",
  "package.json",
  "pnpm-workspace.yaml"
];

for (const requiredRoot of requiredScanRoots) {
  if (!scanRoots.includes(requiredRoot)) {
    findings.push({ file: "scripts/check-privacy-leaks.mjs", value: `missing scan root ${requiredRoot}` });
  }
}

if (!scanRootFiles) {
  findings.push({ file: "scripts/check-privacy-leaks.mjs", value: "missing root artifact scan" });
}

for (const requiredTextFile of [
  "privacy-regression.log",
  "privacy-regression.html",
  "privacy-regression.kts",
  "privacy-regression.properties",
  "privacy-regression.xml",
  "privacy-regression.kt",
  "privacy-regression.java",
  "privacy-regression.bat",
  "privacy-regression.cmd",
  "privacy-regression.ps1",
  "privacy-regression.sh",
  "privacy-regression.iml",
  "privacy-regression.png",
  "privacy-regression.jpg",
  "privacy-regression.jpeg",
  "privacy-regression.webp",
  "privacy-regression.svg",
  "privacy-regression.lock",
  "privacy-regression.toml",
  "privacy-regression.conf",
  "privacy-regression.ini",
  "privacy-regression.json"
]) {
  if (!isScannableFile(requiredTextFile)) {
    findings.push({ file: "scripts/check-privacy-leaks.mjs", value: `missing scan extension ${requiredTextFile}` });
  }
}

for (const scanRoot of scanRoots) {
  await scanPath(path.join(root, scanRoot));
}

if (scanRootFiles) {
  await scanRootScannableFiles();
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
  if (!isScannableFile(relative)) return;

  const content = await readFile(target);
  for (const value of leakValues) {
    if (content.includes(value)) {
      findings.push({ file: relative, value });
    }
  }
}

async function scanRootScannableFiles() {
  const entries = await readdir(root);
  for (const entry of entries) {
    const target = path.join(root, entry);
    const info = await stat(target);
    if (info.isFile()) {
      await scanPath(target);
    }
  }
}

function normalize(value) {
  return value.replace(/\\/g, "/");
}

function isScannableFile(file) {
  return /\.(dart|json|html|md|mjs|js|ts|yaml|yml|txt|log|kts|properties|xml|kt|java|bat|cmd|ps1|sh|iml|png|jpg|jpeg|webp|svg|lock|toml|conf|ini|env|example)$/.test(file) || !path.extname(file);
}
