<script lang="ts" setup>
import { useI18n } from '#imports'
import { NuxtLink } from '#components'

definePageMeta({
  layout: false,
})

const { t } = useI18n()

const { login, loading, logout, isAuthenticated } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref<boolean>()
const isLoading = ref<boolean>()

const handleLogin = async () => {
  await login()
}

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <NuxtLayout heading="Home" name="auth">
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 bg-green-100 md:border md:p-20">
      <label>
        <UiFormLabel>form.emailLabel</UiFormLabel>
        <SfInput v-model="email" autocomplete="email" name="email" required type="email" />
      </label>

      <label>
        <UiFormLabel>form.passwordLabel</UiFormLabel>
        <UiFormPasswordInput v-model="password" autocomplete="current-password" name="password" required />
      </label>

      <label class="mt-2 flex items-center gap-2">
        <SfCheckbox v-model="rememberMe" name="rememberMe" />
        auth.login.rememberMeLabel
      </label>

      <SfButton :disabled="isLoading" type="submit" class="mt-2">
        <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
        <span v-else>auth.login.submitLabel</span>
      </SfButton>
      <SfButton
        v-show="isAuthenticated"
        @click="handleLogout()"
        variant="tertiary"
      >
        Logout
      </SfButton>
    </form>

    <UiAlert variant="neutral" class="typography-text-base mt-6 w-full !justify-start p-4 md:p-6">
    </UiAlert>
  </NuxtLayout>
</template>
