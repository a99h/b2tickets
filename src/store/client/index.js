import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  clients: []
}

const getters = {
  getClients(state) {
    return state.clients
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
