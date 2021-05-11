import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  ChatCollection: {},
  openedChats: [],
  currentChatIndex: -1,
  backendErrors: null
}

const getters = {
  getChats(state) {
    return state.ChatCollection.all()
  },
  getBackendErrors(state) {
    return state.backendErrors
  },
  getOpenedChats(state) {
    return state.openedChats
  },
  getCurrentChat(state) {
    return state.openedChats[state.currentChatIndex]
  },
  findChatById: (state) => (id) => {
    return state.ChatCollection.find(id)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
