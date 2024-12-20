<script lang="ts" setup>
const model = defineModel()

const emit = defineEmits(['is-field-valid'])

const showError = ref(false)

const clearError = () => {
  showError.value = false
}

const validateEmail = () => {
  const isValid = /^\S+@\S+\.\S+$/.test(String(model.value))
  showError.value = !isValid
  emit('is-field-valid', isValid)
}

watch(model, () => {
  validateEmail()
})
</script>
<template>
  <div class="relative w-full">
    <span
      class="focus-within:caret-primary-700 focus-within:ring-primary-700 hover:ring-primary-700 active:caret-primary-700 active:ring-primary-700 flex h-[48px] w-full items-center gap-2 rounded-md bg-white px-4 text-neutral-500 ring-1 ring-neutral-200 focus-within:ring-2 active:ring-2"
    >
      <input
        v-bind="$attrs"
        v-model="model"
        @input="clearError"
        placeholder="Please type your email"
        type="text"
        class="w-full appearance-none text-base text-neutral-900 outline-none read-only:bg-transparent disabled:cursor-not-allowed disabled:bg-transparent"
      />
    </span>
  </div>
</template>
