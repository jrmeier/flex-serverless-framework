// Using '@vi/globals' for afterEach, ensure it provides this function
// import { afterEach } from '@vi/globals';
import mongoose from 'mongoose' // eslint-disable-line
import { beforeAll } from 'vitest'
import * as connect from './connect'
// Mocking the 'mongoose' module
const mockConnect = vi.fn(() => 'mockConnection')
// const mockPlugin = vi.fn(() => 'mockPlugins')
const mockClose = vi.fn(() => 'mockClose')

// vi.mock('mongoose', () => ({
//   // ...vi.requireActual('mongoose'),
//   connect: mockConnect,
//   plugin: mockPlugin,
//   connection: {
//     close: mockClose
//   }
// }));

describe.skip('connect', () => {
  beforeAll(() => {
    // mockConnect = vi.fn(() => 'mockConnection')
    // mockPlugin = vi.fn(() => 'mockPlugins')
    // mockClose = vi.fn(() => 'mockClose')

    // vi.mock('mongoose', () => ({
    //   ...vi.requireActual('mongoose'),
    //   connect: mockConnect,
    //   plugin: mockPlugin,
    //   connection: {
    //     close: mockClose
    //   }
    // }));
  })
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  test('getConnection should be singleton and connect', async () => {
    await connect.getConnection({
      dbUri: 'test',
      stage: 'test',
    })

    expect(mockConnect._isMockFunction).toBe(true)
    expect(mockConnect).toHaveBeenCalledTimes(1)

    await connect.getConnection({
      dbUri: 'test222',
      stage: 'test222',
    })

    expect(mockConnect).toHaveBeenCalledTimes(1)
  })

  test('closeConnection should successfully be called', async () => {
    const result = await connect.closeConnection()
    expect(mockClose).toHaveBeenCalledTimes(1)
    expect(result).toBe(undefined)
  })
})
