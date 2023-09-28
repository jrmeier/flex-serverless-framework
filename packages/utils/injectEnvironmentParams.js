const childProcess = require('child_process')

const GIT_BRANCH = childProcess
  .execSync('git symbolic-ref --short HEAD')
  .toString()
  .trim()

const GIT_SHA = childProcess.execSync(`git rev-parse HEAD`).toString().trim()

const injectEnvironmentParams = (coreConfig, serviceConfig) => {
  const { functions, ...restServiceConfig } = serviceConfig
  const {
    params: { default: defaultParams }
  } = coreConfig
  const functionsNames = Object.keys(functions)

  return {
    ...restServiceConfig,
    functions: {
      ...functionsNames.reduce(
        (acc, name) => ({
          ...acc,
          [name]: {
            ...functions[name],
            environment: {
              ...Object.keys(defaultParams).reduce(
                (env, key) => ({
                  [key]: `\${param:${key}}`,
                  ...env
                }),
                {
                  STAGE: '${sls:stage}',
                  SERVICE: functions[name].name,
                  GIT_SHA,
                  GIT_BRANCH,
                  DEPLOY_TIME: new Date().toISOString()
                }
              )
            }
          }
        }),
        {}
      )
    }
  }
}

module.exports = injectEnvironmentParams
