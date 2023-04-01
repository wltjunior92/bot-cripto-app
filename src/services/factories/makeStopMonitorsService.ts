import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { StopMonitorService } from '../stopMonitorService'

export function makeStopMonitorsService() {
  const repository = new PrismaMonitorsRepository()
  const service = new StopMonitorService(repository)

  return service
}
