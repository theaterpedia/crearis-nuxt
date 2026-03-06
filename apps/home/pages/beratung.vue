<template>
  <div>
    <NuxtLayout>
      <DataViewConsulting 
        :preset="preset" 
        :startDate="startDate" 
        :endDate="endDate"
        :categories="categories"
        :product-ref="productRef"
        :freeform-text="freeformText"
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
// preset: 'einstieg' | 'grundlagen' | 'aufbau' (default: 'einstieg')
const validPresets: ConsultingPreset[] = ['einstieg', 'grundlagen', 'aufbau']
const presetParam = route.query.preset as string | undefined
const preset: ConsultingPreset = validPresets.includes(presetParam as ConsultingPreset) 
  ? (presetParam as ConsultingPreset) 
  : 'einstieg'

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

// NEW: Parse categories from URL (comma-separated)
// Example: ?categories=prerequisites,topics,custom
const categoriesParam = route.query.categories as string | undefined
const categories: string[] = categoriesParam 
  ? categoriesParam.split(',').filter(Boolean) 
  : []

// NEW: Parse product ref from URL
// Example: ?product=m18w
const productRef = route.query.product as string | undefined

// NEW: Parse freeform notes from URL (JSON-encoded)
// Example: ?notes=%7B%22prerequisites%22%3A%22My%20question%22%7D
const notesParam = route.query.notes as string | undefined
const freeformText: Record<string, string> = (() => {
  if (!notesParam) return {}
  try {
    const decoded = decodeURIComponent(notesParam)
    return JSON.parse(decoded) as Record<string, string>
  } catch {
    console.warn('[beratung] Failed to parse notes param:', notesParam)
    return {}
  }
})()

// Set up navigation
const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

mainMenu.value.navigation = navigation.value ?? []

// Highlight the relevant navigation item based on preset
const navHighlightMap: Record<ConsultingPreset, string> = {
  einstieg: '/ausbildung-theaterpaedagogik/kurs_einstiege_ins_theaterspiel',
  grundlagen: '/ausbildung-theaterpaedagogik/kurs_grundlagen',
  aufbau: '/ausbildung-theaterpaedagogik/aufbaustufe',
}
refreshMainMenu(navHighlightMap[preset])
</script>
