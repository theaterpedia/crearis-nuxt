<script lang="ts" setup>
definePageMeta({
  layout: false,
})

const { login, loading, logout, isAuthenticated } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref<boolean>()
const isLoading = ref<boolean>()

const handleLogin = async () => {
  await login({ email: email.value, password: password.value })
}

const handleLogout = async () => {
  await logout()
}

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <NuxtLayout heading="Login" name="auth">
    <TmpConstruction warning>
      <p>
        Under Construction - Under Construction - Under Construction - Under Construction - Under Construction - Under
        Construction - Under Construction
      </p>
    </TmpConstruction>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6">
      <label>
        <UiFormLabel>email</UiFormLabel>
        <SfInput v-model="email" autocomplete="email" name="email" required type="email" />
      </label>

      <label>
        <UiFormLabel>password</UiFormLabel>
        <UiFormPasswordInput v-model="password" autocomplete="current-password" name="password" required />
      </label>

      <label class="mt-2 flex items-center gap-2">
        <SfCheckbox v-model="rememberMe" name="rememberMe" />

        remember Me
      </label>

      <SfButton :disabled="isLoading" type="submit" class="mt-2">
        <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
        <span v-else>Login Submit</span>
      </SfButton>
      <SfButton
        v-show="isAuthenticated"
        :is="NuxtLink"
        @click="handleLogout()"
        data-testid="logout-page-reset-button"
        variant="tertiary"
      >
        Logout
      </SfButton>
      <SfButton :is="NuxtLink" data-testid="login-page-reset-button" to="/reset-password" variant="tertiary">
        forgot Password
      </SfButton>
    </form>

    <UiAlert variant="neutral" class="typography-text-base mt-6 w-full !justify-start p-4 md:p-6">
      <SfLink :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
        create Account
      </SfLink>
    </UiAlert>
  </NuxtLayout>
</template>
