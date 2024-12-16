<template>
  <TheHeader />

  <main class="narrow-container">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="mb-10 mt-5" />
    <div ata-testid="account-layout">
      <h1 v-if="isRoot" class="typography-headline-3 md:typography-headline-2 mb-10 font-bold md:mx-0 md:mb-10">
        {{ $t('account.heading') }}
      </h1>
      <div v-else class="mb-10 mt-4 flex items-center justify-start">
        <div v-for="({ subsections }, i) in sections" :key="i">
          <div v-for="{ label, link } in subsections" :key="label" class="typography-headline-3 font-bold">
            <h1 v-if="currentPath === link">{{ label }}</h1>
          </div>
        </div>
        <SfButton :is="NuxtLink" size="sm" to="/my-account" variant="tertiary" class="flex whitespace-nowrap md:hidden">
          <template #prefix>
            <SfIconArrowBack />
          </template>
          {{ $t('account.back') }}
        </SfButton>
      </div>
      <div data-testid="account-page-sidebar" class="gap-10 pb-20 md:flex">
        <div
          :class="[
            'min-w-[300px] border-t border-neutral-200 pb-4 pt-4 md:block md:rounded-md md:border md:p-4',
            { hidden: !isRoot },
          ]"
        >
          <ul v-for="{ title, icon, subsections } in sections" :key="title" class="[&:not(:last-child)]:mb-4">
            <SfListItem class="!cursor-auto px-0 py-4 font-medium hover:!bg-transparent md:px-4 md:py-2">
              <template #prefix><component :is="icon" /></template>
              {{ title }}
            </SfListItem>
            <li v-for="{ label, link } in subsections" :key="label">
              <SfListItem
                :is="NuxtLink"
                :to="link"
                :class="[
                  'active:bg-primary-100 rounded-md px-0 !text-neutral-900 first-of-type:py-4 md:px-4 md:first-of-type:px-4 md:first-of-type:py-2',
                  {
                    'bg-primary-100 font-medium': router.currentRoute.value.path === link,
                  },
                ]"
              >
                <template #prefix><SfIconBase /></template>
                {{ label }}
                <template #suffix>
                  <div class="block md:hidden">
                    <SfIconChevronRight />
                  </div>
                </template>
              </SfListItem>
            </li>
          </ul>
          <UiDivider />
          <ul>
            <SfListItem
              :is="NuxtLink"
              @click="handleLogout"
              class="active:bg-primary-100 mt-4 rounded-md py-4 !text-neutral-900 md:py-2"
            >
              <template #prefix><SfIconBase /></template>
              {{ $t('account.logout') }}
            </SfListItem>
          </ul>
        </div>
        <div class="flex-1">
          <section
            data-testid="category-grid"
            class="2xs:grid-cols-2 3xl:grid-cols-4 grid grid-cols-1 gap-4 md:mb-5 md:grid-cols-2 md:gap-x-2 md:gap-y-6 lg:grid-cols-3"
          >
            <slot />
          </section>
        </div>
      </div>
    </div>
  </main>
  <Newsletter />
  <TheFooter />
  <BottomNavbar />
</template>

<script setup>
import { defineLayout } from '#pruvious'

defineLayout({
  label: 'account',
  allowedBlocks: ['Prose'],
  allowedRootBlocks: ['Prose'],
})

const { t } = useI18n()

const NuxtLink = resolveComponent('NuxtLink')
const router = useRouter()
const { logout } = useAuth()
const sections = [
  {
    title: t('account.accountSettings.heading'),
    icon: SfIconPerson,
    subsections: [
      {
        label: t('account.accountSettings.section.personalData'),
        link: '/my-account/personal-data',
      },
      {
        label: t('account.accountSettings.section.billingDetails'),
        link: '/my-account/billing-details',
      },
      {
        label: t('account.accountSettings.section.shippingDetails'),
        link: '/my-account/shipping-details',
      },
    ],
  },
  {
    title: t('account.myOrders.heading'),
    icon: SfIconShoppingCart,
    subsections: [
      {
        label: t('account.myOrders.section.myOrders'),
        link: '/my-account/my-orders',
      },
    ],
  },
]

const currentPath = computed(() => router.currentRoute.value.path)
const path = '/my-account'
const rootPathRegex = new RegExp(`^${path}/?$`)
const isRoot = computed(() => rootPathRegex.test(currentPath.value))
const findCurrentPage = computed(() =>
  sections.flatMap(({ subsections }) => subsections).find(({ link }) => currentPath.value.includes(link)),
)

const breadcrumbs = computed(() => [
  { name: t('home'), link: '/' },
  { name: t('account.heading'), link: '/my-account' },
  ...(isRoot.value ? [] : [{ name: findCurrentPage.value?.label, link: currentPath.value }]),
])

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>
