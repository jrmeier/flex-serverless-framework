import mongoose from 'mongoose'

export const extendSchema = (Schema, definition, options) => {
  const ExtendedSchema = new mongoose.Schema(
    ({ ...Schema.obj, ...definition }),
    options,
  )
  ExtendedSchema.methods = {

    ...Schema.methods,
    ...ExtendedSchema.methods,
  }
  ExtendedSchema.statics = {

    ...Schema.statics,
    ...ExtendedSchema.statics,
  }
  ExtendedSchema.virtuals = {

    ...Schema.virtuals,
    ...ExtendedSchema.virtuals,
  }
  ExtendedSchema.query = { ...Schema.query, ...ExtendedSchema.query }
  return ExtendedSchema
}
