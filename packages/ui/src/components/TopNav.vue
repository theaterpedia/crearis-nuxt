<template>
  <nav 
    ref="topnavRef"
    class="topnav" 
    :class="[
      `topnav-scroll-${scrollStyle}`,
      { 'topnav-scrolled': isScrolled, 'topnav-hidden': isHidden, 'topnav-reappear': shouldReappear }
    ]"
  >
    <Container v-if="wide">
      <div class="topnav-inner">
        <!-- Hamburger Menu (Mobile Only) -->
        <button 
          class="topnav-hamburger" 
          @click="handleBurgerClick"
          aria-label="Toggle menu"
        >
          <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
          </svg>
        </button>

        <!-- Mobile Menu Dropdown -->
        <div v-if="isMobileMenuOpen" class="topnav-mobile-menu">
          <ToggleMenu
            v-model="selectedMenuItem"
            :toggleOptions="mobileMenuOptions"
            :arrayOptions="[]"
            header="Navigation"
            @update:modelValue="handleMobileMenuSelect"
          />
        </div>

        <!-- Home Button -->
        <a href="#" class="topnav-home" aria-label="Home">
          <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68Z"
            ></path>
          </svg>
        </a>

        <!-- Main Menu -->
        <ul class="topnav-menu">
          <li v-for="(item, index) in items" :key="index" class="topnav-menu-item">
            <button
              v-if="item.children && item.children.length > 0"
              class="topnav-menu-link"
              @click="toggleDropdown(index)"
              @mouseenter="openDropdown(index)"
              @mouseleave="scheduleCloseDropdown(index)"
            >
              {{ item.label }}
              <svg
                fill="currentColor"
                height="16"
                viewBox="0 0 256 256"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                class="topnav-dropdown-icon"
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </button>
            <a v-else :href="item.link || '#'" class="topnav-menu-link">
              {{ item.label }}
            </a>

            <!-- Dropdown Menu -->
            <ul
              v-if="item.children && item.children.length > 0"
              v-show="openDropdowns[index]"
              class="topnav-dropdown"
              @mouseenter="openDropdown(index)"
              @mouseleave="scheduleCloseDropdown(index)"
            >
              <li v-for="(child, childIndex) in item.children" :key="childIndex" class="topnav-dropdown-item">
                <!-- Second Level with Children -->
                <div v-if="'children' in child && child.children && child.children.length > 0" class="topnav-dropdown-nested">
                  <span class="topnav-dropdown-link topnav-dropdown-parent">
                    {{ child.label }}
                    <svg
                      fill="currentColor"
                      height="12"
                      viewBox="0 0 256 256"
                      width="12"
                      xmlns="http://www.w3.org/2000/svg"
                      class="topnav-nested-icon"
                    >
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </span>
                  <ul class="topnav-dropdown-nested-menu">
                    <li v-for="(nestedChild, nestedIndex) in child.children" :key="nestedIndex">
                      <a :href="nestedChild.link || '#'" class="topnav-dropdown-link">
                        {{ nestedChild.label }}
                      </a>
                    </li>
                  </ul>
                </div>
                <!-- Regular Second Level Item -->
                <a v-else :href="child.link || '#'" class="topnav-dropdown-link">
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Right Actions Slot -->
        <div v-if="$slots.actions" class="topnav-actions">
          <slot name="actions" />
        </div>
      </div>
    </Container>
    <div v-else class="topnav-inner-narrow">
      <!-- Home Button -->
      <a href="#" class="topnav-home" aria-label="Home">
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68Z"
          ></path>
        </svg>
      </a>

      <!-- Main Menu -->
      <ul class="topnav-menu">
        <li v-for="(item, index) in items" :key="index" class="topnav-menu-item">
          <button
            v-if="item.children && item.children.length > 0"
            class="topnav-menu-link"
            @click="toggleDropdown(index)"
            @mouseenter="openDropdown(index)"
            @mouseleave="scheduleCloseDropdown(index)"
          >
            {{ item.label }}
            <svg
              fill="currentColor"
              height="16"
              viewBox="0 0 256 256"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              class="topnav-dropdown-icon"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
          <a v-else :href="item.link || '#'" class="topnav-menu-link">
            {{ item.label }}
          </a>

          <!-- Dropdown Menu -->
          <ul
            v-if="item.children && item.children.length > 0"
            v-show="openDropdowns[index]"
            class="topnav-dropdown"
            @mouseenter="openDropdown(index)"
            @mouseleave="scheduleCloseDropdown(index)"
          >
            <li v-for="(child, childIndex) in item.children" :key="childIndex" class="topnav-dropdown-item">
              <!-- Second Level with Children -->
              <div v-if="'children' in child && child.children && child.children.length > 0" class="topnav-dropdown-nested">
                <span class="topnav-dropdown-link topnav-dropdown-parent">
                  {{ child.label }}
                  <svg
                    fill="currentColor"
                    height="12"
                    viewBox="0 0 256 256"
                    width="12"
                    xmlns="http://www.w3.org/2000/svg"
                    class="topnav-nested-icon"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </span>
                <ul class="topnav-dropdown-nested-menu">
                  <li v-for="(nestedChild, nestedIndex) in child.children" :key="nestedIndex">
                    <a :href="nestedChild.link || '#'" class="topnav-dropdown-link">
                      {{ nestedChild.label }}
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Regular Second Level Item -->
              <a v-else :href="child.link || '#'" class="topnav-dropdown-link">
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <!-- Right Actions Slot -->
      <div v-if="$slots.actions" class="topnav-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="topnav-mobile">
      <!-- Burger or Home Button -->
      <button v-if="showBurger" class="topnav-mobile-burger" @click="handleBurgerClick" aria-label="Open menu">
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
        </svg>
      </button>
      <a v-else href="#" class="topnav-mobile-home" aria-label="Home">
        <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68Z"
          ></path>
        </svg>
      </a>

      <!-- Mobile Menu Dropdown (shown when hamburger is clicked) -->
      <div v-if="isMobileMenuOpen" class="topnav-mobile-menu-dropdown">
        <!-- Header -->
        <div class="topnav-mobile-menu-header">
          <span>Navigation</span>
        </div>

        <!-- Menu Options -->
        <template v-for="(option, index) in mobileMenuOptions" :key="index">
          <!-- Option with children: render as section header + child items -->
          <template v-if="option.children && option.children.length > 0">
            <!-- Section Header -->
            <div class="topnav-mobile-section-header">
              {{ option.text }}
            </div>
            
            <!-- Child Items -->
            <a
              v-for="(child, childIndex) in option.children"
              :key="`${index}-${childIndex}`"
              :href="child.link || '#'"
              class="topnav-mobile-menu-option topnav-mobile-menu-option-child"
              @click="handleMobileMenuSelect(child.state)"
            >
              {{ child.text }}
            </a>
          </template>

          <!-- Regular option without children -->
          <a
            v-else
            :href="option.link || '#'"
            class="topnav-mobile-menu-option"
            @click="handleMobileMenuSelect(option.state)"
          >
            {{ option.text }}
          </a>
        </template>
      </div>

      <!-- Mobile Menu Items -->
      <ul class="topnav-mobile-menu">
        <li v-for="(item, index) in mobileItems" :key="index" class="topnav-mobile-menu-item">
          <button
            v-if="item.children && item.children.length > 0"
            class="topnav-mobile-menu-link"
            @click="toggleDropdown(index)"
          >
            {{ item.label }}
            <svg
              fill="currentColor"
              height="16"
              viewBox="0 0 256 256"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              class="topnav-mobile-dropdown-icon"
              :class="{ 'topnav-mobile-dropdown-icon-open': openDropdowns[index] }"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
          <a v-else :href="item.link || '#'" class="topnav-mobile-menu-link">
            {{ item.label }}
          </a>

          <!-- Mobile Dropdown Menu -->
          <ul
            v-if="item.children && item.children.length > 0"
            v-show="openDropdowns[index]"
            class="topnav-mobile-dropdown"
          >
            <li v-for="(child, childIndex) in item.children" :key="childIndex" class="topnav-mobile-dropdown-item">
              <!-- Second Level with Children -->
              <div v-if="'children' in child && child.children && child.children.length > 0">
                <span class="topnav-mobile-dropdown-link topnav-mobile-dropdown-parent">
                  {{ child.label }}
                </span>
                <ul class="topnav-mobile-dropdown-nested">
                  <li v-for="(nestedChild, nestedIndex) in child.children" :key="nestedIndex">
                    <a :href="nestedChild.link || '#'" class="topnav-mobile-dropdown-link topnav-mobile-dropdown-nested-link">
                      {{ nestedChild.label }}
                    </a>
                  </li>
                </ul>
              </div>
              <!-- Regular Second Level Item -->
              <a v-else :href="child.link || '#'" class="topnav-mobile-dropdown-link">
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <!-- Right Actions Slot (Mobile) -->
      <div v-if="$slots.actions" class="topnav-mobile-actions">
        <slot name="actions" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, type PropType } from 'vue'
import Container from './Container.vue'
import ToggleMenu, { type ToggleOption } from './ToggleMenu.vue'

export interface TopnavLinkItem {
  label: string
  link?: string
}

export interface TopnavParentItem {
  label: string
  link?: string
  children?: (TopnavLinkItem | TopnavParentItem)[]
}

const props = defineProps({
  /**
   * The menu items to display in the top navigation.
   */
  items: {
    type: Array as PropType<TopnavParentItem[]>,
    default: () => [],
  },
  
  /**
   * Defines the scroll behavior of the navigation.
   * 
   * - `simple`: Normal flow, not sticky
   * - `overlay`: Sticky, semi-transparent when not scrolled, solid when scrolled
   * - `overlay_reappear`: Scrolls away but reappears with solid background when header scrolls off-page
   * 
   * @default 'simple'
   */
  scrollStyle: {
    type: String as PropType<'simple' | 'overlay' | 'overlay_reappear'>,
    default: 'simple',
  },
  
  /**
   * If true, navigation spans full width. If false, matches the width of boxed content.
   * 
   * @default true
   */
  wide: {
    type: Boolean,
    default: true,
  },
})

const openDropdowns = ref<Record<number, boolean>>({})
const closeTimers = ref<Record<number, ReturnType<typeof setTimeout>>>({})
const topnavRef = ref<HTMLElement>()
const isScrolled = ref(false)
const isHidden = ref(false)
const shouldReappear = ref(false)
let lastScrollY = 0
let headerHeight = 0

// Mobile navigation
const maxMobileItems = 3
const isMobileMenuOpen = ref(false)
const selectedMenuItem = ref<string | number | boolean>('')

// Convert first-level items to ToggleMenu options
const mobileMenuOptions = computed<ToggleOption[]>(() => {
  return props.items.map((item) => ({
    text: item.label,
    state: item.label, // Use label as state identifier
    link: item.link,
    // Include children if they exist
    children: item.children ? item.children.map((child) => ({
      text: child.label,
      state: child.label,
      link: child.link,
    })) : undefined,
  }))
})

function handleBurgerClick() {
  console.log('Hamburger clicked! Current state:', isMobileMenuOpen.value)
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  console.log('New state:', isMobileMenuOpen.value)
}

function handleMobileMenuClose() {
  isMobileMenuOpen.value = false
}

function handleMobileMenuSelect(value: string | number | boolean) {
  // Find the item with matching label and navigate
  const item = props.items.find(i => i.label === value)
  if (item?.link) {
    window.location.href = item.link
  }
  isMobileMenuOpen.value = false
}

// Determine which items to show on mobile
const mobileItems = props.items.length > maxMobileItems ? props.items.slice(0, maxMobileItems) : props.items
// Always show hamburger button on mobile (≤767px) for consistent UX
const showBurger = true

function toggleDropdown(index: number) {
  // Cancel any pending close
  if (closeTimers.value[index]) {
    clearTimeout(closeTimers.value[index])
    delete closeTimers.value[index]
  }
  openDropdowns.value[index] = !openDropdowns.value[index]
}

function openDropdown(index: number) {
  // Cancel any pending close
  if (closeTimers.value[index]) {
    clearTimeout(closeTimers.value[index])
    delete closeTimers.value[index]
  }
  openDropdowns.value[index] = true
}

function scheduleCloseDropdown(index: number) {
  // Schedule close with a delay to allow mouse to move to submenu
  closeTimers.value[index] = setTimeout(() => {
    openDropdowns.value[index] = false
    delete closeTimers.value[index]
  }, 200)
}

function handleScroll() {
  const currentScrollY = window.scrollY
  
  if (props.scrollStyle === 'overlay') {
    // Simple: just detect if scrolled
    isScrolled.value = currentScrollY > 10
  } else if (props.scrollStyle === 'overlay_reappear') {
    isScrolled.value = currentScrollY > 10
    
    // Calculate if header is off-screen
    const headerElement = document.querySelector('.page-header')
    if (headerElement) {
      headerHeight = headerElement.clientHeight
    }
    
    // Scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      isHidden.value = true
      shouldReappear.value = false
    }
    
    // Header scrolled off-screen, show nav
    if (currentScrollY > headerHeight && isHidden.value) {
      shouldReappear.value = true
      isHidden.value = false
    }
    
    // Near top, reset
    if (currentScrollY < 50) {
      isHidden.value = false
      shouldReappear.value = false
    }
  }
  
  lastScrollY = currentScrollY
}

function handleClickOutside(event: MouseEvent) {
  // Close mobile menu when clicking outside
  if (isMobileMenuOpen.value) {
    const target = event.target as HTMLElement
    const mobileMenuDropdown = document.querySelector('.topnav-mobile-menu-dropdown')
    const mobileMenu = document.querySelector('.topnav-mobile-menu')
    const hamburger = document.querySelector('.topnav-hamburger')
    const mobileBurger = document.querySelector('.topnav-mobile-burger')
    
    // Check both desktop and mobile elements
    const isClickInsideMenu = (mobileMenuDropdown && mobileMenuDropdown.contains(target)) ||
                               (mobileMenu && mobileMenu.contains(target))
    const isClickOnBurger = (hamburger && hamburger.contains(target)) ||
                             (mobileBurger && mobileBurger.contains(target))
    
    if (!isClickInsideMenu && !isClickOnBurger) {
      isMobileMenuOpen.value = false
    }
  }
}

onMounted(() => {
  if (props.scrollStyle !== 'simple') {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
  }
  // Add click outside listener for mobile menu
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (props.scrollStyle !== 'simple') {
    window.removeEventListener('scroll', handleScroll)
  }
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
  // Clean up any pending timers
  Object.values(closeTimers.value).forEach(timer => clearTimeout(timer))
})
</script>

<style scoped>
.topnav {
  position: relative;
  width: 100%;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 50;
  transition: var(--transition);
  transition-property: transform, opacity, background-color;
}

/* Scroll Style: Overlay */
.topnav-scroll-overlay {
  position: sticky;
  top: 0;
  background-color: rgba(var(--color-bg-rgb, 255, 255, 255), 0.85);
  backdrop-filter: blur(8px);
}

.topnav-scroll-overlay.topnav-scrolled {
  background-color: var(--color-bg);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Scroll Style: Overlay Reappear */
.topnav-scroll-overlay_reappear {
  position: sticky;
  top: 0;
  background-color: rgba(var(--color-bg-rgb, 255, 255, 255), 0.85);
  backdrop-filter: blur(8px);
}

.topnav-scroll-overlay_reappear.topnav-hidden {
  transform: translateY(-100%);
}

.topnav-scroll-overlay_reappear.topnav-reappear {
  background-color: var(--color-bg);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.topnav-inner,
.topnav-inner-narrow {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.75rem 0;
}

/* Hide desktop nav on mobile */
@media (max-width: 767px) {
  .topnav-inner,
  .topnav-inner-narrow {
    display: none !important;
  }
}

.topnav-inner-narrow {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Hamburger Menu - Mobile Only */
.topnav-hamburger {
  display: none; /* Hidden by default (desktop) */
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-contrast);
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color, color;
}

.topnav-hamburger:hover {
  background-color: var(--color-muted-bg);
}

/* Show hamburger on mobile */
@media (max-width: 767px) {
  .topnav-hamburger {
    display: flex;
  }
}

/* Mobile Menu Dropdown */
.topnav-mobile-menu {
  position: fixed;
  top: 3.5rem;
  left: 0.5rem;
  right: auto;
  max-width: calc(100vw - 1rem);
  z-index: 1000;
  display: none;
}

/* Show mobile menu on mobile screens */
@media (max-width: 767px) {
  .topnav-mobile-menu {
    display: block;
  }
}

.topnav-home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-contrast);
  border-radius: 0.5rem;
  transition: var(--transition);
  transition-property: background-color, color;
}

.topnav-home:hover {
  background-color: var(--color-muted-bg);
}

/* Hide home button on mobile */
@media (max-width: 767px) {
  .topnav-home {
    display: none !important;
  }
}

.topnav-home svg {
  width: 1.5rem;
  height: 1.5rem;
}

.topnav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  list-style: none;
}

/* Hide main menu on mobile */
@media (max-width: 767px) {
  .topnav-menu {
    display: none !important;
  }
}

.topnav-menu-item {
  position: relative;
}

.topnav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.topnav-menu-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  color: var(--color-contrast);
  font-weight: 500;
  white-space: nowrap;
  border-radius: 0.5rem;
  transition: var(--transition);
  transition-property: background-color, color;
  cursor: pointer;
}

.topnav-menu-link:hover {
  background-color: var(--color-muted-bg);
}

.topnav-dropdown-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.topnav-menu-item:hover .topnav-dropdown-icon {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.topnav-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 14rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  list-style: none;
  z-index: 100;
}

.topnav-dropdown-item {
  position: relative;
}

.topnav-dropdown-link {
  display: block;
  padding: 0.625rem 0.75rem;
  color: var(--color-contrast);
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: var(--transition);
  transition-property: background-color;
}

.topnav-dropdown-link:hover {
  background-color: var(--color-muted-bg);
}

/* Nested Dropdown */
.topnav-dropdown-nested {
  position: relative;
}

.topnav-dropdown-parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.topnav-nested-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: auto;
}

.topnav-dropdown-nested-menu {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 12rem;
  margin-left: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  list-style: none;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  transition-property: opacity, visibility;
}

.topnav-dropdown-nested:hover .topnav-dropdown-nested-menu {
  opacity: 1;
  visibility: visible;
}

/* Mobile Navigation */
.topnav-mobile {
  display: none;
}

@media (max-width: 767px) {
  .topnav-mobile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .topnav-mobile-burger,
  .topnav-mobile-home {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--color-contrast);
    border-radius: 0.5rem;
    transition: var(--transition);
    transition-property: background-color, color;
    flex-shrink: 0;
  }

  .topnav-mobile-burger:hover,
  .topnav-mobile-home:hover {
    background-color: var(--color-muted-bg);
  }

  .topnav-mobile-burger svg,
  .topnav-mobile-home svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  /* Mobile Menu Dropdown */
  .topnav-mobile-menu-dropdown {
    position: fixed;
    top: 3.5rem;
    left: 0.5rem;
    right: auto;
    min-width: 16rem;
    max-width: calc(100vw - 1rem);
    padding: 0.5rem;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1000;
  }

  .topnav-mobile-menu-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-contrast);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.25rem;
  }

  /* Section Header (for grouped items) */
  .topnav-mobile-section-header {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-contrast);
    opacity: 0.6;
    margin-top: 0.25rem;
  }

  .topnav-mobile-menu-option {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    color: var(--color-contrast);
    font-size: 0.875rem;
    border-radius: 0.375rem;
    transition: var(--transition);
    transition-property: background-color;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
  }

  .topnav-mobile-menu-option:hover {
    background-color: var(--color-muted-bg);
  }

  /* Child items have slightly reduced padding on the left */
  .topnav-mobile-menu-option-child {
    padding-left: 1rem;
  }

  /* Hide the mobile menu items list (we use hamburger dropdown instead) */
  .topnav-mobile-menu {
    display: none !important;
  }

  .topnav-mobile-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
    flex-shrink: 0;
  }

  .topnav-mobile-menu-item {
    position: relative;
    flex-shrink: 0;
  }

  .topnav-mobile-menu-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    color: var(--color-contrast);
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;
    border-radius: 0.5rem;
    transition: var(--transition);
    transition-property: background-color, color;
    cursor: pointer;
  }

  .topnav-mobile-menu-link:hover {
    background-color: var(--color-muted-bg);
  }

  .topnav-mobile-dropdown-icon {
    width: 0.875rem;
    height: 0.875rem;
    transition: transform 0.2s;
  }

  .topnav-mobile-dropdown-icon-open {
    transform: rotate(180deg);
  }

  /* Mobile Dropdown */
  .topnav-mobile-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 12rem;
    max-width: 16rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    list-style: none;
    z-index: 100;
  }

  .topnav-mobile-dropdown-item {
    position: relative;
  }

  .topnav-mobile-dropdown-link {
    display: block;
    padding: 0.5rem 0.625rem;
    color: var(--color-contrast);
    font-size: 0.875rem;
    border-radius: 0.375rem;
    transition: var(--transition);
    transition-property: background-color;
  }

  .topnav-mobile-dropdown-link:hover {
    background-color: var(--color-muted-bg);
  }

  .topnav-mobile-dropdown-parent {
    font-weight: 600;
    cursor: default;
  }

  .topnav-mobile-dropdown-nested {
    padding-left: 0.5rem;
    margin-top: 0.25rem;
    list-style: none;
  }

  .topnav-mobile-dropdown-nested-link {
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
  }
}
</style>
