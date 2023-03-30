export class OrderSynchingError extends Error {
  constructor() {
    super('Não foi possível obter os dados atualizados da ordem.')
  }
}
