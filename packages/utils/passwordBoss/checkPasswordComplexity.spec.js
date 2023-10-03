import { checkPasswordComplexity } from './checkPasswordComplexity'

test('checkPasswordComplexity should return true', () => {
  const password = '!@Sample11*'
  const result = checkPasswordComplexity(password)
  expect(result).toBeTruthy()
})

test('check PasswordCOmplexity should return false', () => {
  const password = 'password'

  try {
    checkPasswordComplexity(password)
  } catch (e) {
    expect(e).toEqual(
      new Error(
        'Password does not meet complexity requirements. Password must contain a number, a special character, and a letter.',
      ),
    )
  }
})

test('check PasswordCOmplexity should return false', () => {
  const password = 'singlePass'
  try {
    checkPasswordComplexity(password)
  } catch (e) {
    expect(e).toEqual(
      new Error(
        'Password does not meet complexity requirements. Password must contain a number, a special character, and a letter.',
      ),
    )
  }
})

test('check PasswordCOmplexity should return true', () => {
  const password = '@ThUMb15rARE'
  const result = checkPasswordComplexity(password)
  expect(result).toBeTruthy()
})

test('check PasswordCOmplexity should return true', () => {
  const password = '&RICe79aBRUpT'
  const result = checkPasswordComplexity(password)
  expect(result).toBeTruthy()
})

test('check PasswordCOmplexity should return false', () => {
  const password = 'sample34rad234234asfasdf'
  try {
    checkPasswordComplexity(password)
  } catch (e) {
    expect(e).toEqual(
      new Error(
        'Password does not meet complexity requirements. Password must contain a number, a special character, and a letter.',
      ),
    )
  }
})

test('check PasswordCOmplexity should return false', () => {
  const password = 'shR3t'
  try {
    checkPasswordComplexity(password)
  } catch (e) {
    expect(e).toEqual(
      new Error(
        'Password does not meet complexity requirements. Password must contain a number, a special character, and a letter.',
      ),
    )
  }
})
