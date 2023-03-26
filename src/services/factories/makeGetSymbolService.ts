import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetSymbolService } from '../getSymbolService'

export function makeGetSymbolService() {
  const symbolsRepository = new PrismaSymbolsRepository()
  const service = new GetSymbolService(symbolsRepository)

  return service
}
