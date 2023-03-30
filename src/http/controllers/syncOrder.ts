import { makeSyncOrderService } from '@/services/factories/makeSyncOrderService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function syncOrder(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const getOrderParamsSchema = z.object({
    orderId: z.string(),
  })

  const { orderId } = getOrderParamsSchema.parse(request.params)

  const syncOrdersService = makeSyncOrderService()

  const { order } = await syncOrdersService.execute({
    id: sub,
    orderId,
  })

  return reply.status(200).send({
    order,
  })
}
