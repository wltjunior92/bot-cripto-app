import { BinanceExchange } from '@/lib/exchanges/binance'
import { SymbolsRepository } from '@/repositories/symbolsRepository'
import { Prisma } from '@prisma/client'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

type SyncSymbolsServiceRequest = {
  id: string
}

type ExchangeSymbols = {
  symbol: string
  baseAssetPrecision: number
  baseAsset: string
  quoteAssetPrecision: number
  quoteAsset: string
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

    const formatedSettings = {
      api_url: settings.apiUrl,
      access_key: settings.accessKey,
      secret_key: settings.secretKey,
    }

    const binance = new BinanceExchange(formatedSettings)

    const { symbols: exchangeSymbols } = await binance.exchangeInfo()

    const favoriteSymbols = (await this.symbolRepository.findFavorites()).map(
      (s) => s.symbol,
    )

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
          base_asset: item.baseAsset,
          quote_precision: item.quoteAssetPrecision,
          quote_asset: item.quoteAsset,
          min_notional: minNotionalFilter ? minNotionalFilter.minNotional : '1',
          min_lot_size: minLotSizeFilter ? minLotSizeFilter.minQty : '1',
          is_favorite: favoriteSymbols.some((s) => s === item.symbol),
        }
      },
    )

    await this.symbolRepository.deleteAll()
    await this.symbolRepository.sync(symbols)
  }
}
