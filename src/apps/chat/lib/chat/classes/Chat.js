import Echo from '@/plugins/echo'
import { channelService, messageService } from '../services'

export default class Chat {
  messages = [];
  participants = [];

  constructor(options) {
    const { channelName, user } = options

    this.channelName = channelName
    this.user = user
    this.participants.push(user)

    // this.subscribeChannel(channelName)
  }

  set user(value) {
    this._user = value
  }
  get user() {
    return this._user
  }

  set channelName(value) {
    this._channelName = value
  }
  get channelName() {
    return this._channelName
  }

  set messages(value) {
    if (value) {
      this._messages = value
    }
  }
  get messages() {
    return this._messages
  }
  addMessage(value) {
    if (value) {
      this.messages.push(value)
    }
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

  watchParticipants() {
    channelService.watchParticipants(this)
  }

  unwatchParticipants() {
    channelService.unwatchParticipants(this)
  }

  subscribeChannel() {
    channelService.subscribeChannel(this)
  }

  unsubscribeChannel() {
    channelService.unsubscribeChannel(this)
  }

  setTyping(data) {
    const { user, message, typing } = data

    // console.log(message)

    this.participants.some((participant) => {
      if (participant.email === user.email) {
        this.participants[this.participants.indexOf(participant)].typing = typing
        window.dispatchEvent(new Event('channel-page-update-users-drawer'))

        return true
      }

      return false
    })
  }

  sendTyping(typing) {
    messageService.sendTyping(this.channelName, this.user, typing)
  }
}