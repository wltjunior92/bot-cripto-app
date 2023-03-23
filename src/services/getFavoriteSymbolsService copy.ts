import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Symbol } from '@prisma/client'

interface GetFavoriteSymbolsServiceResponse {
  symbols: Symbol[]
}

export class GetFavoriteSymbolsService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute(): Promise<GetFavoriteSymbolsServiceResponse> {
    const symbols = await this.symbolRepository.findFavorites()

    return {
      symbols,
    }
  }
}
