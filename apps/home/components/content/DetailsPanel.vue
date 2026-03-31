<template>
  <SectionContainer :background="background" :flush="hasSidebarContent">
    <!-- Fallback: MissingComponent if info is missing or empty -->
    <MissingComponent 
      v-if="!hasInfo" 
      compName="DetailsPanel" 
      :title="`details.${step || 'first'}.info is missing or empty`" 
    />
    
    <!-- mode=default or mode=slide: split info keys into 2 columns (only if no sidebar content) -->
    <template v-else-if="(mode === 'default' || mode === 'slide') && !hasSidebarContent">
      <h3 v-if="mode === 'slide'" class="details-panel__slide-heading">{{ slideHeading }}</h3>
      
      <Columns v-if="infoKeys.length > 1" gap="medium">
        <Column width="1/2">
          <CatBlock :content="info[infoKeys[0]]" htag="h4" />
        </Column>
        <Column width="1/2">
          <CatBlock :content="info[infoKeys[1]]" htag="h4" />
        </Column>
      </Columns>
      
      <!-- Single column if only one info key -->
      <div v-else>
        <CatBlock :content="info[infoKeys[0]]" htag="h4" />
      </div>
      
      <!-- Button (only for default mode, not slide) -->
      <div v-if="button && mode === 'default'" class="details-panel__button">
        <ButtonTmp :toDetails="true" :variant="buttonVariant">
          {{ buttonLabel }}
        </ButtonTmp>
      </div>
    </template>
    
    <!-- mode=body: all info keys left, ContentSlot right -->
    <template v-else-if="mode === 'body'">
      <Columns gap="medium">
        <Column width="1/2">
          <template v-for="(value, key) in info" :key="key">
            <CatBlock :content="value" htag="h4" style="padding-bottom: 1rem" />
          </template>
        </Column>
        <Column width="1/2">
          <ContentSlot unwrap="p" />
        </Column>
      </Columns>
      
      <div v-if="button" class="details-panel__button">
        <ButtonTmp :toDetails="true" :variant="buttonVariant">
          {{ buttonLabel }}
        </ButtonTmp>
      </div>
    </template>
    
    <!-- mode=choices: all info keys left, DetailsChoices right (placeholder for sister component) -->
    <template v-else-if="mode === 'choices'">
      <Columns gap="medium">
        <Column width="1/2">
          <template v-for="(value, key) in info" :key="key">
            <CatBlock :content="value" htag="h4" style="padding-bottom: 1rem" />
          </template>
        </Column>
        <Column width="1/2">
          <!-- Placeholder for DetailsChoices sister component -->
          <div class="details-panel__choices-placeholder">
            <p><em>DetailsChoices component (coming soon)</em></p>
          </div>
        </Column>
      </Columns>
      
      <div v-if="button" class="details-panel__button">
        <ButtonTmp :toDetails="true" :variant="buttonVariant">
          {{ buttonLabel }}
        </ButtonTmp>
      </div>
    </template>
    
    <!-- Sidebar mode: info left, related content right (events/courses/posts flags) -->
    <template v-else-if="hasSidebarContent">
      <Columns gap="medium">
        <Column width="1/2">
          <template v-for="(value, key) in info" :key="key">
            <CatBlock :content="value" htag="h4" style="padding-bottom: 1rem" />
          </template>
        </Column>
        <Column width="1/2">
          <!-- Event siblings (dates) - only for event pages with siblings -->
          <EventSiblings v-if="events" class="details-panel__sidebar-section" />
          
          <!-- Related events from YAML -->
          <RelatedContent v-if="events" type="events" class="details-panel__sidebar-section" />
          
          <!-- Related courses from YAML -->
          <RelatedContent v-if="courses" type="courses" class="details-panel__sidebar-section" />
          
          <!-- Related posts from YAML -->
          <RelatedContent v-if="posts" type="posts" class="details-panel__sidebar-section" />
        </Column>
      </Columns>
      
      <div v-if="button" class="details-panel__button">
        <ButtonTmp :toDetails="true" :variant="buttonVariant">
          {{ buttonLabel }}
        </ButtonTmp>
      </div>
    </template>
  </SectionContainer>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { Column, Columns } from '@crearis/ui'

const { page } = useContent()

const props = defineProps({
  /**
   * Display mode for the panel.
   * - default: split info keys into two columns
   * - slide: same as default but with heading, for use in sliders
   * - body: info left, callout body content right
   * - choices: info left, DetailsChoices component right (placeholder)
   *
   * @default 'default'
   */
  mode: {
    type: String as PropType<'default' | 'slide' | 'body' | 'choices'>,
    default: 'default',
  },

  /**
   * Which step from details object to display.
   * If not provided, uses the first step that's not 'kontakt' or 'checks'.
   */
  step: {
    type: String,
    default: undefined,
  },

  /**
   * Show the action button.
   * @default false
   */
  button: {
    type: Boolean,
    default: false,
  },

  /**
   * Button label text.
   * @default 'Weiter'
   */
  buttonLabel: {
    type: String,
    default: 'Weiter',
  },

  /**
   * Button variant.
   * @default 'primary'
   */
  buttonVariant: {
    type: String as PropType<'primary' | 'plain'>,
    default: 'primary',
  },

  /**
   * Heading for slide mode.
   * @default 'Agenda'
   */
  slideHeading: {
    type: String,
    default: 'Agenda',
  },

  /**
   * Background variant for the SectionContainer.
   * @default 'default'
   */
  background: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
    default: 'default',
  },

  /**
   * Show related events + event siblings in right sidebar.
   * @default false
   */
  events: {
    type: Boolean,
    default: false,
  },

  /**
   * Show related courses in right sidebar.
   * @default false
   */
  courses: {
    type: Boolean,
    default: false,
  },

  /**
   * Show related posts in right sidebar.
   * @default false
   */
  posts: {
    type: Boolean,
    default: false,
  },
})

// Check if any sidebar content is requested
const hasSidebarContent = computed(() => {
  return props.events || props.courses || props.posts
})

// Get the step info object
const stepData = computed(() => {
  const details = page.value?.details
  if (!details) return null

  if (props.step) {
    return details[props.step] || null
  }

  // Default: first step that's not kontakt/checks
  const keys = Object.keys(details).filter(k => k !== 'kontakt' && k !== 'checks')
  if (keys.length === 0) return null
  return details[keys[0]] || null
})

// Get the info object from the step
const info = computed(() => {
  return stepData.value?.info || null
})

// Get keys of the info object
const infoKeys = computed(() => {
  if (!info.value) return []
  return Object.keys(info.value)
})

// Check if we have valid info content
const hasInfo = computed(() => {
  return info.value !== null && infoKeys.value.length > 0
})
</script>

<style scoped>
.details-panel__slide-heading {
  font-family: var(--headings);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.details-panel__button {
  margin-top: 2rem;
  text-align: right;
}

.details-panel__choices-placeholder {
  padding: 2rem;
  background: var(--color-muted-bg);
  border-radius: 0.5rem;
  text-align: center;
  color: var(--color-muted-contrast);
}

.details-panel__sidebar-section {
  margin-bottom: 1.5rem;
}

.details-panel__sidebar-section:last-child {
  margin-bottom: 0;
}

/* Override nested component padding for sidebar context */
.details-panel__sidebar-section :deep(.event-siblings),
.details-panel__sidebar-section :deep(.related-content) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
