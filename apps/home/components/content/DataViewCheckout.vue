<template>
  <ContentRenderer :value="data">
    <!-- Delegate slider + heading to DataViewProduct in checkout mode -->
    <DataViewProduct :data="data" :heading="heading" :src="src" mode="checkout" theme="dasei" />

    <!-- Pricing + CTA in muted section (matches CheckoutSection layout) -->
    <Section background="muted">
      <Container>
        <div class="checkout-box">
          <!-- Left column: pricing -->
          <div class="checkout-left">
            <div v-if="pricing" class="pricing-section">
              <h4 class="section-label">Kosten & Konditionen</h4>
              <Catalog>
                <Prose>
                  <div v-html="pricing" />
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
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { Container, Section, Catalog, Prose, Button } from '@crearis/ui'
import DataViewProduct from './DataViewProduct.vue'

/**
 * DataViewCheckout - Single product checkout view
 *
 * Delegates slider rendering to DataViewProduct (mode="checkout") for consistent
 * heading, slide_2cols, first/last slide handling, and product.header display.
 * Adds its own pricing + CTA box below (same layout as CheckoutSection).
 *
 * Used via embed syntax: ![[path|view="checkout"]]
 */

const props = defineProps({
  /**
   * Heading override
   */
  heading: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
  },
  /**
   * Product data from ContentQuery
   */
  data: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
  /**
   * Source path
   */
  src: {
    type: String,
    required: true,
  },
})

const router = useRouter()

// Extract pricing markdown from data.details.konditionen.info.kosten
const pricing = computed(() => {
  const details = props.data?.details as Record<string, unknown> | undefined
  const konditionen = details?.konditionen as Record<string, unknown> | undefined
  const info = konditionen?.info as Record<string, unknown> | undefined
  const kosten = info?.kosten as string | undefined
  if (kosten) {
    return renderMdProp(kosten, 'h3', true)
  }
  return undefined
})

// Navigate to stepper/checkout page
const handleCheckout = () => {
  router.push({
    path: '/details',
    query: {
      src: props.src,
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
