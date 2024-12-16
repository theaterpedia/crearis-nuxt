<script lang="ts" setup>
import { useStateList } from '~/domains/core/composable/useStateList'
import CustomSfSelect from './CustomSfSelect.vue'

const props = defineProps({
  countryId: {
    type: Number,
    default: 0,
  },
})

const model = defineModel({ default: 0 })

const { loadStates, states } = useStateList(props.countryId)

watch(
  () => props.countryId,
  () => {
    if (props.countryId > 0) {
      loadStates()
    }
  },
  { immediate: true },
)
</script>
<template>
  <label class="md:col-span-3">
    <UiFormLabel>form.stateLabel</UiFormLabel>
    <CustomSfSelect v-model="model" autocomplete="state-name" name="state" required>
      <option :value="null" key="placeholder">form.selectPlaceholder</option>
      <option v-for="state in states" :value="state?.id">
        {{ state.name }}
      </option>
    </CustomSfSelect>
  </label>
</template>
