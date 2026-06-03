import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(root, "packages/api-contracts/openapi/gate0.openapi.json");
const outDir = path.join(root, "packages/api-contracts/generated");
const outPath = path.join(outDir, "gate0.openapi.json");

const contract = JSON.parse(await readFile(contractPath, "utf8"));
await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(contract, null, 2)}\n`);

console.log(`OpenAPI scaffold generated: ${path.relative(root, outPath)}`);
