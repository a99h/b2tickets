import Chat from './Chat'
import { showChat, updateChat } from '../http/chat'

export default class ClientsChat extends Chat {

  constructor(options) {
    const { channelName, chatRequest, user } = options

    super({ channelName, user })

    this.chatRequest = chatRequest
    this.chat = chatRequest.chat
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

  setActive(value) {
    showChat(this.chat.id).then((res) => {
      if (res.data.active !== value)
        updateChat({
          ...this.chat,
          active: value
        }).then((resp) => {
          this.chat.active = resp.data.active
        }).catch((e) => {
          console.log(e)
        })
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