<template>
  <!-- Variant selector above stepper -->
  <Section background="muted">
    <Container>
      <div class="variant-selector-wrapper">
        <h4 class="selector-heading">Terminauswahl</h4>
        <ProductVariantSelector
          v-model="selectedSrc"
          :variants="parsedVariants"
          @update:model-value="onVariantChange"
        />
      </div>
    </Container>
  </Section>

  <!-- Stepper content for selected variant -->
  <ContentQuery v-if="selectedSrc" v-slot="{ data }" :path="selectedSrc" :key="selectedSrc" find="one">
    <DataViewDetails :product="data" :src="selectedSrc" :key="selectedSrc" />
  </ContentQuery>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, type PropType } from 'vue'
import { Container, Section, ProductVariantSelector, type ProductVariant } from '@crearis/ui'
import DataViewDetails from './DataViewDetails.vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * StepperSection - Inline stepper with variant selector in header
 *
 * Renders variant mini-cards above the DataViewDetails stepper.
 * Syncs selected variant with ?product= URL param.
 */

interface TabItem {
  /** Tab title with format "SHORTCODE **Label**" */
  title: string
  /** Content source path */
  src: string
  /** Optional view type */
  view?: string
}

const props = defineProps({
  /**
   * Array of tab items from parseTabs()
   */
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()

// Parse tab titles to extract shortcode and subline
// Format: "M18W **München**" → { shortcode: "M18W", subline: "München" }
const parsedVariants = computed<ProductVariant[]>(() => {
  return props.tabs.map((tab) => {
    // Match pattern: "SHORTCODE **Label**" or just "SHORTCODE Label"
    const boldMatch = tab.title.match(/^([A-Z0-9]+)\s+\*\*(.+)\*\*$/)
    if (boldMatch) {
      return {
        shortcode: boldMatch[1],
        subline: boldMatch[2],
        src: tab.src,
      }
    }

    // Fallback: split on first space
    const parts = tab.title.split(/\s+/, 2)
    return {
      shortcode: parts[0] || tab.title,
      subline: parts[1] || '',
      src: tab.src,
    }
  })
})

// Find src by shortcode (case-insensitive)
const findSrcByShortcode = (shortcode: string): string | undefined => {
  const variant = parsedVariants.value.find(
    v => v.shortcode.toLowerCase() === shortcode.toLowerCase()
  )
  return variant?.src
}

// Find shortcode by src
const findShortcodeBySrc = (src: string): string | undefined => {
  const variant = parsedVariants.value.find(v => v.src === src)
  return variant?.shortcode
}

// Initialize from URL param or default to first
const getInitialSrc = (): string => {
  const productParam = route.query.product as string | undefined
  if (productParam) {
    const src = findSrcByShortcode(productParam)
    if (src) return src
  }
  return props.tabs[0]?.src || ''
}

const selectedSrc = ref(getInitialSrc())

// Update URL when variant changes
const onVariantChange = (newSrc: string) => {
  const shortcode = findShortcodeBySrc(newSrc)
  if (shortcode) {
    router.replace({
      query: {
        ...route.query,
        product: shortcode.toLowerCase(),
      },
    })
  }
}

// Watch for external URL changes (browser back/forward)
watch(() => route.query.product, (newProduct) => {
  if (newProduct && typeof newProduct === 'string') {
    const src = findSrcByShortcode(newProduct)
    if (src && src !== selectedSrc.value) {
      selectedSrc.value = src
    }
  }
})
</script>

<style scoped>
.variant-selector-wrapper {
  padding: 1rem 0;
}

.selector-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-contrast);
}
</style>
