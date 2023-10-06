import { Schema } from 'mongoose'

export const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: [{
    type: String,
    required: true,
  }],
  organizationId: {
    type: 'ObjectId',
    ref: 'Organization',
  },
}, { timestamps: true })
