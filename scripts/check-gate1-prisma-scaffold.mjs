import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const schemaPath = "apps/api/prisma/schema.prisma";
const prismaConfigPath = "prisma.config.ts";
const migrationsPath = "apps/api/prisma/migrations";
const requiredModels = [
  "User",
  "UserIdentity",
  "PublicIdentity",
  "ExternalContact",
  "ChatRoom",
  "ChatRoomParticipant",
  "ChatMessage",
  "ContactExchange",
  "Block",
  "Report",
  "RewardLedger",
  "RewardConsumption",
  "AuditEvent",
  "LineWebhookEvent"
];
const requiredEnums = [
  "ContactProvider",
  "PublicIdentityStatus",
  "ContactExchangeStatus",
  "ChatMessageKind",
  "SafetyEventType",
  "RewardLedgerType"
];
const requiredMigrationTerms = [
  "CREATE TABLE \"User\"",
  "CREATE TABLE \"UserIdentity\"",
  "CREATE TABLE \"PublicIdentity\"",
  "CREATE TABLE \"ExternalContact\"",
  "CREATE TABLE \"ChatRoomParticipant\"",
  "CREATE TABLE \"ChatMessage\"",
  "CREATE TABLE \"ContactExchange\"",
  "CREATE TABLE \"Block\"",
  "CREATE TABLE \"Report\"",
  "CREATE TABLE \"RewardLedger\"",
  "CREATE TABLE \"RewardConsumption\"",
  "CREATE TABLE \"AuditEvent\"",
  "CREATE TABLE \"LineWebhookEvent\"",
  "CREATE UNIQUE INDEX \"UserIdentity_provider_providerUserId_key\"",
  "CREATE UNIQUE INDEX \"PublicIdentity_publicId_key\"",
  "CREATE UNIQUE INDEX \"ExternalContact_active_provider_key\"",
  "CREATE UNIQUE INDEX \"ChatRoomParticipant_room_user_public_identity_key\"",
  "CREATE UNIQUE INDEX \"Block_blocker_blocked_key\"",
  "CREATE UNIQUE INDEX \"RewardLedger_idempotency_key\"",
  "CREATE UNIQUE INDEX \"LineWebhookEvent_event_key\"",
  "CREATE INDEX \"ChatMessage_room_created_idx\"",
  "CREATE INDEX \"ChatMessage_sender_public_identity_idx\"",
  "CREATE INDEX \"ContactExchange_status_created_idx\"",
  "CREATE INDEX \"Report_reported_public_identity_created_idx\"",
  "CREATE INDEX \"LineWebhookEvent_provider_received_idx\""
];
const forbiddenPersistenceTerms = [
  "lineRaw",
  "rawLine",
  "facebookUrl",
  "qrPayload",
  "providerToken",
  "pushToken",
  "adKey"
];

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["gate1:prisma:test"] !== "node scripts/check-gate1-prisma-scaffold.mjs") {
  failures.push("package.json must expose gate1:prisma:test");
}
if (!String(packageJson.scripts?.["db:check:test"] || "").includes("npm run gate1:prisma:test")) {
  failures.push("db:check:test must include gate1:prisma:test");
}

const schema = await readRequired(schemaPath);
const prismaConfig = await readRequired(prismaConfigPath);
const migrationFiles = await listMigrationSqlFiles(migrationsPath);
const migrationSql = (
  await Promise.all(migrationFiles.map((filePath) => readFile(filePath, "utf8")))
).join("\n");

for (const model of requiredModels) {
  if (!schema.includes(`model ${model} `)) failures.push(`schema.prisma must define model ${model}`);
}
for (const enumName of requiredEnums) {
  if (!schema.includes(`enum ${enumName} `)) failures.push(`schema.prisma must define enum ${enumName}`);
}
if (schema.includes("url      = env(\"DATABASE_URL\")") || schema.includes("url = env(\"DATABASE_URL\")")) {
  failures.push("schema.prisma must keep DATABASE_URL in prisma.config.ts for Prisma 7 compatibility");
}
for (const term of [
  "defineConfig",
  "apps/api/prisma/schema.prisma",
  "apps/api/prisma/migrations",
  "datasource",
  "DATABASE_URL"
]) {
  if (!prismaConfig.includes(term)) failures.push(`prisma.config.ts must include ${term}`);
}
for (const term of [
  "@@unique([provider, providerUserId])",
  "@@unique([roomId, userId, publicIdentityIdAtCreation])",
  "@@unique([blockerUserId, blockedUserId])",
  "@@index([roomId, createdAt])",
  "@@index([senderPublicIdentityId])",
  "@@index([status, createdAt])",
  "@@index([reportedPublicIdentityId, createdAt])"
]) {
  if (!schema.includes(term)) failures.push(`schema.prisma must include ${term}`);
}
for (const term of requiredMigrationTerms) {
  if (!migrationSql.includes(term)) failures.push(`Gate 1 migration must include ${term}`);
}
for (const term of forbiddenPersistenceTerms) {
  if (schema.includes(term) || migrationSql.includes(term)) {
    failures.push(`Gate 1 persistence scaffold must not store raw provider secret field ${term}`);
  }
}
for (const term of [
  "Contact sharing must atomically create ContactExchange and ChatMessage",
  "ChatMessage must store senderPublicIdentityId at send time",
  "Report must store both reportedUserId and reportedPublicIdentityId",
  "Reward grant and reward consumption must be transactional and idempotent"
]) {
  if (!migrationSql.includes(term)) failures.push(`Gate 1 migration must document atomicity: ${term}`);
}

if (failures.length > 0) {
  console.error("TM_GATE1_PRISMA_SCAFFOLD_CHECK_FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

if (process.env.GATE1_PRISMA_SCAFFOLD_QUIET !== "1") {
  console.log("Gate 1 Prisma scaffold OK");
}

async function readRequired(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch (error) {
    failures.push(`missing ${relativePath}: ${error.message}`);
    return "";
  }
}

async function listMigrationSqlFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    await access(absolutePath);
  } catch (error) {
    failures.push(`missing ${relativePath}: ${error.message}`);
    return [];
  }

  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(absolutePath, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name === "migration.sql")
    .map((entry) => path.join(entry.parentPath || absolutePath, entry.name))
    .sort();
}
