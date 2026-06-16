import "dotenv/config";

import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

import { db } from "@/lib/db";

/**
 * The root Corsair instance. Multi-tenant: every per-user operation must be
 * scoped via `corsair.withTenant(tenantId)` (see `@/server/tenant`).
 *
 * Integration-level credentials (Google OAuth client_id/secret/redirect_url)
 * are shared across tenants and set once via `scripts`/`setup`.
 */
export const corsair = createCorsair({
  plugins: [gmail(), googlecalendar()],
  database: db,
  kek: process.env.CORSAIR_KEK!,
  multiTenancy: true,
});

export type Corsair = typeof corsair;
