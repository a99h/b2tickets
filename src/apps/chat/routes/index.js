export default [{
  path: '',
  redirect: 'request'
},{
  path: 'request',
  name: 'apps-chat-request',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChatRequestPage.vue')
}, {
  path: 'channel/:id',
  name: 'apps-chat-channel',
  component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChannelPage.vue')
}]
