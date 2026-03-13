<template>
  <div>
    <NuxtLayout>
      <DataViewConsulting 
        :preset="preset" 
        :startDate="startDate" 
        :endDate="endDate"
        :selections="selections"
        :product-ref="productRef"
        :domain-code="domainCode"
        :title="titleParam"
      />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import type { ConsultingPreset } from '~/composables/useConsultingSlots'

definePageMeta({
  layout: 'details',
})

const route = useRoute()

// Parse route query params
// preset: 'default' | 'newsletter' (default: 'default')
const validPresets: ConsultingPreset[] = ['default', 'newsletter']
const presetParam = route.query.preset as string | undefined
const preset: ConsultingPreset = validPresets.includes(presetParam as ConsultingPreset) 
  ? (presetParam as ConsultingPreset) 
  : 'default'

// Parse start/end dates
// Default: now through next 7 days
const now = new Date()
const defaultEnd = new Date(now)
defaultEnd.setDate(defaultEnd.getDate() + 7)

const parseDate = (dateStr: string | undefined, fallback: Date): Date => {
  if (!dateStr) return fallback
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? fallback : parsed
}

const startDate = parseDate(route.query.start as string | undefined, now)
const endDate = parseDate(route.query.end as string | undefined, defaultEnd)

// Parse selections from URL (JSON-encoded)
// Example: ?selections=%5B%7B%22category%22%3A%22schedules%22%2C%22label%22%3A%22Verl%C3%A4ufe%22%2C%22options%22%3A%5B%22blockverlauf%22%5D%7D%5D
interface SelectionInput {
  category: string
  label?: string
  overline?: string
  options?: string[]
  text?: string
}

const selectionsParam = route.query.selections as string | undefined
const selections: SelectionInput[] = (() => {
  if (!selectionsParam) return []
  try {
    const decoded = decodeURIComponent(selectionsParam)
    return JSON.parse(decoded) as SelectionInput[]
  } catch {
    console.warn('[beratung] Failed to parse selections param:', selectionsParam)
    return []
  }
})()

// Parse product ref from URL
// Example: ?product=m18w
const productRef = route.query.product as string | undefined

// Parse domain code from URL
// Example: ?domain=dasei1
const domainCode = route.query.domain as string | undefined

// Parse title override from URL
// Example: ?title=Vertiefung
const titleParam = route.query.title as string | undefined

// Parse navigation highlight from URL  
// Example: ?navHighlight=/ausbildung-theaterpaedagogik/vertiefung
const navHighlight = route.query.navHighlight as string | undefined

// Set up navigation
const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

mainMenu.value.navigation = navigation.value ?? []

// Highlight the relevant navigation item from param (no preset-based fallback needed)
refreshMainMenu(navHighlight || '/ausbildung-theaterpaedagogik')
</script>
