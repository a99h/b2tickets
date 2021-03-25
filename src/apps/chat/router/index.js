export default [{
  path: '',
  redirect: 'channel/general'
},{
  path: 'channel',
  name: 'apps-chat-general',
  component: () => import(/* webpackChunkName: "apps-chat-general" */ '@/apps/chat/ChatApp.vue')
}, {
  path: 'channel/:id',
  name: 'apps-chat-channel',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChannelPage.vue')
},{
  path: 'request',
  name: 'apps-chat-request',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChatRequestPage.vue')
},{
  path: 'channel/:id/create-ticket',
  name: 'apps-chat-channel-create-ticket',
  redirect: 'channel/:id'
}]
