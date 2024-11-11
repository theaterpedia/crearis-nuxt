<template>
  <Heading
    :headline="headline"
    :is="is"
    :overline="overline ? overline : ''"
    :shortcode="shortcode ? shortcode : ''"
    :subline="subline ? subline : ''"
    :tags="tags ? tags : ''"
    :style="
      $viewport.isLessThan('tablet')
        ? is === 'h1'
          ? 'font-size: 0.75em;'
          : is === 'h2'
            ? 'font-size: 0.825em;'
            : 'font-size: 0.875em;'
        : ''
    "
  >
    <slot />
  </Heading>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis/ui'
import { extractHeading } from '~/utils/md-renderer'
const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h1'
   */
  is: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'span' | 'li'>,
    default: 'h1',
  },
  content: {
    type: String,
    required: true,
  },
})

import { useNuxtApp } from '#app'
const { $viewport } = useNuxtApp()

const { headline, overline, subline, tags, shortcode } = extractHeading(props.content)
</script>
