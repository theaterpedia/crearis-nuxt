<script lang="ts" setup>
import { ref, resolveComponent, onMounted, watch } from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import type { ColorShades, OklchColor, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { getOklchColor, palette } from '@crearis/theme/utils/colorSettings'
import ColorPalette from '../components/ColorPalette.vue'

definePageMeta({
  layout: false,
})

const themes = [
  {
    id: 0,
    heading: '**Theme 0**Feature, Feature, Feature',
    colorScales: <OklchColor[]> [
      { name: 'primary', hue: 56, light: 99, chroma: 0.3 },
      { name: 'secondary', hue: 274, light: 80, chroma: 0.4 },
      { name: 'warning', hue: 94, light: 92, chroma: 0.3 },
      { name: 'positive', hue: 150, light: 70, chroma: 0.4 },
      { name: 'negative', hue: 30, light: 60, chroma: 0.35 },
      { name: 'neutral', hue: 0, light: 70, chroma: 0.02 }
    ],
    colormap: [
      { name: 'positive-base', sfname: 'positive', shade: 200 },
      { name: 'positive-contrast', sfname: 'neutral', shade: 200 },
      { name: 'negative-base', sfname: 'negative', shade: 200 },
      { name: 'negative-contrast', sfname: 'neutral', shade: 200 },
      { name: 'warning-base', sfname: 'warning', shade: 200 },
      { name: 'warning-contrast', sfname: 'neutral', shade: 200 },
    ],
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 1,
    heading: '**Theme 1**Feature, Feature, Feature',
    colorScales: <OklchColor[]>[
      { name: 'primary', hue: 80, light: 99, chroma: 0.25 },
      { name: 'secondary', hue: 274, light: 80, chroma: 0.4 },
      { name: 'warning', hue: 111, light: 94, chroma: 0.3 },
      { name: 'positive', hue: 145, light: 85, chroma: 0.35 },
      { name: 'negative', hue: 23, light: 99, chroma: 0.395 },
      { name: 'neutral', hue: 0, light: 70, chroma: 0.02 },
    ],    
    colormap: [
      { name: 'card-base', sfname: 'neutral', shade: 900 },
      { name: 'card-contrast', sfname: 'neutral', shade: 900 },
    ],    
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 2,
    heading: '**Theme 2**Feature, Feature, Feature',
    colorScales: <OklchColor[]>[
      { name: 'primary', hue: 100, light: 88, chroma: 0.4 },
      { name: 'secondary', hue: 100, light: 88, chroma: 0.4 },
      { name: 'warning', hue: 100, light: 88, chroma: 0.4 },
      { name: 'positive', hue: 138, light: 88, chroma: 0.4 },
      { name: 'negative', hue: 4, light: 88, chroma: 0.4 },
      { name: 'neutral', hue: 88, light: 88, chroma: 0.02 }
    ],    
    colormap: [
      { name: 'muted-base', sfname: 'neutral', shade: 500 },
      { name: 'muted-contrast', sfname: 'neutral', shade: 500 },
      { name: 'accent-base', sfname: 'neutral', shade: 500 },
      { name: 'accent-contrast', sfname: 'neutral', shade: 500 },
    ],    
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
]
const theme = ref(themes[0])
const showTheme = (id) => {
  theme.value = themes[id]
  colormap.value = colormap_base.map((c) => theme.value.colormap.find((tc) => tc.name === c.name) || c)
  basisColors.value = theme.value.colorScales.filter((c) => c.name === 'positive' || c.name === 'negative' || c.name === 'warning')
  brandColors.value = theme.value.colorScales.filter((c) => c.name === 'primary' || c.name === 'secondary')
  neutralColors.value = theme.value.colorScales.filter((c) => c.name === 'neutral')
}

const colormap_base = [
  { name: 'base', sfname: 'neutral', shade: 50 },
  { name: 'contrast', sfname: 'neutral', shade: 900 },
  { name: 'card-base', sfname: 'neutral', shade: 500 },
  { name: 'card-contrast', sfname: 'neutral', shade: 900 },
  { name: 'popover-base', sfname: 'neutral', shade: 500 },
  { name: 'popover-contrast', sfname: 'neutral', shade: 900 },
  { name: 'primary-base', sfname: 'primary', shade: 500 },
  { name: 'primary-contrast', sfname: 'neutral', shade: 900 },
  { name: 'secondary-base', sfname: 'secondary', shade: 500 },
  { name: 'secondary-contrast', sfname: 'neutral', shade: 900 },
  { name: 'muted-base', sfname: 'neutral', shade: 200 },
  { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
  { name: 'accent-base', sfname: 'neutral', shade: 700 },
  { name: 'accent-contrast', sfname: 'neutral', shade: 500 },
  { name: 'positive-base', sfname: 'positive', shade: 500 },
  { name: 'positive-contrast', sfname: 'neutral', shade: 900 },
  { name: 'negative-base', sfname: 'negative', shade: 500 },
  { name: 'negative-contrast', sfname: 'neutral', shade: 900 },
  { name: 'warning-base', sfname: 'warning', shade: 500 },
  { name: 'warning-contrast', sfname: 'neutral', shade: 900 },
  // TODO: specify these from sf-colors
  { name: 'dimmed', sfname: 'neutral', shade: 300 },
  { name: 'border', sfname: 'neutral', shade: 100 },
  { name: 'input', sfname: 'neutral', shade: 200 },
  { name: 'ring', sfname: 'neutral', shade: 900 },
]

const colormap = ref<SfColorMapping[]>([...colormap_base
])

const basisColors = ref<OklchColor[]>([
  { name: 'warning', hue: 94, light: 92, chroma: 0.3 },
  { name: 'positive', hue: 150, light: 70, chroma: 0.4 },
  { name: 'negative', hue: 30, light: 60, chroma: 0.35 },
])

const brandColors = ref<OklchColor[]>([
  { name: 'primary', hue: 56, light: 99, chroma: 0.3 },
  { name: 'secondary', hue: 274, light: 80, chroma: 0.4 },
])

const neutralColors = ref<OklchColor[]>([
  { name: 'neutral', hue: 0, light: 70, chroma: 0.02 },
])

const colors = ref<OklchColor[]>([])
const palettes = ref<ColorShades>([])
const cssvars = ref<string[]>([])
onMounted(() => {
  colors.value.push(...brandColors.value, ...basisColors.value,...neutralColors.value)
  // ts-expect-error TODO: fix this
  palettes.value = colors.value.map((c) => palette(getOklchColor(c), '0'))
  // window.CSS.registerProperty('--color-primary-base', palettes.value[0].base)
  /* window.CSS.registerProperty({
      name: '--color-primary-base', 
      syntax: '<color>', 
      inherits: false, 
      initialValue: "99% 0.3 88"
    })  */
  cssvars.value = colormap.value.map((c) => {
    let pindex = 0
    switch(c.sfname) {
      case 'secondary': pindex = 1
      case 'warning': pindex = 2
      case 'positive': pindex = 3
      case 'negative': pindex = 4
      case 'neutral': pindex = 5
    }

    const pal:ColorShades = palettes.value[pindex]
    if (pal) {
      return `--color-${c.name}: ${pal[c.shade.toString()]};`
    }
  })

  watch([neutralColors, basisColors, brandColors, colormap], (newColors) => {
    colors.value = []
    colors.value.push(...brandColors.value, ...basisColors.value,...neutralColors.value)
    palettes.value = colors.value.map((c) => palette(getOklchColor(c), '0'))

    // for every entry in colormap, re-assign css-properties with new colors
    cssvars.value = colormap.value.map((c) => {
      let pindex = 0
      switch(c.sfname) {
        case 'secondary': pindex = 1
        case 'warning': pindex = 2
        case 'positive': pindex = 3
        case 'negative': pindex = 4
        case 'neutral': pindex = 5
      }

      const pal:ColorShades = palettes.value[pindex]
      if (pal) {
        return `--color-${c.name}: ${pal[c.shade.toString()]};`
      }
    })

    /*colormap.value.forEach((c) => {
      const color = palettes.value.find((p) => p.name === c.sfname)
      if (color) {
        cssvars.value.push(`--color-${c.name}-base: ${color.base};`)
        cssvars.value.push(`--color-${c.name}-contrast: ${color.contrast};`)
      }
    }) */


    // re-assign css-properties with new colors
    /* window.CSS.registerProperty({
      name: '--color-primary-base', 
      syntax: '<color>', 
      inherits: false, 
      initialValue: "99% 0.3 88"
    }) */

  })
})

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
    <NuxtLayout :style="cssvars" name="default">
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
      <div class="invert bg-primary-300 text-primary-400 w-full p-4 md:p-6">
        hallo hans
      </div>
      <UiAlert variant="neutral" class="typography-text-base mt-6 bg-primary-600 w-full !justify-start p-4 md:p-6">
        <SfLink :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
          auth.login.createAccountLinkLabel
        </SfLink>
      </UiAlert>          
        </TabsContent>
        <TabsContent value="colors" class="p-4">
          <ColorPalette
            v-model:basis="basisColors"
            v-model:brand="brandColors"
            v-model:colormap="colormap"
            v-model:neutral="neutralColors"
          />
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
          <!--ThemeExporter :colorScales="colors" :colorMap="colormap" -->
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
