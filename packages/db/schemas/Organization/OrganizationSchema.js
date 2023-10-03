import { Schema } from 'mongoose'

export const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: 'ObjectId',
    ref: 'User',
  },
  members: [
    {
      type: 'ObjectId',
      ref: 'OrganizationMember',
    },
  ],
}, { timestamps: true })
