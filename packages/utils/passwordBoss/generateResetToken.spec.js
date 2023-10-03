import { generateResetToken } from './generateResetToken'


test('generateResetToken - should update user object and save ', async done => {
  const expirateDate = new Date('2019-07-25T17:10:17.322Z')
  const token = generateResetToken(expirateDate)
  expect(token.expiration).toEqual(expirateDate)
  expect(token.token).not.toBeNull()
  done()
})
