import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Symbol } from '@prisma/client'

interface GetSymbolsServiceResponse {
  symbols: Symbol[]
}

export class GetSymbolsService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute(): Promise<GetSymbolsServiceResponse> {
    const symbols = await this.symbolRepository.findAll()

    return {
      symbols,
    }
  }
}
