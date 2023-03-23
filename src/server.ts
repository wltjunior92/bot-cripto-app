import { app } from './app'
import { env } from './env'
import { ExchangeMonitor } from './modules/exchangeMonitor'
import { makeGetUserDataService } from './services/factories/makeGetUserDataService'
import { webSocketModule } from './modules/webSocket'

const settingsService = makeGetUserDataService()
// Load default user settings
settingsService
  .execute({ id: '', email: env.DEFAULT_USER_EMAIL })
  .then((settings) => {
    const formatedSettings = {
      api_url: settings.apiUrl,
      access_key: settings.accessKey,
      secret_key: settings.secretKey,
    }

    const server = app.server
    app
      .listen({
        host: '0.0.0.0',
        port: env.PORT,
      })
      .then(() => {
        console.log('HTTP server Running!💰')
      })

    const wss = webSocketModule(server)

    const defaultUserExchangeMonitor = new ExchangeMonitor(
      formatedSettings,
      wss,
    )
    defaultUserExchangeMonitor.execute()
  })
  .catch((error) => console.log(error.message))
