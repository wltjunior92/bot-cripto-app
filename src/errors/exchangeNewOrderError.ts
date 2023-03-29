export class ExchangeNewOrderError extends Error {
  constructor() {
    super('A exchange recusou a ordem enviada.')
  }
}
