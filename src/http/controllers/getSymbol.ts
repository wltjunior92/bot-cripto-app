import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetSymbolService } from '@/services/factories/makeGetSymbolService'

export async function getSymbol(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    symbol: z.string(),
  })

  const { symbol } = paramsSchema.parse(request.params)

  const service = makeGetSymbolService()

  const data = await service.execute({ symbol })
  return reply.status(200).send(data.symbol)
}
