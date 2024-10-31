<script lang="ts" setup>
import { SfRating, SfCounter, SfButton, SfIconShoppingCart, SfIconFavorite, SfIconFavoriteFilled } from '@crearis/vue'
import type { Product } from '~/graphql'

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
  <div class="relative flex min-h-[330px] flex-col justify-around rounded-md border border-neutral-200 hover:shadow-lg">
    <div class="relative">
      <NuxtLink :to="slug">
        <NuxtImg :alt="imageAlt" :loading="loading" :src="imageUrl" height="370" width="370" class="rounded-md" />
      </NuxtLink>

      <SfButton
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
      </SfButton>
    </div>
    <div class="typography-text-sm flex h-full flex-col justify-between gap-1 border-t border-neutral-200 p-2">
      <NuxtLink :to="slug" variant="secondary" class="self-start text-left no-underline">
        {{ name }}
      </NuxtLink>
      <div class="flex items-center">
        <SfRating :max="5" :value="rating ?? 0" size="xs" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>
      <p v-if="description" class="typography-text-sm block font-normal leading-5 text-neutral-700">
        {{ description }}
      </p>
      <div class="flex justify-between">
        <div class="block">
          <span class="typography-text-sm font-bold">{{ $currency(regularPrice) }}</span>
          <span v-if="specialPrice" class="typography-text-xs ml-1.5 font-normal line-through">
            {{ $currency(specialPrice) }}
          </span>
        </div>
        <SfButton @click="cartAdd(firstVariant?.id, 1)" size="sm" type="button" class="ottom-2">
          <template #prefix>
            <SfIconShoppingCart size="sm" />
          </template>
          Add
        </SfButton>
      </div>
    </div>
  </div>
</template>
