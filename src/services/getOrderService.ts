import { OrdersRepository } from '@/repositories/ordersRepository'
import { Order } from '@prisma/client'

interface GetOrderServiceRequest {
  id: string
}

interface GetOrderServiceResponse {
  order: Order | null
}

export class GetOrderService {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderServiceRequest): Promise<GetOrderServiceResponse> {
    const order = await this.ordersRepository.findById(id)

    return {
      order,
    }
  }
}
