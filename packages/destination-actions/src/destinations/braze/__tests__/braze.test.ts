import nock from 'nock'
import { createTestEvent, createTestIntegration, DecoratedResponse } from '@segment/actions-core'
import Braze from '../index'

const testDestination = createTestIntegration(Braze)
const receivedAt = '2021-08-03T17:40:04.055Z'
const settings = {
  app_id: 'my-app-id',
  api_key: 'my-api-key',
  endpoint: 'https://rest.iad-01.braze.com' as const
}

describe(Braze.name, () => {
  describe('updateUserProfile', () => {
    it('should work with default mappings', async () => {
      nock('https://rest.iad-01.braze.com').post('/users/track').reply(200, {})

      const event = createTestEvent({
        type: 'identify',
        receivedAt
      })

      const responses = await testDestination.testAction('updateUserProfile', {
        event,
        settings,
        useDefaultMappings: true
      })

      expect(responses.length).toBe(1)
      expect(responses[0].status).toBe(200)
      expect(responses[0].data).toMatchObject({})
      expect(responses[0].options.headers).toMatchInlineSnapshot(`
        Headers {
          Symbol(map): Object {
            "authorization": Array [
              "Bearer my-api-key",
            ],
            "user-agent": Array [
              "Segment (Actions)",
            ],
          },
        }
      `)
      expect(responses[0].options.json).toMatchInlineSnapshot(`
        Object {
          "attributes": Array [
            Object {
              "_update_existing_only": false,
              "braze_id": undefined,
              "country": "United States",
              "current_location": Object {
                "latitude": 40.2964197,
                "longitude": -76.9411617,
              },
              "date_of_first_session": undefined,
              "date_of_last_session": undefined,
              "dob": undefined,
              "email": undefined,
              "email_click_tracking_disabled": undefined,
              "email_open_tracking_disabled": undefined,
              "email_subscribe": undefined,
              "external_id": "user1234",
              "facebook": undefined,
              "first_name": undefined,
              "gender": undefined,
              "home_city": undefined,
              "image_url": undefined,
              "language": undefined,
              "last_name": undefined,
              "marked_email_as_spam_at": undefined,
              "phone": undefined,
              "push_subscribe": undefined,
              "push_tokens": undefined,
              "time_zone": undefined,
              "twitter": undefined,
              "user_alias": undefined,
            },
          ],
        }
      `)
    })

    it('should require one of braze_id, user_alias, or external_id', async () => {
      nock('https://rest.iad-01.braze.com').post('/users/track').reply(200, {})

      const event = createTestEvent({
        type: 'identify',
        receivedAt
      })

      await expect(
        testDestination.testAction('updateUserProfile', {
          event,
          settings,
          mapping: {}
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"One of \\"external_id\\" or \\"user_alias\\" or \\"braze_id\\" is required."`
      )
    })
  })

  describe('trackEvent', () => {
    it('should work with default mappings', async () => {
      nock('https://rest.iad-01.braze.com').post('/users/track').reply(200, {})

      const event = createTestEvent({
        event: 'Test Event',
        type: 'track',
        receivedAt
      })

      const responses = await testDestination.testAction('trackEvent', {
        event,
        settings,
        useDefaultMappings: true
      })

      expect(responses.length).toBe(1)
      expect(responses[0].status).toBe(200)
      expect(responses[0].data).toMatchObject({})
      expect(responses[0].options.headers).toMatchInlineSnapshot(`
        Headers {
          Symbol(map): Object {
            "authorization": Array [
              "Bearer my-api-key",
            ],
            "user-agent": Array [
              "Segment (Actions)",
            ],
          },
        }
      `)
      expect(responses[0].options.json).toMatchInlineSnapshot(`
        Object {
          "events": Array [
            Object {
              "_update_existing_only": false,
              "app_id": "my-app-id",
              "braze_id": undefined,
              "external_id": "user1234",
              "name": "Test Event",
              "properties": Object {},
              "time": "2021-08-03T17:40:04.055Z",
              "user_alias": undefined,
            },
          ],
        }
      `)
    })
  })

  describe('trackPurchase', () => {
    it('should work with default mappings', async () => {
      nock('https://rest.iad-01.braze.com').post('/users/track').reply(200, {})

      const event = createTestEvent({
        event: 'Order Completed',
        type: 'track',
        receivedAt
      })

      const responses = await testDestination.testAction('trackEvent', {
        event,
        settings,
        useDefaultMappings: true
      })

      expect(responses.length).toBe(1)
      expect(responses[0].status).toBe(200)
      expect(responses[0].data).toMatchObject({})
      expect(responses[0].options.headers).toMatchInlineSnapshot(`
        Headers {
          Symbol(map): Object {
            "authorization": Array [
              "Bearer my-api-key",
            ],
            "user-agent": Array [
              "Segment (Actions)",
            ],
          },
        }
      `)
      expect(responses[0].options.json).toMatchInlineSnapshot(`
        Object {
          "events": Array [
            Object {
              "_update_existing_only": false,
              "app_id": "my-app-id",
              "braze_id": undefined,
              "external_id": "user1234",
              "name": "Order Completed",
              "properties": Object {},
              "time": "2021-08-03T17:40:04.055Z",
              "user_alias": undefined,
            },
          ],
        }
      `)
    })
  })

  describe('onDelete', () => {
    it('should support user deletions', async () => {
      nock('https://rest.iad-01.braze.com').post('/users/delete').reply(200, {})
      expect(testDestination.onDelete).toBeDefined()

      if (testDestination.onDelete) {
        const event = createTestEvent({
          type: 'delete',
          userId: 'sloth@segment.com'
        })

        const response = await testDestination.onDelete(event, settings)
        const resp = response as DecoratedResponse
        expect(resp.status).toBe(200)
        expect(resp.data).toMatchObject({})
      }
    })

    it('should support alternate endpoints for user deletions', async () => {
      nock('https://rest.iad-06.braze.com').post('/users/delete').reply(200, {})
      expect(testDestination.onDelete).toBeDefined()

      if (testDestination.onDelete) {
        const event = createTestEvent({
          type: 'delete',
          userId: 'sloth@segment.com'
        })

        const localSettings = { ...settings, endpoint: 'https://rest.iad-06.braze.com' }

        const response = await testDestination.onDelete(event, localSettings)
        const resp = response as DecoratedResponse
        expect(resp.status).toBe(200)
        expect(resp.data).toMatchObject({})
      }
    })
  })
})
