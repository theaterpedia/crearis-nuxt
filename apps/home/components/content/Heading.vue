<template>
  <UiHeading
    :headline="headline"
    :is="is"
    :overline="overline ? overline : ''"
    :shortcode="shortcode ? shortcode : ''"
    :subline="subline ? subline : ''"
    :tags="tags ? tags : ''"
    :style="computedStyle"
  >
    <ContentSlot />
  </UiHeading>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Heading as UiHeading } from '@crearis/ui'

const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h1'
   */
  is: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'li'>,
    default: 'h1',
  },
  content: {
    type: String as PropType<string>,
    required: true,
  },
  /**
   * suppress automatic Style-Settings and controll font-size manually.
   *
   * @default false
   */  
  card: {
    type: Boolean,
    required: false,
  },  
})

import { useNuxtApp } from '#app'
const { $viewport } = useNuxtApp()

const { headline, overline, subline, tags, shortcode } = extractHeading(props.content)

// Computed style for mobile responsiveness
// Long headlines (>28 chars) get ~10% smaller to prevent 3-line breaks
const computedStyle = computed(() => {
  if (props.card) return ''
  if (!$viewport.isLessThan('tablet')) return ''
  
  const isLong = headline.length > 28
  
  if (props.is === 'h1') {
    return isLong ? 'font-size: 0.68em;' : 'font-size: 0.75em;'
  } else if (props.is === 'h2') {
    return isLong ? 'font-size: 0.75em;' : 'font-size: 0.825em;'
  } else {
    return isLong ? 'font-size: 0.79em;' : 'font-size: 0.875em;'
  }
})
</script>
