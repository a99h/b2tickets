export default [{
  path: '/chats',
  name: 'chats-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/apps/chat/pages/ChatsPage.vue')
}]