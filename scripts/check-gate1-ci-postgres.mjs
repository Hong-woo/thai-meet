import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const workflowPath = ".github/workflows/contract-drift.yml";
const workflow = await readFile(path.join(root, workflowPath), "utf8");
const failures = [];

const requiredTerms = [
  "gate1-postgres",
  "postgres:16-alpine",
  "POSTGRES_USER: thai_meet",
  "POSTGRES_PASSWORD: thai_meet",
  "POSTGRES_DB: thai_meet",
  "pg_isready",
  "DATABASE_URL: postgresql://thai_meet:thai_meet@localhost:5432/thai_meet",
  "PERSISTENCE_MODE: database",
  "npm run db:migrate",
  "npm run gate1:seed:database",
  "npm run gate1:live-smoke"
];

for (const term of requiredTerms) {
  if (!workflow.includes(term)) failures.push(`${workflowPath} must include ${term}`);
}

const databaseUrlMatches = workflow.match(/DATABASE_URL:\s*(.+)/g) || [];
for (const match of databaseUrlMatches) {
  if (match.includes("${{ secrets.")) {
    failures.push(`${workflowPath} Gate 1 CI smoke must use throwaway local DATABASE_URL, not repository secrets`);
  }
}

if (!/runs-on:\s*ubuntu-latest/.test(workflow)) {
  failures.push(`${workflowPath} Gate 1 Postgres smoke must run on ubuntu-latest`);
}

if (failures.length > 0) {
  console.error("TM_GATE1_CI_POSTGRES_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 1 CI Postgres workflow OK");
