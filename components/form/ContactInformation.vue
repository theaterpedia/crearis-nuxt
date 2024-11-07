<template>
  <form data-testid="contact-information-form" @submit.prevent="$emit('on-save', contactInfo)">
    <label>
      <FormLabel>contactInfo.name</FormLabel>
      <SfInput v-model="contactInfo.name" name="name" type="text" required />
    </label>
    <div class="mt-4"></div>
    <label>
      <FormLabel>contactInfo.email</FormLabel>
      <SfInput v-model="contactInfo.email" name="email" type="email" required />
    </label>
    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton type="reset" class="md:mr-4" variant="secondary" @click="$emit('on-cancel')">
        contactInfo.cancel
      </SfButton>
      <SfButton type="submit" class="min-w-[120px] mb-4 md:mb-0">
        contactInfo.save
      </SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>

type FormContactInformationProps = {
  name?: string;
  email?: string;
};

const props = defineProps<FormContactInformationProps>();
const { email, name } = toRefs(props);
defineEmits(['on-save', 'on-cancel']);
const contactInfo = ref({
  email: email?.value?.includes('newEmail') ? '' : email?.value ?? '',
  name: name?.value?.includes('newName') ? '' : name?.value ?? '',
});
</script>