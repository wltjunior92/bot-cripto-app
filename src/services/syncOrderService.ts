import { OrderNotFoundError } from '@/errors/orderNotFoundError'
import { OrderSynchingError } from '@/errors/orderSynchingError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { OrdersRepository } from '@/repositories/ordersRepository'
import { Order } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

interface SyncOrderServiceRequest {
  id: string
  orderId: string
}

interface SyncOrderServiceResponse {
  order: Order | null
}

export class SyncOrderService {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
    orderId,
  }: SyncOrderServiceRequest): Promise<SyncOrderServiceResponse> {
    const getSettingsService = makeGetUserDataService()
    const settings = await getSettingsService.execute({ id })

    const formatedSettings = {
      api_url: settings.apiUrl,
      stream_url: settings.streamUrl,
      access_key: settings.accessKey,
      secret_key: settings.secretKey,
    }

    const exchange = new BinanceExchange(formatedSettings)

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      throw new OrderNotFoundError()
    }

    let binanceOrder, binanceTrade
    const updatedOrder = { ...order }
    try {
      binanceOrder = await exchange.orderStatus(
        order.symbol,
        `${order.order_id}`,
      )
      updatedOrder.order_status = binanceOrder.status
      updatedOrder.transact_time = binanceOrder.updatetime

      if (binanceOrder.status !== 'FILLED') {
        const savedOrder = await this.ordersRepository.updateByOrderId(
          `${order.order_id}`,
          order.client_order_id,
          updatedOrder,
        )

        return {
          order: savedOrder,
        }
      }

      binanceTrade = await exchange.orderTrade(
        order.symbol,
        `${order.order_id}`,
      )
    } catch (error) {
      throw new OrderSynchingError()
    }

    const quoteQuantity = parseFloat(binanceOrder.cummulativeQuoteQty)
    updatedOrder.avg_price = (quoteQuantity /
      parseFloat(binanceOrder.executedQty)) as unknown as Decimal
    updatedOrder.is_maker = binanceTrade.isMaker
    updatedOrder.commission = binanceTrade.commission

    const isQuoteCommission =
      binanceTrade.commissionAsset &&
      order.symbol.endsWith(binanceTrade.commissionAsset)
    if (isQuoteCommission) {
      updatedOrder.net = (quoteQuantity -
        parseFloat(binanceTrade.commission)) as unknown as Decimal
    } else {
      updatedOrder.net = quoteQuantity as unknown as Decimal
    }

    const savedOrder = await this.ordersRepository.updateByOrderId(
      `${order.order_id}`,
      order.client_order_id,
      updatedOrder,
    )

    return {
      order: savedOrder,
    }
  }
}
