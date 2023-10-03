import { ac } from '~/src/utils/ac'
import { hashPassword } from './hashPassword'

test('should return a hashed password', async done => {
  const passwordString = 'password'
  const salt = 'MhmmSalty'

  const [err, res] = await ac(hashPassword(passwordString, salt))
  expect(res).toEqual(
    'daafe98a986eb29da48f9e6b0a86e228aec1c595af3b082d53cc02dd21e71c1c',
  )
  expect(err).toBeFalsy()
  done()
})

test('should return a hashed password', async done => {
  const passwordString = '123ASDFasf9asdc3DD@!@'
  const salt = 'soMuchSalt'

  const [err, res] = await ac(hashPassword(passwordString, salt))
  expect(res).toEqual(
    '4aeb9eae1f1be6bac05a7bd934210211cec9229dc896196a568268729e81f020',
  )
  expect(err).toBeFalsy()
  done()
})

test('should throw an error', async done => {
  const passwordString = '123ASDFasf9asdc3DD@!@'
  const salt = undefined

  const [err, res] = await ac(hashPassword(passwordString, salt))
  expect(err.message).toEqual("Cannot read property 'words' of undefined")
  expect(res).toBeFalsy()
  done()
})

test('should throw an error', async done => {
  const passwordString = undefined
  const salt = 'SOmuchSalt'

  const [err, res] = await ac(hashPassword(passwordString, salt))
  expect(err.message).toEqual("Cannot read property 'sigBytes' of undefined")
  expect(res).toBeFalsy()
  done()
})
