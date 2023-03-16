import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { registerUser } from './controllers/registerUser'
import { verifyJwt } from './middlewares/verifyJwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.get('/settings', { onRequest: [verifyJwt] }, registerUser)
}
