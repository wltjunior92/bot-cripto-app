import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSyncSymbolsService } from '@/services/factories/makeSyncSymbolsService copy'

export async function syncSymbols(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  try {
    const service = makeSyncSymbolsService()

    await service.execute({ id: sub })

    return reply.status(200).send()
  } catch (error) {
    return reply.status(500).send({ message: JSON.stringify(error) })
  }
}
