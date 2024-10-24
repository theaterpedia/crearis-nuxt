<script lang="ts" setup>
import { SfScrollable } from '@crearis/vue'
import type { Product } from '@crearis/data/graphql'
import { defineBlock, textField } from '#pruvious'

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
  <SectionContainer>
    <h2 v-if="headline" class="typography-headline-3 md:typography-headline-2 mb-6 text-center font-bold">
      {{ headline }}
    </h2>
    <p class="typography-text-lg my-4">
      {{ overline }}
    </p>
    <SfScrollable
      v-if="productTemplateList.length > 0"
      buttons-placement="floating"
      data-testid="product-slider"
      class="items-center pb-4"
    >
      <LazyUiProductCard
        v-for="productTemplate in productTemplateList"
        :first-variant="productTemplate.firstVariant as Product"
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
  </SectionContainer>
</template>
