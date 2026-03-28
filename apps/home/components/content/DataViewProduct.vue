<template>
  <ContentRenderer :value="data">
    <!-- Checkout mode: H2 heading with padding on left/right only -->
    <div v-if="mode === 'checkout'" :class="['checkout-heading-wrapper', { 'subline-highlight': isFirstSlide || isLastSlide }]">
      <Heading
        v-if="data.heading"
        :content="heading ? heading : data.heading ? data.heading.toString() : default_heading"
        is="h2"
      ></Heading>
      <!-- Product header + link: show always if <= 6 slides, otherwise only on first/last -->
      <template v-if="showProductMetaInCheckout">
        <MdBlock v-if="data.product?.header" :content="data.product?.header" htag="h3" class="checkout-product-header" />
        <NuxtLink 
          v-if="data.product?.link" 
          :to="data.product.link.to" 
          class="product-link"
        >
          {{ data.product.link.title }}
        </NuxtLink>
      </template>
    </div>
    <Slider v-if="mode === 'checkout'" class="checkout-slider" :first-slide-section="true" @slideChange="onSlideChange">
      <Slide v-for="(item, index) in itemsArray" :key="index">
        <!-- slide_2cols: Two-column layout with vertical separator -->
        <div v-if="item.ctype === 'slide_2cols'" class="slide-2cols">
          <Heading v-if="item.title" :content="item.title" is="h3" class="slide-2cols-title" />
          <div class="slide-2cols-content">
            <div class="slide-2cols-left">
              <Prose>
                <div v-html="renderMdProp(getSlide2ColsLeft(item.body), 'h4')" />
              </Prose>
            </div>
            <div class="slide-2cols-divider"></div>
            <div class="slide-2cols-right">
              <Prose>
                <div v-html="renderMdProp(getSlide2ColsRight(item.body), 'h4')" />
              </Prose>
              <div v-if="getSlide2ColsFooter(item.body)" class="slide-2cols-footer">
                <Prose>
                  <div v-html="renderMdProp(getSlide2ColsFooter(item.body), 'h4')" />
                </Prose>
              </div>
            </div>
          </div>
        </div>
        <!-- Default slide layout -->
        <Columns v-else gap="small">
          <Column v-if="item.image" width="1/5">
            <img :src="item.image.url" />
            <p>{{ item.tag }}</p>
          </Column>
          <Column>
            <Heading v-if="item.title" :content="shortcodeTitle(item.shortcode, item.title)" is="h3" />
            <Prose>
              <div v-html="renderMdProp(item.body, 'h3')" />
            </Prose>
          </Column>
        </Columns>
      </Slide>
    </Slider>
    <!-- Default mode: H3 heading -->
    <template v-else>
      <Heading
        v-if="data.heading"
        :content="heading ? heading : data.heading ? data.heading.toString() : default_heading"
        is="h3"
      ></Heading>
      <br />
      <MdBlock v-if="data.product?.header" :content="data.product?.header" htag="h2" />
      <Slider>
        <Slide v-for="(item, index) in itemsArray" :key="index">
          <!-- slide_2cols: Two-column layout with vertical separator -->
          <div v-if="item.ctype === 'slide_2cols'" class="slide-2cols">
            <Heading v-if="item.title" :content="item.title" is="h3" class="slide-2cols-title" />
            <div class="slide-2cols-content">
              <div class="slide-2cols-left">
                <Prose>
                  <div v-html="renderMdProp(getSlide2ColsLeft(item.body), 'h4')" />
                </Prose>
              </div>
              <div class="slide-2cols-divider"></div>
              <div class="slide-2cols-right">
                <Prose>
                  <div v-html="renderMdProp(getSlide2ColsRight(item.body), 'h4')" />
                </Prose>
                <div v-if="getSlide2ColsFooter(item.body)" class="slide-2cols-footer">
                  <Prose>
                    <div v-html="renderMdProp(getSlide2ColsFooter(item.body), 'h4')" />
                  </Prose>
                </div>
              </div>
            </div>
          </div>
          <!-- Default slide layout -->
          <Columns v-else gap="small">
            <Column v-if="item.image" width="1/5">
              <img :src="item.image.url" />
              <p>{{ item.tag }}</p>
            </Column>
            <Column>
              <Heading v-if="item.title" :content="shortcodeTitle(item.shortcode, item.title)" is="h3" />
              <Prose>
                <div v-html="renderMdProp(item.body, 'h3')" />
              </Prose>
            </Column>
          </Columns>
        </Slide>
      </Slider>
    </template>

    <ButtonTmp :to="{ path: '/details', props: src, query: { src: `/${src}` } }" id="cta" style="margin-top: 3em">
      Anmeldung und Konditionen
    </ButtonTmp>
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import MainMenuItem from '../../../../packages/ui/dist/components/MainMenuItem.vue'
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple product view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data in from yaml:items (view:product)
- product is a course > so the product view should be a course view > we take the slider>slides for now
*/

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
  heading: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
  },
  /**
   * Rendering mode
   * - 'default': Standard product view
   * - 'checkout': Checkout mode with H2 heading and conditional product meta
   */
  mode: {
    type: String as PropType<'default' | 'checkout'>,
    default: 'default',
  },
  /**
   *
   *
   * @default 'default'
   */
  type: {
    type: String as PropType<'yaml' | 'md' | 'all'>,
    default: 'yaml',
  },
  /**
   *
   */
  data: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
  /**
   *
   */
  src: {
    type: String,
    required: true,
  },
})

const shortcodeTitle = (shortcode: string | undefined, title: string) => {
  if (!shortcode) return title
  return `_${shortcode.toUpperCase()}_ ${title}`
}
const default_heading = '## Default Heading'

// Convert items object to array for iteration
const itemsArray = computed(() => {
  if (!props.data.items) return []
  return Object.values(props.data.items)
})

// Slide state tracking for checkout mode
const currentSlidePos = ref(0)
const slideCount = ref(0)
const isFirstSlide = computed(() => currentSlidePos.value === 0)
const isLastSlide = computed(() => currentSlidePos.value === slideCount.value - 1)

const onSlideChange = (payload: { isFirstSlide: boolean; isLastSlide: boolean; slideCount: number; currentSlidePos: number }) => {
  currentSlidePos.value = payload.currentSlidePos
  slideCount.value = payload.slideCount
}

// Show product.header + product.link in checkout mode:
// - Always if slidecount <= 6
// - Only on first/last slide if slidecount > 6
const showProductMetaInCheckout = computed(() => {
  const total = itemsArray.value.length
  if (total <= 6) return true
  return isFirstSlide.value || isLastSlide.value
})

// Determine if product.header and product.link should be shown for a slide
// If > 5 slides: only first and last; if <= 5: all slides
const showProductMeta = (index: number): boolean => {
  const totalSlides = itemsArray.value.length
  if (totalSlides <= 5) return true
  return index === 0 || index === totalSlides - 1
}

// slide_2cols helpers: split body by '---' delimiter
const getSlide2ColsLeft = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[0]?.trim() || ''
}

const getSlide2ColsRight = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[1]?.trim() || ''
}

const getSlide2ColsFooter = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[2]?.trim() || ''
}
</script>

<style scoped>
/* slide_2cols: Two-column bordered layout */
.slide-2cols {
  border: 2px solid var(--color-contrast, currentColor);
  padding: 1.5rem;
}

.slide-2cols-title {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-contrast, currentColor);
}

.slide-2cols-content {
  display: flex;
  gap: 1.5rem;
}

.slide-2cols-left,
.slide-2cols-right {
  flex: 1;
}

.slide-2cols-divider {
  width: 2px;
  background-color: var(--color-contrast, currentColor);
  flex-shrink: 0;
}

.slide-2cols-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-contrast, currentColor);
}

@media (max-width: 768px) {
  .slide-2cols {
    border: none;
    padding: 0;
  }
  
  .slide-2cols-content {
    flex-direction: column;
  }
  
  .slide-2cols-divider {
    width: 100%;
    height: 2px;
  }
}

/* Checkout mode: heading wrapper with padding matching Container */
.checkout-heading-wrapper {
  padding: 0 2.75rem; /* matches Container padding-left/right: 44px */
  padding-bottom: 1rem; /* ~16px spacing below subline */
}

@media (max-width: 767px) {
  .checkout-heading-wrapper {
    padding: 0 1rem; /* matches Container mobile padding */
    padding-bottom: 1rem;
  }
}

/* Checkout mode: style subline with primary background only on first/last slide */
.checkout-heading-wrapper.subline-highlight :deep(.subline) {
  display: inline-block;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  padding: 0 0.125em;
  line-height: 1.2;
}

/* Checkout mode: left-align heading text including overline */
.checkout-heading-wrapper :deep(.heading) {
  text-align: left;
}
.checkout-heading-wrapper :deep(.overline),
.checkout-heading-wrapper :deep(.subline) {
  text-align: left;
}

/* Checkout slider: hide back arrow on first slide */
.checkout-slider :deep(.slider-navigation button:first-child) {
  /* Will be hidden via Swiper's disabled state on first slide */
}

/* Checkout product header: spacing before and after */
.checkout-product-header {
  margin-bottom: 0.375rem; /* 6px */
  margin-top: 0.5rem; /* 8px */
  max-width: 600px;
}
.checkout-product-header :deep(p) {
  margin: 0;
}
.checkout-product-header :deep(.prose > div > p:first-child) {
  margin-top: 0;
}
.checkout-product-header :deep(.prose > div > p:last-child) {
  margin-bottom: 0;
}

/* Product link styling */
.product-link {
  display: inline-block;
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--color-primary-base);
  font-weight: 500;
  text-decoration: none;
}
.product-link:hover {
  text-decoration: underline;
}

/* slide_2cols: remove bullets and left margin/padding from lists */
.slide-2cols :deep(ul),
.slide-2cols :deep(ol) {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}

.slide-2cols :deep(li) {
  margin-left: 0;
  padding-left: 0;
}
</style>
