export default [
  { icon: 'mdi-file-lock-outline', key: 'menu.auth', text: 'Auth Pages', regex: /^\/auth/,
    items: [
      { icon: 'mdi-file-outline', key: 'menu.authLogin', text: 'Signin / Login', link: '/auth/signin' },
      { icon: 'mdi-file-outline', key: 'menu.authRegister', text: 'Signup / Register', link: '/auth/signup' },
      { icon: 'mdi-file-outline', key: 'menu.authVerify', text: 'Verify Email', link: '/auth/verify-email' },
      { icon: 'mdi-file-outline', key: 'menu.authForgot', text: 'Forgot Password', link: '/auth/forgot-password' },
      { icon: 'mdi-file-outline', key: 'menu.authReset', text: 'Reset Password', link: '/auth/reset-password' },
      { icon: 'mdi-file-outline', key: 'usermenu.signout', text: 'Logout', link: '/auth/logout' }
    ]
  },
  { icon: 'mdi-card-bulleted-settings', key: 'b2tickets.ticket.tickets', text: 'Tickets', link: '/tickets' }
]
