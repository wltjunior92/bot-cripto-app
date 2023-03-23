import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateFavoriteSymbolService } from '@/services/factories/makeUpdateFavoriteSymbolService'

export async function updateFavoriteSymbol(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateFavoriteSymbolBodySchema = z.object({
    value: z.boolean(),
  })

  const updateFavoriteSymbolParamsSchema = z.object({
    symbol: z.string(),
  })

  const { value } = updateFavoriteSymbolBodySchema.parse(request.body)

  const { symbol: symbolToUpdate } = updateFavoriteSymbolParamsSchema.parse(
    request.params,
  )

  const updateFavoriteSymbolService = makeUpdateFavoriteSymbolService()

  const { symbol } = await updateFavoriteSymbolService.execute({
    symbol: symbolToUpdate,
    value,
  })

  return reply.status(200).send(symbol)
}
