import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { SyncSymbolsService } from '../syncSymbolsService'

export function makeSyncSymbolsService() {
  const repository = new PrismaSymbolsRepository()
  const service = new SyncSymbolsService(repository)

  return service
}
