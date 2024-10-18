<template>
  <div>
    <slot />
    <br v-if="$slots.default" />
    <ContentList v-slot="{ list }" :query="query">
      <Columns gap="small" wrap>
        <template v-for="page in list" :key="page.path">
          <Component :data="page" :is="`card-${card_suffix}`" />
        </template>
      </Columns>
    </ContentList>
  </div>
</template>

<script lang="ts" setup>
/*
can be a PageComponent Only on Level 0 (we might implement it as a TabComponent as well)
*/

/* Todo: 
- sync code with the data-view-components
- register on component registry
*/

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
  header: {
    type: String,
    required: false,
  },
  /**
   * The heading tag to render.
   *
   * @default 'h3'
   */
  is: {
    type: [Object, String] as PropType<'h2' | 'h3' | 'span'>,
    default: 'h3',
  },
  /**
   *
   *
   * @default 'agenda'
   */
  preset: {
    type: String as PropType<'agenda' | 'blog'>,
    default: 'agenda',
  },
  /**
   *
   *
   * @default 6
   */
  max_items: {
    type: Number,
    default: 9,
  },
  /**
   *
   *
   * @default false
   */
  large: {
    type: Boolean,
    default: false,
  },
  /**
   *
   */
  custom_folder: {
    type: String,
    required: false,
  },
})

const card_suffix = props.preset === 'agenda' ? 'event' : 'post'
const folder = props.custom_folder ? props.custom_folder : props.preset === 'blog' ? 'blog' : 'agenda'

const getPath = (folder: 'agenda' | 'blog' | string | undefined) => {
  if (!folder) return ''
  return `${folder.startsWith('/') ? '' : '/'}${folder}`
}

import type { QueryBuilderParams } from '@nuxt/content'
//const where = props.preset === 'agenda' ? [{ start: { $gt: 2024-10-17 }, eventtype: { $eq: 'course' } }] : [{ layout: 'article' }]
const where = props.preset === 'agenda' ? [{ ctype: { $ne: 'course' } }] : []
const query: QueryBuilderParams = {
  path: getPath(folder),
  where: where,
  limit: props.max_items,
  sort: props.preset === 'agenda' ? [{ start: -1 }] : [],
}
</script>
