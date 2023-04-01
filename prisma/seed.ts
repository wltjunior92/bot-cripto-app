import { PrismaClient } from '@prisma/client'
import { encrypt } from '../src/utils/crypto'
import { hash } from 'bcryptjs'
import { monitorTypes } from '../src/utils/constants'

const prisma = new PrismaClient()

async function main() {
  const defaultUserDev = await prisma.user.upsert({
    where: { email: 'wlt.junior92@gmail.com' },
    update: {},
    create: {
      email: 'wlt.junior92@gmail.com',
      name: 'Walter Júnior',
      password_hash: await hash('12345678', 6),
      api_url: 'https://testnet.binance.vision/api/',
      stream_url: 'wss://testnet.binance.vision/ws/',
      access_key:
        'ghkfV32HFCCUdGiwHeFtZXohphFFrvWisHxMAWOuMMIqKClib2Sbwkd10iDUfxXn',
      secret_key_hash: encrypt(
        'BtFDDb1yAhXZdk5yasEe6g8C3dVDuWUNL09LryWIyTyfUwkulTifoaFnXN19QvdP',
      ),
    },
  })

  const defaultUserProd = await prisma.user.upsert({
    where: { email: 'wlt.junior.pdt@gmail.com' },
    update: {},
    create: {
      email: 'wlt.junior.pdt@gmail.com',
      name: 'Walter Júnior',
      password_hash: await hash('12345678', 6),
      api_url: 'https://testnet.binance.vision/api/',
      stream_url: 'wss://stream.binance.com:9443/ws',
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

  const miniTickerMonitor = await prisma.monitor.upsert({
    where: {
      monitors_type_symbol_interval_index: {
        symbol: '*',
        type: monitorTypes.MINI_TICKER,
        interval: '',
      },
    },
    update: {},
    create: {
      type: monitorTypes.MINI_TICKER,
      broadcast_label: 'miniTicker',
      symbol: '*',
      interval: '',
      is_active: true,
      is_system_mon: true,
      indexes: null,
      logs: false,
    },
  })
  const bookMonitor = await prisma.monitor.upsert({
    where: {
      monitors_type_symbol_interval_index: {
        symbol: '*',
        type: monitorTypes.BOOK,
        interval: '',
      },
    },
    update: {},
    create: {
      type: monitorTypes.BOOK,
      broadcast_label: 'book',
      symbol: '*',
      interval: '',
      is_active: true,
      is_system_mon: true,
      indexes: null,
      logs: false,
    },
  })
  const userDataMonitor = await prisma.monitor.upsert({
    where: {
      monitors_type_symbol_interval_index: {
        symbol: '*',
        type: monitorTypes.USER_DATA,
        interval: '',
      },
    },
    update: {},
    create: {
      type: monitorTypes.USER_DATA,
      broadcast_label: 'balance,execution',
      symbol: '*',
      interval: '',
      is_active: true,
      is_system_mon: true,
      indexes: null,
      logs: false,
    },
  })
  const candlesMonitor = await prisma.monitor.upsert({
    where: {
      monitors_type_symbol_interval_index: {
        symbol: 'BTCUSDT',
        type: monitorTypes.CANDLES,
        interval: '1m',
      },
    },
    update: {},
    create: {
      type: monitorTypes.CANDLES,
      broadcast_label: null,
      symbol: 'BTCUSDT',
      interval: '1m',
      is_active: true,
      is_system_mon: false,
      indexes: 'RSI,MACD',
      logs: false,
    },
  })
  console.log({
    defaultUserDev,
    defaultUserProd,
    defaultSymbol,
    miniTickerMonitor,
    bookMonitor,
    userDataMonitor,
    candlesMonitor,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
