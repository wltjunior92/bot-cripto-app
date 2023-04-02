import { env } from '@/env'

export class Intelligence {
  private MEMORY: any = {}
  private BRAIN: any = {}
  private LOGS: boolean = env.INTELLIGENCE_LOGS === 'true'

  constructor(automations: any) {
    // carregart
  }

  updateMemory(
    symbol: string,
    index: string | null,
    interval: string | null,
    value: any,
  ) {
    // Memory Format: symbol:index_interval
    const indexKey = interval ? `${index}_${interval}` : index
    const memoryKey = `${symbol}:${indexKey}`

    this.MEMORY[memoryKey] = value

    if (this.LOGS)
      console.log(
        `Intelligence MEMORY updated: ${memoryKey} => ${JSON.stringify(value)}`,
      )

    // logica de processamento do estímulo
  }

  getMemory() {
    return { ...this.MEMORY }
  }

  getBrain() {
    return { ...this.BRAIN }
  }
}
