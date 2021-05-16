import typingMessageService from '@/apps/chat/js/services/typingMessageService'
import RecordedChat from '@/apps/chat/js/facade/RecordedChat'
import { user, chatRequest, message } from '../../testCase'
import MessageCollection from "@/apps/chat/js/models/MessageCollection";

const typingTrueData = {
  typing: true,
  message: message.text,
  user: message.user
}
const typingFalseData = {
  typing: false,
  user: message.user
}

describe('setTyping method', () => {
  test('throws error if typing is undefined', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    expect(() => {
      typingMessageService.setTyping(recordedOpenedChat, {})
    }).toThrow('typing property must be defined in data!')
  })
  test('throws error if user is undefined', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    expect(() => {
      typingMessageService.setTyping(recordedOpenedChat, {
        typing: true
      })
    }).toThrow('user property must be defined in data!')
  })
  test('calls addTypingMessage if typing arg is true', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const spy = jest.spyOn(typingMessageService, 'addTypingMessage')

    typingMessageService.setTyping(recordedOpenedChat, typingTrueData)

    expect(spy).lastCalledWith(recordedOpenedChat, typingTrueData)

    spy.mockRestore()
  })
  test('calls removeTypingMessage if typing is false', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const spy = jest.spyOn(typingMessageService, 'removeTypingMessage')

    typingMessageService.setTyping(recordedOpenedChat, typingTrueData)
    typingMessageService.setTyping(recordedOpenedChat, typingFalseData)

    expect(spy).lastCalledWith(recordedOpenedChat)

    spy.mockRestore()
  })
  test('don\'t call removeTypingMessage if typingMessage isEmpty', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const removeTypingMessageSpy = jest.spyOn(typingMessageService, 'removeTypingMessage')
    const addTypingMessageSpy = jest.spyOn(typingMessageService, 'addTypingMessage')

    typingMessageService.setTyping(recordedOpenedChat, typingFalseData)

    expect(removeTypingMessageSpy).toBeCalledTimes(0)
    expect(addTypingMessageSpy).toBeCalledTimes(0)

    removeTypingMessageSpy.mockRestore()
    addTypingMessageSpy.mockRestore()
  })
  test('don\'t call removeTypingMessage if user is different', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const differentUserData = {
      typing: false,
      user: {
        id: 99,
        name: 'Clovis Eichmann',
        email: 'different@example.org',
        userSettings: {
          avatar: '/images/avatars/avatar1.svg'
        }
      }
    }
    const removeTypingMessageSpy = jest.spyOn(typingMessageService, 'removeTypingMessage')
    const addTypingMessageSpy = jest.spyOn(typingMessageService, 'addTypingMessage')

    typingMessageService.setTyping(recordedOpenedChat, typingTrueData)
    expect(addTypingMessageSpy).toBeCalledTimes(1)

    typingMessageService.setTyping(recordedOpenedChat, differentUserData)
    expect(removeTypingMessageSpy).toBeCalledTimes(0)
    expect(addTypingMessageSpy).toBeCalledTimes(1)

    removeTypingMessageSpy.mockRestore()
    addTypingMessageSpy.mockRestore()
  })
})
describe('addTypingMessage method', () => {
  test('throws error if openedChat arg is not instance of AbstractChatFacade', () => {
    expect(() => {
      typingMessageService.addTypingMessage('invalid data', {})
    }).toThrow('openedChat must be instance of AbstractChatFacade')
  })
  test('adds typingMessage if it is empty', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    typingMessageService.addTypingMessage(recordedOpenedChat, typingTrueData)

    expect(recordedOpenedChat.typingMessage).toEqual(expect.objectContaining({
      id: expect.anything(),
      user: typingTrueData.user,
      text: typingTrueData.message
    }))
    expect(recordedOpenedChat.messages.all()[recordedOpenedChat.messages.all().length - 1]).toEqual(expect.objectContaining({
      id: expect.anything(),
      user: typingTrueData.user,
      text: typingTrueData.message
    }))
  })
  test('updates typingMessage if it is not empty', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const newMessageData = {
      typing: true,
      message: 'new message',
      user: message.user
    }

    typingMessageService.addTypingMessage(recordedOpenedChat, typingTrueData)
    typingMessageService.addTypingMessage(recordedOpenedChat, newMessageData)

    expect(recordedOpenedChat.typingMessage).toEqual(expect.objectContaining({
      id: expect.anything(),
      user: newMessageData.user,
      text: newMessageData.message
    }))
  })
})
describe('removeTypingMessage method', () => {
  test('removes typingMessage if it is not empty', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    typingMessageService.addTypingMessage(recordedOpenedChat, typingTrueData)
    const typingMessageId = recordedOpenedChat.typingMessage.id

    typingMessageService.removeTypingMessage(recordedOpenedChat)

    expect(recordedOpenedChat.typingMessage).toEqual({})
    expect(recordedOpenedChat.messages.find(typingMessageId)).toBeNull()
  })
})
describe('removeTypingMessage method', () => {
  test('don\' remove typingMessage if it is empty', () => {
    const recordedOpenedChat = new RecordedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const spy = jest.spyOn(MessageCollection.prototype, 'delete')

    typingMessageService.removeTypingMessage(recordedOpenedChat)

    expect(recordedOpenedChat.typingMessage).toEqual({})
    expect(spy).toBeCalledTimes(0)

    spy.mockRestore()
  })
})