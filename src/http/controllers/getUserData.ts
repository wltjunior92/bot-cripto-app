import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserDataService } from '@/services/factories/makeGetUserDataService'
import { UserNotFoundError } from '@/errors/userNotFoundError'

export async function getUserData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  try {
    const service = makeGetUserDataService()

    const user = await service.execute({ id: sub })
    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
