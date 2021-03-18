import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  chatRequests: []
}

const getters = {
  getChatRequests(state) {
    return state.chatRequests
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
