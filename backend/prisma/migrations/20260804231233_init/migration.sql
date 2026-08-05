/*
  Warnings:

  - Changed the type of `type` on the `inventory_alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `inventory_movement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('ENTRY', 'EXIT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "inventory_alert" DROP CONSTRAINT "inventory_alert_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_batch" DROP CONSTRAINT "inventory_batch_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movement" DROP CONSTRAINT "inventory_movement_batch_id_fkey";

-- AlterTable
ALTER TABLE "inventory_alert" DROP COLUMN "type",
ADD COLUMN     "type" "AlertType" NOT NULL;

-- AlterTable
ALTER TABLE "inventory_batch" ALTER COLUMN "stock_current" SET DEFAULT 0,
ALTER COLUMN "stock_min" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "inventory_movement" DROP COLUMN "type",
ADD COLUMN     "type" "MovementType" NOT NULL;

-- DropEnum
DROP TYPE "alert_type";

-- DropEnum
DROP TYPE "movement_type";

-- AddForeignKey
ALTER TABLE "inventory_batch" ADD CONSTRAINT "inventory_batch_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alert" ADD CONSTRAINT "inventory_alert_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "inventory_batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
