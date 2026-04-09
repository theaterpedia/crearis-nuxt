<template>
  <SectionContainer :background="background" :flush="hasSidebarContent">
    <!-- Fallback: MissingComponent if info is missing or empty (skip when mode=body with sidebar) -->
    <MissingComponent 
      v-if="!hasInfo && !(mode === 'body' && hasSidebarContent)" 
      compName="DetailsPanel" 
      :title="`details.${step || 'first'}.info is missing or empty`" 
    />
    
    <!-- mode=default or mode=slide: split info keys into 2 columns (only if no sidebar content) -->
    <template v-else-if="(mode === 'default' || mode === 'slide') && !hasSidebarContent">
      <h3 v-if="mode === 'slide'" class="details-panel__slide-heading">{{ slideHeading }}</h3>
      
      <Columns v-if="infoKeys.length > 1" gap="medium">
        <Column width="1/2">
          <CatBlock :content="infoObj[infoKeys[0]]" htag="h4" />
        </Column>
        <Column width="1/2">
          <CatBlock :content="infoObj[infoKeys[1]]" htag="h4" />
        </Column>
      </Columns>
      
      <!-- Single column if only one info key -->
      <div v-else>
        <CatBlock :content="infoObj[infoKeys[0]]" htag="h4" />
      </div>
      
      <!-- Button (only for default mode, not slide) -->
      <div v-if="button && mode === 'default'" class="details-panel__button">
        <ButtonTmp :toDetails="true" :variant="buttonVariant">
          {{ buttonLabel }}
        </ButtonTmp>
      </div>
    </template>
    
    <!-- mode=body: all info keys left, ContentSlot right (without sidebar) -->
    <template v-else-if="mode === 'body' && !hasSidebarContent">
      <Columns gap="medium">
        <Column width="1/2">
          <template v-for="(value, key) in infoObj" :key="key">
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
          <template v-for="(value, key) in infoObj" :key="key">
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
    
    <!-- Sidebar mode: body or info left, related content right (events/courses/posts flags) -->
    <template v-else-if="hasSidebarContent">
      <Columns gap="medium" class="details-panel__sidebar-columns">
        <Column width="1/2">
          <!-- mode=body: render slot/body content instead of YAML info -->
          <template v-if="mode === 'body'">
            <ContentSlot unwrap="p" />
          </template>
          <!-- default: render YAML info keys -->
          <template v-else>
            <template v-for="(value, key) in infoObj" :key="key">
              <CatBlock :content="value" htag="h4" style="padding-bottom: 1rem" />
            </template>
          </template>
        </Column>
        <Column width="1/2">
          <!-- YAML info keys in sidebar (when info flag is set) -->
          <template v-if="props.info && hasInfo">
            <template v-for="(value, key) in infoObj" :key="key">
              <CatBlock :content="value" htag="h4" style="padding-bottom: 1rem" />
            </template>
          </template>

          <!-- Event siblings (dates) - only for event pages with siblings -->
          <EventSiblings v-if="events" class="details-panel__sidebar-section" />
          
          <!-- Related events from YAML -->
          <RelatedContent v-if="events" type="events" sidebar class="details-panel__sidebar-section" />
          
          <!-- Related courses from YAML -->
          <RelatedContent v-if="courses" type="courses" sidebar class="details-panel__sidebar-section" />
          
          <!-- Related posts from YAML -->
          <RelatedContent v-if="posts" type="posts" sidebar class="details-panel__sidebar-section" />
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

  /**
   * Show YAML info keys in the right sidebar column (above related content).
   * Use with mode=body to get: body left, info + sidebar right.
   * @default false
   */
  info: {
    type: Boolean,
    default: false,
  },
})

// Check if any sidebar content is requested
const hasSidebarContent = computed(() => {
  return props.events || props.courses || props.posts || props.info
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
const infoObj = computed(() => {
  return stepData.value?.info || null
})

// Get keys of the info object
const infoKeys = computed(() => {
  if (!infoObj.value) return []
  return Object.keys(infoObj.value)
})

// Check if we have valid info content
const hasInfo = computed(() => {
  return infoObj.value !== null && infoKeys.value.length > 0
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

/* 768-887px: Force 2-col with minimal gap */
@media (min-width: 768px) and (max-width: 887px) {
  .details-panel__sidebar-columns {
    flex-wrap: nowrap !important;
    gap: 0.625rem !important; /* 10px */
  }
}

/* 1024-1179px: Reduce gap to prevent overflow to 1-col */
@media (min-width: 1024px) and (max-width: 1179px) {
  .details-panel__sidebar-columns {
    gap: 1.75rem !important; /* 28px instead of 56px */
  }
}

@media (min-width: 1024px) and (max-width: 1059px) {
  .details-panel__sidebar-columns :deep(> :first-child) {
    max-width: 400px;
  }
}

/* Remove Column min-width constraint for 2-col layout at all tablet+ viewports */
.details-panel__sidebar-columns :deep(.column) {
  min-width: 0 !important;
}
</style>
