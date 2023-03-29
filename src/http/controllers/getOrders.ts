import { makeGetOrdersService } from '@/services/factories/makeGetOrdersService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getOrders(request: FastifyRequest, reply: FastifyReply) {
  const getOrdersParamsSchema = z.object({
    symbol: z.string().optional(),
  })

  const getOrdersQuerySchema = z.object({
    page: z.string().optional(),
  })

  const { page: searchPage } = getOrdersQuerySchema.parse(request.query)
  const { symbol: searchSymbol } = getOrdersParamsSchema.parse(request.params)

  const page = searchPage ? parseInt(searchPage) : undefined
  const symbol = searchSymbol ? searchSymbol.toUpperCase() : undefined
  const getOrdersService = makeGetOrdersService()

  const { orders, totalCount: count } = await getOrdersService.execute({
    symbol,
    page,
  })

  return reply.status(200).send({
    orders,
    count,
  })
}
