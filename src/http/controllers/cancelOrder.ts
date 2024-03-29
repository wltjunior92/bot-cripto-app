import { DatabaseNewOrderError } from '@/errors/databaseNewOrderError'
import { ExchangeNewOrderError } from '@/errors/exchangeNewOrderError'
import { makeCancelOrderService } from '@/services/factories/makeCancelOrdersService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function cancelOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const paramsSchema = z.object({
    symbol: z.string(),
    orderId: z.string(),
  })

  const { symbol, orderId } = paramsSchema.parse(request.params)

  try {
    const service = makeCancelOrderService()

    const { order } = await service.execute({
      symbol,
      orderId,
      userId: sub,
    })

    return reply.status(200).send(order)
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
