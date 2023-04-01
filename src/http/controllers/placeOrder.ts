import { DatabaseNewOrderError } from '@/errors/databaseNewOrderError'
import { ExchangeNewOrderError } from '@/errors/exchangeNewOrderError'
import { OrderDTO } from '@/repositories/dtos/orderDTO'
import { makePlaceOrderService } from '@/services/factories/makePlaceOrdersService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function placeOrder(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const bodySchema = z.object({
    symbol: z.string(),
    quantity: z.string(),
    order_side: z.enum(['BUY', 'SELL']),
    order_type: z.enum([
      'ICEBERG',
      'LIMIT',
      'MARKET',
      'STOP_LOSS',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT',
      'TAKE_PROFIT_LIMIT',
    ]),
    limit_price: z.string().optional(),
    options: z
      .object({
        iceberg_quantity: z.string().optional(),
        stop_price: z.string().optional(),
        order_type: z
          .enum([
            'STOP_LOSS',
            'STOP_LOSS_LIMIT',
            'TAKE_PROFIT',
            'TAKE_PROFIT_LIMIT',
          ])
          .optional(),
      })
      .optional(),
    automation_id: z.string().optional(),
  })

  const {
    symbol,
    quantity,
    order_side,
    order_type,
    limit_price,
    options,
    automation_id,
  } = bodySchema.parse(request.body)

  const newOrder: OrderDTO = {
    automation_id,
    symbol,
    quantity,
    order_type,
    order_side,
    limit_price,
    options: {
      iceberg_quantity: options ? options.iceberg_quantity : null,
      stop_price: options ? options.stop_price : null,
      order_type,
    },
  }

  try {
    const service = makePlaceOrderService()

    const data = await service.execute({
      order: newOrder,
      userId: sub,
    })

    return reply.status(201).send(data)
  } catch (error) {
    if (error instanceof ExchangeNewOrderError) {
      return reply.status(400).send({ message: error.message })
    }
    if (error instanceof DatabaseNewOrderError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
