import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetSymbolsService } from '../getSymbolsService'

export function makeGetSymbolsService() {
  const symbolsRepository = new PrismaSymbolsRepository()
  const getSymbolsService = new GetSymbolsService(symbolsRepository)

  return getSymbolsService
}
