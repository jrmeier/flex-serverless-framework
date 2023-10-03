import mongoose, { Schema } from 'mongoose'
import { compareHash, hashPassword } from '@flex/utils/passwordBoss'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, PASSWORD_SALT } from '@flex/utils/environment'

export const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  lastPasswordChange: {
    type: Date,
  },
  lastPasswords: [
    new Schema({
      password: {
        type: String,
      },
      date: {
        type: Date,
      },
    }),
  ],
  lastLogin: {
    type: Date,
  },
  // TODO: Change this to a reference to the organization
  organizationId: {
    type: 'ObjectId',
    ref: 'Organization',
  },
})

UserSchema.virtual('roles', {
  ref: 'Role',
  localField: '_id',
  foreignField: 'userId',
})


UserSchema.methods.getRoles = async function (organizationId = null) {
  // get the roles for the user
  return mongoose.models.Role.find({ organizationId, userId: this._id }) 
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  // compare the candidate password with the password in the database
  return compareHash(PASSWORD_SALT, candidatePassword, this.password)
}

UserSchema.methods.createAccessToken = async function (organizationId = null) {
  // create the access token
  console.log({organizationId})
  const payload = {
    userId: String(this._id),
    organizationId
  }
  console.log({payload})
  const accessToken = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '30d',
      algorithm: 'HS256',
    },
  )

  return accessToken
}

UserSchema.statics.verifyAccessToken = function (accessToken) {
  // verify the access token
  // console.log(accessToken, JWT_SECRET)
  accessToken = accessToken.replace('Bearer ', '')
  return jwt.verify(accessToken, JWT_SECRET, { ignoreExpiration: false, ignoreNotBefore: false, algorithm: 'HS256'})
}

UserSchema.statics.login = async function (email, password, organizationId = null) {
  // login the user
  const user = await this.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }
  // get the user
  // compare the passwords
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Password is incorrect.')
  }
  // if valid, create a JWT token
  const accessToken = user.createAccessToken(organizationId || user.organizationId)

  // set the last login
  user.lastLogin = new Date()
  await user.save()
  
  return {
    accessToken,
    user
  }
}

UserSchema.pre('save', async function (next) {
  if(this.isNew){
    // hash the password
    const hashedPassword = await hashPassword(this.password, PASSWORD_SALT)
    this.password = hashedPassword
  }
  next()
})