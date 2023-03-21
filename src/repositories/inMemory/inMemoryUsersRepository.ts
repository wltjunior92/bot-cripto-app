import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../usersRepository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] | Prisma.UserUpdateInput[] = []

  async update(data: Prisma.UserUpdateInput, id: string): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id)
    let user = this.items[userIndex]

    user = {
      ...user,
      ...data,
    }

    this.items[userIndex] = user

    return user as User
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id) as User

    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email) as User

    if (!user) {
      return null
    }
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      api_url: data.api_url as string | null,
      access_key: data.access_key as string | null,
      secret_key_hash: data.secret_key_hash as string | null,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
