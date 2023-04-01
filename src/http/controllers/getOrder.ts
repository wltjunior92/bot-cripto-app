import { makeGetOrderService } from '@/services/factories/makeGetOrderService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.params)

  const service = makeGetOrderService()

  const { order } = await service.execute({
    id,
  })

  return reply.status(200).send({
    order,
  })
}
