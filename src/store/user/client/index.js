import actions from './actions'
import mutations from './mutations'

// state initial values
const state = {
  ClientCollection: {},
  backendErrors: []
}

const getters = {
  getClients(state) {
    return state.ClientCollection.all()
  },
  getBackendErrors(state) {
    return state.backendErrors
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
