<template>
  <Component :is="mtag">
    <Heading
      v-if="raw.heading"
      :headline="parsed.headline"
      :is="htag"
      :overline="parsed.overline ? parsed.overline : ''"
      :shortcode="parsed.shortcode ? parsed.shortcode : ''"
      :subline="parsed.subline ? parsed.subline : ''"
      :tags="parsed.tags ? parsed.tags : ''"
    />
    <Prose>
      <div v-html="raw.body" :class="narrow ? 'narrow' : ''" />
    </Prose>
  </Component>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis/ui'
import { reactive, watch } from 'vue'

const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h3'
   */
  htag: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'li'>,
    default: 'h3',
  },
  mtag: {
    type: [Object, String] as PropType<'div' | 'Catalog'>,
    default: 'div',
  },  
  content: {
    type: String,
    required: true,
  },
  /**
   * enable this for minimal spacings.
   */
  narrow: {
    type: Boolean,
    default: false,
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

const raw = reactive(extractContent(props.content))
const parsed = reactive(extractHeading(raw.heading))

watch(() => props.content, () => {
  const { heading, body } = extractContent(props.content)
  raw.heading = heading
  raw.body = body
  const parsed2 = extractHeading(heading)
  parsed.headline = parsed2.headline
  parsed.overline = parsed2.overline
  parsed.subline = parsed2.subline
  parsed.tags = parsed2.tags
  parsed.shortcode = parsed2.shortcode
})

</script>
