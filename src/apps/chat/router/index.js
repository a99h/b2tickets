import pages from './pages'

export default [
  {
    path: '',
    redirect: 'channel/general'
  },
  {
    path: 'channel',
    redirect: 'channel/general'
  },
  {
    path: 'chats',
    name: 'apps-chat-chats',
    component: () => import(/* webpackChunkName: "apps-chat" */ '@/apps/chat/pages/ChatsPage.vue')
  },
  {
    path: 'channel/:id',
    name: 'apps-chat-channel',
    component: () => import(/* webpackChunkName: "apps-chat-channel" */ '@/apps/chat/pages/ChannelPage.vue')
  },
  {
    path: 'channel/:id/create-ticket',
    name: 'apps-chat-channel-create-ticket',
    redirect: 'channel/:id'
  },
  ...pages
]
