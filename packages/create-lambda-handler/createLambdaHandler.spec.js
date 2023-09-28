import { beforeEach } from '@jest/globals'

import { Logger } from './logger'
import { createLambdaHandler } from './createLambdaHandler'
import { eventToPayload } from './eventToPayload'
import { faker } from '@faker-js/faker'
import { getConnection } from '@flex/db/connect'

jest.mock('./logger', () => ({
  Logger: jest.fn()
}))

jest.mock('@flex/db/connect', () => ({
  getConnection: jest.fn(),
  closeConnection: jest.fn()
}))

jest.mock('./eventToPayload', () => ({
  eventToPayload: jest.fn((payload) => ({ ...payload, _eventToPayload: true }))
}))

jest.mock('./returnHandler', () => ({
  makeReturnHandler: jest.fn(() =>
    jest.fn((payload) => ({ ...payload, _makeReturnHandler: true }))
  )
}))

describe('createLambdaHandler', () => {
  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
  })

  test('createLambdaHandler return a function', async () => {
    const mockFn = jest.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    expect(handler).toBeInstanceOf(Function)
  })

  test('createLambdaHandler calls the function and does setup', async () => {
    const mockFn = jest.fn(() => 'test')
    process.setMaxListeners = jest.fn()
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string()
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true
    }
    await handler(mockEvent, mockContext)
    expect(mockFn).toHaveBeenCalled()
    expect(process.setMaxListeners).toHaveBeenCalledWith(0)
    expect(mockContext.callbackWaitsForEmptyEventLoop).toBe(false)
  })

  test('createLambdaHandler sets up logger', async () => {
    const mockFn = jest.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string()
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true
    }
    await handler(mockEvent, mockContext)
    expect(Logger).toHaveBeenCalled()
  })

  test('createLambdaHandler sets up database', async () => {
    const mockFn = jest.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string()
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true
    }
    await handler(mockEvent, mockContext)
    expect(getConnection).toHaveBeenCalled()
  })

  test('createLambdaHandler sets up event parameters', async () => {
    const mockFn = jest.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string()
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true
    }
    await handler(mockEvent, mockContext)
    expect(eventToPayload).toHaveBeenCalled()
  })

  test('createLambdaHandler process results via return handler', async () => {
    const mockFn = jest.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string()
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string()
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true
    }
    const results = await handler(mockEvent, mockContext)
    expect(results._makeReturnHandler).toBe(true)
  })
})
