<script lang="ts" setup>
import CustomSfSelect from './CustomSfSelect.vue'
import { useCountryList } from '~/domains/core/composable/useCountryList'
const { loadCountries, countries } = useCountryList()
await loadCountries()

const model = defineModel({ default: 0 })
</script>
<template>
  <label class="md:col-span-3">
    <UiFormLabel>form.countryLabel</UiFormLabel>
    <CustomSfSelect v-model="model" autocomplete="country-name" name="country" required>
      <option :value="null" key="placeholder">form.selectPlaceholder</option>
      <option v-for="country in countries?.countries" :key="country?.id" :value="country?.id">
        {{ country?.name }}
      </option>
    </CustomSfSelect>
  </label>
</template>
