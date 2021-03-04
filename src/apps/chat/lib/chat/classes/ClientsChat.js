import Chat from './Chat'

export default class ClientsChat extends Chat {
  constructor(options) {
    const { channelName, chatRequest, user } = options

    super({ channelName, user })

    this.chatRequest = chatRequest
  }

  set chat(value) {
    if (value) {
      this._chat = value
    }
  }
  get chat() {
    return this._chat
  }

  set chatRequest(value) {
    if (value) {
      if (isEmpty(value)) {
        this._chatRequest = undefined
      } else {
        const { id, channel_name, created_at, updated_at, chat, user, message, operators_online } = value

        this._chatRequest = {
          id: id,
          channel_name: channel_name,
          message: message,
          operators_online: operators_online,
          created_at: created_at,
          updated_at: updated_at
        }
        this.chat = chat
        this.channelName = channel_name
        this._client = user
      }
    }
  }
  get chatRequest() {
    return this._chatRequest
  }

  get client() {
    return this._client
  }

  sendMessage(message) {
    this.storeMessage({
      user: this.user,
      message: message,
      chat_request_id: this.chatRequest.id
    })
  }
}

function isEmpty(value) {
  for (const prop in value) {
    // eslint-disable-next-line no-prototype-builtins
    if (value.hasOwnProperty(prop)) {
      return false
    }
  }
  if ((value instanceof Map) || (value instanceof Set)) {
    if (value.size > 0) return false
  }

  return true
}

const chat2 = {
  chat: {},
  messages: [],
  users: [],
  chatRequest: {},
  joinEcho(channelName) {
    Echo.private('App.User.' + channelName)
      .listen('MessageSent', (event) => {
        this.messages.push(event.message)
        this.scrollToBottom()

        this.$emit('setTyping', {
          channelName: this.chatRequest.channel_name,
          user: event.message.user,
          typing: false
        })
      })
      .listenForWhisper('typing', (data) => {
        const typingData = {
          channelName: this.chatRequest.channel_name,
          user: data.user,
          typing: true
        }

        this.$emit('setTyping', typingData)
      })
  }
}