<template>
  <div class="consulting-dialog" :class="{ 'consulting-dialog--fancy': fancy, 'has-active': hasSelection }">
    <div class="consulting-dialog-header">
      <span v-if="computedOverline" class="consulting-dialog-overline">{{ computedOverline }}</span>
      <h2 class="consulting-dialog-title">{{ title }}</h2>
      <p v-if="description" class="consulting-dialog-description">{{ description }}</p>
    </div>

    <div class="consulting-dialog-body">
      <!-- Left rail for fancy mode -->
      <div v-if="fancy" class="consulting-dialog-rail">
        <div class="consulting-dialog-rail-line" :class="{ 'is-active': hasSelection }"></div>
      </div>

      <div class="consulting-dialog-main">
        <div class="consulting-dialog-categories">
          <div 
            v-for="(category, index) in normalizedCategories"
            :key="category.key"
            class="consulting-dialog-category-wrapper"
            :class="{ 
              'is-expanded': selectedCategories[category.key],
              'has-active-above': hasActiveAbove(index)
            }"
          >
            <ConsultingCategoryItem
              :name="category.key"
              :title="category.label"
              :overline="category.overline"
              :options="category.options"
              :option-type="category.optionType || 'checkbox'"
              :input-label="category.inputLabel || 'Deine Frage oder Anmerkung'"
              :input-placeholder="category.inputPlaceholder || 'Optional: Beschreibe Dein Anliegen...'"
              :variant="categoryVariant"
              :expansion-delay="300"
              v-model="selectedCategories[category.key]"
              v-model:freeform-text="freeformTexts[category.key]"
              v-model:selected-options="selectedOptions[category.key]"
            >
              <template v-if="category.teaser">
                {{ category.teaser }}
              </template>
            </ConsultingCategoryItem>
          </div>
        </div>

        <div class="consulting-dialog-actions">
          <!-- Success state: replaces entire actions section -->
          <div v-if="emailSent" class="consulting-dialog-success">
            <svg class="consulting-dialog-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="consulting-dialog-success-text">{{ finalSuccessMessage }}</span>
          </div>

          <!-- Default CTA buttons -->
          <template v-else-if="!showEmailForm">
            <div class="consulting-dialog-cta-wrapper" :class="{ 'is-active': ctaVisualActive }">
              <!-- Simple arrow connector in fancy mode -->
              <span v-if="fancy" class="consulting-dialog-cta-arrow">└ &gt;</span>
              <div class="consulting-dialog-cta-row" :class="{ 'email-only': variant === 'email-only' }">
                <button
                  v-if="variant !== 'email-only'"
                  type="button"
                  :disabled="!hasSelection"
                  @click="handleStartBeratung"
                  class="consulting-dialog-cta consulting-dialog-cta--book"
                >
                  <svg class="consulting-dialog-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ callLabel }}
                </button>
                <button
                  v-if="email"
                  type="button"
                  :disabled="!hasSelection"
                  @click="showEmailForm = true"
                  class="consulting-dialog-cta consulting-dialog-cta--email"
                >
                  <svg class="consulting-dialog-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ emailLabel }}
                </button>
              </div>
            </div>
          </template>

          <!-- Inline email form -->
          <template v-else>
            <form class="consulting-dialog-email-form" @submit.prevent="handleSendEmail">
              <div class="consulting-dialog-email-name-row">
                <div class="consulting-dialog-email-field consulting-dialog-email-field--half">
                  <label for="email-firstname" class="consulting-dialog-email-label">Vorname</label>
                  <input
                    id="email-firstname"
                    v-model="firstName"
                    type="text"
                    required
                    placeholder="Max"
                    class="consulting-dialog-email-input"
                  />
                </div>
                <div class="consulting-dialog-email-field consulting-dialog-email-field--half">
                  <label for="email-lastname" class="consulting-dialog-email-label">Nachname</label>
                  <input
                    id="email-lastname"
                    v-model="lastName"
                    type="text"
                    required
                    placeholder="Mustermann"
                    class="consulting-dialog-email-input"
                  />
                </div>
              </div>
              <div class="consulting-dialog-email-field">
                <label for="email-from" class="consulting-dialog-email-label">{{ emailFromLabel }}</label>
                <input
                  id="email-from"
                  v-model="emailFrom"
                  type="email"
                  required
                  :placeholder="emailFromPlaceholder"
                  class="consulting-dialog-email-input"
                />
              </div>
              <!-- Error display -->
              <div v-if="emailError" class="consulting-dialog-error">
                <svg class="consulting-dialog-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="consulting-dialog-error-text">{{ emailError }}</span>
              </div>

              <div class="consulting-dialog-email-actions">
                <button
                  type="submit"
                  :disabled="!firstName || !lastName || !emailFrom || sendingEmail"
                  class="consulting-dialog-cta consulting-dialog-cta--send"
                >
                  <template v-if="sendingEmail">
                    {{ sendingLabel }}
                  </template>
                  <template v-else>
                    {{ sendLabel }}
                  </template>
                </button>
                <button
                  type="button"
                  @click="showEmailForm = false; firstName = ''; lastName = ''; emailFrom = ''; emailError = null"
                  class="consulting-dialog-cancel"
                >
                  {{ cancelLabel }}
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch, inject, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { ConsultingCategoryItem, pageBottomContextKey, type PageBottomContext } from '@crearis/ui'
import { createEmailInquiry } from '~/composables/useConsultingSlots'

export interface CategoryOption {
  key: string
  label: string
  url?: string  // Optional URL for clickable options
}

export interface ConsultingCategory {
  /** Unique key for this category */
  key: string
  /** German display label */
  label: string
  /** Optional overline text */
  overline?: string
  /** Optional teaser/explanation text */
  teaser?: string
  /** Custom input label */
  inputLabel?: string
  /** Custom input placeholder */
  inputPlaceholder?: string
  /** How to render options: 'checkbox' (multiple) or 'radio' (single) */
  optionType?: 'checkbox' | 'radio'
  /** Predefined options for this category */
  options?: CategoryOption[]
  /** Domain code override for this category (e.g., 'dasei2' for Grundstufe topics) */
  domainCode?: string
}

const props = defineProps({
  /**
   * Visual variant for the dialog categories.
   * - 'default': Minimal style with left chevron, no checkboxes, subtle borders
   * - 'roundedBorders': Original style with checkboxes and rounded borders
   * 
   * @default 'default'
   */
  variant: {
    type: String as PropType<'default' | 'roundedBorders' | 'email-only'>,
    default: 'default',
  },

  /**
   * Enable fancy mode with visual rail and connector lines.
   * When true, active categories expand left and a dotted line connects them to the CTA.
   * 
   * @default true
   */
  fancy: {
    type: Boolean,
    default: true,
  },

  /**
   * Page title for dynamic overline text.
   * If provided and overline not set, generates "Beratung zu: {pageTitle}"
   */
  pageTitle: {
    type: String,
  },

  /**
   * Navigation highlight path for /beratung route.
   * If provided, the navigation menu will highlight this path.
   */
  navHighlight: {
    type: String,
  },

  /**
   * Optional overline text above the title.
   */
  overline: {
    type: String,
  },

  /**
   * Main title for the dialog.
   *
   * @default 'Individuelle Beratung'
   */
  title: {
    type: String,
    default: 'Individuelle Beratung',
  },

  /**
   * Optional description below the title.
   */
  description: {
    type: String,
  },

  /**
   * Array of consultation categories to display.
   */
  categories: {
    type: Array as PropType<ConsultingCategory[]>,
    default: () => [
      { key: 'prerequisites', label: 'Voraussetzungen', overline: 'Zulassung & Anerkennung' },
      { key: 'terms_and_options', label: 'Zahlungsbedingungen', overline: 'Kosten & Optionen' },
      { key: 'topics', label: 'Profile', overline: 'Themenschwerpunkte' },
      { 
        key: 'schedules', 
        label: 'Verläufe', 
        overline: 'Termine & Zeitplanung',
        optionType: 'checkbox',
        options: [
          { key: 'blockverlauf', label: 'Blockseminar-Verlauf' },
          { key: 'tageskurs', label: 'Tageskurs (wöchentlich)' },
          { key: 'intensivkurs', label: 'Intensivkurs' },
          { key: 'pausieren', label: 'Pausieren / Unterbrechen' },
        ],
      },
      { key: 'custom', label: 'Individuell', overline: 'Besondere Fragen' },
    ],
  },

  /**
   * Product shortcode or reference (for URL param).
   */
  productRef: {
    type: String,
  },

  /**
   * Domain code for GraphQL (for URL param).
   * Example: 'dasei1'
   */
  domainCode: {
    type: String,
  },

  /**
   * Consultation type for CO routing.
   * Example: 'event_inquiry', 'purchase_consultation', 'newsletter_subscription'
   */
  consultationType: {
    type: String,
  },

  /**
   * Label for the primary CTA button.
   *
   * @default 'Beratung starten'
   */
  ctaLabel: {
    type: String,
    default: 'Beratung starten',
  },

  /**
   * Hint text when no category is selected.
   *
   * @default 'Bitte wählen Sie mindestens einen Beratungsbereich aus.'
   */
  hintNoSelection: {
    type: String,
    default: 'Bitte wählen Sie mindestens einen Beratungsbereich aus.',
  },

  /**
   * Phone number for the call CTA.
   * If provided, shows the call button.
   */
  callPhone: {
    type: String,
  },

  /**
   * Label for the call CTA button.
   *
   * @default 'Beratung per Videocall (oder Telefon)'
   */
  callLabel: {
    type: String,
    default: 'Beratung per Videocall (oder Telefon)',
  },

  /**
   * Email address for the email CTA.
   * If provided, shows the email button.
   */
  email: {
    type: String,
  },

  /**
   * Label for the email CTA button.
   *
   * @default 'per Email klären'
   */
  emailLabel: {
    type: String,
    default: 'per Email klären',
  },

  /**
   * Label for the "from" field in email form.
   *
   * @default 'Deine Email-Adresse'
   */
  emailFromLabel: {
    type: String,
    default: 'Deine Email-Adresse',
  },

  /**
   * Placeholder for the "from" field in email form.
   *
   * @default 'name@example.com'
   */
  emailFromPlaceholder: {
    type: String,
    default: 'name@example.com',
  },

  /**
   * Label for the send button.
   *
   * @default 'Absenden'
   */
  sendLabel: {
    type: String,
    default: 'Absenden',
  },

  /**
   * Label for the send button while sending.
   *
   * @default 'Wird gesendet...'
   */
  sendingLabel: {
    type: String,
    default: 'Wird gesendet...',
  },

  /**
   * Label for the cancel button.
   *
   * @default 'Abbrechen'
   */
  cancelLabel: {
    type: String,
    default: 'Abbrechen',
  },

  /**
   * Success message after email is sent.
   *
   * @default 'Vielen Dank! Wir melden uns bei dir.'
   * @deprecated Use `success.email` instead
   */
  successMessage: {
    type: String,
    default: 'Vielen Dank! Wir melden uns bei dir.',
  },

  /**
   * Success messages for different lanes.
   * - success.email: shown after email form submission
   * - success.call: shown after call CTA click (if applicable)
   */
  success: {
    type: Object as PropType<{ email?: string; call?: string }>,
    default: () => ({}),
  },

  /**
   * Base URL for the beratung page.
   *
   * @default '/beratung'
   */
  beratungUrl: {
    type: String,
    default: '/beratung',
  },

  /**
   * If true, navigates to beratung page on CTA click.
   * If false, only emits event (for custom handling).
   *
   * @default true
   */
  navigateOnCta: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  'start-beratung': [{
    selections: Array<{
      category: string
      options?: string[]
      text?: string
    }>
    productRef?: string
  }]
  'send-email': [{
    firstName: string
    lastName: string
    from: string
    to: string
    selections: Array<{
      category: string
      options?: string[]
      text?: string
    }>
    productRef?: string
    domainCode?: string
  }]
}>()

const router = useRouter()

// Optional PageBottom context - provides enhanced behavior when inside PageBottom
const pageBottomContext = inject<PageBottomContext | undefined>(pageBottomContextKey, undefined)

// Email form state
const showEmailForm = ref(false)
const firstName = ref('')
const lastName = ref('')
const emailFrom = ref('')
const sendingEmail = ref(false)
const emailSent = ref(false)
const emailError = ref<string | null>(null)
const partialSuccessInfo = ref<{ skippedLabels: string[] } | null>(null)

// Normalize YAML options: convert strings and {label, url} objects to {key, label, url?} format
const normalizeOption = (opt: string | { label: string; url?: string }, index: number): CategoryOption => {
  if (typeof opt === 'string') {
    return { key: `opt_${index}`, label: opt }
  }
  return { key: `opt_${index}`, label: opt.label, url: opt.url }
}

// Normalized categories with properly formatted options
const normalizedCategories = computed(() => {
  return props.categories.map(cat => ({
    ...cat,
    options: cat.options?.map((opt, i) => normalizeOption(opt as any, i)) || []
  }))
})

// Variant for category items (email-only maps to default)
const categoryVariant = computed(() => {
  return props.variant === 'email-only' ? 'default' : props.variant
})

// Computed overline: use overline prop, or generate from pageTitle
const computedOverline = computed(() => {
  if (props.overline) return props.overline
  if (props.pageTitle) {
    // Use "mit" for contact type, "zu" for others
    const preposition = props.consultationType === 'contact_inquiry' ? 'mit' : 'zu'
    return `Beratung ${preposition}: ${props.pageTitle}`
  }
  return null
})

// Check if any category above the given index is selected (for dotted line logic)
const hasActiveAbove = (index: number): boolean => {
  const categories = props.categories.slice(0, index)
  return categories.some(cat => selectedCategories[cat.key])
}

// Reactive state for selected categories (checkboxes)
const selectedCategories = reactive<Record<string, boolean>>(
  Object.fromEntries(props.categories.map(c => [c.key, false]))
)

// Effective domainCode: pick from first selected category with domainCode, or use prop default
const effectiveDomainCode = computed(() => {
  // Find first selected category that has a domainCode
  const selectedWithDomain = props.categories.find(
    cat => selectedCategories[cat.key] && cat.domainCode
  )
  return selectedWithDomain?.domainCode || props.domainCode
})

// Reactive state for freeform texts
const freeformTexts = reactive<Record<string, string>>(
  Object.fromEntries(props.categories.map(c => [c.key, '']))
)

// Reactive state for selected options per category
const selectedOptions = reactive<Record<string, string[]>>(
  Object.fromEntries(props.categories.map(c => [c.key, []]))
)

// Check if at least one category is selected
const hasSelection = computed(() => {
  return Object.values(selectedCategories).some(v => v)
})

// Visual state for CTA active styling (separate from hasSelection for transition timing)
const ctaVisualActive = ref(false)

// Watch hasSelection for staggered transitions
watch(hasSelection, (isActive) => {
  if (isActive) {
    // Entering active: CTA lights up first, then category expands after 300ms
    ctaVisualActive.value = true
    
    // Extended: notify PageBottom of interaction mode
    if (pageBottomContext) {
      pageBottomContext.setInteraction(true)
      
      // Wait for category expand transition, then scroll to anchor
      setTimeout(() => {
        const anchor = document.getElementById(pageBottomContext.anchor)
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 350) // Slightly longer than 300ms expansion delay
    }
  } else {
    // Entering inactive: category collapses immediately, CTA dims after 300ms
    setTimeout(() => {
      ctaVisualActive.value = false
    }, 300)
    
    // Extended: notify PageBottom to exit interaction mode
    if (pageBottomContext) {
      pageBottomContext.setInteraction(false)
    }
  }
})

// Final success message: prefer YAML success.email, fallback to successMessage prop
// If partial success, append skipped category info
const finalSuccessMessage = computed(() => {
  const base = props.success?.email || props.successMessage
  if (partialSuccessInfo.value?.skippedLabels.length) {
    const skipped = partialSuccessInfo.value.skippedLabels.join(', ')
    return `${base} (Nicht gesendet: ${skipped} — bitte separat anfragen)`
  }
  return base
})

// Get selected category keys
const getSelectedKeys = (): string[] => {
  return Object.entries(selectedCategories)
    .filter(([_, selected]) => selected)
    .map(([key]) => key)
}

// Get non-empty freeform texts
const getNonEmptyFreeformText = (): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(freeformTexts).filter(([_, text]) => text.trim().length > 0)
  )
}

// Build selections array for the new schema
const buildSelections = () => {
  const categories = getSelectedKeys()
  return categories.map(cat => {
    // Find the category config to get label/overline
    const catConfig = props.categories.find(c => c.key === cat)
    const normalizedCat = normalizedCategories.value.find(c => c.key === cat)
    
    // Map option keys back to labels
    const selectedKeys = selectedOptions[cat] || []
    const optionLabels = selectedKeys.map(optKey => {
      const opt = normalizedCat?.options?.find(o => o.key === optKey)
      return opt?.label || optKey
    })
    
    return {
      category: cat,
      label: catConfig?.label,
      overline: catConfig?.overline,
      options: optionLabels.length > 0 ? optionLabels : undefined,
      text: freeformTexts[cat]?.trim() || undefined,
    }
  })
}

const handleStartBeratung = () => {
  const selections = buildSelections()

  // Emit event for parent handling
  emit('start-beratung', {
    selections,
    productRef: props.productRef,
  })

  // Navigate if enabled
  if (props.navigateOnCta) {
    const params = new URLSearchParams()
    
    if (selections.length > 0) {
      // Pass selections as JSON for the stepper to parse
      params.set('selections', encodeURIComponent(JSON.stringify(selections)))
    }
    
    if (props.productRef) {
      params.set('product', props.productRef)
    }
    
    // Use effectiveDomainCode (category override or prop fallback)
    if (effectiveDomainCode.value) {
      params.set('domain', effectiveDomainCode.value)
    }
    
    // Pass page title for /beratung heading
    if (props.pageTitle) {
      params.set('title', props.pageTitle)
    }
    
    // Pass navigation highlight path
    if (props.navHighlight) {
      params.set('navHighlight', props.navHighlight)
    }

    const query = params.toString()
    const url = query ? `${props.beratungUrl}?${query}` : props.beratungUrl
    
    router.push(url)
  }
}

const handleSendEmail = async () => {
  if (!firstName.value || !lastName.value || !emailFrom.value || !effectiveDomainCode.value) return
  
  sendingEmail.value = true
  emailError.value = null
  partialSuccessInfo.value = null
  
  const allSelections = buildSelections()
  
  // Filter selections to only include categories matching effectiveDomainCode
  // Categories without domainCode are always included
  const selectionsToSend = allSelections.filter(sel => {
    const catConfig = props.categories.find(c => c.key === sel.category)
    return !catConfig?.domainCode || catConfig.domainCode === effectiveDomainCode.value
  })
  
  // Track skipped categories (different domainCode)
  const skippedSelections = allSelections.filter(sel => {
    const catConfig = props.categories.find(c => c.key === sel.category)
    return catConfig?.domainCode && catConfig.domainCode !== effectiveDomainCode.value
  })

  try {
    // Call GraphQL mutation with filtered selections
    const result = await createEmailInquiry({
      contact: {
        vorname: firstName.value,
        nachname: lastName.value,
        email: emailFrom.value,
      },
      selections: selectionsToSend,
      domainCode: effectiveDomainCode.value,
      productSlug: props.productRef,
    })

    if (!result.success) {
      console.error('Email inquiry failed:', result.error)
      emailError.value = result.error || 'Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut.'
      return
    }

    // Set partial success info if any categories were skipped
    if (skippedSelections.length > 0) {
      partialSuccessInfo.value = {
        skippedLabels: skippedSelections.map(s => s.label || s.category)
      }
    }

    // Emit event for any parent listeners (backwards compat)
    emit('send-email', {
      firstName: firstName.value,
      lastName: lastName.value,
      from: emailFrom.value,
      to: props.email || '',
      selections: selectionsToSend,
      productRef: props.productRef,
      domainCode: effectiveDomainCode.value,
    })

    showEmailForm.value = false
    emailSent.value = true
    firstName.value = ''
    lastName.value = ''
    emailFrom.value = ''
  } catch (err) {
    console.error('Email inquiry error:', err)
    emailError.value = 'Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut.'
  } finally {
    sendingEmail.value = false
  }
}
</script>

<style scoped>
.consulting-dialog {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* When activated, ensure enough height for scroll-to-anchor to work */
.consulting-dialog.has-active {
  min-height: 100vh;
}

.consulting-dialog-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.consulting-dialog-overline {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(from var(--color-contrast) l c h / 60%);
}

.consulting-dialog-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-contrast);
}

.consulting-dialog-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: oklch(from var(--color-contrast) l c h / 80%);
}

.consulting-dialog-categories {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.consulting-dialog-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.consulting-dialog-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 12rem;
  padding: 0.875rem 2rem;
  background-color: var(--color-muted);
  color: oklch(from var(--color-contrast) l c h / 40%);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: not-allowed;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.15s ease;
}

.consulting-dialog-cta:focus {
  outline: none;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
}

.consulting-dialog-cta-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.consulting-dialog-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Inactive state: both buttons grey with light text */
.consulting-dialog-cta--book,
.consulting-dialog-cta--email {
  background-color: var(--color-muted);
  color: oklch(from var(--color-contrast) l c h / 40%);
}

/* Active state: book button gets primary color */
.consulting-dialog-cta-row.is-active .consulting-dialog-cta--book {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  cursor: pointer;
}

.consulting-dialog-cta-row.is-active .consulting-dialog-cta--book:hover {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

/* Active state: email button gets muted background with full contrast text */
.consulting-dialog-cta-row.is-active .consulting-dialog-cta--email {
  background-color: var(--color-muted);
  color: var(--color-contrast);
  cursor: pointer;
}

.consulting-dialog-cta-row.is-active .consulting-dialog-cta--email:hover {
  background-color: oklch(from var(--color-muted) calc(l - 0.05) c h);
}

/* Email-only mode: email button becomes primary (no book button present) */
.consulting-dialog-cta-row.is-active.email-only .consulting-dialog-cta--email,
.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta-row.email-only .consulting-dialog-cta--email {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.consulting-dialog-cta-row.is-active.email-only .consulting-dialog-cta--email:hover,
.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta-row.email-only .consulting-dialog-cta--email:hover {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

.consulting-dialog-cta--send {
  flex: 1;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  cursor: pointer;
}

.consulting-dialog-cta--send:hover:not(:disabled) {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

.consulting-dialog-cta--send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Email form */
.consulting-dialog-email-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 24rem;
}

.consulting-dialog-email-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.consulting-dialog-email-name-row {
  display: flex;
  gap: 0.75rem;
}

.consulting-dialog-email-field--half {
  flex: 1;
  min-width: 0;
}

.consulting-dialog-email-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-contrast);
}

.consulting-dialog-email-input {
  display: block;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 0.125rem);
  font-size: 1rem;
  color: var(--color-contrast);
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.consulting-dialog-email-input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
  outline: none;
}

.consulting-dialog-email-input::placeholder {
  color: oklch(from var(--color-contrast) l c h / 40%);
}

.consulting-dialog-email-actions {
  display: flex;
  gap: 0.75rem;
}

.consulting-dialog-cancel {
  padding: 0.875rem 1.5rem;
  background: none;
  border: 1px solid var(--color-input);
  border-radius: 0.375rem;
  font-size: 1rem;
  color: var(--color-contrast);
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color, border-color;
}

.consulting-dialog-cancel:hover {
  background-color: var(--color-muted);
  border-color: var(--color-border);
}

/* Success state */
.consulting-dialog-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: oklch(from var(--color-primary-bg) l c h / 10%);
  border-radius: 0.375rem;
}

.consulting-dialog-success-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  color: var(--color-primary-bg);
}

.consulting-dialog-success-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-contrast);
}

/* Error state */
.consulting-dialog-error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: oklch(0.95 0.03 25);
  border: 1px solid oklch(0.7 0.15 25);
  border-radius: 0.375rem;
}

.consulting-dialog-error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: oklch(0.5 0.2 25);
}

.consulting-dialog-error-text {
  font-size: 0.875rem;
  line-height: 1.4;
  color: oklch(0.35 0.15 25);
}

@media (max-width: 767px) {
  .consulting-dialog-title {
    font-size: 1.25rem;
  }

  .consulting-dialog-cta {
    width: 100%;
  }

  .consulting-dialog-cta-row {
    flex-direction: column;
    width: 100%;
  }

  .consulting-dialog-email-form {
    max-width: none;
  }

  .consulting-dialog-email-actions {
    flex-direction: column;
  }

  .consulting-dialog-cancel {
    width: 100%;
  }
}

/* ========================================
   FANCY MODE: Rail + Visual Connectors
   ======================================== */

/* Rail width and positioning constants */
.consulting-dialog--fancy {
  --rail-width: 0.125rem;
  --rail-line-width: 2px;
  --rail-offset: 0;
}

.consulting-dialog-body {
  display: flex;
  position: relative;
}

.consulting-dialog-rail {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 50%;
  width: var(--rail-line-width);
  display: flex;
  justify-content: center;
}

.consulting-dialog-rail-line {
  width: var(--rail-line-width);
  height: 100%;
  background: transparent;
  transition: background 0.3s ease;
}

/* When any category is active, show dotted line */
.consulting-dialog--fancy.has-active .consulting-dialog-rail-line {
  background: repeating-linear-gradient(
    to bottom,
    var(--color-primary-bg) 0,
    var(--color-primary-bg) 4px,
    transparent 4px,
    transparent 8px
  );
}

.consulting-dialog-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* No extra margin in fancy mode - align with title */
.consulting-dialog--fancy .consulting-dialog-main {
  margin-left: 0;
}

/* Categories wrapper in fancy mode */
.consulting-dialog--fancy .consulting-dialog-categories {
  position: relative;
}

/* Individual category wrapper for expansion effect */
.consulting-dialog-category-wrapper {
  position: relative;
  transition: margin-left 150ms ease-out, padding-left 150ms ease-out;
}

/* Collapsed categories in fancy mode: indent to align chevrons with expanded */
.consulting-dialog--fancy .consulting-dialog-category-wrapper {
  margin-left: 1rem;
}

/* Active/expanded categories: no indent, align with title */
.consulting-dialog--fancy .consulting-dialog-category-wrapper.is-expanded {
  margin-left: 0;
}

/* Categories with active above but NOT expanded: show continuation line */
.consulting-dialog--fancy .consulting-dialog-category-wrapper.has-active-above:not(.is-expanded)::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 0;
  bottom: 0;
  width: var(--rail-line-width);
  background: repeating-linear-gradient(
    to bottom,
    var(--color-primary-bg) 0,
    var(--color-primary-bg) 4px,
    transparent 4px,
    transparent 8px
  );
}

/* CTA wrapper for connector */
.consulting-dialog-cta-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Simple arrow text */
.consulting-dialog-cta-arrow {
  font-family: monospace;
  font-size: 1rem;
  font-weight: 900;
  color: var(--color-primary-bg);
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

/* Show arrow when active */
.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta-arrow {
  opacity: 1;
}

/* Active state for CTA wrapper */
.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta--book {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  cursor: pointer;
}

.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta--book:hover {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta--email {
  background-color: var(--color-muted);
  color: var(--color-contrast);
  cursor: pointer;
}

.consulting-dialog-cta-wrapper.is-active .consulting-dialog-cta--email:hover {
  background-color: oklch(from var(--color-muted) calc(l - 0.05) c h);
}

/* No extra shift for CTA in fancy mode */
.consulting-dialog--fancy .consulting-dialog-cta-wrapper {
  /* Align with content */
}

/* Mobile: disable fancy effects */
@media (max-width: 767px) {
  .consulting-dialog-rail {
    display: none;
  }

  .consulting-dialog--fancy .consulting-dialog-category-wrapper {
    margin-left: 0;
  }

  .consulting-dialog--fancy .consulting-dialog-category-wrapper.has-active-above::before {
    display: none;
  }

  .consulting-dialog-cta-arrow {
    display: none;
  }
}
</style>
