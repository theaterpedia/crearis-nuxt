<template>
  <ContentRenderer :value="data">
    <!-- Product slider -->
    <Heading
      v-if="data.heading"
      :content="heading ? heading : data.heading ? data.heading.toString() : default_heading"
      is="h3"
    ></Heading>
    <br />
    <MdBlock v-if="data.product?.header" :content="data.product?.header" htag="h2" />
    <Slider>
      <Slide v-for="(item, index) in data.items">
        <Columns gap="small">
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

    <!-- Checkout box below slider -->
    <div class="checkout-box">
      <!-- Left column: pricing -->
      <Section v-if="pricing" background="accent">
        <Container>
          <h4 class="section-label">Kosten & Konditionen</h4>
          <Catalog>
            <Prose>
              <div v-html="pricing" />
            </Prose>
          </Catalog>
        </Container>
      </Section>

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
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { Container, Section, Catalog, Prose, Button } from '@crearis/ui'

/**
 * DataViewCheckout - Single product checkout view
 *
 * Renders slider + pricing box + CTA for a single product (no variants).
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

const shortcodeTitle = (shortcode: string | undefined, title: string) => {
  if (!shortcode) return title
  return `_${shortcode.toUpperCase()}_ ${title}`
}

const default_heading = '## Default Heading'

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

.checkout-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
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
