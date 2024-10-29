<script lang="ts" setup>
import { defineLayout } from '#pruvious'

import { useDisclosure, SfIconSearch } from '@crearis/vue'

defineLayout({
  label: 'default',
  // @ts-expect-error #TODO _05 remove once components are created
  allowedBlocks: [
    'ProductSlider',
    'Display',
    'MockImageSection',
    'MockBreadcrumbs',
    'MockLogo',
    'Hero',
    'Prose',
    'Video',
  ],
  // @ts-expect-error #TODO _05 remove once components are created
  allowedRootBlocks: [
    'ProductSlider',
    'Display',
    'MockImageSection',
    'MockBreadcrumbs',
    'MockLogo',
    'Hero',
    'Prose',
    'Video',
  ],
})

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure()
const { isOpen: isSearchModalOpen, open: searchModalOpen, close: searchModalClose } = useDisclosure()
// const { fetchCart, data: cart } = useSfCart()
// const { fetchCustomer, data: account } = useCustomer()

// fetchCart()
// fetchCustomer()
usePageTitle()

const cartLineItemsCount = 1 /* computed(
  () => cart.value?.lineItems.reduce((total, { quantity }) => total + quantity, 0) ?? 0,
) */
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
    <nav class="hidden md:flex md:flex-row md:flex-nowrap">
        <NuxtLazyHydrate when-visible>
          <ButtonTmp v-show="cartLineItemsCount > 0" :is="NuxtLink" :to="paths.cart"></ButtonTmp>
        </NuxtLazyHydrate>
      </nav>     
    <ButtonTmp @click="searchModalOpen">
      <SfIconSearch />
    </ButtonTmp>
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
</template>
