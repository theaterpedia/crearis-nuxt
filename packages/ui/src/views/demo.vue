<template>
  <div class="demo-page">
    <!-- Hero Section with Event Showcase -->
    <Box layout="full-width">
      <Main>
        <Hero
          v-if="currentEvent"
          :imgTmp="currentEvent.cimg"
          imgTmpAlignX="cover"
          imgTmpAlignY="center"
          contentType="banner"
          heightTmp="prominent"
        >
          <Banner transparent>
            <!-- Edit button (only visible when using SQL data source) -->
            <button
              v-if="dataSource === 'sql'"
              class="hero-edit-btn"
              @click="openEditModal"
              aria-label="Hero bearbeiten"
              title="Hero bearbeiten"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            <Prose>
              <h1>
                {{ formatEventDate(currentEvent.date_begin) }} – {{ formatEventDate(currentEvent.date_end) }}
                <strong>{{ currentEvent.name }}</strong>
              </h1>
              <p v-if="currentEvent.rectitle">
                <strong>{{ currentEvent.rectitle }}</strong>
              </p>
              <p v-if="currentEvent.teaser">{{ currentEvent.teaser }}</p>
            </Prose>
          </Banner>
        </Hero>

        <!-- Events Dropdown and Data Source Toggle positioned absolutely -->
        <div class="events-dropdown-container">
          <!-- Data Source Toggle -->
          <div class="data-source-toggle">
            <button
              :class="['source-btn', { active: dataSource === 'csv' }]"
              @click="dataSource = 'csv'"
              title="CSV Daten"
            >
              CSV
            </button>
            <button
              :class="['source-btn', { active: dataSource === 'sql' }]"
              @click="switchToSql"
              title="SQL Daten"
            >
              SQL
            </button>
          </div>

          <div class="events-toggle" ref="toggleRef">
            <button 
              class="events-toggle-button" 
              @click="toggleEventsDropdown"
              aria-label="Veranstaltung wählen"
              :aria-expanded="isEventsOpen"
            >
              <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V96H40ZM40,112H96v88H40Zm176,88H112V112H216v88Z"></path>
              </svg>
            </button>

            <div v-if="isEventsOpen" class="events-toggle-dropdown">
              <div class="events-toggle-header">
                <span>Veranstaltungen</span>
              </div>
              
              <button
                v-for="event in events"
                :key="event.id"
                class="events-toggle-option"
                :class="{ 'events-toggle-option-active': currentEventId === event.id }"
                @click="selectEvent(event.id)"
              >
                <img v-if="event.cimg" :src="event.cimg" :alt="event.name" class="events-option-image" />
                
                <div class="events-toggle-label">
                  <strong>{{ event.name }}</strong>
                  <span v-if="event.rectitle" class="events-toggle-description">{{ event.rectitle }}</span>
                </div>

                <svg 
                  v-if="currentEventId === event.id"
                  fill="currentColor" 
                  height="16" 
                  viewBox="0 0 256 256" 
                  width="16" 
                  xmlns="http://www.w3.org/2000/svg"
                  class="events-toggle-check"
                >
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Main>
    </Box>

    <!-- Content Sections -->
    <Box layout="centered">
      <Main>
        <!-- Posts Section -->
        <Section v-if="currentEventPosts.length > 0" background="default">
          <Container>
            <Heading headline="Aktuelle Beiträge" is="h2" />
            <Columns :align="'top'">
              <Column 
                v-for="post in currentEventPosts.slice(0, 4)" 
                :key="post.id"
                width="1/2"
              >
                <BlogPreview :post="post" />
              </Column>
            </Columns>
          </Container>
        </Section>

        <!-- Locations Section -->
        <Section v-if="currentEventLocations.length > 0" background="muted">
          <Container>
            <Heading headline="Veranstaltungsorte" is="h2" />
            <Columns :align="'top'">
              <Column 
                v-for="location in currentEventLocations.slice(0, 3)" 
                :key="location.id"
                :width="locationColumnWidth"
              >
                <LocationCard :location="location" />
              </Column>
            </Columns>
          </Container>
        </Section>

        <!-- Instructors Section -->
        <Section v-if="currentEventInstructors.length > 0" background="accent">
          <Container>
            <Heading headline="Kursleiter" is="h2" />
            <Columns :align="'top'">
              <Column 
                v-for="instructor in currentEventInstructors.slice(0, 3)" 
                :key="instructor.id"
                :width="instructorColumnWidth"
              >
                <InstructorCard :instructor="instructor" />
              </Column>
            </Columns>
          </Container>
        </Section>

        <!-- Participants Section -->
        <Section v-if="hasParticipants" background="default">
          <Container>
            <Heading headline="Teilnehmer" is="h2" />
            
            <div v-if="currentEventChildren.length > 0" class="participant-group">
              <Heading headline="Kinder" is="h3" />
              <Columns :align="'top'">
                <Column 
                  v-for="participant in currentEventChildren.slice(0, 4)" 
                  :key="participant.id"
                  width="1/4"
                >
                  <ParticipantCard :participant="participant" />
                </Column>
              </Columns>
            </div>
            
            <div v-if="currentEventTeens.length > 0" class="participant-group">
              <Heading headline="Jugendliche" is="h3" />
              <Columns :align="'top'">
                <Column 
                  v-for="participant in currentEventTeens.slice(0, 4)" 
                  :key="participant.id"
                  width="1/4"
                >
                  <ParticipantCard :participant="participant" />
                </Column>
              </Columns>
            </div>
            
            <div v-if="currentEventAdults.length > 0" class="participant-group">
              <Heading headline="Erwachsene" is="h3" />
              <Columns :align="'top'">
                <Column 
                  v-for="participant in currentEventAdults.slice(0, 4)" 
                  :key="participant.id"
                  width="1/4"
                >
                  <ParticipantCard :participant="participant" />
                </Column>
              </Columns>
            </div>
          </Container>
        </Section>
      </Main>
    </Box>

    <!-- Hero Edit Modal -->
    <HeroEditModal
      :is-open="isEditModalOpen"
      :hero-data="editingHero"
      :available-events="events"
      @close="closeEditModal"
      @save="saveHeroEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useDemoData } from '../composables/useDemoData'
import {
  Box,
  Main,
  Hero,
  Banner,
  Prose,
  Section,
  Container,
  Columns,
  Column,
  Heading
} from '@/index'
import BlogPreview from "./demo/BlogPreview.vue";
import LocationCard from "./demo/LocationCard.vue";
import InstructorCard from "./demo/InstructorCard.vue";
import ParticipantCard from "./demo/ParticipantCard.vue";
import HeroEditModal from './demo/HeroEditModal.vue'

const { 
  events,
  currentEvent,
  currentEventId,
  currentEventPosts,
  currentEventLocations,
  currentEventInstructors,
  currentEventChildren,
  currentEventTeens,
  currentEventAdults,
  switchEvent,
  dataSource,
  refreshSqlData
} = useDemoData()

// Events dropdown state
const isEventsOpen = ref(false)
const toggleRef = ref<HTMLElement>()

// Edit modal state
const isEditModalOpen = ref(false)
const editingHero = ref<any>(null)

const toggleEventsDropdown = () => {
  isEventsOpen.value = !isEventsOpen.value
}

const selectEvent = (eventId: string) => {
  switchEvent(eventId)
  isEventsOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (toggleRef.value && !toggleRef.value.contains(event.target as Node)) {
    isEventsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Date formatting
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Column widths based on number of items
const locationColumnWidth = computed(() => {
  const count = Math.min(currentEventLocations.value.length, 3)
  return count === 1 ? 'auto' : count === 2 ? '1/2' : '1/3'
})

const instructorColumnWidth = computed(() => {
  const count = Math.min(currentEventInstructors.value.length, 3)
  return count === 1 ? 'auto' : count === 2 ? '1/2' : '1/3'
})

const hasParticipants = computed(() => {
  return currentEventChildren.value.length > 0 || 
         currentEventTeens.value.length > 0 || 
         currentEventAdults.value.length > 0
})

// Switch to SQL data source
const switchToSql = async () => {
  dataSource.value = 'sql'
  await refreshSqlData()
}

// Edit modal functions
const openEditModal = () => {
  if (currentEvent.value) {
    editingHero.value = {
      id: currentEvent.value.id,
      cimg: currentEvent.value.cimg,
      heading: currentEvent.value.name,
      description: currentEvent.value.teaser || '',
      eventIds: []
    }
    isEditModalOpen.value = true
  }
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingHero.value = null
}

const saveHeroEdit = async (data: any) => {
  try {
    const response = await fetch('/api/demo/hero', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id,
        cimg: data.cimg,
        heading: data.heading,
        description: data.description,
        event_ids: data.eventIds?.join(',') || ''
      })
    })

    if (response.ok) {
      // Refresh data from SQL
      await refreshSqlData()
      closeEditModal()
      
      // Show success message (you can add a toast notification here)
      console.log('Hero updated successfully!')
    } else {
      throw new Error('Failed to save hero')
    }
  } catch (error) {
    console.error('Error saving hero:', error)
    // Show error message (you can add a toast notification here)
    alert('Fehler beim Speichern!')
  }
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-contrast);
}

/* Edit button in hero */
.hero-edit-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-card-bg);
  border: var(--border-button) solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-contrast);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px oklch(0% 0 0 / 0.1), 0 2px 4px -1px oklch(0% 0 0 / 0.06);
  z-index: 10;
}

.hero-edit-btn:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
}

.hero-edit-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Events Dropdown and Data Source Toggle positioned absolutely on hero */
.events-dropdown-container {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Data Source Toggle */
.data-source-toggle {
  display: flex;
  background: var(--color-card-bg);
  border: var(--border-button) solid var(--color-border);
  border-radius: var(--radius-button);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px oklch(0% 0 0 / 0.1), 0 2px 4px -1px oklch(0% 0 0 / 0.06);
}

.source-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-dimmed);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.source-btn:hover {
  background: var(--color-muted-bg);
  color: var(--color-contrast);
}

.source-btn.active {
  background: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

/* Events Toggle Menu (matching ToggleMenu styles) */
.events-toggle {
  position: relative;
  display: inline-block;
}

.events-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: var(--border-button) solid var(--color-border);
  border-radius: var(--radius-button);
  background-color: var(--color-card-bg);
  color: var(--color-card-contrast);
  cursor: pointer;
  transition: all 0.2s ease;
}

.events-toggle-button:hover {
  background-color: var(--color-muted-bg);
}

.events-toggle-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 20rem;
  max-width: 24rem;
  background-color: var(--color-popover-bg);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  box-shadow: 0 10px 25px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
  z-index: 50;
  max-height: 70vh;
  overflow-y: auto;
}

.events-toggle-header {
  padding: 0.75rem 1rem;
  border-bottom: var(--border) solid var(--color-border);
  font-weight: 500;
  color: var(--color-contrast);
  font-size: 0.875rem;
}

.events-toggle-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 0.75rem;
}

.events-toggle-option:hover {
  background-color: var(--color-muted-bg);
}

.events-toggle-option-active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.events-option-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.events-toggle-label {
  flex: 1;
  min-width: 0;
}

.events-toggle-label strong {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25;
  color: inherit;
}

.events-toggle-description {
  display: block;
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--color-dimmed);
  margin-top: 0.125rem;
}

.events-toggle-option-active .events-toggle-description {
  color: var(--color-primary-contrast);
  opacity: 0.8;
}

.events-toggle-check {
  flex-shrink: 0;
  margin-left: 0.5rem;
}

/* Participant Groups */
.participant-group {
  margin-bottom: 2rem;
}

.participant-group:last-child {
  margin-bottom: 0;
}



/* Responsive Design */
@media (max-width: 768px) {
  .events-dropdown-container {
    top: 1rem;
    right: 1rem;
  }

  .events-toggle-dropdown {
    min-width: 18rem;
    max-width: calc(100vw - 2rem);
  }
}

@media (max-width: 480px) {
  .events-dropdown-container {
    top: 0.5rem;
    right: 0.5rem;
  }

  .events-toggle-dropdown {
    min-width: 16rem;
  }
}
</style>