import { checkPasswordComplexity } from './checkPasswordComplexity'
import { hashPassword } from './hashPassword'
import { checkPreviousUsage } from './checkPreviousUsage'

export async function setNewUserPassword ({
  user,
  nextPassword,
  passswordSalt,
  minLength = 8,
}) {
  checkPasswordComplexity(nextPassword)

  const isLongEnough = nextPassword.length >= minLength
  if (!isLongEnough) {
    throw new Error(
      `Password must be ${minLength} characters long`,
    )
  }

  const newPasswordHash = await hashPassword(nextPassword, passwordSalt)

  checkPreviousUsage(
    newPasswordHash,
    user.password_details.password_history,
    user.password_details.hashed_password,
    account.password_settings.repeat_limit,
  )

  user.password_details.password_history.push({
    hashed_password: user.password_details.hashed_password,
    archive_date: new Date(),
  })

  user.password_details.hashed_password = newPasswordHash
  user.password_details.force_reset = false
  user.password_details.last_updated = new Date()
  return user
}
