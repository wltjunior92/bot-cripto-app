import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate'
import { cancelOrder } from './controllers/cancelOrder'
import { getBalance } from './controllers/getBalance'
import { getOrder } from './controllers/getOrder'
import { getOrders } from './controllers/getOrders'
import { getQuotes } from './controllers/getQuotes'
import { getSymbol } from './controllers/getSymbol'
import { getSymbols } from './controllers/getSymbols'
import { getUserData } from './controllers/getUserData'
import { placeOrder } from './controllers/placeOrder'
import { refresh } from './controllers/refresh'
import { registerUser } from './controllers/registerUser'
import { searchSymbols } from './controllers/searchSymbols'
import { syncOrder } from './controllers/syncOrder'
import { syncSymbols } from './controllers/syncSymbols'
import { updateFavoriteSymbol } from './controllers/updateFavoriteSymbol'
import { updateUser } from './controllers/updateUser'
import { verifyJwt } from './middlewares/verifyJwt'
import { getMonitors } from './controllers/getMonitors'
import { getMonitor } from './controllers/getMonitor'
import { createMonitor } from './controllers/createMonitor'
import { updateMonitor } from './controllers/updateMonitor'
import { deleteMonitor } from './controllers/deleteMonitor'
import { startMonitor } from './controllers/startMonitor'
import { stopMonitor } from './controllers/stopMonitor'
import { getIntelligenceMemory } from './controllers/getIntelligenceMemory'
import { getIntelligenceBrain } from './controllers/getIntelligenceBrain'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/userData', { onRequest: [verifyJwt] }, getUserData)
  app.patch('/userData', { onRequest: [verifyJwt] }, updateUser)

  app.get('/symbol', { onRequest: [verifyJwt] }, getSymbols)
  app.get('/symbol/search', { onRequest: [verifyJwt] }, searchSymbols)
  app.get('/symbol/one/:symbol', { onRequest: [verifyJwt] }, getSymbol)
  app.get('/symbol/quotes', { onRequest: [verifyJwt] }, getQuotes)
  app.post('/symbol/sync', { onRequest: [verifyJwt] }, syncSymbols)
  app.patch('/symbol/:symbol', { onRequest: [verifyJwt] }, updateFavoriteSymbol)

  app.get('/orders/:symbol?', { onRequest: [verifyJwt] }, getOrders)
  app.get('/orders/findById/:id', { onRequest: [verifyJwt] }, getOrder)
  app.post('/orders', { onRequest: [verifyJwt] }, placeOrder)
  app.post('/orders/sync/:orderId', { onRequest: [verifyJwt] }, syncOrder)
  app.delete(
    '/orders/:symbol/:orderId',
    { onRequest: [verifyJwt] },
    cancelOrder,
  )

  app.get('/monitors', { onRequest: [verifyJwt] }, getMonitors)
  app.get('/monitors/one/:id', { onRequest: [verifyJwt] }, getMonitor)
  app.post('/monitors', { onRequest: [verifyJwt] }, createMonitor)
  app.post('/monitors/start/:id', { onRequest: [verifyJwt] }, startMonitor)
  app.post('/monitors/stop/:id', { onRequest: [verifyJwt] }, stopMonitor)
  app.patch('/monitors/:id', { onRequest: [verifyJwt] }, updateMonitor)
  app.delete('/monitors/:id', { onRequest: [verifyJwt] }, deleteMonitor)

  app.get(
    '/intelligence/memory',
    { onRequest: [verifyJwt] },
    getIntelligenceMemory,
  )
  app.get(
    '/intelligence/brain',
    { onRequest: [verifyJwt] },
    getIntelligenceBrain,
  )

  app.get('/exchange/balance', { onRequest: [verifyJwt] }, getBalance)
}
