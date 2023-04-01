import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor, Prisma } from '@prisma/client'

interface CreateMonitorServiceRequest {
  newMonitor: Prisma.MonitorCreateInput
}

interface CreateMonitorServiceResponse {
  monitor: Monitor | null
}

export class CreateMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    newMonitor,
  }: CreateMonitorServiceRequest): Promise<CreateMonitorServiceResponse> {
    const monitor = await this.monitorsRepository.create(newMonitor)

    if (monitor?.is_active) {
      // Start monitor
    }

    return {
      monitor,
    }
  }
}
