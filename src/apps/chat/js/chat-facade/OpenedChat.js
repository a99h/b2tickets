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
  addTypingMessage(data) {
    const { user, message, typing } = data
    const filteredMessage = {
      id: this.typingMessageId,
      user: user,
      text: typing ? message : ''
    }

    if (isEmpty(this.typingMessage)) this.addMessage(filteredMessage)
    else {
      this.messages.update(this.typingMessageId, filteredMessage)
    }
  }

  setTyping(data) {
    const { user, typing } = data

    if (typing) this.addTypingMessage(data)
    else {
      if (user.email === this.typingMessage.user.email) this.removeTypingMessage()
    }

    this.participants.some((participant) => {
      if (participant.email === user.email) {
        this.participants[this.participants.indexOf(participant)].typing = typing

        window.dispatchEvent(new Event('channel-page-update-users-drawer'))

        return true
      }

      return false
    })
  }

  removeTypingMessage() {
    if (!isEmpty(this.typingMessage)) {
      this.messages.delete(this.typingMessage.id)
      this.typingMessage = {}
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