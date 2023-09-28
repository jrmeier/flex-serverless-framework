import { configureLambdaContext } from './configureLambdaContext'

test('configureLambdaContext', () => {
  const mockContext = {
    callbackWaitsForEmptyEventLoop: true
  }
  const mockEvent = {
    blah: 1234
  }
  const result = configureLambdaContext({
    _event: mockEvent,
    _context: mockContext
  })
  expect(result).toEqual({
    _event: mockEvent,
    _context: mockContext
  })
  expect(mockContext.callbackWaitsForEmptyEventLoop).toBe(false)
})
