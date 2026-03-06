<template>
  <div class="consulting-dialog">
    <div class="consulting-dialog-header">
      <span v-if="overline" class="consulting-dialog-overline">{{ overline }}</span>
      <h2 class="consulting-dialog-title">{{ title }}</h2>
      <p v-if="description" class="consulting-dialog-description">{{ description }}</p>
    </div>

    <div class="consulting-dialog-categories">
      <ConsultingCategoryItem
        v-for="category in categories"
        :key="category.key"
        :name="category.key"
        :title="category.label"
        :overline="category.overline"
        :input-label="category.inputLabel || 'Ihre Frage oder Anmerkung'"
        :input-placeholder="category.inputPlaceholder || 'Optional: Beschreiben Sie Ihr Anliegen...'"
        v-model="selectedCategories[category.key]"
        v-model:freeform-text="freeformTexts[category.key]"
      >
        <template v-if="category.teaser">
          {{ category.teaser }}
        </template>
      </ConsultingCategoryItem>
    </div>

    <div class="consulting-dialog-actions">
      <button
        type="button"
        :disabled="!hasSelection"
        @click="handleStartBeratung"
        class="consulting-dialog-cta"
      >
        {{ ctaLabel }}
      </button>
      
      <p v-if="!hasSelection" class="consulting-dialog-hint">
        {{ hintNoSelection }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { ConsultingCategoryItem } from '@crearis/ui'

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
}

const props = defineProps({
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
      { key: 'schedules', label: 'Verläufe', overline: 'Termine & Zeitplanung' },
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
    categories: string[]
    freeformText: Record<string, string>
    productRef?: string
  }]
}>()

const router = useRouter()

// Reactive state for selected categories (checkboxes)
const selectedCategories = reactive<Record<string, boolean>>(
  Object.fromEntries(props.categories.map(c => [c.key, false]))
)

// Reactive state for freeform texts
const freeformTexts = reactive<Record<string, string>>(
  Object.fromEntries(props.categories.map(c => [c.key, '']))
)

// Check if at least one category is selected
const hasSelection = computed(() => {
  return Object.values(selectedCategories).some(v => v)
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

const handleStartBeratung = () => {
  const categories = getSelectedKeys()
  const freeformText = getNonEmptyFreeformText()

  // Emit event for parent handling
  emit('start-beratung', {
    categories,
    freeformText,
    productRef: props.productRef,
  })

  // Navigate if enabled
  if (props.navigateOnCta) {
    const params = new URLSearchParams()
    
    if (categories.length > 0) {
      params.set('categories', categories.join(','))
    }
    
    if (props.productRef) {
      params.set('product', props.productRef)
    }
    
    // Encode freeform text as JSON if not empty
    if (Object.keys(freeformText).length > 0) {
      params.set('notes', encodeURIComponent(JSON.stringify(freeformText)))
    }

    const query = params.toString()
    const url = query ? `${props.beratungUrl}?${query}` : props.beratungUrl
    
    router.push(url)
  }
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
  min-width: 12rem;
  padding: 0.875rem 2rem;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
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

.consulting-dialog-hint {
  margin: 0;
  font-size: 0.875rem;
  color: oklch(from var(--color-contrast) l c h / 60%);
}

@media (max-width: 767px) {
  .consulting-dialog-title {
    font-size: 1.25rem;
  }

  .consulting-dialog-cta {
    width: 100%;
  }
}
</style>
