<script setup lang="ts">
import { SfScrollable } from '@crearis/vue';
import type { Product } from '@crearis/data-main/graphql';
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
});

const { loadProductTemplateList, loading, productTemplateList } = useProductTemplateList('');
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const numOfProducts = 10;
// #TODO _05 reenable loadProductTemplateList
await loadProductTemplateList({ pageSize: numOfProducts });
</script>

<template>
  <NarrowContainer>
    <h2 v-if="headline" class="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2">
      {{ headline }}
    </h2>
    <p class="my-4 typography-text-lg">
      {{ overline }}
    </p>
    <SfScrollable
      v-if="productTemplateList.length > 0"
      buttons-placement="floating"
      class="items-center pb-4"
      data-testid="product-slider"
    >
      <LazyUiProductCard
        v-for="productTemplate in productTemplateList"
        :key="productTemplate.id"
        class="min-w-[190px]"
        :slug="mountUrlSlugForProductVariant(productTemplate.firstVariant as Product) || ''"
        :name="productTemplate?.name || ''"
        :image-url="$getImage(String(productTemplate.image), 370, 370, String(productTemplate.imageFilename))"
        :image-alt="productTemplate?.name || ''"
        :first-variant="productTemplate.firstVariant as Product"
        :regular-price="getRegularPrice(productTemplate.firstVariant as Product)"
        :special-price="getSpecialPrice(productTemplate.firstVariant as Product)"
        :is-in-wishlist="productTemplate?.isInWishlist || false"
        :rating-count="productTemplate.ratingCount"
        :rating="productTemplate.rating"
      />
    </SfScrollable>
  </NarrowContainer>
</template>