import Echo from '@/plugins/echo'
import Chat from '../classes/Chat'

export default {
  unsubscribeChannel(chat) {
    if (!(chat instanceof Chat)) return

    this.unwatchParticipants(chat)
  },
  watchParticipants(chat) {
    Echo.join('App.User.' + chat.channelName)
      .here((users) => {
        chat.participants = users

        chat.toggleActive()
      })
      .joining((user) => {
        if (!(chat.participants.some((us) => us.email === user.email))) chat.addParticipant(user)

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
    if (!(chat instanceof Chat)) return

    Echo.private('App.User.' + chat.channelName)
      .listen('MessageSent', (event) => {

        const message = { ...event.message }

        if (chat.user.id === event.message.user.id) {
          message.read_at = null
        }

        chat.addMessage(message)

        chat.setTyping({
          user: event.message.user,
          message: event.message,
          typing: false
        })
      })

      .listenForWhisper('operators-message', (event) => {
        chat.addMessage(event.message)
        chat.setTyping({
          user: event.message.user,
          typing: false
        })
      })
      
      .listenForWhisper('typing', (data) => {
        const { typing } = data

        if (typing === undefined) data.typing = true

        chat.setTyping(data)
      })
  }
}