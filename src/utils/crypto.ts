/* eslint-disable new-cap */
import { env } from '../env'
import aes from 'aes-js'

const key = aes.utils.utf8.toBytes(env.AES_KEY)

export function encrypt(text: string) {
  const bytesInfo = aes.utils.utf8.toBytes(text)
  const aesCTR = new aes.ModeOfOperation.ctr(key)

  const encryptedBytes = aesCTR.encrypt(bytesInfo)
  return aes.utils.hex.fromBytes(encryptedBytes)
}

export function decrypt(encryptedHex: string) {
  const encryptedBytes = aes.utils.hex.toBytes(encryptedHex)
  const aesCTR = new aes.ModeOfOperation.ctr(key)

  const decryptedBytes = aesCTR.decrypt(encryptedBytes)
  return aes.utils.utf8.fromBytes(decryptedBytes)
}
