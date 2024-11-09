<script lang="ts" setup>
const { toggleWishlistSideBar } = useWishlistUiState()
const { loadWishlist, wishlistTotalItems } = useWishlist()

const handleOpenWishListSidebar = async () => {
  toggleWishlistSideBar()
  await loadWishlist()
}

onMounted(async () => {
  await loadWishlist()
})
</script>
<template>
  <SfButton
    @click="handleOpenWishListSidebar"
    square
    type="button"
    variant="tertiary"
    class="group relative -ml-0.5 mr-1 rounded-md text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
  >
    <template #prefix>
      <SfIconShoppingCart />
      <SfBadge
        :content="wishlistTotalItems"
        data-testid="wishlist-badge"
        class="flex justify-center bg-white !text-neutral-900 outline outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900"
      />
    </template>
  </SfButton>
</template>
