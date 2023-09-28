import AWS from 'aws-sdk'

export const createEventBridge = ({
  stage,
  region,
  accessKeyId,
  secretAccessKey,
  sessionToken
}) => {
  let eventBridgeConfig = {
    endpoint: 'http://127.0.0.1:4010',
    region: region
  }
  if (stage !== 'dev') {
    eventBridgeConfig = {
      region,
      accessKeyId,
      secretAccessKey,
      sessionToken
    }
  }

  return new AWS.EventBridge(eventBridgeConfig)
}
