export default [
  {
    icon: 'mdi-history',
    key: 'b2tickets.chat.chatHistory',
    text: 'Chat history',
    link: '/apps/chat/chats'
  },
  {
    icon: 'mdi-card-bulleted-settings',
    key: 'b2tickets.ticket.tickets',
    text: 'Tickets',
    link: '/tickets'
  },
  {
    icon: 'mdi-account-multiple',
    key: 'menu.users',
    text: 'Users',
    link: '/users/list'
  },
  { icon: 'mdi-file-lock-outline', key: 'menu.auth', text: 'Auth Pages', regex: /^\/auth/,
    items: [
      { icon: 'mdi-file-outline', key: 'menu.authLogin', text: 'Signin / Login', link: '/auth/signin' },
      { icon: 'mdi-file-outline', key: 'usermenu.signout', text: 'Logout', link: '/auth/logout' }
    ]
  }
]
