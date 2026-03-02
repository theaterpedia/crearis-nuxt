/**
 * Composable for Odoo GraphQL consulting slot booking.
 * 
 * Fetches available 15-minute consulting slots from exec domainusers
 * and handles booking via GraphQL mutations.
 * 
 * @see _meta/Act26/03-02-SCS_consulting_slots.md
 */

import { ref, computed, reactive } from 'vue'

// GraphQL queries/mutations
const CONSULTING_SLOTS_QUERY = `
  query ConsultingSlots($domainCode: String!, $weeks: Int) {
    consultingSlots(domainCode: $domainCode, weeks: $weeks) {
      slotKey
      start
      stop
      duration
      hostName
      hostId
    }
  }
`

const BOOK_CONSULTING_SLOT_MUTATION = `
  mutation BookConsultingSlot(
    $slotKey: String!
    $start: String!
    $hostId: Int!
    $contact: ConsultingContactInput!
    $notes: String
  ) {
    bookConsultingSlot(
      slotKey: $slotKey
      start: $start
      hostId: $hostId
      contact: $contact
      notes: $notes
    ) {
      success
      meetingId
      start
      hostName
      error
    }
  }
`

// Types
export interface ConsultingSlot {
  slotKey: string
  start: string      // ISO datetime
  stop: string
  duration: number   // hours (0.25 = 15min)
  hostName: string
  hostId: number
}

export interface ConsultingContactInput {
  email: string
  vorname: string
  nachname: string
  mobil?: string
}

export interface ConsultingBookingResult {
  success: boolean
  meetingId?: number
  start?: string
  hostName?: string
  error?: string
}

export interface ConsultingState {
  step: number
  slots: ConsultingSlot[]
  selectedSlot: ConsultingSlot | null
  contact: ConsultingContactInput
  notes: string
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  result: ConsultingBookingResult | null
}

// Preset configurations
export type ConsultingPreset = 'einstieg' | 'grundlagen' | 'aufbau'

export const PRESET_CONFIG: Record<ConsultingPreset, { title: string; description: string; domainCode: string }> = {
  einstieg: {
    title: 'Beratung: Einstiege ins Theaterspiel',
    description: 'Online-Beratung zur Fortbildung "Einstiege ins Theaterspiel"',
    domainCode: 'dasei',
  },
  grundlagen: {
    title: 'Beratung: Grundlagenbildung',
    description: 'Online-Beratung zur Grundlagenbildung Theaterpädagogik',
    domainCode: 'dasei',
  },
  aufbau: {
    title: 'Beratung: Aufbaustufe',
    description: 'Online-Beratung zur Aufbaustufe Theaterpädagogik (BuT)',
    domainCode: 'dasei',
  },
}

/**
 * Composable for consulting slot booking.
 * 
 * @param options.preset - Consulting context ('einstieg', 'grundlagen', 'aufbau')
 * @param options.startDate - Filter slots from this date (default: now)
 * @param options.endDate - Filter slots until this date (default: now + 7 days)
 * 
 * @example
 * ```vue
 * <script setup>
 * const route = useRoute()
 * const preset = (route.query.preset as string) || 'einstieg'
 * const consulting = useConsultingSlots({ preset })
 * 
 * await consulting.fetchSlots()
 * </script>
 * ```
 */
export function useConsultingSlots(options: {
  preset?: ConsultingPreset
  startDate?: Date
  endDate?: Date
} = {}) {
  const config = useRuntimeConfig()
  const graphqlUrl = config.public.odooGraphqlUrl as string
  
  // Resolve preset with default
  const preset = options.preset || 'einstieg'
  const presetConfig = PRESET_CONFIG[preset] || PRESET_CONFIG.einstieg
  
  // Date range defaults: now through next 7 days
  const now = new Date()
  const defaultEnd = new Date(now)
  defaultEnd.setDate(defaultEnd.getDate() + 7)
  
  const startDate = options.startDate || now
  const endDate = options.endDate || defaultEnd
  
  // Reactive state
  const state = reactive<ConsultingState>({
    step: 1,
    slots: [],
    selectedSlot: null,
    contact: {
      email: '',
      vorname: '',
      nachname: '',
      mobil: '',
    },
    notes: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
    result: null,
  })
  
  // Computed: filter slots by date range
  const filteredSlots = computed(() => {
    return state.slots.filter(slot => {
      const slotDate = new Date(slot.start)
      return slotDate >= startDate && slotDate <= endDate
    })
  })
  
  // Computed: group slots by date for UI
  const slotsByDate = computed(() => {
    const groups: Record<string, ConsultingSlot[]> = {}
    
    for (const slot of filteredSlots.value) {
      const date = new Date(slot.start)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(slot)
    }
    
    // Sort by date
    const sortedEntries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    return Object.fromEntries(sortedEntries)
  })
  
  // Computed validators
  const isContactValid = computed(() => {
    const { email, vorname, nachname, mobil } = state.contact
    return email.includes('@') && vorname.length > 1 && nachname.length > 1 && (mobil?.length ?? 0) > 5
  })
  
  const canProceedToContact = computed(() => {
    return state.selectedSlot !== null
  })
  
  const canSubmit = computed(() => {
    return state.selectedSlot !== null && isContactValid.value && !state.isSubmitting
  })
  
  // Format date for display (German locale)
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }
  
  // Format time for display
  const formatTime = (isoDate: string): string => {
    const date = new Date(isoDate)
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  // Actions
  const fetchSlots = async (): Promise<void> => {
    if (!graphqlUrl) {
      state.error = 'GraphQL endpoint not configured'
      return
    }
    
    state.isLoading = true
    state.error = null
    
    try {
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CONSULTING_SLOTS_QUERY,
          variables: {
            domainCode: presetConfig.domainCode,
            weeks: 3, // Fetch 3 weeks, filter client-side
          },
        }),
      })
      
      const json = await response.json()
      
      if (json.errors) {
        state.error = json.errors[0]?.message || 'Failed to fetch slots'
        return
      }
      
      state.slots = json.data?.consultingSlots || []
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Network error'
    } finally {
      state.isLoading = false
    }
  }
  
  const selectSlot = (slot: ConsultingSlot) => {
    state.selectedSlot = slot
  }
  
  const clearSelection = () => {
    state.selectedSlot = null
  }
  
  const setContact = (contact: Partial<ConsultingContactInput>) => {
    Object.assign(state.contact, contact)
  }
  
  const setNotes = (notes: string) => {
    state.notes = notes
  }
  
  const nextStep = () => {
    if (state.step === 1 && canProceedToContact.value) {
      state.step = 2
    } else if (state.step === 2 && isContactValid.value) {
      state.step = 3
    }
  }
  
  const prevStep = () => {
    if (state.step > 1) state.step--
  }
  
  const submit = async (): Promise<ConsultingBookingResult> => {
    console.log('[useConsultingSlots] submit() called')
    console.log('[useConsultingSlots] canSubmit:', canSubmit.value)
    console.log('[useConsultingSlots] graphqlUrl:', graphqlUrl)
    
    if (!canSubmit.value) {
      console.log('[useConsultingSlots] Cannot submit - validation failed')
      return { success: false, error: 'Bitte alle Felder ausfüllen' }
    }
    
    if (!graphqlUrl) {
      console.log('[useConsultingSlots] No graphqlUrl configured')
      return { success: false, error: 'Booking not configured' }
    }
    
    if (!state.selectedSlot) {
      console.log('[useConsultingSlots] No slot selected')
      return { success: false, error: 'Kein Termin ausgewählt' }
    }
    
    state.isSubmitting = true
    state.error = null
    
    const variables = {
      slotKey: state.selectedSlot.slotKey,
      start: state.selectedSlot.start,
      hostId: state.selectedSlot.hostId,
      contact: {
        email: state.contact.email,
        vorname: state.contact.vorname,
        nachname: state.contact.nachname,
        mobil: state.contact.mobil || undefined,
      },
      notes: state.notes || undefined,
    }
    console.log('[useConsultingSlots] Mutation variables:', variables)
    
    try {
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: BOOK_CONSULTING_SLOT_MUTATION,
          variables,
        }),
      })
      
      const json = await response.json()
      console.log('[useConsultingSlots] GraphQL response:', json)
      
      if (json.errors) {
        const result: ConsultingBookingResult = {
          success: false,
          error: json.errors[0]?.message || 'Booking failed',
        }
        state.result = result
        return result
      }
      
      const result = json.data?.bookConsultingSlot as ConsultingBookingResult
      state.result = result
      
      if (result.success) {
        state.step = 4 // Confirmation step
      }
      
      return result
    } catch (err) {
      const result: ConsultingBookingResult = {
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      }
      state.result = result
      return result
    } finally {
      state.isSubmitting = false
    }
  }
  
  const reset = () => {
    state.step = 1
    state.selectedSlot = null
    state.contact = { email: '', vorname: '', nachname: '', mobil: '' }
    state.notes = ''
    state.error = null
    state.result = null
  }
  
  return {
    // Config
    preset,
    presetConfig,
    startDate,
    endDate,
    
    // State (readonly where sensible)
    state,
    slots: computed(() => state.slots),
    filteredSlots,
    slotsByDate,
    selectedSlot: computed(() => state.selectedSlot),
    isLoading: computed(() => state.isLoading),
    isSubmitting: computed(() => state.isSubmitting),
    error: computed(() => state.error),
    result: computed(() => state.result),
    
    // Validators
    isContactValid,
    canProceedToContact,
    canSubmit,
    
    // Formatters
    formatDate,
    formatTime,
    
    // Actions
    fetchSlots,
    selectSlot,
    clearSelection,
    setContact,
    setNotes,
    nextStep,
    prevStep,
    submit,
    reset,
  }
}
