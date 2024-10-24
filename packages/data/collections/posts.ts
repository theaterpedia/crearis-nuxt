import { defineCollection, isString } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'
import { uniqueValidator } from '#pruvious/server'
import { nanoid } from 'nanoid'

const posts = pageLikeCollection({
  name: 'posts',
  pathPrefix: 'blog',
  icon: 'Pin',
  additionalFields: {
    syncId: {
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
        required: true
      },
      additional: {
        protected: true,
        nullable: false,
      }
    },
    overline: {
      type: 'text',
      options: {},
    },
    teaserText: {
      type: 'text',
      options: {},
    },
    author: {
      type: 'record',
      options: {
        collection: 'users',
        fields: ['email'],
      },
    },
  },
})

posts.dashboard!.fieldLayout = posts.dashboard!.fieldLayout!.filter(
  fieldLayout => !isString(fieldLayout) || !['syncId', 'version'].includes(fieldLayout)
)

export default defineCollection(posts)
