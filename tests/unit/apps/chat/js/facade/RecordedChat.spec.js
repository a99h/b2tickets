import { user, chatRequest, message } from '../../testCase'
import isEmpty from '@/js/lib/isEmpty'

// Facades
import AbstractChatFacade from '@/apps/chat/js/facade/AbstractChatFacade'
import RecordedChat from '@/apps/chat/js/facade/RecordedChat'

// Models
import MessageCollection from '@/apps/chat/js/models/MessageCollection'
import ChatRequest from '@/apps/chat/js/models/ChatRequest'
import Chat from '@/apps/chat/js/models/Chat'
import Client from '@/js/models/Client'
import * as httpMessage from '@/apps/chat/js/http/message'
import * as httpChat from '@/apps/chat/js/http/chat'

function createModel(data) {
  if (isEmpty(data)) {
    data = {
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    }
  }

  return new RecordedChat(data)
}

describe('Class RecordedChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(RecordedChat)
  })
  test('extends AbstractChatFacade class', () => {
    expect(createModel()).toBeInstanceOf(AbstractChatFacade)
  })
  test('throws error if no chatRequest', () => {
    expect(() => {
      new RecordedChat({
        channelName: 'general',
        user: user
      })
    }).toThrow('chatRequest must be defined!')
  })
})

describe('fields', () => {
  test('RecordedChat structure', () => {
    expect(createModel()).toEqual(expect.objectContaining({
      chatRequest: expect.any(ChatRequest),
      chat: expect.any(Chat),
      client: expect.any(Client),
      messages: expect.any(MessageCollection)
    }))
  })
})

describe('sendMessage', () => {
  test('calls storeMessage', () => {
    const recordedOpenedChat = createModel()
    const spy = jest.spyOn(httpMessage, 'storeMessage')

    recordedOpenedChat.sendMessage(message.text)

    expect(spy).lastCalledWith({
      user: user,
      message: message.text,
      chat_request_id: chatRequest.id
    })

    spy.mockRestore()
  })
})

describe('setActive', () => {
  test('calls updateChat', () => {
    const recordedOpenedChat = createModel()
    const spy = jest.spyOn(httpChat, 'updateChat')

    recordedOpenedChat.setActive(0)

    expect(spy).lastCalledWith({
      id: chatRequest.chat.id,
      active: 0
    })

    spy.mockRestore()
  })
})
