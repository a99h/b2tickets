import chatRoutes from '../apps/chat/router'

export default [{
  path: '/apps/chat',
  component: () => import(/* webpackChunkName: "apps-chat" */ '@/apps/chat/ChatApp.vue'),
  children: [
    ...chatRoutes
  ]
}]
