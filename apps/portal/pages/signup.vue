<template>
  <NuxtLayout :heading="$t('auth.signup.heading')" name="auth">
    <UiAlert variant="neutral" class="typography-text-base mb-6 w-full !justify-start p-4 md:p-6">
      <i18n-t keypath="auth.signup.bannerText">
        <template #login>
          <ButtonTmp
            :is="NuxtLink"
            :to="paths.authLogin"
            data-testid="signup-page-login-button"
            type="link"
            class="outline-secondary-600 rounded focus:outline focus:outline-2 focus:outline-offset-2"
          >
            {{ $t('auth.login.heading') }}
          </ButtonTmp>
        </template>
      </i18n-t>
    </UiAlert>

    <form
      @submit.prevent="handleSignup"
      data-testid="signup-form"
      class="flex flex-col gap-4 rounded-md md:border md:border-neutral-200 md:p-6"
    >
      <label>
        <FormLabel>{{ $t('form.firstNameLabel') }} *</FormLabel>
        <Input v-model="firstNameModel" autocomplete="given-name" name="firstName" required />
      </label>
      <label>
        <FormLabel>{{ $t('form.lastNameLabel') }} *</FormLabel>
        <Input v-model="lastNameModel" autocomplete="family-name" name="lastName" required />
      </label>
      <label>
        <FormLabel>{{ $t('form.emailLabel') }} *</FormLabel>
        <Input v-model="emailModel" autocomplete="email" name="email" required type="email" />
      </label>
      <div>
        <label>
          <FormLabel>{{ $t('form.passwordLabel') }} *</FormLabel>
          <FormPasswordInput v-model="passwordModel" autocomplete="current-password" name="password" required />
          <FormHelperText class="mb-2">{{ $t('form.passwordHint') }}</FormHelperText>
        </label>
      </div>

      <div class="flex items-center">
        <SfCheckbox v-model="termsAndConditionsModel" id="terms" required value="value" class="peer" />
        <label
          for="terms"
          class="font-body peer-disabled:text-disabled-900 ml-3 cursor-pointer text-base text-neutral-900"
        >
          *
          <i18n-t keypath="form.termsAndConditionsLabel">
            <template #terms>
              <ButtonTmp
                href="#"
                class="outline-secondary-600 rounded focus:outline focus:outline-2 focus:outline-offset-2"
              >
                {{ $t('termsAndConditions') }}
              </ButtonTmp>
            </template>
          </i18n-t>
        </label>
      </div>

      <div class="mb-2 flex">
        <SfCheckbox v-model="subscriptionsModel" id="subscription" value="value" class="peer mt-0.5" />
        <label
          for="subscription"
          class="font-body peer-disabled:text-disabled-900 ml-3 cursor-pointer text-base text-neutral-900"
        >
          {{ $t('form.subscriptionLabel') }}
        </label>
      </div>

      <p class="mb-2 mt-0.5 text-sm text-neutral-500">{{ $t('form.asterixHint') }}</p>

      <ButtonTmp size="lg" type="submit" class="w-full">
        {{ $t('auth.signup.createButton') }}
      </ButtonTmp>
    </form>

    <UiModal
      v-model="isOpen"
      aria-describedby="signUpModalDesc"
      aria-labelledby="signUpModalTitle"
      disable-click-away
      role="alertdialog"
      tag="section"
      class="inset-x-4 max-w-[480px] md:inset-x-0"
    >
      <header class="flex flex-col items-center">
        <NuxtImg
          :alt="$t('auth.signup.modal.imageAlt')"
          height="192"
          src="/images/signup-success.svg"
          width="192"
          class="my-6"
        />
        <h2 id="signUpModalTitle" class="typography-headline-3 mb-4 mt-6 font-bold">
          {{ $t('auth.signup.modal.heading') }}
        </h2>
      </header>
      <UiAlert variant="neutral" class="typography-text-base mb-6 w-full !justify-start p-4">
        <i18n-t id="signUpModalDesc" keypath="auth.signup.modal.description" tag="p">
          <template #information>
            <ButtonTmp
              :is="NuxtLink"
              :to="paths.account"
              type="link"
              class="outline-secondary-600 rounded focus:outline focus:outline-2 focus:outline-offset-2"
            >
              {{ $t('auth.signup.modal.information') }}
            </ButtonTmp>
          </template>
        </i18n-t>
      </UiAlert>

      <footer class="flex justify-end">
        <ButtonTmp :is="NuxtLink" :to="paths.home" class="w-full">
          {{ $t('auth.signup.modal.button') }}
        </ButtonTmp>
      </footer>
    </UiModal>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { SfCheckbox, useDisclosure } from '@crearis/vue'
import ButtonTmp from '../components/ButtonTmp.vue'

definePageMeta({
  layout: false,
})

const firstNameModel = ref('')
const lastNameModel = ref('')
const emailModel = ref('')
const passwordModel = ref('')
const termsAndConditionsModel = ref<boolean>()
const subscriptionsModel = ref<boolean>()

const NuxtLink = resolveComponent('NuxtLink')
const { isOpen, open } = useDisclosure()
const { signup, loading } = useUser()
const router = useRouter()

const fullName = computed(() => `${firstNameModel.value} ${lastNameModel.value}`)

const handleSignup = async () => {
  await signup({
    email: emailModel.value,
    name: fullName.value,
    password: passwordModel.value,
    subscribeNewsletter: subscriptionsModel.value === true,
  })
}
</script>
