<template>
  <!-- Slider for selected variant -->
  <ContentQuery v-if="selectedSrc" v-slot="{ data }" :path="selectedSrc" :key="selectedSrc" find="one">
    <DataViewProduct :data="data" :src="selectedSrc" />

    <!-- Checkout box below slider -->
    <Section background="muted">
      <Container>
        <div class="checkout-box">
          <!-- Left column: variants + pricing -->
          <div class="checkout-left">
            <!-- Variant selector -->
            <div class="variant-section">
              <h4 class="section-label">Terminauswahl</h4>
              <ProductVariantSelector
                v-model="selectedSrc"
                :variants="parsedVariants"
                @update:model-value="onVariantChange"
              />
            </div>

            <!-- Pricing box -->
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

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-contrast);
  text-transform: uppercase;
  letter-spacing: 0.025em;
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
