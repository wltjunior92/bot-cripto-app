import { DatabaseNewOrderError } from '@/errors/databaseNewOrderError'
import { ExchangeNewOrderError } from '@/errors/exchangeNewOrderError'
import { BinanceExchange } from '@/lib/exchanges/binance'
import { OrdersRepository } from '@/repositories/ordersRepository'
import { Order } from '@prisma/client'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

interface CancelOrderServiceRequest {
  symbol: string
  orderId: string
  userId: string
}

interface CancelOrderServiceResponse {
  order: Order | null
}

export class CancelOrderService {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    symbol,
    orderId,
    userId,
  }: CancelOrderServiceRequest): Promise<CancelOrderServiceResponse> {
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
      result = await exchange.cancel(symbol, orderId)
    } catch (error) {
      throw new ExchangeNewOrderError()
    }

    try {
      const canceledOrder = await this.ordersRepository.updateByOrderId(
        result.orderId,
        result.origClietnOrderId,
        {
          order_status: result.status,
        },
      )

      return {
        order: canceledOrder,
      }
    } catch (error) {
      throw new DatabaseNewOrderError()
    }
  }
}
