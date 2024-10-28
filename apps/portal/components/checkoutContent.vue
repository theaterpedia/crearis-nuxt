<template>
  <span v-if="isLoading" class="my-40 !flex h-24 justify-center">
    <SfLoaderCircular size="3xl" />
  </span>
  <div v-else>
    <div class="md:gap-x-6 lg:grid lg:grid-cols-12">
      <div class="col-span-7 mb-10 md:mb-0">
        <UiDivider class="-mx-4 w-screen md:mx-0 md:w-auto" />

        <div data-testid="contact-information" class="py-6 md:px-4">
          <div class="flex items-center justify-between">
            <h2 class="mb-4 text-lg font-bold text-neutral-900">
              {{ $t('contactInfo.heading') }}
            </h2>
            <SfButton v-if="partnerData?.email" @click="open" size="sm" variant="tertiary">
              {{ $t('contactInfo.edit') }}
            </SfButton>
          </div>
          <div v-if="partnerData?.email" class="mt-2 md:w-[520px]">
            <p>{{ partnerData.name }}</p>
            <p>{{ partnerData?.email }}</p>
          </div>
          <div v-else class="w-full md:max-w-[520px]">
            <p>{{ $t('contactInfo.description') }}</p>
            <SfButton @click="open" variant="secondary" class="mt-4 w-full md:w-auto">
              {{ $t('contactInfo.add') }}
            </SfButton>
          </div>

          <SfModal
            v-model="isOpen"
            aria-labelledby="contact-modal-title"
            role="dialog"
            tag="section"
            class="z-50 h-full w-full overflow-auto md:h-fit md:w-[600px]"
          >
            <header>
              <SfButton @click="close" square variant="tertiary" class="absolute right-2 top-2">
                <SfIconClose />
              </SfButton>
              <h3 id="contact-modal-title" class="mb-4 text-lg font-bold text-neutral-900 md:text-2xl">
                {{ $t('contactInfo.heading') }}
              </h3>
            </header>
            <FormContactInformation
              :email="partnerData.email"
              :name="partnerData.name"
              @on-cancel="close"
              @on-save="updatePartnerData"
            />
          </SfModal>
        </div>

        <UiDivider class="-mx-4 w-screen md:mx-0 md:w-auto" />
        <CheckoutAddressForm
          :button-text="$t('shipping.addButton')"
          :description="$t('shipping.description')"
          :heading="$t('shipping.heading')"
          :saved-address="savedMailingAddress"
          type="shippingAddress"
        />
        <UiDivider class="-mx-4 w-screen md:mx-0 md:w-auto" />
        <CheckoutAddressForm
          :button-text="$t('billing.addButton')"
          :description="$t('billing.description')"
          :heading="$t('billing.heading')"
          :saved-address="savedBillingAddress"
          type="billingAddress"
        />

        <UiDivider class-name="w-screen md:w-auto -mx-4 md:mx-0" />
        <div data-testid="shipping-method" class="my-6 md:px-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-neutral-900">
              {{ $t('shippingMethod.heading') }}
            </h3>
          </div>
          <div class="mt-4">
            <ul v-if="deliveryMethods.length" role="radiogroup" class="grid gap-y-4 md:grid-cols-2 md:gap-x-4">
              <SfListItem
                v-for="{ id, name, price } in deliveryMethods"
                :key="id"
                @click="radioModel = `${id}`"
                tag="label"
                class="items-start rounded-md border"
              >
                <div class="flex gap-2">
                  <SfRadio v-model="radioModel" :value="`${id}`" />
                  <div>
                    <p>{{ name }}</p>
                    <p class="text-xs text-neutral-500">tomorrow</p>
                  </div>
                </div>
              </SfListItem>
            </ul>

            <div v-else class="mb-6 flex">
              <SfIconBlock class="mr-2 text-neutral-500" />
              <p>{{ $t('shippingMethod.description') }}</p>
            </div>
          </div>
        </div>
        <UiDivider class="-mx-4 w-screen md:mx-0 md:w-auto" />
        <CheckoutPaymentMethod
          :active-payment="activePayment"
          :payment-methods="paymentMethods"
          @update:active-payment="activePayment = $event"
        />
        <UiDivider class="-mx-4 mb-10 w-screen md:mx-0 md:w-auto" />
      </div>
      <UiOrderSummary class="col-span-5 h-fit md:sticky md:top-20">
        <SfButton :tag="NuxtLink" size="lg" to="/checkout" class="mb-4 w-full md:mb-0">
          {{ $t('placeOrder') }}
        </SfButton>
        <p class="mt-4 pb-4 text-center text-sm md:pb-0">
          <i18n-t keypath="termsInfo" scope="global">
            <template #terms>
              <ButtonTmp
                to="#"
                variant="link"
              >
                {{ $t('termsAndConditions') }}
              </ButtonTmp>
            </template>
            <template #privacyPolicy>
              <ButtonTmp
                to="#"
                variant="link"
              >
                {{ $t('privacyPolicy') }}
              </ButtonTmp>
            </template>
          </i18n-t>
        </p>
      </UiOrderSummary>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  SfButton,
  SfLoaderCircular,
  SfIconClose,
  useDisclosure,
  SfModal,
  SfIconBlock,
  SfListItem,
  SfRadio,
} from '@crearis/vue'
import { useDeliveryMethod } from '@crearis/data/composables/useDeliveryMethod'
import { AddressEnum } from '@crearis/data/graphql'
import { ButtonTmp } from '../../components/ButtonTmp.vue'

const NuxtLink = resolveComponent('NuxtLink')
const { isOpen, open, close } = useDisclosure()
const { cart, loadCart } = useCart()
const { loadAddressesByType, mailingAddresses, billingAddresses } = useAddresses()
const { loadCountryList } = useCountry()
const { updatePartner } = usePartner()
const { loadDeliveryMethods, deliveryMethods } = useDeliveryMethod()
const { loadPaymentMethods, paymentMethods } = usePaymentMethod()

await loadCart()
await loadAddressesByType(AddressEnum.Shipping)
await loadAddressesByType(AddressEnum.Billing)
await loadDeliveryMethods()
await loadPaymentMethods()
await loadCountryList()

const savedMailingAddress = computed(() => mailingAddresses.value[0] || null)
const savedBillingAddress = computed(() => billingAddresses.value[0] || null)

const partnerData = computed(() => {
  const email = cart.value.order?.partner?.email || ''
  const name = cart.value.order?.partner?.name || ''
  return {
    email: email.includes('newEmail') ? '' : (email ?? ''),
    name: name.includes('newName') ? '' : (name ?? ''),
  }
})
const isLoading = false

const updatePartnerData = async ({ email, name }: { email: string; name: string }) => {
  await updatePartner({
    email,
    name: name,
    subscribeNewsletter: false,
  })
  await loadCart()
  close()
}

const radioModel = ref('1')
const activePayment = ref(1)
</script>
