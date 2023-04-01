import { GetMonitorService } from '../getMonitorService'
import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'

export function makeGetMonitorService() {
  const repository = new PrismaMonitorsRepository()
  const service = new GetMonitorService(repository)

  return service
}
