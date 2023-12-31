import { promiseMap } from './promiseMap'

describe('promiseMap', () => {
  test('should return a promise that resolves to an array of the results of the promises', async () => {
    const promises = [
      new Promise((resolve) => setTimeout(() => resolve(1), 500)),
      new Promise((resolve) => setTimeout(() => resolve(2), 100)),
      new Promise((resolve) => setTimeout(() => resolve(3), 600)),
    ]
    const result = await promiseMap(promises, 1)
    expect(result).toEqual([1, 2, 3])
  })
  // eslint-disable-next-line
  test('should return a promise that resolves to an array of the results of the promises', async () => {
    const promises = [
      new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
      new Promise((resolve) => setTimeout(() => resolve(2), 1500)),
      new Promise((resolve) => setTimeout(() => resolve(3), 2200)),
      new Promise((resolve) => setTimeout(() => resolve(4), 2600)),
    ]
    const result = await promiseMap(promises, 1)
    expect(result).toEqual([1, 2, 3, 4])
  })
})
