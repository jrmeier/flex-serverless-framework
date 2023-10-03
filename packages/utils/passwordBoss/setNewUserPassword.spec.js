import { ac } from '~/src/utils/ac'
import { setNewUserPassword } from '~/src/services/PasswordService/setNewUserPassword'

test('should successfully set a new user password on a FRESH user', async done => {
  const user = {
    password_details: {
      hashed_password:
        'ae6cb359f2e8f9c94e28eb4ddf7f3f8da9cd9565c6a2f6c42a5c5bf8934f7a30', //passworD433!
      password_history: [],
    },
  }
  const next_password = 'pASSword5$'
  const account = {
    password_settings: {
      min_len: 5,
      repeat_limit: 2,
    },
  }

  const password_salt = 'MhmmSalty'

  const [err, res] = await ac(
    setNewUserPassword({
      user,
      next_password,
      account,
      password_salt,
    }),
  )
  expect(err).toBeFalsy()
  expect(res.password_details.hashed_password).toEqual(
    '9a3827d8cef5e5cd10cd912925e8bb87e9e004a6a46df49eb6314591862ec739',
  )
  expect(res.password_details.password_history[0].hashed_password).toEqual(
    'ae6cb359f2e8f9c94e28eb4ddf7f3f8da9cd9565c6a2f6c42a5c5bf8934f7a30',
  )
  expect(res.password_details.force_reset).toBe(false)

  done()
})

test('should fail to set a password because its the same as the current password', async done => {
  const user = {
    password_details: {
      hashed_password:
        '4aeb9eae1f1be6bac05a7bd934210211cec9229dc896196a568268729e81f020',
      password_history: [],
    },
  }
  const given_password = '123ASDFasf9asdc3DD@!@'
  const next_password = '123ASDFasf9asdc3DD@!@'
  const account = {
    password_settings: {
      min_len: 5,
      repeat_limit: 3,
    },
  }

  const password_salt = 'soMuchSalt'

  const [err, res] = await ac(
    setNewUserPassword({
      user,
      given_password,
      next_password,
      account,
      password_salt,
    }),
  )

  expect(err.message).toEqual('Password cannot be reused')
  expect(res).toBeFalsy()
  done()
})

test('should fail to set a password because its the same as the current password', async done => {
  const user = {
    password_details: {
      hashed_password:
        '4aeb9eae1f1be6bac05a7bd934210211cec9229dc896196a568268729e81f020',
      password_history: [],
    },
  }
  const given_password = '123ASDFasf9asdc3DD@!@'
  const next_password = '123ASDFasf9asdc3DD@!@'
  const account = {
    password_settings: {
      min_len: 5,
      repeat_limit: 2,
    },
  }

  const password_salt = 'soMuchSalt'

  const [err, res] = await ac(
    setNewUserPassword({
      user,
      given_password,
      next_password,
      account,
      password_salt,
    }),
  )
  expect(err.message).toEqual('Password cannot be reused')
  expect(res).toBeFalsy()
  done()
})
