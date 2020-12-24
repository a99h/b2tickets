import ChatRequestModule from './request'
import ChatModule from './chat'
import MessageModule from './message'

const chat = {
  modules: {
    chatRequest: ChatRequestModule,
    chat: ChatModule,
    message: MessageModule
  }
}

export default chat
