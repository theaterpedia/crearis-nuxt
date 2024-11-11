import { useToast } from 'vue-toastification'

export const useCart = () => {
  const cartCounter = useCookie<number>('cart-counter', { sameSite: 'strict' })
  const toast = useToast()
  const cart = useState<Cart>('cart', () => ({}))

  const loading = ref(false)

  const loadCart = async () => {
    // cart.value = data.value.cart
    cartCounter.value = 1
  }

  const cartAdd = async (id: number, quantity: number) => {
    // cart.value = data.value.cartAddMultipleItems
    cartCounter.value = cartCounter.value + 1
    toast.success('Product has been added to cart')
  }

  const updateItemQuantity = async (id: number, quantity: number) => {
    cartCounter.value = Number(cart.value?.order?.orderLines?.length)
    toast.success('Product updated successfully')
  }

  const removeItemFromCart = async (lineId: number) => {
    cartCounter.value = cartCounter.value - 1
    toast.success('Product removed successfully')
  }

  return {
    loading,
    loadCart,
    cartAdd,
    updateItemQuantity,
    removeItemFromCart,
    cart,
  }
}
