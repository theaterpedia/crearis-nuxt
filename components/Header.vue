<template>
  <div>
    <Hero
      v-if="showHero"
      :contentAlignY="headerprops.contentAlignY"
      :contentType="headerprops.contentType ? headerprops.contentType : headerprops.phoneBanner ? 'banner' : 'text'"
      :contentWidth="headerprops.contentWidth ? headerprops.contentWidth : headerprops.isFullWidth ? 'full' : 'short'"
      :darkMode="$colorMode.value === 'dark'"
      :gradient_depth="headerprops.gradientDepth"
      :gradient_type="headerprops.gradientType"
      :heightTmp="headerprops.headerSize"
      :imgTmp="imgTmp"
      :imgTmpAlignX="headerprops.imgTmpAlignX"
      :imgTmpAlignY="headerprops.imgTmpAlignY"
      :backgroundCorrection="headerprops.backgroundCorrection"
    > 
      <!-- TODO: Passing 'bauchbinde' option to Banner is a hack with hardcoded padding. 
           Should be refactored to use proper CSS classes or theme variables -->
      <Component
        :card="headerprops.phoneBanner && false"
        :is="headerprops.contentInBanner ? Banner : 'div'"
        themeColor="secondary"
        :option="headerprops.name === 'bauchbinde' ? 'bauchbinde' : ''"
        transparent
      >
        <template v-if="showLogoBanner">
          <Logo extended />
        </template>
        <template v-else>
          <Heading :content="heading" is="h1"></Heading>
          <br v-if="heading && teaserText" />
          <MdBlock v-if="teaserText" :content="teaserText" htag="h3" />
          <div v-if="showCta">
            <ButtonTmp
              :size="headerprops.isFullWidth ? 'medium' : 'small'"
              :to="cta.link ? cta.link : '#cta'"
              variant="plain"
            >
              {{ cta.title }}
            </ButtonTmp>
            <NuxtLink
              v-if="showLink"
              :to="link.link"
              style="margin-left: 2em; text-decoration: underline"
              :style="headerprops.isFullWidth ? 'font-weight:bold' : ''"
            >
              {{ link.title }}
            </NuxtLink>
          </div>
        </template>
      </Component>
    </Hero>
    <!--TextImage
      v-else-if="showTextImage"
      :heightTmp="headerprops.headerSize"
      :imgTmp="imgTmp"
      :imgTmpAlignX="headerprops.imgTmpAlignX"
      :imgTmpAlignY="headerprops.imgTmpAlignY"
      :contentAlignY="headerprops.contentAlignY"
    >
      <div v-if="showLogoBanner">
        <Logo extended />
      </div>
      <div v-else>
        <Heading v-if="heading" :content="heading" is="h1"></Heading>
        <br v-if="heading && teaserText" />
        <MdBlock v-if="teaserText" :content="teaserText" htag="h3" />
        <div v-if="showCta">
          <ButtonTmp
            :size="headerprops.isFullWidth ? 'medium' : 'small'"
            :to="cta.link ? cta.link : '#cta'"
            variant="plain"
          >
            {{ cta.title }}
          </ButtonTmp>
          <NuxtLink
            v-if="showLink"
            :to="link.link"
            style="margin-left: 2em; text-decoration: underline"
            :style="headerprops.isFullWidth ? 'font-weight:bold' : ''"
          >
            {{ link.title }}
          </NuxtLink>
        </div>
      </div>
    </TextImage -->
    <SectionContainer v-else>
      <Heading v-if="heading" :content="heading" is="h1" class="mt-14"></Heading>
      <MdBlock v-if="teaserText" :content="teaserText" htag="h3" />
    </SectionContainer>
  </div>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { getCollectionData } from '#pruvious/client'
import { nextTick, onMounted } from 'vue'
import { type PropType } from 'vue'
import { useTheme } from '#imports'
import { sharedThemeState } from '~/packages/theme/composables/sharedThemeState'
//import TextImage from '~/packages/ui/src/components/TextImage.vue'
import Banner from '~/packages/ui/src/components/Banner.vue'

const props = defineProps({
  /**
   * Defines the type of the header.
   */
  headerType: {
    type: String as PropType<'simple' | 'columns' | 'cover' | 'banner' | 'bauchbinde'>,
    default: 'simple',
  },
  /**
   * Defines the size of the header.
   */
  headerSize: {
    type: String as PropType<'mini' | 'medium' | 'prominent' | 'full'>,
    default: 'mini',
  },
  /**
   * Main Text-Content with basic crearis-md formatting.
   */
  heading: {
    type: String,
    default: '',
    required: true,
  },
  /**
   * Optional Text-Section for short description.
   */
  teaserText: {
    type: String,
    default: '',
  },
  /**
   * should we display the extended logo banner.
   */
  showLogoBanner: {
    type: Boolean,
    default: false,
  },
  /**
   * should we display the search input.
   */
  searchDisabled: {
    type: Boolean,
    default: true,
  },
  /**
   * Image to be displayed in the hero.
   */
  imgTmp: {
    type: String,
    default: '',
  },
  /**
   * Call-to-action button configuration.
   */
  cta: {
    type: Object,
    default: () => ({
      title: '',
      link: '',
    }),
  },
  /**
   * Secondary Call-to-action button configuration.
   */
  link: {
    type: Object,
    default: () => ({
      title: '',
      link: '',
    }),
  },  
  /**
   * Format options to manually adjust the site-settings.
   * Can be either a JSON string or an object. Empty strings are treated as empty objects.
   */
  formatOptions: {
    type: [Object, String],
    default: () => ({}),
  },
})

// const { blogLandingPage } = await getCollectionData('settings')

const { headerConfigs, theme, themeConfig } = await getCollectionData('settings') 
const themeComposable = useTheme()

// CSS application is handled by the theme-css.client.ts plugin

onMounted(async () => {
  const shouldInit = themeComposable.shouldInitialize()
  
  // Check if theming is already enabled (session-based from /theme page)
  if (themeComposable.isEnabled()) {
    console.log('🎨 Header: Session-based theming already active, keeping current theme')
    return // Don't override session theme with database theme
  }
  
  // Only initialize if not already enabled (singleton pattern ensures this works correctly)
  if (shouldInit) {
    if (theme !== undefined && theme !== null && theme >= 0) {
      // Valid theme ID: Load and enable dynamic theming (0 is first theme)
      console.log('🎨 Header: Loading database theme:', theme)
      themeComposable.loadTheme(theme)
      
      if (themeConfig !== undefined && themeConfig.trim().length >= 2) {  
        themeComposable.loadThemeConfig(themeConfig)
      }
      
      // Enable theming after loading the correct theme
      themeComposable.toggleTheming(true)
      
      await nextTick()
    } else {
      // Fallback behavior: theme is undefined, null, or -1
      // Use default CSS variables from root/tailwind (no dynamic theming)
      console.log('🎨 Header: Using fallback theme from root CSS (theme:', theme, ')')
      // Do NOT call toggleTheming(true) - keep theming disabled
      // This allows CSS variables to be read from root via tailwind/theme.ts
    }
  }
})

// colorMode synchronization is now handled by NavbarTop component

const headerTypes = [
  {
    id: 0,
    name: 'simple',
    description: `no header`,
    headerSize: 'mini',
    allowedSizes: [],
    isFullWidth: false,
    contentAlignY: 'center',
    imgTmpAlignX: 'center',
    imgTmpAlignY: 'center',
    backgroundCorrection: 'none',
    phoneBanner: false,
    contentInBanner: false,
    gradientType: 'none',
    gradientDepth: 1.0,
  },
  {
    id: 1,
    name: 'columns',
    description: `2-cols header`,
    headerSize: 'prominent',
    allowedSizes: [],
    isFullWidth: false,
    contentAlignY: 'center',
    imgTmpAlignX: 'center',
    imgTmpAlignY: 'center',
    backgroundCorrection: 'none',
    phoneBanner: false,
    contentInBanner: false,
    gradientType: 'none',
    gradientDepth: 1.0,
  },
  {
    id: 2,
    name: 'banner',
    description: `Banner`,
    headerSize: 'medium',
    allowedSizes: ['prominent', 'medium', 'mini'],
    isFullWidth: false,
    contentAlignY: 'top',
    imgTmpAlignX: 'center',
    imgTmpAlignY: 'top',
    backgroundCorrection: 1,
    phoneBanner: false,
    contentInBanner: false,
    gradientType: 'left-bottom',
    gradientDepth: 0.6,
  },
  {
    id: 3,
    name: 'cover',
    description: `Cover`,
    headerSize: 'prominent',
    allowedSizes: ['prominent', 'full'],
    isFullWidth: false,
    contentAlignY: 'bottom',
    imgTmpAlignX: 'cover',
    imgTmpAlignY: 'center',
    backgroundCorrection: 1,
    phoneBanner: true,
    contentInBanner: false,
    gradientType: 'left-bottom',
    gradientDepth: 0.6,
  },
  {
    id: 4,
    name: 'bauchbinde',
    description: `Bauchbinde`,
    headerSize: 'prominent',
    allowedSizes: ['prominent', 'full'],
    isFullWidth: true,
    contentAlignY: 'bottom',
    imgTmpAlignX: 'cover',
    imgTmpAlignY: 'center',
    backgroundCorrection: 'none',
    phoneBanner: false,
    contentType: 'left',
    contentWidth: 'fixed',
    contentInBanner: true,
    gradientType: 'none',
    gradientDepth: 1.0,
  },            
]

// check whether the headerConfigs contain an entry matching the headerType-prop
const customSiteHeader = headerConfigs.find((config: any) => config.name === props.headerType)
// if customHeaderConfig contains entries then parse formatOptions from JSON string
const siteHeader = customSiteHeader?.formatOptions ? JSON.parse(customSiteHeader.formatOptions) : {}

// get default Header, if not found, take 'simple'
const defaultHeader = headerTypes.find((type) => type.name === props.headerType) || headerTypes[0]

// Parse formatOptions if it's a string (JSON string or empty string)
let parsedFormatOptions = {}
if (typeof props.formatOptions === 'string') {
  // Empty string means empty object
  if (props.formatOptions.trim() === '') {
    parsedFormatOptions = {}
  } else {
    // Try to parse JSON string
    try {
      parsedFormatOptions = JSON.parse(props.formatOptions)
    } catch (e) {
      console.warn('Failed to parse formatOptions JSON string:', props.formatOptions, e)
      parsedFormatOptions = {}
    }
  }
} else {
  // Already an object
  parsedFormatOptions = props.formatOptions
}

const headerprops = Object.assign(defaultHeader, siteHeader, parsedFormatOptions)

// if headerprops.headerSize is not in allowedSizes set it to default
if (!headerprops.allowedSizes.includes(headerprops.headerSize)) {
  headerprops.headerSize = defaultHeader.headerSize
}

const showHero = headerprops.name !== 'simple' && headerprops.name !== 'columns' && props.imgTmp
const showTextImage = headerprops.name === 'columns' && props.imgTmp
const showCta = headerprops.name !== 'simple' && props.cta?.link
const showLink = headerprops.name !== 'simple' && props.link?.link

</script>

<style scoped>
</style>
