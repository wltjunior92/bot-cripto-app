import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { SyncSymbolsService } from '../syncSymbolsService'

export function makeSyncSymbolsService() {
  const symbolsRepository = new PrismaSymbolsRepository()
  const syncSymbolsService = new SyncSymbolsService(symbolsRepository)

  return syncSymbolsService
}
