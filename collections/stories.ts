import { defineCollection } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'

// @see https://pruvious.com/docs/collections
export default defineCollection(
  pageLikeCollection({
    name: 'stories',
    icon: 'Pencil',
    allowedLayouts: ['default'],
    additionalPublicPagesFields: [
      'author',
      'imgTmp',
      'heading',
      'teaser',
      'inBanner',
      'heightTmp',
      'contentAlignY',
      'imgTmpAlignX',
      'imgTmpAlignY',
      'isFullWidth',
      'gradientDepth',
      'gradientType',
      'bottomLine',
      'phoneBanner',
      'isTransparent',
      'isFullWidth',
    ],
    additionalFields: {
      imgTmp: {
        type: 'text',
        options: {
          label: 'Bild: URL',
        },
      },
      heading: {
        type: 'text',
        options: {
          label: 'Heading',
        },
      },
      teaser: {
        type: 'text',
        options: {
          label: 'Teaser',
        },
      },
      inBanner: {
        type: 'checkbox',
        options: {
          label: 'als Banner',
          description: 'Inhalte in Banner-Card',
          default: false,
        },
      },
      heightTmp: {
        type: 'select',
        options: {
          choices: { full: 'full', prominent: 'prominent', medium: 'medium', mini: 'mini' },
          default: 'prominent',
          label: 'Header Höhe',
        },
      },
      contentAlignY: {
        type: 'select',
        options: {
          choices: { top: 'top', bottom: 'bottom', center: 'center' },
          label: 'Content: V-Fokus',
        },
      },
      isFullWidth: {
        type: 'checkbox',
        options: {
          default: false,
          label: 'breit',
        },
      },
      imgTmpAlignX: {
        type: 'select',
        options: {
          choices: { left: 'left', right: 'right', center: 'center', stretch: 'stretch', cover: 'cover' },
          default: 'center',
          label: 'Bild: H-Fokus',
        },
      },
      imgTmpAlignY: {
        type: 'select',
        options: {
          choices: { top: 'top', bottom: 'bottom', center: 'center', stretch: 'stretch', cover: 'cover' },
          default: 'stretch',
          label: 'Bild: V-Fokus',
        },
      },
      gradientDepth: {
        type: 'number',
        options: {
          default: 0.8,
          min: 0,
          decimals: 2,
          max: 1,
          label: 'Abdecken: Intensität (0.00-1.00)',
        },
      },
      gradientType: {
        type: 'select',
        options: {
          choices: {
            top: 'top',
            leftTop: 'left-top',
            left: 'left',
            leftBottom: 'left-bottom',
            bottom: 'bottom',
            none: 'none',
            full: 'full',
          },
          label: 'Abdecken: Fokus',
        },
      },
      bottomline: {
        type: 'checkbox',
        options: {
          label: 'Abgrenzungslinie',
          description: 'Abgrenzungslinie im Page-Hero anzeigen',
          default: false,
        },
      },
      phoneBanner: {
        type: 'checkbox',
        options: {
          default: false,
          label: 'phone>banner-style?',
        },
      },
      isTansparent: {
        type: 'checkbox',
        options: {
          default: true,
          label: 'Banner-Transparenz',
        },
      },
      author: {
        type: 'record',
        options: {
          collection: 'users',
          fields: ['firstName'],
          populate: true,
        },
      },
    },
  }),
)
