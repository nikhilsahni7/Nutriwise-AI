/*
  Warnings:

  - The values [sedentary,light,moderate,active,veryActive] on the enum `PhysicalActivityLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [southAmerican,northAmerican,indianSubcontinent] on the enum `Region` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PhysicalActivityLevel_new" AS ENUM ('level1', 'level2', 'level3', 'level4', 'level5');
ALTER TABLE "users" ALTER COLUMN "physicalActivityLevel" TYPE "PhysicalActivityLevel_new" USING ("physicalActivityLevel"::text::"PhysicalActivityLevel_new");
ALTER TYPE "PhysicalActivityLevel" RENAME TO "PhysicalActivityLevel_old";
ALTER TYPE "PhysicalActivityLevel_new" RENAME TO "PhysicalActivityLevel";
DROP TYPE "PhysicalActivityLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Region_new" AS ENUM ('south_america', 'north_america', 'indian_subcontinent', 'european');
ALTER TABLE "users" ALTER COLUMN "region" TYPE "Region_new" USING ("region"::text::"Region_new");
ALTER TYPE "Region" RENAME TO "Region_old";
ALTER TYPE "Region_new" RENAME TO "Region";
DROP TYPE "Region_old";
COMMIT;
