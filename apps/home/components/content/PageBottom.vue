<template>
  <PageBottom
    :anchorline="anchorline"
    :height-tmp="height"
    :content-align-y="contentAlign"
    :content-width="contentWidth"
    :img-tmp="effectiveImage"
    :img-tmp-height="imageHeight"
    :img-tmp-gravity="imageGravity"
    :overlay="computedOverlay"
  >
    <ContentSlot />
  </PageBottom>
</template>

<script lang="ts" setup>
import { PageBottom } from '@crearis/ui'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'
import { computed, inject, type PropType } from 'vue'

const props = defineProps({
  /**
   * Displays the AnchorLine at the top.
   * true = 'accent' variant.
   *
   * @default true
   */
  anchorline: {
    type: [Boolean, String] as PropType<boolean | 'accent' | 'primary' | 'default' | 'muted'>,
    default: true,
  },

  /**
   * Defines the height of the page-bottom section.
   *
   * @default 'medium'
   */
  height: {
    type: String as PropType<'full' | 'prominent' | 'medium' | 'mini'>,
    default: 'medium',
  },

  /**
   * Defines the vertical alignment of the content.
   *
   * @default 'top'
   */
  contentAlign: {
    type: String as PropType<'top' | 'bottom' | 'center'>,
    default: 'top',
  },

  /**
   * Defines the width of the content.
   *
   * @default 'full'
   */
  contentWidth: {
    type: String as PropType<'short' | 'full'>,
    default: 'full',
  },

  /**
   * Background image URL or Cloudinary path.
   * If inheritHeroImage is true, this is ignored.
   */
  image: {
    type: String,
  },

  /**
   * If true, inherit the hero image from page context.
   *
   * @default false
   */
  inheritHeroImage: {
    type: Boolean,
    default: false,
  },

  /**
   * Cloudinary crop height in pixels.
   *
   * @default 400
   */
  imageHeight: {
    type: Number,
    default: 400,
  },

  /**
   * Cloudinary gravity for image crop.
   * 'south' shows the bottom of the image (e.g., feet).
   *
   * @default 'south'
   */
  imageGravity: {
    type: String as PropType<'north' | 'south' | 'center' | 'auto'>,
    default: 'south',
  },

  /**
   * Gradient type for overlay.
   *
   * @default 'none'
   */
  gradientType: {
    type: String as PropType<'top' | 'left-top' | 'left' | 'left-bottom' | 'bottom' | 'none' | 'full'>,
    default: 'none',
  },

  /**
   * Gradient intensity (0.00-1.00).
   *
   * @default 0.8
   */
  gradientDepth: {
    type: Number,
    default: 0.8,
  },
})

// Support for inheriting hero image from page context
const heroImage = inject<string | undefined>('heroImage', undefined)

const effectiveImage = computed(() => {
  if (props.inheritHeroImage && heroImage) {
    return heroImage
  }
  return props.image
})

const computedOverlay = computed(() => {
  return getoverlay(props.gradientType, props.gradientDepth)
})
</script>
