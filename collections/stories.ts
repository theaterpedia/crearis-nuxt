import { defineCollection, isString } from '#pruvious'
import { pageLikeCollection } from '#pruvious/standard'

// @see https://pruvious.com/docs/collections
const stories = pageLikeCollection({
  name: 'stories',
  icon: 'Pencil',
  allowedLayouts: ['default'],
  additionalPublicPagesFields: [
    'author',
    'imgTmp',
    // 'heading',
    'teaser',
    'headerType',
    'headerSize',
    'formatOptions',
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
    /* heading: {
      type: 'text',
      options: {
        label: 'Heading',
      },
    }, */
    teaser: {
      type: 'text',
      options: {
        label: 'Teaser',
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
        description: 'Formatierung von Hero und Page (Json)',
      },
    },
  },
})

stories.dashboard!.fieldLayout = stories.dashboard!.fieldLayout!.filter(
  (fieldLayout) => !isString(fieldLayout) || !['layout'].includes(fieldLayout),
)

export default defineCollection(stories)
