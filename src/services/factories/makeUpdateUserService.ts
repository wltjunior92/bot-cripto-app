import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { UpdateUserService } from '../updateUserService'

export function makeUpdateUserService() {
  const userRepository = new PrismaUsersRepository()
  const service = new UpdateUserService(userRepository)

  return service
}
