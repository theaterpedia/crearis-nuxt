<template>
  <form @submit.prevent="$emit('on-save', contactInfo)" data-testid="contact-information-form">
    <label>
      <UiFormLabel>contactInfo.name</UiFormLabel>
      <SfInput v-model="contactInfo.name" name="name" required type="text" />
    </label>
    <div class="mt-4"></div>
    <label>
      <UiFormLabel>contactInfo.email</UiFormLabel>
      <SfInput v-model="contactInfo.email" name="email" required type="email" />
    </label>
    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton @click="$emit('on-cancel')" type="reset" variant="secondary" class="md:mr-4">
        contactInfo.cancel
      </SfButton>
      <SfButton type="submit" class="mb-4 min-w-[120px] md:mb-0">contactInfo.save</SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>
type FormContactInformationProps = {
  name?: string
  email?: string
}

const props = defineProps<FormContactInformationProps>()
const { email, name } = toRefs(props)
defineEmits(['on-save', 'on-cancel'])
const contactInfo = ref({
  email: email?.value?.includes('newEmail') ? '' : (email?.value ?? ''),
  name: name?.value?.includes('newName') ? '' : (name?.value ?? ''),
})
</script>
