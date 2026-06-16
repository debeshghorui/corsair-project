import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

/**
 * Per-tenant encrypted secrets (e.g. BYOK OpenAI key).
 * Plaintext is only ever decrypted server-side on demand.
 */
export const secretsRepo = {
  async set(userId: string, name: string, plaintext: string): Promise<void> {
    const ciphertext = encryptSecret(plaintext);
    await prisma.tenantSecret.upsert({
      where: { userId_name: { userId, name } },
      create: { userId, name, ciphertext },
      update: { ciphertext },
    });
  },

  async get(userId: string, name: string): Promise<string | null> {
    const row = await prisma.tenantSecret.findUnique({
      where: { userId_name: { userId, name } },
    });
    if (!row) return null;
    return decryptSecret(row.ciphertext);
  },

  async has(userId: string, name: string): Promise<boolean> {
    const count = await prisma.tenantSecret.count({ where: { userId, name } });
    return count > 0;
  },

  async delete(userId: string, name: string): Promise<void> {
    await prisma.tenantSecret
      .delete({ where: { userId_name: { userId, name } } })
      .catch(() => undefined);
  },
};

export const SECRET_OPENAI_KEY = "openai_api_key";
