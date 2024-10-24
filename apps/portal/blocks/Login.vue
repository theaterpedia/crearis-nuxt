<template>
    <form class="border-neutral-200 md:border flex flex-col gap-4 md:p-6 rounded-md" @submit.prevent="handleLogin">
      <label>
        <FormLabel>{{ $t('form.emailLabel') }}</FormLabel>
        <SfInput v-model="email" name="email" type="email" autocomplete="email" required />
      </label>

      <label>
        <FormLabel>{{ $t('form.passwordLabel') }}</FormLabel>
        <FormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
      </label>

      <label class="mt-2 flex items-center gap-2">
        <SfCheckbox v-model="rememberMe" name="rememberMe" />
        {{ $t('auth.login.rememberMeLabel') }}
      </label>

      <SfButton type="submit" class="mt-2" :disabled="isLoading">
        <SfLoaderCircular v-if="isLoading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ $t('auth.login.submitLabel') }}
        </span>
      </SfButton>
      <SfButton :tag="NuxtLink" :to="paths.authResetPassword" variant="tertiary" data-testid="login-page-reset-button">
        {{ $t('auth.login.forgotPasswordLabel') }}
      </SfButton>
    </form>

    <UiAlert class="mt-6 w-full p-4 md:p-6 !justify-start typography-text-base" variant="neutral">
      <i18n-t tag="span" keypath="auth.login.createAccountBanner">
        <SfLink :tag="NuxtLink" to="signup" variant="primary" data-testid="login-page-signup-button">
          {{ $t('auth.login.createAccountLinkLabel') }}
        </SfLink>
      </i18n-t>
    </UiAlert>
</template>

<script setup lang="ts">
import { SfButton, SfLink, SfCheckbox, SfInput, SfLoaderCircular } from '@crearis/vue';
import { defineBlock  } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Login',
})

const { login, loading } = useUser();

const email = ref('');
const password = ref('');
const rememberMe = ref<boolean>();
const isLoading = ref<boolean>();

const handleLogin = async () => {
  await login({ email: email.value, password: password.value });
};

const NuxtLink = resolveComponent('NuxtLink');
</script>
