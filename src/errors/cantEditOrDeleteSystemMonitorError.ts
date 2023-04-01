export class CantEditOrDeleteSystemMonitorError extends Error {
  constructor() {
    super('Não é permitido deletar um monitor essencial ao sistema.')
  }
}
