import { defineCollection } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'
import { uniqueValidator } from '#pruvious/server'
import { EventEditMode } from '@crearis/data-main/graphql'

export default defineCollection(
  pageLikeCollection({
    name: 'events',
    pathPrefix: 'events',
    icon: 'CalendarEvent',
    additionalFields: {
      syncId: {
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
          required: true
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
      teaserText: {
        type: 'text',
        options: {},
      },
      dateBegin: {
        type: 'date-time',
        options: {}
      },
      dateEnd: {
        type: 'date-time',
        options: {},
      },
      organizer: {
        type: 'record',
        options: {
          collection: 'users',
        },
      },
    },
  }),
)
