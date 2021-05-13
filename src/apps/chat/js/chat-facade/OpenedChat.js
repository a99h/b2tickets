import isEmpty from '@/js/lib/isEmpty'

import Operator from '@/js/models/Operator'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'

export default class OpenedChat {
  messages = {};
  participants = [];
  backendErrors = [];
  typingMessageId = Symbol('typing');
  unreadMessagesCount = 0;
  typingMessage = {};

  constructor(options) {
    const { channelName, user } = options

    this.channelName = channelName
    this.user = new Operator({ data: user })
    this.participants.push(this.user)
    this.typingMessage = {}
    this.messages = new MessageCollection({ data: [] })
  }

  set user(value) {
    this._user = value
  }
  get user() {
    return this._user.show()
  }

  addMessage(value) {
    if (value) {
      this.messages.record([value])

      if (!this.isTypingMessage(value.id)) this.unreadMessagesCount = this.unreadMessagesCount + 1
      else this.typingMessage = value
    }
  }

  toggleActive() {
    Object.values(this.participants).length > 1 ? this.setActive(1) : this.setActive(0)
  }

  isTypingMessage(id) {
    return typeof id === 'symbol'
  }

  setActive(value) {}

  sendMessage(message) {}
}