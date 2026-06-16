import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(db) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
