import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor, Prisma } from '@prisma/client'

interface UpdateMonitorServiceRequest {
  id: string
  newMonitor: Prisma.MonitorUpdateInput
}

interface UpdateMonitorServiceResponse {
  monitor: Monitor | null
}

export class UpdateMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    id,
    newMonitor,
  }: UpdateMonitorServiceRequest): Promise<UpdateMonitorServiceResponse> {
    const monitor = await this.monitorsRepository.update(id, newMonitor)

    if (monitor?.is_active) {
      // Stop monitor
      // Start monitor
    } else {
      // Stop monitor
    }

    return {
      monitor,
    }
  }
}
