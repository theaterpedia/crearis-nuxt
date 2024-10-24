<script lang="ts" setup>
// this has to stand on top of the file, see: https://pruvious.com/docs/layouts
import type { DefaultLayoutProps } from './types'
import { defineLayout } from '#pruvious'
import ButtonTmp from '../components/ButtonTmp.vue'

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
    'Link',
    'Container',
    'Image',
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
    'Container',
    'Image',
    'Prose',
    'Video',
  ],
})

// eslint-disable-next-line vue/define-macros-order
defineProps<DefaultLayoutProps>()

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure()
const { isOpen: isSearchModalOpen, open: searchModalOpen, close: searchModalClose } = useDisclosure()
const { loadCart, cartItemCount } = useCart()
const { user, loadUser, logout } = useUser()

const cartLineItemsCount = computed(cartItemCount)

const logoutAndToggle = async () => {
  await logout()
  accountDropdownToggle()
}

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

loadUser()
loadCart()
usePageTitle()
</script>

<template>
  <UiNavbarTop extended filled>
    <nav class="hidden md:flex md:flex-row md:flex-nowrap">
      <NuxtLazyHydrate when-visible>
        <ButtonTmp v-show="cartLineItemsCount > 0" :is="NuxtLink" :to="paths.cart"></ButtonTmp>
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible></NuxtLazyHydrate>
    </nav>
    <ButtonTmp @click="searchModalOpen">
      <SfIconSearch />
    </ButtonTmp>
  </UiNavbarTop>
  <SectionContainer v-if="breadcrumbs"></SectionContainer>

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
</template>
