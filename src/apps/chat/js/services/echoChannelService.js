import isEmpty from '@/js/lib/isEmpty'
import Echo from '@/plugins/echo'
import AbstractChatFacade from '@/apps/chat/js/facade/AbstractChatFacade'
import typingMessageService from '@/apps/chat/js/services/typingMessageService'

export default {
  watchParticipants(chat) { // отслеживание участников чата по WS
    Echo.join('App.User.' + chat.channelName)
      .here((users) => {
        chat.participants = users

        chat.toggleActive()
      })
      .joining((user) => {
        if (!(chat.participants.some((us) => us.email === user.email))) chat.participants.push(user)

        chat.toggleActive()
      })
      .leaving((user) => {
        // eslint-disable-next-line array-callback-return
        chat.participants.some((us) => {
          if (us.email === user.email) {
            chat.participants.splice(chat.participants.indexOf(us), 1)

            chat.toggleActive()
          }
        })
      })
  },

  unwatchParticipants(chat) { // выход из чата
    Echo.leave('App.User.' + chat.channelName)
  },

  subscribeChannel(chat) { // подписка на канал
    if (!(chat instanceof AbstractChatFacade)) return

    function updateTyping(isTyping, user) {
      const authorIndex = chat.participants.findIndex((p) => p.id === user.id)

      chat.participants[authorIndex].typing = isTyping
      chat.participants = [...chat.participants]
    }

    Echo.private('App.User.' + chat.channelName)
      .listen('MessageSent', (event) => {
        const message = { ...event.message }

        // if (chat.user.id === event.message.user.id) {
        //   message.read_at = null
        // }

        chat.addMessage(message)
      })

      .listenForWhisper('operators-message', (event) => {
        chat.addMessage(event.message)
      })

      .listenForWhisper('operators-typing', (data) => {
        updateTyping(true, data.user)
        setTimeout(() => updateTyping(false, data.user), 1000)
      })

      .listenForWhisper('typing', (data) => {
        const { user, message } = data

        updateTyping(true, data.user)
        setTimeout(() => updateTyping(false, data.user), 1000)

        const filteredMessage = {
          id: Symbol('typing'),
          user: user,
          text: message,
          timestamp: isEmpty(chat.typingMessage) ? Date.now() : chat.typingMessage.timestamp
        }

        if (isEmpty(chat.typingMessage)) typingMessageService.addTypingMessage(chat, filteredMessage)
        else if (message === null) typingMessageService.removeTypingMessage(chat)
        else typingMessageService.updateTypingMessage(chat, filteredMessage)
      })
  },

  unsubscribeChannel(chat) { // выход из чата
    if (!(chat instanceof AbstractChatFacade)) return

    this.unwatchParticipants(chat)
  }
}
