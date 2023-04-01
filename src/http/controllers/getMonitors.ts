import { makeGetMonitorsService } from '@/services/factories/makeGetMonitorsService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getMonitors(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.string().optional(),
  })

  const { page: searchPage } = querySchema.parse(request.query)

  const page = searchPage ? parseInt(searchPage) : undefined
  const service = makeGetMonitorsService()

  const {
    monitors,
    totalCount: count,
    pageQty,
  } = await service.execute({
    page,
  })

  return reply.status(200).send({
    monitors,
    count,
    page_qty: pageQty,
  })
}
