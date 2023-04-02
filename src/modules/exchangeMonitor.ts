import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { PrismaOrdersRepository } from '@/repositories/prisma/prismaOrdersRepository'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { Server, WebSocket } from 'ws'

import { makeGetActiveMonitorsService } from '@/services/factories/makeGetActiveMonitorsService'
import * as sysIndexes from '../utils/indexes'
import { indexKeys, monitorTypes } from '@/utils/constants'
import { Intelligence } from './intelligence'

export type Settings = {
  access_key: string
  secret_key: string
  api_url: string
  stream_url: string
}

export class ExchangeMonitor {
  private exchange
  private wss
  private intelligence: Intelligence

  constructor(
    settings: Settings,
    wss: Server<WebSocket>,
    intelligenceInstance: Intelligence,
  ) {
    if (!settings || !intelligenceInstance) {
      throw new InvalidExchangeSettingsError('ExchangeMonitor')
    }

    this.exchange = new BinanceExchange(settings)
    this.wss = wss
    this.intelligence = intelligenceInstance

    const getActiveMonitorsService = makeGetActiveMonitorsService()
    getActiveMonitorsService
      .execute()
      .then((monitors) => {
        monitors.map((monitor) => {
          setTimeout(() => {
            switch (monitor.type) {
              case monitorTypes.MINI_TICKER:
                return this.startMiniTickerMonitor(
                  monitor.broadcast_label,
                  monitor.logs,
                )
              // case monitorTypes.BOOK:
              case monitorTypes.USER_DATA:
                return this.startUserDataMonitor(
                  monitor.broadcast_label,
                  monitor.logs,
                )
              case monitorTypes.CANDLES:
                return this.startChartMonitor(
                  monitor.symbol,
                  monitor.interval,
                  monitor.indexes?.split(',') || [],
                  monitor.broadcast_label,
                  monitor.logs,
                )
            }
          }, 250)
        })
      })
      .catch((error) => console.error(error))
      .finally(() => console.log('Exchange Monitor is running!'))
  }

  async startMiniTickerMonitor(broadcastLabel: string | null, logs: boolean) {
    if (!this.exchange)
      return new Error('ExchangeMonitor ainda não foi inicializado.')
    this.exchange.miniTickerStream((markets) => {
      if (logs) console.log(markets)

      // enviar para o intelligence
      Object.entries(markets).forEach((mkt: any) => {
        delete mkt[1].volume
        delete mkt[1].quoteVolume
        delete mkt[1].eventTime
        const converted: any = {}
        Object.entries(mkt[1]).forEach(
          (prop: any) => (converted[prop[0]] = parseFloat(prop[1])),
        )
        this.intelligence.updateMemory(
          mkt[0],
          indexKeys.MINI_TICKER,
          null,
          converted,
        )
      })

      if (broadcastLabel && this.wss) {
        this.broadcast({ [broadcastLabel]: markets })
      }

      // simulação de book
      const books = Object.entries(markets).map((mkt) => {
        const book = {
          symbol: mkt[0],
          bestAsk: mkt[1].close,
          bestBid: mkt[1].close,
        }

        this.intelligence.updateMemory(mkt[0], indexKeys.BOOK, null, book)
        return book
      })
      if (this.wss) {
        this.broadcast({ book: books })
      }
      // fim da simulação de book
    })
    console.log(`Mini-Ticker Monitor has started at ${broadcastLabel}!`)
  }

  async startUserDataMonitor(broadcastLabel: string | null, logs: boolean) {
    if (!this.exchange)
      return new Error('ExchangeMonitor ainda não foi inicializado.')

    const result = broadcastLabel?.split(',')
    const balanceBroadcast = result ? result[0] : null
    const executionBroadcast = result ? result[1] : null

    await this.loadWallet()

    this.exchange.userDataStream(
      async (balanceData) => {
        if (!this.wss || !this.wss.clients) return
        if (logs) console.log(balanceData)
        const wallet = await this.loadWallet()

        if (balanceBroadcast && this.wss) {
          this.broadcast({ [balanceBroadcast]: wallet })
        }
      },
      (executionData) => {
        if (logs) console.log(executionData)
        this.processExecutionData(executionData, executionBroadcast)
      },
    )
    console.log(`User Data Monitor has started at ${broadcastLabel}!`)
  }

  async processExecutionData(
    executionData: any,
    broadcastLabel: string | null,
  ) {
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
          if (order) {
            // enviar para o intelligence

            this.intelligence.updateMemory(
              order.symbol,
              indexKeys.LAST_ORDER,
              null,
              order,
            )

            if (broadcastLabel && this.wss) {
              this.broadcast({ [broadcastLabel]: order })
            }
          }
        })
        .catch((error) => console.error(error))
    }, 1000)
  }

  startChartMonitor(
    symbol: string,
    interval: string | null,
    indexes: string[],
    broadcastLabel: string | null,
    logs: boolean,
  ) {
    if (!symbol)
      return new Error(`You can't start a chart monitor without a symbol`)
    if (!this.exchange)
      return new Error('ExchangeMonitor ainda não foi inicializado.')

    this.exchange.chartStream(symbol, interval || '1m', (ohlc: any) => {
      const lastCandle = {
        open: ohlc.open.pop(),
        close: ohlc.close.pop(),
        high: ohlc.high.pop(),
        low: ohlc.low.pop(),
      }

      if (logs) console.log(lastCandle)

      // enviar para o intelligence
      this.intelligence.updateMemory(
        symbol,
        indexKeys.LAST_CANDLE,
        interval,
        lastCandle,
      )

      if (broadcastLabel && this.wss) {
        this.broadcast(lastCandle)
      }

      this.processChartData(symbol, indexes, interval, ohlc)
    })
    console.log(`Chart Monitor has started at ${symbol}_${interval}!`)
  }

  async loadWallet() {
    if (!this.exchange)
      return new Error('ExchangeMonitor ainda não foi inicializado.')
    const info = await this.exchange.balance()
    const wallet = Object.entries(info).map((item: any) => {
      // enviar para o intelligence

      this.intelligence.updateMemory(
        item[0],
        indexKeys.WALLET,
        null,
        parseFloat(item[1].available),
      )

      return {
        symbol: item[0],
        available: item[1].available,
        onOrder: item[1].onOrder,
      }
    })
    return wallet
  }

  processChartData(
    symbol: string,
    indexes: string[],
    interval: string | null,
    ohlc: any,
  ) {
    indexes.map((index) => {
      switch (index) {
        case indexKeys.RSI: {
          return this.intelligence.updateMemory(
            symbol,
            indexKeys.RSI,
            interval,
            sysIndexes.RSI(ohlc.close),
          )
        }
        case indexKeys.MACD: {
          return this.intelligence.updateMemory(
            symbol,
            indexKeys.MACD,
            interval,
            sysIndexes.MACD(ohlc.close),
          )
        }
        default:
          break
      }
    })
  }

  broadcast(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}
