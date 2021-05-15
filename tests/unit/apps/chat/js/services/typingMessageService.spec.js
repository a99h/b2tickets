import typingMessageService from '@/apps/chat/js/services/typingMessageService'
import RecordedOpenedChat from '@/apps/chat/js/facade/RecordedOpenedChat'
import { user, chatRequest, message } from '../../testCase'

const typingTrueData = {
  typing: true,
  message: message.text,
  user: message.user
}
const typingFalseData = {
  typing: false,
  user: message.user
}

describe('setTyping', () => {
  test('throws error if typing is undefined', () => {
    const recordedOpenedChat = new RecordedOpenedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    expect(() => {
      typingMessageService.setTyping(recordedOpenedChat, {})
    }).toThrow('typing property must be defined in data!')
  })
  test('throws error if user is undefined', () => {
    const recordedOpenedChat = new RecordedOpenedChat({
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
    const recordedOpenedChat = new RecordedOpenedChat({
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
    const recordedOpenedChat = new RecordedOpenedChat({
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
    const recordedOpenedChat = new RecordedOpenedChat({
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
    const recordedOpenedChat = new RecordedOpenedChat({
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
describe('addTypingMessage', () => {
  test('throws error if openedChat arg is not instance of AbstractOpenedChat', () => {
    expect(() => {
      typingMessageService.addTypingMessage('invalid data', {})
    }).toThrow('openedChat must be instance of AbstractOpenedChat')
  })
  test('adds typingMessage if it is empty', () => {
    const recordedOpenedChat = new RecordedOpenedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })

    typingMessageService.setTyping(recordedOpenedChat, typingTrueData)

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
    const recordedOpenedChat = new RecordedOpenedChat({
      channelName: 'some-secret-string',
      user: user,
      chatRequest: chatRequest
    })
    const newMessageData = {
      typing: true,
      message: 'new message',
      user: message.user
    }

    typingMessageService.setTyping(recordedOpenedChat, typingTrueData)
    typingMessageService.setTyping(recordedOpenedChat, newMessageData)

    expect(recordedOpenedChat.typingMessage).toEqual(expect.objectContaining({
      id: expect.anything(),
      user: newMessageData.user,
      text: newMessageData.message
    }))
  })
})