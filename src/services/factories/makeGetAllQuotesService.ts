import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetAllQuotesService } from '../getAllQuotesService'

export function makeGetAllQuotesService() {
  const symbolRepository = new PrismaSymbolsRepository()
  const service = new GetAllQuotesService(symbolRepository)

  return service
}
