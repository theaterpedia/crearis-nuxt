<template>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <div v-for="address in billingAddresses" :key="address.id">
    <AccountProfileData
      :button-text="$t('account.accountSettings.billingDetails.edit')"
      :header="$t('account.accountSettings.billingDetails.billingAddress')"
      @on-click="open"
      class="col-span-3"
    >
      <p>
        {{ address?.name }}
      </p>
      <p>{{ address?.phone }}</p>
      <p>{{ address?.street }} {{ address?.street2 }}</p>
      <p>
        {{ address?.city }}, {{ address?.state?.name }}
        {{ address?.zip }}
      </p>
    </AccountProfileData>
    <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
    <UiOverlay v-if="isOpen" :visible="isOpen">
      <SfModal
        v-model="isOpen"
        aria-labelledby="address-modal-title"
        role="dialog"
        tag="section"
        class="h-full w-full overflow-auto md:h-fit md:w-[600px]"
      >
        <header>
          <ButtonTmp @click="close" square variant="tertiary" class="absolute right-2 top-2">
            <SfIconClose />
          </ButtonTmp>
          <h3 id="address-modal-title" class="mb-4 text-lg font-bold text-neutral-900 md:text-2xl">
            {{ $t('account.accountSettings.billingDetails.billingAddress') }}
          </h3>
        </header>
        <FormAddAddress :saved-address="address" @on-close="close" @on-save="close" type="billingAddress" />
      </SfModal>
    </UiOverlay>
  </div>
</template>

<script lang="ts" setup>
import { SfIconClose, SfModal, useDisclosure } from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'
import type { AddressEnum } from '@crearis/data/graphql'

definePageMeta({
  layout: 'account',
})
const { isOpen, open, close } = useDisclosure()
const { billingAddresses, loadAddressesByType } = useAddresses()

await loadAddressesByType(AddressEnum.Billing)
</script>
