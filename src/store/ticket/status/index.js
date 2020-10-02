import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  statuses: []
}

const getters = {
  getStatuses(state) {
    return state.statuses
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
