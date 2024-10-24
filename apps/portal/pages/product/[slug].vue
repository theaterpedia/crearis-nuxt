<template>
  <NuxtLayout :breadcrumbs="breadcrumbs" name="default">
    <SectionContainer>
      <NuxtErrorBoundary>
        <div class="grid-areas-product-page grid-cols-product-page gap-x-6 md:grid">
          <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
            <NuxtLazyHydrate when-idle>
              <UiGallery :images="getImages" />
            </NuxtLazyHydrate>
          </section>

          <section class="grid-in-right mb-10 md:mb-0">
            <NuxtLazyHydrate when-idle>
              <div
                data-testid="purchase-card"
                class="p-6 md:sticky md:top-20 md:rounded-md md:border md:border-neutral-100 md:shadow-lg xl:p-6"
              >
                <div
                  class="bg-secondary-800 mb-4 inline-flex items-center justify-center gap-1 rounded-none p-1.5 text-sm font-medium"
                >
                  <SfIconSell color="white" size="sm" class="mr-1" />
                  <span class="mr-1 text-white">{{ $t(`sale`) }}</span>
                </div>
                <h1 data-testid="product-name" class="typography-headline-4 mb-1 font-bold">
                  {{ productVariant?.name }}
                </h1>
                <div v-if="productVariant && productVariant?.combinationInfoVariant?.has_discounted_price" class="my-1">
                  <span data-testid="price" class="text-secondary-700 font-headings mr-2 text-2xl font-bold">
                    ${{ getSpecialPrice }}
                  </span>
                  <span class="text-base font-normal text-neutral-500 line-through">${{ getRegularPrice }}</span>
                </div>
                <div v-else class="my-1">
                  <span data-testid="price" class="text-secondary-700 font-headings mr-2 text-2xl font-bold">
                    ${{ getRegularPrice }}
                  </span>
                </div>
                <div class="mb-2 mt-4 inline-flex items-center">
                  <SfRating :max="5" :value="4" size="xs" />
                  <SfCounter size="xs" class="ml-1">26</SfCounter>
                  <SfLink href="#" variant="secondary" class="ml-2 text-xs text-neutral-500">26 reviews</SfLink>
                </div>
                <p data-testid="product-description" class="typography-text-sm mb-4 font-normal">
                  {{ productVariant?.description }}
                </p>
                <div class="mb-4 border-y border-gray-200 py-4">
                  <div
                    v-show="productsInCart"
                    class="bg-primary-200 text-primary-700 mb-4 w-full rounded-md p-2 text-center"
                  >
                    <SfIconShoppingCartCheckout />
                    {{ productsInCart }} products in cart
                  </div>
                  <div class="flex flex-col flex-wrap gap-4 md:flex-row">
                    <UiQuantitySelector
                      v-model="quantitySelectorValue"
                      :value="quantitySelectorValue"
                      class="min-w-[145px] flex-shrink-0 flex-grow basis-0"
                    />
                    <ButtonTmp
                      :disabled="loadingProductVariant"
                      @click="handleCartAdd"
                      size="medium"
                      type="button"
                      class="flex-shrink flex-grow-[2] basis-auto whitespace-nowrap"
                    >
                      <template #prefix>
                        <SfIconShoppingCart size="sm" />
                      </template>
                      {{ $t('addToCart') }}
                    </ButtonTmp>
                  </div>
                  <div class="mt-4 flex justify-center gap-x-4">
                    <ButtonTmp size="small" type="button" variant="tertiary">
                      <template #prefix>
                        <SfIconCompareArrows size="sm" />
                      </template>
                      {{ $t('compare') }}
                    </ButtonTmp>
                    <ButtonTmp
                      @click="
                        isInWishlist(productVariant?.id as number)
                          ? handleWishlistRemoveItem(productVariant)
                          : handleWishlistAddItem(productVariant)
                      "
                      size="small"
                      type="button"
                      variant="tertiary"
                      :class="productVariant?.isInWishlist ? 'bg-primary-100' : 'bg-white'"
                    >
                      <SfIconFavoriteFilled v-show="isInWishlist(productVariant?.id as number)" size="sm" />
                      <SfIconFavorite v-show="!isInWishlist(productVariant?.id as number)" size="sm" />
                      {{
                        isInWishlist(productVariant?.id as number)
                          ? $t('wishlist.removeFromWishlist')
                          : $t('wishlist.addToWishlist')
                      }}
                    </ButtonTmp>
                  </div>
                </div>
                <div class="flex first:mt-4">
                  <SfIconPackage size="sm" class="mr-1 flex-shrink-0 text-neutral-500" />
                  <p class="text-sm">
                    <i18n-t keypath="additionalInfo.shipping" scope="global">
                      <template #date>
                        {{ tomorrow }}
                      </template>
                      <template #addAddress>
                        <ButtonTmp to="#" variant="link" class="ml-1">{{ $t('additionalInfo.addAddress') }}</ButtonTmp>
                      </template>
                    </i18n-t>
                  </p>
                </div>
                <div class="mt-4 flex">
                  <SfIconWarehouse size="sm" class="mr-1 flex-shrink-0 text-neutral-500" />
                  <p class="text-sm">
                    <i18n-t keypath="additionalInfo.pickup" scope="global">
                      <template #checkAvailability>
                        <ButtonTmp to="#" variant="link" class="ml-1">
                          {{ $t('additionalInfo.checkAvailability') }}
                        </ButtonTmp>
                      </template>
                    </i18n-t>
                  </p>
                </div>
                <div class="mt-4 flex">
                  <SfIconSafetyCheck size="sm" class="mr-1 flex-shrink-0 text-neutral-500" />
                  <i18n-t keypath="additionalInfo.returns" scope="global">
                    <template #details>
                      <ButtonTmp to="#" variant="link" class="ml-1">{{ $t('additionalInfo.details') }}</ButtonTmp>
                    </template>
                  </i18n-t>
                </div>
              </div>
            </NuxtLazyHydrate>
          </section>
          <section class="grid-in-left-bottom md:mt-8">
            <UiDivider class="mb-6" />
            <NuxtLazyHydrate when-visible>
              <div data-testid="product-properties" class="lg:px-4">
                <fieldset v-if="getAllSizes && getAllSizes?.length" class="flex pb-4">
                  <legend class="mb-2 block text-base font-medium leading-6 text-neutral-900">Size</legend>
                  <span v-for="{ label, value } in getAllSizes" :key="value" class="mb-2 mr-2 uppercase">
                    <SfChip
                      :input-props="{
                        onClick: (e) => value == selectedSize && e.preventDefault(),
                      }"
                      :model-value="value == selectedSize"
                      :v-model="value"
                      @update:model-value="value != selectedSize && updateFilter({ ['Size']: value.toString() })"
                      size="sm"
                      class="min-w-[48px]"
                    >
                      {{ label }}
                    </SfChip>
                  </span>
                </fieldset>
                <fieldset v-if="getAllColors && getAllColors?.length" class="flex pb-2">
                  <legend class="mb-2 block text-base font-medium leading-6 text-neutral-900">Color</legend>
                  <span v-for="{ label, value } in getAllColors" :key="value" class="mb-2 mr-2 uppercase">
                    <SfChip
                      :input-props="{
                        onClick: (e) => value == selectedColor && e.preventDefault(),
                      }"
                      :model-value="value == selectedColor"
                      :v-model="value"
                      @update:model-value="value != selectedColor && updateFilter({ ['Color']: value.toString() })"
                      size="sm"
                      class="min-w-[48px]"
                    >
                      <template #prefix>
                        <SfThumbnail size="sm" :style="{ background: label }" />
                      </template>
                      {{ label }}
                    </SfChip>
                  </span>
                </fieldset>
                <fieldset v-if="getAllMaterials && getAllMaterials?.length" class="flex pb-4">
                  <legend class="mb-2 block text-base font-medium leading-6 text-neutral-900">Material</legend>
                  <span v-for="{ label, value } in getAllMaterials" :key="value" class="mb-2 mr-2 uppercase">
                    <SfChip
                      :input-props="{
                        onClick: (e) => value == selectedMaterial && e.preventDefault(),
                      }"
                      :model-value="value == selectedMaterial"
                      :v-model="value"
                      @update:model-value="
                        value != selectedMaterial && updateFilter({ ['Material']: value.toString() })
                      "
                      size="sm"
                      class="min-w-[48px]"
                    >
                      {{ label }}
                    </SfChip>
                  </span>
                </fieldset>
              </div>
            </NuxtLazyHydrate>
            <UiDivider class="mb-2 mt-4 md:mt-8" />
            <NuxtLazyHydrate when-visible>
              <div data-testid="product-accordion">
                <UiAccordionItem
                  v-model="productDetailsOpen"
                  summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
                >
                  <template #summary>
                    <h2 class="font-headings text-lg font-bold leading-6 md:text-2xl">
                      {{ $t('productDetails') }}
                    </h2>
                  </template>
                  <p>
                    {{ productVariant?.description }}
                  </p>
                </UiAccordionItem>
                <UiDivider class="my-4" />
                <UiAccordionItem
                  summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
                >
                  <template #summary>
                    <h2 class="font-headings text-lg font-bold leading-6 md:text-2xl">
                      {{ $t('customerReviews') }}
                    </h2>
                  </template>
                  <p>Lightweight • Non slip • Flexible outsole • Easy to wear on and off</p>
                </UiAccordionItem>
              </div>
            </NuxtLazyHydrate>
          </section>
          <UiDivider class="mb-2 mt-4" />
        </div>

        <section class="mx-4 mb-20 mt-28">
          <NuxtLazyHydrate when-visible>
            <ProductSlider text="Recommended with this product" />
          </NuxtLazyHydrate>
        </section>
        <template #error="{ error }">
          <div>
            <NuxtImg :alt="$t('emptyStateAltText')" height="300" src="/images/something-went-wrong.svg" width="300" />
            <p class="mt-8 font-medium">{{ $t('emptyStateText') }}</p>
          </div>
        </template>
      </NuxtErrorBoundary>
    </SectionContainer>
  </NuxtLayout>
  <!-- ContentDoc / -->
</template>

<script lang="ts" setup>
import {
  SfChip,
  SfCounter,
  SfIconCompareArrows,
  SfIconFavorite,
  SfIconFavoriteFilled,
  SfIconPackage,
  SfIconSafetyCheck,
  SfIconSell,
  SfIconShoppingCart,
  SfIconShoppingCartCheckout,
  SfIconWarehouse,
  SfRating,
  SfThumbnail,
} from '@crearis/vue'
import type { LocationQueryRaw } from 'vue-router'
import type { OrderLine } from '@crearis/data/graphql'
import type { Product } from '@crearis/data/graphql'
import ButtonTmp from '../../components/ButtonTmp.vue'

const route = useRoute()
const router = useRouter()

const { loadProductTemplate, productTemplate, loadingProductTemplate, getAllColors, getAllMaterials, getAllSizes } =
  useProductTemplate(route.path)
const {
  loadProductVariant,
  loadingProductVariant,
  productVariant,
  getImages,
  breadcrumbs,
  getRegularPrice,
  getSpecialPrice,
} = useProductVariant(route.fullPath)
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()
const { cart, cartAdd } = useCart()

const params = computed(() => ({
  combinationId: Object.values(route.query)?.map((value) => parseInt(value as string)),
  productTemplateId: productTemplate?.value?.id,
}))

const selectedSize = computed(() => Number(route.query.Size))
const selectedColor = computed(() => Number(route.query.Color))
const selectedMaterial = computed(() => Number(route.query.Material))
const productDetailsOpen = ref(true)
const quantitySelectorValue = ref(1)

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  router.push({
    path: route.path,
    query: { ...route.query, ...filter },
  })
}

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toDateString().slice(0, 10)
})

const productsInCart = computed(() => {
  return (
    cart.value?.order?.orderLines?.find((orderLine: OrderLine) => orderLine.product?.id === productVariant?.value.id)
      ?.quantity || 0
  )
})

// #TODO _07 clear Nuxt-Warning [useFetch] Component is already mounted
// nuxt tells us: please use $fetch instead. See https://nuxt.com/docs/getting-started/data-fetching
// seems something within @erpgap_odoo-sdk, hard-setting ofetch to $fetch doesn't work
const handleCartAdd = async () => {
  await cartAdd(productVariant?.value.id, quantitySelectorValue.value)
}

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id)
}

await loadProductTemplate({ slug: route.path })
await loadProductVariant(params.value)
</script>
