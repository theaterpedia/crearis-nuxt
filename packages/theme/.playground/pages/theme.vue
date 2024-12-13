<script lang="ts" setup>
import { ref, resolveComponent, onMounted, watch } from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import type { ColorShades, BaseColors, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { getOklchColor, palette } from '@crearis/theme/utils/colorSettings'
import ColorPalette from '../components/ColorPalette.vue'

definePageMeta({
  layout: false,
})

const themes = [
  {
    id: 0,
    heading: '**Theme 0**Feature, Feature, Feature',
    baseColors: <BaseColors>{
      primary: '99% 0.3 56',
      secondary: '80% 0.4 274',
      warning: '94% 0.3 111',
      positive: '70% 0.4 150',
      negative: '60% 0.35 30',
      neutral: '70% 0.02 0',
    },
    colormap: [
      { name: 'positive-contrast', sfname: 'neutral', shade: 900 },
      { name: 'negative-contrast', sfname: 'neutral', shade: 900 },
      { name: 'warning-contrast', sfname: 'neutral', shade: 900 },
      { name: 'muted-bg', sfname: 'neutral', shade: 200 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 600 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 1,
    heading: '**Theme 1**Feature, Feature, Feature',
    baseColors: <BaseColors>{
      primary: '99% 0.25 80',
      secondary: '80% 0.4 274',
      warning: '94% 0.3 111',
      positive: '85% 0.35 145',
      negative: '99% 0.395 23',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'card-bg', sfname: 'neutral', shade: 200 },
      { name: 'card-contrast', sfname: 'neutral', shade: 900 },
      { name: 'muted-bg', sfname: 'neutral', shade: 200 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 500 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 2,
    heading: '**Theme 2**Feature, Feature, Feature',
    baseColors: <BaseColors>{
      primary: '88% 0.4 100',
      secondary: '88% 0.4 100',
      warning: '88% 0.4 100',
      positive: '88% 0.4 138',
      negative: '88% 0.4 4',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'muted-bg', sfname: 'neutral', shade: 300 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
]

// these mappings are congifurable and can be changed by the user, will be exported as css-vars
const colormap_defaults = <SfColorMapping[]>[
  { name: 'bg', sfname: 'neutral', shade: 50 },
  { name: 'contrast', sfname: 'neutral', shade: 950 },
  { name: 'muted-bg', sfname: 'neutral', shade: 200 },
  { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
  { name: 'accent-bg', sfname: 'neutral', shade: 800 },
  { name: 'accent-contrast', sfname: 'neutral', shade: 50 },
  { name: 'card-bg', sfname: 'neutral', shade: 200 },
  { name: 'card-contrast', sfname: 'neutral', shade: 900 },
  { name: 'popover-bg', sfname: 'neutral', shade: 200 },
  { name: 'popover-contrast', sfname: 'neutral', shade: 900 },
  { name: 'primary-contrast', sfname: 'neutral', shade: 950 },
  { name: 'secondary-contrast', sfname: 'neutral', shade: 950 },
  { name: 'positive-contrast', sfname: 'neutral', shade: 950 },
  { name: 'negative-contrast', sfname: 'neutral', shade: 950 },
  { name: 'warning-contrast', sfname: 'neutral', shade: 950 },
  // TODO: specify these from sf-colors
  { name: 'dimmed', sfname: 'neutral', shade: 300 },
  { name: 'border', sfname: 'neutral', shade: 100 },
  { name: 'input', sfname: 'neutral', shade: 200 },
  { name: 'ring', sfname: 'neutral', shade: 900 },
]

const theme = ref(themes[0])
const baseColors = ref<BaseColors>(theme.value.baseColors)
const colormap = ref<SfColorMapping[]>(colormap_defaults)
const inverted = ref(false)

// method to preview a theme if selected
const showTheme = (id) => {
  theme.value = themes[id]
  colormap.value = colormap_defaults.map((c) => theme.value.colormap.find((tc) => tc.name === c.name) || c)
  baseColors.value = theme.value.baseColors
}
showTheme(0) // initialize colormap and baseColors with first theme

const getInverted = () => {
  return inverted.value ? '1' : '0'
}

// initialize colormap and baseColors with first theme
const getVars = (colors: BaseColors, colormap: SfColorMapping[], asCss: Boolean, invert: String = '0') => {
  return [`${asCss ? '--color-inverted:' : '"inverted": "'}${invert}${asCss ? ';' : '",'}`].concat(
    Object.entries(colors).map(([key, value]) => {
      const oklchColor = `oklch(${value})`
      return `${asCss ? '--color-' : '"'}${key}-base${asCss ? ': ' : '": "'}${palette(oklchColor, 'var(--color-inverted)')[500]}${asCss ? ';' : '",'}`
    }),
    Object.entries(colormap).map(([key, value]) => {
      const varName = `var(--color-${value.sfname}-base)`
      return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${palette(varName, 'var(--color-inverted)')[value.shade.toString()]}${asCss ? ';' : '",'}`
    }),
  )
}

/* watch([baseColors, colormap], () => {
  cssvars.value = getVars(baseColors.value, colormap.value, false, '1')
}, { immediate: true }) */

const imgUrl = ref(
  'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
)

const NuxtLink = resolveComponent('NuxtLink')

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
  <div>
    <NuxtLayout name="default" :style="getVars(baseColors, colormap, true, getInverted())">
      <template #header>
        <Hero
          :imgTmp="imgUrl"
          :overlay="getoverlay('left-bottom', 0.5)"
          contentType="banner"
          contentWidth="short"
          heightTmp="small"
          imgTmpAlignX="cover"
          imgTmpAlignY="top"
        >
          <banner transparent>
            <Heading :content="theme.heading" is="h2" />
          </banner>
        </Hero>
      </template>
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
        >
          <Heading :content="theme.heading" is="h3" class="p-4" />
          <Button @click="showTheme(theme.id)" size="small" variant="primary">Vorschau</Button>
        </CardHero>
      </CardsGallery>
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
          <h2>DEMO</h2>
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
          <UiAlert variant="neutral" class="typography-text-base bg-primary-600 mt-6 w-full !justify-start p-4 md:p-6">
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
          <ThemeExporter :tsVars="getVars(baseColors, colormap, false, getInverted())" />
        </TabsContent>
      </TabsRoot>
    </NuxtLayout>
  </div>
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
  background-color: var(--color-primary-base);
}
</style>
