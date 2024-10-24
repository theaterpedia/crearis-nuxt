<template>
  <div v-if="cart?.order?.websiteOrderLine?.length > 0" class="pb-20">
    <div data-testid="cart-page-content" class="md:gap-x-6 lg:grid lg:grid-cols-12">
      <div class="col-span-7 mb-10 lg:mb-0">
        <div v-for="orderLine in cart.order?.orderLines" :key="orderLine?.id">
          <CartCollectedProductCard :order-line="orderLine" />
        </div>
      </div>

      <UiOrderSummary :cart="cart" class="col-span-5 h-fit md:sticky md:top-20">
        <ButtonTmp is="NuxtLink" size="medium" to="/checkout" class="mb-4 w-full md:mb-0">
          {{ $t('goToCheckout') }}
        </ButtonTmp>
      </UiOrderSummary>
    </div>
  </div>
  <div v-else data-testid="cart-page-content" class="flex flex-col items-center justify-center pb-32 pt-24">
    <NuxtImg :alt="$t('emptyCartImgAlt')" height="192" loading="lazy" src="/images/empty-cart.svg" width="192" />
    <h2 class="mt-8">{{ $t('emptyCart') }}</h2>
  </div>
</template>

<script lang="ts" setup>
import ButtonTmp from '../../components/ButtonTmp.vue'

const { cart, loadCart } = useCart()

await loadCart()
</script>
