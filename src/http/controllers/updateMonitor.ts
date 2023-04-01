import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateMonitorService } from '@/services/factories/makeUpdateMonitorService'

export async function updateMonitor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    symbol: z.string().optional(),
    type: z.string().optional(),
    broadcast_label: z.string().optional(),
    interval: z.string().optional(),
    indexes: z.string().optional(),
    is_active: z.boolean().optional(),
    is_system_mon: z.boolean().optional(),
    logs: z.boolean().optional(),
  })

  const paramsSchema = z.object({
    id: z.string(),
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

  const { id } = paramsSchema.parse(request.params)

  const service = makeUpdateMonitorService()

  const monitor = await service.execute({
    id,
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

  return reply.status(200).send({
    monitor,
  })
}
