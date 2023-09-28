import fs from 'fs'
import { PROJECT_SLUG, STAGE } from '@flex/utils/environment'
import { toCamelCase } from '@flex/utils/toCamelCase'


export const newServiceAction = async (serviceName, options) => {
    console.log({ serviceName, options })
    console.log("creating a new service: ", serviceName);

    // create the new service directory
    if(!fs.existsSync(serviceName)){
        fs.mkdirSync(`./services/${serviceName}`)
    } else {
        console.log("service already exists")
        // return
    }

    // create the new service files
    const packageContents = {
        "name": "new-service",
        "version": "1.0.0",
        "description": "DESCRIPTION HERE",
        "main": "newService.js",
    }
    packageContents.name = serviceName
    const baseFileName = toCamelCase(serviceName)
    packageContents.main = `${baseFileName}.js`
    fs.writeFileSync(`./services/${serviceName}/package.json`, JSON.stringify(packageContents, null, 2))

    // create the new service serverless file
    const serverlessFileContents = `const readYamlFile = require('@flex/utils/readYamlFile')
const injectEnvironmentParams = require('@flex/utils/injectEnvironmentParams')

const serviceName = __dirname.split('/').pop()
const coreConfig = readYamlFile('../../serverless_core.yml')
const serviceConfig = readYamlFile('./serverless_config.yml')
const injectedServiceConfig = injectEnvironmentParams(coreConfig, serviceConfig)

const config = {
    service: serviceName,
    ...coreConfig,
    ...injectedServiceConfig
}

module.exports = config
`
    fs.writeFileSync(`./services/${serviceName}/serverless.js`, serverlessFileContents)   
    
    const customerServerlessFileContents = `functions:
    ${baseFileName}:
        name: ${PROJECT_SLUG}-${STAGE}-${serviceName}
        handler: ${baseFileName}.handler
        timeout: 30
        provisionedConcurrency: 1
        memorySize: 5000 # Overwrite the default memory size. Default is 1024..
        reservedConcurrency: 200
        events:
        - http:
            path: /${serviceName}
            method: ${options.method}
            private: ${Boolean(options.private)}
`
    fs.writeFileSync(`./services/${serviceName}/serverless_config.yml`, customerServerlessFileContents)
    // create the new service index file
    const serviceFileContents = `import { createLambdaHandler } from '@flex/create-lambda-handler'
import { version } from './package.json' // eslint-disable-line
import { PROJECT_SLUG } from '@flex/utils/environment';

/**
 * @param {Object} options._event - The original event object.
 * @param {Object} options.db - The database connection.
 * @returns {Object} The result of the GraphQL query.
 */

export const ${baseFileName}Handler = async ({ db, ...rest }) => {
    // ...rest contains any other properties that were passed in
    // business logic here

    return {}
}

// Create a lambda handler that wraps the graphqlHandler function
export const handler = createLambdaHandler({
    handlerFunction: ${baseFileName}Handler,
    serviceVersion: version
})
`
    fs.writeFileSync(`./services/${serviceName}/${baseFileName}.js`, serviceFileContents)

    // create the new service tests
    const testFileContents = `import { ${serviceName}Handler } from './${serviceName}.js'
import { afterEach } from '@vi/globals'

describe('${serviceName}Handler', () => {
    afterEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })

    it('should do something', async () => {
        const result = await ${serviceName}Handler({})
        expect(result).toEqual({})
    })
})
`
    fs.writeFileSync(`./services/${serviceName}/${baseFileName}.spec.js`, testFileContents)
}
