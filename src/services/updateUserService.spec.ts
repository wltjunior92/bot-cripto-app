import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { encrypt } from '@/utils/crypto'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticateService'
import { UpdateUserService } from './updateUserService'

let userRepository: InMemoryUsersRepository
let sut: UpdateUserService
let loadedUser: User

describe('Update User Service', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new UpdateUserService(userRepository)
    loadedUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
      api_url: 'http://exemplo.corretora.com/api',
      access_key: 'fa4s65d4f15a3s4df534asd53fasd35f',
      secret_key_hash: encrypt('as8d46a8s4das3d5384as58d4a5s34d5a'),
    })
  })

  it('shoud be able to update an user', async () => {
    const data = {
      id: loadedUser.id,
      name: 'Different name',
    }

    const { user } = await sut.execute(data)

    expect(user.name).toEqual('Different name')
  })

  it('shoud be able to update an user password', async () => {
    const data = {
      id: loadedUser.id,
      password: '87654321',
    }

    await sut.execute(data)

    const authenticateService = new AuthenticateService(userRepository)

    const { user } = await authenticateService.execute({
      email: 'johndoe@example.com',
      password: '87654321',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud be able to update an user secret key', async () => {
    const data = {
      id: loadedUser.id,
      secretKey: 'newSecretKey',
    }

    const { user } = await sut.execute(data)

    expect(user.secretKey).toEqual('newSecretKey')
  })
})
