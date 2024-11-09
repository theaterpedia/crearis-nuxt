import { useToast } from 'vue-toastification'

export const useAuth = () => {
  const { $sdk } = useNuxtApp()
  const router = useRouter()
  const userCookie = useCookie<any | null>('odoo-user', { maxAge: 3600 * 30 })

  const toast = useToast()

  const loading = ref(false)
  const resetEmail = useCookie<string>('reset-email')


  const logout = async () => {
    toast.success('Logged out successfully')
  }


  const login = async () => {
    toast.success('Logged in successfully')
  }

  const isAuthenticated = computed(() => {
    return true
  })

  return {
    logout,
    isAuthenticated,
    login,
    loading
  }
}
