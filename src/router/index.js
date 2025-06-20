import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  {
    path: '/multas',
    name: 'multas',
    component: () => import('@/views/MultasView.vue'),
    meta: { requiresAuth: true, role: 'inquilino' }
  },
  {
    path: '/panel',
    name: 'panel',
    component: () => import('@/views/PanelView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: 'login' })
  }

  if (to.meta.role && auth.user?.tipo !== to.meta.role) {
    return next({ name: 'home' })
  }

  next()
})

export default router
