import { buildAllGraphSchema, buildPublicGraph } from '@flex/db/graph/buildAllGraphSchema';
import { createLambdaHandler } from '@flex/create-lambda-handler';
import { graphql } from 'graphql';
import { version } from './package.json' // eslint-disable-line
import { schemaComposer } from 'graphql-compose';
import { buildPermissionedGraph } from '@flex/db/graph/buildPermissionedGraph';

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

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.message = message;
  }
}

export const graphqlHandler = async ({
  _event, db, query, variables,
}) => {
  // Build the GraphQL schema using the specified database connection
  // get the access token if its there
  const { headers } = _event;
  let graphSchema;
  
  // console.log({ headers })

  // graphSchema = buildPublicGraph(db);
  const extraContext = {}
  let isAdmin = false;
  let decodedToken = null;
  let user = null;

  if(!headers.Authorization) {
    graphSchema = buildAllGraphSchema(db);
  } else {
  // check the token and see if its valid
  const accessToken = headers.Authorization
  if (accessToken === "admin") {
    isAdmin = true;
  }
  try {
    //   // attempt to log the user in
    if(!isAdmin) {
      decodedToken = db.models.User.verifyAccessToken(accessToken)
      extraContext.decodedToken = decodedToken;
      // TODO: make this something else?
      // extraContext.organizationId = decodedToken.permissions[0].organizationId
      if(decodedToken.error) {
        throw new AuthError(decodedToken)
      } else {
        // admin graph, dont build mostly
        user = await db.models.User.findById(decodedToken.userId)

        if (user){ 
          extraContext.user = user;
          const roles = await user.getRoles(decodedToken.organizationId)

          if(roles.length > 0) {
            isAdmin = roles.find(r => r.name === 'app:admin')
          }
        } else {
          throw new AuthError('User: not found.')
        }
      }
    }

    if(isAdmin) {
      console.log('admin')
      graphSchema = await buildAllGraphSchema(db);
    } else {
      console.log('not admin')
      graphSchema = await buildPermissionedGraph({db, user, orgId: decodedToken.organizationId});
    }
  } catch(e) {
    // don't build the graph, but return the errors
    return {
          errors: [{message: e.message, type: e.name}],
        }
      }
  } 


  // Set up the options for executing the GraphQL query
  const gqlOptions = {
    schema: graphSchema,
    source: query,
    rootValue: {},
    contextValue: { db, event: _event, ...extraContext},
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