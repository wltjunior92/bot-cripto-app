import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { SyncOrderService } from '../syncOrderService'

export function makeSyncOrderService() {
  const repository = new PrismaOrdersRepository()
  const service = new SyncOrderService(repository)

  return service
}
