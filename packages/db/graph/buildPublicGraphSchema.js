import { buildUserLogin } from '../schemas/User/UserLoginGraph'
import { schemaComposer } from 'graphql-compose'
import { buildComposer } from './buildComposer'
import { buildUnionTypes } from './buildUnionTypes'
import { buildGraphInfo } from './buildAllGraphSchema'

export const buildPublicGraph = (db) => {
    // Initialize GraphQL type composers
    buildUserLogin()
    buildGraphInfo()
    
    const typeComposers = {
      UserLoginTC: buildComposer({model: db.models.User, canMutate: false, canQuery: false, hiddenFields: ['password']}),
    }
    
    try {
      buildUnionTypes(typeComposers)
      return schemaComposer.buildSchema()
    } catch (e) {
      console.warn(e)
      console.log('ERROR BU')
      return schemaComposer
    }
  }