import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { PlaceOrderService } from '../placeOrderService'

export function makePlaceOrderService() {
  const repository = new PrismaOrdersRepository()
  const service = new PlaceOrderService(repository)

  return service
}
