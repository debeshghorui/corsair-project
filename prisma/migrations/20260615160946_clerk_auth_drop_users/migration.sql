/*
  Warnings:

  - You are about to drop the `message_ai` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tenant_secrets" DROP CONSTRAINT "tenant_secrets_user_id_fkey";

-- DropTable
DROP TABLE "message_ai";

-- DropTable
DROP TABLE "users";
