import { InMemorySymbolsRepository } from '@/repositories/inMemory/inMemorySymbolsRepository'
import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateFavoriteSymbolService } from './updateFavoriteSymbolService'

let symbolsRepository: InMemorySymbolsRepository
let sut: UpdateFavoriteSymbolService

describe('Update Favorite Symbol Service', () => {
  beforeEach(async () => {
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new UpdateFavoriteSymbolService(symbolsRepository)
  })

  it('shoud be able to change a symbol favorite value', async () => {
    const { symbol } = await sut.execute({ symbol: 'BTCBUSD', value: false })

    expect(symbol?.is_favorite).toEqual(false)
    expect(symbol?.symbol).toEqual('BTCBUSD')
  })
})
