import { InMemorySymbolsRepository } from '@/repositories/inMemory/inMemorySymbolsRepository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetFavoriteSymbolsService } from './getFavoriteSymbolsService copy'

let symbolsRepository: InMemorySymbolsRepository
let sut: GetFavoriteSymbolsService

describe('Get Favorite Symbols Service', () => {
  beforeEach(async () => {
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new GetFavoriteSymbolsService(symbolsRepository)
  })

  it('shoud be able to get all favorite symbols', async () => {
    const { symbols } = await sut.execute()

    expect(symbols.every((s) => s.is_favorite)).toBeTruthy()
  })
})
