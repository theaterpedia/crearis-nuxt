<template>
  <div
    class="input"
    :class="{
      'input-required': required,
      'input-has-error': error,
    }"
  >
    <div class="input-label">
      <label :for="computedId">{{ label }}</label>
    </div>

    <div class="input-group">
      <input
        :autocomplete="autocomplete"
        :disabled="disabled"
        :id="computedId"
        :name="name"
        :placeholder="placeholder"
        :spellcheck="spellcheck"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="input-control"
      />

      <p v-if="error" class="input-error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  /**
   * The value of the input.
   *
   * @default ''
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * The `name` attribute used to identify the input when submitting the form.
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * The label for the input.
   */
  label: {
    type: String,
    required: true,
  },

  /**
   * The type of the input.
   *
   * @default 'text'
   */
  type: {
    type: String,
    default: 'text',
  },

  /**
   * Defines a unique identifier (ID) which must be unique in the whole document.
   * Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).
   * If not provided, a random ID will be generated.
   */
  id: {
    type: String,
  },

  /**
   * A hint to the user of what can be entered in the input.
   *
   * @default undefined
   */
  placeholder: {
    type: String,
  },

  /**
   * Indicates whether the label is required.
   * If `true`, an asterisk is displayed next to the label.
   *
   * @default false
   */
  required: {
    type: Boolean,
    default: false,
  },

  /**
   * Indicates whether the input is disabled.
   *
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Indicates whether the input should have its spelling and grammar checked.
   *
   * @default false
   */
  spellcheck: {
    type: Boolean,
    default: false,
  },

  /**
   * Indicates whether the input should have autocomplete enabled.
   *
   * @default undefined
   */
  autocomplete: {
    type: String,
  },

  /**
   * The error message to display.
   * If defined, the input will be styled as an error.
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
.input {
  display: flex;
  gap: 1rem;
  padding-left: 1.75rem; /* 28px */
}

.input-label {
  width: 100%;
  max-width: 8rem;
  padding-top: 0.5em;
}

.input-required .input-label label::after {
  content: '*';
  margin-left: 0.25em;
  color: var(--color-negative-base);
}

.input-group {
  width: 100%;
  max-width: 22.5rem; /* 360px */
}

.input-control {
  width: 100%;
  height: 2em;
  padding: 0 0.5em;
  overflow: hidden;
  background-color: var(--color-base);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 0.125rem);
  font-size: 1em;
  line-height: 1.25;
  color: var(--color-contrast);
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.input-has-error .input-control {
  --color-ring: var(--color-negative-base);
  border-color: var(--color-negative-base);
}

.input-control:focus {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
  outline: none;
}

.input-control:disabled {
  box-shadow: none;
  opacity: 0.5;
}

.input-control::placeholder {
  color: oklch(from var(--color-contrast) l c h / 40%);
}

.input-error {
  margin-top: 0.375rem;
  font-size: 0.875em;
  color: var(--color-negative-base);
  font-weight: 500;
}

@media (max-width: 767px) {
  .input {
    flex-direction: column;
    gap: 0.25rem;
  }

  .input-label {
    max-width: none;
  }
}
</style>
