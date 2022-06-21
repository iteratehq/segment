import type { BrowserActionDefinition } from '../../../lib/browser-destinations'
import { Intercom } from '../api'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

// Change from unknown to the partner SDK types
const action: BrowserActionDefinition<Settings, Intercom, Payload> = {
  title: 'Boot',
  description: '',
  platform: 'web',
  fields: {
    user_id: {
      type: 'string',
      required: false,
      description: "The user's identity",
      label: 'Identity',
      default: {
        '@path': '$.userId'
      }
    },
    traits: {
      type: 'object',
      required: false,
      description: 'The Segment traits to be forwarded to Intercom',
      label: 'Traits',
      default: {
        '@path': '$.traits'
      }
    },
    name: {
      type: 'string',
      required: false,
      description: "User's name",
      label: 'Name',
      default: {
        '@path': '$.traits.name'
      }
    },
    email: {
      type: 'string',
      required: false,
      description: "User's email",
      label: 'Name',
      default: {
        '@path': '$.traits.email'
      }
    },
    created_at: {
      label: 'Created At',
      description: 'A timestamp of when the person was created.',
      required: false,
      type: 'string',
      default: {
        '@path': '$.traits.createdAt'
      }
    }
  },
  perform: (Intercom, event) => {
    Intercom('boot', {
      app_id: Intercom.appId,
      ...event.payload
    })
  }
}

export default action
