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
      :tag="NuxtLink"
      square
      to="/cart"
      variant="tertiary"
      class="group relative rounded-md text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
    >
      <template #prefix>
        <SfIconShoppingCart />
        <SfBadge
          :content="totalItemsInCart"
          data-testid="cart-badge"
          class="flex justify-center bg-white !text-neutral-900 outline outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900"
        />
      </template>
    </SfButton>

    <template #fallback>
      <SfButton
        :tag="NuxtLink"
        square
        to="/cart"
        variant="tertiary"
        class="group relative rounded-md text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
      >
        <template #prefix>
          <SfIconShoppingCart />
          <SfBadge
            :content="0"
            data-testid="cart-badge"
            class="flex justify-center bg-white !text-neutral-900 outline outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900"
          />
        </template>
      </SfButton>
    </template>
  </ClientOnly>
</template>
