import { PrismaSymbolsRepository } from '@/repositories/prisma/prismaSymbolsRepository'
import { UpdateFavoriteSymbolService } from '../updateFavoriteSymbolService'

export function makeUpdateFavoriteSymbolService() {
  const repository = new PrismaSymbolsRepository()
  const service = new UpdateFavoriteSymbolService(repository)

  return service
}
