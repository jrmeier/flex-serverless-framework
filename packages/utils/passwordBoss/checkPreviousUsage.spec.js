/* eslint-disable no-unused-vars */
import { checkPreviousUsage } from './checkPreviousUsage'

test('should return checkPrevousUsage - pass', async done => {
  const hashedPassword = 'password'
  const password_history = [
    { hashed_password: 'password1' },
    { hashed_password: 'password2' },
    { hashed_password: 'password3' },
    { hashed_password: 'password' },
  ]
  const repeat_limit = 4
  const current_password = 'password'
  const [err, res] = checkPreviousUsage(
      hashedPassword,
      password_history,
      current_password,
      repeat_limit,
    )
  expect(err.message).toEqual('Password cannot be reused')
  done()
})

test('should return checkPrevousUsage', async done => {
  const hashedPassword = 'password2'
  const password_history = ['password1', 'password2', 'password3', 'password']
  const repeat_limit = 2
  const current_password = 'another_current_pasword'
  const [err, res] = 
    checkPreviousUsage(
      hashedPassword,
      password_history,
      current_password,
      repeat_limit,
  )
  expect(err).toBeFalsy()

  done()
})

test('should return checkPreviousUsage - should pass because its only been used once', async done => {
  const hashedPassword = 'password5'
  const repeat_limit = 4
  const password_history = [
    { hashed_password: 'password1' },
    { hashed_password: 'password2' },
    { hashed_password: 'password3' },
    { hashed_password: 'password4' },
    { hashed_password: 'password5' },
  ]
  const current_password = 'current_password'
  const [err, res] =
    checkPreviousUsage(
      hashedPassword,
      password_history,
      current_password,
      repeat_limit,
    )
  expect(err).toBeFalsy()
  done()
})

test('should return checkPreviousUsage', async done => {
  const hashedPassword = 'password5'
  const repeat_limit = 5
  const password_history = [
    { hashed_password: 'password1' },
    { hashed_password: 'password2' },
    { hashed_password: 'password3' },
    { hashed_password: 'password' },
    { hashed_password: 'password7' },
  ]
  const [err, res] = checkPreviousUsage(hashedPassword, password_history, repeat_limit)
  expect(err).toBeFalsy()

  done()
})
