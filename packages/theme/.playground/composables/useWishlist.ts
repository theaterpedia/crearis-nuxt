export const useWishlist = () => {
  const wishlistCounter = useCookie<number>('wishlist-counter', { sameSite: 'strict' })
  const loading = ref(false)
  const wishlist = useState('wishlist', () => ({}))

  const loadWishlist = async () => {
    // wishlist.value = data?.value?.wishlistItems || []
    wishlistCounter.value = 1
  }

  const wishlistAddItem = async (productId: number) => {
    // wishlist.value = data?.value.wishlistAddItem
    wishlistCounter.value = wishlistCounter.value + 1
  }

  const getProductFromProductId = (productId: number) => {
    return false
    // return wishlist.value?.wishlistItems?.find((item) => item?.product?.id === productId)
  }

  const wishlistRemoveItem = async (productId: number) => {
    // wishlist.value = data?.value.wishlistRemoveItem
    wishlistCounter.value = wishlistCounter.value - 1
  }

  const wishlistTotalItems = computed(() => {
    return wishlist.value?.wishlistItems?.length || 0
  })

  const isInWishlist = (productId: number) => {
    return false // wishlist.value?.wishlistItems?.some((item) => item?.product?.id === productId) || false
  }

  return {
    loading,
    wishlist,
    wishlistTotalItems,

    isInWishlist,
    loadWishlist,
    wishlistAddItem,
    wishlistRemoveItem,
  }
}
