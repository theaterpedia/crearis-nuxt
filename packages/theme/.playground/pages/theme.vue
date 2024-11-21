<script lang="ts" setup>

definePageMeta({
  layout: false,
})

const email = "email"
const password = "password"
const rememberMe = false
const isLoading = false
const isAuthenticated = false

const handleLogin = async () => {
  /* await login({ email: email.value, password: password.value }) */
}

const handleLogout = async () => {
  /* await logout() */
} 

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #header>
        <Hero
          contentType="banner"
          contentWidth="short"
          heightTmp="medium"
          imgTmp="https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg"
        >
          <component is="Banner">
            <Prose>
              <h2>
                <strong>Theme und Design</strong>
                colors, fonts, and other design elements
              </h2>
            </Prose>
          </component>
        </Hero> 
      </template>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6">
        <label>
          <UiFormLabel>Layout</UiFormLabel>
          <SfSelect>
            <option value="side">Side-Nav wide</option>
            <option value="top">Top-Nav wide</option>
          </SfSelect>
        </label>
        <label>
          <UiFormLabel>form.emailLabel</UiFormLabel>
          <SfInput v-model="email" autocomplete="email" name="email" required type="email" />
        </label>

        <label class="mt-2 flex items-center gap-2">
          <SfCheckbox v-model="side" name="side" />
          Layout: Side-Nav?
        </label>

        <SfButton :disabled="isLoading" type="submit" class="mt-2">
          <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
          <span v-else>auth.login.submitLabel</span>
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
          auth.login.forgotPasswordLabel
        </SfButton>
      </form>

      <UiAlert variant="neutral" class="typography-text-base mt-6 w-full !justify-start p-4 md:p-6">
        <SfLink :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
          auth.login.createAccountLinkLabel
        </SfLink>
      </UiAlert>
    </NuxtLayout>
  </div>
</template>
