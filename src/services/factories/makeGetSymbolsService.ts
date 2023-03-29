import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetSymbolsService } from '../getSymbolsService'

export function makeGetSymbolsService() {
  const repository = new PrismaSymbolsRepository()
  const service = new GetSymbolsService(repository)

  return service
}
