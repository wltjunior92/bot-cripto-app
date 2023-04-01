import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateFavoriteSymbolService } from '@/services/factories/makeUpdateFavoriteSymbolService'

export async function updateFavoriteSymbol(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    value: z.boolean(),
  })

  const paramsSchema = z.object({
    symbol: z.string(),
  })

  const { value } = bodySchema.parse(request.body)

  const { symbol: symbolToUpdate } = paramsSchema.parse(request.params)

  const service = makeUpdateFavoriteSymbolService()

  const { symbol } = await service.execute({
    symbol: symbolToUpdate,
    value,
  })

  return reply.status(200).send(symbol)
}
