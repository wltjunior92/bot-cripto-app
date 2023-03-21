import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetSymbolsService } from '@/services/factories/makeGetSymbolsService'

export async function getSymbols(request: FastifyRequest, reply: FastifyReply) {
  const getSymbolsService = makeGetSymbolsService()

  const symbols = await getSymbolsService.execute()
  return reply.status(200).send(symbols)
}
