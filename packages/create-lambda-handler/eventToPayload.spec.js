import {
  eventToPayload,
  hoistDetail,
  hoistEventBody,
  hoistEventBridge,
  hoistEventRecords,
  hoistMultiValueQueryStringParameters,
  hoistPathParameters,
  hoistQueryStringParameters
} from './eventToPayload'
import { faker } from '@faker-js/faker'

const getFakeObject = () => {
  return {
    [faker.datatype.string()]: faker.datatype.string()
  }
}

test('hoistPathParameters', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      pathParameters: getFakeObject()
    },
    _context: getFakeObject()
  }
  const result = hoistPathParameters(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.pathParameters
  })
})

test('hoistQueryStringParameters', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      queryStringParameters: getFakeObject()
    },
    _context: getFakeObject()
  }
  const result = hoistQueryStringParameters(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.queryStringParameters
  })
})

test('hoistMultiValueQueryStringParameters', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      multiValueQueryStringParameters: {
        param1: [getFakeObject(), getFakeObject()],
        param2: [getFakeObject()]
      },
      _context: getFakeObject()
    }
  }

  const result = hoistMultiValueQueryStringParameters(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    param1: event._event.multiValueQueryStringParameters.param1
  })
})

test('hoistMultiValueQueryStringParameters return if not exist', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      _context: getFakeObject()
    }
  }

  const result = hoistMultiValueQueryStringParameters(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context
  })
})

test('hoistEventBody', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      body: JSON.stringify(getFakeObject())
    },
    _context: getFakeObject()
  }
  const result = hoistEventBody(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...JSON.parse(event._event.body)
  })
})

test('hoistEventBody no body', () => {
  const event = {
    _event: {
      ...getFakeObject()
    },
    _context: getFakeObject()
  }

  const result = hoistEventBody(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context
  })
})

test('hoistEventBody JSON', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      body: JSON.stringify(getFakeObject())
    },
    _context: getFakeObject()
  }

  const result = hoistEventBody(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...JSON.parse(event._event.body)
  })
})

test('hoistEventRecords', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      Records: getFakeObject()
    },
    _context: getFakeObject()
  }

  const result = hoistEventRecords(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.Records
  })
})

test('hoistEventBridge', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      event_bridge: getFakeObject()
    },
    _context: getFakeObject()
  }

  const result = hoistEventBridge(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.event_bridge
  })
})

test('hoistDetail', () => {
  const event = {
    _event: {
      ...getFakeObject(),
      detail: getFakeObject()
    },
    _context: getFakeObject()
  }

  const result = hoistDetail(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.detail
  })
})

test('eventToPayload', async () => {
  const event = {
    _event: {
      ...getFakeObject(),
      pathParameters: getFakeObject(),
      queryStringParameters: getFakeObject(),
      multiValueQueryStringParameters: {
        param1: [getFakeObject(), getFakeObject()],
        param2: [getFakeObject()]
      },
      body: JSON.stringify(getFakeObject()),
      Records: getFakeObject(),
      event_bridge: getFakeObject(),
      detail: getFakeObject()
    },
    _context: getFakeObject()
  }

  const result = await eventToPayload(event)
  expect(result).toEqual({
    _event: event._event,
    _context: event._context,
    ...event._event.pathParameters,
    ...event._event.queryStringParameters,
    param1: event._event.multiValueQueryStringParameters.param1,
    ...JSON.parse(event._event.body),
    ...event._event.Records,
    ...event._event.event_bridge,
    ...event._event.detail
  })
})
