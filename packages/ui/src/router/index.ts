import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/heading', component: () => import('../views/heading.vue') }, 
    { path: '/container', component: () => import('../views/container.vue') }, 
  ],
})
