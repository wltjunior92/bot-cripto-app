import { PrismaUsersRepository } from '@/repositories/prisma/prismaUsersRepository'
import { AuthenticateService } from '../authenticateService'

export function makeAuthenticateService() {
  const repository = new PrismaUsersRepository()
  const service = new AuthenticateService(repository)

  return service
}
