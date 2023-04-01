import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor } from '@prisma/client'

export class GetActiveMonitorsService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute(): Promise<Monitor[]> {
    const monitors = await this.monitorsRepository.findActives()

    return monitors
  }
}
