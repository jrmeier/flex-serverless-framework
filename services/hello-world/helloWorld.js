import { createLambdaHandler } from '@flex/create-lambda-handler';
import { version } from './package.json' // eslint-disable-line

/**
 * Example Hello World
 *
 * @returns {Object} { message: 'Hello World'}
 */

export const helloWorld = async () => ({
  message: 'Hello World',
});

// Create a lambda handler that wraps the graphqlHandler function
export const handler = createLambdaHandler({
  handlerFunction: helloWorld,
  serviceVersion: version,
});
