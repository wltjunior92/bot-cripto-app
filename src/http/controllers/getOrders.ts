import { makeGetOrdersService } from '@/services/factories/makeGetOrdersService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getOrders(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    symbol: z.string().optional(),
  })

  const querySchema = z.object({
    page: z.string().optional(),
  })

  const { page: searchPage } = querySchema.parse(request.query)
  const { symbol: searchSymbol } = paramsSchema.parse(request.params)

  const page = searchPage ? parseInt(searchPage) : undefined
  const symbol = searchSymbol ? searchSymbol.toUpperCase() : undefined
  const service = makeGetOrdersService()

  const {
    orders,
    totalCount: count,
    pageQty,
  } = await service.execute({
    symbol,
    page,
  })

  return reply.status(200).send({
    orders,
    count,
    page_qty: pageQty,
  })
}
