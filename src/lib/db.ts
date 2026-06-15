import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { db?: Pool };

export const db = globalForDb.db 
                ??= new Pool({ 
                    connectionString: process.env.DATABASE_URL 
                });

if (process.env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
}