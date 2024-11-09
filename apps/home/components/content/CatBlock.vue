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
    <Catalog v-html="body" />
  </div>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis/ui'
import { extractHeading } from '~/utils/md-renderer'

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

const { heading, body } = extractContent(props.content)
const { headline, overline, subline, tags, shortcode } = extractHeading(heading)
</script>

<style scoped>
/* cloned (WITHOUT '> prose' ) from packages/ui/src/components/Catalog.vue */
.catalog :deep() > ul > li:has(strong) {
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.catalog :deep() {
  max-width: 28em; /* 448px */
}

@media (max-width: 420px) {
  .catalog :deep() {
    max-width: 22em; /* 352px */
  }
}

.catalog :deep() > ul > li + li {
  margin-top: 0.25rem;
}

.catalog :deep() > ul > li > :where(strong, mark):first-child {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  font-weight: 400;
}

.catalog :deep() > ul > li > strong:first-child::after {
  content: '';
  flex: 1;
  display: block;
  min-width: 1rem;
  height: 1px;
  margin: 0 0.5rem;
  background-color: hsl(var(--border));
}

.catalog .prose :deep() > ul > li > mark:first-child {
  margin-top: 0.5rem;
}

.catalog :deep() > ul > li svg {
  font-size: 1.5em;
}
</style>
