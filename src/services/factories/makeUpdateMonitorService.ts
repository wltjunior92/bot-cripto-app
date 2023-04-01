import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { UpdateMonitorService } from '../updateMonitorService'

export function makeUpdateMonitorService() {
  const repository = new PrismaMonitorsRepository()
  const service = new UpdateMonitorService(repository)

  return service
}
