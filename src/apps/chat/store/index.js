import ChatRequestModule from './request'
import ChatModule from './chat'

const chat = {
  modules: {
    chatRequest: ChatRequestModule,
    chat: ChatModule
  }
}

export default chat
