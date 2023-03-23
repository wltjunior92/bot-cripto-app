import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import Binance from 'node-binance-api'

type Settings = {
  access_key: string
  secret_key: string
  api_url: string
}

export class BinanceExchange {
  private binance

  constructor(settings: Settings | undefined) {
    if (!settings) {
      throw new InvalidExchangeSettingsError()
    }

    this.binance = new Binance({
      APIKEY: settings.access_key,
      APISECRET: settings.secret_key,
      family: 0,
      urls: {
        base: settings.api_url.endsWith('/')
          ? settings.api_url
          : `${settings.api_url}/`,
      },
    })
  }

  async exchangeInfo() {
    return await this.binance.exchangeInfo()
  }

  async miniTickerStream(callback: (markets: any[]) => void) {
    this.binance.websockets.miniTicker((markets) => callback(markets))
  }
}
