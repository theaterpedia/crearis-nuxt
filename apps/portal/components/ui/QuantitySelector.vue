<script lang="ts" setup>
import { SfButton, SfIconAdd, SfIconRemove } from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  maxQty: {
    type: Number,
    required: false,
    default: 10,
  },
})
const emit = defineEmits(['update:modelValue'])

const increment = () => {
  if (props.modelValue < props.maxQty) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

const decrement = () => {
  if (props.modelValue > 1) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

const handleUpdate = (event: Event) => {
  if (props.modelValue < props.maxQty && props.modelValue > 1) {
    emit('update:modelValue', (event?.target as any)?.value)
  }
}
</script>
<template>
  <div data-testid="quantity-selector" class="inline-flex flex-col items-center">
    <div class="flex h-full w-full rounded-md border border-neutral-300">
      <ButtonTmp
        @click="decrement"
        aria-label="Decrease value"
        data-testid="quantity-selector-decrease-button"
        type="button"
        variant="tertiary"
      >
        <SfIconRemove />
      </ButtonTmp>
      <input
        :max="props.maxQty"
        :value="props.modelValue"
        @input="handleUpdate"
        aria-label="Quantity Selector"
        data-testid="quantity-selector-input"
        role="spinbutton"
        type="number"
        class="[&::-webkit-inner-spin-button]:display-none [&::-webkit-outer-spin-button]:display-none disabled:placeholder-disabled-900 focus-visible:outline-offset mx-2 w-8 flex-1 appearance-none bg-transparent text-center font-medium [-moz-appearance:textfield] focus-visible:rounded-sm focus-visible:outline [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
      <ButtonTmp
        @click="increment"
        aria-label="Increase value"
        data-testid="quantity-selector-increase-button"
        type="button"
        variant="tertiary"
      >
        <SfIconAdd />
      </ButtonTmp>
    </div>
  </div>
</template>
