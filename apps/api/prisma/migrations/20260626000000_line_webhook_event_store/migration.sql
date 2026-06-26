-- Persist LINE webhook idempotency keys.
-- Store only a hashed event key and safe event metadata; never store raw webhook payloads,
-- reply tokens, provider user IDs, message text, or raw webhookEventId values.

CREATE TABLE "LineWebhookEvent" (
  "id" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "provider" "ContactProvider" NOT NULL DEFAULT 'LINE',
  "eventType" TEXT,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LineWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LineWebhookEvent_event_key" ON "LineWebhookEvent"("eventKey");
CREATE INDEX "LineWebhookEvent_provider_received_idx" ON "LineWebhookEvent"("provider", "receivedAt");
CREATE INDEX "LineWebhookEvent_type_received_idx" ON "LineWebhookEvent"("eventType", "receivedAt");
