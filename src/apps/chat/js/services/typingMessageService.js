import isEmpty from '@/js/lib/isEmpty'
import AbstractChatFacade from '@/apps/chat/js/facade/AbstractChatFacade'

export default {
  setTyping(openedChat, data) {
    const { user, typing } = data

    if (typing === undefined) throw new Error('typing property must be defined in data!')
    if (isEmpty(user)) throw new Error('user property must be defined in data!')

    if (typing) this.addTypingMessage(openedChat, data)
    else {
      if (!isEmpty(openedChat.typingMessage)) {
        if (openedChat.typingMessage.user.email === user.email) this.removeTypingMessage(openedChat)
      }
    }

    openedChat.participants.some((participant) => {
      if (participant.email === user.email) {
        openedChat.participants[openedChat.participants.indexOf(participant)].typing = typing

        window.dispatchEvent(new Event('channel-page-update-users-drawer'))

        return true
      }

      return false
    })
  },
  addTypingMessage(openedChat, data) {
    if (!(openedChat instanceof AbstractChatFacade)) throw new Error('openedChat must be instance of AbstractChatFacade')

    const typingMessageKey = Symbol('typing')
    const { user, message, typing } = data

    const filteredMessage = {
      id: typingMessageKey,
      user: user,
      text: typing ? message : ''
    }

    if (isEmpty(openedChat.typingMessage)) {
      openedChat.typingMessage = filteredMessage
      openedChat.addMessage(openedChat.typingMessage)
    }
    else {
      openedChat.messages.update(openedChat.typingMessage.id, filteredMessage)
    }
  },
  removeTypingMessage(openedChat) {
    if (!isEmpty(openedChat.typingMessage)) {
      openedChat.messages.delete(openedChat.typingMessage.id)
      openedChat.typingMessage = {}
    }
  }
}