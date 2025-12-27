import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'partners',
  mode: 'multi',
  translatable: false,
  label: 'Partners',
  apiRoutes: {
    create: 'private',
    read: 'public',
    update: 'private',
    delete: 'private',
  },
  fields: {
    name: {
      type: 'text',
      options: {
        required: true,
      },
    },
    public: {
      type: 'switch',
      options: {
        default: false,
      },
    },
    addressType: {
      type: 'select',
      options: {
        choices: {
          contact: 'Contact',
          invoice: 'Invoice',
          delivery: 'Delivery',
          other: 'Other',
          private: 'Private',
        },
      },
    },
    firstName: {
      type: 'text',
      options: {},
    },
    lastName: {
      type: 'text',
      options: {},
    },
    isCompany: {
      type: 'switch',
      options: {
        default: false,
      },
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
    country: {
      type: 'record',
      options: {
        collection: 'countries',
        fields: ['name', 'code'],
      },
    },
    email: {
      type: 'text',
      options: {},
    },
    phone: {
      type: 'text',
      options: {},
    },
    websiteLink: {
      type: 'link',
      options: {},
    },
    company: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'email'],
      },
    },
    contacts: {
      type: 'repeater',
      options: {
        subfields: {
          contactId: {
            type: 'number',
            options: {
              min: 1,
            },
          },
        },
        fieldLayout: [['contactId']],
      },
    },
    signupValid: {
      type: 'text',
      options: {},
    },
    md: {
      type: 'text-area',
      options: {},
    },
    imagePath: {
      type: 'text',
      options: {},
    },
    billingAddress: {
      type: 'record',
      options: {
        collection: 'partners',
        fields: ['name', 'street', 'city', 'zip'],
      },
    },
    oid: {
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
    isHost: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner hosts Events.',
      },      
    },
    isAuthor: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner is an Author (creates Webcontent).',
      },      
    },
    isInstructor: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner is an instructor (teaches events).',
      },      
    },
    isLocation: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner is a location (where events take place).',
      },      
    }, 
    isCustomer: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner is a customer.',
      },      
    },
    isOrganizer: {
      type: 'switch',
      options: {
        default: false,
        description: 'Indicates if the partner is an organizer (takes decisions on events).',
      },      
    },    
    isNode: {
      type: 'switch',
      options: {
        default: false,
        description: 'is true when either of isOrganizer | isAuthor | isHost | isInstructor | isLocation is true.',
      },      
    },                
    lastSyncedAt: {
      type: 'date-time',
      options: {},
      additional: {
        nullable: true,
      },
    },
  },
})
