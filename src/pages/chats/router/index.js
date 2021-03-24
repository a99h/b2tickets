export default [{
  path: '/chats',
  name: 'chats-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/pages/chats/ChatsPage.vue')
}]
