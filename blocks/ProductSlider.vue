<script lang="ts" setup>
import { defineBlock, textField } from '#pruvious'
import type { Product } from '../graphql'

defineBlock({
  icon: 'Pencil',
  label: 'Product Slider',
})

defineProps({
  headline: textField({
    placeholder: 'Titel eingeben',
  }),
  overline: textField({
    placeholder: 'Titel eingeben',
  }),
})

const { loadProductTemplateList, loading, productTemplateList } = useProductTemplateList('')
const { getRegularPrice, getSpecialPrice } = useProductAttributes()

const numOfProducts = 10
// #TODO _05 reenable loadProductTemplateList
await loadProductTemplateList({ pageSize: numOfProducts })
</script>

<template>
  <div class="section">
    <div class="container">
      <p class="typography-text-lg my-4">
        {{ overline }}
      </p>      
      <h2 v-if="headline" class="typography-headline-3 md:typography-headline-2 mb-6 text-center font-bold">
        {{ headline }}
      </h2>
      <SfScrollable
        v-if="productTemplateList?.length > 0"
        buttons-placement="floating"
        data-testid="product-slider"
        class="items-center pb-4"
      >
        <LazyUiProductCard
          v-for="productTemplate in productTemplateList"
          :first-variant="productTemplate.firstVariant"
          :image-alt="productTemplate?.name || ''"
          :image-url="$getImage(String(productTemplate.image), 370, 370, String(productTemplate.imageFilename))"
          :is-in-wishlist="productTemplate?.isInWishlist || false"
          :key="productTemplate.id"
          :name="productTemplate?.name || ''"
          :rating="productTemplate.rating"
          :rating-count="productTemplate.ratingCount"
          :regular-price="getRegularPrice(productTemplate.firstVariant as Product)"
          :slug="mountUrlSlugForProductVariant(productTemplate.firstVariant as Product) || ''"
          :special-price="getSpecialPrice(productTemplate.firstVariant as Product)"
          class="min-w-[190px]"
        />
      </SfScrollable>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 90rem; /* 1440px */
  margin-right: auto;
  margin-left: auto;
  padding-right: 1.75rem; /* 28px */
  padding-left: 1.75rem; /* 28px */
}

.container > * + * {
  margin-top: 1.75rem; /* 28px */
}

@media (max-width: 767px) {
  .container {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
.section {
  position: relative;
  z-index: 1;
  padding-top: 1.75rem; /* 28px */
  padding-bottom: 1.75rem; /* 28px */
  transform: translate3d(0, 0, 0); /* Fixes z-index in Safari */
}

.section-default {
  --background: var(--card);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.section-muted {
  --background: var(--muted);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--muted));
  color: hsl(var(--card-foreground));
}

.section-accent {
  --background: var(--accent);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary);
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
</style>

