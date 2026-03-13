<template>
  <div class="consulting-dialog">
    <div class="consulting-dialog-header">
      <span v-if="overline" class="consulting-dialog-overline">{{ overline }}</span>
      <h2 class="consulting-dialog-title">{{ title }}</h2>
      <p v-if="description" class="consulting-dialog-description">{{ description }}</p>
    </div>

    <div class="consulting-dialog-categories">
      <ConsultingCategoryItem
        v-for="category in normalizedCategories"
        :key="category.key"
        :name="category.key"
        :title="category.label"
        :overline="category.overline"
        :options="category.options"
        :option-type="category.optionType || 'checkbox'"
        :input-label="category.inputLabel || 'Deine Frage oder Anmerkung'"
        :input-placeholder="category.inputPlaceholder || 'Optional: Beschreibe Dein Anliegen...'"
        :variant="variant"
        v-model="selectedCategories[category.key]"
        v-model:freeform-text="freeformTexts[category.key]"
        v-model:selected-options="selectedOptions[category.key]"
      >
        <template v-if="category.teaser">
          {{ category.teaser }}
        </template>
      </ConsultingCategoryItem>
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
        <div class="consulting-dialog-cta-row">
          <a
            v-if="callPhone && variant !== 'email-only'"
            :href="`tel:${callPhone}`"
            class="consulting-dialog-cta consulting-dialog-cta--call"
          >
            <svg class="consulting-dialog-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ callLabel }}
          </a>
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

        <p v-if="!hasSelection" class="consulting-dialog-hint">
          {{ hintNoSelection }}
        </p>
      </template>

      <!-- Inline email form -->
      <template v-else>
        <form class="consulting-dialog-email-form" @submit.prevent="handleSendEmail">
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
          <div class="consulting-dialog-email-actions">
            <button
              type="submit"
              :disabled="!emailFrom || sendingEmail"
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
              @click="showEmailForm = false; emailFrom = ''"
              class="consulting-dialog-cancel"
            >
              {{ cancelLabel }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { ConsultingCategoryItem } from '@crearis/ui'

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
   * @default 'Anrufen'
   */
  callLabel: {
    type: String,
    default: 'Anrufen',
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
   * @default 'Email schreiben'
   */
  emailLabel: {
    type: String,
    default: 'Email schreiben',
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
    from: string
    to: string
    selections: Array<{
      category: string
      options?: string[]
      text?: string
    }>
    productRef?: string
  }]
}>()

const router = useRouter()

// Email form state
const showEmailForm = ref(false)
const emailFrom = ref('')
const sendingEmail = ref(false)
const emailSent = ref(false)

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

// Reactive state for selected categories (checkboxes)
const selectedCategories = reactive<Record<string, boolean>>(
  Object.fromEntries(props.categories.map(c => [c.key, false]))
)

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

// Final success message: prefer YAML success.email, fallback to successMessage prop
const finalSuccessMessage = computed(() => {
  return props.success?.email || props.successMessage
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
  return categories.map(cat => ({
    category: cat,
    options: selectedOptions[cat]?.length > 0 ? selectedOptions[cat] : undefined,
    text: freeformTexts[cat]?.trim() || undefined,
  }))
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
    
    if (props.domainCode) {
      params.set('domain', props.domainCode)
    }

    const query = params.toString()
    const url = query ? `${props.beratungUrl}?${query}` : props.beratungUrl
    
    router.push(url)
  }
}

const handleSendEmail = async () => {
  if (!emailFrom.value || !props.email) return
  
  sendingEmail.value = true
  const selections = buildSelections()

  // Emit event for parent handling (actual email sending happens there)
  emit('send-email', {
    from: emailFrom.value,
    to: props.email,
    selections,
    productRef: props.productRef,
  })

  // Simulate brief delay for UX
  await new Promise(resolve => setTimeout(resolve, 500))

  sendingEmail.value = false
  showEmailForm.value = false
  emailSent.value = true
  emailFrom.value = ''
}
</script>

<style scoped>
.consulting-dialog {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  gap: 0.75rem;
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
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
  transition-property: background-color, box-shadow, opacity;
}

.consulting-dialog-cta:hover:not(:disabled) {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

.consulting-dialog-cta:focus {
  outline: none;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
}

.consulting-dialog-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.consulting-dialog-cta--call {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.consulting-dialog-cta--email {
  background-color: var(--color-muted);
  color: var(--color-contrast);
}

.consulting-dialog-cta--email:hover:not(:disabled) {
  background-color: oklch(from var(--color-muted) calc(l - 0.05) c h);
}

.consulting-dialog-cta--send {
  flex: 1;
}

.consulting-dialog-hint {
  margin: 0;
  font-size: 0.875rem;
  color: oklch(from var(--color-contrast) l c h / 60%);
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
</style>
