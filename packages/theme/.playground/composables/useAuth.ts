import { useToast } from 'vue-toastification'

export const useAuth = () => {
  const router = useRouter()
  const userCookie = useCookie<any | null>('odoo-user', { maxAge: 3600 * 30, sameSite: 'strict' })
  const user = useState<Partner>('user', () => ({}) as Partner)

  const toast = useToast()

  const loading = ref(false)
  const resetEmail = useCookie<string>('reset-email')

  const updatePartner = async () => {
    loading.value = true
    user.value = {
      email: 'test@testperson.eu',
      id: 1,
      name: 'Max Mustermann',
      phone: '123456789',
      street: 'Musterstrasse 1',
      zip: '12345',
      city: 'Musterstadt',
      country: 'Deutschland',
    }
    toast.success('Partner updated successfully')
  }

  const logout = async () => {
    userCookie.value = null
    user.value = {}
    toast.success('logged out')
  }

  const signup = async () => {
    await login()
  }

  const login = async () => {
    user.value = {
      email: 'test@testperson.eu',
      id: 1,
      name: 'Hans Doenitz',
      phone: '123456789',
      street: 'Musterstrasse 1',
      zip: '12345',
      city: 'Musterstadt',
      country: 'Deutschland',
    }
    userCookie.value = user.value
    router.push('/my-account/personal-data')
  }

  const resetPassword = async () => {
    router.push('/reset-password-success')
  }

  const successResetEmail = () => {
    const result = resetEmail.value
    resetEmail.value = ''
  }

  const updatePassword = async (params: MutationUpdatePasswordArgs) => {
    toast.success('Password updated successfully')
  }

  const isAuthenticated = computed(() => {
    return user?.value?.id || Boolean(userCookie.value)
  })

  return {
    signup,
    logout,
    isAuthenticated,
    login,
    resetPassword,
    // changeForgottenPassword,
    user,
    loading,
    successResetEmail,
    updatePassword,
    updatePartner,
  }
}
