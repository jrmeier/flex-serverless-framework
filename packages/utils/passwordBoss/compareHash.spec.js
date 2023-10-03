import { ac } from '~/src/utils/ac'
import { compareHash } from './compareHash'

test('compareHash should return true - testing salt', async done => {
  const userHashedPassword =
    'fc328232993ff34ca56631e4a101d60393cad12171997ee0b562bf7852b2fed0'
  const givenPassword = 'password'
  const [err, res] = await ac(
    compareHash('salt', givenPassword, userHashedPassword),
  )

  expect(res).toBe(true)
  expect(err).toBeFalsy()
  done()
})

test('compareHash should return false - testing salt', async done => {
  const userHashedPassword =
    'fc328232993ff34ca56631e4a101d60393cad12171997ee0b562bf7852b2fed0'
  const givenPassword = 'password'
  const [err, res] = await ac(
    compareHash(userHashedPassword, givenPassword, 'saltlyMcNah'),
  )

  expect(err.message).toEqual('Hashes do not match')
  expect(res).toBeFalsy()
  done()
})

test('compareHash should return true - testing password', async done => {
  const userHashedPassword =
    'fc328232993ff34ca56631e4a101d60393cad12171997ee0b562bf7852b2fed0'
  const givenPassword = 'password'
  const [err, res] = await ac(
    compareHash('salt', givenPassword, userHashedPassword),
  )

  expect(res).toBe(true)
  expect(err).toBeFalsy()

  done()
})

test('compareHash should return false - testing password', async done => {
  const userHashedPassword =
    'fc328232993ff34ca56631e4a101d60393cad12171997ee0b562bf7852b2fed0'
  const givenPassword = 'password123'

  const [err, res] = await ac(
    compareHash('salt', givenPassword, userHashedPassword),
  )

  expect(err.message).toEqual('Hashes do not match')
  expect(res).toBeFalsy()
  done()
})
