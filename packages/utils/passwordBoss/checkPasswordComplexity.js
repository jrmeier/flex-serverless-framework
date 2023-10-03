import { PasswordError } from './errors'

export function checkPasswordComplexity (password) {
  const matches = password.match(
    /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[!@#$_'%^&*(),.?:{}|<>]+)(?=.*\d+).{5,}$/gm,
  )

  if (!Boolean(matches)) {
    throw new PasswordError(
      'Password does not meet complexity requirements. Password must contain a number, a special character, and a letter.',
    )
  }

  return true
}
