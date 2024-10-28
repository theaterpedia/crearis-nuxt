<template>
  <NuxtLayout :heading="$t('auth.login.heading')" name="auth">
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6">
      <label>
        <FormLabel>{{ $t('form.emailLabel') }}</FormLabel>
        <Input v-model="email" autocomplete="email" name="email" required type="email" />
      </label>

      <label>
        <FormLabel>{{ $t('form.passwordLabel') }}</FormLabel>
        <FormPasswordInput v-model="password" autocomplete="current-password" name="password" required />
      </label>

      <label class="mt-2 flex items-center gap-2">
        <SfCheckbox v-model="rememberMe" name="rememberMe" />
        {{ $t('auth.login.rememberMeLabel') }}
      </label>

      <ButtonTmp :disabled="isLoading" type="submit" class="mt-2">
        <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
        <span v-else>
          {{ $t('auth.login.submitLabel') }}
        </span>
      </ButtonTmp>
      <ButtonTmp :is="NuxtLink" :to="paths.authResetPassword" data-testid="login-page-reset-button" variant="tertiary">
        {{ $t('auth.login.forgotPasswordLabel') }}
      </ButtonTmp>
    </form>

    <UiAlert variant="neutral" class="typography-text-base mt-6 w-full !justify-start p-4 md:p-6">
      <i18n-t keypath="auth.login.createAccountBanner" tag="span">
        <ButtonTmp :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="link">
          {{ $t('auth.login.createAccountLinkLabel') }}
        </ButtonTmp>
      </i18n-t>
    </UiAlert>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { SfCheckbox, SfLoaderCircular } from '@crearis/vue'


definePageMeta({
  layout: false,
})

const { login, loading } = useUser()

const email = ref('')
const password = ref('')
const rememberMe = ref<boolean>()
const isLoading = ref<boolean>()

const handleLogin = async () => {
  await login({ email: email.value, password: password.value })
}

const NuxtLink = resolveComponent('NuxtLink')
</script>
