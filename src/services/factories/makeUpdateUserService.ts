import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { UpdateUserService } from '../updateUserService'

export function makeUpdateUserService() {
  const repository = new PrismaUsersRepository()
  const service = new UpdateUserService(repository)

  return service
}
