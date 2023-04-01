import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateMonitorService } from '@/services/factories/makeCreateMonitorService'
import { MonitorAlreadyExistsError } from '@/errors/monitorAlreadyExistsError'

export async function createMonitor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    symbol: z.string().default('*'),
    type: z.string(),
    broadcast_label: z.string().optional(),
    interval: z.string().default(''),
    indexes: z.string().optional(),
    is_active: z.boolean().default(false),
    is_system_mon: z.boolean().default(false),
    logs: z.boolean().default(false),
  })

  const {
    symbol,
    type,
    broadcast_label,
    interval,
    indexes,
    is_active,
    is_system_mon,
    logs,
  } = bodySchema.parse(request.body)

  try {
    const service = makeCreateMonitorService()

    const monitor = await service.execute({
      newMonitor: {
        symbol,
        type,
        broadcast_label,
        interval,
        indexes,
        is_active,
        is_system_mon,
        logs,
      },
    })

    return reply.status(201).send({
      monitor,
    })
  } catch (error) {
    if (error instanceof MonitorAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
