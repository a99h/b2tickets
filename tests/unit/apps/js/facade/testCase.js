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
const chatRequest = {
  id: 7,
  message: null,
  channel_name: 'e44eaf57-41f2-4a78-8013-9a43183cd00a22',
  operators_online: 1,
  user: {
    id: 22,
    name: 'cl1ex',
    email: 'cle@ex.com',
    created_at: '2021-05-15T13:28:06.000000Z',
    updated_at: '2021-05-15T13:28:06.000000Z',
    userRoles: [],
    userSettings: null
  },
  chat: {
    id: 6,
    chat_request_id: 7,
    active: 1,
    chatClient: {
      id: 22,
      name: 'cl1ex',
      email: 'cle@ex.com',
      app_user_id: null,
      created_at: '2021-05-15T13:28:06.000000Z',
      updated_at: '2021-05-15T13:28:06.000000Z'
    },
    created_at: '2021-05-15T13:28:07.000000Z',
    updated_at: '2021-05-15T13:32:38.000000Z'
  }
}

export {
  user,
  newUser,
  message,
  chatRequest
}