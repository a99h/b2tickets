import OpenedChat from '@/apps/chat/js/chat-facade/OpenedChat'

const expected = {
  messages: [],
  participants: [{
    created_at: '2021-02-30T07:54:24.000000Z',
    email: 'v@test.com',
    id: '4',
    name: 'Rick',
    updated_at: '2021-02-30T07:54:24.000000Z',
    userRoles: [Array],
    userSettings: [Object]
  }],
  backendErrors: [],
  typingMessageId: Symbol('typing'),
  unreadMessagesCount: 0,
  user: {
    created_at: '2021-02-30T07:54:24.000000Z',
    email: 'v@test.com',
    id: '4',
    name: 'Rick',
    updated_at: '2021-02-30T07:54:24.000000Z',
    userRoles: [{
      hasPermissions: [{
        name: 'show users',
        guard_name: 'api',
        created_at: '2021-04-05T08:01:48.000000Z'
      }],
      id: 2,
      name: 'operator'
    }],
    userSettings: {
      avatar: '/images/avatars/avat.svg',
      content_layout: 0,
      created_at: '2021-02-30T07:54:24.000000Z',
      global_theme: 0,
      id: 2,
      menu_theme: 2,
      primary_color: '#558c14',
      time_format: null,
      toolbar_style: 1,
      toolbar_theme: 2,
      updated_at: '2021-03-30T07:54:24.000000Z'
    }
  },
  channelName: '7147de3a-c588-4f10-9dd5-41dab3b417asd5'
}

describe('Chat', () => {
  let _ = new OpenedChat(expected)

  test('instance', () => {
    const _inst = new OpenedChat(expected.channelName, expected.user)
    expect(_inst).toBeInstanceOf(OpenedChat)
  })

  test('structure', () => {
    console.log('_', _)
    expect(_).toEqual(expect.objectContaining({
      addMessage: expect.any(Function),
      addTypingMessage: expect.any(Function),
      updateMessage: expect.any(Function),
      removeMessage: expect.any(Function),
      addParticipant: expect.any(Function),
      setTyping: expect.any(Function),
      typingMessages: expect.any(Function),
      removeTypingMessage: expect.any(Function),
      toggleActive: expect.any(Function),
      isTypingMessage: expect.any(Function),
      setActive: expect.any(Function),
      sendMessage: expect.any(Function)
    }))
  })

  test('optins structure', () => {
    expect(_).toEqual(expect.objectContaining({
      messages: expect.any(Array),
      participants: expect.any(Array),
      backendErrors: expect.any(Array),
      // typingMessageId: expect.any(Symbol(typing)),
      unreadMessagesCount: expect.any(Number)
    }))
  })

  test.skip('constructor structure', () => {
    const _ops = new OpenedChat(expected)
    expect(_ops).toEqual(expect.objectContaining({
      user: expect.any(Array),
      channelName: expect.any(String),
      // participants: expect.any(Array)
    }))
  })

  test('user optinons', () => {
    expect(_.user).toEqual(expected.user)
  })

  test('channelName', () => {
    expect(_.channelName).toBe(expected.channelName)
  })
})
