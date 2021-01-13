import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  chattingUsers: []
}

const getters = {
  getChattingUsers(state) {
    return state.chattingUsers
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
