import { InvalidCredentialsError } from '@/errors/invalidCredentialsError'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticateService'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(userRepository)
  })

  it('shoud be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud not be able to authenticate with wrong e-mail', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('shoud not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '12312312',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
