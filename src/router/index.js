import Vue from 'vue'
import Router from 'vue-router'

// Routes
import AppsRoutes from './apps.routes'
import PagesRoutes from './pages.routes'

// Middlewares
import auth from './middleware/auth'
import middlewarePipeline from './middleware/middlewarePipeline'
import store from '@/store'

Vue.use(Router)

export const routes = [{
  path: '/',
  name: 'home',
  redirect: '/dashboard/analytics'
}, {
  path: '/dashboard/analytics',
  name: 'dashboard-analytics',
  component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/dashboard/DashboardPage.vue')
},
...AppsRoutes,
...PagesRoutes,
{
  path: '/blank',
  name: 'blank',
  component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
},
{
  path: '*',
  name: 'error',
  component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    to = {
      ...to,
      meta: {
        middleware: [
          auth
        ]
      }
    }
  }
  const { middleware } = to.meta
  const context = {
    to,
    from,
    next,
    store
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
