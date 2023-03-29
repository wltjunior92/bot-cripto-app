import { prisma } from '@/lib/prisma'
import { Prisma, Order } from '@prisma/client'
import { OrdersRepository } from '../ordersRepository'

export class PrismaOrdersRepository implements OrdersRepository {
  async getOrders({
    symbol,
    page = 1,
  }: {
    symbol?: string
    page?: number | undefined
  }): Promise<{ orders: Order[]; totalCount: number }> {
    const options: Prisma.OrderFindManyArgs = {
      orderBy: [
        {
          updated_at: 'desc',
        },
      ],
      take: 10,
      skip: 10 * (page - 1),
    }

    if (symbol) {
      if (symbol.length < 6) {
        options.where = {
          symbol: {
            contains: symbol,
          },
        }
      } else {
        options.where = {
          symbol,
        }
      }
    }
    const [totalCount, orders] = await prisma.$transaction([
      prisma.order.count(),
      prisma.order.findMany(options),
    ])

    return {
      orders,
      totalCount,
    }
  }

  async create(newOrder: Prisma.OrderCreateInput): Promise<Order | null> {
    const order = await prisma.order.create({ data: newOrder })

    return order
  }

  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({ where: { id } })

    return order
  }

  async findByOrderId(
    orderId: string,
    clientOrderId: string,
  ): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: { order_id: orderId, client_order_id: clientOrderId },
    })

    return order
  }

  async updateById(
    id: string,
    newOrder: Prisma.OrderUpdateInput,
  ): Promise<Order | null> {
    const currentOrder = await prisma.order.findUnique({ where: { id } })

    if (currentOrder) {
      const order = await prisma.order.update({
        where: { id: currentOrder.id },
        data: newOrder,
      })
      return order
    }
    return null
  }

  async updateByOrderId(
    orderId: string,
    clientOrderId: string,
    newOrder: Prisma.OrderUpdateInput,
  ): Promise<Order | null> {
    const currentOrder = await prisma.order.findFirst({
      where: { order_id: orderId, client_order_id: clientOrderId },
    })

    if (currentOrder) {
      const order = await prisma.order.update({
        where: { id: currentOrder.id },
        data: newOrder,
      })
      return order
    }
    return null
  }
}
