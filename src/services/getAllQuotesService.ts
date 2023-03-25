import { SymbolsRepository } from '@/repositories/symbolsRepository'

interface GetAllQuotesServiceResponse {
  quotes: (string | null)[]
}

export class GetAllQuotesService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute(): Promise<GetAllQuotesServiceResponse> {
    const quotes = await this.symbolRepository.findQuotes()

    return {
      quotes,
    }
  }
}
