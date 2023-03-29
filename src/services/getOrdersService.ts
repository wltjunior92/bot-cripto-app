import { OrdersRepository } from '@/repositories/ordersRepository'
import { Order } from '@prisma/client'

interface GetOrdersServiceRequest {
  symbol?: string
  page?: number
}

interface GetOrdersServiceResponse {
  orders: Order[]
  totalCount: number
}

export class GetOrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    symbol,
    page,
  }: GetOrdersServiceRequest): Promise<GetOrdersServiceResponse> {
    const { orders, totalCount } = await this.ordersRepository.getOrders({
      symbol,
      page,
    })

    return {
      orders,
      totalCount,
    }
  }
}
