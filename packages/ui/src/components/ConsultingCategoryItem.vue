<template>
  <details
    :open="isOpen"
    class="consulting-category"
    :class="{ 'consulting-category-checked': isOpen }"
  >
    <summary @click.prevent="handleToggle" class="consulting-category-summary">
      <span class="consulting-category-checkbox">
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
      <span class="consulting-category-chevron" :class="{ 'consulting-category-chevron-open': isOpen }">
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

    <div class="consulting-category-content">
      <div v-if="$slots.default" class="consulting-category-teaser">
        <slot />
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
  </details>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
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
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update:freeformText': [string]
}>()

const inputId = ref(`${props.name}-input`)

onMounted(() => {
  inputId.value = `${props.name}-${nanoid(6)}`
})

const isOpen = computed(() => props.modelValue)
const freeformValue = computed(() => props.freeformText)

const handleToggle = () => {
  emit('update:modelValue', !props.modelValue)
}

const handleFreeformInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:freeformText', target.value)
}
</script>

<style scoped>
.consulting-category {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  transition: var(--transition);
  transition-property: border-color, box-shadow;
  background-color: var(--color-bg);
}

.consulting-category:hover {
  border-color: var(--color-input);
}

.consulting-category-checked {
  border-color: var(--color-primary-bg);
  box-shadow: 0 0 0 1px var(--color-primary-bg);
}

.consulting-category-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.consulting-category-summary::-webkit-details-marker {
  display: none;
}

.consulting-category-checkbox {
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

.consulting-category-checked .consulting-category-checkbox {
  background-color: var(--color-primary-bg);
  border-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.consulting-category-checkbox svg {
  width: 0.875rem;
  height: 0.875rem;
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
  transform: rotate(180deg);
  color: var(--color-primary-bg);
}

.consulting-category-chevron svg {
  width: 1.25rem;
  height: 1.25rem;
}

.consulting-category-content {
  padding: 0 1rem 1rem;
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

@media (max-width: 767px) {
  .consulting-category-summary {
    padding: 0.875rem;
  }

  .consulting-category-content {
    padding: 0 0.875rem 0.875rem;
  }
}
</style>
