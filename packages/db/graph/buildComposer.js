import { composeMongoose } from 'graphql-compose-mongoose'
import { schemaComposer } from 'graphql-compose'

/**
 * This function is used to create a GraphQL type composer for a given Mongoose model.
 * It sets up the basic CRUD operations for the type and also allows for additional
 * customization options and fields to be added.
 *
 * @param {Object} options - An object containing the configuration options for the type composer.
 * @param {Object} options.model - The Mongoose model to use for the type composer.
 * @param {string} options.name - The name of the type.
 * @param {boolean} [options.canMutate=false] - A boolean flag indicating whether the type can be mutated (i.e. create, update, delete).
 * @param {Object} [options.customizationOptions={}] - Additional customization options to pass to the `composeMongoose` function.
 * @param {Object} [options.fields={}] - Additional fields to add to the type.
 * @param {Array} [options.sortOptions] - An array of objects containing configuration options for the sort arguments of the `findMany` resolver. Each object should have the following format: { resolverName: 'findMany', name: 'SORT_NAME', value: { SORT_FIELD: 1 } }
 * @param {string} [options.description=''] - A description for the type.
 *
 * @return {Object} - The GraphQL type composer for the given Mongoose model.
 */
export const buildComposer = ({
  model,
  name,
  canMutate = false,
  customizationOptions = {},
  fields = {},
  sortOptions,
  description = ''
}) => {
  if (!model) throw new Error(`${name}, Model not defined!`)
  let TC = null

  try {
    TC = composeMongoose(model, {
      ...customizationOptions,
      name: model.modelName
    })
  } catch (e) {
    TC = schemaComposer.getOTC(model.modelName)
  }

  if (canMutate) {
    schemaComposer.Mutation.addFields({
      ...{
        [`${model.modelName}CreateMany`]: TC.mongooseResolvers.createMany(),
        [`${model.modelName}CreateOne`]: TC.mongooseResolvers.createOne(),
        [`${model.modelName}UpdateById`]: TC.mongooseResolvers.updateById(),
        [`${model.modelName}UpdateOne`]: TC.mongooseResolvers.updateOne(),
        [`${model.modelName}UpdateMany`]: TC.mongooseResolvers.updateMany(),
        [`${model.modelName}RemoveById`]: TC.mongooseResolvers.removeById(),
        [`${model.modelName}RemoveOne`]: TC.mongooseResolvers.removeOne(),
        [`${model.modelName}RemoveMany`]: TC.mongooseResolvers.removeMany()
      }
    })
  }

  schemaComposer.Query.addFields({
    ...{
      [`${model.modelName}ById`]: TC.mongooseResolvers.findById(),
      [`${model.modelName}ByIds`]: TC.mongooseResolvers.findByIds(),
      [`${model.modelName}One`]: TC.mongooseResolvers.findOne(),
      [`${model.modelName}Many`]: TC.mongooseResolvers.findMany(),
      [`${model.modelName}Count`]: TC.mongooseResolvers.count(),
      [`${model.modelName}Connection`]: TC.mongooseResolvers.connection(),
      [`${model.modelName}Pagination`]: TC.mongooseResolvers.pagination()
    }
  })

  schemaComposer.createInputTC({
    name: 'DateRangeInput',
    fields: {
      start: 'Date!',
      stop: 'Date!'
    }
  })

  TC.setDescription(description)

  TC.addFields({
    ...fields
  })

  TC.mongooseResolvers
    .findMany()
    .addSortArg({
      name: 'UPDATED_ASC',
      value: { last_updated: -1 }
    })
    .addSortArg({
      name: 'UPDATED_DESC',
      value: { last_updated: 1 }
    })

  if (sortOptions) {
    sortOptions.forEach(({ resolverName, ...rest }) => {
      TC.mongooseResolvers[resolverName]().addSortArg(rest)
    })
  }
  return TC
}
