import mongoose from 'mongoose'
import models from './models' // eslint-disable-line

let dbConnection = null

const MONGOOSE_CONFIG = {
  bufferCommands: true,
  socketTimeoutMS: 65000,
  serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryReads: true,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 10000,
  family: 4 // 4 (IPv4) or 6 (IPv6)
}

export const getConnection = async ({ dbUri, stage }) => {
  mongoose.set('autoCreate', stage !== 'prod')
  mongoose.set('autoIndex', stage !== 'prod')

  mongoose.set('strictQuery', true)
  if (!dbConnection) {
    dbConnection = mongoose.connect(dbUri, MONGOOSE_CONFIG)
    await dbConnection
  }

  return mongoose
}

export const closeConnection = async () => {
  if (dbConnection) {
    await mongoose.connection.close()
    dbConnection = null
  }
}
