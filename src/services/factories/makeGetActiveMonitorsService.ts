import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { GetActiveMonitorsService } from '../getActiveMonitorsService'

export function makeGetActiveMonitorsService() {
  const repository = new PrismaMonitorsRepository()
  const service = new GetActiveMonitorsService(repository)

  return service
}
