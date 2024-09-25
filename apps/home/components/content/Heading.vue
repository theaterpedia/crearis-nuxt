<template>
  <Heading :is="is" :headline="headline" :overline="overline ? overline : ''" :subline="subline ? subline : ''" :tags="tags ? tags : ''" :shortcode="shortcode ? shortcode : ''">
    <ContentSlot />
  </Heading>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis-nuxt/ui'
import { extractHeading } from '~/utils/extractHeading';
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
  }
})

const { headline, overline, subline, tags, shortcode } = extractHeading(props.content)

</script>
