import { prisma } from '@/lib/prisma'
import { Prisma, Symbol } from '@prisma/client'
import { SymbolsRepository } from '../symbolsRepository'

export class PrismaSymbolsRepository implements SymbolsRepository {
  async findQuotes(): Promise<(string | null)[]> {
    const dbQuotes = await prisma.symbol.findMany({
      select: {
        quote_asset: true,
      },
    })

    const quotes = dbQuotes.map((q) => q.quote_asset)
    const filteredQuotes = [...new Set(quotes)]

    return filteredQuotes
  }

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

  async searchSymbols({
    search,
    onlyFavorites = false,
    page = 1,
  }: {
    search?: string
    onlyFavorites?: boolean
    page?: number
  }): Promise<{ symbols: Symbol[]; totalCount: number; pageQty: number }> {
    const pageQty = 10
    const options: Prisma.SymbolFindManyArgs = {
      orderBy: [
        {
          symbol: 'asc',
        },
      ],
      take: pageQty,
      skip: pageQty * (page - 1),
    }
    const countOptions: Prisma.SymbolCountArgs = {}
    if (search) {
      if (search.length < 6) {
        options.where = {
          symbol: {
            contains: search,
          },
        }
        countOptions.where = {
          symbol: {
            contains: search,
          },
        }
      } else {
        options.where = {
          symbol: search,
        }
        countOptions.where = {
          symbol: search,
        }
      }
    }
    if (onlyFavorites) {
      if (options.where) {
        options.where.is_favorite = true
      } else {
        options.where = {
          is_favorite: true,
        }
      }
      if (countOptions.where) {
        countOptions.where.is_favorite = true
      } else {
        countOptions.where = {
          is_favorite: true,
        }
      }
    }
    const [totalCount, symbols] = await prisma.$transaction([
      prisma.symbol.count(countOptions),
      prisma.symbol.findMany(options),
    ])

    return {
      symbols,
      totalCount,
      pageQty,
    }
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
