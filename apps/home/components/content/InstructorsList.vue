<template>
  <div v-if="resolvedInstructors.length > 0" class="instructors-list">
    <div
      v-for="instructor in resolvedInstructors"
      :key="instructor.id"
      class="instructors-list__item"
    >
      <NuxtLink v-if="instructor.profile?._path" :to="instructor.profile._path" class="instructors-list__image-link">
        <div v-if="instructor.profile?.image?.src" class="instructors-list__image">
          <img :src="instructor.profile.image.src" :alt="instructor.profile.title" />
        </div>
        <div v-else class="instructors-list__image instructors-list__image--placeholder">
          <span>{{ getInitials(instructor.profile?.title) }}</span>
        </div>
      </NuxtLink>
      
      <div class="instructors-list__content">
        <div class="instructors-list__header">
          <span class="instructors-list__label">{{ label }}</span>
          <NuxtLink v-if="instructor.profile?._path" :to="instructor.profile._path" class="instructors-list__name">
            {{ instructor.profile?.title || instructor.id }}
          </NuxtLink>
          <span v-else class="instructors-list__name">{{ instructor.id }}</span>
        </div>
        
        <p v-if="instructor.body" class="instructors-list__body">
          {{ instructor.body }}
        </p>
        <p v-else-if="instructor.profile?.teamMember" class="instructors-list__body">
          {{ getDefaultBody(instructor.profile) }}
        </p>
        
        <NuxtLink
          v-if="instructor.profile?._path && instructor.profile?.consulting"
          :to="instructor.profile._path"
          class="instructors-list__link"
        >
          → Profil & Beratung
        </NuxtLink>
        <NuxtLink
          v-else-if="instructor.profile?._path"
          :to="instructor.profile._path"
          class="instructors-list__link"
        >
          → Profil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { NuxtLink } from '#components'

type InstructorSpec = string | { [id: string]: { body?: string } }

interface ProfileData {
  _path?: string
  id?: string
  title?: string
  teamMember?: string
  image?: { src?: string; alt?: string }
  consulting?: object
}

interface ResolvedInstructor {
  id: string
  body?: string
  profile?: ProfileData
}

const { page } = useContent()

const props = defineProps({
  /**
   * Label shown before instructor name
   * @default 'mit'
   */
  label: {
    type: String,
    default: 'mit',
  },
  /**
   * Field name to read from page (instructors for events, creators for posts)
   * @default 'instructors'
   */
  field: {
    type: String as PropType<'instructors' | 'creators'>,
    default: 'instructors',
  },
})

// Get instructors/creators spec from page frontmatter
const instructorSpecs = computed<InstructorSpec[]>(() => {
  const pageData = page.value as any
  return pageData?.[props.field] || []
})

// Parse the flexible spec format
function parseSpec(spec: InstructorSpec): { id: string; body?: string } {
  if (typeof spec === 'string') {
    return { id: spec }
  }
  // Object form: { hans_doenitz: { body: "..." } }
  const id = Object.keys(spec)[0]
  const config = spec[id] as { body?: string }
  return { id, body: config?.body }
}

// Fetch all team profiles
const { data: allProfiles } = await useAsyncData(
  'team-profiles-pool',
  () => queryContent('/institut').find()
)

// Resolve instructor specs to profile data
const resolvedInstructors = computed<ResolvedInstructor[]>(() => {
  if (!instructorSpecs.value.length) return []
  
  return instructorSpecs.value.map(spec => {
    const { id, body } = parseSpec(spec)
    const profile = allProfiles.value?.find((p: ProfileData) => p.id === id) as ProfileData | undefined
    return { id, body, profile }
  })
})

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getDefaultBody(profile?: ProfileData): string {
  if (!profile?.title) return ''
  return `${profile.title} ist Dozent:in bei DAS Ei.`
}
</script>

<style scoped>
.instructors-list {
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instructors-list__item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-card-bg, #fff);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.instructors-list__image-link {
  flex-shrink: 0;
}

.instructors-list__image {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
}

.instructors-list__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instructors-list__image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-muted-bg);
  color: var(--color-text-muted);
  font-size: 1.25rem;
  font-weight: 600;
}

.instructors-list__content {
  flex: 1;
  min-width: 0;
}

.instructors-list__header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.instructors-list__label {
  font-size: 0.875rem;
  color: var(--color-text-muted, #666);
}

.instructors-list__name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
}

.instructors-list__name:hover {
  text-decoration: underline;
}

.instructors-list__body {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text);
  margin: 0 0 0.75rem;
}

.instructors-list__link {
  font-size: 0.875rem;
  color: var(--color-primary, #0066cc);
  text-decoration: none;
}

.instructors-list__link:hover {
  text-decoration: underline;
}
</style>
