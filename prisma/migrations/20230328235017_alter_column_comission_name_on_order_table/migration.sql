/*
  Warnings:

  - You are about to drop the column `comission` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "comission",
ADD COLUMN     "commission" TEXT;
