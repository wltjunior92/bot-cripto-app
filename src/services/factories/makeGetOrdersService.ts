import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { GetOrdersService } from '../getOrdersService'

export function makeGetOrdersService() {
  const repository = new PrismaOrdersRepository()
  const service = new GetOrdersService(repository)

  return service
}
