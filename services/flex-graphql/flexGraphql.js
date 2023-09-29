import { buildGraphSchema } from '@flex/db/graph/buildGraphSchema';
import { createLambdaHandler } from '@flex/create-lambda-handler';
import { graphql } from 'graphql';
import { version } from './package.json' // eslint-disable-line

/**
 * Performs GraphQL queries using the specified schema and context.
 *
 * @param {Object} options - Options for executing the GraphQL query.
 * @param {Object} options._event - The original event object.
 * @param {Object} options.db - The database connection.
 * @param {string} options.query - The GraphQL query to be executed.
 * @param {Object} [options.variables] - The variables to be passed to the
 * GraphQL query.
 *
 * @returns {Object} The result of the GraphQL query.
 */
export const graphqlHandler = async ({
  _event, db, query, variables,
}) => {
  // Build the GraphQL schema using the specified database connection
  const graphSchema = buildGraphSchema(db);
  // Set up the options for executing the GraphQL query
  const gqlOptions = {
    schema: graphSchema,
    source: query,
    rootValue: {},
    contextValue: { db, user: _event.requestContext.identity },
    variableValues: variables,
  };
  // Execute the GraphQL query
  const graphResults = await graphql(gqlOptions);
  return graphResults;
};

// Create a lambda handler that wraps the graphqlHandler function
export const handler = createLambdaHandler({
  handlerFunction: graphqlHandler,
  serviceVersion: version,
});
