require('dotenv').config()

function getEnv(envKey) {
  const exists = Object.prototype.hasOwnProperty.call(process.env, envKey)
  if (!exists) {
    console.warn(`Warning: Environment variable ${envKey} is not set.`)
    return null
  }

  return process.env[envKey]
}

function getRequiredEnvVar(envKey) {
  if (process.env?.STAGE === 'test') {
    return process.env?.[envKey] || ''
  }

  const exists = Object.prototype.hasOwnProperty.call(process.env, envKey)

  if (!exists) {
    throw new Error(`Required environment variable ${envKey} is not set`)
  }
  return process.env[envKey]
}

export const DEPLOY_TIME = getEnv('DEPLOY_TIME')
export const GIT_BRANCH = getEnv('GIT_BRANCH')
export const GIT_SHA = getEnv('GIT_SHA')
export const LOG_LEVEL = getEnv('LOG_LEVEL')
export const SERVICE = getEnv('SERVICE')
export const STAGE = getRequiredEnvVar('STAGE')

export const AWS_REGION = getRequiredEnvVar('AWS_REGION')
export const AWS_ACCESS_KEY_ID = getEnv('AWS_ACCESS_KEY_ID')
export const AWS_SECRET_ACCESS_KEY = getEnv('AWS_SECRET_ACCESS_KEY')
export const AWS_SESSION_TOKEN = getEnv('AWS_SESSION_TOKEN')

export const DB_URI = getRequiredEnvVar('DB_URI')
export const PROJECT_SLUG = getRequiredEnvVar('PROJECT_SLUG')

export const JWT_SECRET = getRequiredEnvVar('JWT_SECRET')
export const PASSWORD_SALT = getRequiredEnvVar("PASSWORD_SALT")