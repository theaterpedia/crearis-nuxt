<template>
  <article class="blog-preview">
    <div class="blog-image">
      <img :src="post.cimg" :alt="post.name" />
    </div>
    <div class="blog-content">
      <div class="blog-meta">
        <time :datetime="post.post_date">{{ formatDate(post.post_date) }}</time>
      </div>
      <h3 class="blog-title">{{ post.name }}</h3>
      <h4 v-if="post.subtitle" class="blog-subtitle">{{ post.subtitle }}</h4>
      <p class="blog-teaser">{{ post.teaser }}</p>
      <div class="blog-author">
        <span>{{ post['author_id/id'] ? post['author_id/id'].replace('_demo.instructor_', 'Autor ').replace(/^\d+/, '') : 'Autor' }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Post {
  id: string
  name: string
  subtitle?: string
  teaser: string
  'author_id/id': string
  cimg: string
  post_date: string
}

defineProps<{
  post: Post
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.blog-preview {
  display: flex;
  flex-direction: column;
  background: var(--color-card-bg);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius-button);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.blog-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -2px oklch(0% 0 0 / 0.05);
}

.blog-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-preview:hover .blog-image img {
  transform: scale(1.05);
}

.blog-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-meta {
  margin-bottom: 0.75rem;
}

.blog-meta time {
  font-size: 0.875rem;
  color: var(--color-dimmed);
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.5rem 0;
  color: var(--color-contrast);
}

.blog-subtitle {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
  color: var(--color-contrast);
}

.blog-teaser {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-dimmed);
  margin: 0 0 auto 0;
  flex: 1;
}

.blog-author {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: var(--border) solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-contrast);
  font-weight: 500;
}
</style>