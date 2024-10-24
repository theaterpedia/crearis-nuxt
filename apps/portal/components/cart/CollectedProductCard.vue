<script lang="ts" setup>
// #TODO: 0.5.4 ambiguous indirect export: OrderLine
import type { OrderLine } from '@crearis/data/graphql'
import type { PropType } from 'vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

const NuxtLink = resolveComponent('NuxtLink')

defineProps({
  orderLine: {
    // #TODO: 0.5.4 ambiguous indirect export: OrderLine
    type: Object as PropType<OrderLine>,
    required: true,
  },
})

const { updateItemQuantity, removeItemFromCart } = useCart()
</script>

<template>
  <div
    data-testid="cart-product-card"
    class="relative flex min-w-[320px] border-b-[1px] border-neutral-200 p-4 first:border-t last:mb-0 hover:shadow-lg"
  >
    <div class="relative w-[100px] overflow-hidden rounded-md sm:w-[176px]">
      <ButtonTmp :is="NuxtLink" :to="mountUrlSlugForProductVariant(orderLine.product as Product)" type="link">
        <NuxtImg
          :alt="orderLine.product?.imageFilename ?? ''"
          :src="$getImage(String(orderLine.product?.image), 370, 370, String(orderLine.product?.imageFilename))"
          format="webp"
          height="300"
          loading="lazy"
          width="300"
          class="h-auto w-full rounded-md border border-neutral-200"
        />
      </ButtonTmp>
      <div class="bg-secondary-600 absolute left-0 top-0 py-1 pl-1.5 pr-2 text-xs font-medium text-white">
        <SfIconSell size="xs" class="mr-1" />
        {{ $t('sale') }}
      </div>
    </div>
    <div class="flex min-w-[180px] flex-1 flex-col pl-4">
      <div class="flex justify-between">
        <ButtonTmp
          :is="NuxtLink"
          :to="mountUrlSlugForProductVariant(orderLine.product as Product)"
          type="plain"
          class="typography-text-sm sm:typography-text-lg cursor-pointer no-underline"
        >
          {{ orderLine.product?.name }}
        </ButtonTmp>
        <SfIconRemoveShoppingCart @click="removeItemFromCart(orderLine.id)" class="cursor-pointer" />
      </div>
      <div class="my-2 sm:mb-0">
        <ul class="sm:typography-text-sm text-xs font-normal leading-5 text-neutral-700">
          <li v-for="attribute in orderLine.product?.variantAttributeValues" :key="attribute.id">
            <span class="mr-1">{{ attribute.attribute?.name }}:</span>
            <span class="font-medium">{{ attribute.name }}</span>
          </li>
        </ul>
      </div>
      <div class="flex flex-col items-start sm:mt-auto sm:flex-row sm:items-center">
        <span
          v-if="orderLine.priceSubtotal"
          class="text-secondary-700 typography-text-sm sm:typography-text-lg font-bold sm:order-1 sm:ml-auto"
        >
          ${{ orderLine.priceSubtotal }}
          <span class="typography-text-xs sm:typography-text-sm ml-2 font-normal text-neutral-500 line-through">
            ${{ orderLine.product?.combinationInfo?.list_price * orderLine.quantity }}
          </span>
        </span>
        <span v-else class="typography-text-sm sm:typography-text-lg font-bold sm:order-1 sm:ml-auto">
          ${{ orderLine.priceTotal }}
        </span>
        <UiQuantitySelector
          v-model="orderLine.quantity"
          :max-value="Number(orderLine.product?.qty)"
          :min-value="1"
          :value="Number(orderLine.quantity)"
          @update:model-value="updateItemQuantity(orderLine.id, $event)"
          class="mt-4 sm:mt-0"
        />
      </div>
    </div>
  </div>
</template>
