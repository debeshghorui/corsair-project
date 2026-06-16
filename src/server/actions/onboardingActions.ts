"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/server/auth/session";
import { secretsRepo, SECRET_OPENAI_KEY } from "@/server/repositories/secretsRepo";

export type KeyFormState = { error: string | null; ok: boolean };

export async function saveOpenAiKeyAction(
  _prev: KeyFormState,
  formData: FormData,
): Promise<KeyFormState> {
  const user = await requireUser();
  const key = String(formData.get("apiKey") ?? "").trim();

  if (!key.startsWith("sk-") || key.length < 20) {
    return { ok: false, error: "That doesn't look like a valid OpenAI API key" };
  }

  await secretsRepo.set(user.id, SECRET_OPENAI_KEY, key);
  revalidatePath("/onboarding");
  return { ok: true, error: null };
}
