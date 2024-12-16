import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'taxonomies',
  mode: 'multi',
  apiRoutes: {
    create: false,
    createMany: false,
    update: false,
    updateMany: false,
    delete: false,
    deleteMany: false,
  },
  dashboard: {
    icon: 'Tag',
    overviewTable: {
      columns: [{ field: 'title', width: 30 }, 'msId', 'termDescription', 'lastModifiedDateTime'],
      sort: { field: 'lastModifiedDateTime', direction: 'desc' },
    },
  },
  fields: {
    msId: {
      type: 'number',
      options: {
        label: 'Microsoft ID',
        required: true,
        min: 1,
      },
      additional: {
        immutable: true,
        unique: 'allLanguages',
      },
    },
    title: {
      type: 'text',
      options: {},
      additional: {
        immutable: true,
      },
    },
    termDescription: {
      type: 'text-area',
      options: {},
      additional: {
        immutable: true,
      },
    },
    termPath: {
      type: 'text',
      options: {},
      additional: {
        immutable: true,
      },
    },
    termId: {
      type: 'text',
      options: {},
      additional: {
        immutable: true,
      },
    },
    level: {
      type: 'number',
      options: {},
      additional: {
        immutable: true,
      },
    },
    parentId: {
      type: 'text',
      options: {},
      additional: {
        immutable: true,
      },
    },
    kapitel: {
      type: 'text',
      options: {},
      additional: {
        immutable: true,
      },
    },
    lastModifiedDateTime: {
      type: 'date-time',
      options: {},
      additional: {
        immutable: true,
      },
    },
  },
})
