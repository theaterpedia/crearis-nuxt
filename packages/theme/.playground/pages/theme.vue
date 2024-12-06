<script lang="ts" setup>
import { ref, resolveComponent } from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import type { OklchScale, SfColorMapping } from '../utils/ColorSettings'
import ColorPalette from '../components/ColorPalette.vue'

definePageMeta({
  layout: false,
})

const themes = [
  {
    id: 0,
    heading: '**Theme 0**Feature, Feature, Feature',
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 1,
    heading: '**Theme 1**Feature, Feature, Feature',
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
  {
    id: 2,
    heading: '**Theme 2**Feature, Feature, Feature',
    imgUrl:
      'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
  },
]
const theme = ref(themes[0])
const showTheme = (id) => {
  theme.value = themes[id]
}

const colormap = ref<SfColorMapping[]>([
  { name: 'background', sfname: 'neutral', shade: 50 },
  { name: 'foreground', sfname: 'neutral', shade: 900 },
  { name: 'card-base', sfname: 'neutral', shade: 50 },
  { name: 'card-contrast', sfname: 'neutral', shade: 900 },
  { name: 'popover-base', sfname: 'neutral', shade: 50 },
  { name: 'popover-contrast', sfname: 'neutral', shade: 900 },
  { name: 'primary-base', sfname: 'primary', shade: 500 },
  { name: 'primary-contrast', sfname: 'neutral', shade: 900 },
  { name: 'secondary-base', sfname: 'secondary', shade: 500 },
  { name: 'secondary-contrast', sfname: 'neutral', shade: 900 },
  { name: 'muted-base', sfname: 'neutral', shade: 200 },
  { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
  { name: 'accent-base', sfname: 'neutral', shade: 700 },
  { name: 'accent-contrast', sfname: 'neutral', shade: 50 },
  { name: 'constructive-base', sfname: 'positive', shade: 500 },
  { name: 'constructive-foreground', sfname: 'neutral', shade: 900 },
  { name: 'destructive-base', sfname: 'negative', shade: 500 },
  { name: 'destructive-contrast', sfname: 'neutral', shade: 900 },
  { name: 'instructive-base', sfname: 'warning', shade: 500 },
  { name: 'instructive-foreground', sfname: 'neutral', shade: 900 },
  // TODO: specify these from sf-colors
  { name: 'dimmed', sfname: 'neutral', shade: 300 },
  { name: 'border', sfname: 'neutral', shade: 100 },
  { name: 'input', sfname: 'neutral', shade: 200 },
  { name: 'ring', sfname: 'neutral', shade: 900 },
])

const basisColors = ref<OklchScale[]>([
  { name: 'warning', hue: 104, scale: 0, greyval: 0 },
  { name: 'positive', hue: 138, scale: 1, greyval: 0 },
  { name: 'negative', hue: 4, scale: 3, greyval: 0 },
])

const brandColors = ref<OklchScale[]>([
  { name: 'primary', hue: 88, scale: 1, greyval: 0 },
  { name: 'secondary', hue: 274, scale: 5, greyval: 0 },
])

const neutralColors = ref<OklchScale[]>([{ name: 'neutral', hue: 88, scale: 1, greyval: 4 }])

const colors = ref<OklchScale[]>([])
const palettes = ref([])
onMounted(() => {
  colors.value.push(...neutralColors.value, ...basisColors.value, ...brandColors.value)
  palettes.value = generateAllPalettes(colors.value)
  watch([neutralColors, basisColors, brandColors], (newColors) => {
    colors.value = []
    colors.value.push(...neutralColors.value, ...basisColors.value, ...brandColors.value)
    palettes.value = generateAllPalettes(colors.value)
  })
  /*
  watch(palettes, (newPalettes) => {
    emit('update:palettes', newPalettes)
  })  */
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
    <NuxtLayout name="default">
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
          <TabsTrigger value="dev" class="trigger">Dev / Dev-Docs</TabsTrigger>
        </TabsList>
        <TabsContent value="demo" class="p-4">
          <h2>DEMO</h2>
          <Prose>
            <li>Event-Cards</li>
            <li>Check-Out-Sektion</li>
            <li>Blog-Post</li>
          </Prose>
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
        <TabsContent value="dev" class="p-4">
          <Heading content="**Dev-Docs**subline subline" is="h2" />
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
.trigger[data-state='active'] {
  background-color: oklch(var(--color-primary-base));
}
</style>
