import { InMemorySymbolsRepository } from '@/repositories/inMemory/inMemorySymbolsRepository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetSymbolsService } from './getSymbolsService'

let symbolsRepository: InMemorySymbolsRepository
let sut: GetSymbolsService

describe('Get Symbols Service', () => {
  beforeEach(async () => {
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new GetSymbolsService(symbolsRepository)
  })

  it('shoud be able to get all symbols', async () => {
    const { symbols } = await sut.execute()

    expect(symbols[0].symbol).toEqual('BTCBUSD')
  })
})
