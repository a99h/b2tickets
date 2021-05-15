import isEmpty from '@/js/lib/isEmpty'

export default {
  addTypingMessage(openedChat, data) {
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
  setTyping(openedChat, data) {
    const { user, typing } = data

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
  removeTypingMessage(openedChat) {
    if (!isEmpty(openedChat.typingMessage)) {
      openedChat.messages.delete(openedChat.typingMessage.id)
      openedChat.typingMessage = {}
    }
  }
}