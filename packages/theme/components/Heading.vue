<template>
  <Heading
    :headline="headline"
    :is="is"
    :overline="overline"
    :shortcode="shortcode"
    :subline="subline"
    :tags="tags"
    class="bg-primary"
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
import { ref, watch, computed } from 'vue'
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

const heading = ref(extractHeading(props.content))
const overline = computed(() => heading.value.overline)
const subline = computed(() => heading.value.subline)
const tags = computed(() => heading.value.tags)
const shortcode = computed(() => heading.value.shortcode)
const headline = computed(() => heading.value.headline)

watch(() => props.content, () => {
  heading.value = extractHeading(props.content)
})

</script>

