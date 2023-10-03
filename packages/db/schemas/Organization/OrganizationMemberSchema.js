import { Schema } from 'mongoose'

export const OrganizationMemberSchema = new Schema({
    organizationId: {
        type: 'ObjectId',
        ref: 'Organization',
    },
    userId: {
        type: 'ObjectId',
        ref: 'User',
    },
    roles: {
        type: 'ObjectId',
        ref: ['Role']
    }
}, { timestamps: true })
