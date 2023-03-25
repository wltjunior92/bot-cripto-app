import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { AuthenticateService } from '../authenticateService'

export function makeAuthenticateService() {
  const userRepository = new PrismaUsersRepository()
  const service = new AuthenticateService(userRepository)

  return service
}
