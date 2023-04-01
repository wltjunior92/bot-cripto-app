export class MonitorAlreadyExistsError extends Error {
  constructor() {
    super('Já existe um monitor cadastrado com essas configurações.')
  }
}
