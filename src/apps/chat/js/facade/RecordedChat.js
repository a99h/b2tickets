import AbstractChatFacade from './AbstractChatFacade'
import { showChat, updateChat } from '../http/chat'
import { getMessages, storeMessage } from '../http/message'
import { messageService } from '../services'

// Models
import Client from '@/js/models/Client'
import Chat from '@/apps/chat/js/models/Chat'
import ChatRequest from '@/apps/chat/js/models/ChatRequest'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'

export default class RecordedChat extends AbstractChatFacade {

  #LAST_MESSAGE_READ = 'last-message-read'
  typingMessage = {};

  constructor(options) {
    const { channelName, chatRequest, user } = options

    if (!chatRequest) throw new Error('chatRequest must be defined!')

    super({ channelName, user })

    this.chatRequest = new ChatRequest({ data: chatRequest })
    this.chat = new Chat({ data: this.chatRequest.show().chat })
    this.client = new Client({ data: this.chat.show().chatClient })

    getMessages(this.chatRequest.show().id).then((res) => {
      this.messages = new MessageCollection({ data: res.data })
    }).catch((e) => {
      this.backendErrors.push(e)
    })
  }

  sendMessage(message) {
    storeMessage({
      user: this.user,
      message: message,
      chat_request_id: this.chatRequest.show().id
    }).catch((e) => {
      this.backendErrors.push(e)
    })
  }

  setActive(value) {
    updateChat({
      id: this.chat.show().id,
      active: value
    }).then((resp) => {
      this.chat.update(resp.data)
    }).catch((e) => {
      this.backendErrors.push(e)
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