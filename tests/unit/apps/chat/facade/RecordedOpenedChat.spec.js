import AbstractOpenedChat from '@/apps/chat/js/facade/AbstractOpenedChat'
import RecordedOpenedChat from '@/apps/chat/js/facade/RecordedOpenedChat'
import { user, chatRequest } from './testCase'
import isEmpty from '@/js/lib/isEmpty'

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
