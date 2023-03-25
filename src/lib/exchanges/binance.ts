import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import Binance from 'node-binance-api'

type Settings = {
  access_key: string
  secret_key: string
  api_url: string
  stream_url: string
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
        stream: settings.stream_url.endsWith('/')
          ? settings.stream_url
          : `${settings.stream_url}/`,
      },
    })
  }

  async balance() {
    const userBalance = await this.binance.balance()
    return userBalance
  }

  async exchangeInfo() {
    return await this.binance.exchangeInfo()
  }

  async miniTickerStream(callback: (markets: any[]) => void) {
    this.binance.websockets.miniTicker((markets) => callback(markets))
  }

  async bookStream(callback: (order: any) => void) {
    this.binance.websockets.bookTickers((order: any) => callback(order))
  }

  async userDataStream(
    balanceCallback: (balance: any) => void,
    executionCallback: (executionData: any) => void,
    listStatusCallback?: (listStatusData: any) => void,
  ) {
    this.binance.websockets.userData(
      (balance) => balanceCallback(balance),
      (executionData) => executionCallback(executionData),
      (subscribedData) =>
        console.log(`userDataStream:subscribed: ${subscribedData}`),
      (listStatusData) => {
        if (listStatusCallback) {
          listStatusCallback(listStatusData)
        } else {
          console.log(listStatusData)
        }
      },
    )
  }
}
