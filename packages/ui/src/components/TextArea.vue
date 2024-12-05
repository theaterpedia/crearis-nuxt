<template>
  <div
    class="text-area"
    :class="{
      'text-area-required': required,
      'text-area-has-error': error,
    }"
  >
    <div class="text-area-label">
      <label :for="computedId">{{ label }}</label>
    </div>

    <div class="text-area-group">
      <textarea
        :disabled="disabled"
        :id="computedId"
        :name="name"
        :placeholder="placeholder"
        :spellcheck="spellcheck"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="text-area-control"
      />

      <p v-if="error" class="text-area-error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  /**
   * The value of the text area.
   *
   * @default ''
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * The `name` attribute used to identify the text area when submitting the form.
   */
  name: {
    type: String,
    required: true,
  },

  /**
   * The label for the text area.
   */
  label: {
    type: String,
    required: true,
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
   * A hint to the user of what can be entered in the text area.
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
   * Indicates whether the text area is disabled.
   *
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Indicates whether the text area should have its spelling and grammar checked.
   *
   * @default false
   */
  spellcheck: {
    type: Boolean,
    default: false,
  },

  /**
   * The error message to display.
   * If defined, the text area will be styled as an error.
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
.text-area {
  display: flex;
  gap: 1rem;
  padding-left: 1.75rem; /* 28px */
}

.text-area-label {
  width: 100%;
  max-width: 8rem;
  padding-top: 0.5em;
}

.text-area-required .text-area-label label::after {
  content: '*';
  margin-left: 0.25em;
  color: hsl(var(--color-destructive-base));
}

.text-area-group {
  width: 100%;
  max-width: 22.5rem; /* 360px */
}

.text-area-control {
  display: block;
  width: 100%;
  min-height: 4.375em;
  padding: 0.3125em 0.5em;
  overflow: hidden;
  resize: vertical;
  background-color: hsl(var(--color-base));
  border: 1px solid hsl(var(--color-input));
  border-radius: calc(var(--radius) - 0.125rem);
  font-size: 1em;
  line-height: 1.25;
  color: hsl(var(--color-contrast));
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: var(--transition);
  transition-property: border-color, box-shadow;
}

.text-area-has-error .text-area-control {
  --color-ring: var(--color-destructive-base);
  border-color: hsl(var(--color-destructive-base));
}

.text-area-control:focus {
  border-color: transparent;
  box-shadow: 0 0 0 0.125rem hsl(var(--color-ring));
  outline: none;
}

.text-area-control:disabled {
  box-shadow: none;
  opacity: 0.5;
}

.text-area-control::placeholder {
  color: hsl(var(--color-contrast) / 40%);
}

.text-area-error {
  margin-top: 0.375rem;
  font-size: 0.875em;
  color: hsl(var(--color-destructive-base));
  font-weight: 500;
}

@media (max-width: 767px) {
  .text-area {
    flex-direction: column;
    gap: 0.25rem;
  }

  .text-area-label {
    max-width: none;
  }
}
</style>
