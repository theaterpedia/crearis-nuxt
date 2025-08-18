<template>
  <div>
    <Hero
      v-if="showHero"
      :contentAlignY="headerprops.contentAlignY"
      :contentType="headerprops.phoneBanner ? 'banner' : 'text'"
      :contentWidth="headerprops.isFullWidth ? 'full' : 'short'"
      :darkMode="$colorMode.value === 'dark'"
      :gradient_depth="headerprops.gradientDepth"
      :gradient_type="headerprops.gradientType"
      :heightTmp="headerprops.headerSize"
      :imgTmp="imgTmp"
      :imgTmpAlignX="headerprops.imgTmpAlignX"
      :imgTmpAlignY="headerprops.imgTmpAlignY"
      :backgroundCorrection="headerprops.backgroundCorrection"
    >
      <Component
        :card="headerprops.phoneBanner && false"
        :is="headerprops.inBanner ? 'Banner' : 'div'"
        transparent
      >
        <template v-if="showLogoBanner">
          <Logo extended />
        </template>
        <template v-else>
          <Heading :content="heading" is="h1"></Heading>
          <br v-if="heading && teaser" />
          <MdBlock v-if="teaser" :content="teaser" htag="h3" />
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
    <SectionContainer v-else-if="!showTextImage">
      <Heading v-if="heading" :content="heading" is="h1" class="mt-14"></Heading>
      <MdBlock v-if="teaser" :content="teaser" htag="h3" />
    </SectionContainer>
    <SectionContainer v-else>
      <h2 class="mt-14">Text-Bild-Kombination</h2>
      <Heading v-if="heading" :content="heading" is="h1" class="mt-14"></Heading>
      <MdBlock v-if="teaser" :content="teaser" htag="h3" />
    </SectionContainer>
  </div>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { getCollectionData } from '#pruvious/client'
import { ref } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { type PropType } from 'vue'

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
  teaser: {
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
   */
  formatOptions: {
    type: Object,
    default: () => ({}),
  },
})

// const { blogLandingPage } = await getCollectionData('settings')

const { headerConfigs } = await getCollectionData('settings')

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
    id: 3,
    name: 'cover',
    description: `Cover`,
    headerSize: 'prominent',
    allowedSizes: ['prominent', 'full'],
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
    id: 4,
    name: 'bauchbinde',
    description: `Bauchbinde`,
    headerSize: 'prominent',
    allowedSizes: ['prominent', 'full'],
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
]

// check whether the headerConfigs contain an entry matching the headerType-prop
const customSiteHeader = headerConfigs.find((config: any) => config.name === props.headerType) || {}
// if customHeaderConfig contains entries then convert formatOptions to json
const siteHeader = customSiteHeader.formatOptions ? customSiteHeader.formatOptions.toJSON() : {}

// get default Header, if not found, take 'simple'
const defaultHeader = headerTypes.find((type) => type.name === props.headerType) || headerTypes[0]

const headerprops = Object.assign(defaultHeader, siteHeader, props.formatOptions)

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
