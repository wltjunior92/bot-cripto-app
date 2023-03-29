import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { cancelOrder } from './controllers/cancelOrder'
import { getBalance } from './controllers/getBalance'
import { getOrders } from './controllers/getOrders'
import { getQuotes } from './controllers/getQuotes'
import { getSymbol } from './controllers/getSymbol'
import { getSymbols } from './controllers/getSymbols'
import { getUserData } from './controllers/getUserData'
import { placeOrder } from './controllers/placeOrder'
import { refresh } from './controllers/refresh'
import { registerUser } from './controllers/registerUser'
import { syncSymbols } from './controllers/syncSymbols'
import { updateFavoriteSymbol } from './controllers/updateFavoriteSymbol'
import { updateUser } from './controllers/updateUser'
import { verifyJwt } from './middlewares/verifyJwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/userData', { onRequest: [verifyJwt] }, getUserData)
  app.patch('/userData', { onRequest: [verifyJwt] }, updateUser)

  app.get('/symbol', { onRequest: [verifyJwt] }, getSymbols)
  app.get('/symbol/quotes', { onRequest: [verifyJwt] }, getQuotes)
  app.get('/symbol/:symbol', { onRequest: [verifyJwt] }, getSymbol)
  app.post('/symbol/sync', { onRequest: [verifyJwt] }, syncSymbols)
  app.patch('/symbol/:symbol', { onRequest: [verifyJwt] }, updateFavoriteSymbol)

  app.get('/orders/:symbol?', { onRequest: [verifyJwt] }, getOrders)
  app.post('/orders', { onRequest: [verifyJwt] }, placeOrder)
  app.delete(
    '/orders/:symbol/:orderId',
    { onRequest: [verifyJwt] },
    cancelOrder,
  )

  app.get('/exchange/balance', { onRequest: [verifyJwt] }, getBalance)
}
