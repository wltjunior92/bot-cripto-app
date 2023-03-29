export class DatabaseNewOrderError extends Error {
  constructor() {
    super(
      'Sua ordem foi enviada, mas houve um erro ao salvar as informações na nossa base de dados.',
    )
  }
}
