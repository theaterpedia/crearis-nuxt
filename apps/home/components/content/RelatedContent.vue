<template>
  <div v-if="hasRelated" :class="['related-content', { 'related-content--sidebar': sidebar }]">
    <h3 v-if="showHeading" class="related-content__heading">{{ heading }}</h3>
    
    <!-- Related Events -->
    <div v-if="showEvents && resolvedEvents.length > 0" class="related-content__section">
      <div class="related-content__section-label">Ähnliche Veranstaltungen</div>
      <div class="related-content__items">
        <NuxtLink
          v-for="event in resolvedEvents"
          :key="event._path"
          :to="event._path"
          class="related-content__card"
        >
          <div v-if="event.image?.src" class="related-content__image">
            <img :src="event.image.src" :alt="event.image?.alt || event.title" />
          </div>
          <div class="related-content__text">
            <Heading 
              v-if="event.heading" 
              :content="event.heading" 
              is="h4" 
              card 
            />
            <template v-else>
              <span class="related-content__tag">{{ event.tag || 'Event' }}</span>
              <span class="related-content__title">{{ event.title }}</span>
            </template>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Related Posts -->
    <div v-if="showPosts && resolvedPosts.length > 0" class="related-content__section">
      <div class="related-content__section-label">Passende Beiträge</div>
      <div class="related-content__items">
        <NuxtLink
          v-for="post in resolvedPosts"
          :key="post._path"
          :to="post._path"
          class="related-content__card"
        >
          <div v-if="post.image?.src" class="related-content__image">
            <img :src="post.image.src" :alt="post.image?.alt || post.title" />
          </div>
          <div class="related-content__text">
            <Heading 
              v-if="post.heading" 
              :content="post.heading" 
              is="h4" 
              card 
            />
            <template v-else>
              <span class="related-content__tag">{{ post.blog || 'Blog' }}</span>
              <span class="related-content__title">{{ post.title }}</span>
            </template>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Related Courses -->
    <div v-if="showCourses && resolvedCourses.length > 0" class="related-content__section">
      <div class="related-content__section-label">Ausbildungen</div>
      <div class="related-content__items">
        <NuxtLink
          v-for="course in resolvedCourses"
          :key="course._path"
          :to="course._path"
          class="related-content__card"
        >
          <div v-if="course.image?.src" class="related-content__image">
            <img :src="course.image.src" :alt="course.image?.alt || course.title" />
          </div>
          <div class="related-content__text">
            <Heading 
              v-if="course.heading" 
              :content="course.heading" 
              is="h4" 
              card 
            />
            <template v-else>
              <span class="related-content__tag">Kurs</span>
              <span class="related-content__title">{{ course.title }}</span>
            </template>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { NuxtLink } from '#components'

interface RelatedSpec {
  events?: string[]
  posts?: number[]
  courses?: string[]
}

interface ContentItem {
  _path?: string
  id?: string | number
  shortcode?: string
  title?: string
  heading?: string
  tag?: string
  blog?: string
  image?: { src?: string; alt?: string }
}

const { page } = useContent()

const props = defineProps({
  /**
   * Heading text (shown when type is not set)
   * @default 'Siehe auch'
   */
  heading: {
    type: String,
    default: 'Siehe auch',
  },
  /**
   * Filter to single type: 'events', 'courses', 'posts'
   * When set, only shows that section without main heading
   */
  type: {
    type: String as PropType<'events' | 'courses' | 'posts' | undefined>,
    default: undefined,
  },
  /**
   * Sidebar mode: enables compact styles for 768-839px viewport
   */
  sidebar: {
    type: Boolean,
    default: false,
  },
})

// Which sections to show based on type prop
const showEvents = computed(() => !props.type || props.type === 'events')
const showCourses = computed(() => !props.type || props.type === 'courses')
const showPosts = computed(() => !props.type || props.type === 'posts')
const showHeading = computed(() => !props.type) // Only show main heading when showing all

// Get related spec from page frontmatter
const relatedSpec = computed<RelatedSpec>(() => {
  return (page.value as any)?.related || {}
})

const hasRelated = computed(() => {
  const r = relatedSpec.value
  if (props.type === 'events') return (r.events?.length || 0) > 0
  if (props.type === 'courses') return (r.courses?.length || 0) > 0
  if (props.type === 'posts') return (r.posts?.length || 0) > 0
  return (r.events?.length || 0) + (r.posts?.length || 0) + (r.courses?.length || 0) > 0
})

// Fetch related events by id
const { data: allEvents } = await useAsyncData(
  'related-events-pool',
  () => queryContent('/agenda').where({ ctype: 'event' }).find()
)

const resolvedEvents = computed(() => {
  const eventIds = relatedSpec.value.events || []
  if (!eventIds.length || !allEvents.value) return []
  
  return eventIds
    .map(id => allEvents.value?.find((e: ContentItem) => e.id === id))
    .filter(Boolean) as ContentItem[]
})

// Fetch related posts by id
const { data: allPosts } = await useAsyncData(
  'related-posts-pool',
  () => queryContent('/blog').find()
)

const resolvedPosts = computed(() => {
  const postIds = relatedSpec.value.posts || []
  if (!postIds.length || !allPosts.value) return []
  
  return postIds
    .map(id => allPosts.value?.find((p: ContentItem) => p.id === id))
    .filter(Boolean) as ContentItem[]
})

// Fetch related courses by shortcode
const { data: allCourses } = await useAsyncData(
  'related-courses-pool',
  () => queryContent('/agenda').where({ ctype: 'course' }).find()
)

const resolvedCourses = computed(() => {
  const courseShortcodes = relatedSpec.value.courses || []
  if (!courseShortcodes.length || !allCourses.value) return []
  
  return courseShortcodes
    .map(sc => allCourses.value?.find((c: ContentItem) => c.shortcode === sc))
    .filter(Boolean) as ContentItem[]
})
</script>

<style scoped>
.related-content {
  padding: 2rem 0;
}

.related-content--sidebar {
  padding: 0;
}

/* Sidebar mode: remove card min-width constraint */
.related-content--sidebar .related-content__card {
  min-width: 0;
}

.related-content__heading {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.related-content__section {
  margin-bottom: 1.5rem;
}

.related-content__section:last-child {
  margin-bottom: 0;
}

.related-content__items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.related-content__card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-card-bg, #fff);
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s ease;
  min-width: 380px;
  max-width: 430px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.related-content__card:hover {
  background-color: var(--color-muted-bg);
}

.related-content__image {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 0.25rem;
  overflow: hidden;
}

.related-content__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-content__text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.related-content__section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted, #666);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.related-content__tag {
  font-size: 0.75rem;
  color: var(--color-text-muted, #666);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.related-content__title {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Heading component styling within cards */
.related-content__text :deep(.heading) {
  margin: 0;
  padding: 0;
}

.related-content__text :deep(.heading .overline) {
  font-size: 0.75rem;
  color: var(--color-text-muted, #666);
  font-weight: 400;
  display: block;
  line-height: 1.3;
}

.related-content__text :deep(.heading h4) {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

/* Compact cards in sidebar at narrow 2-col viewports */
@media (min-width: 768px) and (max-width: 887px),
       (min-width: 1024px) and (max-width: 1179px) {
  .related-content--sidebar .related-content__section {
    max-width: 280px;
  }
  
  .related-content--sidebar .related-content__card {
    max-width: 280px;
  }
  
  .related-content--sidebar .related-content__image {
    display: none;
  }
  
  .related-content--sidebar .related-content__text :deep(.prose h4.heading strong) {
    font-size: 1rem !important; /* 16px */
  }
}

/* Mobile: compact headline at narrow viewport */
@media (max-width: 440px) {
  .related-content .related-content__text :deep(.prose h4.heading strong) {
    font-size: 1rem !important; /* 16px */
  }
}
</style>
