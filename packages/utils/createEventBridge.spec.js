import { createEventBridge } from './createEventBridge'
import { faker } from '@faker-js/faker'
import AWS from 'aws-sdk'

jest.mock('aws-sdk', () => ({
  EventBridge: jest.fn()
}))

describe('createEventBridge', () => {
  let mockConfig
  beforeEach(() => {
    mockConfig = {
      stage: faker.datatype.string(),
      region: faker.datatype.string(),
      accessKeyId: faker.datatype.string(),
      secretAccessKey: faker.datatype.string(),
      sessionToken: faker.datatype.string()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create an event bridge', () => {
    const eventBridge = createEventBridge(mockConfig)
    expect(eventBridge).toBeDefined()
  })

  test('should create an event bridge with offline config', () => {
    const eventBridge = createEventBridge({
      ...mockConfig,
      stage: 'dev'
    })
    expect(eventBridge).toBeDefined()
    expect(AWS.EventBridge).toHaveBeenCalledWith({
      endpoint: 'http://127.0.0.1:4010',
      region: mockConfig.region
    })
  })

  test('should create an event bridge with online config', () => {
    const eventBridge = createEventBridge({
      ...mockConfig,
      stage: 'prod'
    })
    expect(eventBridge).toBeDefined()
    expect(AWS.EventBridge).toHaveBeenCalledWith({
      region: mockConfig.region,
      accessKeyId: mockConfig.accessKeyId,
      secretAccessKey: mockConfig.secretAccessKey,
      sessionToken: mockConfig.sessionToken
    })
  })
})
