import { buildComposer } from '@flex/db/graph/buildComposer'
import { schemaComposer } from 'graphql-compose'
import { buildUserRelations, buildUserTC } from '../schemas/User/UserGraph'
import { buildOrganizationGraphTC } from '../schemas/Organization/OrganizationGraph'


import { buildUnionTypes } from './buildUnionTypes'
import { buildRoleGraphTC } from '../schemas/Role/RoleGraph'
import { buildPermissionGraphTC } from '../schemas/Permission/PermissionGraph'
import { buildAssignedRoleTC } from '../schemas/Role/AssignedRoleGraph'
import { buildUserLogin } from '../schemas/User/UserLoginGraph'
/**
 * This function builds the GraphQL schema for the GraphQL API.
 *
 * @param {Object} models - Mongoose models
 * @returns {Object} - The GraphQL schema
 */
export const buildAllGraphSchema = ({ models }) => {
  // Initialize GraphQL type composers

  const typeComposers = {
    UserTC: buildComposer(buildUserTC(models)),
    OrganizationTC: buildComposer(buildOrganizationGraphTC(models)),
    PermissionTC: buildComposer(buildPermissionGraphTC(models)),
    RoleTC: buildComposer(buildRoleGraphTC(models)),
    AssignedRoleTC: buildComposer(buildAssignedRoleTC(models)),
  }

  // Add relationships between GraphQL types
  // buildUserRelations(typeComposers)
  buildUserLogin()
  // Try to build the GraphQL schema, log any errors


  try {
    // buildUnionTypes(typeComposers)
    return schemaComposer.buildSchema()
  } catch (e) {
    console.warn(e)
    return schemaComposer
  }
}





export const buildGraphInfo = () => {
  schemaComposer.createObjectTC({
    name: "Info",
    fields: {
      version: 'String',
      name: 'String',
    }
  })

  schemaComposer.Query.addFields({
    graphInfo: {
      type: 'Info',
      resolve: () => ({
        version: '1.0.0',
        name: 'Flex Public',
      })
    }
  })

}