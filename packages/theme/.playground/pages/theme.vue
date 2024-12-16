<script lang="ts" setup>
import { ref, reactive, watch, resolveComponent } from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import type { BaseColors, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { palette } from '@crearis/theme/utils/colorSettings'
import ColorPalette from '../components/ColorPalette.vue'

definePageMeta({
  layout: false,
})

const themes = [
  {
    id: 0,
    heading: '**Theaterpedia**Feature, Feature, Feature',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: false,
    font: 'MonaspaceNeon',
    headings: 'MonaspaceNeon',    
    baseColors: <BaseColors>{
      primary: '93% 0.2 104.001',
      secondary: '76% 0.205 131.001',
      warning: '93% 0.2 104',
      positive: '76% 0.205 131',
      negative: '88% 0.3 17',
      neutral: '70% 0 0',
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
  {
    id: 1,
    heading: '**DASEi**Feature, Feature, Feature',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: false,
    font: 'Roboto',
    headings: 'Roboto',    
    baseColors: <BaseColors>{
      primary: '97% 0.35 81.001',
      secondary: '70% 0.204 43',
      warning: '94% 0.3 111',
      positive: '70% 0.4 150',
      negative: '60% 0.35 30',
      neutral: '70% 0 0',
    },
    colormap: [
      { name: 'primary-contrast', sfname: 'grey', shade: 950 },
      { name: 'secondary-contrast', sfname: 'grey', shade: 950 },
      { name: 'positive-contrast', sfname: 'grey', shade: 950 },
      { name: 'negative-contrast', sfname: 'grey', shade: 950 },
      { name: 'warning-contrast', sfname: 'grey', shade: 950 },
      { name: 'card-bg', sfname: 'neutral', shade: 100 },
      { name: 'muted-bg', sfname: 'neutral', shade: 200 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 600 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 2,
    heading: '**Neon**Feature, Feature, Feature',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: false,
    font: 'MonaspaceNeon',
    headings: 'MonaspaceArgon',
    baseColors: <BaseColors>{
      primary: '99% 0.30 110',
      secondary: '82% 0.35 0',
      warning: '99% 0.30 110',
      positive: '97% 0.35 145',
      negative: '82% 0.35 0',
      neutral: '99% 0.02 110',
    },
    colormap: [
      { name: 'primary-bg', sfname: 'primary', shade: 400 },
      { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
      { name: 'warning-bg', sfname: 'warning', shade: 400 },
      { name: 'positive-bg', sfname: 'positive', shade: 400 },
      { name: 'negative-bg', sfname: 'negative', shade: 400 },
      { name: 'card-bg', sfname: 'neutral', shade: 400 },
      { name: 'card-contrast', sfname: 'neutral', shade: 900 },
      { name: 'muted-bg', sfname: 'neutral', shade: 600 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 950 },
      { name: 'accent-bg', sfname: 'neutral', shade: 900 },
      { name: 'accent-contrast', sfname: 'primary', shade: 200 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 3,
    heading: '**Pastell**Feature, Feature, Feature',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: false,
    font: 'MonaspaceKrypton',
    headings: 'MonaspaceKrypton',
    baseColors: <BaseColors>{
      primary: '99% 0.25 80',
      secondary: '80% 0.4 274',
      warning: '94% 0.3 111',
      positive: '85% 0.35 145',
      negative: '99% 0.395 23',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'primary-bg', sfname: 'primary', shade: 200 },
      { name: 'secondary-bg', sfname: 'secondary', shade: 200 },
      { name: 'warning-bg', sfname: 'warning', shade: 200 },
      { name: 'positive-bg', sfname: 'positive', shade: 200 },
      { name: 'negative-bg', sfname: 'negative', shade: 200 },
      { name: 'card-bg', sfname: 'neutral', shade: 100 },
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
    id: 4,
    heading: '**Dark**Feature, Feature, Feature',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: true,
    font: 'MonaspaceXenon',
    headings: 'MonaspaceXenon',
    baseColors: <BaseColors>{
      primary: '88% 0.4 100',
      secondary: '88% 0.4 100',
      warning: '88% 0.4 100',
      positive: '88% 0.4 138',
      negative: '88% 0.4 4',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'primary-bg', sfname: 'primary', shade: 400 },
      { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
      { name: 'warning-bg', sfname: 'warning', shade: 400 },
      { name: 'positive-bg', sfname: 'positive', shade: 400 },
      { name: 'negative-bg', sfname: 'negative', shade: 400 },
      { name: 'muted-bg', sfname: 'neutral', shade: 300 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 5,
    heading: '**Lempel**Theme with VSF-Colors & Typography',
    description: `
    <br />- missing: typography
    <br />- missing: colors`,
    inverted: false,
    font: 'Lato',
    headings: 'Poppins',
    baseColors: <BaseColors>{
      primary: '88% 0.4 100',
      secondary: '88% 0.4 100',
      warning: '88% 0.4 100',
      positive: '88% 0.4 138',
      negative: '88% 0.4 4',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'primary-bg', sfname: 'primary', shade: 400 },
      { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
      { name: 'warning-bg', sfname: 'warning', shade: 400 },
      { name: 'positive-bg', sfname: 'positive', shade: 400 },
      { name: 'negative-bg', sfname: 'negative', shade: 400 },
      { name: 'muted-bg', sfname: 'neutral', shade: 300 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
      { name: 'accent-bg', sfname: 'neutral', shade: 800 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },  
  {
    id: 6,
    heading: '**Rayleigh**Theme from the pruvious-tutorial',
    description: `description-text description-text 
    <br />description-text 
    <br />description-text`,
    inverted: false,
    font: 'Lato',
    headings: 'Poppins',
    baseColors: <BaseColors>{
      primary: '88% 0.4 100',
      secondary: '88% 0.4 100',
      warning: '88% 0.4 100',
      positive: '88% 0.4 138',
      negative: '88% 0.4 4',
      neutral: '88% 0.02 88',
    },
    colormap: [
      { name: 'primary-bg', sfname: 'primary', shade: 400 },
      { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
      { name: 'warning-bg', sfname: 'warning', shade: 400 },
      { name: 'positive-bg', sfname: 'positive', shade: 400 },
      { name: 'negative-bg', sfname: 'negative', shade: 400 },
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
  { name: 'black', sfname: 'grey', shade: 950 },
  { name: 'white', sfname: 'grey', shade: 50 },
  { name: 'primary-bg', sfname: 'primary', shade: 500 },
  { name: 'secondary-bg', sfname: 'secondary', shade: 500 },
  { name: 'warning-bg', sfname: 'warning', shade: 500 },
  { name: 'positive-bg', sfname: 'positive', shade: 500 },
  { name: 'negative-bg', sfname: 'negative', shade: 500 },
  { name: 'muted-bg', sfname: 'neutral', shade: 200 },
  { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
  { name: 'accent-bg', sfname: 'neutral', shade: 800 },
  { name: 'accent-contrast', sfname: 'neutral', shade: 50 },
  { name: 'card-bg', sfname: 'neutral', shade: 200 },
  { name: 'card-contrast', sfname: 'neutral', shade: 900 },
  { name: 'popover-bg', sfname: 'neutral', shade: 200 },
  { name: 'popover-contrast', sfname: 'neutral', shade: 900 },
  { name: 'primary-contrast', sfname: 'primary', shade: 950 },
  { name: 'secondary-contrast', sfname: 'secondary', shade: 950 },
  { name: 'positive-contrast', sfname: 'positive', shade: 950 },
  { name: 'negative-contrast', sfname: 'negative', shade: 950 },
  { name: 'warning-contrast', sfname: 'warning', shade: 950 },
  // TODO: specify these from sf-colors
  { name: 'dimmed', sfname: 'neutral', shade: 300 },
  { name: 'border', sfname: 'neutral', shade: 100 },
  { name: 'input', sfname: 'neutral', shade: 200 },
  { name: 'ring', sfname: 'neutral', shade: 900 },
]

const theme = ref(themes[0])
const font = ref(theme.value.font)
const headings = ref(theme.value.headings)
const baseColors = reactive<BaseColors>(theme.value.baseColors)
const colormap = ref<SfColorMapping[]>(colormap_defaults)
const inverted = ref(false)

// method to preview a theme if selected
const showTheme = (id) => {
  theme.value = themes[id]
  font.value = theme.value.font
  headings.value = theme.value.headings
  colormap.value = colormap_defaults.map((c) => theme.value.colormap.find((tc) => tc.name === c.name) || c)
  baseColors.primary = theme.value.baseColors.primary
  baseColors.secondary = theme.value.baseColors.secondary
  baseColors.warning = theme.value.baseColors.warning
  baseColors.positive = theme.value.baseColors.positive
  baseColors.negative = theme.value.baseColors.negative
  baseColors.neutral = theme.value.baseColors.neutral.endsWith('.001') ? theme.value.baseColors.neutral.slice(0, -4) : theme.value.baseColors.neutral
  baseColors.grey = theme.value.baseColors.neutral + '.001'
  inverted.value = theme.value.inverted
}
showTheme(0) // initialize colormap and baseColors with first theme

const getColormap = (colormap: SfColorMapping[]) => {
  return colormap_defaults.map((c) => colormap.find((tc) => tc.name === c.name) || c)
}

const getInverted = () => {
  return inverted.value ? '1' : '0'
}

const isPinned = (colorName: String) => {
  if (colorName === 'grey') return true
  if (colorName === 'neutral') return false
  if (!baseColors[colorName.toString()]) return false
  return baseColors[colorName.toString()].endsWith('.001')
}

// update grey color if neutral changes
watch(baseColors, (newColors) => {
  const newNeutral = newColors.neutral.endsWith('.001') ? newColors.neutral : newColors.neutral + '.001'
  if (baseColors.grey !== newNeutral) {
    baseColors.grey = newNeutral
  }
})

// initialize colormap and baseColors with first theme
const getVars = (colors: BaseColors, colormap: SfColorMapping[], asCss: Boolean, invert: String = '0') => {
  return [
    `${asCss ? '--color-inverted:' : '"inverted": "'}${invert}${asCss ? ';' : '",'}`
  ].concat(
    Object.entries(colors).map(([key, value]) => {
      // if value ends with ' pin', set boolean pin to true and remove it from value
      const oklchColor = `oklch(${value})`
      return `${asCss ? '--color-' : '"'}${key}-base${asCss ? ': ' : '": "'}${palette(oklchColor, 'var(--color-inverted)')[500]}${asCss ? ';' : '",'}`
    }),
    Object.entries(colormap).map(([key, value]) => {
      const varName = `var(--color-${value.sfname}-base)`
      // if shade is 500, use the base color = no calculations + no effect on 'inverted'
      if (value.shade === 500) {
        return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${varName}${asCss ? ';' : '",'}`
      }
      return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${palette(varName, isPinned(value.sfname) ? '0' : 'var(--color-inverted)')[value.shade.toString()]}${asCss ? ';' : '",'}`
    }),
  )
}

const getFontVars = (font: String = 'Roboto', headings: String = 'MonaspaceNeon', asCss: Boolean) => {
  return [
    `${asCss ? '--font:' : '"font": "'}${font}${asCss ? ';' : '",'}`,
    `${asCss ? '--headings:' : '"headings": "'}${headings}${asCss ? ';' : '",'}`,
  ]
}

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
  <div :style="getVars(baseColors, colormap, true, getInverted()).concat(getFontVars(font, headings, true))">
    <NuxtLayout
      name="default"
      :class="`${{ dark: inverted }}`"
      style="background-color: var(--color-bg); color: var(--color-contrast)"
    >
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
            <p v-html="theme.description" class="text-sm font-light"></p>
          </banner>
        </Hero>
      </template>
      <SectionContainer background="muted">
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
            :style="getVars(theme.baseColors, getColormap(theme.colormap), true, theme.inverted ? '1' : '0').concat(getFontVars(theme.font, theme.headings, true))"
          >
            <Heading :content="theme.heading" is="h3" class="p-4" />
            <Button @click="showTheme(theme.id)" :style="'font-family: ' + theme.font " size="small" variant="primary">Vorschau</Button>
          </CardHero>
        </CardsGallery>
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
            <ThemeExporter :tsVars="getVars(baseColors, colormap, false, getInverted())" />
          </TabsContent>
        </TabsRoot>
      </SectionContainer>
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
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}
</style>
