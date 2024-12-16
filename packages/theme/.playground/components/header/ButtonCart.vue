<script lang="ts" setup>
const NuxtLink = resolveComponent('NuxtLink')
const { loadCart, totalItemsInCart } = useCart()

onMounted(async () => {
  await loadCart(true)
})
</script>

<template>
  <ClientOnly>
    <SfButton
      :is="NuxtLink"
      square
      to="/cart"
      variant="tertiary"
      class="hover:bg-primary-800 active:bg-primary-900 group relative rounded-md text-white hover:text-white active:text-white"
    >
      <template #prefix>
        <SfIconShoppingCart />
        <SfBadge
          :content="totalItemsInCart"
          data-testid="cart-badge"
          class="outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center bg-white !text-neutral-900 outline"
        />
      </template>
    </SfButton>

    <template #fallback>
      <SfButton
        :is="NuxtLink"
        square
        to="/cart"
        variant="tertiary"
        class="hover:bg-primary-800 active:bg-primary-900 group relative rounded-md text-white hover:text-white active:text-white"
      >
        <template #prefix>
          <SfIconShoppingCart />
          <SfBadge
            :content="0"
            data-testid="cart-badge"
            class="outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center bg-white !text-neutral-900 outline"
          />
        </template>
      </SfButton>
    </template>
  </ClientOnly>
</template>
