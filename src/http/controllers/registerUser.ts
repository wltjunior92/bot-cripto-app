import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/errors/userAlreadyExistsError'
import { makeRegisterUserService } from '@/services/factories/makeRegisterUserService'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUserService = makeRegisterUserService()

    await registerUserService.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }

  return reply.status(201).send()
}
