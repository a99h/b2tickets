import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  chats: [],
  currentChatIndex: -1
}

const getters = {
  getChats(state) {
    return state.chats
  },
  getCurrentChat(state) {
    return state.chats[state.currentChatIndex]
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
