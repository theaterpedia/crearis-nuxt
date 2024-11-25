<script lang="ts" setup>
import { ref, resolveComponent } from 'vue'
import { Button, CardHero } from '@crearis/ui'

definePageMeta({
  layout: false,
})

const themes = [{ id: 0, heading: "**Theme 0**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }, { id: 1, heading: "**Theme 1**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }, { id: 2, heading: "**Theme 2**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }]
const theme = ref(themes[0])
const showTheme = (id) => {
  theme.value = themes[id]
}

const email = "email"
const side = ref("side")

const isLoading = false
const isAuthenticated = false

const imgUrl = ref('https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg')

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
          imgTmpAlignY="top"
          imgTmpAlignX="cover"
          heightTmp="small"
          :imgTmp="imgUrl"
          :overlay="getoverlay('left-bottom', 0.5)"
        >
          <component is="Banner">
            <Heading is="h2" :content="theme.heading"/>
          </component>
        </Hero> 
      </template>
      <CardsGallery>
        <CardHero v-for="theme in themes" :key="theme.id"
          contentType="banner"
          contentWidth="short"
          contentAlignY="bottom"
          imgTmpAlignY="top"
          imgTmpAlignX="cover"
          heightTmp="mini"
          :imgTmp="theme.imgUrl"
          :overlay="getoverlay('left-bottom', 0.5)"
          >
          <Heading class="p-4" :content=theme.heading is="h3" />
          <Button @click="showTheme(theme.id)" variant="primary" size="small">Vorschau</Button>
        </CardHero>
                    
      </CardsGallery>      
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
