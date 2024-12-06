<template>
  <div
    class="radio-group"
    :class="{
      'radio-group-has-error': error,
    }"
  >
    <label v-for="({ value, label }, i) of choices" :for="`${computedId}-${i + 1}`" class="radio-group-label">
      <input
        :checked="value === modelValue"
        :disabled="disabled"
        :id="`${computedId}-${i + 1}`"
        :name="name"
        :value="value"
        @input="$emit('update:modelValue', value)"
        type="radio"
      />
      <span class="radio-group-control"></span>
      <span>{{ label }}</span>
    </label>

    <p v-if="error" class="radio-group-error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { onMounted, ref, watch, type PropType } from 'vue'

const props = defineProps({
  /**
   * The value of the radio group.
   *
   * @default ''
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * The choices for the radio group.
   */
  choices: {
    type: Array as PropType<{ value: string; label: string }[]>,
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
   * Defines a unique identifier (ID) which must be unique in the whole document.
   * Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).
   * If not provided, a random ID will be generated.
   *
   * Each radio button will have an ID of the form `[id]-[index]`.
   */
  id: {
    type: String,
  },

  /**
   * Indicates whether the radio group is disabled.
   *
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * The error message to display.
   * If defined, the radio group will be styled as an error.
   *
   * @default undefined
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
.radio-group {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding-left: 1.75rem; /* 28px */
}

.radio-group-label {
  display: flex;
  gap: 0.625rem;
}

.radio-group input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.radio-group-control {
  flex-shrink: 0;
  position: relative;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.125rem;
  background-color: oklch(var(--color-base));
  border: 1px solid oklch(var(--color-input));
  border-radius: 50%;
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.radio-group-control::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  right: 0.125rem;
  bottom: 0.125rem;
  left: 0.125rem;
  background-color: oklch(var(--color-ring));
  border-radius: 50%;
  transition: var(--transition);
  transition-property: transform;
  transform: scale(0);
}

input:checked + .radio-group-control::after {
  transform: scale(1);
}

.radio-group-has-error .radio-group-control {
  --color-ring: var(--color-negative-base);
  border-color: oklch(var(--color-negative-base));
}

input:focus + .radio-group-control {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem oklch(var(--color-ring));
  outline: none;
}

input:disabled + .radio-group-control {
  box-shadow: none;
  opacity: 0.5;
}

.radio-group-error {
  margin-left: 1.5rem;
  font-size: 0.875em;
  color: oklch(var(--color-negative-base));
  font-weight: 500;
}
</style>
