import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetSymbolService } from '@/services/factories/makeGetSymbolService'

export async function getSymbol(request: FastifyRequest, reply: FastifyReply) {
  const getSymbolSymbolParamsSchema = z.object({
    symbol: z.string(),
  })

  const { symbol } = getSymbolSymbolParamsSchema.parse(request.params)

  const getSymbolService = makeGetSymbolService()

  const data = await getSymbolService.execute({ symbol })
  return reply.status(200).send(data.symbol)
}
