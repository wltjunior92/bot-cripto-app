import { FastifyRequest, FastifyReply } from 'fastify'
import { UserNotFoundError } from '@/errors/userNotFoundError'
import { GetUserBalanceService } from '@/services/getUserBalanceService'

export async function getBalance(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  try {
    const service = new GetUserBalanceService()

    const { balance } = await service.execute({ id: sub })
    return reply.status(200).send(balance)
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
