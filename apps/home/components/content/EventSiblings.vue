<template>
  <div v-if="allDates && allDates.length > 1" class="event-siblings">
    <h4 class="event-siblings__label"><strong>{{ label }}</strong></h4>
    <CatalogRadio
      v-model="selectedPath"
      :choices="dateChoices"
      name="event-date"
      class="event-siblings__list"
    />
    <div class="event-siblings__checkout">
      <Button variant="primary" @click="goToCheckout">
        {{ buttonLabel }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { CatalogRadio, Button, type CatalogRadioChoice } from '@crearis/ui'
import {
  generateSiblingLine,
  getShortcode,
  filterEventsByDateRange,
  type EventContent,
} from '~/composables/useRepeatingEvents'

const { page } = useContent()
const router = useRouter()

const props = defineProps({
  /**
   * Label shown above the list
   * @default 'Termin auswählen'
   */
  label: {
    type: String,
    default: 'Termin auswählen',
  },
  /**
   * Maximum number of dates to show
   * @default 6
   */
  max: {
    type: Number,
    default: 6,
  },
  /**
   * Checkout button label
   * @default 'Details und Buchung'
   */
  buttonLabel: {
    type: String,
    default: 'Details und Buchung',
  },
})

// Current page as selected by default
const currentPath = computed(() => page.value?._path || '')
const selectedPath = ref(currentPath.value)

// Sync selectedPath when currentPath becomes available
watch(currentPath, (newPath) => {
  if (newPath && !selectedPath.value) {
    selectedPath.value = newPath
  }
}, { immediate: true })

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

// All dates including current page, sorted by date
const allDates = computed(() => {
  if (!allSiblings.value || !shortcode.value) return []
  
  const sameShortcode = (allSiblings.value as EventContent[])
    .filter(event => {
      const eventShortcode = getShortcode(event.id)
      return eventShortcode === shortcode.value
    })
  
  // Filter to future events within 20 months
  return filterEventsByDateRange(sameShortcode)
    .sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
})

// Convert to CatalogRadio choices
const dateChoices = computed<CatalogRadioChoice[]>(() => {
  return allDates.value.slice(0, props.max).map(event => {
    const line = generateSiblingLine(event)
    return {
      value: event._path || '',
      label: line.dateRange,
      meta: line.location,
    }
  })
})

// Navigate to checkout for selected event
function goToCheckout() {
  if (selectedPath.value) {
    router.push(`/details?src=${selectedPath.value}`)
  }
}
</script>

<style scoped>
.event-siblings {
  margin: -12px -12px -12px -12px;
  padding: 12px 12px 12px 12px;
  background: white;
}

.event-siblings__label {
  font-size: 1.2rem; /* 19.2px at default 16px root */
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}

.event-siblings__list {
  max-width: 420px;
}

.event-siblings__checkout {
  margin-top: 1.25rem;
  text-align: right;
}

/* Radio ring styling: 3px primary border for selected */
.event-siblings :deep(.catalog-radio__control) {
  width: 1rem;
  height: 1rem;
  border-width: 3px;
}

.event-siblings :deep(.catalog-radio__item--selected .catalog-radio__control) {
  border-color: var(--color-primary);
}

.event-siblings :deep(.catalog-radio__input:checked + .catalog-radio__control) {
  border-color: var(--color-primary);
}

.event-siblings :deep(.catalog-radio__control::after) {
  background-color: var(--color-primary);
}
</style>
