<template>
  <ContentRenderer :value="primaryEvent">
    <div class="card">
      <!-- Main card content - links to primary event -->
      <NuxtLink :to="primaryEvent._path">
        <CardHero
          :imgTmp="primaryEvent.image?.src"
          :imgTmpAlignX="primaryEvent.hero?.image_focus_x"
          :imgTmpAlignY="primaryEvent.hero?.image_focus_y"
          target="card"
          class="c-hero"
        />
        <Heading
          v-if="heading || primaryEvent.heading || primaryEvent.title"
          card
          :content="heading ?? primaryEvent.heading ?? primaryEvent.title ?? ''"
          is="h4"
          class="heading"
        />
      </NuxtLink>
      
      <!-- Date chips row for repeating events -->
      <div v-if="hasMultipleDates" class="date-chips" :class="{ 'date-chips-condensed': isCondensed }">
        <NuxtLink
          v-for="(event, index) in visibleEvents"
          :key="event._path"
          :to="event._path"
          class="date-chip"
        >
          {{ getTagExtract(event) }}
        </NuxtLink>
        <span v-if="overflowCount > 0 && showOverflow" class="date-chip-overflow">
          +{{ overflowCount }}
        </span>
      </div>
    </div>
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { computed } from 'vue'
import {
  extractCity,
  generateTagExtract,
  getFirstUpcoming,
  isValidEvent,
  type EventContent,
} from '~/composables/useRepeatingEvents'

const MAX_VISIBLE_CHIPS = 4

const props = defineProps({
  /**
   * Optional override for heading text
   */
  heading: {
    type: String,
  },
  /**
   * Array of events in this group (same shortcode)
   */
  events: {
    type: Array as PropType<EventContent[]>,
    required: true,
  },
})

// Get the first upcoming event as the primary display
const primaryEvent = computed(() => {
  return getFirstUpcoming(props.events) || props.events[0]
})

// Sort events by date and dedupe by tag-extract
const sortedEvents = computed(() => {
  // Filter out invalid events (missing ctype or drafts) and sort by date
  const sorted = [...props.events]
    .filter(isValidEvent)
    .sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
  
  // Dedupe by tag-extract (keeps first occurrence)
  const seen = new Set<string>()
  return sorted.filter(event => {
    const tag = generateTagExtract(event)
    if (seen.has(tag)) return false
    seen.add(tag)
    return true
  })
})

const hasMultipleDates = computed(() => sortedEvents.value.length > 1)

const visibleEvents = computed(() => sortedEvents.value.slice(0, MAX_VISIBLE_CHIPS))
const overflowCount = computed(() => Math.max(0, sortedEvents.value.length - MAX_VISIBLE_CHIPS))

// Only show overflow count for online-only groups (in-presence would overflow/break the UI)
const showOverflow = computed(() => {
  if (overflowCount.value <= 0) return false
  const primary = primaryEvent.value
  const city = extractCity(primary.location, primary.tag)
  return !city // empty city = online
})

// Condensed mode: 4+ visible chips that have a location (city abbreviation)
const isCondensed = computed(() => {
  if (visibleEvents.value.length < 4) return false
  return visibleEvents.value.some(e => !!extractCity(e.location, e.tag))
})

function getTagExtract(event: EventContent): string {
  return generateTagExtract(event) || event.title || ''
}
</script>

<style scoped>
.card {
  min-width: 21rem; /* 336px */
  max-width: 21rem;
  width: 21rem;
  box-shadow:
    0px 4px 6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: var(--color-card-bg);
}

.c-hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.5rem;
  background-color: var(--color-muted-bg);
}

.c-hero:hover::after {
  background-color: var(--color-primary-bg);
}

.heading {
  padding: 0.5rem 1rem;
}

.heading :deep() > h4.heading > .overline {
  font-size: 0.825rem;
}

/* Date chips row — tagline style matching CardPost */
.date-chips {
  display: flex;
  gap: 0;
  padding: 0;
  margin: 0;
  flex-wrap: nowrap;
  overflow: hidden;
  background-color: var(--color-muted-bg);
}

.date-chip {
  display: inline-flex;
  align-items: center;
  padding-inline: 0.5rem;
  background-color: var(--color-muted-bg);
  color: inherit;
  font-size: 0.9em;
  font-weight: 400;
  white-space: nowrap;
  border-radius: 0;
  transition: background-color 0.15s ease;
  text-decoration: none;
  line-height: 1rem;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  border-right: 3px solid var(--color-card-bg);
}

.date-chip:hover {
  background-color: var(--color-primary-bg);
}

/* Condensed: 4+ chips with location — reduce font 10% + condensed */
.date-chips-condensed .date-chip {
  font-size: 0.81em;
  font-stretch: condensed;
  padding-inline: 0.35rem;
}

.date-chip-overflow {
  display: inline-flex;
  align-items: center;
  padding-inline: 0.25rem;
  font-size: 0.9em;
  font-weight: 700;
  color: var(--color-muted-text);
  white-space: nowrap;
  line-height: 1rem;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
}
</style>
