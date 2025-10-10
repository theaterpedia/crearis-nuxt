import { defineCollection, isString } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'
import { uniqueValidator } from '#pruvious/server'
import { EventEditMode } from '../graphql'

const events = pageLikeCollection({
  name: 'events',
  pathPrefix: 'events',
  icon: 'CalendarEvent',
  allowedLayouts: ['event'],
  additionalPublicPagesFields: [
    'editMode',
    // 'heading',
    'templateCode',
    'teaserText',
    'md',
    'cimg',
    'headerType',
    'headerSize',
    'formatOptions',
    'dateBegin',
    'dateEnd',
  ],
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
    /* heading: {
      type: 'text',
      options: {},
    }, */
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
    md: {
      type: 'text',
      options: {},
    },    
    cimg: {
      type: 'text',
      options: {},
    },    
    headerType: {
      type: 'select',
      options: {
        choices: { simple: 'simple', columns: 'Text-Bild (2 Spalten)', banner: 'Banner medium', cover: 'Cover Fullsize', bauchbinde: 'Bauchbinde' },
        default: 'simple',
        label: 'Header Typ',
      },
    },
    headerSize: {
      type: 'select',
      options: {
        choices: { full: 'full', prominent: 'prominent', medium: 'medium', mini: 'mini' },
        default: 'prominent',
        label: 'Header Höhe',
      },
    },
    formatOptions: {
      type: 'text-area',
      options: {
        placeholder: "optionName: 'value', optionName: 'value'",
        description: 'Formatierung von Header und Page (Json)',
      },
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
    publicPartner: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'oid'],
        label: 'Referent:in',
      },
      additional: {
        protected: true,
      },
    },
    companyPartner: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'oid'],
        label: 'Organisation',
      },
      additional: {
        protected: true,
      },
    },
    locationPartner: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'oid'],
        label: 'Venue',
      },
      additional: {
        protected: true,
      },
    },
    organizerPartner: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'oid'],
        label: 'Management',
      },
      additional: {
        protected: true,
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
