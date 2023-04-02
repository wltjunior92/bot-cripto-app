import { intelligence } from '@/lib/intelligence'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function getIntelligenceBrain(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  reply.status(200).send(intelligence.getBrain())
}
