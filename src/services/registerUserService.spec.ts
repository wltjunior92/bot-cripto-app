import { UserAlreadyExistsError } from '@/errors/userAlreadyExistsError'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUserService } from './registerUserService'

let userRepository: InMemoryUsersRepository
let sut: RegisterUserService

describe('Register User Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUserService(userRepository)
  })

  it('shoud be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })
    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('shoud not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
