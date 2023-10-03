import { Schema } from 'mongoose'

export const AssignedRoleSchema = new Schema({
    organizationId: {
        type: 'ObjectId',
        ref: 'Organization',
        required: true,
    },
    userId: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    roleId: {
        type: 'ObjectId',
        ref: 'Role',
        required: true,
    }
}, { timestamps: true })
.index({ organizationId: 1, userId: 1, roleId: 1 }, { unique: true })
