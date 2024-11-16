/*
  Warnings:

  - The values [BREAKFAST,LUNCH,DINNER,SNACK] on the enum `MealType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseEndTime` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseIntensity` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseStartTime` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `sleepEndTime` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `sleepStartTime` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `dishId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `inputMethod` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `nutrientId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the `dishes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrients` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `portions` on table `meals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `meals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MealType_new" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
ALTER TABLE "meals" ALTER COLUMN "mealType" TYPE "MealType_new" USING ("mealType"::text::"MealType_new");
ALTER TYPE "MealType" RENAME TO "MealType_old";
ALTER TYPE "MealType_new" RENAME TO "MealType";
DROP TYPE "MealType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_dishId_fkey";

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_nutrientId_fkey";

-- AlterTable
ALTER TABLE "daily_logs" DROP COLUMN "createdAt",
DROP COLUMN "exerciseEndTime",
DROP COLUMN "exerciseIntensity",
DROP COLUMN "exerciseStartTime",
DROP COLUMN "sleepEndTime",
DROP COLUMN "sleepStartTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "totalCalcium" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalFiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalIron" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalPotassium" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalVitaminA" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalVitaminC" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "dishId",
DROP COLUMN "inputMethod",
DROP COLUMN "nutrientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "calcium" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fats" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "iron" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "potassium" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vitaminA" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vitaminC" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "portions" SET NOT NULL,
ALTER COLUMN "portions" SET DEFAULT 1,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- DropTable
DROP TABLE "dishes";

-- DropTable
DROP TABLE "nutrients";

-- DropEnum
DROP TYPE "ExerciseIntensity";

-- DropEnum
DROP TYPE "InputMethod";
