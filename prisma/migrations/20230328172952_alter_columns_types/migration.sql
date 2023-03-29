/*
  Warnings:

  - Changed the type of `order_id` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transact_time` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "order_id",
ADD COLUMN     "order_id" INTEGER NOT NULL,
DROP COLUMN "transact_time",
ADD COLUMN     "transact_time" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");
