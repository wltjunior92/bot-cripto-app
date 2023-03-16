import { UserAlreadyExistsError } from '@/errors/userAlreadyExistsError'
import { UsersRepository } from '@/repositories/usersRepository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface RegisterUserServiceRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserServiceResponse {
  user: User
}

export class RegisterUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
