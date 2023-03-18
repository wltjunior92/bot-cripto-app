import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { getUserData } from './controllers/getUserData'
import { registerUser } from './controllers/registerUser'
import { verifyJwt } from './middlewares/verifyJwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.get('/userData', { onRequest: [verifyJwt] }, getUserData)
}
