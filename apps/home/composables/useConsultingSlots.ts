/**
 * Composable for Odoo GraphQL consulting slot booking.
 * 
 * Fetches available 15-minute consulting slots from exec domainusers
 * and handles booking via GraphQL mutations.
 * 
 * Uses server-side proxy (/api/graphql) to avoid CORS issues.
 * 
 * @see _meta/Act26/03-02-SCS_consulting_slots.md
 * @see apps/home/server/api/graphql.post.ts
 */

import { ref, computed, reactive } from 'vue'

// Timezone constant for Germany
const DISPLAY_TIMEZONE = 'Europe/Berlin'

/**
 * Parse Odoo datetime string and return a proper Date object.
 * Odoo returns datetimes in UTC but often without explicit 'Z' suffix.
 * This function ensures consistent UTC interpretation.
 */
function parseOdooDateTime(isoString: string): Date {
  // If no timezone marker, treat as UTC by appending 'Z'
  if (!isoString.endsWith('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
    return new Date(isoString + 'Z')
  }
  return new Date(isoString)
}

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
      photoUrl
    }
  }
`

const BOOK_CONSULTING_SLOT_MUTATION = `
  mutation BookConsultingSlot(
    $slotKey: String!
    $start: String!
    $hostId: Int!
    $contact: ConsultingContactInput!
    $consultation: ConsultingCategoryInput
    $notes: String
    $allowCancellation: Boolean
    $productSlug: String
    $domainCode: String
  ) {
    bookConsultingSlot(
      slotKey: $slotKey
      start: $start
      hostId: $hostId
      contact: $contact
      consultation: $consultation
      notes: $notes
      allowCancellation: $allowCancellation
      productSlug: $productSlug
      domainCode: $domainCode
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
  photoUrl?: string  // Consultant photo URL
}

export interface ConsultingContactInput {
  email: string
  vorname: string
  nachname: string
  mobil?: string
}

/**
 * Single category selection with optional predefined options and freeform text.
 */
export interface CategorySelectionInput {
  category: string
  options?: string[]
  text?: string
}

/**
 * Input for consultation categories.
 * Passed to GraphQL mutation for logging to calendar event + chatter.
 */
export interface ConsultingCategoryInput {
  selections: CategorySelectionInput[]
  callType: 'video' | 'phone'
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
  callType: 'video' | 'phone'
  contact: ConsultingContactInput
  consultation: ConsultingCategoryInput
  productRef: string | null
  notes: string
  allowCancellation: boolean
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
  selections?: CategorySelectionInput[]
  productRef?: string
  domainCode?: string
} = {}) {
  // Resolve preset with default
  const preset = options.preset || 'einstieg'
  const presetConfig = PRESET_CONFIG[preset] || PRESET_CONFIG.einstieg
  
  // Domain code: explicit override or from preset
  const domainCode = options.domainCode || presetConfig.domainCode
  
  // Date range defaults: now through next 7 days
  const now = new Date()
  const defaultEnd = new Date(now)
  defaultEnd.setDate(defaultEnd.getDate() + 7)
  
  const startDate = options.startDate || now
  const endDate = options.endDate || defaultEnd
  
  // Pre-filled consultation data from URL params
  const initialSelections = options.selections || []
  const initialProductRef = options.productRef || null
  
  // Reactive state
  const state = reactive<ConsultingState>({
    step: 1,
    slots: [],
    selectedSlot: null,
    callType: 'video',
    contact: {
      email: '',
      vorname: '',
      nachname: '',
      mobil: '',
    },
    consultation: {
      selections: [...initialSelections],
      callType: 'video',
    },
    productRef: initialProductRef,
    notes: '',
    allowCancellation: false,
    isLoading: false,
    isSubmitting: false,
    error: null,
    result: null,
  })
  
  // Minimum frontrunning time in ms (30 minutes)
  // Slots starting within 30 min cannot be booked (gives Odoo user time to react)
  const MIN_BOOKING_LEAD_TIME_MS = 30 * 60 * 1000
  
  // Computed: filter slots by date range AND enforce 30-min frontrunning
  const filteredSlots = computed(() => {
    const nowMs = Date.now()
    const minBookableTimeMs = nowMs + MIN_BOOKING_LEAD_TIME_MS
    
    return state.slots.filter(slot => {
      // Parse slot time as UTC (Odoo stores in UTC)
      const slotDate = parseOdooDateTime(slot.start)
      const slotMs = slotDate.getTime()
      
      // Must be within requested date range
      if (slotDate < startDate || slotDate > endDate) return false
      // Must be at least 30 minutes from now (UTC comparison)
      if (slotMs < minBookableTimeMs) return false
      return true
    })
  })
  
  // Computed: group slots by date for UI (grouped by Europe/Berlin date)
  const slotsByDate = computed(() => {
    const groups: Record<string, ConsultingSlot[]> = {}
    
    for (const slot of filteredSlots.value) {
      const date = parseOdooDateTime(slot.start)
      // Get date string in Europe/Berlin timezone for proper grouping
      const dateKey = date.toLocaleDateString('sv-SE', { timeZone: DISPLAY_TIMEZONE }) // YYYY-MM-DD format
      
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
  
  // Format date for display (German locale, Europe/Berlin timezone)
  const formatDate = (isoDate: string): string => {
    const date = parseOdooDateTime(isoDate)
    return date.toLocaleDateString('de-DE', {
      timeZone: DISPLAY_TIMEZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }
  
  // Format time for display (Europe/Berlin timezone)
  const formatTime = (isoDate: string): string => {
    const date = parseOdooDateTime(isoDate)
    return date.toLocaleTimeString('de-DE', {
      timeZone: DISPLAY_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  // Actions
  const fetchSlots = async (): Promise<void> => {
    state.isLoading = true
    state.error = null
    
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CONSULTING_SLOTS_QUERY,
          variables: {
            domainCode: domainCode, // Use override or preset
            weeks: 3, // Fetch 3 weeks, filter client-side
          },
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
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
    } else if (state.step === 2) {
      // Options step - always can proceed
      state.step = 3
    } else if (state.step === 3 && isContactValid.value) {
      state.step = 4
    }
  }
  
  const prevStep = () => {
    if (state.step > 1) state.step--
  }
  
  const submit = async (): Promise<ConsultingBookingResult> => {
    if (!canSubmit.value) {
      return { success: false, error: 'Bitte alle Felder ausfüllen' }
    }
    
    if (!state.selectedSlot) {
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
      consultation: state.consultation.selections.length > 0 ? {
        selections: state.consultation.selections.map(sel => ({
          category: sel.category,
          options: sel.options && sel.options.length > 0 ? sel.options : undefined,
          text: sel.text || undefined,
        })),
        callType: state.consultation.callType,
      } : undefined,
      notes: state.notes || undefined,
      allowCancellation: state.allowCancellation || undefined,
      productSlug: state.productRef || undefined,
      domainCode: domainCode,
    }
    
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: BOOK_CONSULTING_SLOT_MUTATION,
          variables,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const json = await response.json()
      
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
    state.consultation = { selections: [], callType: 'video' }
    state.productRef = null
    state.notes = ''
    state.allowCancellation = false
    state.error = null
    state.result = null
  }
  
  const setConsultation = (consultation: Partial<ConsultingCategoryInput>) => {
    if (consultation.selections) {
      state.consultation.selections = [...consultation.selections]
    }
    if (consultation.callType) {
      state.consultation.callType = consultation.callType
    }
  }
  
  const toggleCategory = (category: string) => {
    const index = state.consultation.selections.findIndex(s => s.category === category)
    if (index === -1) {
      state.consultation.selections.push({ category, options: [], text: undefined })
    } else {
      state.consultation.selections.splice(index, 1)
    }
  }
  
  const setCategoryFreeform = (category: string, text: string) => {
    const sel = state.consultation.selections.find(s => s.category === category)
    if (sel) {
      sel.text = text || undefined
    } else {
      state.consultation.selections.push({ category, options: [], text: text || undefined })
    }
  }
  
  const setCategoryOptions = (category: string, options: string[]) => {
    const sel = state.consultation.selections.find(s => s.category === category)
    if (sel) {
      sel.options = options
    } else {
      state.consultation.selections.push({ category, options, text: undefined })
    }
  }
  
  const toggleCategoryOption = (category: string, option: string) => {
    let sel = state.consultation.selections.find(s => s.category === category)
    if (!sel) {
      sel = { category, options: [], text: undefined }
      state.consultation.selections.push(sel)
    }
    if (!sel.options) sel.options = []
    const idx = sel.options.indexOf(option)
    if (idx === -1) {
      sel.options.push(option)
    } else {
      sel.options.splice(idx, 1)
    }
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
    consultation: computed(() => state.consultation),
    productRef: computed(() => state.productRef),
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
    setConsultation,
    toggleCategory,
    setCategoryFreeform,
    setCategoryOptions,
    toggleCategoryOption,
    nextStep,
    prevStep,
    submit,
    reset,
  }
}
