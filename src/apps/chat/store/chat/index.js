import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  openedChats: [],
  currentChatIndex: -1
}

const getters = {
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
