import guest from '@/router/middleware/guest'

export default [{
  path: '/signin',
  name: 'auth-signin',
  component: () => import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/SigninPage.vue'),
  meta: {
    layout: 'auth',
    middleware: [
      guest
    ]
  }
},
// {
// path: '/signup',
// name: 'auth-signup',
// component: () => import(/* webpackChunkName: "auth-signup" */ '@/pages/auth/SignupPage.vue'),
// meta: {
//   layout: 'auth'
// }
// },
// {
// path: '/logout',
// name: 'auth-logout',
// component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/auth/LogoutPage.vue')
// },
// {
// path: '/verify-email',
// name: 'auth-verify-email',
// component: () => import(/* webpackChunkName: "auth-verify-email" */ '@/pages/auth/VerifyEmailPage.vue'),
// meta: {
//   layout: 'auth'
// }
// },
{
  path: '/forgot-password',
  name: 'auth-forgot',
  component: () => import(/* webpackChunkName: "auth-forgot" */ '@/pages/auth/ForgotPage.vue'),
  meta: {
    layout: 'auth'
  }
}
// {
//   path: '/reset-password',
//   name: 'auth-reset',
//   component: () => import(/* webpackChunkName: "auth-reset" */ '@/pages/auth/ResetPage.vue'),
//   meta: {
//     layout: 'auth'
//   }
// }
]