<template>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <h2 class="typography-headline-4 col-span-3 mx-4 mb-4 hidden font-bold capitalize md:block">
    {{ $t('account.ordersAndReturns.returnsHeading') }}
  </h2>
  <div class="col-span-3 text-center">
    <NuxtImg
      :alt="$t('account.ordersAndReturns.returnsAltText')"
      height="192"
      src="/images/returns.png"
      width="192"
      class="mx-auto"
    />
    <h3 class="typography-headline-3 mb-4 mt-6 font-bold">
      {{ $t('account.ordersAndReturns.noOrders') }}
    </h3>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'account',
})
</script>
