/*
  Warnings:

  - The values [low,high] on the enum `PhysicalActivityLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PhysicalActivityLevel_new" AS ENUM ('sedentary', 'light', 'moderate', 'active', 'veryActive');
ALTER TABLE "users" ALTER COLUMN "physicalActivityLevel" TYPE "PhysicalActivityLevel_new" USING ("physicalActivityLevel"::text::"PhysicalActivityLevel_new");
ALTER TYPE "PhysicalActivityLevel" RENAME TO "PhysicalActivityLevel_old";
ALTER TYPE "PhysicalActivityLevel_new" RENAME TO "PhysicalActivityLevel";
DROP TYPE "PhysicalActivityLevel_old";
COMMIT;
