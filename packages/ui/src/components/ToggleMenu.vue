<template>
  <div class="layout-toggle" ref="toggleRef">
    <button 
      class="layout-toggle-button" 
      @click="toggleDropdown"
      aria-label="Toggle layout options"
      :aria-expanded="isOpen"
    >
      <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V96H40ZM40,112H96v88H40Zm176,88H112V112H216v88Z"></path>
      </svg>
    </button>

    <div v-if="isOpen" class="layout-toggle-dropdown" :class="`layout-toggle-dropdown-${placement}`">
      <!-- Header -->
      <div v-if="header || toggleOptions.length > 0" class="layout-toggle-header">
        <span>{{ header }}</span>
      </div>

      <!-- Toggle Options (only one can be selected) -->
      <template v-for="(option, index) in toggleOptions" :key="index">
        <!-- Option with children: render as section header + child items -->
        <template v-if="option.children && option.children.length > 0">
          <!-- Section Header (non-clickable, lighter text) -->
          <div class="layout-toggle-section-header">
            {{ option.text }}
          </div>
          
          <!-- Child Items (clickable) -->
          <button
            v-for="(child, childIndex) in option.children"
            :key="`${index}-${childIndex}`"
            class="layout-toggle-option layout-toggle-option-child"
            :class="{ 'layout-toggle-option-active': modelValue === child.state }"
            @click="selectOption(child.state)"
          >
            <span v-if="child.icon" class="layout-toggle-icon" v-html="child.icon.template"></span>
            
            <div class="layout-toggle-label">
              <template v-if="parseText(child.text).type === 'single'">
                <span class="layout-toggle-single">{{ parseText(child.text).main }}</span>
              </template>
              <template v-else-if="parseText(child.text).type === 'headline-subline'">
                <strong>{{ parseText(child.text).main }}</strong>
                <span v-if="parseText(child.text).sub" class="layout-toggle-description">{{ parseText(child.text).sub }}</span>
              </template>
              <template v-else-if="parseText(child.text).type === 'overline-headline'">
                <span class="layout-toggle-overline">{{ parseText(child.text).overline }}</span>
                <strong>{{ parseText(child.text).main }}</strong>
              </template>
            </div>

            <svg 
              v-if="modelValue === child.state"
              fill="currentColor" 
              height="16" 
              viewBox="0 0 256 256" 
              width="16" 
              xmlns="http://www.w3.org/2000/svg"
              class="layout-toggle-check"
            >
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
        </template>

        <!-- Regular option without children -->
        <button
          v-else
          class="layout-toggle-option"
          :class="{ 'layout-toggle-option-active': modelValue === option.state }"
          @click="selectOption(option.state)"
        >
          <span v-if="option.icon" class="layout-toggle-icon" v-html="option.icon.template"></span>
          
          <div class="layout-toggle-label">
            <template v-if="parseText(option.text).type === 'single'">
              <span class="layout-toggle-single">{{ parseText(option.text).main }}</span>
            </template>
            <template v-else-if="parseText(option.text).type === 'headline-subline'">
              <strong>{{ parseText(option.text).main }}</strong>
              <span v-if="parseText(option.text).sub" class="layout-toggle-description">{{ parseText(option.text).sub }}</span>
            </template>
            <template v-else-if="parseText(option.text).type === 'overline-headline'">
              <span class="layout-toggle-overline">{{ parseText(option.text).overline }}</span>
              <strong>{{ parseText(option.text).main }}</strong>
            </template>
          </div>

          <svg 
            v-if="modelValue === option.state"
            fill="currentColor" 
            height="16" 
            viewBox="0 0 256 256" 
            width="16" 
            xmlns="http://www.w3.org/2000/svg"
            class="layout-toggle-check"
          >
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
      </template>

      <!-- Divider (if both types of options exist) -->
      <div v-if="toggleOptions.length > 0 && arrayOptions.length > 0" class="layout-toggle-divider"></div>

      <!-- Array Options (toggle-style switches) -->
      <button 
        v-for="(option, index) in arrayOptions"
        :key="`array-${index}`"
        class="layout-toggle-setting"
        @click="toggleArrayOption(option)"
      >
        <span class="layout-toggle-setting-label">{{ option.text.replace(/\*\*/g, '') }}</span>
        <div class="layout-toggle-switch" :class="{ 'layout-toggle-switch-active': option.state === true }">
          <div class="layout-toggle-switch-thumb"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, type PropType } from 'vue'

export interface ToggleOption {
  text: string
  state: string | number | boolean
  link?: string
  icon?: { template: string }
  children?: ToggleOption[] // Support for grouped items
}

export interface ArrayOption {
  text: string
  state: string | number | boolean
  link?: string
}

interface ParsedText {
  type: 'single' | 'headline-subline' | 'overline-headline'
  main: string
  sub?: string
  overline?: string
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    required: true,
  },
  toggleOptions: {
    type: Array as PropType<ToggleOption[]>,
    default: () => [],
  },
  arrayOptions: {
    type: Array as PropType<ArrayOption[]>,
    default: () => [],
  },
  header: {
    type: String,
    default: 'Options',
  },
  /**
   * Placement of the dropdown menu
   * @default 'right'
   */
  placement: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'update:arrayOption': [option: ArrayOption, newState: boolean]
}>()

const isOpen = ref(false)
const toggleRef = ref<HTMLElement>()

// Parse text with **bold** markers
function parseText(text: string): ParsedText {
  const boldRegex = /\*\*(.*?)\*\*/g
  const matches = [...text.matchAll(boldRegex)]
  
  if (matches.length === 0) {
    // No bold text - single line
    return { type: 'single', main: text }
  }
  
  const boldText = matches[0][1]
  const parts = text.split(/\*\*.*?\*\*/)
  const before = parts[0]?.trim() || ''
  const after = parts[1]?.trim() || ''
  
  if (before && after) {
    // Text on both sides - treat as single line, remove bold markers
    return { type: 'single', main: text.replace(/\*\*/g, '') }
  } else if (before && !after) {
    // Text before bold - overline-headline style
    return { type: 'overline-headline', overline: before, main: boldText }
  } else {
    // Text after bold or just bold - headline-subline style
    return { type: 'headline-subline', main: boldText, sub: after }
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(state: string | number | boolean) {
  emit('update:modelValue', state)
  isOpen.value = false
}

function toggleArrayOption(option: ArrayOption) {
  // Toggle boolean state for array options (like switches)
  const newState = typeof option.state === 'boolean' ? !option.state : option.state
  emit('update:arrayOption', option, newState as boolean)
}

function handleClickOutside(event: MouseEvent) {
  if (toggleRef.value && !toggleRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.layout-toggle {
  position: relative;
}

.layout-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-contrast);
  border-radius: 0.5rem;
  transition: var(--transition);
  transition-property: background-color, color;
  cursor: pointer;
}

.layout-toggle-button:hover {
  background-color: var(--color-muted-bg);
}

.layout-toggle-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.layout-toggle-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  min-width: 16rem;
  padding: 0.5rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

/* Right placement (default) */
.layout-toggle-dropdown-right {
  right: 0;
  left: auto;
}

/* Left placement */
.layout-toggle-dropdown-left {
  left: 0;
  right: auto;
}

.layout-toggle-header {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-contrast-75);
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.25rem;
}

/* Section Header (for grouped items) */
.layout-toggle-section-header {
  padding: 0.5rem 0.75rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-contrast);
  opacity: 0.6;
  margin-top: 0.25rem;
}

.layout-toggle-section-header:first-child {
  margin-top: 0;
}

.layout-toggle-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  color: var(--color-contrast);
  border-radius: 0.375rem;
  transition: var(--transition);
  transition-property: background-color;
  cursor: pointer;
  text-align: left;
}

.layout-toggle-option:hover {
  background-color: var(--color-muted-bg);
}

/* Child items have slightly reduced padding on the left */
.layout-toggle-option-child {
  padding-left: 1rem;
}

.layout-toggle-option-active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.layout-toggle-option-active:hover {
  background-color: var(--color-primary-bg);
  opacity: 0.9;
}

.layout-toggle-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.layout-toggle-label {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.layout-toggle-label strong {
  font-size: 0.875rem;
  font-weight: 600;
}

.layout-toggle-single {
  font-size: 0.875rem;
  font-weight: 500;
}

.layout-toggle-overline {
  font-size: 0.75rem;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.layout-toggle-description {
  font-size: 0.75rem;
  opacity: 0.75;
}

.layout-toggle-check {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.layout-toggle-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.5rem 0;
}

.layout-toggle-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0.75rem;
  color: var(--color-contrast);
  border-radius: 0.375rem;
  transition: var(--transition);
  transition-property: background-color, opacity;
  cursor: pointer;
  text-align: left;
}

.layout-toggle-setting:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.layout-toggle-setting:not(:disabled):hover {
  background-color: var(--color-muted-bg);
}

.layout-toggle-setting-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.layout-toggle-switch {
  position: relative;
  width: 2.5rem;
  height: 1.25rem;
  background-color: var(--color-border);
  border-radius: 0.625rem;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.layout-toggle-switch-active {
  background-color: var(--color-primary);
}

.layout-toggle-switch-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.layout-toggle-switch-active .layout-toggle-switch-thumb {
  transform: translateX(1.25rem);
}
</style>
