<script lang="ts" setup>
import { defineBlock, textField, numberField } from '#pruvious'
import type { Product } from '../graphql'

defineBlock({
  icon: 'Pencil',
  label: 'B: Slider',
})

defineProps({
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '2',
    default: 2,
    min: 1,
    max: 3,
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
      <Heading v-if="title" :content="title" :is="`h${level ? level : 2}`" />
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
  --color-base: var(--color-card-base);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-card-base);
  color: var(--color-card-contrast);
}

.section-muted {
  --color-base: var(--color-muted-base);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-muted-base);
  color: var(--color-card-contrast);
}

.section-accent {
  --color-base: var(--color-accent-base);
  --color-contrast: var(--color-accent-contrast);
  --color-muted-contrast: var(--color-accent-contrast);
  --link: var(--color-primary-base);
  background-color: var(--color-accent-base);
  color: var(--color-accent-contrast);
}
</style>
