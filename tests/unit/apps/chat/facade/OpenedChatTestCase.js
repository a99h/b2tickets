const user = {
  id: 6,
  name: 'Operator 1',
  email: 'operator1@example.com',
  email_verified_at: '2021-05-13T19:15:10.000000Z',
  created_at: '2021-05-13T19:15:10.000000Z',
  updated_at: '2021-05-13T19:15:10.000000Z',
  userRoles: [{
    id: 2,
    name: 'operator',
    hasPermissions: [{
      name: 'show users',
      guard_name: 'api',
      created_at: '2021-05-13T19:15:10.000000Z'
    }]
  }],
  userSettings: {
    avatar: '/images/avatars/avatar1.svg'
  }
}
const newUser = {
  id: 7,
  name: 'Getters and setters test operator',
  email: 'operator2@example.com',
  email_verified_at: '2021-05-13T19:15:10.000000Z',
  created_at: '2021-05-13T19:15:10.000000Z',
  updated_at: '2021-05-13T19:15:10.000000Z',
  userRoles: [{
    id: 2,
    name: 'operator',
    hasPermissions: [{
      name: 'show users',
      guard_name: 'api',
      created_at: '2021-05-13T19:15:10.000000Z'
    }]
  }],
  userSettings: {
    avatar: '/images/avatars/avatar1.svg'
  }
}
const message = {
  id: 1,
  text: 'Fugiat illum.',
  user: {
    id: 1,
    name: 'Clovis Eichmann',
    email: 'gust.stracke@example.org',
    userSettings: {
      avatar: '/images/avatars/avatar1.svg'
    }
  },
  timestamp: 1621026592000
}

export {
  user,
  newUser,
  message
}