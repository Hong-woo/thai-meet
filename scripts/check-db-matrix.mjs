import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["db:check"] !== "node scripts/check-db-matrix.mjs") {
  failures.push("package.json must expose db:check");
}

await requireFile("docs/dev/DB_CONSTRAINTS.md");

const doc = await readIfExists("docs/dev/DB_CONSTRAINTS.md");
const requiredTerms = [
  "UserIdentity",
  "PublicIdentity",
  "ExternalContact",
  "ChatRoomParticipant",
  "ChatMessage",
  "ContactExchange",
  "Block",
  "Report",
  "RewardLedger",
  "AuditEvent",
  "unique(provider, providerUserId)",
  "unique(publicId)",
  "unique(userId, provider) where isActive=true",
  "unique(roomId, userId, publicIdentityIdAtCreation)",
  "index(roomId, createdAt)",
  "index(senderPublicIdentityId)",
  "unique(blockerUserId, blockedUserId)",
  "unique(idempotencyKey) where idempotencyKey is not null",
  "Contact sharing must atomically create ContactExchange and ChatMessage"
];

for (const term of requiredTerms) {
  if (!doc.includes(term)) failures.push(`docs/dev/DB_CONSTRAINTS.md must include ${term}`);
}

if (failures.length > 0) {
  console.error("TM_DB_MATRIX_DRIFT");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Gate 0 DB constraints matrix OK");

async function requireFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    failures.push(`missing ${relativePath}`);
  }
}

async function readIfExists(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}
