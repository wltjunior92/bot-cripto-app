import { DatabaseNewOrderError } from '@/errors/databaseNewOrderError'
import { ExchangeNewOrderError } from '@/errors/exchangeNewOrderError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { OrderDTO } from '@/repositories/dtos/orderDTO'
import { OrdersRepository } from '@/repositories/ordersRepository'
import { Order, Prisma } from '@prisma/client'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

interface PlaceOrderServiceRequest {
  order: OrderDTO
  userId: string
}

interface PlaceOrderServiceResponse {
  order: Order | null
}

export class PlaceOrderService {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    order,
    userId,
  }: PlaceOrderServiceRequest): Promise<PlaceOrderServiceResponse> {
    const getSettingsService = makeGetUserDataService()
    const settings = await getSettingsService.execute({ id: userId })

    const formatedSettings = {
      api_url: settings.apiUrl,
      stream_url: settings.streamUrl,
      access_key: settings.accessKey,
      secret_key: settings.secretKey,
    }

    const exchange = new BinanceExchange(formatedSettings)

    let result
    try {
      if (order.order_side === 'BUY') {
        result = await exchange.buy(
          order.symbol,
          order.quantity,
          order.options,
          order.limit_price,
        )
      } else {
        result = await exchange.sell(
          order.symbol,
          order.quantity,
          order.options,
          order.limit_price,
        )
      }
    } catch (error) {
      throw new ExchangeNewOrderError()
    }
    const newOrder: Prisma.OrderCreateInput = {
      automation_id: order.automation_id,
      symbol: order.symbol,
      quantity: order.quantity,
      order_type: order.order_type,
      order_side: order.order_side,
      limit_price: order.limit_price,
      stop_price: order.options?.stop_price,
      iceberg_quantity: order.options?.iceberg_quantity,
      order_id: result.orderId,
      client_order_id: result.clientOrderId,
      transact_time: result.transactTime,
      order_status: result.status,
    }

    try {
      const createdOrder = await this.ordersRepository.create(newOrder)

      return {
        order: createdOrder,
      }
    } catch (error) {
      throw new DatabaseNewOrderError()
    }
  }
}
