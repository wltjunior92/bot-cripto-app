import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { Server, WebSocket } from 'ws'

type Settings = {
  access_key: string
  secret_key: string
  api_url: string
  stream_url: string
}

export class ExchangeMonitor {
  private exchange
  private wss

  constructor(settings: Settings, wss: Server<WebSocket>) {
    if (!settings) {
      throw new InvalidExchangeSettingsError('ExchangeMonitor')
    }

    this.exchange = new BinanceExchange(settings)
    this.wss = wss
  }

  async execute() {
    await this.exchange.miniTickerStream((markets) => {
      // console.log(markets)
      if (!this.wss || !this.wss.clients) return
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ miniTicker: markets }))
        }
      })

      const book = Object.entries(markets).map((mkt) => {
        return { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close }
      })

      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ book }))
        }
      })
    })

    await this.exchange.userDataStream(
      (balanceData) => {
        if (!this.wss || !this.wss.clients) return
        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ balance: balanceData }))
          }
        })
      },
      (executionData) => {
        console.log(executionData)
      },
    )

    console.log('Exchange Monitor is running!')
  }
}
