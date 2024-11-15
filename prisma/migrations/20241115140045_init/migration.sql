/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - The required column `id` was added to the `verificationtokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "passwordResetAt" TIMESTAMP(3),
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "physicalActivityLevel" DROP NOT NULL,
ALTER COLUMN "goals" DROP NOT NULL,
ALTER COLUMN "dietPreference" DROP NOT NULL;

-- AlterTable
ALTER TABLE "verificationtokens" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'EMAIL',
ADD CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("id");
