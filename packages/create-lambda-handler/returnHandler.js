/**
 * Creates a return handler function that can be used to consistently format
 * the response from a lambda function.
 *
 * @param {Object} options - Configuration options for the return handler.
 * @param {string} [options.version='0.0.0'] - The version of the service.
 * @param {string} options.gitBranch - The git branch that was deployed.
 * @param {string} options.gitSha - The git SHA that was deployed.
 * @param {string} options.deployTime - The time the code was deployed.
 *
 * @returns {Function} A return handler function that takes the body of the
 * response as an argument and returns an object with the following format:
 *
 *  {
 *    statusCode: 200,
 *    body: {
 *      // The original body of the response
 *      ...body,
 *      // Meta information about the response
 *      __meta: {
 *        gitBranch: string,
 *        gitSha: string,
 *        deployTime: string,
 *        serverTime: string,
 *        serviceVersion: string,
 *      }
 *    }
 *  }
 */
export const makeReturnHandler = ({
  version = '0.0.0', gitBranch, gitSha, deployTime,
}) => (body) => {
  // Determine whether the body should be stringified and whether
  // the original body or a modified version should be used
  const [returnBody, shouldStringify] = Array.isArray(body)
    ? [body[0], body[1]]
    : [body, true]

  // Create the __meta object with the specified information
  const __meta = {
    gitBranch,
    gitSha,
    deployTime,
    serverTime: new Date().toISOString(),
    serviceVersion: version,
  }

  // Create the result object with the body and __meta information
  const result = {
    statusCode: 200,
    body: shouldStringify
      ? JSON.stringify({ ...returnBody, __meta })
      : returnBody,
  }

  return result
}
