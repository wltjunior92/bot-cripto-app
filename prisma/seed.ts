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
  console.log({ defaultUser })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
