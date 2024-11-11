import { useToggle } from '@vueuse/core'

export const useWishlistUiState = () => {
  const wishlistSidebarIsOpen = useState('wishlistSidebarIsOpen', () => false)
  const toggleWishlistSideBar = useToggle(wishlistSidebarIsOpen)

  return {
    wishlistSidebarIsOpen,
    toggleWishlistSideBar,
  }
}
