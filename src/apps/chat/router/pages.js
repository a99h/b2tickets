export default [{
  path: 'chats',
  name: 'apps-chat-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/apps/chat/pages/ChatsPage.vue')
}, {
  path: 'request',
  name: 'apps-chat-request',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChatRequestPage.vue')
}]