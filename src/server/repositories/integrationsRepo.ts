import { db } from "@/lib/db";

/**
 * Reads Corsair's own tables to determine which integrations a tenant has
 * connected. An account row for (tenant_id, integration) means OAuth completed.
 */
export const integrationsRepo = {
  async connectedPlugins(tenantId: string): Promise<string[]> {
    const result = await db.query<{ name: string }>(
      `SELECT DISTINCT i.name
         FROM corsair_accounts a
         JOIN corsair_integrations i ON i.id = a.integration_id
        WHERE a.tenant_id = $1`,
      [tenantId],
    );
    return result.rows.map((r) => r.name);
  },

  async isConnected(tenantId: string, plugin: string): Promise<boolean> {
    const plugins = await this.connectedPlugins(tenantId);
    return plugins.includes(plugin);
  },
};
