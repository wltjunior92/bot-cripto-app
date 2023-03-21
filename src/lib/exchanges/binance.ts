import { InvalidExchangeSettingsError } from '@/errors/invalidExchangeSettingsError'
import Binance from 'node-binance-api'

type Settings = {
  access_key: string
  secret_key: string
  api_url: string
}

module.exports = (settings: Settings) => {
  if (!settings) {
    throw new InvalidExchangeSettingsError()
  }

  const binance = new Binance({
    APIKEY: settings.access_key,
    APISECRET: settings.secret_key,
    family: 0,
    urls: {
      base: settings.api_url.endsWith('/')
        ? settings.api_url
        : `${settings.api_url}/`,
    },
  })

  function exchangeInfo() {
    return binance.exchangeInfo()
  }

  return {
    exchangeInfo,
  }
}
