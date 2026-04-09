<template>
  <div>
    <slot />
    <br v-if="$slots.default" />
    <ContentList v-slot="{ list }" :query="query">
      <Columns gap="small" wrap>
        <!-- Grouped display for agenda with repeating events -->
        <template v-if="preset === 'agenda' && groupRepeating">
          <template v-for="group in getGroupedEvents(list)" :key="group.key">
            <!-- Single event - use regular card -->
            <CardEvent v-if="group.events.length === 1" :data="group.events[0]" />
            <!-- Multiple events - use grouped card with date chips -->
            <CardEventGrouped v-else :events="group.events" />
          </template>
        </template>
        <!-- Non-grouped display (blog or groupRepeating=false) -->
        <template v-else>
          <template v-for="page in list" :key="page.path">
            <Component :data="page" :is="`card-${card_suffix}`" />
          </template>
        </template>
      </Columns>
    </ContentList>
  </div>
</template>

<script lang="ts" setup>
import { groupEventsByShortcode, getFirstUpcoming, filterEventsByDateRange, type EventContent } from '~/composables/useRepeatingEvents'
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
   * @default ''
   */
  subfolder: {
    type: String,
    default: '',
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
  /**
   * Group repeating events (same shortcode) into single cards with date chips.
   * Only applies to agenda preset.
   * 
   * @default true
   */
  groupRepeating: {
    type: Boolean,
    default: true,
  },
})

const card_suffix = props.preset === 'agenda' ? 'event' : 'post'
const folder = props.custom_folder ? props.custom_folder : props.preset === 'blog' ? 'blog' : 'agenda'

const getPath = (folder: 'agenda' | 'blog' | string | undefined) => {
  if (!folder) return ''
  if (props.subfolder === '') return folder.startsWith('/') ? folder : `/${folder}`
  return `${folder.startsWith('/') ? '' : '/'}${folder}${props.subfolder.startsWith('/') ? '' : '/'}${props.subfolder}`
}

interface EventGroup {
  key: string
  events: EventContent[]
}

/**
 * Group events by shortcode for repeating event display
 * Returns array sorted by first upcoming event date
 * Filters to future events within 20 months
 */
function getGroupedEvents(list: EventContent[]): EventGroup[] {
  // Filter to relevant date range first (isValidEvent handles ctype/listAsEvent/draft)
  const filtered = filterEventsByDateRange(list)
  const grouped = groupEventsByShortcode(filtered)
  const result: EventGroup[] = []
  
  for (const [key, events] of grouped) {
    result.push({ key, events })
  }
  
  // Sort groups by the first upcoming event's date
  result.sort((a, b) => {
    const firstA = getFirstUpcoming(a.events)
    const firstB = getFirstUpcoming(b.events)
    const dateA = firstA?.date_start ? new Date(firstA.date_start).getTime() : 0
    const dateB = firstB?.date_start ? new Date(firstB.date_start).getTime() : 0
    return dateA - dateB
  })

  // Cap to max_items
  return result.slice(0, props.max_items)
}

import type { QueryBuilderParams } from '@nuxt/content'
//const where = props.preset === 'agenda' ? [{ start: { $gt: 2024-10-17 }, eventtype: { $eq: 'course' } }] : [{ layout: 'article' }]
const where =
  props.preset === 'agenda'
    ? [{ _path: { $ne: '/agenda/_dir' } }]
    : props.preset === 'blog'
      ? [{ _path: { $ne: '/blog/_dir' } }]
      : []
const query: QueryBuilderParams = {
  path: getPath(folder),
  where: where,
  limit: (props.preset === 'agenda' && props.groupRepeating) ? 100 : props.max_items, // Need more items when grouping
  sort: props.preset === 'agenda' ? [{ start: 1 }] : props.preset === 'blog' ? [{ date: -1 }] : [],
}
</script>
