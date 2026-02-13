/**
 * Composable for Odoo GraphQL checkout workflow.
 * 
 * Handles the complete checkout flow for DASEi course bookings:
 * - Contact information collection
 * - Path selection (München/Nürnberg, Block/Day)
 * - Terms acceptance
 * - Submission to Odoo GraphQL endpoint
 * 
 * @see _meta/Act26/02-06-SNAPSHOT_nuxt_graphql_integration.md#3.2
 */

import { ref, computed, reactive, readonly } from 'vue'
import type { 
  CheckoutInput, 
  CheckoutResult, 
  CheckoutState, 
  CheckoutContactInput 
} from '~/utils/checkout'

const CHECKOUT_MUTATION = `
  mutation Checkout($checkout: CheckoutInput!) {
    checkout(checkout: $checkout) {
      success
      checkoutType
      error
      order { id name }
      partner { id email }
      registrations
      packageLines
    }
  }
`

/**
 * Checkout composable for Odoo GraphQL integration.
 * 
 * @param productRef - Product shortcode (e.g. "m18w", "z15e") or SKU ("MOD-A")
 *                     Odoo resolves shortcodes via _parse_product_ref()
 * 
 * @example
 * ```vue
 * <script setup>
 * const checkout = useCheckout('m18w')
 * 
 * // Set contact info
 * checkout.setContact({ email: 'test@example.com', vorname: 'Max', nachname: 'Mustermann' })
 * 
 * // Submit
 * const result = await checkout.submit()
 * // result.checkoutType === 'auto' | 'manual_review'
 * </script>
 * ```
 */
export function useCheckout(productRef: string) {
  const config = useRuntimeConfig()
  const graphqlUrl = config.public.odooGraphqlUrl as string
  
  // Reactive state
  const state = reactive<CheckoutState>({
    step: 1,
    contact: {
      email: '',
      vorname: '',
      nachname: '',
      strasse: '',
      plz: '',
      ort: '',
      mobil: '',
    },
    acceptances: {
      terms: false,
      privacy: false,
      cancellation: false,
    },
    notes: '',
    requestFullCourse: false,
    isSubmitting: false,
    result: undefined,
  })
  
  // Computed validators
  const isContactValid = computed(() => {
    const { email, vorname, nachname } = state.contact
    return email.includes('@') && vorname.length > 1 && nachname.length > 1
  })
  
  const isAcceptanceValid = computed(() => {
    return state.acceptances.terms && 
           state.acceptances.privacy && 
           state.acceptances.cancellation
  })
  
  const canSubmit = computed(() => {
    return isContactValid.value && isAcceptanceValid.value && !state.isSubmitting
  })
  
  // Actions
  const setContact = (contact: Partial<CheckoutContactInput>) => {
    Object.assign(state.contact, contact)
  }
  
  const setRequestFullCourse = (value: boolean) => {
    state.requestFullCourse = value
  }
  
  const setAcceptances = (acceptances: Partial<CheckoutState['acceptances']>) => {
    Object.assign(state.acceptances, acceptances)
  }
  
  const setNotes = (notes: string) => {
    state.notes = notes
  }
  
  const nextStep = () => {
    if (state.step < 4) state.step++
  }
  
  const prevStep = () => {
    if (state.step > 1) state.step--
  }
  
  /**
   * Submit checkout to Odoo GraphQL endpoint.
   * 
   * For 'auto' tier (m/n + w/x shortcodes):
   * - Partner (or finds existing by email)
   * - Sale Order with package product
   * - Event registrations for all package events
   * - Sends confirmation email
   * 
   * For 'manual_review' tier (z*, module flags, single events):
   * - Partner created/found
   * - Manager notification email sent
   * - Customer receives "1-2 Werktage" email
   * 
   * @returns CheckoutResult with success/error, checkoutType, and created entity IDs
   */
  const submit = async (): Promise<CheckoutResult> => {
    if (!canSubmit.value) {
      return { success: false, error: 'Validation failed: Please fill all required fields and accept terms.' }
    }
    
    if (!graphqlUrl) {
      console.error('[useCheckout] NUXT_PUBLIC_ODOO_GRAPHQL_URL not configured')
      return { success: false, error: 'Checkout not configured. Please contact support.' }
    }
    
    state.isSubmitting = true
    
    const input: CheckoutInput = {
      productRef,
      contact: {
        email: state.contact.email,
        vorname: state.contact.vorname,
        nachname: state.contact.nachname,
        strasse: state.contact.strasse || undefined,
        plz: state.contact.plz || undefined,
        ort: state.contact.ort || undefined,
        mobil: state.contact.mobil || undefined,
      },
      notes: state.notes || undefined,
      acceptTerms: state.acceptances.terms,
      acceptPrivacy: state.acceptances.privacy,
      acceptCancellation: state.acceptances.cancellation,
      requestFullCourse: state.requestFullCourse || undefined,
    }
    
    try {
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CHECKOUT_MUTATION,
          variables: { checkout: input }
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const json = await response.json()
      
      if (json.errors) {
        const errorMsg = json.errors[0]?.message || 'GraphQL error'
        console.error('[useCheckout] GraphQL error:', json.errors)
        state.result = { success: false, error: errorMsg }
        return state.result as CheckoutResult
      }
      
      state.result = json.data.checkout
      return state.result as CheckoutResult
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error'
      console.error('[useCheckout] Submit error:', error)
      state.result = { success: false, error: errorMsg }
      return state.result as CheckoutResult
      
    } finally {
      state.isSubmitting = false
    }
  }
  
  const reset = () => {
    state.step = 1
    state.contact = { email: '', vorname: '', nachname: '', strasse: '', plz: '', ort: '', mobil: '' }
    state.acceptances = { terms: false, privacy: false, cancellation: false }
    state.notes = ''
    state.requestFullCourse = false
    state.result = undefined
  }
  
  return {
    // State (readonly to prevent direct mutation)
    state: readonly(state),
    
    // Computed
    isContactValid,
    isAcceptanceValid,
    canSubmit,
    
    // Actions
    setContact,
    setRequestFullCourse,
    setAcceptances,
    setNotes,
    nextStep,
    prevStep,
    submit,
    reset,
  }
}
