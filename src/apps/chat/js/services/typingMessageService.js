import AbstractChatFacade from '@/apps/chat/js/facade/AbstractChatFacade'

export default {
  addTypingMessage(openedChat, filteredMessage) {
    if (!(openedChat instanceof AbstractChatFacade)) throw new Error('openedChat must be instance of AbstractChatFacade')

    openedChat.typingMessage = filteredMessage
    openedChat.addMessage(openedChat.typingMessage)
  },

  updateTypingMessage(openedChat, filteredMessage) {
    openedChat.messages.update(openedChat.typingMessage.id, filteredMessage)
  },

  removeTypingMessage(openedChat) {
    openedChat.deleteMessage(openedChat.typingMessage.id)
    openedChat.typingMessage = {}
  }
}
