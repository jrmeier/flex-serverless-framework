import { Schema, ObjectId } from 'mongoose'

export const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  note: {
    type: String
  },
  organizationId: {
    type: String
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
  },
}, { timestamps: true })

PermissionSchema.pre('save', async function (next) {
  next()
})
