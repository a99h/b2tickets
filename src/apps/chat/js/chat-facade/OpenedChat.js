import isEmpty from '@/js/lib/isEmpty'

import Operator from '@/js/models/Operator'

export default class OpenedChat {
  messages = [];
  participants = [];
  backendErrors = [];
  typingMessageId = Symbol('typing');
  unreadMessagesCount = 0;

  constructor(options) {
    const { channelName, user } = options

    this.channelName = channelName
    this.user = new Operator({ data: user })
    this.addParticipant(this.user)
  }

  set user(value) {
    this._user = value
  }
  get user() {
    return this._user.show()
  }

  addMessage(value) {
    if (value) {
      this.messages.push(value)

      if (!this.isTypingMessage(value)) this.unreadMessagesCount = this.unreadMessagesCount + 1
    }
  }
  addTypingMessage(data) {
    const { user, message, typing } = data
    const filteredMessage = {
      id: this.typingMessageId,
      user: user,
      text: typing ? message : ''
    }

    const typingMessages = this.typingMessages()

    if (isEmpty(typingMessages)) this.addMessage(filteredMessage)
    else {
      typingMessages.forEach((index) => this.updateMessage(index, filteredMessage))
    }
  }
  updateMessage(messageIndex, value) {
    this.messages[messageIndex] = value
  }
  removeMessage(messageIndex) {
    if (messageIndex > -1) this.messages.splice(messageIndex, 1)
  }

  set participants(value) {
    if (value) {
      this._participants = value
    }
  }
  get participants() {
    return this._participants
  }
  addParticipant(value) {
    this.participants.push(value)
  }

  setTyping(data) {
    const { user, typing } = data

    typing ? this.addTypingMessage(data) : this.removeTypingMessage(data)

    this.participants.some((participant) => {
      if (participant.email === user.email) {
        this.participants[this.participants.indexOf(participant)].typing = typing

        window.dispatchEvent(new Event('channel-page-update-users-drawer'))

        return true
      }

      return false
    })
  }

  typingMessages() {
    const { typingMessageId } = this
    const typingMessages = []

    this.messages.some((msg) => {
      if (msg.id === typingMessageId) {
        typingMessages.push(this.messages.indexOf(msg))

        return true
      } else return false
    })

    return typingMessages
  }

  removeTypingMessage(data) {
    const typingMessages = this.typingMessages()

    if (!isEmpty(typingMessages)) typingMessages.forEach((index) => {
      if (this.messages[index].user.email === data.user.email) this.removeMessage(index)
    })
  }

  toggleActive() {
    Object.values(this.participants).length > 1 ? this.setActive(1) : this.setActive(0)
  }

  isTypingMessage(message) {
    return typeof message.id === 'symbol'
  }

  setActive(value) {}

  sendMessage(message) {}
}