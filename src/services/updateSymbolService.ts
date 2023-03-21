import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Prisma, Symbol } from '@prisma/client'

interface UpdateSymbolServiceRequest {
  symbol: string
  newSymbol: Prisma.SymbolUpdateInput
}

interface UpdateSymbolServiceResponse {
  symbol: Symbol | null
}

export class UpdateSymbolService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute({
    symbol,
    newSymbol,
  }: UpdateSymbolServiceRequest): Promise<UpdateSymbolServiceResponse> {
    const foundSymbol = await this.symbolRepository.update(symbol, newSymbol)

    return {
      symbol: foundSymbol,
    }
  }
}
