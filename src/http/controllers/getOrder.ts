import { makeGetOrderService } from '@/services/factories/makeGetOrderService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const getOrderParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getOrderParamsSchema.parse(request.params)

  const getOrdersService = makeGetOrderService()

  const { order } = await getOrdersService.execute({
    id,
  })

  return reply.status(200).send({
    order,
  })
}
