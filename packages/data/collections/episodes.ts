import { defineCollection } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'

export default defineCollection(
  pageLikeCollection({
    name: 'episodes',
    pathPrefix: 'episodes',
    allowedLayouts: ['episode'],    
    additionalFields: {
      footerBorder: {
        type: 'switch',
        options: {
          description: 'Display a border above the footer.',
        },
      },
      videoTitle: {
        type: 'text',
        options: {
          placeholder: 'Titel eingeben',
        }
      },
      videoLink: {
        type: 'link',
        options: {
          required: true,
          placeholder: 'Link eingeben',
        },
      },    
    },
    additionalPublicPagesFields: ['footerBorder', 'videoTitle', 'videoLink'],
  }),
)