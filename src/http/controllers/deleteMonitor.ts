import { CantEditOrDeleteSystemMonitorError } from '@/errors/cantEditOrDeleteSystemMonitorError'
import { makeDeleteMonitorService } from '@/services/factories/makeDeleteMonitorService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function deleteMonitor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.params)

  const service = makeDeleteMonitorService()

  try {
    await service.execute({
      id,
    })
  } catch (error) {
    if (error instanceof CantEditOrDeleteSystemMonitorError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
