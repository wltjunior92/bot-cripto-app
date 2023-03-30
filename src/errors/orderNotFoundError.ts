export class OrderNotFoundError extends Error {
  constructor() {
    super('Não encontramos a ordem solicitada.')
  }
}
