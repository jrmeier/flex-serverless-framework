import { buildComposer } from '@flex/db/graph/buildComposer'
import { schemaComposer } from 'graphql-compose'
import { buildUserLogin } from '../schemas/User/UserLoginGraph'
import { composeMongoose } from 'graphql-compose-mongoose'

import { buildUnionTypes } from './buildUnionTypes'
import { buildGraphInfo } from './buildAllGraphSchema'
import { buildUserRelations} from '../schemas/User/UserGraph'
import { buildPublicGraph } from './buildPublicGraphSchema'
import parsePermissionString from '../permission/parsePermissionString'
import { buildOrganizationRelations } from '../schemas/Organization/OrganizationGraph'

const buildPermissionedComposer = ({
    model,
    name,
    customizationOptions = {},
    fields = {},
    description = '',
    removeFields = [],
    alwaysFilter = {}, // field values to filter to always filter on
    canCreate = false,
    canRead = false,
    canUpdate = false,
    canDelete = false,
  }) => {
    console.log('building permissioned composer')
    let TC = null


    // TODO: maybe pass this in?
    const getFieldsToExclude = (model) => {
      if(model.modelName === 'User') {
        return ['password', 'passwordResetToken', 'passwordResetExpires', 'lastPasswords', 'permissions']
      }
      return []
    }
    removeFields = [...getFieldsToExclude(model), ...removeFields]

    try {
      TC = composeMongoose(model, {
        ...customizationOptions,
        name: name || model.modelName,
        removeFields
      })
    } catch (e) {
      TC = schemaComposer.getOTC(name || model.modelName)
    }

    const newQueryFields = {}
    const newMutationFields = {}

    // remove any non nullable fields from the type
    removeFields.forEach(f => {
      TC.makeFieldNullable(f)
    })


    if (canRead) {
      const slt = `-${removeFields.join(' -')}`
      TC.addResolver({
          name: 'Find',
          args: TC.mongooseResolvers.findMany().getArgs(),
          type: [TC],
          resolve: async ({ source, args, context: { db, decodedToken } }) => {
            console.log("running find")
            const argsFilter = args.filter || {}

            const query = db.models[name || model.modelName]
            .find({...argsFilter, ...alwaysFilter})

            if (slt === '-password'){
              query.select(slt)
            }
            const result = await query.skip(args.skip)
            query.sort(args.sort)
            query.limit(args.limit)
            

            // return wtf
            return result
          }
        })

        // TC.getResolver('Find')
        // .addSortArg({
        //   name: 'UPDATED_ASC',
        //   value: { updatedAt: -1 }
        // })
        // .addSortArg({
        //   name: 'UPDATED_DESC',
        //   value: { updatedAt: 1 }
        // })
    
      // if (sortOptions) {
      //   sortOptions.forEach(({ resolverName, ...rest }) => {
      //     TC.mongooseResolvers[resolverName]().addSortArg(rest)
      //   })
      newQueryFields[`${name || model.modelName}Find`] = TC.getResolver('Find')

      TC.addResolver({
        name: 'findOne',
        args: TC.mongooseResolvers.findOne().getArgs(),
        type: TC,
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          console.log("running find")
          const argsFilter = args.filter || {}
          
          const query = db.models[name || model.modelName]
          .findOne({...argsFilter, ...alwaysFilter})

          if (slt === '-password'){
            query.select(slt)
          }
          const result = await query.skip(args.skip)
          query.sort(args.sort)
          
          // return wtf
          return result
        }
      })

      // TC.getResolver('Find')
      // .addSortArg({
      //   name: 'UPDATED_ASC',
      //   value: { updatedAt: -1 }
      // })
      // .addSortArg({
      //   name: 'UPDATED_DESC',
      //   value: { updatedAt: 1 }
      // })
  
    // if (sortOptions) {
    //   sortOptions.forEach(({ resolverName, ...rest }) => {
    //     TC.mongooseResolvers[resolverName]().addSortArg(rest)
    //   })
    newQueryFields[`${name || model.modelName}Find`] = TC.getResolver('FindOne')
    }

    if (canUpdate) {
      TC.addResolver({
        name: 'UpdateOne',
        args: TC.mongooseResolvers.updateOne().getArgs(),
        type: TC,
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          if (!args.record.organizationId) {
            args.record.organizationId = decodedToken.organizationId
          }
          // always include the filter
          const newRecord = {...args.record, ...alwaysFilter}
          return db.models[model.modelName].findByIdAndUpdate(args.record._id, newRecord, {new: true})
        }
      })
      newMutationFields[`${name || model.modelName}UpdateOne`] = TC.getResolver('UpdateOne')

      TC.addResolver({
        name: 'UpdateMany',
        args: TC.mongooseResolvers.updateOne().getArgs(),
        type: TC,
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          if (!args.record.organizationId) {
            args.record.organizationId = decodedToken.organizationId
          }
          return db.models[model.modelName].updateMany({...args.filter, ...alwaysFilter}, args.record, {new: true})
        }
      })
      newMutationFields[`${name || model.modelName}UpdateMany`] = TC.getResolver('UpdateMany')
    }
    if (canCreate) {
      TC.addResolver({
        name: 'Create',
        args: TC.mongooseResolvers.createOne().getArgs(),
        type: TC,
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          return db.models[name || model.modelName].create({...args.record, organizationId: decodedToken.organizationId})
        }
      })
      newMutationFields[`${name || model.modelName}Create`] = TC.getResolver('Create')

      TC.addResolver({
        name: 'CreateMany',
        args: TC.mongooseResolvers.createMany().getArgs(),
        type: [TC],
        resolve: async ({ source, args, context: { db } }) => {
          const newRecords = args.records.map(r => ({...r, ...alwaysFilter}))
          
          return db.models[name || model.modelName].insertMany(newRecords)
        }
      })
      newMutationFields[`${name || model.modelName}CreateMany`] = TC.getResolver('CreateMany')
    }

    if (canDelete) {
      TC.addResolver({
        name: 'RemoveOne',
        args: TC.mongooseResolvers.removeOne().getArgs(),
        type: TC,
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          return db.models[model.modelName].findByIdAndDelete(args._id)
        }
      })
      newMutationFields[`${name || model.modelName}RemoveOne`] = TC.getResolver('RemoveOne')

      TC.addResolver({
        name: 'RemoveMany',
        args: TC.mongooseResolvers.removeMany().getArgs(),
        type: [TC],
        resolve: async ({ source, args, context: { db, decodedToken } }) => {
          return db.models[model.modelName].updateMany({...args.filter, ...alwaysFilter},{$set: {deletedAt: new Date()}})
        }
      })
      newMutationFields[`${name || model.modelName}RemoveMany`] = TC.getResolver('RemoveMany')
  }

    schemaComposer.Query.addFields(newQueryFields)
    schemaComposer.Mutation.addFields(newMutationFields)


      schemaComposer.createInputTC({
        name: 'DateRangeInput',
        fields: {
          start: 'Date!',
          stop: 'Date!',
        },
      })
    
      TC.setDescription(description)
    
      TC.addFields({
        ...fields,
      })

      // TODO: add sort options

    return TC
  
}

  const buildMeQuery = (db) => {
    let MeTC = null

    try {
      MeTC = composeMongoose(db.models.User, {
        name: 'Me',
        removeFields: ['password', 'passwordResetToken', 'passwordResetExpires', 'lastPasswords', 'permissions','lastPasswords'],
      })
    } catch (e) {
        MeTC = schemaComposer.getOTC('Me')
    }
  
    const MeResolver = schemaComposer.createResolver({
      name: 'MeResolver',
      type: MeTC,
      resolve: async ({ source, args, context: { db, decodedToken } }) => {
        console.log('running Me')
  
        const user = await db.models.User.findById(decodedToken.userId)
        return user
      }
    })

    return { MeTC, MeResolver }
}


export const buildPermissionedGraph = async ({db, user, orgId}) => {
  // first, figure out what roles the user has
  console.log('building permissioned graph')
  buildPublicGraph(db)
  buildMeQuery(db)
  // console.log({user})
  const userRoles = await user.getRoles(orgId)

  const allPermissions = userRoles.reduce((acc, role) => {
    return [...acc, ...role.permissions]
  }, [])




  const parsedPermissions = [...new Set(allPermissions.map(p=> parsePermissionString(p)))]

  // okay start building the graph
  const typeComposers = {}
  const alwaysFilter = { organizationId: orgId }

  // always add the user read permissions
  const UserTC = buildPermissionedComposer({
    model: db.models.User,
    name: 'User',
    description: 'A user in the system.',
    canRead: true,
    alwaysFilter,
  })
  typeComposers.UserTC = UserTC

  // always add the role read permissions
  const RoleTC = buildPermissionedComposer({
    model: db.models.Role,
    name: 'Role',
    description: 'A role in the system.',
    canRead: true,
    alwaysFilter,
  })
  typeComposers.RoleTC = RoleTC

  // always add the organization read permissions
  const OrganizationTC = buildPermissionedComposer({
    model: db.models.Organization,
    name: 'Organization',
    description: 'An organization in the system.',
    canRead: true,
    alwaysFilter,
  })
  typeComposers.OrganizationTC = OrganizationTC
  
  parsedPermissions.forEach(p => {
    // if its a model, we will build it, then add it to the schema in the helper function above
    if (p.model) {
      // const canCreate = p.pid === 'c' || p.pid === 'admin'
      const canCreate = p.pid.includes('c')
      const canRead = p.pid.includes('r')
      const canUpdate = p.pid.includes('u')
      const canDelete = p.pid.includes('d')

      const TC = buildPermissionedComposer({
        model: db.models[p.model],
        name: p.model,
        organizationId: orgId,
        alwaysFilter,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
      })

      typeComposers[`${p.model}TC`] = TC
    } else if (p.type === 'action') {
      // TODO: add action, probably just import the types from somewhere
      // if is an action, we will add it to the schema in a different helper function
    }
    
  })
  // determine what we need build based on the roles
  // always included these two
  // const typeComposers = {
  //   // MeTC,
  //   UserTC
  // }
  // Add relationships between GraphQL types
  // check if the users type exists
  if (typeComposers.UserTC) {
    console.log("building user relations")
    buildUserRelations(typeComposers)
  }

  if (typeComposers.OrganizationTC) {
    console.log("building organization relations")
    buildOrganizationRelations(typeComposers)
  }
  // Try to build the GraphQL schema, log any errors
  try {
    // buildUnionTypes(typeComposers)
    console.log("trying to build schema")
    return schemaComposer.buildSchema()
  } catch (e) {
    console.warn(e)
    console.log('ERROR BU')
    return schemaComposer
  }

}
