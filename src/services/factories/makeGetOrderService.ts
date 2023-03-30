import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { GetOrderService } from '../getOrderService'

export function makeGetOrderService() {
  const repository = new PrismaOrdersRepository()
  const service = new GetOrderService(repository)

  return service
}
