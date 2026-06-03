import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const fixturePath = path.join(root, "packages/api-contracts/fixtures/gate0-smoke.json");
const outDir = path.join(root, ".thai-meet/fixtures");
const outPath = path.join(outDir, "gate0-smoke.seeded.json");

const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(fixture, null, 2)}\n`);

console.log(`Gate 0 mock fixtures seeded: ${path.relative(root, outPath)}`);
