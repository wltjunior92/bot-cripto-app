export type OrderDTO = {
  symbol: string
  order_side: 'BUY' | 'SELL'
  order_type: string
  quantity: string
  limit_price?: string | null | undefined
  automation_id?: string | null | undefined
  options?: {
    iceberg_quantity?: string | null | undefined
    stop_price?: string | null | undefined
    order_type?: string | null | undefined
  }
}
