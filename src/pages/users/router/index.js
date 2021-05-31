export default [{
  path: '/users',
  name: 'users',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/users/UsersPage.vue')
}, {
  path: '/users/edit',
  name: 'users-edit',
  component: () => import(/* webpackChunkName: "users-edit" */ '@/pages/users/EditUserPage.vue')
}]
