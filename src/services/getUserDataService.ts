import { UserNotFoundError } from '@/errors/userNotFoundError'
import { UserDTO } from '@/repositories/dtos/userDTO'
import { UsersRepository } from '@/repositories/usersRepository'
import { decrypt } from '@/utils/crypto'

interface GetUserDataServiceRequest {
  id: string
  email?: string
}

interface GetUserDataServiceResponse extends UserDTO {}

export class GetUserDataService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
  }: GetUserDataServiceRequest): Promise<GetUserDataServiceResponse> {
    let user
    if (id !== '') {
      user = await this.usersRepository.findById(id)
    } else if (email) {
      user = await this.usersRepository.findByEmail(email)
    }

    if (user) {
      return {
        name: user.name,
        email: user.email,
        apiUrl: user.api_url || '',
        streamUrl: user.stream_url || '',
        accessKey: user.access_key || '',
        secretKey: user.secret_key_hash ? decrypt(user.secret_key_hash) : '',
      }
    } else {
      throw new UserNotFoundError()
    }
  }
}
