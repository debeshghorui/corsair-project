-- CreateTable
CREATE TABLE "message_ai" (
    "tenant_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "account_id" TEXT,
    "priority" TEXT,
    "summary" TEXT,
    "embedding" vector(1536),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_ai_pkey" PRIMARY KEY ("tenant_id","message_id")
);

-- CreateIndex
CREATE INDEX "message_ai_tenant_id_priority_idx" ON "message_ai"("tenant_id", "priority");
