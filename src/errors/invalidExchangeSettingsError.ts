export class InvalidExchangeSettingsError extends Error {
  constructor(failedModule?: string | undefined) {
    super(
      `${
        failedModule && failedModule + ' - '
      }As configurações são obrigatórias para conectar com a corretora.`,
    )
  }
}
