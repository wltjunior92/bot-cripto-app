import { DeleteMonitorService } from '../deleteMonitorService'
import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'

export function makeDeleteMonitorService() {
  const repository = new PrismaMonitorsRepository()
  const service = new DeleteMonitorService(repository)

  return service
}
