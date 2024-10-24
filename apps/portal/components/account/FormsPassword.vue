<template>
  <form @submit.prevent="$emit('on-save', userPasswords)" data-testid="account-forms-password">
    <label class="block">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.currentPassword') }}</UiFormLabel>
      <Input v-model="userPasswords.oldPassword" :type="passwordVisible ? 'text' : 'password'" name="password" required>
        <template #suffix>
          <button @click="passwordVisible = !passwordVisible" type="button">
            <SfIconVisibility />
          </button>
        </template>
      </Input>
    </label>
    <label class="my-4 block">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.newPassword') }}</UiFormLabel>
      <Input
        v-model="userPasswords.firstNewPassword"
        :type="firstNewPasswordVisible ? 'text' : 'password'"
        name="password"
        required
      >
        <template #suffix>
          <button @click="firstNewPasswordVisible = !firstNewPasswordVisible" type="button">
            <SfIconVisibility />
          </button>
        </template>
      </Input>
      <UiFormHelperText class="block">{{ $t('account.accountSettings.personalData.passwordHelp') }}</UiFormHelperText>
    </label>
    <label class="block">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.newPasswordAgain') }}</UiFormLabel>
      <Input
        v-model="userPasswords.secondNewPassword"
        :type="secondNewPasswordVisible ? 'text' : 'password'"
        name="password"
        required
      >
        <template #suffix>
          <button @click="secondNewPasswordVisible = !secondNewPasswordVisible" type="button">
            <SfIconVisibility />
          </button>
        </template>
      </Input>
    </label>
    <div class="mt-6 flex flex-col-reverse gap-4 md:flex-row md:justify-end">
      <Button @click="$emit('on-cancel')" type="reset">
        {{ $t('contactInfo.cancel') }}
      </Button>
      <Button type="submit" class="min-w-[120px]">
        {{ $t('account.accountSettings.personalData.changePassword') }}
      </Button>
    </div>
  </form>
</template>
<script lang="ts" setup>
type AccountFormsPasswordProps = {
  oldPassword?: string
  firstNewPassword?: string
  secondNewPassword?: string
}

const props = defineProps<AccountFormsPasswordProps>()
const { oldPassword, firstNewPassword, secondNewPassword } = toRefs(props)
defineEmits(['on-save', 'on-cancel'])
const userPasswords = ref({
  oldPassword: oldPassword?.value ?? '',
  firstNewPassword: firstNewPassword?.value ?? '',
  secondNewPassword: secondNewPassword?.value ?? '',
})

const passwordVisible = ref(false)
const firstNewPasswordVisible = ref(false)
const secondNewPasswordVisible = ref(false)
</script>
