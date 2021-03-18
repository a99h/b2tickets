import Chat from './Chat'
import { showChat, updateChat } from '../http/chat'
import { getMessages, storeMessage } from '../http/message'
import isEmpty from '@/lib/isEmpty'

export default class ClientsChat extends Chat {

  constructor(options) {
    const { channelName, chatRequest, user } = options

    super({ channelName, user })

    this.chatRequest = chatRequest
    this.chat = chatRequest.chat
    getMessages(chatRequest.id).then((res) => {
      this.messages = res.data
    }).catch((e) => {
      this.backendErrors.push(e)
    })
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
    storeMessage({
      user: this.user,
      message: message,
      chat_request_id: this.chatRequest.id
    }).catch((e) => {
      this.backendErrors.push(e)
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
          this.backendErrors.push(e)
        })
    })
  }
}