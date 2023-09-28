import { buildUserRelations, buildUserTC } from '../schemas/user/UserGraph'

import { buildComposer } from '@flex/db/graph/buildComposer'
import { buildUnionTypes } from './buildUnionTypes'
import { schemaComposer } from 'graphql-compose'

/**
 * This function builds the GraphQL schema for the GraphQL API.
 *
 * @param {Object} models - Mongoose models
 * @returns {Object} - The GraphQL schema
 */
export const buildGraphSchema = ({ models }) => {
  // Initialize GraphQL type composers

  const typeComposers = {
    UserTC: buildComposer(buildUserTC(models)),
  }

  // Add relationships between GraphQL types
  buildUserRelations(typeComposers)
  // Try to build the GraphQL schema, log any errors
  try {
    buildUnionTypes(typeComposers)
    return schemaComposer.buildSchema()
  } catch (e) {
    console.warn(e)
    console.log("ERROR BU")
    return schemaComposer
  }
}
