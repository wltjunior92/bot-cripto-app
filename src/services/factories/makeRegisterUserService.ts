import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { RegisterUserService } from '../registerUserService'

export function makeRegisterUserService() {
  const repository = new PrismaUsersRepository()
  const service = new RegisterUserService(repository)

  return service
}
