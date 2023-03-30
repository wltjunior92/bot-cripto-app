import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
// @ts-ignore: Unreachable code error
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

  async buy(
    symbol: string,
    quantity: string,
    options: any,
    limit_price?: string | null | undefined,
  ) {
    if (limit_price) {
      return await this.binance.buy(symbol, quantity, limit_price, options)
    }
    return await this.binance.marketBuy(symbol, quantity)
  }

  async sell(
    symbol: string,
    quantity: string,
    options: any,
    limit_price?: string | null | undefined,
  ) {
    if (limit_price) {
      return await this.binance.sell(symbol, quantity, limit_price, options)
    }
    return await this.binance.marketSell(symbol, quantity)
  }

  async cancel(symbol: string, order_id: string) {
    return await this.binance.cancel(symbol, order_id)
  }

  async miniTickerStream(callback: (markets: any[]) => void) {
    this.binance.websockets.miniTicker((markets: any) => callback(markets))
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
      (balance: any) => balanceCallback(balance),
      (executionData: any) => executionCallback(executionData),
      (subscribedData: any) =>
        console.log(`userDataStream:subscribed: ${subscribedData}`),
      (listStatusData: any) => {
        if (listStatusCallback) {
          listStatusCallback(listStatusData)
        } else {
          console.log(listStatusData)
        }
      },
    )
  }

  async orderStatus(symbol: string, orderId: string) {
    return await this.binance.orderStatus(symbol, orderId)
  }

  async orderTrade(symbol: string, orderId: string) {
    const trades = await this.binance.trades(symbol)
    return trades.find((t: any) => t.orderId === parseFloat(orderId))
  }

  async chartStream(
    symbol: string,
    interval: string,
    callback: (value: any) => void,
  ) {
    this.binance.websockets.chart(
      symbol,
      interval,
      (symbol: any, interval: any, chart: any) => {
        const ohcl = this.binance.ohlc(chart)
        callback(ohcl)
      },
    )
  }
}
