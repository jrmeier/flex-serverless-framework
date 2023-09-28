export const promiseMap = async (promises, concurrency) => {
  const results = []
  const promisesToQueue = [...promises]
  const promiseQueue = []
  let promiseQueueI = concurrency
  let promiseQueueCount = 0
  while (promisesToQueue.length > 0) {
    while (promiseQueueI--) {
      const promise = promisesToQueue.shift()
      if (!promise) {
        break
      }
      if (promiseQueue?.[promiseQueueCount]) {
        promiseQueue[promiseQueueCount].push(promise)
      } else {
        promiseQueue[promiseQueueCount] = [promise]
      }
    }
    promiseQueueCount++
  }
  for await (const promises of promiseQueue) {
    const queueResults = await Promise.allSettled(promises)
    results.push(...queueResults.map((result) => result.value))
  }

  return results
}
