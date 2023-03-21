import { PrismaClient } from '@prisma/client'
import { encrypt } from '../src/utils/crypto'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { email: 'wlt.junior92@gmail.com' },
    update: {},
    create: {
      email: 'wlt.junior92@gmail.com',
      name: 'Walter Júnior',
      password_hash: await hash('12345678', 6),
      api_url: 'https://testnet.binance.vision/api/',
      access_key:
        'ghkfV32HFCCUdGiwHeFtZXohphFFrvWisHxMAWOuMMIqKClib2Sbwkd10iDUfxXn',
      secret_key_hash: encrypt(
        'BtFDDb1yAhXZdk5yasEe6g8C3dVDuWUNL09LryWIyTyfUwkulTifoaFnXN19QvdP',
      ),
    },
  })

  const defaultSymbol = await prisma.symbol.upsert({
    where: { symbol: 'BTCBUSD' },
    update: {},
    create: {
      symbol: 'BTCBUSD',
      base_precision: 8,
      quote_precision: 8,
      min_notional: '0.1',
      min_lot_size: '0.1',
      is_favorite: true,
    },
  })
  console.log({ defaultUser, defaultSymbol })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
