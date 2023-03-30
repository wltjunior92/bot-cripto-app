import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { SearchSymbolsService } from '../searchSymbolsService'

export function makeSearchSymbolsService() {
  const repository = new PrismaSymbolsRepository()
  const service = new SearchSymbolsService(repository)

  return service
}
