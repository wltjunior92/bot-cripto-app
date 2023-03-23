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
  deleteAll(): Promise<void>
}
