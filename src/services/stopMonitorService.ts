import { CantEditOrDeleteSystemMonitorError } from '@/errors/cantEditOrDeleteSystemMonitorError'
import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor } from '@prisma/client'

interface StopMonitorServiceRequest {
  id: string
}

interface StopMonitorServiceResponse {
  monitor: Monitor | null
}

export class StopMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    id,
  }: StopMonitorServiceRequest): Promise<StopMonitorServiceResponse> {
    const monitor = await this.monitorsRepository.findById(id)
    if (!monitor?.is_active) {
      return {
        monitor,
      }
    }
    if (monitor?.is_system_mon) {
      throw new CantEditOrDeleteSystemMonitorError()
    }

    // Stop monitor

    const updatedMonitor = await this.monitorsRepository.update(id, {
      is_active: false,
    })

    return {
      monitor: updatedMonitor,
    }
  }
}
