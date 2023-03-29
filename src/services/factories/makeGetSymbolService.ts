import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { GetSymbolService } from '../getSymbolService'

export function makeGetSymbolService() {
  const repository = new PrismaSymbolsRepository()
  const service = new GetSymbolService(repository)

  return service
}
