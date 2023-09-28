import { Schema } from 'mongoose'

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [
    {
      type: String
    }
  ],
  // Additional fields for AWS Cognito integration
  sub: String,
  name: String,
  given_name: String,
  family_name: String,
  middle_name: String,
  nickname: String,
  preferred_username: String,
  profile: String,
  picture: String,
  website: String,
  email_verified: Boolean,
  gender: String,
  birthdate: Date,
  zoneinfo: String,
  locale: String,
  phone_number: String,
  phone_number_verified: Boolean,
  address: {
    formatted: String,
    street_address: String,
    locality: String,
    region: String,
    postal_code: String,
    country: String
  },
  updated_at: Date,
  identity_provider: String,
  user_status: String,
  user_creation_time: Date,
  user_last_modified_time: Date,
  // Additional custom fields
  custom: Schema.Types.Mixed,
  subscription: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false
    }
  ]
})
