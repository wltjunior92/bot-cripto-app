-- CreateTable
CREATE TABLE "symbols" (
    "symbol" TEXT NOT NULL,
    "base_precision" INTEGER NOT NULL,
    "quote_precision" INTEGER NOT NULL,
    "min_notional" TEXT NOT NULL,
    "min_lot_size" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbols_pkey" PRIMARY KEY ("symbol")
);

-- CreateIndex
CREATE UNIQUE INDEX "symbols_symbol_key" ON "symbols"("symbol");
