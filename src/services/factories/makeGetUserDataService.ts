import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { GetUserDataService } from '../getUserDataService'

export function makeGetUserDataService() {
  const userRepository = new PrismaUsersRepository()
  const getUserDataService = new GetUserDataService(userRepository)

  return getUserDataService
}
