<template>
  <div>
    <NuxtLayout :heading="$t('auth.resetPassword.heading')" name="auth">
      <form @submit.prevent="resetPasswordHandler" class="mt-10 rounded-md pb-4 md:border md:border-neutral-200 md:p-6">
        <p class="mb-6">
          {{ $t('auth.resetPassword.info') }}
        </p>
        <label>
          <FormLabel>{{ $t('auth.resetPassword.email') }}</FormLabel>
          <Input v-model="customerEmail" name="email" required type="email" />
        </label>
        <div class="mt-6 flex flex-col-reverse gap-4 md:flex-row">
          <ButtonTmp :is="NuxtLink" to="/login" variant="tertiary" class="flex-1">
            {{ $t('auth.resetPassword.backToLogin') }}
          </ButtonTmp>
          <ButtonTmp type="submit" class="flex-1">
            {{ $t('auth.resetPassword.continue') }}
          </ButtonTmp>
        </div>
      </form>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>


definePageMeta({
  layout: false,
})

const NuxtLink = resolveComponent('NuxtLink')
const router = useRouter()
const customerEmail = ref('')
const { resetPassword, loading, resetPasswordError } = useUser()

const resetPasswordHandler = async () => {
  await resetPassword({ email: customerEmail.value })
  if (!resetPasswordError.value) {
    router.push('/reset-password-success')
  }
}
</script>
