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
    <Catalog>
      <div v-html="body" />
    </Catalog>
  </div>
</template>

<script lang="ts" setup>
import { Heading } from '@crearis/ui'
import { computed } from 'vue'

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

// Make extraction reactive so it updates when props.content changes (e.g., after hydration)
const extracted = computed(() => extractContent(props.content))
const heading = computed(() => extracted.value.heading)
const body = computed(() => extracted.value.body)
const headingParts = computed(() => extractHeading(heading.value))
const headline = computed(() => headingParts.value.headline)
const overline = computed(() => headingParts.value.overline)
const subline = computed(() => headingParts.value.subline)
const tags = computed(() => headingParts.value.tags)
const shortcode = computed(() => headingParts.value.shortcode)
</script>

<style scoped>
/* Target content inside the Catalog component */
:deep(.catalog) {
  max-width: 28em; /* 448px */
}

@media (max-width: 420px) {
  :deep(.catalog) {
    max-width: 22em; /* 352px */
  }
}

:deep(.catalog) p {
  padding-top: 0.8rem;
  font-weight: 300;
}

:deep(.catalog) ul > li:has(strong) {
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.catalog) ul > li {
  margin-bottom: 0.2rem;
}

:deep(.catalog) ul > li + li {
  margin-top: 0.25rem;
}

:deep(.catalog) ul > li > :where(strong, mark):first-child {
  margin-top: 0.3rem;
  flex: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  font-weight: 400;
}

:deep(.catalog) ul > li > strong:first-child::after {
  content: '';
  flex: 1;
  display: block;
  min-width: 1rem;
  height: 1px;
  margin: 0 0.5rem;
  background-color: var(--color-border);
}

:deep(.catalog .prose) ul > li > mark:first-child {
  margin-top: 0.5rem;
}

:deep(.catalog) ul > li svg {
  font-size: 1.5em;
}
</style>
