import { CantEditOrDeleteSystemMonitorError } from '@/errors/cantEditOrDeleteSystemMonitorError'
import { MonitorsRepository } from '@/repositories/monitorsRepository'

interface DeleteMonitorServiceRequest {
  id: string
}

export class DeleteMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({ id }: DeleteMonitorServiceRequest): Promise<void> {
    const monitor = await this.monitorsRepository.findById(id)
    if (monitor?.is_system_mon) {
      throw new CantEditOrDeleteSystemMonitorError()
    }
    await this.monitorsRepository.delete(id)
  }
}
