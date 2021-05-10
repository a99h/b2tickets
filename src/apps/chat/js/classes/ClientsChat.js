import Chat from './Chat'
import { showChat, updateChat } from '../http/chat'
import { getMessages, storeMessage } from '../http/message'
import { messageService } from '../services'
import isEmpty from '@/js/lib/isEmpty'
import Client from '@/js/models/Client'

export default class ClientsChat extends Chat {

  #LAST_MESSAGE_READ = 'last-message-read'

  constructor(options) {
    const { channelName, chatRequest, user } = options

    super({ channelName, user })

    this.chatRequest = chatRequest
    this.channelName = chatRequest.show().channel_name
    this.chat = chatRequest.show().chat
    this._client = new Client({ data: chatRequest.show().chat.chatClient })
    getMessages(chatRequest.show().id).then((res) => {
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
        this._chatRequest = value
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

  watchReadAt() {
    messageService.listenLastMessageRead(this.channelName, this.#LAST_MESSAGE_READ, (e) => {
      this.messages.map((message) => {
        if (message.read_at === null) message.read_at = e.read_at
      })
    })
  }
}