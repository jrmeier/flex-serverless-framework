const fs = require('fs');

const readYamlFile = require('@flex/utils/readYamlFile');
const injectEnvironmentParams = require('@flex/utils/injectEnvironmentParams');

// Read .env file only for local development. In production, environment variables are set in the CI Pipe via yaml injection.
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const SERVICES_PATH = 'services/';
const RUN_SCHEDULER = process.argv.includes('--run-scheduler')
  || process.argv.includes('--runScheduler');
const coreConfig = readYamlFile('./serverless_core.yml');
const buildHandlers = () => {
  const folders = fs.readdirSync(SERVICES_PATH);
  const config = folders.reduce(
    (handlers, folder) => ({
      ...handlers,
      ...buildServerlessServiceConfig(folder),
    }),
    {},
  );
  return config;
};

const buildServerlessServiceConfig = (serviceDir) => {
  const fullServiceDir = `${SERVICES_PATH}${serviceDir}`;
  const packageServerlessConfigPath = `${SERVICES_PATH}/${serviceDir}/serverless_config.yml`;
  const serverlessConfig = readYamlFile(packageServerlessConfigPath);
  const injectedServiceConfig = injectEnvironmentParams(
    coreConfig,
    serverlessConfig,
  );
  const serviceFunctions = injectedServiceConfig.functions;
  const config = Object.entries(serviceFunctions).reduce(
    (serviceConfig, [functionName, functionConfig]) => ({
      ...serviceConfig,
      [functionName]: {
        ...removeSchedule(functionConfig),
        handler: `${fullServiceDir}/${functionConfig.handler}`,
      },
    }),
    {},
  );

  return config;
};

const removeSchedule = (fnConfig) => {
  const { events, ...rest } = fnConfig;
  if (!RUN_SCHEDULER) {
    return {
      ...rest,
      events: events.filter((event) => !Object.keys(event).includes('schedule')),
    };
  }

  return {
    ...rest,
    events,
  };
};

const serverlessPackageConfig = {
  service: `${process.env.PROJECT_SLUG}-dev`,
  ...coreConfig,
  plugins: [
    ...coreConfig.plugins,
    'serverless-offline',
    'serverless-offline-aws-eventbridge',
  ],
  functions: {
    ...buildHandlers(),
  },
  custom: {
    ...coreConfig.custom,
    'serverless-offline': {
      // watch: ['services/**', 'serverless_core.yml', 'packages/**'],
      allowCache: true,
    },
    'serverless-offline-aws-eventbridge': {
      port: 4010, //  port to run the eventBridge mock server on
      mockEventBridgeServer: true, // Set to false if EventBridge is already mocked by another stack
      hostname: '127.0.0.1', // IP or hostname of existing EventBridge if mocked by another stack
      pubSubPort: 4011, //  Port to run the MQ server (or just listen if using an EventBridge Mock server from another stack)
      debug: false, // flag to show debug messages
      account: process.env.AWS_ACCOUNT_ID, // account id that gets passed to the event
      maximumRetryAttempts: 0, // maximumRetryAttempts to retry lambda
      retryDelayMs: 500, // retry delay
      payloadSizeLimit: '10mb', // Controls the maximum payload size being passed to https://www.npmjs.com/package/bytes (Note: this payload size might not be the same size as your AWS Eventbridge receive)
    },
  },
};

if (process.argv.includes('--printConfig')) {
  console.log(JSON.stringify(serverlessPackageConfig, null, 3));
}

module.exports = serverlessPackageConfig;
