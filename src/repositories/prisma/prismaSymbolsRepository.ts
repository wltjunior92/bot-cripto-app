import { prisma } from '@/lib/prisma'
import { Prisma, Symbol } from '@prisma/client'
import { SymbolsRepository } from '../symbolsRepository'

export class PrismaSymbolsRepository implements SymbolsRepository {
  async sync(symbols: Prisma.SymbolCreateManyInput[]): Promise<void> {
    await prisma.symbol.createMany({
      data: symbols,
    })
  }

  async update(
    symbol: string,
    newSymbol: Prisma.SymbolUpdateInput,
  ): Promise<Symbol | null> {
    const updatedSymbol = prisma.symbol.update({
      data: newSymbol,
      where: { symbol },
    })

    return updatedSymbol
  }

  async findBySymbol(symbol: string): Promise<Symbol | null> {
    const foundSymbol = await prisma.symbol.findUnique({ where: { symbol } })

    return foundSymbol
  }

  async findAll(): Promise<Symbol[]> {
    const symbols = await prisma.symbol.findMany({
      orderBy: [{ is_favorite: 'desc' }],
    })

    return symbols
  }

  async findFavorites(): Promise<Symbol[]> {
    const symbols = await prisma.symbol.findMany({
      where: { is_favorite: true },
    })

    return symbols
  }

  async deleteAll(): Promise<void> {
    await prisma.symbol.deleteMany()
  }
}
