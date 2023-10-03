import { ac } from '~/src/utils/ac'
import { isPasswordExpired } from './isPasswordExpired'

test('isPasswordExpired - should not be expired', async done => {
  const daysToExpire = 90
  const passwordLastUpdated = moment()

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )
  expect(res).toBe(false)
  expect(err).toBeFalsy()
  done()
})

test('isPasswordExpired - should not be expired', async done => {
  const daysToExpire = 90
  const passwordLastUpdated = moment().subtract('10', 'day')

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )
  expect(res).toBe(false)
  expect(err).toBeFalsy()
  done()
})

test('isPasswordExpired - should be expired', async done => {
  const daysToExpire = 90
  const passwordLastUpdated = moment().subtract('110', 'day')

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )
  expect(err).toBeFalsy()
  expect(res).toBeTruthy()
  done()
})

test('isPasswordExpired - should be expired', async done => {
  const daysToExpire = 10
  const passwordLastUpdated = moment().subtract('20', 'day')

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )
  expect(res).toBeTruthy()
  expect(err).toBeFalsy()
  done()
})

test('isPasswordExpired - should be expired', async done => {
  const daysToExpire = 90
  const passwordLastUpdated = moment().subtract('90', 'day')

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )
  expect(res).toBeTruthy()
  expect(err).toBeFalsy()
  done()
})

test('isPasswordExpired - should be expired', async done => {
  const daysToExpire = 90
  const passwordLastUpdated = moment().subtract('91', 'day')

  const [err, res] = await ac(
    isPasswordExpired(daysToExpire, passwordLastUpdated),
  )

  expect(res).toBeTruthy()
  expect(err).toBeFalsy()
  done()
})
