import mongoose from 'mongoose'

export const extendSchema = (Schema, definition, options) => {
  const ExtendedSchema = new mongoose.Schema(
    Object.assign({}, Schema.obj, definition),
    options
  )
  ExtendedSchema.methods = Object.assign(
    {},
    Schema.methods,
    ExtendedSchema.methods
  )
  ExtendedSchema.statics = Object.assign(
    {},
    Schema.statics,
    ExtendedSchema.statics
  )
  ExtendedSchema.virtuals = Object.assign(
    {},
    Schema.virtuals,
    ExtendedSchema.virtuals
  )
  ExtendedSchema.query = Object.assign({}, Schema.query, ExtendedSchema.query)
  return ExtendedSchema
}
