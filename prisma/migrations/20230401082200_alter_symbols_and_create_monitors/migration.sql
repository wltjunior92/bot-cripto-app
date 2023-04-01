-- CreateTable
CREATE TABLE "monitors" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL DEFAULT '*',
    "type" TEXT NOT NULL,
    "broadcast_label" TEXT,
    "interval" TEXT,
    "indexes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_system_mon" BOOLEAN NOT NULL DEFAULT false,
    "logs" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monitor_symbol_index" ON "monitors"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "monitors_type_symbol_interval_key" ON "monitors"("type", "symbol", "interval");

-- CreateIndex
CREATE INDEX "orders_order_id_index" ON "orders"("order_id");
