<script lang="ts" setup>
import { SfButton, SfInput } from '@crearis/vue'

const { cart } = useCart()
</script>

<template>
  <div data-testid="order-summary" class="shadow-lg md:rounded-md md:border md:border-neutral-100">
    <div class="flex items-end justify-between px-4 py-2 md:px-6 md:pb-4 md:pt-6">
      <p class="typography-headline-4 md:typography-headline-3 font-bold">
        {{ $t('orderSummary') }}
      </p>
      <p data-testid="total-in-cart" class="typography-text-base font-medium">
        {{ $t('itemsInCart', { count: cart?.order?.websiteOrderLine?.length }) }}
      </p>
    </div>
    <div class="mt-3 px-4 pb-4 md:mt-0 md:px-6 md:pb-6">
      <div class="typography-text-base flex justify-between pb-4">
        <div class="flex grow flex-col pr-2">
          <p>{{ $t('itemsSubtotal') }}</p>
          <!-- <p class="typography-text-xs text-secondary-700">
            {{ $t('savings') }}
          </p> -->
          <p class="my-2">{{ $t('delivery') }}</p>
          <p>{{ $t('estimatedTax') }}</p>
        </div>
        <div class="flex flex-col text-right">
          <p data-testid="special-price">${{ cart?.order?.amountSubtotal || 0 }}</p>
          <!-- <p class="typography-text-xs text-secondary-700">
            ${{ cart?.order?.shippingMethod?.price || 0 }}
          </p> -->
          <p class="my-2">${{ cart?.order?.shippingMethod?.price || 0 }}</p>
          <p>${{ cart?.order?.amountTax }}</p>
        </div>
      </div>
      <!-- <div class="flex items-center py-4 border-t border-neutral-200">
        <p>{{ $t('promoCode') }}</p>
        <SfButton size="sm" variant="tertiary" class="ml-auto mr-2">
          {{ $t('remove') }}
        </SfButton>
        <p>${{ cart?.totalCouponDiscounts }}</p>
      </div> -->
      <!-- <div class="flex gap-x-2 py-4 border-y border-neutral-200 mb-4">
        <SfInput
          wrapper-class="grow"
          :placeholder="$t('promoCodePlaceholder')"
        />
        <SfButton variant="secondary">{{ $t('apply') }}</SfButton>
      </div> -->
      <!-- <div class="px-3 py-3 bg-secondary-100 text-secondary-700 typography-text-sm rounded-md text-center mb-4" >
        <div class="w-full">
          {{ $t('savingsTag', { amount: 0 }) }}
        </div>
      </div> -->
      <div class="typography-headline-4 md:typography-headline-3 mb-4 flex justify-between pb-4 font-bold">
        <p>{{ $t('total') }}</p>
        <p data-testid="total">${{ cart?.order?.amountTotal }}</p>
      </div>
      <UiDivider class="my-4 w-auto" />
      <slot />
    </div>
  </div>
</template>
