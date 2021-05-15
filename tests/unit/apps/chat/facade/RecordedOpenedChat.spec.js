import { user, chatRequest } from './testCase'
import isEmpty from '@/js/lib/isEmpty'

// Facades
import AbstractOpenedChat from '@/apps/chat/js/facade/AbstractOpenedChat'
import RecordedOpenedChat from '@/apps/chat/js/facade/RecordedOpenedChat'

// Models
import MessageCollection from '@/apps/chat/js/models/MessageCollection'
import ChatRequest from '@/apps/chat/js/models/ChatRequest'
import Chat from '@/apps/chat/js/models/Chat'
import Client from '@/js/models/Client'

function createModel(data) {
  if (isEmpty(data)) {
    data = {
      channelName: 'general',
      user: user,
      chatRequest: chatRequest
    }
  }

  return new RecordedOpenedChat(data)
}

describe('Class RecordedOpenedChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(RecordedOpenedChat)
  })
  test('extends AbstractOpenedChat class', () => {
    expect(createModel()).toBeInstanceOf(AbstractOpenedChat)
  })
  test('throws error if no chatRequest', () => {
    expect(() => {
      new RecordedOpenedChat({
        channelName: 'general',
        user: user
      })
    }).toThrow('chatRequest must be defined!')
  })
})

describe('fields', () => {
  test('RecordedOpenedChat structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      chatRequest: expect.any(ChatRequest),
      chat: expect.any(Chat),
      client: expect.any(Client),
      messages: expect.any(MessageCollection)
    }))
  })
})
