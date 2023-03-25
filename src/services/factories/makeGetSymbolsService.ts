import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetSymbolsService } from '../getSymbolsService'

export function makeGetSymbolsService() {
  const symbolsRepository = new PrismaSymbolsRepository()
  const service = new GetSymbolsService(symbolsRepository)

  return service
}
