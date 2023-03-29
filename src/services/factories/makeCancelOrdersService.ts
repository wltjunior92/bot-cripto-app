import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { CancelOrderService } from '../cancelOrderService'

export function makeCancelOrderService() {
  const repository = new PrismaOrdersRepository()
  const service = new CancelOrderService(repository)

  return service
}
