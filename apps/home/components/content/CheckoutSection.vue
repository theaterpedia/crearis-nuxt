<template>
  <Section background="muted">
    <Container>
      <Columns gap="medium">
        <!-- Left: Variant Selector (33%) -->
        <Column width="1/3">
          <div class="variant-selector-wrapper">
            <h4 class="selector-heading">Terminauswahl</h4>
            <ProductVariantSelector
              v-model="selectedSrc"
              :variants="parsedVariants"
            />
          </div>
        </Column>

        <!-- Right: Checkout Stepper (66%) -->
        <Column width="2/3">
          <ContentQuery v-if="selectedSrc" v-slot="{ data }" :path="selectedSrc" find="one">
            <DataViewDetails :product="data" :src="selectedSrc" />
          </ContentQuery>
        </Column>
      </Columns>
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import { Column, Columns, Container, Section, ProductVariantSelector, type ProductVariant } from '@crearis/ui'
import DataViewDetails from './DataViewDetails.vue'

/**
 * CheckoutSection - Combined variant selector + checkout stepper
 *
 * Renders a 2-column layout with:
 * - Left (33%): ProductVariantSelector with mini-cards
 * - Right (66%): DataViewDetails checkout stepper for selected variant
 *
 * Receives same `tabs` prop as DataViewTabs for compatibility.
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
   * Same format as DataViewTabs for compatibility
   */
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true,
  },
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

// Track selected variant (default to first)
const selectedSrc = ref(props.tabs[0]?.src || '')
</script>

<style scoped>
.variant-selector-wrapper {
  padding: 1rem;
}

.selector-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-contrast);
}
</style>
