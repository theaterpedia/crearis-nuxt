import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'countries',
  mode: 'multi',
  translatable: false,
  label: 'Countries',
  apiRoutes: {
    create: false,
    read: 'public',
    update: false,
    delete: false,
  },
  fields: {
    name: {
      type: 'text',
      options: {
        required: true,
        label: 'Country Name',
      },
    },
    odooId: {
      type: 'number',
      options: {
        label: 'Odoo ID',
        description: 'The unique identifier from Odoo system',
      },
      additional: {
        unique: 'allLanguages',
        index: true,
        nullable: true,
      },
    },
    code: {
      type: 'text',
      options: {
        required: true,
        label: 'Country Code',
      },
      additional: {
        unique: 'allLanguages',
        index: true,
      },
    },
    imageUrl: {
      type: 'text',
      options: {
        label: 'Flag Image URL',
      },
    },
  },
})
