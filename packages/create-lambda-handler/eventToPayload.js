import { asyncPipe } from '@flex/utils/asyncPipe'
import { parse } from 'querystring'

export const hoistPathParameters = ({ _event, ...rest }) => ({
  _event,
  ...rest,
  ..._event?.pathParameters
})

export const hoistQueryStringParameters = ({ _event, ...rest }) => ({
  _event,
  ...rest,
  ..._event?.queryStringParameters
})

export const hoistMultiValueQueryStringParameters = ({ _event, ...rest }) => {
  const { multiValueQueryStringParameters } = _event
  if (!multiValueQueryStringParameters) return { _event, ...rest }
  const multiValueParams = Object.entries(multiValueQueryStringParameters)
    .filter(([_key, arrVal]) => arrVal.length > 1)
    .reduce((acc, [key, arrVal]) => {
      acc[key] = arrVal
      return acc
    }, {})

  return {
    _event,
    ...rest,
    ...multiValueParams
  }
}

export const hoistEventBody = ({ _event, ...rest }) => {
  const eventBody = _event?.body || {}
  let eventBodyPayload
  try {
    eventBodyPayload = JSON.parse(eventBody)
  } catch (e) {
    eventBodyPayload = parse(eventBody)
  }
  return {
    _event,
    ...rest,
    ...eventBodyPayload
  }
}

export const hoistEventRecords = ({ _event, ...rest }) => ({
  _event,
  ...rest,
  ..._event?.Records
})

export const hoistEventBridge = ({ _event, ...rest }) => ({
  _event,
  ...rest,
  ..._event?.event_bridge
})

export const hoistDetail = ({ _event, ...rest }) => ({
  _event,
  ...rest,
  ..._event?.detail
})

export const eventToPayload = asyncPipe(
  hoistPathParameters, // hoist query path params
  hoistQueryStringParameters, // hoist query string params
  hoistMultiValueQueryStringParameters, // only used when same path path parameters are used multiple times. ex. url?id=1&id=2 ID would be only multi-path param
  hoistEventBody, // parse and hoist event.body
  hoistEventRecords, // hoist event.Records
  hoistEventBridge, // hoist event.event_bridge
  hoistDetail // hoist event.detail
)
