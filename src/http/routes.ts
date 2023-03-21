import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { getSymbols } from './controllers/getSymbols'
import { getUserData } from './controllers/getUserData'
import { registerUser } from './controllers/registerUser'
import { syncSymbols } from './controllers/syncSymbols'
import { updateUser } from './controllers/updateUser'
import { verifyJwt } from './middlewares/verifyJwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.get('/userData', { onRequest: [verifyJwt] }, getUserData)
  app.patch('/userData', { onRequest: [verifyJwt] }, updateUser)

  app.get('/symbol', { onRequest: [verifyJwt] }, getSymbols)
  app.post('/symbol/sync', { onRequest: [verifyJwt] }, syncSymbols)
}
