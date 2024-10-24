<template>
  <form @submit.prevent="$emit('on-save', userData.fullName)" data-testid="account-forms-name">
    <div class="justify-between gap-4 md:flex">
      <label class="block flex-1">
        <UiFormLabel>{{ $t('account.accountSettings.personalData.yourName') }}</UiFormLabel>
        <Input v-model="userData.fullName" name="fullname" required type="text" />
      </label>
    </div>
    <div class="mt-6 flex flex-col-reverse gap-4 md:flex-row md:justify-end">
      <button @click="$emit('on-cancel')" type="reset" variant="secondary">
        {{ $t('contactInfo.cancel') }}
      </button>
      <button type="submit" class="min-w-[120px]">
        {{ $t('contactInfo.save') }}
      </button>
    </div>
  </form>
</template>
<script lang="ts" setup>
type AccountFormsNameProps = {
  fullName?: string
}

const props = defineProps<AccountFormsNameProps>()
const { fullName } = toRefs(props)
defineEmits(['on-save', 'on-cancel'])
const userData = ref({
  fullName: fullName?.value ?? '',
})
</script>
