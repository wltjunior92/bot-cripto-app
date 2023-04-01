import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor } from '@prisma/client'

interface GetMonitorServiceRequest {
  id: string
}

interface GetMonitorServiceResponse {
  monitor: Monitor | null
}

export class GetMonitorService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    id,
  }: GetMonitorServiceRequest): Promise<GetMonitorServiceResponse> {
    const monitor = await this.monitorsRepository.findById(id)

    return {
      monitor,
    }
  }
}
