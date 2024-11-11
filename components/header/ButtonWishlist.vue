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
    class="hover:bg-primary-800 active:bg-primary-900 group relative -ml-0.5 mr-1 rounded-md text-white hover:text-white active:text-white"
  >
    <template #prefix>
      <SfIconShoppingCart />
      <SfBadge
        :content="wishlistTotalItems"
        data-testid="wishlist-badge"
        class="outline-primary-700 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center bg-white !text-neutral-900 outline"
      />
    </template>
  </SfButton>
</template>
