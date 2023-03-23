import { Prisma, Symbol } from '@prisma/client'
import { SymbolsRepository } from '../symbolsRepository'

export class InMemorySymbolsRepository implements SymbolsRepository {
  public items: Symbol[] | Prisma.SymbolUpdateInput[] = [
    {
      symbol: 'BTCBUSD',
      base_precision: 8,
      quote_precision: 8,
      min_notional: '0.1',
      min_lot_size: '0.1',
      is_favorite: true,
      created_at: new Date(),
    },
  ]

  async sync(symbols: Prisma.SymbolCreateManyInput[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async update(
    symbol: string,
    newSymbol: Prisma.SymbolUpdateInput,
  ): Promise<Symbol | null> {
    const symbolIndex = this.items.findIndex((item) => item.symbol === symbol)
    let updatedSymbol = this.items[symbolIndex]

    updatedSymbol = {
      ...updatedSymbol,
      ...newSymbol,
    }

    this.items[symbolIndex] = updatedSymbol

    return updatedSymbol as Symbol
  }

  async findBySymbol(symbol: string): Promise<Symbol | null> {
    const foundSymbol = this.items.find((item) => item.symbol === symbol)

    if (foundSymbol) {
      return foundSymbol as Symbol
    }
    return null
  }

  async findAll(): Promise<Symbol[]> {
    return this.items as Symbol[]
  }

  async findFavorites(): Promise<Symbol[]> {
    return this.items.filter((s) => s.is_favorite) as Symbol[]
  }

  async deleteAll(): Promise<void> {
    this.items = []
  }
}
