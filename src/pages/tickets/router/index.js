export default [{
  path: '/tickets',
  name: 'ticket-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/pages/tickets/TicketsPage.vue')
}]
