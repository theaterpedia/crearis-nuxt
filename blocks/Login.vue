<template>
  <form @submit.prevent="handleLogin" class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6">
    <label>
      <UiFormLabel>form.emailLabel</UiFormLabel>
      <Input v-model="email" autocomplete="email" name="email" required type="email" />
    </label>

    <label>
      <UiFormLabel>form.passwordLabel</UiFormLabel>
      <UiFormPasswordInput v-model="password" autocomplete="current-password" name="password" required />
    </label>

    <label class="mt-2 flex items-center gap-2">
      <SfCheckbox v-model="rememberMe" name="rememberMe" />
      auth.login.rememberMeLabel
    </label>

    <ButtonTmp :disabled="isLoading" type="submit" class="mt-2">
      <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
      <span v-else>auth.login.submitLabel</span>
    </ButtonTmp>
    <ButtonTmp :is="NuxtLink" :to="paths.authResetPassword" data-testid="login-page-reset-button" variant="tertiary">
      auth.login.forgotPasswordLabel
    </ButtonTmp>
  </form>

  <UiAlert variant="neutral" class="typography-text-base mt-6 w-full !justify-start p-4 md:p-6">
    <i18n-t keypath="auth.login.createAccountBanner" tag="span">
      <ButtonTmp :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
        auth.login.createAccountLinkLabel
      </ButtonTmp>
    </i18n-t>
  </UiAlert>
</template>

<script lang="ts" setup>
import { defineBlock } from '#pruvious'
import { NuxtLink } from '#components'

defineBlock({
  icon: 'Pencil',
  label: 'Login',
})

const { login, loading, logout } = useUser()

const email = ref('')
const password = ref('')
const rememberMe = ref<boolean>()
const isLoading = ref<boolean>()

const handleLogin = async () => {
  await login({ email: email.value, password: password.value })
}

</script>
