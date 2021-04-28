import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  ChatRequestCollection: {}
}

const getters = {
  getChatRequests(state) {
    return state.ChatRequestCollection.all()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
