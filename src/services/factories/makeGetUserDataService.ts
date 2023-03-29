import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { GetUserDataService } from '../getUserDataService'

export function makeGetUserDataService() {
  const repository = new PrismaUsersRepository()
  const service = new GetUserDataService(repository)

  return service
}
