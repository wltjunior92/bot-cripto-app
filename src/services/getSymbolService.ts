import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Symbol } from '@prisma/client'

interface GetSymbolServiceRequest {
  symbol: string
}

interface GetSymbolServiceResponse {
  symbol: Symbol | null
}

export class GetSymbolService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute({
    symbol,
  }: GetSymbolServiceRequest): Promise<GetSymbolServiceResponse> {
    const foundSymbol = await this.symbolRepository.findBySymbol(symbol)

    return {
      symbol: foundSymbol,
    }
  }
}
