import { makeSyncOrderService } from '@/services/factories/makeSyncOrderService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function syncOrder(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const paramsSchema = z.object({
    orderId: z.string(),
  })

  const { orderId } = paramsSchema.parse(request.params)

  const service = makeSyncOrderService()

  const { order } = await service.execute({
    id: sub,
    orderId,
  })

  return reply.status(200).send({
    order,
  })
}
