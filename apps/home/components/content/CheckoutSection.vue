<template>
  <div class="checkout-wrapper">
    <!-- Slider for selected variant -->
    <ContentQuery v-if="selectedSrc" v-slot="{ data }" :path="selectedSrc" :key="selectedSrc" find="one">
      <DataViewProduct :data="data" :src="selectedSrc" mode="checkout" theme="dasei" />

      <!-- Variant selector in white section, visually connected to slider -->
      <div class="variant-selector-section">
        <Container>
          <h4 class="section-label section-label--selector">{{ computedSelectorLabel }}</h4>
          <ProductVariantSelector
            v-model="selectedSrc"
            :variants="parsedVariants"
            @update:model-value="onVariantChange"
          />
        </Container>
      </div>

      <!-- Pricing + CTA in muted section -->
      <Section background="muted">
        <Container>
          <div class="checkout-box">
            <!-- Left column: pricing -->
            <div class="checkout-left">
              <div v-if="getPricing(data)" class="pricing-section">
                <h4 class="section-label">Kosten & Konditionen</h4>
                <Catalog>
                  <Prose>
                    <div v-html="getPricing(data)" />
                  </Prose>
                </Catalog>
              </div>
            </div>

            <!-- Right column: CTA button -->
            <div class="checkout-right">
              <Button
                variant="primary"
                size="medium"
                class="checkout-cta"
                @click="handleCheckout"
              >
                Details & Buchung
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </ContentQuery>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Container, Section, ProductVariantSelector, Catalog, Prose, Button, type ProductVariant } from '@crearis/ui'
import DataViewProduct from './DataViewProduct.vue'

/**
 * CheckoutSection - Slider with variant selector and CTA
 *
 * Renders:
 * 1. Slider (DataViewProduct) for selected variant
 * 2. Checkout box with mini-cards, pricing, and CTA button
 *
 * CTA navigates to stepper page with productRef query param.
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
  /**
   * Label for the variant selector section.
   * If not provided, auto-detects based on route:
   * - 'aufbaustufe' pages → 'Profilauswahl'
   * - 'einstiege' pages → 'Kursverlauf'
   * - default → 'Terminauswahl'
   */
  selectorLabel: {
    type: String,
    default: undefined,
  },
})

const route = useRoute()
const router = useRouter()

// Auto-detect selector label based on route path
const computedSelectorLabel = computed(() => {
  if (props.selectorLabel) return props.selectorLabel
  const path = route.path.toLowerCase()
  if (path.includes('aufbaustufe')) return 'Profilauswahl'
  if (path.includes('einstiege')) return 'Kursverlauf'
  return 'Terminauswahl'
})

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

// Update URL when variant changes and scroll to #buchen after content renders
const onVariantChange = async (newSrc: string) => {
  const shortcode = findShortcodeBySrc(newSrc)
  if (shortcode) {
    // Update URL without hash - don't let router scroll yet
    await router.replace({
      query: {
        ...route.query,
        product: shortcode.toLowerCase(),
      },
    })
    // Wait for content to re-render (ContentQuery + DataViewProduct), then scroll
    setTimeout(() => {
      const anchor = document.getElementById('buchen')
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150) // Small delay to allow slider content to load
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

// Extract pricing markdown from data.details.konditionen.info.kosten
const getPricing = (data: Record<string, unknown>): string | undefined => {
  const details = data?.details as Record<string, unknown> | undefined
  const konditionen = details?.konditionen as Record<string, unknown> | undefined
  const info = konditionen?.info as Record<string, unknown> | undefined
  const kosten = info?.kosten as string | undefined
  if (kosten) {
    return renderMdProp(kosten, 'h3', true)
  }
  return undefined
}

// Navigate to stepper/checkout page
const handleCheckout = () => {
  const shortcode = findShortcodeBySrc(selectedSrc.value)
  router.push({
    path: '/details',
    query: {
      src: selectedSrc.value,
      product: shortcode?.toLowerCase(),
    },
  })
}
</script>

<style scoped>
.checkout-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1.5rem 0;
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.variant-selector-section {
  background-color: #fff;
  padding-top: 0.5rem; /* 8px */
  padding-bottom: 1.75rem;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-contrast);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.section-label--selector {
  margin-bottom: 0.375rem; /* Half of normal */
}

/* Mobile: hide selector label */
@media (max-width: 767px) {
  .section-label--selector {
    display: none;
  }
}

.checkout-cta {
  width: 100%;
  max-width: 280px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Mobile: stack vertically */
@media (max-width: 768px) {
  .checkout-box {
    grid-template-columns: 1fr;
  }

  .checkout-right {
    justify-content: stretch;
  }

  .checkout-cta {
    max-width: none;
    width: 100%;
  }
}
</style>
