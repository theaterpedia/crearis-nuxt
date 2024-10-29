<script lang="ts" setup>
// this has to stand on top of the file, see: https://pruvious.com/docs/layouts
import { defineLayout } from '#pruvious'

import { useDisclosure } from '@crearis/vue'

defineLayout({
  label: 'account',
  // @ts-expect-error #TODO _05 remove once components are created
  allowedBlocks: ['Cart', 'Checkout', 'MockImageSection', 'MockBreadcrumbs', 'Link', 'Container', 'Image', 'Prose'],
  // @ts-expect-error #TODO _05 remove once components are created
  allowedRootBlocks: ['Cart', 'Checkout', 'MockImageSection', 'MockBreadcrumbs', 'Link', 'Container', 'Image', 'Prose'],
})

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure()
const { isOpen: isSearchModalOpen, open: searchModalOpen, close: searchModalClose } = useDisclosure()
// const { fetchCart, data: cart } = useSfCart()
// const { fetchCustomer, data: account } = useCustomer()

// fetchCart()
// fetchCustomer()
usePageTitle()

const cartLineItemsCount = computed(
  () => cart.value?.lineItems.reduce((total, { quantity }) => total + quantity, 0) ?? 0,
)

const accountDropdown = [
  {
    label: 'account.heading',
    link: paths.account,
  },
  {
    label: 'account.ordersAndReturns.section.myOrders',
    link: paths.accountMyOrders,
  },
  {
    label: 'account.ordersAndReturns.section.returns',
    link: paths.accountReturns,
  },
  {
    label: 'account.logout',
    link: '/',
  },
]
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <UiNavbarTop extended filled>
    <nav v-show="cartLineItemsCount > 0" class="hidden md:flex md:flex-row md:flex-nowrap">
      <NuxtLazyHydrate when-visible>
        <ButtonTmp
          :is="NuxtLink"
          :to="paths.cart"
          square
          variant="tertiary"
          class="hover:bg-primary-800 active:bg-primary-900 group relative -ml-0.5 mr-1 rounded-md text-white hover:text-white active:text-white"
        ></ButtonTmp>
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible></NuxtLazyHydrate>
    </nav>
    <ButtonTmp @click="searchModalOpen"></ButtonTmp>
  </UiNavbarTop>

  <main>
    <slot />
  </main>
  <NuxtLazyHydrate when-idle>
    <UiNavbarBottom />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <Footer />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-idle></NuxtLazyHydrate>
  <Toaster position="top-right" />
</template>
