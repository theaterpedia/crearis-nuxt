<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Hero bearbeiten</h2>
          <button class="modal-close" @click="close" aria-label="Schließen">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="cimg">Bild URL</label>
            <input
              id="cimg"
              v-model="formData.cimg"
              type="url"
              class="form-input"
              placeholder="https://..."
              required
            />
          </div>

          <div class="form-group">
            <label for="heading">Überschrift</label>
            <input
              id="heading"
              v-model="formData.heading"
              type="text"
              class="form-input"
              placeholder="Titel eingeben..."
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Beschreibung</label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-textarea"
              placeholder="Beschreibung eingeben..."
              rows="4"
              required
            ></textarea>
          </div>

          <div v-if="!isEvent" class="form-group">
            <label>Verknüpfte Events</label>
            <div class="event-select">
              <div
                v-for="event in availableEvents"
                :key="event.id"
                class="event-option"
                :class="{ selected: selectedEvents.includes(event.id) }"
                @click="toggleEvent(event.id)"
              >
                <input
                  type="checkbox"
                  :checked="selectedEvents.includes(event.id)"
                  @change="toggleEvent(event.id)"
                />
                <img v-if="event.cimg" :src="event.cimg" :alt="event.name" class="event-thumb" />
                <span>{{ event.name }}</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="close">
              Abbrechen
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface HeroData {
  id: string
  cimg: string
  heading: string
  description: string
  eventIds?: string[]
}

interface Event {
  id: string
  name: string
  cimg: string
}

const props = defineProps<{
  isOpen: boolean
  heroData: HeroData | null
  availableEvents: Event[]
}>()

const emit = defineEmits<{
  close: []
  save: [data: HeroData]
}>()

const formData = ref({
  cimg: '',
  heading: '',
  description: ''
})

const selectedEvents = ref<string[]>([])
const saving = ref(false)

const isEvent = computed(() => {
  return props.heroData?.id?.startsWith('_demo.event_') || false
})

watch(() => props.heroData, (data) => {
  if (data) {
    formData.value = {
      cimg: data.cimg || '',
      heading: data.heading || '',
      description: data.description || ''
    }
    selectedEvents.value = data.eventIds || []
  }
}, { immediate: true })

const toggleEvent = (eventId: string) => {
  const index = selectedEvents.value.indexOf(eventId)
  if (index > -1) {
    selectedEvents.value.splice(index, 1)
  } else {
    selectedEvents.value.push(eventId)
  }
}

const handleSubmit = async () => {
  if (!props.heroData) return

  saving.value = true
  try {
    await emit('save', {
      id: props.heroData.id,
      cimg: formData.value.cimg,
      heading: formData.value.heading,
      description: formData.value.description,
      eventIds: isEvent.value ? undefined : selectedEvents.value
    })
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: oklch(0% 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-card-bg);
  border-radius: var(--radius-button);
  box-shadow: 0 25px 50px -12px oklch(0% 0 0 / 0.25);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: var(--border) solid var(--color-border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-contrast);
  margin: 0;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--color-dimmed);
  cursor: pointer;
  border-radius: var(--radius-button);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-muted-bg);
  color: var(--color-contrast);
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-contrast);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-bg);
  color: var(--color-contrast);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-base);
  box-shadow: 0 0 0 3px oklch(72.21% 0.2812 144.53 / 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.event-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-bg);
}

.event-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-option:hover {
  background: var(--color-muted-bg);
}

.event-option.selected {
  background: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.event-option input[type="checkbox"] {
  cursor: pointer;
}

.event-thumb {
  width: 3rem;
  height: 2rem;
  object-fit: cover;
  border-radius: 0.25rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: var(--border) solid var(--color-border);
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-button);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: var(--border-button) solid var(--color-border);
}

.btn-secondary {
  background: var(--color-bg);
  color: var(--color-contrast);
}

.btn-secondary:hover {
  background: var(--color-muted-bg);
}

.btn-primary {
  background: var(--color-primary-base);
  color: var(--color-primary-contrast);
  border-color: var(--color-primary-base);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
