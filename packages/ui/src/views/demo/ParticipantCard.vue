<template>
  <div class="participant-card">
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
</template>

<script setup lang="ts">
interface Participant {
  id: string
  name: string
  age: number
  city: string
  cimg: string
}

defineProps<{
  participant: Participant
}>()
</script>

<style scoped>
.participant-card {
  background: var(--color-card-bg);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.participant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
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
  color: var(--color-contrast);
}

.participant-age {
  font-size: 0.875rem;
  color: var(--color-dimmed);
  margin: 0 0 0.75rem 0;
}

.participant-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-dimmed);
}

.location-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: var(--color-dimmed);
}
</style>