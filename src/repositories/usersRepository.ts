import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(data: Prisma.UserUpdateInput, id: string): Promise<User>
  findById(id: string): Promise<User | null>
}
