import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { StartMonitorService } from '../startMonitorService'

export function makeStartMonitorsService() {
  const repository = new PrismaMonitorsRepository()
  const service = new StartMonitorService(repository)

  return service
}
