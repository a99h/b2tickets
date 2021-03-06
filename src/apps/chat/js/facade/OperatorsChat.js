import AbstractChatFacade from './AbstractChatFacade'
import { messageService } from '../services'

export default class OperatorsChat extends AbstractChatFacade {
  #eventName = 'operators-message'

  constructor(options) {
    const { channelName, user } = options

    super({ channelName, user })
  }

  sendMessage(message) {
    const data = this.prepareMessageData(message)

    messageService.whisperMessage(this.channelName, this.#eventName, data)

    this.messages.record([data.message])
  }

  prepareMessageData(message) {
    const createdAt = (new Date()).getTime()

    return {
      message: {
        id: parseInt(this.user.id.toString() + createdAt),
        text: message,
        user: {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email,
          userSettings: {
            avatar: this.user.userSettings.avatar
          }
        },
        timestamp: (new Date()).getTime()
      }
    }
  }
}