<template>
  <div class="catalog-radio" :class="{ 'catalog-radio--has-error': error }">
    <label
      v-for="(choice, i) of choices"
      :key="choice.value"
      :for="`${computedId}-${i + 1}`"
      class="catalog-radio__item"
      :class="{ 'catalog-radio__item--selected': choice.value === modelValue }"
    >
      <input
        :checked="choice.value === modelValue"
        :disabled="disabled"
        :id="`${computedId}-${i + 1}`"
        :name="name"
        :value="choice.value"
        @input="$emit('update:modelValue', choice.value)"
        type="radio"
        class="catalog-radio__input"
      />
      <span class="catalog-radio__control"></span>
      <span class="catalog-radio__label">{{ choice.label }}</span>
      <span class="catalog-radio__leader"></span>
      <span v-if="choice.meta" class="catalog-radio__meta">{{ choice.meta }}</span>
    </label>

    <p v-if="error" class="catalog-radio__error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { onMounted, ref, watch, type PropType } from 'vue'

export interface CatalogRadioChoice {
  /** Unique value for the choice */
  value: string
  /** Main label (left side) */
  label: string
  /** Optional meta text (right side, after dotted line) */
  meta?: string
}

const props = defineProps({
  /**
   * The currently selected value.
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * The choices for the radio group.
   * Each choice has: value, label, and optional meta (right side text).
   */
  choices: {
    type: Array as PropType<CatalogRadioChoice[]>,
    required: true,
  },

  /**
   * The `name` attribute used to identify the radio group when submitting the form.
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * Unique identifier for the component.
   * If not provided, a random ID will be generated.
   */
  id: {
    type: String,
  },

  /**
   * Indicates whether the radio group is disabled.
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * The error message to display.
   */
  error: {
    type: String,
  },
})

defineEmits<{
  'update:modelValue': [string]
}>()

const computedId = ref(props.id)

onMounted(() => {
  watch(
    computedId,
    (id) => {
      if (!id) {
        computedId.value = nanoid()
      }
    },
    { immediate: true },
  )
})
</script>

<style scoped>
.catalog-radio {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* More spacing for mobile */
}

.catalog-radio__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  padding: 0.25rem 0;
  transition: color 0.15s ease;
}

.catalog-radio__item:hover {
  color: var(--color-primary);
}

.catalog-radio__item--selected {
  color: var(--color-primary);
}

.catalog-radio__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.catalog-radio__control {
  flex-shrink: 0;
  position: relative;
  width: 0.875rem;
  height: 0.875rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-input);
  border-radius: 50%;
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.catalog-radio__control::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  right: 0.125rem;
  bottom: 0.125rem;
  left: 0.125rem;
  background-color: var(--color-ring);
  border-radius: 50%;
  transition: var(--transition);
  transition-property: transform;
  transform: scale(0);
}

.catalog-radio__input:checked + .catalog-radio__control::after {
  transform: scale(1);
}

.catalog-radio__input:focus + .catalog-radio__control {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
  outline: none;
}

.catalog-radio__input:disabled + .catalog-radio__control {
  box-shadow: none;
  opacity: 0.5;
}

.catalog-radio--has-error .catalog-radio__control {
  --color-ring: var(--color-negative-base);
  border-color: var(--color-negative-base);
}

.catalog-radio__label {
  flex-shrink: 0;
}

.catalog-radio__leader {
  flex: 1;
  min-width: 1rem;
  height: 2px;
  margin: 0 0.5rem;
  background: repeating-linear-gradient(
    to right,
    var(--color-contrast) 0,
    var(--color-contrast) 2px,
    transparent 2px,
    transparent 6px
  );
}

.catalog-radio__meta {
  flex-shrink: 0;
  color: var(--color-muted-contrast);
}

.catalog-radio__item--selected .catalog-radio__meta {
  color: var(--color-primary);
}

.catalog-radio__error {
  font-size: 0.875em;
  color: var(--color-negative-base);
  font-weight: 500;
}

/* More spacing on mobile */
@media (max-width: 767px) {
  .catalog-radio {
    gap: 1rem;
  }
  
  .catalog-radio__item {
    padding: 0.5rem 0;
  }
}
</style>
