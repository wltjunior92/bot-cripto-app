import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserService } from '@/services/factories/makeUpdateUserService'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    user: z.object({
      name: z.string().nullable(),
      password: z.string().nullable(),
      apiUrl: z.string().nullable(),
      accessKey: z.string().nullable(),
      secretKey: z.string().nullable(),
    }),
  })

  const {
    user: { name, password, apiUrl, accessKey, secretKey },
  } = updateUserBodySchema.parse(request.body)

  const { sub } = request.user

  const updateUserService = makeUpdateUserService()

  const { user } = await updateUserService.execute({
    id: sub,
    name,
    password,
    apiUrl,
    accessKey,
    secretKey,
  })

  return reply.status(200).send(user)
}
