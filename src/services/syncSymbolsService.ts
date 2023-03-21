import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Prisma } from '@prisma/client'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

type SyncSymbolsServiceRequest = {
  id: string
}

type ExchangeSymbols = {
  symbol: string
  baseAssetPrecision: number
  quoteAssetPrecision: number
  filters: {
    filterType: 'MIN_NOTIONAL' | 'LOT_SIZE'
    minNotional: string
    minQty: string
  }[]
}

export class SyncSymbolsService {
  constructor(private symbolRepository: SymbolsRepository) {}

  async execute({ id }: SyncSymbolsServiceRequest) {
    const settingsService = makeGetUserDataService()
    const settings = await settingsService.execute({ id })

    let formatedSettings
    try {
      formatedSettings = {
        api_url: settings.apiUrl,
        access_key: settings.accessKey,
        secret_key: settings.secretKey,
      }
    } catch (error) {
      console.log(error)
    }

    const { exchangeInfo } = require('../lib/exchanges/binance')(
      formatedSettings,
    )

    const { symbols: exchangeSymbols } = await exchangeInfo()

    const symbols: Prisma.SymbolCreateManyInput[] = exchangeSymbols.map(
      (item: ExchangeSymbols) => {
        const minNotionalFilter = item.filters.find(
          (f: any) => f.filterType === 'MIN_NOTIONAL',
        )
        const minLotSizeFilter = item.filters.find(
          (f: any) => f.filterType === 'LOT_SIZE',
        )

        return {
          symbol: item.symbol,
          base_precision: item.baseAssetPrecision,
          quote_precision: item.quoteAssetPrecision,
          min_notional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
          min_lot_size: minLotSizeFilter ? minLotSizeFilter.minQty : '1',
          is_favorite: false,
        }
      },
    )

    await this.symbolRepository.deleteAll()
    await this.symbolRepository.sync(symbols)
  }
}
