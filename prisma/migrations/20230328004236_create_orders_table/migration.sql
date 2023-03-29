-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "automation_id" TEXT,
    "symbol" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "client_order_id" TEXT NOT NULL,
    "transact_time" TEXT NOT NULL,
    "order_type" TEXT NOT NULL,
    "order_side" TEXT NOT NULL,
    "order_status" TEXT NOT NULL,
    "is_maker" BOOLEAN,
    "limit_price" TEXT,
    "stop_price" TEXT,
    "avg_price" DECIMAL(18,8),
    "comission" TEXT,
    "net" DECIMAL(18,8),
    "quantity" TEXT NOT NULL,
    "iceberg_quantity" TEXT,
    "obs" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");
