<template>
  <form @submit.prevent="$emit('on-save', contactInfo)" data-testid="contact-information-form">
    <label>
      <UiFormLabel>Vorname</UiFormLabel>
      <SfInput v-model="contactInfo.vorname" name="vorname" required type="text" />
    </label>
    <label>
      <UiFormLabel>Nachname</UiFormLabel>
      <SfInput v-model="contactInfo.nachname" name="nachname" required type="text" />
    </label>   
    <label>
      <UiFormLabel>Straße</UiFormLabel>
      <SfInput v-model="contactInfo.strasse" name="strasse" required type="text" />
    </label>   
    <label>
      <UiFormLabel>PLZ</UiFormLabel>
      <SfInput v-model="contactInfo.plz" name="plz" required type="text" />
    </label>   
    <label>
      <UiFormLabel>Ort</UiFormLabel>
      <SfInput v-model="contactInfo.ort" name="ort" required type="text" />
    </label>  
    <label>
      <UiFormLabel>Mobil-Tel</UiFormLabel>
      <SfInput v-model="contactInfo.mobil" name="mobil" required type="text" />
    </label>                    
    <div class="mt-4"></div>
    <label>
      <UiFormLabel>eMail-Adresse</UiFormLabel>
      <SfInput v-model="contactInfo.email" name="email" required type="email" />
    </label>
    <div class="mt-4 flex flex-col-reverse md:flex-row md:justify-end">
      <SfButton @click="$emit('on-cancel')" type="reset" variant="secondary" class="md:mr-4">
        Abbrechen
      </SfButton>
      <SfButton type="submit" style="background-color:var(--color-primary-bg); color:var(--color-primary-contrast)" class="mb-4 min-w-[120px] md:mb-0">Speichern</SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>

import type { FormContactInformationProps } from '../../../utils/checkout'

const props = defineProps<FormContactInformationProps>()
const { email, vorname, nachname, plz, ort, strasse, mobil } = toRefs(props)
defineEmits(['on-save', 'on-cancel'])
const contactInfo = ref({
  email: email?.value?.includes('newEmail') ? '' : (email?.value ?? ''),
  vorname: vorname?.value?.includes('newVorname') ? '' : (vorname?.value ?? ''),
  nachname: nachname?.value?.includes('newNachname') ? '' : (nachname?.value ?? ''),
  plz: plz?.value?.includes('newPlz') ? '' : (plz?.value ?? ''),
  ort: ort?.value?.includes('newOrt') ? '' : (ort?.value ?? ''),
  mobil: mobil?.value?.includes('newMobil') ? '' : (mobil?.value ?? ''),
  strasse: strasse?.value?.includes('newStrasse') ? '' : (strasse?.value ?? ''),
})
</script>
