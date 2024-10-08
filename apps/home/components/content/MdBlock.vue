<template>
  <div>
    <Heading
      v-if="heading"
      :headline="headline"
      :is="htag"
      :overline="overline ? overline : ''"
      :shortcode="shortcode ? shortcode : ''"
      :subline="subline ? subline : ''"
      :tags="tags ? tags : ''"
    />
    <Prose>
      <div v-html="body" />
    </Prose>
  </div>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis-nuxt/ui'
import { extractHeading } from '~/utils/md-renderer'

const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h3'
   */
  htag: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'span' | 'li'>,
    default: 'h3',
  },
  content: {
    type: String,
    required: true,
  },
})

const extractContent = (content: string) => {
  // get lines
  const lines = content.split('\n')
  var heading = ''
  var body = ''
  var start = 0
  // check if first line is a heading
  if (lines[0].startsWith('#')) {
    // render as heading
    heading = lines[0].replace(/#*/g, '').trim()
    start = 1
  }
  for (let i = start; i < lines.length; i++) {
    // check if line is a list
    if (lines[i].startsWith('- ')) {
      // render as list
      body += `<ul><li>${lines[i].replace('- ', '')}</li></ul>\n`
    } else {
      // render as paragraph
      body += `<p>${lines[i]}</p>\n`
    }
  }
  // replace bold, italic
  body = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  body = body.replace(/\_(.*?)\_/g, '<em>$1</em>')
  return { heading, body }
}

const { heading, body } = extractContent(props.content)
const { headline, overline, subline, tags, shortcode } = extractHeading(heading)
</script>
