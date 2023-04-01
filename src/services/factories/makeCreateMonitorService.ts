import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { CreateMonitorService } from '../createMonitorService'

export function makeCreateMonitorService() {
  const repository = new PrismaMonitorsRepository()
  const service = new CreateMonitorService(repository)

  return service
}
