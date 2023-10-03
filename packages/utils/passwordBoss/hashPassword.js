import { algo } from 'crypto-js'

export async function hashPassword (passwordString, salt) {
  const hmac = algo.HMAC.create(algo.SHA256, passwordString)
  hmac.update(salt)

  return hmac.finalize().toString()
}
