<template>
  <div class="location-card">
    <div class="location-image">
      <img :src="location.cimg" :alt="location.name" />
    </div>
    <div class="location-content">
      <h3 class="location-name">{{ location.name }}</h3>
      <div class="location-address">
        <p>{{ location.street }}</p>
        <p>{{ location.zip }} {{ location.city }}</p>
      </div>
      <div class="location-contact">
        <div v-if="location.phone" class="contact-item">
          <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>{{ location.phone }}</span>
        </div>
        <div v-if="location.email" class="contact-item">
          <svg class="contact-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>{{ location.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Location {
  id: string
  name: string
  phone: string
  email: string
  city: string
  zip: string
  street: string
  cimg: string
}

defineProps<{
  location: Location
}>()
</script>

<style scoped>
.location-card {
  background: var(--color-card-bg);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
}

.location-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.location-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.location-card:hover .location-image img {
  transform: scale(1.05);
}

.location-content {
  padding: 1.5rem;
}

.location-name {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 1rem 0;
  color: var(--color-contrast);
}

.location-address {
  margin-bottom: 1rem;
}

.location-address p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-dimmed);
  line-height: 1.4;
}

.location-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-contrast);
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-dimmed);
  flex-shrink: 0;
}
</style>