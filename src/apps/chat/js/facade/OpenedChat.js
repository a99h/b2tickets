import Operator from '@/js/models/Operator'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'

export default class OpenedChat {
  messages = {};
  participants = [];
  backendErrors = [];
  unreadMessagesCount = 0;

  constructor(data = {}) {
    const { channelName, user } = data

    if (user === undefined) throw new Error('User must be defined')
    if (channelName === undefined) throw new Error('Channel name must be defined')

    this.channelName = channelName
    this.user = new Operator({ data: user })
    this.participants.push(this.user)
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

      if ((value.user !== this.user) && (typeof value.id === 'number')) this.unreadMessagesCount = this.unreadMessagesCount + 1
    }
  }

  toggleActive() {
    Object.values(this.participants).length > 1 ? this.setActive(1) : this.setActive(0)
  }

  setActive(value) {}

  sendMessage(message) {}
}