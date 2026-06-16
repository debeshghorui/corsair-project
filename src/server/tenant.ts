import { corsair } from "@/server/corsair";
import { getTenantId } from "@/server/auth/session";

/** Corsair client scoped to an explicit tenant id. */
export function tenantClientFor(tenantId: string) {
  return corsair.withTenant(tenantId);
}

/** Corsair client scoped to the currently authenticated user. */
export async function tenantClient() {
  const tenantId = await getTenantId();
  if (!tenantId) {
    throw new Error("No authenticated tenant in scope");
  }
  return tenantClientFor(tenantId);
}

export type TenantClient = ReturnType<typeof tenantClientFor>;
