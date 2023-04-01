import { CantEditOrDeleteSystemMonitorError } from '@/errors/cantEditOrDeleteSystemMonitorError'
import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor } from '@prisma/client'

interface StartMonitorServiceRequest {
  id: string
}

interface StartMonitorServiceResponse {
  monitor: Monitor | null
}

export class StartMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    id,
  }: StartMonitorServiceRequest): Promise<StartMonitorServiceResponse> {
    const monitor = await this.monitorsRepository.findById(id)
    if (monitor?.is_active) {
      return {
        monitor,
      }
    }
    if (monitor?.is_system_mon) {
      throw new CantEditOrDeleteSystemMonitorError()
    }

    // Start monitor

    const updatedMonitor = await this.monitorsRepository.update(id, {
      is_active: true,
    })

    return {
      monitor: updatedMonitor,
    }
  }
}
