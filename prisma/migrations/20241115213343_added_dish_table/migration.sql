/*
  Warnings:

  - You are about to drop the column `date` on the `meals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daily_logs" ADD COLUMN     "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCarbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalFats" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalProtein" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "date",
ADD COLUMN     "dishId" TEXT;

-- AlterTable
ALTER TABLE "nutrients" ADD COLUMN     "fiber" DOUBLE PRECISION,
ALTER COLUMN "iron" DROP NOT NULL,
ALTER COLUMN "calcium" DROP NOT NULL,
ALTER COLUMN "potassium" DROP NOT NULL,
ALTER COLUMN "vitaminA" DROP NOT NULL,
ALTER COLUMN "vitaminC" DROP NOT NULL;

-- CreateTable
CREATE TABLE "dishes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cuisine" TEXT,
    "servingSize" DOUBLE PRECISION NOT NULL,
    "servingUnit" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
