export default [{
  path: '/tickets/:chatId?',
  name: 'ticket-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/pages/tickets/TicketsPage.vue')
}]
