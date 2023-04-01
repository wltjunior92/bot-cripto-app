import { PrismaMonitorsRepository } from '@/repositories/prisma/prismaMonitorsRepository'
import { GetMonitorsService } from '../getMonitorsService'

export function makeGetMonitorsService() {
  const repository = new PrismaMonitorsRepository()
  const service = new GetMonitorsService(repository)

  return service
}
