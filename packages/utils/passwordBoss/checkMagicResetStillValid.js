import { PasswordError } from './errors'

export function checkMagicResetStillValid (givenMagicToken, password_details) {
  const tokensMatch = givenMagicToken === password_details.magic_reset_token
  const tokenStillValid = new Date() < password_details.magic_reset_expires

  const stillValid = tokensMatch && tokenStillValid

  if (!stillValid) {
    throw new PasswordError('Magic reset token is no longer valid.')
  }

  return true
}
