-- Gate 1 persistence scaffold.
-- Contact sharing must atomically create ContactExchange and ChatMessage.
-- ChatMessage must store senderPublicIdentityId at send time.
-- Report must store both reportedUserId and reportedPublicIdentityId.
-- Reward grant and reward consumption must be transactional and idempotent.

CREATE TYPE "ContactProvider" AS ENUM ('LINE', 'FACEBOOK');
CREATE TYPE "PublicIdentityStatus" AS ENUM ('ACTIVE', 'ROTATED', 'HIDDEN', 'SUSPENDED');
CREATE TYPE "ContactExchangeStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'REVOKED', 'REPORTED', 'BLOCKED', 'PROVIDER_UNAVAILABLE');
CREATE TYPE "ChatMessageKind" AS ENUM ('TEXT', 'CONTACT_CARD', 'SYSTEM');
CREATE TYPE "SafetyEventType" AS ENUM ('REPORT', 'BLOCK', 'UNBLOCK', 'REVIEW_CLOSED');
CREATE TYPE "RewardLedgerType" AS ENUM ('MANUAL_GRANT', 'CONTACT_SHARE', 'ADMIN_ADJUSTMENT');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "activePublicIdentityId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserIdentity" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" "ContactProvider" NOT NULL,
  "providerUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserIdentity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PublicIdentity" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "publicId" TEXT NOT NULL,
  "handle" TEXT,
  "displayName" TEXT NOT NULL,
  "age" INTEGER,
  "city" TEXT,
  "status" "PublicIdentityStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "rotatedAt" TIMESTAMP(3),
  CONSTRAINT "PublicIdentity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalContact" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "publicIdentityId" TEXT,
  "provider" "ContactProvider" NOT NULL,
  "label" TEXT NOT NULL,
  "encryptedValue" TEXT NOT NULL,
  "valueFingerprint" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "ExternalContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatRoom" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatRoomParticipant" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "publicIdentityIdAtCreation" TEXT NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatRoomParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "senderUserId" TEXT NOT NULL,
  "senderPublicIdentityId" TEXT NOT NULL,
  "kind" "ChatMessageKind" NOT NULL DEFAULT 'TEXT',
  "body" TEXT,
  "contactExchangeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactExchange" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "senderUserId" TEXT NOT NULL,
  "receiverUserId" TEXT NOT NULL,
  "requestedByPublicIdentityId" TEXT NOT NULL,
  "targetPublicIdentityId" TEXT NOT NULL,
  "contactId" TEXT NOT NULL,
  "provider" "ContactProvider" NOT NULL,
  "status" "ContactExchangeStatus" NOT NULL DEFAULT 'LOCKED',
  "idempotencyKey" TEXT,
  "permissionScope" TEXT NOT NULL,
  "canViewContactCard" BOOLEAN NOT NULL DEFAULT false,
  "canCopyRawValue" BOOLEAN NOT NULL DEFAULT false,
  "canReport" BOOLEAN NOT NULL DEFAULT true,
  "canBlock" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "ContactExchange_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Block" (
  "id" TEXT NOT NULL,
  "blockerUserId" TEXT NOT NULL,
  "blockedUserId" TEXT NOT NULL,
  "visiblePublicIdentityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Report" (
  "id" TEXT NOT NULL,
  "reporterUserId" TEXT NOT NULL,
  "reportedUserId" TEXT NOT NULL,
  "reportedPublicIdentityId" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RewardLedger" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "publicIdentityId" TEXT,
  "type" "RewardLedgerType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "idempotencyKey" TEXT,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RewardLedger_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RewardConsumption" (
  "id" TEXT NOT NULL,
  "rewardLedgerId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "actionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RewardConsumption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditEvent" (
  "id" TEXT NOT NULL,
  "actorUserId" TEXT,
  "targetUserId" TEXT,
  "eventType" "SafetyEventType" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserIdentity_provider_providerUserId_key" ON "UserIdentity"("provider", "providerUserId");
CREATE INDEX "UserIdentity_user_idx" ON "UserIdentity"("userId");
CREATE UNIQUE INDEX "PublicIdentity_publicId_key" ON "PublicIdentity"("publicId");
CREATE UNIQUE INDEX "PublicIdentity_handle_key" ON "PublicIdentity"("handle") WHERE "handle" IS NOT NULL;
CREATE INDEX "PublicIdentity_user_status_idx" ON "PublicIdentity"("userId", "status");
CREATE INDEX "PublicIdentity_status_created_idx" ON "PublicIdentity"("status", "createdAt");
CREATE UNIQUE INDEX "ExternalContact_active_provider_key" ON "ExternalContact"("userId", "provider") WHERE "isActive" = true;
CREATE INDEX "ExternalContact_user_provider_idx" ON "ExternalContact"("userId", "provider");
CREATE INDEX "ExternalContact_public_identity_idx" ON "ExternalContact"("publicIdentityId");
CREATE UNIQUE INDEX "ChatRoomParticipant_room_user_public_identity_key" ON "ChatRoomParticipant"("roomId", "userId", "publicIdentityIdAtCreation");
CREATE INDEX "ChatRoomParticipant_user_public_identity_idx" ON "ChatRoomParticipant"("userId", "publicIdentityIdAtCreation");
CREATE INDEX "ChatRoomParticipant_room_idx" ON "ChatRoomParticipant"("roomId");
CREATE INDEX "ChatMessage_room_created_idx" ON "ChatMessage"("roomId", "createdAt");
CREATE INDEX "ChatMessage_sender_created_idx" ON "ChatMessage"("senderUserId", "createdAt");
CREATE INDEX "ChatMessage_sender_public_identity_idx" ON "ChatMessage"("senderPublicIdentityId");
CREATE INDEX "ContactExchange_room_created_idx" ON "ContactExchange"("roomId", "createdAt");
CREATE INDEX "ContactExchange_sender_receiver_idx" ON "ContactExchange"("senderUserId", "receiverUserId");
CREATE INDEX "ContactExchange_contact_idx" ON "ContactExchange"("contactId");
CREATE INDEX "ContactExchange_status_created_idx" ON "ContactExchange"("status", "createdAt");
CREATE UNIQUE INDEX "Block_blocker_blocked_key" ON "Block"("blockerUserId", "blockedUserId");
CREATE INDEX "Block_blocked_idx" ON "Block"("blockedUserId");
CREATE INDEX "Report_reported_user_created_idx" ON "Report"("reportedUserId", "createdAt");
CREATE INDEX "Report_reported_public_identity_created_idx" ON "Report"("reportedPublicIdentityId", "createdAt");
CREATE INDEX "Report_reporter_created_idx" ON "Report"("reporterUserId", "createdAt");
CREATE UNIQUE INDEX "RewardLedger_idempotency_key" ON "RewardLedger"("idempotencyKey") WHERE "idempotencyKey" IS NOT NULL;
CREATE INDEX "RewardLedger_user_type_expires_idx" ON "RewardLedger"("userId", "type", "expiresAt");
CREATE INDEX "RewardLedger_public_identity_idx" ON "RewardLedger"("publicIdentityId");
CREATE INDEX "RewardConsumption_reward_ledger_idx" ON "RewardConsumption"("rewardLedgerId");
CREATE INDEX "RewardConsumption_action_idx" ON "RewardConsumption"("actionType", "actionId");
CREATE INDEX "AuditEvent_actor_created_idx" ON "AuditEvent"("actorUserId", "createdAt");
CREATE INDEX "AuditEvent_target_created_idx" ON "AuditEvent"("targetUserId", "createdAt");
CREATE INDEX "AuditEvent_event_created_idx" ON "AuditEvent"("eventType", "createdAt");

ALTER TABLE "UserIdentity" ADD CONSTRAINT "UserIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublicIdentity" ADD CONSTRAINT "PublicIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalContact" ADD CONSTRAINT "ExternalContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalContact" ADD CONSTRAINT "ExternalContact_publicIdentityId_fkey" FOREIGN KEY ("publicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChatRoomParticipant" ADD CONSTRAINT "ChatRoomParticipant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoomParticipant" ADD CONSTRAINT "ChatRoomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatRoomParticipant" ADD CONSTRAINT "ChatRoomParticipant_publicIdentityIdAtCreation_fkey" FOREIGN KEY ("publicIdentityIdAtCreation") REFERENCES "PublicIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderPublicIdentityId_fkey" FOREIGN KEY ("senderPublicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_contactExchangeId_fkey" FOREIGN KEY ("contactExchangeId") REFERENCES "ContactExchange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_requestedByPublicIdentityId_fkey" FOREIGN KEY ("requestedByPublicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_targetPublicIdentityId_fkey" FOREIGN KEY ("targetPublicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContactExchange" ADD CONSTRAINT "ContactExchange_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "ExternalContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockerUserId_fkey" FOREIGN KEY ("blockerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Block" ADD CONSTRAINT "Block_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedPublicIdentityId_fkey" FOREIGN KEY ("reportedPublicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_publicIdentityId_fkey" FOREIGN KEY ("publicIdentityId") REFERENCES "PublicIdentity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RewardConsumption" ADD CONSTRAINT "RewardConsumption_rewardLedgerId_fkey" FOREIGN KEY ("rewardLedgerId") REFERENCES "RewardLedger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
