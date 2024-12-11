<template>
  <form class="form">
    <slot />
    <Button v-if="submitLabel" class="form-submit-button">{{ submitLabel }}</Button>
  </form>
</template>

<script lang="ts" setup>
import Button from './Button.vue'

defineProps({
  /**
   * The label for the submit button.
   */
  submitLabel: {
    type: String,
  },
})
</script>

<style scoped>
.form :where(fieldset legend) {
  margin-bottom: 0.875rem;
  font-size: 0.875em;
  font-weight: 700;
}

.form :where(fieldset legend span) {
  color: var(--color-negative-base);
}

.form > :where(fieldset):not(:first-child) {
  margin-top: 1.75rem;
}

.form > :where(:not(fieldset)) + :where(:not(fieldset)),
.form > :where(fieldset) > :where(:not(legend)) + * {
  margin-top: 0.875rem;
}

.form-submit-button {
  margin-top: 1.75rem;
}
</style>
