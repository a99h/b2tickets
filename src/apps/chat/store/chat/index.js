import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  chats: [],
  openedChats: [],
  currentChatIndex: -1
}

const getters = {
  getChats(state) {
    return state.chats
  },
  getOpenedChats(state) {
    return state.openedChats
  },
  getCurrentChat(state) {
    return state.openedChats[state.currentChatIndex]
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
