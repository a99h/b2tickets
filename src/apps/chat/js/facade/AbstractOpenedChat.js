import Operator from '@/js/models/Operator'
import MessageCollection from '@/apps/chat/js/models/MessageCollection'
import Chat from '@/apps/chat/js/models/Chat'

export default class AbstractOpenedChat {
  messages = {};
  participants = [];
  backendErrors = [];
  unreadMessagesCount = 0;

  constructor(data = {}) {
    if (this.constructor === AbstractOpenedChat) {
      throw new Error('Abstract classes can\'t be instantiated.')
    }

    const { channelName, user } = data

    if (user === undefined) throw new Error('User must be defined')
    if (channelName === undefined) throw new Error('Channel name must be defined')

    this.channelName = channelName
    this.user = new Operator({ data: user })
    this.participants.push(this.user)
    this.messages = new MessageCollection({ data: [] })
    this.chat = new Chat({ data: {
      active: 0
    } })
  }

  set user(value) {
    if (!(value instanceof Operator)) throw new Error('User must be instance of Operator')
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

  setActive(value) {
    this.chat.update({ active: value })
  }

  sendMessage(message) {
    throw new Error('You must define sendMessage method!')
  }
}