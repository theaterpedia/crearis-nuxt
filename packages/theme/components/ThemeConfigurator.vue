<script lang="ts" setup>
import { ref} from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import ColorPalette from '@crearis/theme/components/ColorPalette.vue'
import { useTheme } from '../composables/useTheme'

const { baseColors, colormap, inverted, themes, initTheme, getTsVars, getThemeVars, loadTheme, updateTheme  } = useTheme()

initTheme(0)
// BEGIN: not used
const email = 'email'
const side = ref('side')
const isLoading = false
const isAuthenticated = false
const handleLogin = async () => {
  /* await login({ email: email.value, password: password.value }) */
}

const handleLogout = async () => {
  /* await logout() */
}

// END: not used
</script>

<template>
  <SectionContainer>
    <CardsGallery>
      <CardHero
        v-for="theme in themes"
        :imgTmp="theme.imgUrl"
        :key="theme.id"
        :overlay="getoverlay('left-bottom', 0.5)"
        contentAlignY="bottom"
        contentType="banner"
        contentWidth="short"
        heightTmp="mini"
        imgTmpAlignX="cover"
        imgTmpAlignY="top"
        class="shadow-lg"
        :style="
          getThemeVars(theme.id)
        "
      >
        <Heading :content="theme.heading" is="h3" class="p-4" />
        <Button @click="loadTheme(theme.id)" size="small" variant="primary" :style="'font-family: ' + theme.font">
          Vorschau
        </Button>
      </CardHero>
    </CardsGallery>
        <Button @click="updateTheme()" size="medium" variant="primary" :style="'font-family: ' + theme.font">
          Update Website
        </Button>    
  </SectionContainer>
  <SectionContainer background="default">
    <TabsRoot default-value="tab1" orientation="vertical">
      <TabsList aria-label="tabs example" class="gap-4">
        <TabsTrigger value="demo" class="trigger">Demo</TabsTrigger>
        <TabsTrigger value="colors" class="trigger">Colors</TabsTrigger>
        <TabsTrigger value="elements" class="trigger">Elemente</TabsTrigger>
        <TabsTrigger value="typography" class="trigger">Typographie</TabsTrigger>
        <TabsTrigger value="docs" class="trigger">Docs</TabsTrigger>
        <TabsTrigger value="export" class="trigger">Export</TabsTrigger>
      </TabsList>
      <TabsContent value="demo" class="p-4">
        <h2 class="bg-primary-bg">
          DEMO
          <span class="text-primary-700">(mit primary-bg)</span>
        </h2>
        <Prose>
          <li>Event-Cards</li>
          <li>Check-Out-Sektion</li>
          <li>Blog-Post</li>
        </Prose>
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6"
        >
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
        <div class="bg-primary-300 text-primary-400 w-full p-4 invert md:p-6">hallo hans</div>
        <UiAlert
          variant="neutral"
          class="typography-text-base bg-primary-600 mt-6 w-full !justify-start p-4 md:p-6"
        >
          <SfLink :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
            auth.login.createAccountLinkLabel
          </SfLink>
        </UiAlert>
      </TabsContent>
      <TabsContent value="colors" class="p-4">
        <ColorPalette v-model:baseColors="baseColors" v-model:colormap="colormap" v-model:inverted="inverted" />
      </TabsContent>
      <TabsContent value="elements" class="p-4">
        <Heading content="**Elemente**Linien, Abstände, Ring etc." is="h2" />
      </TabsContent>
      <TabsContent value="typography" class="p-4">
        <Heading content="**Typographie**Head-Font, Basis-Font, Fette, Range" is="h2" />
        <Prose>
          <ul>
            <li>head-font als dropdown + basis-fette + range</li>
            <li>basis-font als dropdown + basis-fette + range</li>
          </ul>
        </Prose>
      </TabsContent>
      <TabsContent value="docs" class="p-4">
        <Heading content="**Dokmentation**" is="h2" />
      </TabsContent>
      <TabsContent value="export" class="p-4">
        <Heading content="**Export**Paste settings into theme.ts" is="h2" />
        <ThemeExporter :tsVars="getTsVars()" />
      </TabsContent>
    </TabsRoot>
  </SectionContainer>
</template>

<style scoped>
.invert {
  --color-inverted: '1';
}
.trigger {
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}
.trigger[data-state='active'] {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}
</style>
