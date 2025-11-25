<template>
  <div class="events-dropdown">
    <button 
      class="events-dropdown-toggle"
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
    >
      Events Gallery
      <svg class="dropdown-arrow" :class="{ 'rotated': isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <div 
      v-if="isOpen" 
      class="events-dropdown-menu"
      @click.stop
    >
      <div class="events-grid">
        <div 
          v-for="event in events" 
          :key="event.id"
          class="event-card"
          @click="$emit('select-event', event.id)"
          :class="{ 'active': event.id === currentEventId }"
        >
          <div class="event-image">
            <img :src="event.cimg" :alt="event.name" />
          </div>
          <div class="event-content">
            <h3>{{ event.rectitle || event.name }}</h3>
            <p class="event-date">{{ formatDate(event.date_begin) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Event {
  id: string
  name: string
  rectitle?: string
  date_begin: string
  cimg: string
}

defineProps<{
  events: Event[]
  currentEventId: string
}>()

defineEmits<{
  'select-event': [eventId: string]
}>()

const isOpen = ref(false)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const closeOnClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('.events-dropdown')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<style scoped>
.events-dropdown {
  position: relative;
  display: inline-block;
}

.events-dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary, #2563eb);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.events-dropdown-toggle:hover {
  background: var(--color-primary-dark, #1d4ed8);
}

.dropdown-arrow {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.events-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 50;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 20rem;
  max-width: 24rem;
  max-height: 24rem;
  overflow-y: auto;
}

.events-grid {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.event-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-card:hover {
  background: var(--color-gray-50, #f9fafb);
}

.event-card.active {
  background: var(--color-primary-50, #eff6ff);
  border: 1px solid var(--color-primary, #2563eb);
}

.event-image {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 0.375rem;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-content h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  color: var(--color-gray-900, #111827);
}

.event-date {
  font-size: 0.75rem;
  color: var(--color-gray-600, #4b5563);
  margin: 0;
}
</style>