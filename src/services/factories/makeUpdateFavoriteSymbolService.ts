import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { UpdateFavoriteSymbolService } from '../updateFavoriteSymbolService'

export function makeUpdateFavoriteSymbolService() {
  const symbolsRepository = new PrismaSymbolsRepository()
  const service = new UpdateFavoriteSymbolService(symbolsRepository)

  return service
}
