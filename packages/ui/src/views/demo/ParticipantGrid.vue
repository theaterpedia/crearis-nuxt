<template>
  <div class="participant-grid">
    <h3 class="grid-title">{{ title }}</h3>
    <div class="participants-container" :class="gridClass">
      <div 
        v-for="participant in participants" 
        :key="participant.id"
        class="participant-card"
      >
        <div class="participant-image">
          <img :src="participant.cimg" :alt="participant.name" />
        </div>
        <div class="participant-info">
          <h4 class="participant-name">{{ participant.name }}</h4>
          <p class="participant-age">{{ participant.age }} Jahre</p>
          <div v-if="participant.city" class="participant-location">
            <svg class="location-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <span>{{ participant.city }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Participant {
  id: string
  name: string
  age: number
  city: string
  cimg: string
}

const props = defineProps<{
  participants: Participant[]
  title: string
  maxCols?: number
}>()

const gridClass = computed(() => {
  const maxCols = props.maxCols || 4
  const participantCount = props.participants.length
  const cols = Math.min(participantCount, maxCols)
  return `grid-cols-${cols}`
})
</script>

<style scoped>
.participant-grid {
  margin-bottom: 3rem;
}

.grid-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 1.5rem 0;
  color: var(--color-gray-900, #111827);
}

.participants-container {
  display: grid;
  gap: 1.5rem;
}

/* Grid column classes */
.grid-cols-1 {
  grid-template-columns: 1fr;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .participants-container {
    grid-template-columns: 1fr !important;
  }
}

.participant-card {
  background: white;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.participant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.participant-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.participant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.participant-card:hover .participant-image img {
  transform: scale(1.05);
}

.participant-info {
  padding: 1rem;
}

.participant-name {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.25rem 0;
  color: var(--color-gray-900, #111827);
}

.participant-age {
  font-size: 0.875rem;
  color: var(--color-gray-600, #4b5563);
  margin: 0 0 0.75rem 0;
}

.participant-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-gray-500, #6b7280);
}

.location-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--color-gray-400, #9ca3af);
}
</style>