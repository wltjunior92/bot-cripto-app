import { InMemorySymbolsRepository } from '@/repositories/inMemory/inMemorySymbolsRepository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetSymbolService } from './getSymbolService'

let symbolsRepository: InMemorySymbolsRepository
let sut: GetSymbolService

describe('Get Symbol Service', () => {
  beforeEach(async () => {
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new GetSymbolService(symbolsRepository)
  })

  it('shoud be able to get a specific symbol', async () => {
    const { symbol } = await sut.execute({ symbol: 'BTCBUSD' })

    expect(symbol?.symbol).toEqual('BTCBUSD')
  })

  it('shoud not be able to get a non existed symbol', async () => {
    const { symbol } = await sut.execute({ symbol: 'ABCDEF' })

    expect(symbol).toBeNull()
  })
})
