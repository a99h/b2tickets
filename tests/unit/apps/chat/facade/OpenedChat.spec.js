import OpenedChat from '@/apps/chat/js/facade/OpenedChat'
import isEmpty from '@/js/lib/isEmpty'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'

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
  }]
}

function createModel(data) {
  if (isEmpty(data)) data = {
    channelName: 'general',
    user: user
  }

  return new OpenedChat(data)
}

describe('Class OpenedChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(OpenedChat)
  })

  test('Throws error if no user', () => {
    expect(() => {
      new OpenedChat({ channelName: 'general' })
    }).toThrow('User must be defined')
  })

  test('Throws error if no channelName', () => {
    expect(() => {
      new OpenedChat({ user: user })
    }).toThrow('Channel name must be defined')
  })
})

describe('fields', () => {
  test('OpenedChat structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      channelName: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        email_verified_at: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        userRoles: expect.arrayContaining([expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          hasPermissions: expect.arrayContaining([expect.objectContaining({
            name: expect.any(String),
            guard_name: expect.any(String),
            created_at: expect.any(String)
          })])
        })])
      }),
      messages: expect.any(MessageCollection),
      participants: expect.arrayContaining([user]),
      backendErrors: expect.any(Array),
      unreadMessagesCount: 0
    }))
  })
})
