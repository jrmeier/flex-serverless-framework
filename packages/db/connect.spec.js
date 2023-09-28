import * as connect from './connect'
import { afterEach } from '@vi/globals'

vi.mock('mongoose', () => ({
  ...vi.requireActual('mongoose'),
  connect: vi.fn(() => 'mockConnection'),
  plugin: vi.fn(() => 'mockPlugins'),
  connection: {
    close: vi.fn(() => 'mockClose')
  }
}))

describe('connect', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  test('getConnection should be singleton and connect', async () => {
    const result = await connect.getConnection({
      dbUri: 'test',
      stage: 'test'
    })

    expect(result.connect._isMockFunction).toBe(true)
    expect(result.connect).toHaveBeenCalledTimes(1)
    await connect.getConnection({
      dbUri: 'test222',
      stage: 'test222'
    })
    expect(result.connect).toHaveBeenCalledTimes(1)
  })

  test('closeConnection should succesfully be called', async () => {
    vi.mock('mongoose', () => ({
      ...vi.requireActual('mongoose'),
      connect: vi.fn(() => 'mockConnection'),
      plugin: vi.fn(() => 'mockPlugins'),
      connection: {
        close: vi.fn(() => 'mockClose')
      }
    }))
    const result = await connect.closeConnection()

    expect(result).toBe(undefined)
  })
})
