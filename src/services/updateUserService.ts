import { UserDTO } from '@/repositories/dtos/userDTO'
import { UsersRepository } from '@/repositories/usersRepository'
import { decrypt, encrypt } from '@/utils/crypto'
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

interface UpdateUserServiceRequest {
  id: string
  name?: string | null
  password?: string | null
  apiUrl?: string | null
  accessKey?: string | null
  secretKey?: string | null
}

interface UpdateUserServiceResponse {
  user: UserDTO
}

export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    password,
    apiUrl,
    accessKey,
    secretKey,
  }: UpdateUserServiceRequest): Promise<UpdateUserServiceResponse> {
    let updatedUser: Prisma.UserUpdateInput = {}

    if (accessKey) {
      updatedUser = {
        ...updatedUser,
        access_key: accessKey,
      }
    }

    if (apiUrl) {
      updatedUser = {
        ...updatedUser,
        api_url: apiUrl,
      }
    }

    if (name) {
      updatedUser = {
        ...updatedUser,
        name,
      }
    }

    if (password) {
      const password_hash = await hash(password, 6)
      updatedUser = {
        ...updatedUser,
        password_hash,
      }
    }

    if (secretKey) {
      const secret_key_hash = encrypt(secretKey)
      updatedUser = {
        ...updatedUser,
        secret_key_hash,
      }
    }

    const user = await this.usersRepository.update(updatedUser, id)

    const userDTO: UserDTO = {
      name: user.name,
      email: user.email,
      apiUrl: user.api_url || '',
      accessKey: user.access_key || '',
      secretKey: user.secret_key_hash ? decrypt(user.secret_key_hash) : '',
    }

    return {
      user: userDTO,
    }
  }
}
