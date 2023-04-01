import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetAllQuotesService } from '@/services/factories/makeGetAllQuotesService'

export async function getQuotes(request: FastifyRequest, reply: FastifyReply) {
  const service = makeGetAllQuotesService()

  const quotes = await service.execute()
  return reply.status(200).send(quotes)
}
