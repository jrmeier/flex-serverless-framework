import { faker } from '@faker-js/faker'
import { makeReturnHandler } from './returnHandler'

describe('makeReturnHandler', () => {
  let mockConfig
  beforeEach(() => {
    mockConfig = {
      version: faker.datatype.string(),
      gitBranch: faker.datatype.string(),
      gitSha: faker.datatype.string(),
      deployTime: faker.datatype.string()
    }
    Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z').valueOf())
    Date.prototype.toISOString = jest.fn(() => '2021-01-01T00:00:00.000Z')
    jest.clearAllMocks()
  })

  it('should return a handler', () => {
    const handler = makeReturnHandler(mockConfig)
    expect(handler).toBeDefined()
  })

  it('should inject meta into all return objects', () => {
    const mockBody = {
      [faker.datatype.string()]: faker.datatype.string()
    }

    const handler = makeReturnHandler(mockConfig)
    const result = handler(mockBody)
    const expectedReturn = {
      statusCode: 200,
      body: JSON.stringify({
        ...mockBody,
        __meta: {
          gitBranch: mockConfig.gitBranch,
          gitSha: mockConfig.gitSha,
          deployTime: mockConfig.deployTime,
          serverTime: '2021-01-01T00:00:00.000Z',
          serviceVersion: mockConfig.version
        }
      })
    }
    expect(result).toEqual(expect.objectContaining(expectedReturn))
  })

  it('should return only first element of an array body', () => {
    const mockBody = [
      {
        [faker.datatype.string()]: faker.datatype.string()
      },
      {
        [faker.datatype.string()]: faker.datatype.string()
      },
      {
        [faker.datatype.string()]: faker.datatype.string()
      }
    ]

    const handler = makeReturnHandler(mockConfig)
    const result = handler(mockBody)
    const expectedReturn = {
      statusCode: 200,
      body: JSON.stringify({
        ...mockBody[0],
        __meta: {
          gitBranch: mockConfig.gitBranch,
          gitSha: mockConfig.gitSha,
          deployTime: mockConfig.deployTime,
          serverTime: '2021-01-01T00:00:00.000Z',
          serviceVersion: mockConfig.version
        }
      })
    }
    expect(result).toEqual(expect.objectContaining(expectedReturn))
  })
})
