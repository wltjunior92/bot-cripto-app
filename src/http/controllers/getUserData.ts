import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserServiceService } from '@/services/factories/makeGetUserDataService'
import { UserNotFoundError } from '@/errors/userNotFoundError'

export async function getUserData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  try {
    const getUserDataService = makeGetUserServiceService()

    const user = await getUserDataService.execute({ id: sub })
    return reply.status(201).send(user)
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
