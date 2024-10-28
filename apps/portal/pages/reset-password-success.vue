<template>
  <NuxtLayout name="auth">
    <div class="mx-auto mt-2 rounded-md border border-neutral-200 p-4 text-center md:p-6">
      <NuxtImg
        :alt="$t('auth.resetPassword.emailSent')"
        height="192"
        src="/images/email-sent.png"
        width="192"
        class="mx-auto mb-6"
      />
      <h1 class="typography-headline-3 font-bold">{{ $t('auth.resetPassword.heading') }}</h1>
      <i18n-t
        keypath="auth.resetPassword.thankYou"
        tag="p"
        class="my-4 rounded-md border border-neutral-200 bg-neutral-100 p-4 text-left"
      >
        <span class="font-medium">{{ email }}</span>
      </i18n-t>
      <ButtonTmp
        :is="NuxtLink"
        :to="paths.authResetPassword"
        data-testid="reset-password-page-reset-button"
        variant="tertiary"
      >
        {{ $t('auth.resetPassword.anotherEmail') }}
      </ButtonTmp>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>


definePageMeta({
  layout: false,
})

const email = ref('hieronim.anonim@gmail.com')
const NuxtLink = resolveComponent('NuxtLink')
</script>
