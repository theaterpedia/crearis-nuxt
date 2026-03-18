<template>
  <details
    :open="isOpen"
    class="consulting-category"
    :class="[
      `consulting-category--${variant}`,
      { 'consulting-category-checked': isOpen }
    ]"
  >
    <summary @click.prevent="handleToggle" class="consulting-category-summary">
      <!-- Default variant: chevron on left -->
      <span v-if="variant === 'default'" class="consulting-category-chevron" :class="{ 'consulting-category-chevron-open': isOpen }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </span>
      
      <!-- Rounded variant: checkbox on left -->
      <span v-if="variant === 'roundedBorders'" class="consulting-category-checkbox">
        <svg
          v-if="isOpen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      
      <div class="consulting-category-header">
        <span v-if="overline" class="consulting-category-overline">{{ overline }}</span>
        <span class="consulting-category-title">{{ title }}</span>
      </div>
      
      <!-- Rounded variant: chevron on right -->
      <span v-if="variant === 'roundedBorders'" class="consulting-category-chevron" :class="{ 'consulting-category-chevron-open': isOpen }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </summary>

    <div class="consulting-category-content-wrapper">
      <div class="consulting-category-content">
        <div v-if="$slots.default" class="consulting-category-teaser">
          <slot />
        </div>

        <div class="consulting-category-content-grid">
        <!-- Options (checkboxes or radios) -->
        <div v-if="options && options.length > 0" class="consulting-category-options">
          <label 
            v-for="opt in options" 
            :key="opt.key" 
            class="consulting-category-option"
          >
            <input
              v-if="optionType === 'radio'"
              type="radio"
              :name="`${name}-options`"
              :value="opt.key"
              :checked="selectedOptions.length === 1 && selectedOptions[0] === opt.key"
              @change="handleRadioChange(opt.key)"
              class="consulting-category-option-input"
            />
            <input
              v-else
              type="checkbox"
              :value="opt.key"
              :checked="selectedOptions.includes(opt.key)"
              @change="handleCheckboxToggle(opt.key)"
              class="consulting-category-option-input"
            />
            <!-- URL-enabled option: render as link -->
            <a
              v-if="opt.url"
              :href="opt.url"
              target="_blank"
              class="consulting-category-option-label consulting-category-option-link"
              @click.stop
            >{{ opt.label }}</a>
            <!-- Plain option: render as span -->
            <span v-else class="consulting-category-option-label">{{ opt.label }}</span>
          </label>
        </div>

        <div class="consulting-category-input">
          <label :for="inputId" class="consulting-category-input-label">{{ inputLabel }}</label>
          <textarea
            :id="inputId"
            :name="`${name}-freeform`"
            :placeholder="inputPlaceholder"
            :value="freeformValue"
            @input="handleFreeformInput"
            class="consulting-category-textarea"
            rows="3"
          />
        </div>
      </div>
    </div>
    </div>
  </details>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { computed, onMounted, ref, watch, type PropType } from 'vue'

export interface CategoryOption {
  key: string
  label: string
  url?: string  // Optional URL for clickable options
}

const props = defineProps({
  /**
   * Visual style variant.
   * - 'default': minimal borders, chevron left, no checkbox
   * - 'roundedBorders': full borders, checkbox left, chevron right
   * @default 'default'
   */
  variant: {
    type: String as PropType<'default' | 'roundedBorders'>,
    default: 'default',
  },

  /**
   * Unique key for this category (e.g., 'prerequisites', 'terms_and_options').
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * Main title displayed in the accordion header.
   */
  title: {
    type: String,
    required: true,
  },

  /**
   * Optional overline text above the title (smaller, muted).
   */
  overline: {
    type: String,
  },

  /**
   * Predefined options within this category.
   */
  options: {
    type: Array as PropType<CategoryOption[]>,
    default: () => [],
  },

  /**
   * How to render options: 'checkbox' (multiple) or 'radio' (single).
   * @default 'checkbox'
   */
  optionType: {
    type: String as PropType<'checkbox' | 'radio'>,
    default: 'checkbox',
  },

  /**
   * Currently selected option keys.
   */
  selectedOptions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  /**
   * Label for the freeform text input.
   *
   * @default 'Ihre Frage oder Anmerkung'
   */
  inputLabel: {
    type: String,
    default: 'Ihre Frage oder Anmerkung',
  },

  /**
   * Placeholder for the freeform text input.
   *
   * @default 'Optional: Beschreiben Sie Ihr Anliegen...'
   */
  inputPlaceholder: {
    type: String,
    default: 'Optional: Beschreiben Sie Ihr Anliegen...',
  },

  /**
   * Whether this category is currently selected/open.
   * Auto-checks when expanded.
   */
  modelValue: {
    type: Boolean,
    default: false,
  },

  /**
   * The freeform text value for this category.
   */
  freeformText: {
    type: String,
    default: '',
  },

  /**
   * Delay in ms before expanding the category after activation.
   * 0 = no delay (immediate expansion)
   * @default 0
   */
  expansionDelay: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update:freeformText': [string]
  'update:selectedOptions': [string[]]
}>()

const inputId = ref(`${props.name}-input`)

onMounted(() => {
  inputId.value = `${props.name}-${nanoid(6)}`
})

// Visual expansion state (may be delayed from modelValue)
const visuallyOpen = ref(props.modelValue)
let expansionTimeout: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (newVal) => {
  // Clear any pending timeout
  if (expansionTimeout) {
    clearTimeout(expansionTimeout)
    expansionTimeout = null
  }

  if (newVal && props.expansionDelay > 0) {
    // Activating with delay: wait before expanding
    expansionTimeout = setTimeout(() => {
      visuallyOpen.value = true
    }, props.expansionDelay)
  } else {
    // Deactivating or no delay: immediate
    visuallyOpen.value = newVal
  }
})

const isOpen = computed(() => visuallyOpen.value)
const freeformValue = computed(() => props.freeformText)

const handleToggle = () => {
  emit('update:modelValue', !props.modelValue)
}

const handleFreeformInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:freeformText', target.value)
}

const handleCheckboxToggle = (optionKey: string) => {
  const current = [...props.selectedOptions]
  const idx = current.indexOf(optionKey)
  if (idx === -1) {
    current.push(optionKey)
  } else {
    current.splice(idx, 1)
  }
  emit('update:selectedOptions', current)
}

const handleRadioChange = (optionKey: string) => {
  emit('update:selectedOptions', [optionKey])
}
</script>

<style scoped>
.consulting-category {
  transition: var(--transition);
  transition-property: border-color, box-shadow;
  background-color: var(--color-bg);
}

/* ========================================
   VARIANT: roundedBorders (original style)
   ======================================== */

.consulting-category--roundedBorders {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.consulting-category--roundedBorders:hover {
  border-color: var(--color-input);
}

.consulting-category--roundedBorders.consulting-category-checked {
  border-color: var(--color-primary-bg);
  box-shadow: 0 0 0 1px var(--color-primary-bg);
}

.consulting-category--roundedBorders .consulting-category-summary {
  padding: 1rem;
}

.consulting-category--roundedBorders .consulting-category-content {
  padding: 0 1rem 1rem;
}

.consulting-category--roundedBorders .consulting-category-checkbox {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-input);
  border-radius: 0.25rem;
  background-color: var(--color-bg);
  transition: var(--transition);
  transition-property: background-color, border-color;
}

.consulting-category--roundedBorders.consulting-category-checked .consulting-category-checkbox {
  background-color: var(--color-primary-bg);
  border-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.consulting-category--roundedBorders .consulting-category-checkbox svg {
  width: 0.875rem;
  height: 0.875rem;
}

.consulting-category--roundedBorders .consulting-category-chevron-open {
  transform: rotate(180deg);
}

/* ========================================
   VARIANT: default (new minimal style)
   ======================================== */

.consulting-category--default {
  border: none;
  border-radius: 0;
}

.consulting-category--default.consulting-category-checked {
  border-left: 4px solid var(--color-primary-bg);
  border-top: 1px solid oklch(from var(--color-contrast) l c h / 20%);
  border-right: 1px solid oklch(from var(--color-contrast) l c h / 20%);
  border-bottom: 1px solid oklch(from var(--color-contrast) l c h / 20%);
}

.consulting-category--default .consulting-category-summary {
  padding: 0.5rem 0;
  gap: 0.5rem;
}

.consulting-category--default.consulting-category-checked .consulting-category-summary {
  padding: 0.75rem 1rem;
}

.consulting-category--default .consulting-category-title {
  color: oklch(from var(--color-contrast) l c h / 60%);
  transition: var(--transition);
  transition-property: color;
}

.consulting-category--default.consulting-category-checked .consulting-category-title {
  color: var(--color-contrast);
}

.consulting-category--default .consulting-category-overline {
  color: oklch(from var(--color-contrast) l c h / 40%);
}

.consulting-category--default.consulting-category-checked .consulting-category-overline {
  color: oklch(from var(--color-contrast) l c h / 60%);
}

.consulting-category--default .consulting-category-chevron {
  transform: rotate(0deg);
}

.consulting-category--default .consulting-category-chevron-open {
  transform: rotate(90deg);
}

.consulting-category--default .consulting-category-content {
  padding: 0 1rem 1rem;
}

/* ========================================
   SHARED STYLES
   ======================================== */

.consulting-category-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.consulting-category-summary::-webkit-details-marker {
  display: none;
}

.consulting-category-header {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.consulting-category-overline {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(from var(--color-contrast) l c h / 60%);
}

.consulting-category-title {
  font-weight: 500;
  color: var(--color-contrast);
}

.consulting-category-chevron {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: oklch(from var(--color-contrast) l c h / 50%);
  transition: var(--transition);
  transition-property: transform, color;
}

.consulting-category-chevron-open {
  color: var(--color-primary-bg);
}

.consulting-category-chevron svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Animated expansion using grid-template-rows trick */
.consulting-category-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 150ms ease-out;
}

.consulting-category-checked .consulting-category-content-wrapper {
  grid-template-rows: 1fr;
}

.consulting-category-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consulting-category-teaser {
  padding: 0.75rem;
  background-color: oklch(from var(--color-muted) l c h / 30%);
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: oklch(from var(--color-contrast) l c h / 80%);
}

.consulting-category-teaser:empty {
  display: none;
}

.consulting-category-content-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consulting-category-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.consulting-category-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.375rem 0;
}

.consulting-category-option-input {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary-bg);
  cursor: pointer;
}

.consulting-category-option-label {
  font-size: 0.9375rem;
  color: var(--color-contrast);
}

.consulting-category-option-link {
  color: var(--color-primary-bg);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.consulting-category-option-link:hover {
  color: var(--color-primary-bg-hover, var(--color-primary-bg));
  text-decoration-thickness: 2px;
}

.consulting-category-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.consulting-category-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-contrast);
}

.consulting-category-textarea {
  display: block;
  width: 100%;
  min-height: 4rem;
  padding: 0.5rem 0.75rem;
  resize: vertical;
  background-color: var(--color-bg);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 0.125rem);
  font-size: 0.9375rem;
  line-height: 1.4;
  color: var(--color-contrast);
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.consulting-category-textarea:focus {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
  outline: none;
}

.consulting-category-textarea::placeholder {
  color: oklch(from var(--color-contrast) l c h / 40%);
}

/* ========================================
   RESPONSIVE: Desktop 2-column layout
   ======================================== */

@media (min-width: 1024px) {
  .consulting-category-content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  /* If no options, let input span full width */
  .consulting-category-content-grid > .consulting-category-input:only-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .consulting-category--roundedBorders .consulting-category-summary {
    padding: 0.875rem;
  }

  .consulting-category--roundedBorders .consulting-category-content {
    padding: 0 0.875rem 0.875rem;
  }
}
</style>
