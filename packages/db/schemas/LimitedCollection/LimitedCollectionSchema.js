import { Schema } from 'mongoose'

export const LimitedCollectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true })
