import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { Server, WebSocket } from 'ws'
import * as tecIndicators from 'technicalindicators'

export type Settings = {
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
      this.broadcast({ miniTicker: markets })

      const book = Object.entries(markets).map((mkt) => {
        return { symbol: mkt[0], bestAsk: mkt[1].close, bestBid: mkt[1].close }
      })

      this.broadcast({ book })
    })

    await this.exchange.userDataStream(
      (balanceData) => {
        if (!this.wss || !this.wss.clients) return
        this.broadcast({ balance: balanceData })
      },
      (executionData) => {
        this.processExecutionData(executionData)
      },
    )

    await this.exchange.chartStream('BTCUSDT', '1m', (ohlc: any) => {
      this.processChartData(ohlc.close, (msg: any) => {
        console.log(msg)
      })
    })

    console.log('Exchange Monitor is running!')
  }

  processChartData(closes: any, callback: any) {
    const rsi = this.calcRSI(closes)
    console.log(rsi)
  }

  calcRSI(closes: any) {
    const rsiResult = tecIndicators.rsi({
      period: 14,
      values: closes,
    })
    return parseFloat(`${rsiResult.pop()}`)
  }

  async processExecutionData(executionData: any) {
    if (executionData.x === 'NEW') return

    const order: Prisma.OrderUpdateInput = {
      symbol: executionData.s,
      order_id: executionData.i,
      client_order_id:
        executionData.X === 'CANCELED' ? executionData.C : executionData.c,
      order_side: executionData.S,
      order_type: executionData.o,
      order_status: executionData.X,
      is_maker: executionData.m,
      transact_time: executionData.T,
    }

    if (order.order_status === 'FILLED') {
      const quoteAmount = parseFloat(executionData.Z)
      order.avg_price = (quoteAmount /
        parseFloat(executionData.z)) as unknown as Decimal
      order.commission = executionData.n
      const symbol = order.symbol as string
      const isQuoteCommission =
        executionData.N && symbol.endsWith(executionData.N)
      order.net = isQuoteCommission
        ? quoteAmount - parseFloat(`${order.commission}`)
        : (quoteAmount as unknown as Decimal)
    }

    if (order.order_status === 'REJECTED') {
      order.obs = executionData.r
    }

    setTimeout(() => {
      const ordersRepository = new PrismaOrdersRepository()
      ordersRepository
        .updateByOrderId(`${order.order_id}`, `${order.client_order_id}`, order)
        .then((order) => {
          this.broadcast({ execution: order })
        })
        .catch((error) => console.error(error))
    }, 1000)
  }

  broadcast(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}
