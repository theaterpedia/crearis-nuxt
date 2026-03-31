<template>
  <div v-if="siblings && siblings.length > 0" class="event-siblings">
    <div class="event-siblings__label">{{ label }}</div>
    <div class="event-siblings__chips">
      <NuxtLink
        v-for="event in siblings.slice(0, max)"
        :key="event._path"
        :to="event._path"
        class="event-siblings__chip"
      >
        {{ getTagExtract(event) }}
      </NuxtLink>
      <span v-if="siblings.length > max" class="event-siblings__overflow">
        +{{ siblings.length - max }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { NuxtLink } from '#components'
import {
  generateTagExtract,
  getShortcode,
  filterEventsByDateRange,
  type EventContent,
} from '~/composables/useRepeatingEvents'

const { page } = useContent()

const props = defineProps({
  /**
   * Label shown above the chips
   * @default 'Weitere Termine'
   */
  label: {
    type: String,
    default: 'Weitere Termine',
  },
  /**
   * Maximum number of siblings to show
   * @default 6
   */
  max: {
    type: Number,
    default: 6,
  },
})

// Get shortcode from current page
const shortcode = computed(() => {
  const currentPage = page.value as EventContent | undefined
  return getShortcode(currentPage?.id)
})

// Fetch all events with same shortcode
const { data: allSiblings } = await useAsyncData(
  `siblings-${shortcode.value}`,
  () => {
    if (!shortcode.value) return Promise.resolve([])
    return queryContent('/agenda')
      .where({ ctype: { $eq: 'event' } })
      .find()
  },
  { watch: [shortcode] }
)

// Filter to same shortcode, exclude current page, and filter by date range
const siblings = computed(() => {
  if (!allSiblings.value || !shortcode.value) return []
  const currentPath = page.value?._path
  
  const sameShortcode = (allSiblings.value as EventContent[])
    .filter(event => {
      const eventShortcode = getShortcode(event.id)
      return eventShortcode === shortcode.value && event._path !== currentPath
    })
  
  // Filter to future events within 20 months
  return filterEventsByDateRange(sameShortcode)
    .sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
})

function getTagExtract(event: EventContent): string {
  return generateTagExtract(event) || event.title || ''
}
</script>

<style scoped>
.event-siblings {
  padding: 1rem 0;
}

.event-siblings__label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted, #666);
}

.event-siblings__chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.event-siblings__chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-muted-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease;
  text-decoration: none;
}

.event-siblings__chip:hover {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-text, inherit);
}

.event-siblings__overflow {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted, #666);
}
</style>
