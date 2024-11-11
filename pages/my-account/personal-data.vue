<script lang="ts" setup>
import { unrefElement } from '@vueuse/core'

const { t } = useI18n()

definePageMeta({
  layout: 'account',
  middleware: ['auth-check'],
})
const { isOpen, open, close } = useDisclosure()
const { user, updatePartner, updatePassword } = useAuth()
const lastActiveElement = ref()
const modalElement = ref()
const openedForm = ref('')
const openModal = async (modalName: string) => {
  openedForm.value = modalName
  lastActiveElement.value = document.activeElement
  open()
  await nextTick()
  unrefElement(modalElement).focus()
}

const closeModal = () => {
  close()
  lastActiveElement.value.focus()
}

const saveNewContactInfo = async (userData: any) => {
  await updatePartner({
    id: user.value?.id,
    email: userData?.email ? userData?.email : user.value?.email,
    name: userData?.fullName ? userData.fullName : user.value?.name,
    subscribeNewsletter: userData?.subscribeNewsletter,
  })
  closeModal()
}

const saveNewPassword = async (passwords: any) => {
  if (passwords.firstNewPassword === passwords.secondNewPassword) {
    await updatePassword({
      currentPassword: passwords.oldPassword,
      newPassword: passwords.firstNewPassword,
    })
  }
}
</script>
<template>
  <TmpConstruction>
    <h1>Under Construction</h1>
  </TmpConstruction>
  <h1>{{ $t('account.accountSettings.personalData.title') }}</h1>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <AccountProfileData
    :button-text="$t('account.accountSettings.personalData.edit')"
    :header="$t('account.accountSettings.personalData.contactInformation')"
    @on-click="openModal('contactInformation')"
    class="col-span-3"
  >
    <p>{{ user?.name }}</p>
    <p>{{ user?.email }}</p>
  </AccountProfileData>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <AccountProfileData
    :button-text="$t('account.accountSettings.personalData.change')"
    :header="$t('account.accountSettings.personalData.yourPassword')"
    @on-click="openModal('passwordChange')"
    class="col-span-3"
  >
    ******
  </AccountProfileData>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <UiOverlay v-if="isOpen" :visible="isOpen">
    <SfModal
      v-model="isOpen"
      aria-labelledby="address-modal-title"
      ref="modalElement"
      role="dialog"
      tag="section"
      class="h-full w-full overflow-auto md:h-fit md:w-[600px]"
    >
      <header>
        <SfButton @click="closeModal" square type="button" variant="tertiary" class="absolute right-2 top-2">
          <SfIconClose />
        </SfButton>
        <h3 id="address-modal-title" class="mb-6 text-lg font-bold text-neutral-900 md:text-2xl">
          {{ $t(`account.accountSettings.personalData.${openedForm}`) }}
        </h3>
      </header>
      <AccountContactInformation
        v-if="openedForm === 'contactInformation'"
        :email="user?.email"
        :full-name="user?.name"
        @on-cancel="closeModal"
        @on-save="saveNewContactInfo"
      />
      <AccountUiFormPassword
        v-else-if="openedForm === 'passwordChange'"
        @on-cancel="closeModal"
        @on-save="saveNewPassword"
      />
    </SfModal>
  </UiOverlay>
</template>
