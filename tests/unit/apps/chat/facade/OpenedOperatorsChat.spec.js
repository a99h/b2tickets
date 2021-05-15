import AbstractOpenedChat from '@/apps/chat/js/facade/AbstractOpenedChat'
import OpenedOperatorsChat from '@/apps/chat/js/facade/OpenedOperatorsChat'
import { user } from './OpenedChatTestCase'
import isEmpty from '@/js/lib/isEmpty'

function createModel(data) {
  if (isEmpty(data)) data = {
    channelName: 'general',
    user: user
  }

  return new OpenedOperatorsChat(data)
}

describe('Class OpenedOperatorsChat', () => {
  test('new works', () => {
    expect(createModel()).toBeInstanceOf(OpenedOperatorsChat)
  })
  test('extends AbstractOpenedChat class', () => {
    expect(createModel()).toBeInstanceOf(AbstractOpenedChat)
  })
})

//
// describe('toggleActive method', () => {
//   test('toggle works', () => {
//     const spy = jest.spyOn(AbstractOpenedChat.prototype, 'setActive')
//     const openedChat = createModel()
//
//     expect(openedChat.participants.length).toBe(1)
//
//     openedChat.toggleActive()
//
//     expect(spy).lastCalledWith(0)
//
//     openedChat.participants.push(newUser)
//
//     expect(openedChat.participants.length).toBe(2)
//
//     openedChat.toggleActive()
//
//     expect(spy).lastCalledWith(1)
//
//     spy.mockRestore()
//   })
// })
