import Echo from '@/plugins/echo'
import AbstractOpenedChat from '@/apps/chat/js/facade/AbstractOpenedChat'
import typingMessageService from '@/apps/chat/js/services/typingMessageService'

export default {
  watchParticipants(chat) {
    Echo.join('App.User.' + chat.channelName)
      .here((users) => {
        chat.participants = users

        chat.toggleActive()
      })
      .joining((user) => {
        if (!(chat.participants.some((us) => us.email === user.email))) chat.addParticipant.push(user)

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
  unwatchParticipants(chat) {
    Echo.leave('App.User.' + chat.channelName)
  },
  subscribeChannel(chat) {
    if (!(chat instanceof AbstractOpenedChat)) return

    Echo.private('App.User.' + chat.channelName)
      .listen('MessageSent', (event) => {
        const message = { ...event.message }

        // if (chat.user.id === event.message.user.id) {
        //   message.read_at = null
        // }

        chat.addMessage(message)

        typingMessageService.setTyping(chat, {
          user: event.message.user,
          message: event.message,
          typing: false
        })
      })

      .listenForWhisper('operators-message', (event) => {
        chat.addMessage(event.message)
        typingMessageService.setTyping(chat,{
          user: event.message.user,
          typing: false
        })
      })
      
      .listenForWhisper('typing', (data) => {
        const { typing } = data

        if (typing === undefined) data.typing = true

        typingMessageService.setTyping(chat, data)
      })
  },
  unsubscribeChannel(chat) {
    if (!(chat instanceof AbstractOpenedChat)) return

    this.unwatchParticipants(chat)
  }
}