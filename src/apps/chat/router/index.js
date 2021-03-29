export default [{
  path: '',
  redirect: 'channel/general'
}, {
  path: 'channel',
  redirect: 'channel/general'
}, {
  path: 'chat',
  name: 'apps-chat',
  component: () => import(/* webpackChunkName: "apps-chat" */ '@/apps/chat/ChatApp.vue')
}, {
  path: 'channel/:id',
  name: 'apps-chat-channel',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChannelPage.vue')
}, {
  path: 'channel/:id/create-ticket',
  name: 'apps-chat-channel-create-ticket',
  redirect: 'channel/:id'
}, {
  path: 'chats',
  name: 'apps-chat-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/apps/chat/pages/ChatsPage.vue')
}, {
  path: 'request',
  name: 'apps-chat-request',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChatRequestPage.vue')
}
]
