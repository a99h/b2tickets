export default [{
  path: '/tickets',
  name: 'tickets-list',
  component: () => import(/* webpackChunkName: "tickets-list" */ '@/pages/tickets/TicketsPage.vue')
}]
