import { makeGetMonitorService } from '@/services/factories/makeGetMonitorService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getMonitor(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.params)

  const service = makeGetMonitorService()

  const { monitor } = await service.execute({
    id,
  })

  return reply.status(200).send({
    monitor,
  })
}
