import Echo from '@/plugins/echo'

export default {
  sendTyping(channelName, user, typing) {
    Echo.private('App.User.' + channelName)
      .whisper('typing', { user: user, typing: typing })
  },
  whisperMessage(channelName, eventName, data) {
    Echo.private('App.User.' + channelName).whisper(eventName, data)
  }
}