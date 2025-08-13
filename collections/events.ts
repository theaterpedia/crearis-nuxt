import { defineCollection, isString } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'
import { uniqueValidator } from '#pruvious/server'
import { EventEditMode } from '../graphql'

const events = pageLikeCollection({
  name: 'events',
  pathPrefix: 'events',
  icon: 'CalendarEvent',
  allowedLayouts: ['event'],
  additionalFields: {
    cid: {
      type: 'text',
      options: {
        required: true,
      },
      additional: {
        immutable: true,
        unique: 'allLanguages',
        validators: [uniqueValidator],
        index: true,
        nullable: false,
      },
    },
    version: {
      type: 'number',
      options: {
        min: 1,
        required: true,
      },
      additional: {
        protected: true,
        nullable: false,
      },
    },
    editMode: {
      type: 'button-group',
      options: {
        choices: Object.fromEntries(Object.entries(EventEditMode).map(([key, value]) => [value, key])),
        required: true,
      },
    },
    overline: {
      type: 'text',
      options: {},
    },
    templateCode: {
      type: 'text',
      options: {
        required: false,
      },
    },
    teaserText: {
      type: 'text',
      options: {},
    },
    dateBegin: {
      type: 'date-time',
      options: {},
      additional: {
        protected: true,
      },
    },
    dateEnd: {
      type: 'date-time',
      options: {},
      additional: {
        protected: true,
      },
    },
    publicUser: {
      type: 'record',
      options: {
        collection: 'users',
      },
      additional: {
        protected: true,
      },
    },
    company: {
      type: 'text',
      options: {
        required: false,
      },
    },
    domainCode: {
      type: 'text',
      options: {
        required: true,
      },
    },
    homeUrl: {
      type: 'link',
      options: {
        required: false,
      },
    },
    location: {
      type: 'text',
      options: {
        required: false,
      },
    },
    city: {
      type: 'text',
      options: {
        required: false,
      },
    },
    organizer: {
      type: 'text',
      options: {
        required: false,
      },
    },
    showOrganizer: {
      type: 'checkbox',
      options: {
        required: false,
        default: false,
      },
    },
    street: {
      type: 'text',
      options: {
        required: false,
      },
    },
    street2: {
      type: 'text',
      options: {
        required: false,
      },
    },
    zip: {
      type: 'text',
      options: {
        required: false,
      },
    },
    country: {
      type: 'text',
      options: {
        required: false,
      },
    },
    stage: {
      type: 'text',
      options: {
        required: false,
      },
    },
    showStage: {
      type: 'checkbox',
      options: {
        required: false,
        default: false,
      },
    },
    eventType: {
      type: 'text',
      options: {
        required: false,
      },
    },
    ticketInstructions: {
      type: 'text-area',
      options: {
        required: false,
      },
    },
    showTicket: {
      type: 'checkbox',
      options: {
        required: false,
        default: false,
      },
    },
  },
})

events.dashboard!.fieldLayout = events.dashboard!.fieldLayout!.filter(
  (fieldLayout) =>
    !isString(fieldLayout) ||
    !['cid', 'version', 'editMode', 'ticketInstructions', 'eventType', 'stage', 'organizer'].includes(fieldLayout),
)

export default defineCollection(events)
