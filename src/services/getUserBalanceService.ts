import { BinanceExchange } from '@/lib/exchanges/binance'
import { UserBalanceDTO } from '@/repositories/dtos/userBalanceDTO'
import { makeGetUserDataService } from './factories/makeGetUserDataService'

interface GetUserBalaceServiceRequest {
  id: string
}

interface GetUserBalanceServiceResponse {
  balance: UserBalanceDTO
}

export class GetUserBalanceService {
  async execute({
    id,
  }: GetUserBalaceServiceRequest): Promise<GetUserBalanceServiceResponse> {
    const getUserDataSevice = makeGetUserDataService()
    const settings = await getUserDataSevice.execute({ id })

    const formatedSettings = {
      api_url: settings.apiUrl,
      access_key: settings.accessKey,
      stream_url: settings.streamUrl,
      secret_key: settings.secretKey,
    }

    const binance = new BinanceExchange(formatedSettings)

    const balance = await binance.balance()

    return {
      balance,
    }
  }
}
