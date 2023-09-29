import {
  DB_URI,
  DEPLOY_TIME,
  GIT_BRANCH,
  GIT_SHA,
  LOG_LEVEL,
  SERVICE,
  STAGE,
} from '@flex/utils/environment'
import { getConnection } from '@flex/db/connect'
import { Logger } from './logger'
import { eventToPayload } from './eventToPayload'
import { makeReturnHandler } from './returnHandler'

/**
 * Creates a lambda handler function that performs consistent setup and
 * teardown tasks, such as connecting to the database and formatting the
 * response.
 *
 * @param {Object} options - Configuration options for the lambda handler.
 * @param {Function} options.handlerFunction - The function that performs
 * the main logic of the lambda handler.
 * @param {string} options.serviceVersion - The version of the service.
 *
 * @returns {Function} A lambda handler function that takes an event and
 * context as arguments and returns a response object with the following
 * format:
 *
 *  {
 *    statusCode: number,
 *    body: string
 *  }
 */
export const createLambdaHandler = ({ handlerFunction, serviceVersion }) => {
  // Create a logger with the specified configuration
  const logger = new Logger({
    handlerName: handlerFunction.name,
    version: serviceVersion,
    gitBranch: GIT_BRANCH,
    gitSha: GIT_SHA,
    deployTime: DEPLOY_TIME,
    stage: STAGE,
    service: SERVICE,
    logLevel: LOG_LEVEL,
  })

  // Create a return handler with the specified configuration
  const returnHandler = makeReturnHandler({
    logger,
    version: serviceVersion,
    gitBranch: GIT_BRANCH,
    gitSha: GIT_SHA,
    deployTime: DEPLOY_TIME,
  })

  // Initialize the payload object
  let payload = {}

  // Create the lambda handler function
  return async (event, context) => {
    try {
      // Don't limit node listeners, important for serverless architecture
      process.setMaxListeners(0)
      // Important for MongoDB responses and connection health
      context.callbackWaitsForEmptyEventLoop = false
      // Connect to the database
      const db = await getConnection({ dbUri: DB_URI, stage: STAGE })

      // Create a consistent event payload for the handler
      // Inject database and logger as well as original event and context
      payload = await eventToPayload({
        _event: event,
        _context: context,
        db,
        logger,
      })

      // Run the handler
      const results = await handlerFunction(payload)

      // Return the results
      return returnHandler(results)
    } catch (error) {
      console.log('Error in createLambdaHandler: ', error)
      console.error(error)
      // If there is an error, log it and return it.
      // Exclude unnecessary properties from the payload
      const {
        _event, _context, logger, ...rest // eslint-disable-line no-unused-vars
      } = payload
      const newError = {
        payload: rest,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          ...error,
        },
      }

      logger.error(newError)
      return {
        statusCode: 400,
        body: JSON.stringify(newError),
      }
    }
  }
}
