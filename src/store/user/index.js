import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  clients: [],
  operators: []
}

const getters = {
  getClients(state) {
    return state.clients
  },
  getOperators(state) {
    return state.operators
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
