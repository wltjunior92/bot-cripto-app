import { Prisma, Order } from '@prisma/client'

export interface OrdersRepository {
  getOrders({
    symbol,
    page,
  }: {
    symbol?: string
    page?: number
  }): Promise<{ orders: Order[]; totalCount: number }>
  create(newOrder: Prisma.OrderCreateInput): Promise<Order | null>
  findById(id: string): Promise<Order | null>
  findByOrderId(orderId: string, clientOrderId: string): Promise<Order | null>
  updateById(
    id: string,
    newOrder: Prisma.OrderUpdateInput,
  ): Promise<Order | null>
  updateByOrderId(
    orderId: string,
    clientOrderId: string,
    newOrder: Prisma.OrderUpdateInput,
  ): Promise<Order | null>
}
