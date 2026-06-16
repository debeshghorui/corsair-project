import OpenAI from "openai";

import { secretsRepo, SECRET_OPENAI_KEY } from "@/server/repositories/secretsRepo";
import type { MailPriority } from "@/types/mail";

export const AI_MODELS = {
  /** Cheap model for classification + agent reasoning. */
  fast: "gpt-4o-mini",
  /** Embedding model (1536-dim, matches the message_ai vector column). */
  embedding: "text-embedding-3-small",
} as const;

export class MissingOpenAiKeyError extends Error {
  constructor() {
    super("No OpenAI API key configured for this tenant");
    this.name = "MissingOpenAiKeyError";
  }
}

/** Build an OpenAI client from the tenant's BYOK key (decrypted server-side). */
async function clientFor(tenantId: string): Promise<OpenAI> {
  const apiKey = await secretsRepo.get(tenantId, SECRET_OPENAI_KEY);
  if (!apiKey) throw new MissingOpenAiKeyError();
  return new OpenAI({ apiKey });
}

const PRIORITIES: MailPriority[] = ["urgent", "important", "normal", "low"];

export const aiService = {
  clientFor,

  /** Classify an email into a priority bucket using a cheap model. */
  async classifyPriority(
    tenantId: string,
    input: { subject: string; from: string; snippet: string },
  ): Promise<MailPriority> {
    const client = await clientFor(tenantId);
    const completion = await client.chat.completions.create({
      model: AI_MODELS.fast,
      temperature: 0,
      max_tokens: 1,
      messages: [
        {
          role: "system",
          content:
            "You triage email. Reply with exactly one word: urgent, important, normal, or low. " +
            "urgent = needs a reply today or is time-sensitive; important = relevant but not urgent; " +
            "normal = routine; low = newsletters, promotions, automated noise.",
        },
        {
          role: "user",
          content: `From: ${input.from}\nSubject: ${input.subject}\n\n${input.snippet}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim().toLowerCase();
    return PRIORITIES.find((p) => raw?.startsWith(p)) ?? "normal";
  },

  /** Embed text into a 1536-dim vector for semantic search. */
  async embed(tenantId: string, text: string): Promise<number[]> {
    const client = await clientFor(tenantId);
    const res = await client.embeddings.create({
      model: AI_MODELS.embedding,
      input: text.slice(0, 8000),
    });
    return res.data[0]?.embedding ?? [];
  },
};
