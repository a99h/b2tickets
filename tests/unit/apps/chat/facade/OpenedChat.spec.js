import AbstractOpenedChat from '@/apps/chat/js/facade/AbstractOpenedChat'
import isEmpty from '@/js/lib/isEmpty'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'
import Operator from '@/js/models/Operator'
import Client from '@/js/models/Client'
import { user, newUser, message } from './OpenedChatTestCase'

class OpenedChat extends AbstractOpenedChat{}

function createModel(data) {
  if (isEmpty(data)) data = {
    channelName: 'general',
    user: user
  }

  return new OpenedChat(data)
}

describe('Abstract class', () => {
  test('throws error if created', () => {
    expect(() => {
      new AbstractOpenedChat({
        channelName: 'general',
        user: user
      })
    }).toThrow('Abstract classes can\'t be instantiated')
  })
})

describe('Class OpenedChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(AbstractOpenedChat)
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

describe('getters and setters', () => {
  const openedChat = createModel()
  const newClient = {
    id: Date.now(),
    name: 'Ethyl Sanford',
    email: 'tfahey@example.org',
    created_at: '2021-05-03T05:45:57.000000Z',
    updated_at: '2021-05-03T05:45:57.000000Z',
    userRoles: [{
      id: 1,
      hasPermissions: [],
      name: 'Client'
    }]
  }

  test('Set Operator instance and expect user object in getter', () => {
    openedChat.user = new Operator({ data: newUser })

    expect(openedChat.user).toEqual(expect.objectContaining(newUser))
  })
  test('Set other instance and expect error', () => {
    expect(() => {
      openedChat.user = new Client({ data: newClient })
    }).toThrow('User must be instance of Operator')

    expect(openedChat.user).toEqual(expect.objectContaining(newUser))
  })
})

describe('addMessage method', () => {
  test('Can add message to collection', () => {
    const openedChat = createModel()

    openedChat.addMessage(message)

    expect(openedChat.messages.all()[0]).toEqual(expect.objectContaining(message))
  })
  test('Counts unread messages', () => {
    const openedChat = createModel()

    openedChat.addMessage(message)

    expect(openedChat.unreadMessagesCount).toBe(1)
  })
})

describe('toggleActive method', () => {
  test('toggle works', () => {
    const spy = jest.spyOn(AbstractOpenedChat.prototype, 'setActive')
    const openedChat = createModel()

    expect(openedChat.participants.length).toBe(1)

    openedChat.toggleActive()

    expect(spy).lastCalledWith(0)

    openedChat.participants.push(newUser)

    expect(openedChat.participants.length).toBe(2)

    openedChat.toggleActive()

    expect(spy).lastCalledWith(1)

    spy.mockRestore()
  })
})

describe('setActive method', () => {
  test('setting active field to chat model works', () => {
    const openedChat = createModel()

    expect(openedChat.chat.show().active).toBe(0)

    openedChat.setActive(1)

    expect(openedChat.chat.show().active).toBe(1)
  })
})

describe('sendMessage method', () => {
  test('throw error if undefined', () => {
    const openedChat = createModel()

    expect(() => {
      openedChat.sendMessage(message)
    }).toThrow('You must define sendMessage method!')
  })
})
