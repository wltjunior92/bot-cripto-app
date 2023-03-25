import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { RegisterUserService } from '../registerUserService'

export function makeRegisterUserService() {
  const userRepository = new PrismaUsersRepository()
  const service = new RegisterUserService(userRepository)

  return service
}
