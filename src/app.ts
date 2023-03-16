import fastify from 'fastify'
import helmet from '@fastify/helmet'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { fastifyCors } from '@fastify/cors'

export const app = fastify()
app.register(helmet, { global: true })
app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Erro de validação.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: add external tool log such as DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
