import { defineCollection, isString } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'
import { uniqueValidator } from '#pruvious/server'
import { nanoid } from 'nanoid'

const domainusers = pageLikeCollection({
  name: 'domainusers',
  pathPrefix: 'contact',
  icon: 'Pin',
  allowedLayouts: ['contact'],
  additionalFields: {
    cid: {
      type: 'text',
      options: {
        required: true,
      },
      additional: {
        protected: true,
        unique: 'allLanguages',
        validators: [uniqueValidator],
        index: true,
        nullable: false,
        sanitizers: [{ onCreate: true, sanitizer: ({ value }) => value || nanoid() }],
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
    role: {
      type: 'text',
      options: {},
    },
    capabilities: {
      type: 'text',
      options: {},
    },
    md: {
      type: 'text',
      options: {},
    },
    overline: {
      type: 'text',
      options: {},
    },
    teaserText: {
      type: 'text',
      options: {},
    },
    user: {
      type: 'record',
      options: {
        collection: 'users',
        fields: ['email'],
      },
    },
    partner: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['oid', 'name', 'md', 'format_options', 'headerType', 'headerSize', 'cimg', 'teaserText'],
        description: 'Linked partner (if any)',
      },
    },    
    firstname: {
      type: 'text',
      options: {},
    },
    lastname: {
      type: 'text',
      options: {},
    },
    mobile: {
      type: 'text',
      options: {},
    },
    email: {
      type: 'text',
      options: {},
    },
    street: {
      type: 'text',
      options: {},
    },
    street2: {
      type: 'text',
      options: {},
    },
    city: {
      type: 'text',
      options: {},
    },
    zip: {
      type: 'text',
      options: {},
    },
    image: {
      type: 'text',
      options: {},
    },
  },
})

domainusers.dashboard!.fieldLayout = domainusers.dashboard!.fieldLayout!.filter(
  (fieldLayout) => !isString(fieldLayout) || !['syncId', 'version'].includes(fieldLayout),
)

export default defineCollection(domainusers)
