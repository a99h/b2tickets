import AbstractChatFacade from '@/apps/chat/js/facade/AbstractChatFacade'
import OperatorsChat from '@/apps/chat/js/facade/OperatorsChat'
import { user, message } from '../../testCase'
import isEmpty from '@/js/lib/isEmpty'
import messageService from '@/apps/chat/js/services/echoMessageService'

function createModel(data) {
  if (isEmpty(data)) data = {
    channelName: 'general',
    user: user
  }

  return new OperatorsChat(data)
}

describe('Class OperatorsChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(OperatorsChat)
  })
  test('extends AbstractChatFacade class', () => {
    expect(createModel()).toBeInstanceOf(AbstractChatFacade)
  })
})

describe('sendMessage method', () => {
  test('called with prepareMessageData', () => {
    const operatorsChat = createModel()
    const spy = jest.spyOn(OperatorsChat.prototype, 'prepareMessageData')

    operatorsChat.sendMessage(message.text)

    expect(spy).lastCalledWith(message.text)
    expect(spy).lastReturnedWith(spy.mock.results[0].value)

    spy.mockRestore()
  })

  test('called with messageService.whisperMessage', () => {
    const operatorsChat = createModel()
    const spyWhisperMessage = jest.spyOn(messageService, 'whisperMessage')
    const spyPrepareMessageData = jest.spyOn(OperatorsChat.prototype, 'prepareMessageData')
    const eventName = 'operators-message'

    operatorsChat.sendMessage(message.text)
    expect(spyWhisperMessage).lastCalledWith(
      operatorsChat.channelName,
      eventName,
      spyPrepareMessageData.mock.results[0].value
    )

    spyWhisperMessage.mockRestore()
    spyPrepareMessageData.mockRestore()
  })

  test('message is recorded', () => {
    const operatorsChat = createModel()
    const spy = jest.spyOn(OperatorsChat.prototype, 'prepareMessageData')

    operatorsChat.sendMessage(message.text)
    const preparedMessageData = spy.mock.results[0].value.message

    expect(operatorsChat.messages.find(preparedMessageData.id)).toEqual(preparedMessageData)

    spy.mockRestore()
  })
})

describe('prepareMessageData method', () => {
  const operatorsChat = createModel()

  test('returns what expected', () => {
    expect(operatorsChat.prepareMessageData(message.text)).toEqual(expect.objectContaining({
      message: {
        id: expect.any(Number),
        text: message.text,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userSettings: {
            avatar: user.userSettings.avatar
          }
        },
        timestamp: expect.any(Number)
      }
    }))
  })
})
