import mongoose from 'mongoose'

import { UserSchema } from './schemas/User/UserSchema'
import { OrganizationSchema } from './schemas/Organization/OrganizationSchema'
import { RoleSchema } from './schemas/Role/RoleSchema'
import { AssignedRoleSchema } from './schemas/Role/AssignedRoleSchema'

import { LimitedCollectionSchema } from './schemas/LimitedCollection/LimitedCollectionSchema'
/**
 * Plugins for all mongoose models in this file
 */
mongoose.plugin((schema) => {
  schema.set('toObject', { virtuals: true })
  schema.set('toJSON', { virtuals: true })
  schema.set('timestamps', true)
})

/**
 * All the data models that are used in the application.
 * @type {Object}
 */
const models = {
  User: UserSchema,
  Organization: OrganizationSchema,
  Role: RoleSchema,
  AssignedRole: AssignedRoleSchema,
  LimitedCollection: LimitedCollectionSchema,
}

/**
 * Create all the models.
 */
Object.keys(models).forEach((modelName) => {
  try {
    // Attempt to retrieve the model from mongoose. If it doesn't exist, it will throw an error and the model will be created below.
    models[modelName] = mongoose.model(modelName)
  } catch {
    // If the model doesn't exist, create it using the schema provided in the models object.
    models[modelName] = mongoose.model(modelName, models[modelName])
  }
})

/**
 * Export all the models.
 * @type {Object}
 */
export default models
