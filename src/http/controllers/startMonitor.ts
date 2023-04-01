import { CantEditOrDeleteSystemMonitorError } from '@/errors/cantEditOrDeleteSystemMonitorError'
import { makeStartMonitorsService } from '@/services/factories/makeStartMonitorsService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function startMonitor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.params)

  const service = makeStartMonitorsService()

  try {
    const { monitor } = await service.execute({
      id,
    })

    return reply.status(200).send({
      monitor,
    })
  } catch (error) {
    if (error instanceof CantEditOrDeleteSystemMonitorError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
