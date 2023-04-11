import { createRouter, createWebHistory } from 'vue-router'

const view = (file) => () => import(`../views/${file}`)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'colors',
      component: view('Colors.vue')
    }
  ]
})

export default router
