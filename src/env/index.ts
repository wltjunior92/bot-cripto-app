import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  AES_KEY: z.string().length(32),
  CORS_ORIGIN: z.string(),
  PORT: z.coerce.number().default(3333),
  DEFAULT_USER_EMAIL: z.string().email(),
  INTELLIGENCE_LOGS: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid enviroment variables', _env.error.format())

  throw new Error('Invalid enviroment variables.')
}

export const env = _env.data
