import { MonitorsRepository } from '@/repositories/monitorsRepository'
import { Monitor } from '@prisma/client'

interface GetMonitorsServiceRequest {
  page?: number
}

interface GetMonitorsServiceResponse {
  monitors: Monitor[]
  totalCount: number
  pageQty: number
}

export class GetMonitorsService {
  constructor(private monitorsRepository: MonitorsRepository) {}

  async execute({
    page,
  }: GetMonitorsServiceRequest): Promise<GetMonitorsServiceResponse> {
    const { monitors, totalCount, pageQty } =
      await this.monitorsRepository.getMonitors({
        page,
      })

    return {
      monitors,
      totalCount,
      pageQty,
    }
  }
}
