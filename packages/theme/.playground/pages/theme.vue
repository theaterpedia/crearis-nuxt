<script lang="ts" setup>
import { reactive, ref, resolveComponent } from 'vue'
import { Button, CardHero, Columns, Column } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import type { PaletteColor } from '../utils/ColorSettings';
import ColorPalette from '../components/ColorPalette.vue';

definePageMeta({
  layout: false,
})

const themes = [{ id: 0, heading: "**Theme 0**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }, { id: 1, heading: "**Theme 1**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }, { id: 2, heading: "**Theme 2**Feature, Feature, Feature", imgUrl: "https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg" }]
const theme = ref(themes[0])
const showTheme = (id) => {
  theme.value = themes[id]
}
const basisPalette = reactive<PaletteColor[]>([
  {name: 'neon', hue: 104, scale: 0},
  {name: 'lime', hue: 138, scale: 1},
  {name: 'pink', hue: 4, scale: 3}])

const brandPalette = reactive<PaletteColor[]>([{name: 'primary', hue: 88, scale: 1},
  {name: 'secondary', hue: 274, scale: 5}])

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
      <TabsRoot
        default-value="tab1"
        orientation="vertical"
      >
        <TabsList class="gap-4" aria-label="tabs example">
          <TabsTrigger class="trigger" value="demo">
            Demo
          </TabsTrigger>
          <TabsTrigger class="trigger" value="colors">
            Colors
          </TabsTrigger>
          <TabsTrigger class="trigger" value="elements">
            Elemente
          </TabsTrigger>
          <TabsTrigger class="trigger" value="typography">
            Typographie
          </TabsTrigger>
          <TabsTrigger class="trigger" value="docs">
            Docs
          </TabsTrigger>  
          <TabsTrigger class="trigger" value="dev">
            Dev / Dev-Docs
          </TabsTrigger>                              
        </TabsList>
        <TabsContent class="p-4" value="demo">
          <h2>DEMO</h2>
          <Prose>
            <li>Event-Cards</li>
            <li>Check-Out-Sektion</li>
            <li>Blog-Post</li>
          </Prose>
        </TabsContent>
        <TabsContent class="p-4" value="colors">
          <Columns>
            <Column>
              <Heading is="h2" content="Basisfarben & Graustile**Farbpalette**" />
              <ColorPalette :colors="basisPalette" />
            </Column>
            <Column>
              <Heading is="h2" content="Brand, Primary, Secondary**Theme-Farben**" />
              <ColorPalette :colors="brandPalette" />
            </Column>
          </Columns>          
          
        </TabsContent>
        <TabsContent class="p-4" value="elements">
          <Heading is="h2" content="**Elemente**Linien, Abstände, Ring etc." />
        </TabsContent>                
        <TabsContent class="p-4" value="typography">
          <Heading is="h2" content="**Typographie**Head-Font, Basis-Font, Fette, Range" />
          <Prose>
            <ul>
              <li>head-font als dropdown + basis-fette + range</li>
              <li>basis-font als dropdown + basis-fette + range</li>                
            </ul>
          </Prose>
        </TabsContent>
        <TabsContent class="p-4"  value="docs">
          <Heading is="h2" content="**Dokmentation**" />
        </TabsContent>
        <TabsContent class="p-4" value="dev">
          <Heading is="h2" content="**Dev-Docs**subline subline" />
        </TabsContent>        
      </TabsRoot>
     
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

<style scoped>
.trigger {
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}
.trigger[data-state="active"] {
  background-color: greenyellow
}
</style>
