import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/index.vue') },
    { path: '/catalog', component: () => import('../views/catalog.vue') },
    { path: '/demo', component: () => import('../views/demo.vue') },
    { path: '/heading', component: () => import('../views/heading.vue') },
    { path: '/heroes', component: () => import('../views/heroes.vue') },
    { path: '/standard', component: () => import('../views/standard.vue') },
    // { path: '/text-image', component: () => import('../views/text-image.vue') },
    { path: '/timeline', component: () => import('../views/timeline.vue') },
  ],
})
