<template>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <AccountProfileData
    :button-text="$t('account.accountSettings.personalData.edit')"
    :header="$t('account.accountSettings.personalData.yourName')"
    @on-click="openModal('yourName')"
    class="col-span-3"
  >
    {{ user?.name }}
  </AccountProfileData>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <AccountProfileData
    :button-text="$t('account.accountSettings.personalData.edit')"
    :header="$t('account.accountSettings.personalData.contactInformation')"
    @on-click="openModal('contactInformation')"
    class="col-span-3"
  >
    {{ user?.email }}
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
      <AccountFormsName
        v-if="openedForm === 'yourName'"
        :full-name="user?.name"
        @on-cancel="closeModal"
        @on-save="saveNewName"
      />
      <FormContactInformation
        v-else-if="openedForm === 'contactInformation'"
        :email="user?.email"
        @on-cancel="closeModal"
        @on-save="saveNewEmail"
      />
      <AccountFormsPassword
        v-else-if="openedForm === 'passwordChange'"
        @on-cancel="closeModal"
        @on-save="saveNewPassword"
      />
    </SfModal>
  </UiOverlay>
</template>

<script lang="ts" setup>
import { SfIconClose, SfModal, useDisclosure } from '@crearis/vue'
import { unrefElement } from '@vueuse/core'

definePageMeta({
  layout: 'account',
})
const { isOpen, open, close } = useDisclosure()
const { loadUser, user, resetPassword } = useUser()
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

const saveNewName = async (newName: string) => {
  await updatePartner({ myaccount: { id: user.value?.id, email: user.value?.email, name: newName } })
  closeModal()
}

const saveNewEmail = async (newEmail: string) => {
  await updatePartner({ myaccount: { id: user.value?.id, email: newEmail, name: user.value?.name } })
  closeModal()
}

const saveNewPassword = async (passwords: any) => {
  if (passwords.firstNewPassword === passwords.secondNewPassword) {
    await resetPassword({ currentPassword: passwords.oldPassword, newPassword: passwords.firstNewPassword })
    // if (!updatePasswordError.value) {
    //   closeModal();
    // }
  }
}

await loadUser()
</script>
