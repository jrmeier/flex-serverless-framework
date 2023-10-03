import { hashPassword } from './hashPassword'
import { PasswordError } from './errors'

export async function compareHash (
  passswordSalt,
  givenPassword,
  userPassword
) {
  const hashedGivenPassword = await hashPassword(givenPassword, passswordSalt)
  if (hashedGivenPassword !== userPassword) {
    throw new PasswordError('Hashes do not match')
  }
  return true
}
