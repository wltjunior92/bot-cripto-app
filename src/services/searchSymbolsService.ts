import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Symbol } from '@prisma/client'

interface SearchSymbolsServiceRequest {
  search?: string
  onlyFavorites?: boolean
  page?: number
}

interface SearchSymbolsServiceResponse {
  symbols: Symbol[]
  totalCount: number
  pageQty: number
}

export class SearchSymbolsService {
  constructor(private symbolsRepository: SymbolsRepository) {}

  async execute({
    search,
    onlyFavorites,
    page,
  }: SearchSymbolsServiceRequest): Promise<SearchSymbolsServiceResponse> {
    const { symbols, totalCount, pageQty } =
      await this.symbolsRepository.searchSymbols({
        search,
        onlyFavorites,
        page,
      })

    return {
      symbols,
      totalCount,
      pageQty,
    }
  }
}
