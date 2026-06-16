-- Enable pgvector for semantic email search
CREATE EXTENSION IF NOT EXISTS vector;

-- AI sidecar for cached Gmail messages: priority + summary + embedding, scoped per tenant.
CREATE TABLE IF NOT EXISTS "message_ai" (
    "tenant_id"  TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "account_id" TEXT,
    "priority"   TEXT,
    "summary"    TEXT,
    "embedding"  vector(1536),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "message_ai_pkey" PRIMARY KEY ("tenant_id", "message_id")
);

CREATE INDEX IF NOT EXISTS "message_ai_tenant_priority_idx"
    ON "message_ai" ("tenant_id", "priority");

-- Approximate nearest-neighbour index for cosine similarity search.
CREATE INDEX IF NOT EXISTS "message_ai_embedding_idx"
    ON "message_ai" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
