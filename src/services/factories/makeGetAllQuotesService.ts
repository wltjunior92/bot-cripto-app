import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetAllQuotesService } from '../getAllQuotesService'

export function makeGetAllQuotesService() {
  const repository = new PrismaSymbolsRepository()
  const service = new GetAllQuotesService(repository)

  return service
}
