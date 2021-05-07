import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  operators: [],
  settings: {}
}

const getters = {
  getOperators(state) {
    return state.operators
  },
  getSettings(state) {
    return state.settings
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
