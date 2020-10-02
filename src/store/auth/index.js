import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  user: null
}

const getters = {
  getUser(state) {
    return state.user
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
