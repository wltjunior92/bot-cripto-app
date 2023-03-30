import { Prisma, Symbol } from '@prisma/client'

export interface SymbolsRepository {
  sync(symbols: Prisma.SymbolCreateManyInput[]): Promise<void>
  update(
    symbol: string,
    newSymbol: Prisma.SymbolUpdateInput,
  ): Promise<Symbol | null>
  findBySymbol(symbol: string): Promise<Symbol | null>
  findFavorites(): Promise<Symbol[]>
  findAll(): Promise<Symbol[]>
  searchSymbols({
    search,
    onlyFavorites,
    page,
  }: {
    search?: string
    onlyFavorites?: boolean
    page?: number
  }): Promise<{ symbols: Symbol[]; totalCount: number; pageQty: number }>
  findQuotes(): Promise<(string | null)[]>
  deleteAll(): Promise<void>
}
