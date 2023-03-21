import { InMemorySymbolsRepository } from '@/repositories/inMemory/inMemorySymbolsRepository'
import { Prisma } from '@prisma/client'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetSymbolService } from './getSymbolService'
import { UpdateSymbolService } from './updateSymbolService'

let symbolsRepository: InMemorySymbolsRepository
let sut: UpdateSymbolService

describe('Update Symbol Service', () => {
  beforeEach(async () => {
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new UpdateSymbolService(symbolsRepository)
  })

  it('shoud be able to update a symbol', async () => {
    const getSymbolService = new GetSymbolService(symbolsRepository)
    const loadedSymbol = getSymbolService.execute({ symbol: 'BTCBUSD' })

    const newSymbol: Prisma.SymbolUpdateInput = {
      ...loadedSymbol,
      min_lot_size: '0.01',
    }

    const { symbol } = await sut.execute({ symbol: 'BTCBUSD', newSymbol })

    expect(symbol?.min_lot_size).toEqual('0.01')
  })
})
