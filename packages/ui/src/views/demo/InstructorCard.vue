<template>
  <div class="instructor-card">
    <div class="instructor-image">
      <img :src="instructor.cimg" :alt="instructor.name" />
    </div>
    <div class="instructor-content">
      <h3 class="instructor-name">{{ instructor.name }}</h3>
      <div class="instructor-location">
        <svg class="location-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
        <span>{{ instructor.city }}</span>
      </div>
      <p class="instructor-description">{{ instructor.description }}</p>
      <div class="instructor-contact">
        <div v-if="instructor.phone" class="contact-item">
          <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>{{ instructor.phone }}</span>
        </div>
        <div v-if="instructor.email" class="contact-item">
          <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>{{ instructor.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  city: string
  cimg: string
  description: string
}

defineProps<{
  instructor: Instructor
}>()
</script>

<style scoped>
.instructor-card {
  background: var(--color-card-bg);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.instructor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
}

.instructor-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.instructor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.instructor-card:hover .instructor-image img {
  transform: scale(1.05);
}

.instructor-content {
  padding: 1.5rem;
}

.instructor-name {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.5rem 0;
  color: var(--color-contrast);
}

.instructor-location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-dimmed);
}

.location-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-dimmed);
}

.instructor-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-dimmed);
  margin: 0 0 1.5rem 0;
}

.instructor-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-contrast);
}

.contact-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-dimmed);
  flex-shrink: 0;
}
</style>