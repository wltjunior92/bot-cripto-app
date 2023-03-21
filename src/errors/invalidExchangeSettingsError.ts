export class InvalidExchangeSettingsError extends Error {
  constructor() {
    super('As configurações são obrigatórias para conectar com a corretora.')
  }
}
