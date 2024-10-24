<script lang="ts" setup>
import { SfRating, SfCounter, SfIconShoppingCart, SfIconFavorite, SfIconFavoriteFilled } from '@crearis/vue'
import type { Product } from '@crearis/data-main/graphql'
import ButtonTmp from '../../components/ButtonTmp.vue'

defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ratingCount: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  specialPrice: {
    type: Number,
    required: false,
  },
  firstVariant: {
    type: Object,
    required: false,
  },
  loading: {
    type: String as PropType<'eager' | 'lazy' | undefined>,
    required: false,
    default: 'lazy',
  },
})

const { cartAdd } = useCart()
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id)
}
</script>
<template>
  <div class="relative min-h-[350px] rounded-md border border-neutral-200 hover:shadow-lg">
    <div class="relative">
      <NuxtLink :to="slug">
        <NuxtImg :alt="imageAlt" :height="370" :loading="loading" :src="imageUrl" :width="370" class="rounded-md" />
      </NuxtLink>

      <ButtonTmp
        @click="
          isInWishlist(firstVariant?.id)
            ? handleWishlistRemoveItem(firstVariant as Product)
            : handleWishlistAddItem(firstVariant as Product)
        "
        aria-label="Add to wishlist"
        size="sm"
        square
        type="button"
        variant="tertiary"
        :class="[
          'absolute bottom-0 right-0 mb-2 mr-2 !rounded-full border border-neutral-200 bg-white',
          { '!bg-green-200': isInWishlist(firstVariant?.id) },
        ]"
      >
        <SfIconFavoriteFilled v-if="isInWishlist(firstVariant?.id)" size="sm" />
        <SfIconFavorite v-else size="sm" />
      </ButtonTmp>
    </div>
    <div class="typography-text-sm border-t border-neutral-200 p-2">
      <NuxtLink :to="slug" variant="secondary" class="no-underline">
        {{ name }}
      </NuxtLink>
      <div class="flex items-center pt-1">
        <SfRating :max="5" :value="rating ?? 0" size="xs" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>
      <p v-if="description" class="typography-text-sm block py-2 font-normal leading-5 text-neutral-700">
        {{ description }}
      </p>
      <div class="block pb-10 pt-3">
        <span class="typography-text-sm font-bold">${{ regularPrice }}</span>
        <span v-if="specialPrice" class="typography-text-xs ml-1.5 font-normal line-through">${{ specialPrice }}</span>
      </div>
      <ButtonTmp @click="cartAdd(firstVariant?.id, 1)" size="small" type="button" class="absolute bottom-2">
        <template #prefix>
          <SfIconShoppingCart size="sm" />
        </template>
        Add
      </ButtonTmp>
    </div>
  </div>
</template>
