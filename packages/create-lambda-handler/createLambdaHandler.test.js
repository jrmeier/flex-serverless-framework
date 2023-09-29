// import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { faker } from '@faker-js/faker'
import { getConnection } from '@flex/db/connect'
import { Logger } from './logger'
import { createLambdaHandler } from './createLambdaHandler'
import { eventToPayload } from './eventToPayload'

vi.mock('./logger', () => ({
  Logger: vi.fn(),
}))

vi.mock('@flex/db/connect', () => ({
  getConnection: vi.fn(),
  closeConnection: vi.fn(),
}))

vi.mock('./eventToPayload', () => ({
  eventToPayload: vi.fn((payload) => ({ ...payload, _eventToPayload: true })),
}))

vi.mock('./returnHandler', () => ({
  makeReturnHandler: vi.fn(() => vi.fn((payload) => ({ ...payload, _makeReturnHandler: true }))),
}))

describe('createLambdaHandler', () => {
  beforeEach(() => {
    vi.resetModules() // Most important - it clears the cache
  })

  test('createLambdaHandler return a function', async () => {
    const mockFn = vi.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    expect(handler).toBeInstanceOf(Function)
  })

  test('createLambdaHandler calls the function and does setup', async () => {
    const mockFn = vi.fn(() => 'test')
    process.setMaxListeners = vi.fn()
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string(),
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true,
    }
    await handler(mockEvent, mockContext)
    expect(mockFn).toHaveBeenCalled()
    expect(process.setMaxListeners).toHaveBeenCalledWith(0)
    expect(mockContext.callbackWaitsForEmptyEventLoop).toBe(false)
  })

  test('createLambdaHandler sets up logger', async () => {
    const mockFn = vi.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string(),
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true,
    }
    await handler(mockEvent, mockContext)
    expect(Logger).toHaveBeenCalled()
  })

  test('createLambdaHandler sets up database', async () => {
    const mockFn = vi.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string(),
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true,
    }
    await handler(mockEvent, mockContext)
    expect(getConnection).toHaveBeenCalled()
  })

  test('createLambdaHandler sets up event parameters', async () => {
    const mockFn = vi.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string(),
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true,
    }
    await handler(mockEvent, mockContext)
    expect(eventToPayload).toHaveBeenCalled()
  })

  test('createLambdaHandler process results via return handler', async () => {
    const mockFn = vi.fn(() => 'test')
    const handler = createLambdaHandler({
      handlerFunction: mockFn,
      serviceVersion: faker.datatype.string(),
    })
    const mockEvent = {
      [faker.datatype.string()]: faker.datatype.string(),
    }
    const mockContext = {
      [faker.datatype.string()]: faker.datatype.string(),
      callbackWaitsForEmptyEventLoop: true,
    }
    const results = await handler(mockEvent, mockContext)
    expect(results._makeReturnHandler).toBe(true)
  })
})
