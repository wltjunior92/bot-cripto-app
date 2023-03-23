import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Symbol } from '@prisma/client'

interface UpdateFavoriteSymbolServiceRequest {
  symbol: string
  value: boolean
}

interface UpdateFavoriteSymbolServiceResponse {
  symbol: Symbol | null
}

export class UpdateFavoriteSymbolService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute({
    value,
    symbol,
  }: UpdateFavoriteSymbolServiceRequest): Promise<UpdateFavoriteSymbolServiceResponse> {
    const updatedSymbol = await this.symbolRepository.update(symbol, {
      is_favorite: value,
    })

    return {
      symbol: updatedSymbol,
    }
  }
}
