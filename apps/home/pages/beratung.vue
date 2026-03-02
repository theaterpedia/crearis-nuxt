<template>
  <div>
    <NuxtLayout>
      <DataViewConsulting 
        :preset="preset" 
        :startDate="startDate" 
        :endDate="endDate" 
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
