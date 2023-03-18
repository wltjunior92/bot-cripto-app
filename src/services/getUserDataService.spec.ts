import { UserNotFoundError } from '@/errors/userNotFoundError'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { encrypt } from '@/utils/crypto'
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserDataService } from './getUserDataService'

let userRepository: InMemoryUsersRepository
let sut: GetUserDataService
let user: Prisma.UserCreateInput

describe('Get User Data Service', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserDataService(userRepository)
    user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
      api_url: 'http://exemplo.corretora.com/api',
      access_key: 'fa4s65d4f15a3s4df534asd53fasd35f',
      secret_key_hash: encrypt('as8d46a8s4das3d5384as58d4a5s34d5a'),
    })
  })

  it('shoud be able to get user data', async () => {
    const userData = await sut.execute({ id: user.id as string })

    expect(userData.name).toEqual('John Doe')
  })

  it('shoud be able to get user data with decrypted sacret key', async () => {
    const userData = await sut.execute({ id: user.id as string })

    expect(userData.secretKey).toEqual('as8d46a8s4das3d5384as58d4a5s34d5a')
  })

  it('shoud throw an error when do not find user', async () => {
    await expect(() => sut.execute({ id: 'test' })).rejects.toBeInstanceOf(
      UserNotFoundError,
    )
  })
})
